package controllers

import (
	"crypto-app-api/database"
	"crypto-app-api/middlewares"
	"crypto-app-api/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CreateTrade(c *fiber.Ctx) error {
	userID := middlewares.GetUserIDFromContext(c)
	if userID == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
			Success: false,
			Error:   "Unauthorized",
		})
	}

	var req models.TradeRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	// Validate trade type
	if req.Type != "buy" && req.Type != "sell" {
		return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
			Success: false,
			Error:   "Trade type must be 'buy' or 'sell'",
		})
	}

	// Get user
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.ApiResponse{
			Success: false,
			Error:   "User not found",
		})
	}

	// Get coin
	var coin models.Coin
	if err := database.DB.First(&coin, req.CoinID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.ApiResponse{
			Success: false,
			Error:   "Coin not found",
		})
	}

	totalAmount := req.Quantity * req.Price

	// Begin transaction
	tx := database.DB.Begin()

	if req.Type == "buy" {
		// Check if user has enough balance
		if user.Balance < totalAmount {
			return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
				Success: false,
				Error:   "Insufficient balance",
			})
		}

		// Update user balance
		if err := tx.Model(&user).Update("balance", user.Balance-totalAmount).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
				Success: false,
				Error:   "Failed to update balance",
			})
		}

		// Update or create user coin holding
		var userCoin models.UserCoin
		if err := tx.Where("user_id = ? AND coin_id = ?", userID, req.CoinID).First(&userCoin).Error; err != nil {
			// Create new holding
			userCoin = models.UserCoin{
				UserID:       userID,
				CoinID:       req.CoinID,
				Quantity:     req.Quantity,
				AveragePrice: req.Price,
			}
			if err := tx.Create(&userCoin).Error; err != nil {
				tx.Rollback()
				return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
					Success: false,
					Error:   "Failed to create holding",
				})
			}
		} else {
			// Update existing holding
			newQuantity := userCoin.Quantity + req.Quantity
			newAveragePrice := ((userCoin.Quantity * userCoin.AveragePrice) + totalAmount) / newQuantity

			if err := tx.Model(&userCoin).Updates(map[string]interface{}{
				"quantity":      newQuantity,
				"average_price": newAveragePrice,
			}).Error; err != nil {
				tx.Rollback()
				return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
					Success: false,
					Error:   "Failed to update holding",
				})
			}
		}
	} else { // sell
		// Get user coin holding
		var userCoin models.UserCoin
		if err := tx.Where("user_id = ? AND coin_id = ?", userID, req.CoinID).First(&userCoin).Error; err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
				Success: false,
				Error:   "You don't own this coin",
			})
		}

		// Check if user has enough coins
		if userCoin.Quantity < req.Quantity {
			return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
				Success: false,
				Error:   "Insufficient coin quantity",
			})
		}

		// Update user balance
		if err := tx.Model(&user).Update("balance", user.Balance+totalAmount).Error; err != nil {
			tx.Rollback()
			return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
				Success: false,
				Error:   "Failed to update balance",
			})
		}

		// Update user coin holding
		newQuantity := userCoin.Quantity - req.Quantity
		if newQuantity > 0 {
			if err := tx.Model(&userCoin).Update("quantity", newQuantity).Error; err != nil {
				tx.Rollback()
				return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
					Success: false,
					Error:   "Failed to update holding",
				})
			}
		} else {
			// Delete holding if quantity is 0
			if err := tx.Delete(&userCoin).Error; err != nil {
				tx.Rollback()
				return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
					Success: false,
					Error:   "Failed to delete holding",
				})
			}
		}
	}

	// Create trade record
	trade := models.Trade{
		UserID:      userID,
		CoinID:      req.CoinID,
		Type:        req.Type,
		Quantity:    req.Quantity,
		Price:       req.Price,
		TotalAmount: totalAmount,
	}

	if err := tx.Create(&trade).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to create trade",
		})
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to complete trade",
		})
	}

	// Load trade with relations
	database.DB.Preload("Coin").First(&trade, trade.ID)

	return c.Status(fiber.StatusCreated).JSON(models.ApiResponse{
		Success: true,
		Message: "Trade executed successfully",
		Data:    trade,
	})
}

func GetTrades(c *fiber.Ctx) error {
	userID := middlewares.GetUserIDFromContext(c)
	if userID == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
			Success: false,
			Error:   "Unauthorized",
		})
	}

	// Parse query parameters
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	offset := (page - 1) * limit

	var trades []models.Trade
	var total int64

	// Get total count
	database.DB.Model(&models.Trade{}).Where("user_id = ?", userID).Count(&total)

	// Get trades with pagination
	if err := database.DB.Preload("Coin").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Offset(offset).
		Limit(limit).
		Find(&trades).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to fetch trades",
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Data: fiber.Map{
			"trades": trades,
			"pagination": fiber.Map{
				"page":  page,
				"limit": limit,
				"total": total,
				"pages": (total + int64(limit) - 1) / int64(limit),
			},
		},
	})
}

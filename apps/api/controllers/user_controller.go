package controllers

import (
	"crypto-app-api/database"
	"crypto-app-api/middlewares"
	"crypto-app-api/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func GetUserProfile(c *fiber.Ctx) error {
	userID := middlewares.GetUserIDFromContext(c)
	if userID == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
			Success: false,
			Error:   "Unauthorized",
		})
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.ApiResponse{
			Success: false,
			Error:   "User not found",
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Data:    user,
	})
}

func GetUserBalance(c *fiber.Ctx) error {
	userID := middlewares.GetUserIDFromContext(c)
	if userID == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
			Success: false,
			Error:   "Unauthorized",
		})
	}

	var user models.User
	if err := database.DB.Select("balance").First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.ApiResponse{
			Success: false,
			Error:   "User not found",
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Data: fiber.Map{
			"balance": user.Balance,
		},
	})
}

func GetUserHoldings(c *fiber.Ctx) error {
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

	var holdings []models.UserCoin
	var total int64

	// Get total count
	database.DB.Model(&models.UserCoin{}).Where("user_id = ? AND quantity > 0", userID).Count(&total)

	// Get holdings with pagination
	if err := database.DB.Preload("Coin").
		Where("user_id = ? AND quantity > 0", userID).
		Order("quantity * coin.current_price desc").
		Offset(offset).
		Limit(limit).
		Find(&holdings).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to fetch holdings",
		})
	}

	// Calculate total portfolio value
	var portfolioValue float64
	for _, holding := range holdings {
		if holding.Coin.CurrentPrice > 0 {
			portfolioValue += holding.Quantity * holding.Coin.CurrentPrice
		}
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Data: fiber.Map{
			"holdings":        holdings,
			"portfolio_value": portfolioValue,
			"pagination": fiber.Map{
				"page":  page,
				"limit": limit,
				"total": total,
				"pages": (total + int64(limit) - 1) / int64(limit),
			},
		},
	})
}

func GetUserStats(c *fiber.Ctx) error {
	userID := middlewares.GetUserIDFromContext(c)
	if userID == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
			Success: false,
			Error:   "Unauthorized",
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

	// Get total trades count
	var totalTrades int64
	database.DB.Model(&models.Trade{}).Where("user_id = ?", userID).Count(&totalTrades)

	// Get total holdings count
	var totalHoldings int64
	database.DB.Model(&models.UserCoin{}).Where("user_id = ? AND quantity > 0", userID).Count(&totalHoldings)

	// Get watchlist count
	var watchlistCount int64
	database.DB.Model(&models.Watchlist{}).Where("user_id = ?", userID).Count(&watchlistCount)

	// Calculate portfolio value
	var portfolioValue float64
	var holdings []models.UserCoin
	database.DB.Preload("Coin").Where("user_id = ? AND quantity > 0", userID).Find(&holdings)
	for _, holding := range holdings {
		if holding.Coin.CurrentPrice > 0 {
			portfolioValue += holding.Quantity * holding.Coin.CurrentPrice
		}
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Data: fiber.Map{
			"balance":         user.Balance,
			"portfolio_value": portfolioValue,
			"total_value":     user.Balance + portfolioValue,
			"total_trades":    totalTrades,
			"total_holdings":  totalHoldings,
			"watchlist_count": watchlistCount,
		},
	})
}

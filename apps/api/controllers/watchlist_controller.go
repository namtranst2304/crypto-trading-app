package controllers

import (
	"crypto-app-api/database"
	"crypto-app-api/middlewares"
	"crypto-app-api/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func GetWatchlist(c *fiber.Ctx) error {
	userID := middlewares.GetUserIDFromContext(c)
	if userID == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
			Success: false,
			Error:   "Unauthorized",
		})
	}

	var watchlist []models.Watchlist
	if err := database.DB.Preload("Coin").Where("user_id = ?", userID).Find(&watchlist).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to fetch watchlist",
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Data:    watchlist,
	})
}

func AddToWatchlist(c *fiber.Ctx) error {
	userID := middlewares.GetUserIDFromContext(c)
	if userID == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
			Success: false,
			Error:   "Unauthorized",
		})
	}

	var req struct {
		CoinID uint `json:"coin_id"`
	}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	// Check if coin exists
	var coin models.Coin
	if err := database.DB.First(&coin, req.CoinID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.ApiResponse{
			Success: false,
			Error:   "Coin not found",
		})
	}

	// Check if already in watchlist
	var existing models.Watchlist
	if err := database.DB.Where("user_id = ? AND coin_id = ?", userID, req.CoinID).First(&existing).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(models.ApiResponse{
			Success: false,
			Error:   "Coin already in watchlist",
		})
	}

	// Add to watchlist
	watchlist := models.Watchlist{
		UserID: userID,
		CoinID: req.CoinID,
	}

	if err := database.DB.Create(&watchlist).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to add to watchlist",
		})
	}

	// Load with coin data
	database.DB.Preload("Coin").First(&watchlist, watchlist.ID)

	return c.Status(fiber.StatusCreated).JSON(models.ApiResponse{
		Success: true,
		Message: "Added to watchlist successfully",
		Data:    watchlist,
	})
}

func RemoveFromWatchlist(c *fiber.Ctx) error {
	userID := middlewares.GetUserIDFromContext(c)
	if userID == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
			Success: false,
			Error:   "Unauthorized",
		})
	}

	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
			Success: false,
			Error:   "Invalid watchlist ID",
		})
	}

	// Check if watchlist item exists and belongs to user
	var watchlist models.Watchlist
	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&watchlist).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.ApiResponse{
			Success: false,
			Error:   "Watchlist item not found",
		})
	}

	// Remove from watchlist
	if err := database.DB.Delete(&watchlist).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to remove from watchlist",
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Removed from watchlist successfully",
	})
}

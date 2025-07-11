package controllers

import (
	"crypto-app-api/database"
	"crypto-app-api/models"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetCoins(c *fiber.Ctx) error {
	// Parse query parameters
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	sort := c.Query("sort", "market_cap")
	order := c.Query("order", "desc")

	// Validate pagination
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Build query
	query := database.DB.Model(&models.Coin{})

	// Apply sorting
	orderBy := sort + " " + order
	query = query.Order(orderBy)

	// Get total count
	var total int64
	query.Count(&total)

	// Get coins with pagination
	var coins []models.Coin
	if err := query.Offset(offset).Limit(limit).Find(&coins).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to fetch coins",
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Data: fiber.Map{
			"coins": coins,
			"pagination": fiber.Map{
				"page":  page,
				"limit": limit,
				"total": total,
				"pages": (total + int64(limit) - 1) / int64(limit),
			},
		},
	})
}

func GetCoin(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
			Success: false,
			Error:   "Invalid coin ID",
		})
	}

	var coin models.Coin
	if err := database.DB.First(&coin, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.ApiResponse{
			Success: false,
			Error:   "Coin not found",
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Data:    coin,
	})
}

func GetCoinBySymbol(c *fiber.Ctx) error {
	symbol := c.Params("symbol")

	var coin models.Coin
	if err := database.DB.Where("symbol = ?", symbol).First(&coin).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(models.ApiResponse{
			Success: false,
			Error:   "Coin not found",
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Data:    coin,
	})
}

func UpdateCoinPrices(c *fiber.Ctx) error {
	var updates []models.CoinPriceUpdate
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	// Update each coin
	for _, update := range updates {
		if err := database.DB.Model(&models.Coin{}).
			Where("symbol = ?", update.Symbol).
			Updates(map[string]interface{}{
				"current_price":               update.CurrentPrice,
				"market_cap":                  update.MarketCap,
				"volume_24h":                  update.Volume24h,
				"price_change_24h":            update.PriceChange24h,
				"price_change_percentage_24h": update.PriceChangePercentage24h,
				"last_updated":                time.Now(),
			}).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
				Success: false,
				Error:   "Failed to update coin prices",
			})
		}
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Coin prices updated successfully",
	})
}

func GetMarketData(c *fiber.Ctx) error {
	var totalMarketCap int64
	var totalVolume int64
	var coinCount int64

	// Get market statistics
	database.DB.Model(&models.Coin{}).Select("SUM(market_cap)").Scan(&totalMarketCap)
	database.DB.Model(&models.Coin{}).Select("SUM(volume_24h)").Scan(&totalVolume)
	database.DB.Model(&models.Coin{}).Count(&coinCount)

	// Calculate 24h market cap change (simplified)
	marketCapChange := 2.5 // This should be calculated based on historical data

	return c.JSON(models.ApiResponse{
		Success: true,
		Data: fiber.Map{
			"total_market_cap":                 totalMarketCap,
			"total_volume":                     totalVolume,
			"market_cap_change_percentage_24h": marketCapChange,
			"active_cryptocurrencies":          coinCount,
		},
	})
}

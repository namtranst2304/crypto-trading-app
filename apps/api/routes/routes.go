package routes

import (
	"crypto-app-api/controllers"
	"crypto-app-api/middlewares"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	// API group
	api := app.Group("/api")

	// Public routes
	auth := api.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)

	// Coins routes (public)
	coins := api.Group("/coins")
	coins.Get("/", controllers.GetCoins)
	coins.Get("/:id", controllers.GetCoin)
	coins.Get("/symbol/:symbol", controllers.GetCoinBySymbol)
	coins.Post("/prices", controllers.UpdateCoinPrices) // For external price updates
	coins.Get("/market/data", controllers.GetMarketData)

	// Protected routes
	protected := api.Group("/", middlewares.JWTMiddleware())

	// Auth protected routes
	protected.Get("/auth/profile", controllers.GetProfile)

	// User routes
	user := protected.Group("/user")
	user.Get("/profile", controllers.GetUserProfile)
	user.Get("/balance", controllers.GetUserBalance)
	user.Get("/holdings", controllers.GetUserHoldings)
	user.Get("/stats", controllers.GetUserStats)

	// Trading routes
	trades := protected.Group("/trades")
	trades.Post("/", controllers.CreateTrade)
	trades.Get("/", controllers.GetTrades)

	// Watchlist routes
	watchlist := protected.Group("/watchlist")
	watchlist.Get("/", controllers.GetWatchlist)
	watchlist.Post("/", controllers.AddToWatchlist)
	watchlist.Delete("/:id", controllers.RemoveFromWatchlist)
}

package middlewares

import (
	"crypto-app-api/models"
	"crypto-app-api/utils"

	"github.com/gofiber/fiber/v2"
)

func JWTMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
				Success: false,
				Error:   "Authorization header is required",
			})
		}

		// Extract token from header
		tokenString := utils.ExtractTokenFromHeader(authHeader)
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
				Success: false,
				Error:   "Invalid token format",
			})
		}

		// Validate token
		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
				Success: false,
				Error:   "Invalid or expired token",
			})
		}

		// Store user information in context
		c.Locals("user_id", claims.UserID)
		c.Locals("username", claims.Username)
		c.Locals("email", claims.Email)

		return c.Next()
	}
}

func OptionalAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Next()
		}

		// Extract token from header
		tokenString := utils.ExtractTokenFromHeader(authHeader)
		if tokenString == "" {
			return c.Next()
		}

		// Validate token
		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			return c.Next()
		}

		// Store user information in context
		c.Locals("user_id", claims.UserID)
		c.Locals("username", claims.Username)
		c.Locals("email", claims.Email)

		return c.Next()
	}
}

func GetUserIDFromContext(c *fiber.Ctx) uint {
	userID, ok := c.Locals("user_id").(uint)
	if !ok {
		return 0
	}
	return userID
}

func IsAuthenticated(c *fiber.Ctx) bool {
	return c.Locals("user_id") != nil
}

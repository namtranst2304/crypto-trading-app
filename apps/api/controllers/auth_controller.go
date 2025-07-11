package controllers

import (
	"crypto-app-api/database"
	"crypto-app-api/models"
	"crypto-app-api/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *fiber.Ctx) error {
	var req models.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	// Validate input
	if req.Username == "" || req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
			Success: false,
			Error:   "Username, email, and password are required",
		})
	}

	if len(req.Password) < 6 {
		return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
			Success: false,
			Error:   "Password must be at least 6 characters long",
		})
	}

	// Check if user already exists
	var existingUser models.User
	if err := database.DB.Where("email = ? OR username = ?", req.Email, req.Username).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(models.ApiResponse{
			Success: false,
			Error:   "User with this email or username already exists",
		})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to hash password",
		})
	}

	// Create user
	user := models.User{
		Username: req.Username,
		Email:    strings.ToLower(req.Email),
		Password: string(hashedPassword),
		Balance:  10000.0, // Starting balance
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to create user",
		})
	}

	// Generate token
	token, err := utils.GenerateToken(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to generate token",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(models.ApiResponse{
		Success: true,
		Message: "User registered successfully",
		Data: models.AuthResponse{
			Token: token,
			User:  user,
		},
	})
}

func Login(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	// Validate input
	if req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.ApiResponse{
			Success: false,
			Error:   "Email and password are required",
		})
	}

	// Find user
	var user models.User
	if err := database.DB.Where("email = ?", strings.ToLower(req.Email)).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
			Success: false,
			Error:   "Invalid credentials",
		})
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(models.ApiResponse{
			Success: false,
			Error:   "Invalid credentials",
		})
	}

	// Generate token
	token, err := utils.GenerateToken(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(models.ApiResponse{
			Success: false,
			Error:   "Failed to generate token",
		})
	}

	return c.JSON(models.ApiResponse{
		Success: true,
		Message: "Login successful",
		Data: models.AuthResponse{
			Token: token,
			User:  user,
		},
	})
}

func GetProfile(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uint)

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

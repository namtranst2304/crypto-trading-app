package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL string
	JWTSecret   string
	Port        string
	Host        string
	Environment string
}

var AppConfig Config

func LoadConfig() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using environment variables")
	}

	AppConfig = Config{
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/crypto_app?sslmode=disable"),
		JWTSecret:   getEnv("JWT_SECRET", "your-super-secret-jwt-key"),
		Port:        getEnv("PORT", "8080"),
		Host:        getEnv("HOST", "localhost"),
		Environment: getEnv("GO_ENV", "development"),
	}

	log.Printf("Configuration loaded: Environment=%s, Port=%s", AppConfig.Environment, AppConfig.Port)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

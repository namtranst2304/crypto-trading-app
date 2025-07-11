package database

import (
	"crypto-app-api/config"
	"crypto-app-api/models"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB() {
	var err error

	// Configure GORM logger
	logLevel := logger.Silent
	if config.AppConfig.Environment == "development" {
		logLevel = logger.Info
	}

	DB, err = gorm.Open(postgres.Open(config.AppConfig.DatabaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Database connected successfully")

	// Auto migrate the schema
	err = DB.AutoMigrate(
		&models.User{},
		&models.Coin{},
		&models.UserCoin{},
		&models.Trade{},
		&models.Watchlist{},
	)

	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database migrated successfully")
}

func GetDB() *gorm.DB {
	return DB
}

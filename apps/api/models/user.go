package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"unique;not null"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Password  string    `json:"-" gorm:"not null"`
	Balance   float64   `json:"balance" gorm:"default:10000.00"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Relations
	UserCoins []UserCoin  `json:"user_coins,omitempty" gorm:"foreignKey:UserID"`
	Trades    []Trade     `json:"trades,omitempty" gorm:"foreignKey:UserID"`
	Watchlist []Watchlist `json:"watchlist,omitempty" gorm:"foreignKey:UserID"`
}

type Coin struct {
	ID                       uint      `json:"id" gorm:"primaryKey"`
	Symbol                   string    `json:"symbol" gorm:"unique;not null"`
	Name                     string    `json:"name" gorm:"not null"`
	CurrentPrice             float64   `json:"current_price" gorm:"not null"`
	MarketCap                int64     `json:"market_cap"`
	Volume24h                int64     `json:"volume_24h"`
	PriceChange24h           float64   `json:"price_change_24h"`
	PriceChangePercentage24h float64   `json:"price_change_percentage_24h"`
	LastUpdated              time.Time `json:"last_updated"`
	CreatedAt                time.Time `json:"created_at"`

	// Relations
	UserCoins []UserCoin  `json:"user_coins,omitempty" gorm:"foreignKey:CoinID"`
	Trades    []Trade     `json:"trades,omitempty" gorm:"foreignKey:CoinID"`
	Watchlist []Watchlist `json:"watchlist,omitempty" gorm:"foreignKey:CoinID"`
}

type UserCoin struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	UserID       uint      `json:"user_id" gorm:"not null"`
	CoinID       uint      `json:"coin_id" gorm:"not null"`
	Quantity     float64   `json:"quantity" gorm:"default:0"`
	AveragePrice float64   `json:"average_price" gorm:"default:0"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`

	// Relations
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Coin Coin `json:"coin,omitempty" gorm:"foreignKey:CoinID"`
}

type Trade struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"user_id" gorm:"not null"`
	CoinID      uint      `json:"coin_id" gorm:"not null"`
	Type        string    `json:"type" gorm:"not null;check:type IN ('buy', 'sell')"`
	Quantity    float64   `json:"quantity" gorm:"not null"`
	Price       float64   `json:"price" gorm:"not null"`
	TotalAmount float64   `json:"total_amount" gorm:"not null"`
	CreatedAt   time.Time `json:"created_at"`

	// Relations
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Coin Coin `json:"coin,omitempty" gorm:"foreignKey:CoinID"`
}

type Watchlist struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	CoinID    uint      `json:"coin_id" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`

	// Relations
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Coin Coin `json:"coin,omitempty" gorm:"foreignKey:CoinID"`
}

// Table names
func (User) TableName() string {
	return "users"
}

func (Coin) TableName() string {
	return "coins"
}

func (UserCoin) TableName() string {
	return "user_coins"
}

func (Trade) TableName() string {
	return "trades"
}

func (Watchlist) TableName() string {
	return "watchlists"
}

// Hooks
func (u *User) BeforeCreate(tx *gorm.DB) error {
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
	return nil
}

func (u *User) BeforeUpdate(tx *gorm.DB) error {
	u.UpdatedAt = time.Now()
	return nil
}

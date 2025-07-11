package models

// Request/Response DTOs
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type RegisterRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type TradeRequest struct {
	CoinID   uint    `json:"coin_id" validate:"required"`
	Type     string  `json:"type" validate:"required,oneof=buy sell"`
	Quantity float64 `json:"quantity" validate:"required,gt=0"`
	Price    float64 `json:"price" validate:"required,gt=0"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type ApiResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type PaginationQuery struct {
	Page  int    `query:"page"`
	Limit int    `query:"limit"`
	Sort  string `query:"sort"`
	Order string `query:"order"`
}

type CoinPriceUpdate struct {
	Symbol                   string  `json:"symbol"`
	CurrentPrice             float64 `json:"current_price"`
	MarketCap                int64   `json:"market_cap"`
	Volume24h                int64   `json:"volume_24h"`
	PriceChange24h           float64 `json:"price_change_24h"`
	PriceChangePercentage24h float64 `json:"price_change_percentage_24h"`
}

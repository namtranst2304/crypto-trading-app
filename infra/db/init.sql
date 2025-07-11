-- Create database if not exists
CREATE DATABASE IF NOT EXISTS crypto_app;

-- Use the database
\c crypto_app;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(20,8) DEFAULT 10000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create coins table
CREATE TABLE IF NOT EXISTS coins (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    current_price DECIMAL(20,8) NOT NULL,
    market_cap BIGINT,
    volume_24h BIGINT,
    price_change_24h DECIMAL(10,4),
    price_change_percentage_24h DECIMAL(10,4),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_coins table (holdings)
CREATE TABLE IF NOT EXISTS user_coins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    coin_id INTEGER REFERENCES coins(id) ON DELETE CASCADE,
    quantity DECIMAL(20,8) NOT NULL DEFAULT 0,
    average_price DECIMAL(20,8) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, coin_id)
);

-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    coin_id INTEGER REFERENCES coins(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell')),
    quantity DECIMAL(20,8) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    total_amount DECIMAL(20,8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create watchlists table
CREATE TABLE IF NOT EXISTS watchlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    coin_id INTEGER REFERENCES coins(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, coin_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_coins_symbol ON coins(symbol);
CREATE INDEX IF NOT EXISTS idx_user_coins_user_id ON user_coins(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at);
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);

-- Insert sample coins
INSERT INTO coins (symbol, name, current_price, market_cap, volume_24h, price_change_24h, price_change_percentage_24h) 
VALUES 
    ('BTC', 'Bitcoin', 45000.00, 850000000000, 25000000000, 1200.50, 2.74),
    ('ETH', 'Ethereum', 2800.00, 340000000000, 15000000000, -85.25, -2.95),
    ('BNB', 'Binance Coin', 320.00, 52000000000, 1800000000, 15.75, 5.18),
    ('ADA', 'Cardano', 0.45, 15000000000, 850000000, 0.02, 4.65),
    ('DOT', 'Polkadot', 6.80, 8500000000, 420000000, -0.15, -2.16),
    ('XRP', 'XRP', 0.58, 29000000000, 1200000000, 0.03, 5.45),
    ('LINK', 'Chainlink', 14.50, 8200000000, 680000000, 0.85, 6.23),
    ('LTC', 'Litecoin', 95.00, 7000000000, 2100000000, 2.50, 2.70),
    ('SOL', 'Solana', 110.00, 48000000000, 1900000000, 5.20, 4.96),
    ('MATIC', 'Polygon', 0.85, 8300000000, 450000000, 0.04, 4.92)
ON CONFLICT (symbol) DO UPDATE SET
    current_price = EXCLUDED.current_price,
    market_cap = EXCLUDED.market_cap,
    volume_24h = EXCLUDED.volume_24h,
    price_change_24h = EXCLUDED.price_change_24h,
    price_change_percentage_24h = EXCLUDED.price_change_percentage_24h,
    last_updated = CURRENT_TIMESTAMP;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
  },
  COINS: {
    LIST: `${API_BASE_URL}/api/coins`,
    DETAIL: (id: number) => `${API_BASE_URL}/api/coins/${id}`,
    SYMBOL: (symbol: string) => `${API_BASE_URL}/api/coins/symbol/${symbol}`,
    MARKET_DATA: `${API_BASE_URL}/api/coins/market/data`,
  },
  TRADES: {
    LIST: `${API_BASE_URL}/api/trades`,
    CREATE: `${API_BASE_URL}/api/trades`,
  },
  WATCHLIST: {
    LIST: `${API_BASE_URL}/api/watchlist`,
    ADD: `${API_BASE_URL}/api/watchlist`,
    REMOVE: (id: number) => `${API_BASE_URL}/api/watchlist/${id}`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/api/user/profile`,
    BALANCE: `${API_BASE_URL}/api/user/balance`,
    HOLDINGS: `${API_BASE_URL}/api/user/holdings`,
    STATS: `${API_BASE_URL}/api/user/stats`,
  },
} as const;

export const APP_CONFIG = {
  APP_NAME: 'Crypto Trading App',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@cryptoapp.com',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  WATCHLIST: 'watchlist',
} as const;

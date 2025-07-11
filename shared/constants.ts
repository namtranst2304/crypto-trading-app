export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  COINS: {
    LIST: '/coins',
    DETAIL: (id: number) => `/coins/${id}`,
    PRICES: '/coins/prices',
  },
  TRADES: {
    LIST: '/trades',
    CREATE: '/trades',
    HISTORY: '/trades/history',
  },
  WATCHLIST: {
    LIST: '/watchlist',
    ADD: '/watchlist',
    REMOVE: (id: number) => `/watchlist/${id}`,
  },
  USER: {
    PROFILE: '/user/profile',
    BALANCE: '/user/balance',
    HOLDINGS: '/user/holdings',
  },
} as const;

export const TRADING_FEES = {
  MAKER: 0.001, // 0.1%
  TAKER: 0.0015, // 0.15%
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const COIN_SYMBOLS = [
  'BTC',
  'ETH',
  'BNB',
  'ADA',
  'DOT',
  'XRP',
  'LINK',
  'LTC',
  'SOL',
  'MATIC',
] as const;

export const TRADE_TYPES = {
  BUY: 'buy',
  SELL: 'sell',
} as const;

export const ORDER_TYPES = {
  MARKET: 'market',
  LIMIT: 'limit',
} as const;

export const CHART_INTERVALS = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '4h': '4h',
  '1d': '1d',
  '1w': '1w',
} as const;

export const RESPONSE_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
} as const;

export interface User {
  id: number;
  username: string;
  email: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Coin {
  id: number;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  volume_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  last_updated: string;
  created_at: string;
}

export interface UserCoin {
  id: number;
  user_id: number;
  coin_id: number;
  quantity: number;
  average_price: number;
  created_at: string;
  updated_at: string;
  coin?: Coin;
}

export interface Trade {
  id: number;
  user_id: number;
  coin_id: number;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total_amount: number;
  created_at: string;
  coin?: Coin;
}

export interface Watchlist {
  id: number;
  user_id: number;
  coin_id: number;
  created_at: string;
  coin?: Coin;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface TradeRequest {
  coin_id: number;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface MarketData {
  total_market_cap: number;
  total_volume: number;
  market_cap_change_percentage_24h: number;
  active_cryptocurrencies: number;
}

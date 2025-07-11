import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config';
import { Coin, MarketData, ApiResponse, PaginationParams } from '@/types';

export const coinService = {
  async getCoins(params?: PaginationParams): Promise<{ coins: Coin[], pagination: any }> {
    const response = await apiClient.get<ApiResponse<{ coins: Coin[], pagination: any }>>(
      API_ENDPOINTS.COINS.LIST,
      { params }
    );
    return response.data.data!;
  },

  async getCoin(id: number): Promise<Coin> {
    const response = await apiClient.get<ApiResponse<Coin>>(
      API_ENDPOINTS.COINS.DETAIL(id)
    );
    return response.data.data!;
  },

  async getCoinBySymbol(symbol: string): Promise<Coin> {
    const response = await apiClient.get<ApiResponse<Coin>>(
      API_ENDPOINTS.COINS.SYMBOL(symbol)
    );
    return response.data.data!;
  },

  async getMarketData(): Promise<MarketData> {
    const response = await apiClient.get<ApiResponse<MarketData>>(
      API_ENDPOINTS.COINS.MARKET_DATA
    );
    return response.data.data!;
  },
};

import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config';
import { Watchlist, ApiResponse } from '@/types';

export const watchlistService = {
  async getWatchlist(): Promise<Watchlist[]> {
    const response = await apiClient.get<ApiResponse<Watchlist[]>>(
      API_ENDPOINTS.WATCHLIST.LIST
    );
    return response.data.data!;
  },

  async addToWatchlist(coinId: number): Promise<Watchlist> {
    const response = await apiClient.post<ApiResponse<Watchlist>>(
      API_ENDPOINTS.WATCHLIST.ADD,
      { coin_id: coinId }
    );
    return response.data.data!;
  },

  async removeFromWatchlist(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.WATCHLIST.REMOVE(id));
  },
};

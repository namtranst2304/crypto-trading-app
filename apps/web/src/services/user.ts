import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config';
import { User, UserCoin, UserStats, ApiResponse } from '@/types';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USER.PROFILE
    );
    return response.data.data!;
  },

  async getBalance(): Promise<{ balance: number }> {
    const response = await apiClient.get<ApiResponse<{ balance: number }>>(
      API_ENDPOINTS.USER.BALANCE
    );
    return response.data.data!;
  },

  async getHoldings(): Promise<{ holdings: UserCoin[], portfolio_value: number }> {
    const response = await apiClient.get<ApiResponse<{ holdings: UserCoin[], portfolio_value: number }>>(
      API_ENDPOINTS.USER.HOLDINGS
    );
    return response.data.data!;
  },

  async getStats(): Promise<UserStats> {
    const response = await apiClient.get<ApiResponse<UserStats>>(
      API_ENDPOINTS.USER.STATS
    );
    return response.data.data!;
  },
};

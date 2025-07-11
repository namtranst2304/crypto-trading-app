import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config';
import { Trade, TradeRequest, ApiResponse, PaginationParams } from '@/types';

export const tradeService = {
  async createTrade(tradeData: TradeRequest): Promise<Trade> {
    const response = await apiClient.post<ApiResponse<Trade>>(
      API_ENDPOINTS.TRADES.CREATE,
      tradeData
    );
    return response.data.data!;
  },

  async getTrades(params?: PaginationParams): Promise<{ trades: Trade[], pagination: any }> {
    const response = await apiClient.get<ApiResponse<{ trades: Trade[], pagination: any }>>(
      API_ENDPOINTS.TRADES.LIST,
      { params }
    );
    return response.data.data!;
  },
};

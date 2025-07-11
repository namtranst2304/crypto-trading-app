import { useState, useEffect } from 'react';
import { tradeService } from '@/services/trades';
import { Trade, TradeRequest, PaginationParams } from '@/types';

export const useTrades = (params?: PaginationParams) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tradeService.getTrades(params);
      setTrades(response.trades);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [params?.page, params?.limit]);

  const createTrade = async (tradeData: TradeRequest) => {
    try {
      const newTrade = await tradeService.createTrade(tradeData);
      setTrades(prev => [newTrade, ...prev]);
      return newTrade;
    } catch (err) {
      throw err;
    }
  };

  const refetch = () => {
    fetchTrades();
  };

  return {
    trades,
    loading,
    error,
    pagination,
    createTrade,
    refetch,
  };
};

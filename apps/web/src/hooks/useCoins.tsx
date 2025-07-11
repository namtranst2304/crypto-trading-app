import { useState, useEffect } from 'react';
import { coinService } from '@/services/coins';
import { Coin, PaginationParams } from '@/types';

export const useCoins = (params?: PaginationParams) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await coinService.getCoins(params);
      setCoins(response.coins);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch coins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, [params?.page, params?.limit, params?.sort, params?.order]);

  const refetch = () => {
    fetchCoins();
  };

  return {
    coins,
    loading,
    error,
    pagination,
    refetch,
  };
};

export const useCoin = (id: number) => {
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await coinService.getCoin(id);
        setCoin(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch coin');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCoin();
    }
  }, [id]);

  return {
    coin,
    loading,
    error,
  };
};

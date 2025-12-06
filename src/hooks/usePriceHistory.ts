/**
 * usePriceHistory Hook
 * 
 * Fetches and manages price history data for a product.
 */

import { useState, useEffect, useCallback } from 'react';
import { getPriceHistory, getPriceStatistics } from '../services/priceHistory.service';
import type { IPricePoint } from '../types';

export interface PriceStats {
  current: number;
  lowest: number;
  highest: number;
  average: number;
}

export interface UsePriceHistoryResult {
  priceHistory: IPricePoint[];
  statistics: PriceStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePriceHistory(productId: string | null): UsePriceHistoryResult {
  const [priceHistory, setPriceHistory] = useState<IPricePoint[]>([]);
  const [statistics, setStatistics] = useState<PriceStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!productId) {
      setPriceHistory([]);
      setStatistics(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [history, stats] = await Promise.all([
        getPriceHistory(productId),
        getPriceStatistics(productId),
      ]);

      setPriceHistory(history);
      setStatistics(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price history');
      setPriceHistory([]);
      setStatistics(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    priceHistory,
    statistics,
    isLoading,
    error,
    refetch: fetchData,
  };
}

export default usePriceHistory;

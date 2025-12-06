/**
 * useProducts Hook
 * 
 * Fetches and manages product data with filtering support.
 */

import { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories, type GetProductsParams } from '../services/products.service';
import type { IProduct, IFilterState } from '../types';
import { useDebounce } from './useDebounce';

export interface UseProductsOptions {
  initialFilters?: Partial<IFilterState>;
  debounceMs?: number;
  autoFetch?: boolean;
}

export interface UseProductsResult {
  products: IProduct[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  total: number;
  filters: Partial<IFilterState>;
  setFilters: (filters: Partial<IFilterState>) => void;
  updateFilter: <K extends keyof IFilterState>(key: K, value: IFilterState[K]) => void;
  refetch: () => Promise<void>;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { initialFilters = {}, debounceMs = 300, autoFetch = true } = options;

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Partial<IFilterState>>(initialFilters);

  // Debounce search query to avoid too many requests
  const debouncedQuery = useDebounce(filters.query || '', debounceMs);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: GetProductsParams = {
        filters: { ...filters, query: debouncedQuery },
      };

      const result = await getProducts(params);
      setProducts(result.products);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedQuery]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Update a single filter
  const updateFilter = useCallback(<K extends keyof IFilterState>(
    key: K,
    value: IFilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    products,
    categories,
    isLoading,
    error,
    total,
    filters,
    setFilters,
    updateFilter,
    refetch: fetchProducts,
  };
}

export default useProducts;

/**
 * useFavorites Hook
 * 
 * Manages user favorites with Supabase sync.
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getFavoriteIds, 
  getFavoriteProducts,
  addToFavorites as addFav,
  removeFromFavorites as removeFav,
} from '../services/favorites.service';
import type { IProduct } from '../types';
import { useLocalStorage } from './useLocalStorage';

export interface UseFavoritesResult {
  favoriteIds: string[];
  favoriteProducts: IProduct[];
  isLoading: boolean;
  error: string | null;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useFavorites(userId: string | null): UseFavoritesResult {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local storage fallback for non-authenticated users
  const [localFavorites, setLocalFavorites] = useLocalStorage<string[]>('favorites', []);

  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setFavoriteIds(localFavorites);
      setFavoriteProducts([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [ids, products] = await Promise.all([
        getFavoriteIds(userId),
        getFavoriteProducts(userId),
      ]);

      setFavoriteIds(ids);
      setFavoriteProducts(products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    } finally {
      setIsLoading(false);
    }
  }, [userId, localFavorites]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback((productId: string): boolean => {
    return favoriteIds.includes(productId);
  }, [favoriteIds]);

  const addToFavorites = useCallback(async (productId: string) => {
    if (userId) {
      await addFav(userId, productId);
      setFavoriteIds(prev => [...prev, productId]);
    } else {
      setLocalFavorites(prev => [...prev, productId]);
      setFavoriteIds(prev => [...prev, productId]);
    }
  }, [userId, setLocalFavorites]);

  const removeFromFavorites = useCallback(async (productId: string) => {
    if (userId) {
      await removeFav(userId, productId);
      setFavoriteIds(prev => prev.filter(id => id !== productId));
      setFavoriteProducts(prev => prev.filter(p => p._id !== productId));
    } else {
      setLocalFavorites(prev => prev.filter(id => id !== productId));
      setFavoriteIds(prev => prev.filter(id => id !== productId));
    }
  }, [userId, setLocalFavorites]);

  const toggleFavorite = useCallback(async (productId: string) => {
    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  }, [isFavorite, addToFavorites, removeFromFavorites]);

  return {
    favoriteIds,
    favoriteProducts,
    isLoading,
    error,
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    refetch: fetchFavorites,
  };
}

export default useFavorites;

/**
 * Favorites Provider
 * 
 * Manages favorites state with optional Supabase sync.
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { useFavorites, type UseFavoritesResult } from '../hooks/useFavorites';
import { useAuth } from './AuthProvider';

const FavoritesContext = createContext<UseFavoritesResult | null>(null);

export interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { user } = useAuth();
  const favorites = useFavorites(user?._id || null);

  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext(): UseFavoritesResult {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
}

export default FavoritesProvider;

"use client";

import React, { createContext, useContext, useState, ReactNode, PropsWithChildren, useEffect } from 'react';
import { IUser } from '../types';

interface AuthContextType {
  user: IUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isMounted: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleFavorite: (productId: string) => Promise<void>;
}

// Default context value for SSR safety
const defaultContextValue: AuthContextType = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  isMounted: false,
  login: async () => {},
  logout: () => {},
  toggleFavorite: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Track when component is mounted (client-side)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      // Demo mode - create a local demo user
      const demoUser: IUser = {
        id: 'demo-user-123',
        _id: 'demo-user-123',
        email: email || 'demo@example.com',
        displayName: 'Demo User',
        defaultCountry: 'US',
        defaultCurrency: 'USD',
        favorites: [],
        createdAt: new Date().toISOString(),
      };
      setUser(demoUser);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) return;
    try {
      // Toggle favorite locally
      const isFavorite = user.favorites.includes(productId);
      const updatedFavorites = isFavorite
        ? user.favorites.filter(id => id !== productId)
        : [...user.favorites, productId];
      setUser({ ...user, favorites: updatedFavorites });
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, isMounted, login, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Return safe defaults instead of throwing - allows SSR to work
  return context;
};
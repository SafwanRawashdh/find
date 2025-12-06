import React, { createContext, useContext, useState, ReactNode, PropsWithChildren } from 'react';
import { IUser } from '../types';
import { supabaseProductService } from '../services/supabaseService';

interface AuthContextType {
  user: IUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleFavorite: (productId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      // Demo mode - create a local demo user
      const demoUser: IUser = {
        _id: 'demo-user-123',
        email: email || 'demo@example.com',
        displayName: 'Demo User',
        defaultCountry: 'US',
        defaultCurrency: 'USD',
        favorites: [],
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
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
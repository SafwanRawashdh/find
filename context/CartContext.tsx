"use client";

import React, { createContext, useContext, useState, ReactNode, PropsWithChildren, useEffect } from 'react';
import { IProduct } from '../types';

interface CartItem {
  product: IProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemsByMarketplace: (marketplace: string) => CartItem[];
}

// Default context value for SSR safety
const defaultContextValue: CartContextType = {
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
  getItemsByMarketplace: () => [],
};

const CartContext = createContext<CartContextType>(defaultContextValue);

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('find_cart');
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('find_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: IProduct, quantity: number = 1) => {
    const productId = product.id || product._id || '';
    setItems(prev => {
      const existing = prev.find(item => (item.product.id || item.product._id) === productId);
      if (existing) {
        return prev.map(item =>
          (item.product.id || item.product._id) === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => (item.product.id || item.product._id) !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        (item.product.id || item.product._id) === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getItemsByMarketplace = (marketplace: string) => {
    return items.filter(item => item.product.marketplace === marketplace);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getItemsByMarketplace,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  // Return context (with safe defaults if outside provider during SSR)
  return context;
};


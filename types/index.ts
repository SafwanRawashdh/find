// ============================================
// Core Types for FIND Application
// ============================================

import type { ReactNode } from "react";

export type Marketplace = "amazon" | "ebay";

export type ProductCondition = "new" | "used" | "refurbished";

export interface PriceHistoryEntry {
  date: string;
  price: number;
}

export interface Product {
  id: string;
  /** @deprecated Use id instead */
  _id?: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  images?: string[];
  marketplace: Marketplace;
  productUrl: string;
  rating: number;
  ratingCount: number;
  condition: ProductCondition;
  category?: string;
  shippingEstimate: string;
  shippingCost?: number;
  seller?: string;
  priceHistory?: PriceHistoryEntry[];
  isBestDeal?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backward compatibility
  shipsTo?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface PriceAlert {
  id: string;
  productId: string;
  product: Product;
  targetPrice: number;
  createdAt: string;
  isActive: boolean;
  lastChecked?: string;
  triggered?: boolean;
  triggeredAt?: string;
}

export interface User {
  id: string;
  /** @deprecated Use id instead */
  _id?: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  favorites: string[];
  createdAt: string;
  // Legacy fields
  defaultCountry?: string;
  defaultCurrency?: string;
  preferences?: Record<string, unknown>;
}

export interface FilterState {
  query: string;
  minPrice?: number | "";
  maxPrice?: number | "";
  marketplaces: {
    amazon: boolean;
    ebay: boolean;
  };
  // Legacy alias for marketplaces
  sources?: {
    amazon?: boolean;
    ebay?: boolean;
    AMAZON?: boolean;
    EBAY?: boolean;
  };
  condition: ProductCondition | "all";
  category: string;
  sortBy: "price_asc" | "price_desc" | "rating_desc" | "newest" | "shipping_asc";
  // Legacy fields
  shippingCountry?: string;
  currency?: string;
}

// Navigation types
export type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: number;
};

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// ============================================
// Legacy Type Aliases (for backward compatibility)
// ============================================

/** @deprecated Use Product instead */
export type IProduct = Product;

/** @deprecated Use FilterState instead */
export type IFilterState = FilterState;

/** @deprecated Use User instead */
export type IUser = User;

/** @deprecated Use PriceHistoryEntry instead */
export type IPricePoint = PriceHistoryEntry;

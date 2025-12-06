import { IProduct, IUser, IFilterState } from '../types';

// Points to the Go server created in server/main.go
const API_URL = 'http://localhost:8080/api';

export const authService = {
  login: async (email: string): Promise<{ user: IUser; token: string }> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Auth Service Login Error:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST' });
    } catch (error) {
      console.error("Auth Service Logout Error:", error);
    }
  }
};

export const productService = {
  search: async (filters: IFilterState): Promise<IProduct[]> => {
    try {
      const params = new URLSearchParams();

      // Basic Filters
      if (filters.query) params.append('q', filters.query);
      if (filters.minPrice !== '') params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== '') params.append('maxPrice', filters.maxPrice.toString());
      
      // Sources: Convert object { AMAZON: true, EBAY: false } to comma-separated string "AMAZON"
      const activeSources = Object.entries(filters.sources)
        .filter(([_, isActive]) => isActive)
        .map(([source]) => source)
        .join(',');
      
      if (activeSources) params.append('sources', activeSources);

      // Advanced Filters
      if (filters.sortBy) params.append('sort', filters.sortBy);
      if (filters.condition && filters.condition !== 'all') params.append('condition', filters.condition);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.shippingCountry) params.append('country', filters.shippingCountry);
      if (filters.currency) params.append('currency', filters.currency);

      const response = await fetch(`${API_URL}/products?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Product Service Search Error:", error);
      // Fallback to empty array to prevent UI crash
      return [];
    }
  },
  
  getProductsByIds: async (ids: string[]): Promise<IProduct[]> => {
    try {
      const response = await fetch(`${API_URL}/products/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error(`Batch fetch failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Product Service Batch Error:", error);
      return [];
    }
  }
};

export const favoritesService = {
  toggle: async (userId: string, productId: string): Promise<string[]> => {
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        throw new Error(`Favorite toggle failed with status: ${response.status}`);
      }

      // Returns the updated array of favorite IDs
      return await response.json();
    } catch (error) {
      console.error("Favorites Service Toggle Error:", error);
      throw error;
    }
  }
};
// Domain Entities mimicking Mongoose Schemas

export enum Marketplace {
  AMAZON = 'AMAZON',
  EBAY = 'EBAY',
}

export interface IPricePoint {
  date: string;
  price: number;
}

export interface IUser {
  _id: string;
  email: string;
  displayName: string;
  defaultCountry: string;
  defaultCurrency: string;
  preferences?: Record<string, any>;
  favorites: string[];
}

export interface IProduct {
  _id: string;
  marketplace: Marketplace;
  title: string;
  imageUrl: string;
  price: number;
  currency: string;
  rating: number;
  ratingCount: number;
  shippingEstimate: string;
  condition: 'new' | 'used';
  shipsTo: string[];
  productUrl?: string; // External link
  description?: string;
  category: string;
  priceHistory: IPricePoint[];
}

export interface IFilterState {
  // Basic
  query: string;
  minPrice: number | '';
  maxPrice: number | '';
  sources: {
    [Marketplace.AMAZON]: boolean;
    [Marketplace.EBAY]: boolean;
  };
  sortBy: 'price_asc' | 'rating_desc' | 'shipping_asc';
  
  // Advanced
  shippingCountry: string;
  condition: 'all' | 'new' | 'used';
  currency: string;
  category: string;
}

export interface IFilterPreset {
  _id: string;
  name: string;
  filterState: Partial<IFilterState>;
}
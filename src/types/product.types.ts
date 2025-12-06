/**
 * Product-related type definitions
 */

export enum Marketplace {
  AMAZON = 'AMAZON',
  EBAY = 'EBAY',
}

export type ProductCondition = 'new' | 'used';

export interface IPricePoint {
  date: string;
  price: number;
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
  condition: ProductCondition;
  shipsTo: string[];
  productUrl?: string;
  description?: string;
  category: string;
  priceHistory: IPricePoint[];
}

export type ProductCategory = 
  | 'Electronics'
  | 'Computers'
  | 'Toys'
  | 'Books'
  | 'Home';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Computers',
  'Toys',
  'Books',
  'Home',
];

/**
 * Filter and search-related type definitions
 */

import { Marketplace, ProductCondition } from './product.types';

export type SortOption = 'price_asc' | 'rating_desc' | 'shipping_asc';

export interface IFilterState {
  query: string;
  minPrice: number | '';
  maxPrice: number | '';
  sources: Record<Marketplace, boolean>;
  sortBy: SortOption;
  shippingCountry: string;
  condition: 'all' | ProductCondition;
  currency: string;
  category: string;
}

export interface IFilterPreset {
  _id: string;
  name: string;
  filterState: Partial<IFilterState>;
}

export const DEFAULT_FILTER_STATE: IFilterState = {
  query: '',
  minPrice: '',
  maxPrice: '',
  sources: {
    [Marketplace.AMAZON]: true,
    [Marketplace.EBAY]: true,
  },
  sortBy: 'rating_desc',
  shippingCountry: 'US',
  condition: 'all',
  currency: 'USD',
  category: 'all',
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'shipping_asc', label: 'Fastest Shipping' },
];

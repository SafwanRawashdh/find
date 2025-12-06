/**
 * Products Service
 * 
 * Handles all product-related data operations with Supabase.
 */

import { supabase } from '../lib/supabase';
import type { IProduct, Marketplace, IFilterState, IPricePoint } from '../types';

// Database row type
interface DbProduct {
  id: string;
  marketplace: 'AMAZON' | 'EBAY';
  title: string;
  image_url: string;
  price: number;
  currency: string;
  rating: number;
  rating_count: number;
  shipping_estimate: string;
  condition: 'new' | 'used';
  ships_to: string[];
  product_url: string | null;
  description: string | null;
  category: string;
}

// Map database row to application product type
function mapDbProductToProduct(row: DbProduct, priceHistory: IPricePoint[] = []): IProduct {
  return {
    _id: row.id,
    marketplace: row.marketplace as Marketplace,
    title: row.title,
    imageUrl: row.image_url,
    price: row.price,
    currency: row.currency,
    rating: row.rating,
    ratingCount: row.rating_count,
    shippingEstimate: row.shipping_estimate,
    condition: row.condition,
    shipsTo: row.ships_to,
    productUrl: row.product_url || undefined,
    description: row.description || undefined,
    category: row.category,
    priceHistory,
  };
}

export interface GetProductsParams {
  filters?: Partial<IFilterState>;
  limit?: number;
  offset?: number;
}

export interface GetProductsResult {
  products: IProduct[];
  total: number;
}

/**
 * Fetch products with optional filtering and pagination
 */
export async function getProducts(params: GetProductsParams = {}): Promise<GetProductsResult> {
  const { filters, limit = 50, offset = 0 } = params;

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' });

  // Apply filters
  if (filters) {
    // Search query
    if (filters.query) {
      query = query.ilike('title', `%${filters.query}%`);
    }

    // Price range
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      query = query.lte('price', filters.maxPrice);
    }

    // Condition filter
    if (filters.condition && filters.condition !== 'all') {
      query = query.eq('condition', filters.condition);
    }

    // Marketplace filter (sources)
    if (filters.sources) {
      const enabledMarketplaces = Object.entries(filters.sources)
        .filter(([_, enabled]) => enabled)
        .map(([marketplace]) => marketplace);
      
      if (enabledMarketplaces.length > 0 && enabledMarketplaces.length < 2) {
        query = query.in('marketplace', enabledMarketplaces);
      }
    }

    // Category filter
    if (filters.category && filters.category !== '' && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
  }

  // Sorting
  const sortBy = filters?.sortBy || 'rating_desc';
  switch (sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'rating_desc':
      query = query.order('rating', { ascending: false });
      break;
    case 'shipping_asc':
      query = query.order('shipping_estimate', { ascending: true });
      break;
    default:
      query = query.order('rating', { ascending: false });
  }

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return {
    products: ((data || []) as DbProduct[]).map(row => mapDbProductToProduct(row)),
    total: count || 0,
  };
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string): Promise<IProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching product:', error);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }

  // Get price history
  const { data: priceData } = await supabase
    .from('price_history')
    .select('date, price')
    .eq('product_id', id)
    .order('date', { ascending: true });

  const priceHistory = ((priceData || []) as { date: string; price: number }[]).map(p => ({
    date: p.date,
    price: p.price,
  }));

  return mapDbProductToProduct(data as DbProduct, priceHistory);
}

/**
 * Get all unique categories from products
 */
export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .order('category');

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  // Extract unique categories
  const categories = [...new Set(((data || []) as { category: string }[]).map(p => p.category))];
  return categories;
}

/**
 * Get price range for products (min and max prices)
 */
export async function getPriceRange(): Promise<[number, number]> {
  const { data, error } = await supabase
    .from('products')
    .select('price')
    .order('price', { ascending: true });

  if (error || !data || data.length === 0) {
    return [0, 1000];
  }

  const prices = ((data || []) as { price: number }[]).map(p => p.price);
  return [Math.min(...prices), Math.max(...prices)];
}

/**
 * Search products by query string
 */
export async function searchProducts(searchQuery: string): Promise<IProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
    .order('rating_count', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error searching products:', error);
    throw new Error(`Failed to search products: ${error.message}`);
  }

  return ((data || []) as DbProduct[]).map(row => mapDbProductToProduct(row));
}

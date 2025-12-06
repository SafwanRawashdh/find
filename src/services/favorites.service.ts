/**
 * Favorites Service
 * 
 * Handles favorite/wishlist operations with Supabase.
 */

import { supabase } from '../lib/supabase';
import type { IProduct, Marketplace, IPricePoint } from '../types';

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

/**
 * Get all favorite product IDs for a user
 */
export async function getFavoriteIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    throw new Error(`Failed to fetch favorites: ${error.message}`);
  }

  return ((data || []) as { product_id: string }[]).map(f => f.product_id);
}

/**
 * Get all favorite products for a user (with full product data)
 */
export async function getFavoriteProducts(userId: string): Promise<IProduct[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      product_id,
      products (*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorite products:', error);
    throw new Error(`Failed to fetch favorite products: ${error.message}`);
  }

  // Map to IProduct format
  return ((data || []) as unknown as { product_id: string; products: DbProduct }[])
    .filter(f => f.products)
    .map(f => mapDbProductToProduct(f.products));
}

/**
 * Add a product to favorites
 */
export async function addToFavorites(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      product_id: productId,
    } as Record<string, unknown>);

  if (error) {
    // Ignore duplicate errors
    if (error.code === '23505') {
      return;
    }
    console.error('Error adding to favorites:', error);
    throw new Error(`Failed to add to favorites: ${error.message}`);
  }
}

/**
 * Remove a product from favorites
 */
export async function removeFromFavorites(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    console.error('Error removing from favorites:', error);
    throw new Error(`Failed to remove from favorites: ${error.message}`);
  }
}

/**
 * Toggle favorite status for a product
 */
export async function toggleFavorite(userId: string, productId: string): Promise<boolean> {
  const favorites = await getFavoriteIds(userId);
  const isFavorite = favorites.includes(productId);

  if (isFavorite) {
    await removeFromFavorites(userId, productId);
    return false;
  } else {
    await addToFavorites(userId, productId);
    return true;
  }
}

/**
 * Check if a product is in favorites
 */
export async function isFavorite(userId: string, productId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return false; // Not found
    }
    console.error('Error checking favorite:', error);
    return false;
  }

  return !!data;
}

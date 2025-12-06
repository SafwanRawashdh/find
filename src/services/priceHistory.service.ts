/**
 * Price History Service
 * 
 * Handles price history data operations.
 */

import { supabase } from '../lib/supabase';
import type { IPricePoint } from '../types';

interface DbPriceHistory {
  date: string;
  price: number;
}

/**
 * Get price history for a product
 */
export async function getPriceHistory(productId: string): Promise<IPricePoint[]> {
  const { data, error } = await supabase
    .from('price_history')
    .select('date, price')
    .eq('product_id', productId)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching price history:', error);
    throw new Error(`Failed to fetch price history: ${error.message}`);
  }

  return ((data || []) as DbPriceHistory[]).map(row => ({
    date: row.date,
    price: row.price,
  }));
}

/**
 * Get price statistics for a product
 */
export async function getPriceStatistics(productId: string): Promise<{
  current: number;
  lowest: number;
  highest: number;
  average: number;
} | null> {
  const { data, error } = await supabase
    .from('price_history')
    .select('price')
    .eq('product_id', productId);

  if (error || !data || data.length === 0) {
    return null;
  }

  const prices = ((data || []) as { price: number }[]).map(p => p.price);
  const current = prices[prices.length - 1];
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const average = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  return { current, lowest, highest, average };
}

/**
 * Check if current price is at lowest point
 */
export async function isAtLowestPrice(productId: string, currentPrice: number): Promise<boolean> {
  const stats = await getPriceStatistics(productId);
  if (!stats) return false;
  return currentPrice <= stats.lowest;
}

/**
 * Cart-related type definitions
 */

import { IProduct } from './product.types';

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICartContext {
  items: ICartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemsByMarketplace: (marketplace: string) => ICartItem[];
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  Tag,
} from "lucide-react";
import { Button, Card, MarketplaceBadge, EmptyState } from "@/components/ui";
import { formatPrice, cn } from "@/lib/utils";
import { mockProducts } from "@/lib/mockData";
import type { Product } from "@/types";

interface CartItemData {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  // Initialize with some mock cart items for demo
  const [cartItems, setCartItems] = useState<CartItemData[]>([
    { product: mockProducts[0], quantity: 1 },
    { product: mockProducts[2], quantity: 2 },
  ]);

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Group by marketplace for checkout
  const itemsByMarketplace = cartItems.reduce((acc, item) => {
    const marketplace = item.product.marketplace;
    if (!acc[marketplace]) acc[marketplace] = [];
    acc[marketplace].push(item);
    return acc;
  }, {} as Record<string, CartItemData[]>);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12" />}
          title="Your cart is empty"
          description="Looks like you haven't added any products yet. Start shopping to fill your cart!"
          action={
            <Link href="/">
              <Button variant="primary">
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[150px]" />
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-pink/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
            <p className="text-dark-400 mt-1">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Button variant="ghost" onClick={clearCart} className="text-red-400 hover:text-red-300">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(itemsByMarketplace).map(([marketplace, items]) => (
              <Card key={marketplace} className="overflow-hidden">
                {/* Marketplace Header */}
                <div className="px-6 py-4 bg-dark-700/50 border-b border-dark-600/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MarketplaceBadge marketplace={marketplace as "amazon" | "ebay"} />
                    <span className="text-dark-300">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <a
                    href={marketplace === "amazon" ? "https://amazon.com/cart" : "https://ebay.com/cart"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent-purple hover:text-accent-purple/80 flex items-center gap-1"
                  >
                    View on {marketplace === "amazon" ? "Amazon" : "eBay"}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Items */}
                <div className="divide-y divide-dark-700/50">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="p-6 flex gap-6">
                      {/* Product Image */}
                      <Link
                        href={`/products/${product.id}`}
                        className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-dark-700/50"
                      >
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          className="object-contain p-2"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-white font-medium hover:text-accent-purple transition-colors line-clamp-2"
                        >
                          {product.title}
                        </Link>
                        <p className="text-sm text-dark-400 mt-1 capitalize">
                          Condition: {product.condition}
                        </p>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-dark-700/50 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(product.id, -1)}
                                className="p-1.5 rounded-md hover:bg-dark-600 transition-colors text-dark-300 hover:text-white"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center text-white font-medium">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(product.id, 1)}
                                className="p-1.5 rounded-md hover:bg-dark-600 transition-colors text-dark-300 hover:text-white"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(product.id)}
                              className="p-2 text-dark-400 hover:text-red-400 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">
                              {formatPrice(product.price * quantity, product.currency)}
                            </p>
                            {quantity > 1 && (
                              <p className="text-sm text-dark-400">
                                {formatPrice(product.price, product.currency)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-700/50 border border-dark-600/50 text-white placeholder:text-dark-400 focus:outline-none focus:border-accent-purple/50"
                    />
                  </div>
                  <Button variant="secondary">Apply</Button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3 pb-6 border-b border-dark-700/50">
                <div className="flex justify-between text-dark-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, "USD")}</span>
                </div>
                <div className="flex justify-between text-dark-300">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-accent-lime" : ""}>
                    {shipping === 0 ? "Free" : formatPrice(shipping, "USD")}
                  </span>
                </div>
                <div className="flex justify-between text-dark-300">
                  <span>Estimated Tax</span>
                  <span>{formatPrice(tax, "USD")}</span>
                </div>
              </div>

              <div className="flex justify-between py-6 border-b border-dark-700/50">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-lg font-bold text-white">
                  {formatPrice(total, "USD")}
                </span>
              </div>

              {/* Free shipping notice */}
              {shipping > 0 && (
                <p className="text-sm text-dark-400 mt-4 mb-6">
                  Add{" "}
                  <span className="text-accent-lime font-medium">
                    {formatPrice(50 - subtotal, "USD")}
                  </span>{" "}
                  more to qualify for free shipping!
                </p>
              )}

              {/* Checkout Buttons */}
              <div className="space-y-3 mt-6">
                <Button variant="primary" size="lg" className="w-full">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-xs text-center text-dark-400">
                  You&apos;ll be redirected to complete your purchase on each marketplace
                </p>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6 pt-6 border-t border-dark-700/50 text-center">
                <Link
                  href="/"
                  className="text-accent-purple hover:text-accent-purple/80 transition-colors text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

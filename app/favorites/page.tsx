"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart, Bell, ArrowRight } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";
import { ProductCard } from "@/components/products/ProductCardOld";
import { ProductModal } from "@/components/products/ProductModal";
import { mockProducts } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/types";

export default function FavoritesPage() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get favorites from auth context (only after mount to avoid hydration issues)
  const favorites = mounted && user?.favorites
    ? mockProducts.filter((p) => user.favorites?.includes(p.id))
    : [];

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  // Show loading state during SSR/hydration
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-dark-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Prompt to login if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<Heart className="w-12 h-12" />}
          title="Login to see your favorites"
          description="Sign in to save and view your favorite products across sessions."
          action={
            <Link href="/auth/login">
              <Button variant="primary">
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<Heart className="w-12 h-12" />}
          title="No favorites yet"
          description="Start adding products to your favorites to keep track of items you love!"
          action={
            <Link href="/">
              <Button variant="primary">
                Discover Products
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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-pink/5 rounded-full blur-[150px]" />
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-purple/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Heart className="w-8 h-8 text-accent-pink" />
              My Favorites
            </h1>
            <p className="text-dark-400 mt-1">
              {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary">
              <Bell className="w-4 h-4 mr-2" />
              Alert All
            </Button>
            <Button variant="secondary">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add All to Cart
            </Button>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 opacity-50 cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Price Drop Alert Banner */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-accent-lime/10 to-accent-cyan/10 border border-accent-lime/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-lime/20">
                <Bell className="w-5 h-5 text-accent-lime" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Get notified about price drops</h3>
                <p className="text-sm text-dark-300">
                  We&apos;ll email you when prices drop on your favorite items
                </p>
              </div>
            </div>
            <Button variant="primary" size="sm">
              Enable Alerts
            </Button>
          </div>
        </div>

        {/* Favorites Grid - using old ProductCard design */}
        <div className="flex flex-wrap gap-6 justify-center">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">You might also like</h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {mockProducts.slice(4, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

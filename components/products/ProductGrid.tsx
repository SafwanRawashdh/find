"use client";

import { useState } from "react";
import { Grid3X3, List, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { EmptyState, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  isFavorite?: (productId: string) => boolean;
  onToggleFavorite?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  onSetAlert?: (product: Product) => void;
  className?: string;
}

type ViewMode = "grid" | "list";

export function ProductGrid({
  products,
  isLoading = false,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onSetAlert,
  className,
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-dark-800/60 border border-dark-700/50 overflow-hidden"
            >
              <Skeleton className="aspect-square" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<SlidersHorizontal className="w-12 h-12" />}
        title="No products found"
        description="Try adjusting your search or filters to find what you're looking for."
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with count and view toggle */}
      <div className="flex items-center justify-between">
        <p className="text-dark-300">
          <span className="font-semibold text-white">{products.length}</span>{" "}
          {products.length === 1 ? "product" : "products"} found
        </p>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-dark-800/60 border border-dark-700/50">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-md transition-colors",
              viewMode === "grid"
                ? "bg-accent-purple text-white"
                : "text-dark-400 hover:text-white"
            )}
            aria-label="Grid view"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-md transition-colors",
              viewMode === "list"
                ? "bg-accent-purple text-white"
                : "text-dark-400 hover:text-white"
            )}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div
        className={cn(
          "grid gap-6",
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        )}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={isFavorite?.(product.id)}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
            onSetAlert={onSetAlert}
            className={viewMode === "list" ? "flex-row" : ""}
          />
        ))}
      </div>
    </div>
  );
}

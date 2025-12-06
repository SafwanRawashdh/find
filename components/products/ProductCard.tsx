"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ExternalLink, TrendingDown, Star, ShoppingCart, Bell } from "lucide-react";
import type { Product } from "@/types";
import { MarketplaceBadge } from "@/components/ui";
import { formatPrice, formatRating, getDiscountPercentage, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  onSetAlert?: (product: Product) => void;
  className?: string;
}

export function ProductCard({
  product,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  onSetAlert,
  className,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.originalPrice
    ? getDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleSetAlert = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSetAlert?.(product);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "bg-dark-800/60 backdrop-blur-sm border border-dark-700/50",
        "transition-all duration-300 ease-out",
        "hover:border-accent-purple/30 hover:shadow-lg hover:shadow-accent-purple/10",
        "hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-dark-700/50">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <MarketplaceBadge marketplace={product.marketplace} />
          {discount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-accent-lime/20 text-accent-lime">
              <TrendingDown className="w-3 h-3" />
              {discount}% OFF
            </span>
          )}
          {product.isBestDeal && (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-accent-orange/20 text-accent-orange">
              Best Deal
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-3 right-3 z-10 p-2 rounded-full",
            "transition-all duration-200",
            "bg-dark-900/60 backdrop-blur-sm border border-dark-600/50",
            isFavorite
              ? "text-accent-pink"
              : "text-dark-400 hover:text-accent-pink"
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn("w-5 h-5", isFavorite && "fill-current")}
          />
        </button>

        {/* Product Image */}
        <div className="relative w-full h-full p-6">
          {imageError ? (
            <div className="flex items-center justify-center w-full h-full bg-dark-700 rounded-lg">
              <span className="text-dark-400 text-sm">No image</span>
            </div>
          ) : (
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
        </div>

        {/* Quick Actions (visible on hover) */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-3",
            "flex items-center justify-center gap-2",
            "bg-gradient-to-t from-dark-900/90 to-transparent",
            "transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-purple text-white text-sm font-medium hover:bg-accent-purple/80 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button
            onClick={handleSetAlert}
            className="p-2 rounded-lg bg-dark-700/80 text-dark-300 hover:text-accent-cyan hover:bg-dark-700 transition-colors"
            aria-label="Set price alert"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <h3 className="text-sm font-medium text-dark-100 line-clamp-2 group-hover:text-white transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-dark-200">
              {formatRating(product.rating)}
            </span>
          </div>
          <span className="text-xs text-dark-400">
            ({product.ratingCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-xl font-bold text-white">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-dark-400 line-through">
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          )}
        </div>

        {/* Shipping Info */}
        <p className="text-xs text-dark-400">
          {product.shippingCost === 0 ? (
            <span className="text-accent-lime">Free Shipping</span>
          ) : (
            product.shippingEstimate
          )}
        </p>

        {/* External Link Indicator */}
        <div className="flex items-center justify-between pt-2 border-t border-dark-700/50">
          <span className="text-xs text-dark-500 capitalize">
            {product.condition}
          </span>
          <span className="flex items-center gap-1 text-xs text-dark-400 group-hover:text-accent-purple transition-colors">
            View on {product.marketplace === "amazon" ? "Amazon" : "eBay"}
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

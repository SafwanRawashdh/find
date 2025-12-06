"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Bell,
  ExternalLink,
  Star,
  TrendingDown,
  TrendingUp,
  Package,
  Truck,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button, MarketplaceBadge, ConditionBadge, Card } from "@/components/ui";
import { formatPrice, formatRating, getDiscountPercentage, cn } from "@/lib/utils";
import { mockProducts } from "@/lib/mockData";
import type { Product, PriceHistoryEntry } from "@/types";

// Simple Price History Chart
function PriceHistoryChart({ data, currency }: { data: PriceHistoryEntry[]; currency: string }) {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 text-dark-400">
        Not enough price history data
      </div>
    );
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  return (
    <div className="relative h-48">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-6 w-16 flex flex-col justify-between text-xs text-dark-400">
        <span>{formatPrice(maxPrice, currency)}</span>
        <span>{formatPrice((maxPrice + minPrice) / 2, currency)}</span>
        <span>{formatPrice(minPrice, currency)}</span>
      </div>

      {/* Chart area */}
      <div className="ml-20 h-full pb-6 relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Gradient fill */}
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path
            d={`
              M 0,${100 - ((data[0].price - minPrice) / range) * 100}
              ${data
                .map(
                  (d, i) =>
                    `L ${(i / (data.length - 1)) * 100},${100 - ((d.price - minPrice) / range) * 100}`
                )
                .join(" ")}
              L 100,100
              L 0,100
              Z
            `}
            fill="url(#priceGradient)"
          />

          {/* Line */}
          <path
            d={`
              M 0,${100 - ((data[0].price - minPrice) / range) * 100}
              ${data
                .map(
                  (d, i) =>
                    `L ${(i / (data.length - 1)) * 100},${100 - ((d.price - minPrice) / range) * 100}`
                )
                .join(" ")}
            `}
            fill="none"
            stroke="rgb(168, 85, 247)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={(i / (data.length - 1)) * 100}
              cy={100 - ((d.price - minPrice) / range) * 100}
              r="3"
              fill="rgb(168, 85, 247)"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-dark-400">
          <span>{data[0]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Find product from mock data
  const product = useMemo(() => {
    return mockProducts.find((p) => p.id === productId);
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <p className="text-dark-400 mb-8">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.imageUrl];
  const discount = product.originalPrice
    ? getDiscountPercentage(product.originalPrice, product.price)
    : 0;

  // Calculate price trend
  const priceTrend = useMemo(() => {
    if (!product.priceHistory || product.priceHistory.length < 2) return null;
    const latest = product.priceHistory[product.priceHistory.length - 1].price;
    const previous = product.priceHistory[product.priceHistory.length - 2].price;
    const change = ((latest - previous) / previous) * 100;
    return { change, direction: change > 0 ? "up" : change < 0 ? "down" : "stable" };
  }, [product.priceHistory]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[150px]" />
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-pink/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-dark-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/?q=" className="hover:text-white transition-colors">
            Search
          </Link>
          <span>/</span>
          <span className="text-dark-300 truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl bg-dark-800/60 backdrop-blur-sm border border-dark-700/50 overflow-hidden">
              <Image
                src={images[selectedImageIndex]}
                alt={product.title}
                fill
                className="object-contain p-8"
                priority
              />

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark-900/60 text-white hover:bg-dark-900 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark-900/60 text-white hover:bg-dark-900 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <MarketplaceBadge marketplace={product.marketplace} />
                {discount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-accent-lime/20 text-accent-lime">
                    <TrendingDown className="w-3 h-3" />
                    {discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImageIndex === idx
                        ? "border-accent-purple"
                        : "border-dark-700/50 hover:border-dark-500"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ConditionBadge condition={product.condition} />
                {product.isBestDeal && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-accent-orange/20 text-accent-orange">
                    Best Deal
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-white">
                    {formatRating(product.rating)}
                  </span>
                </div>
                <span className="text-dark-400">
                  ({product.ratingCount.toLocaleString()} reviews)
                </span>
                {product.seller && (
                  <span className="text-dark-400">
                    Sold by <span className="text-dark-200">{product.seller}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-dark-400 line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
              {priceTrend && (
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    priceTrend.direction === "down"
                      ? "text-accent-lime"
                      : priceTrend.direction === "up"
                      ? "text-red-400"
                      : "text-dark-400"
                  )}
                >
                  {priceTrend.direction === "down" ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : priceTrend.direction === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : null}
                  {Math.abs(priceTrend.change).toFixed(1)}%
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className="flex-1"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addedToCart ? "Added!" : "Add to Cart"}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={cn(
                    "w-5 h-5",
                    isFavorite && "fill-accent-pink text-accent-pink"
                  )}
                />
              </Button>
              <Button variant="secondary" size="lg">
                <Bell className="w-5 h-5" />
              </Button>
            </div>

            {/* External link */}
            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent-purple hover:text-accent-purple/80 transition-colors"
            >
              View on {product.marketplace === "amazon" ? "Amazon" : "eBay"}
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Package className="w-6 h-6 mx-auto mb-2 text-accent-cyan" />
                <p className="text-xs text-dark-400">Condition</p>
                <p className="text-sm font-medium text-white capitalize">
                  {product.condition}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-accent-purple" />
                <p className="text-xs text-dark-400">Shipping</p>
                <p className="text-sm font-medium text-white">
                  {product.shippingCost === 0 ? "Free" : product.shippingEstimate}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-accent-lime" />
                <p className="text-xs text-dark-400">Protection</p>
                <p className="text-sm font-medium text-white">Buyer Protection</p>
              </Card>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-dark-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Price History Chart */}
            {product.priceHistory && product.priceHistory.length > 1 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Price History</h3>
                <PriceHistoryChart
                  data={product.priceHistory}
                  currency={product.currency}
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

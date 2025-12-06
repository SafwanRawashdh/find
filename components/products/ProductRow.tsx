"use client";

import React, { useRef, useState } from "react";
import { ProductCard } from "./ProductCardOld";
import type { Product } from "@/types";

interface ProductRowProps {
  title: string;
  items: Product[];
  colorClass: string;
  marketplace: "amazon" | "ebay";
  onViewDetails: (product: Product) => void;
}

export function ProductRow({
  title,
  items,
  colorClass,
  marketplace,
  onViewDetails,
}: ProductRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const marketplaceIcon =
    marketplace === "amazon" ? (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.44-2.186 1.44-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.683zm3.186 7.705c-.209.189-.512.201-.745.074-1.052-.872-1.238-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095v-.41c0-.752.058-1.642-.383-2.294-.385-.579-1.124-.82-1.775-.82-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.549.582l-3.061-.333c-.259-.056-.548-.266-.472-.66C6.057 1.926 9.311 1 12.191 1c1.476 0 3.406.392 4.573 1.507 1.476 1.392 1.336 3.25 1.336 5.274v4.773c0 1.438.596 2.069 1.156 2.847.199.277.242.609-.01.814-.631.527-1.754 1.506-2.372 2.055l-.93-.465z" />
      </svg>
    ) : (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.869 4.171c-.393-.186-.934-.109-1.088.188-.155.298.023.609.444.844l8.205 4.584c.213.119.432.144.613.093l.039-.015 8.205-4.584c.421-.235.599-.546.444-.844-.154-.297-.695-.374-1.088-.188l-8.203 4.586-8.571-4.664zm17.797 7.313l-5.583-3.112-5.375 3.004c-.192.107-.451.117-.613.019l-5.354-2.995-5.599 3.112c-.455.253-.633.584-.455.909.178.325.609.482 1.064.229l5.054-2.812 5.264 2.945c.181.101.458.098.621-.006l5.254-2.939 5.054 2.812c.455.253.886.096 1.064-.229.178-.325 0-.656-.396-.937zm0 4.392l-5.583-3.112-5.375 3.004c-.192.107-.451.117-.613.019l-5.354-2.995-5.599 3.112c-.455.253-.633.584-.455.909.178.325.609.482 1.064.229l5.054-2.812 5.264 2.945c.181.101.458.098.621-.006l5.254-2.939 5.054 2.812c.455.253.886.096 1.064-.229.178-.325 0-.656-.396-.937z" />
      </svg>
    );

  return (
    <div className="mb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shadow-lg`}
          >
            {marketplaceIcon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">{title}</h2>
            <p className="text-sm text-gray-500">{items.length} products found</p>
          </div>
        </div>
        {items.length > 4 && (
          <button className="text-sm text-accent-purple hover:text-accent-pink transition-colors font-medium flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-400 font-medium">No products found</p>
          <p className="text-sm text-gray-600 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="relative group">
          {/* Left Scroll Button */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-700/90 backdrop-blur border border-white/10 text-white flex items-center justify-center shadow-xl hover:bg-dark-600 transition-all opacity-0 group-hover:opacity-100 -translate-x-1/2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Products Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 pb-4 px-1 hide-scroll -mx-1 scroll-smooth"
          >
            {items.map((product, index) => (
              <div
                key={product.id || product._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} onViewDetails={onViewDetails} />
              </div>
            ))}
          </div>

          {/* Right Scroll Button */}
          {showRightArrow && items.length > 4 && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-700/90 backdrop-blur border border-white/10 text-white flex items-center justify-center shadow-xl hover:bg-dark-600 transition-all opacity-0 group-hover:opacity-100 translate-x-1/2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-dark-900 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-dark-900 to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}

export default ProductRow;

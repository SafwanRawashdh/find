"use client";

import React, { useState, useEffect } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { mockProducts } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/types";

export default function Home() {
  const { isMounted } = useAuth();

  // State
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Initial load of some "featured" products logic (optional, but nice for empty state)
  // For now, per requirements: "If there is no query yet -> show a friendly empty state."

  const handleSearch = (term: string) => {
    setQuery(term);
    if (!term.trim()) {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    // Simulate API search
    setTimeout(() => {
      const lowerFreq = term.toLowerCase();
      const results = mockProducts.filter(p =>
        p.title.toLowerCase().includes(lowerFreq) ||
        p.description?.toLowerCase().includes(lowerFreq) ||
        p.category?.toLowerCase().includes(lowerFreq)
      );
      setProducts(results);
      setIsSearching(false);
    }, 600);
  };

  // Prevent hydration styling mismatch
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-purple/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-pink/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col items-center">

        {/* Intro Section - Hide if searched to focus on results */}
        {!hasSearched && (
          <div className="text-center mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
              Find the best deals across <br />
              <span className="gradient-text">every marketplace</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8">
              Compare prices from Amazon, eBay, and more in one place.
              Track history, set alerts, and save money.
            </p>
          </div>
        )}

        {/* Search Section */}
        <div className={`w-full transition-all duration-500 ${hasSearched ? 'mb-8' : 'mb-12'}`}>
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Results Section */}
        <div className="w-full">
          {isSearching ? (
            <ProductGrid products={[]} isLoading={true} />
          ) : hasSearched ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Results for &quot;<span className="text-accent-purple">{query}</span>&quot;
                </h2>
                <span className="text-sm text-gray-400">{products.length} items found</span>
              </div>
              <ProductGrid products={products} />
            </div>
          ) : (
            // Empty State / Suggestions
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-500 animate-in fade-in delay-200">
              <div className="p-6 rounded-2xl bg-dark-800/50 border border-white/5">
                <div className="w-12 h-12 bg-accent-purple/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-accent-purple">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-medium mb-2">Search Once</h3>
                <p className="text-sm">We search Amazon, eBay, and more simultaneously so you don't have to.</p>
              </div>
              <div className="p-6 rounded-2xl bg-dark-800/50 border border-white/5">
                <div className="w-12 h-12 bg-accent-pink/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-accent-pink">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-white font-medium mb-2">Track Prices</h3>
                <p className="text-sm">Set alerts and get notified when prices drop below your target.</p>
              </div>
              <div className="p-6 rounded-2xl bg-dark-800/50 border border-white/5">
                <div className="w-12 h-12 bg-accent-lime/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-accent-lime">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-medium mb-2">Save Favorites</h3>
                <p className="text-sm">Keep track of items you want and compare them side by side.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

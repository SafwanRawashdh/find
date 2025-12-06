"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HeroSection from "@/components/home/HeroSection";
import { Filters } from "@/components/filters/Filters";
import { ProductRow } from "@/components/products/ProductRow";
import { ProductModal } from "@/components/products/ProductModal";
import { mockProducts, filterProducts } from "@/lib/mockData";
import type { FilterState, Product } from "@/types";

function HomePageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";

  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    query: initialQuery,
    marketplaces: { amazon: true, ebay: true },
    condition: "all",
    category: "all",
    sortBy: "rating_desc",
  });

  // Handle search
  const handleSearch = (newQuery: string) => {
    setFilters((prev) => ({ ...prev, query: newQuery }));
    setHasSearched(true);
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const results = filterProducts(mockProducts, newQuery, filters);
      setProducts(results);
      setIsLoading(false);
    }, 500);
  };

  // Fetch products when filters change
  useEffect(() => {
    if (!hasSearched && !filters.query) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const results = filterProducts(mockProducts, filters.query, filters);
        setProducts(results);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [filters, hasSearched]);

  // Initial load if query exists
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Split products by marketplace
  const amazonProducts = products.filter((p) => p.marketplace === "amazon");
  const ebayProducts = products.filter((p) => p.marketplace === "ebay");

  return (
    <>
      {/* Show Hero when no search has been performed */}
      {!hasSearched && <HeroSection onSearch={handleSearch} />}

      {/* Show Results */}
      {hasSearched && (
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[150px]" />
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-pink/5 rounded-full blur-[120px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:w-72 flex-shrink-0">
                <div className="sticky top-24">
                  <Filters filters={filters} setFilters={setFilters} />
                </div>
              </aside>

              {/* Main Content */}
              <section className="flex-1 min-w-0">
                {/* Search Status Bar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {filters.query && (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm glass-light text-gray-200">
                        <svg
                          className="w-4 h-4 mr-2 text-accent-purple"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        &quot;{filters.query}&quot;
                        <button
                          onClick={() => {
                            setFilters((prev) => ({ ...prev, query: "" }));
                            setHasSearched(false);
                          }}
                          className="ml-2 hover:text-accent-pink transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{products.length} results found</span>
                </div>

                {/* Loading State */}
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="w-12 h-12 border-4 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
                    <p className="text-gray-400 font-medium">Searching marketplaces...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Amazon Products */}
                    {filters.marketplaces.amazon && (
                      <ProductRow
                        title="Amazon Results"
                        items={amazonProducts}
                        colorClass="from-amazon to-amazon-dark"
                        marketplace="amazon"
                        onViewDetails={setSelectedProduct}
                      />
                    )}

                    {/* eBay Products */}
                    {filters.marketplaces.ebay && (
                      <ProductRow
                        title="eBay Results"
                        items={ebayProducts}
                        colorClass="from-ebay to-ebay-blue"
                        marketplace="ebay"
                        onViewDetails={setSelectedProduct}
                      />
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}

// Loading fallback for Suspense
function HomePageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
        <p className="text-dark-400">Loading...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageLoading />}>
      <HomePageContent />
    </Suspense>
  );
}

"use client";

import React from "react";
import type { FilterState } from "@/types";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount?: number;
}

export default function FilterBar({
  filters,
  onChange,
  resultCount,
}: FilterBarProps) {
  const handleMarketplaceChange = (marketplace: "amazon" | "ebay") => {
    onChange({
      ...filters,
      marketplaces: {
        ...filters.marketplaces,
        [marketplace]: !filters.marketplaces[marketplace],
      },
    });
  };

  const handleSortChange = (sortBy: FilterState["sortBy"]) => {
    onChange({ ...filters, sortBy });
  };

  const handleConditionChange = (condition: FilterState["condition"]) => {
    onChange({ ...filters, condition });
  };

  const clearFilters = () => {
    onChange({
      ...filters,
      minPrice: undefined,
      maxPrice: undefined,
      condition: "all",
      marketplaces: { amazon: true, ebay: true },
    });
  };

  const hasActiveFilters =
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.condition !== "all" ||
    !filters.marketplaces.amazon ||
    !filters.marketplaces.ebay;

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Marketplace filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            Marketplace:
          </span>
          <button
            onClick={() => handleMarketplaceChange("amazon")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filters.marketplaces.amazon
                ? "bg-amazon/20 text-amazon border border-amazon/30"
                : "bg-dark-600 text-gray-400 border border-transparent hover:text-white"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                filters.marketplaces.amazon ? "bg-amazon" : "bg-gray-500"
              }`}
            />
            Amazon
          </button>
          <button
            onClick={() => handleMarketplaceChange("ebay")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filters.marketplaces.ebay
                ? "bg-ebay/20 text-ebay border border-ebay/30"
                : "bg-dark-600 text-gray-400 border border-transparent hover:text-white"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                filters.marketplaces.ebay ? "bg-ebay" : "bg-gray-500"
              }`}
            />
            eBay
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-dark-500 hidden sm:block" />

        {/* Condition filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            Condition:
          </span>
          <select
            value={filters.condition}
            onChange={(e) =>
              handleConditionChange(e.target.value as FilterState["condition"])
            }
            className="bg-dark-600 border border-dark-400 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-purple"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-dark-500 hidden sm:block" />

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            Sort:
          </span>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              handleSortChange(e.target.value as FilterState["sortBy"])
            }
            className="bg-dark-600 border border-dark-400 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-purple"
          >
            <option value="rating_desc">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Result count & clear */}
        <div className="flex items-center gap-3">
          {resultCount !== undefined && (
            <span className="text-sm text-gray-400">
              {resultCount} {resultCount === 1 ? "result" : "results"}
            </span>
          )}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-accent-purple hover:text-accent-pink transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Price range - expandable on mobile */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          Price:
        </span>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              $
            </span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-24 bg-dark-600 border border-dark-400 rounded-lg pl-7 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-purple"
            />
          </div>
          <span className="text-gray-500">—</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              $
            </span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-24 bg-dark-600 border border-dark-400 rounded-lg pl-7 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-purple"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

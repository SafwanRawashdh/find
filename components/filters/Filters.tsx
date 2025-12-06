"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { FilterState } from "@/types";

// Marketplace enum for compatibility
const Marketplace = {
  AMAZON: "amazon" as const,
  EBAY: "ebay" as const,
};

interface FiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export function Filters({ filters, setFilters }: FiltersProps) {
  const { isLoggedIn, login } = useAuth();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleInputChange = (field: keyof FilterState, value: unknown) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSource = (source: "amazon" | "ebay") => {
    setFilters((prev) => ({
      ...prev,
      marketplaces: { ...prev.marketplaces, [source]: !prev.marketplaces[source] },
    }));
  };

  const handleSavePreset = (name: string) => {
    console.log(`Saving preset "${name}"`, filters);
    alert(`Preset "${name}" saved successfully!`);
    setIsSaveModalOpen(false);
  };

  // --- COMPONENT: LOCKED OVERLAY ---
  const LockedOverlay = ({ label }: { label: string }) => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-dark-800/80 backdrop-blur-sm rounded-xl">
      <div className="glass p-4 rounded-xl flex flex-col items-center text-center max-w-[90%]">
        <div className="w-10 h-10 bg-dark-600 rounded-full flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-white mb-1">{label}</p>
        <p className="text-xs text-gray-500 mb-3">Sign in to unlock</p>
        <button
          onClick={() => login("guest@example.com", "pass")}
          className="text-sm bg-gradient-to-r from-accent-purple to-accent-pink text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all w-full font-medium"
        >
          Unlock Now
        </button>
      </div>
    </div>
  );

  const selectClass =
    "w-full text-sm bg-dark-600 border-dark-500 rounded-lg py-2.5 px-3 text-white border focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors";
  const inputClass =
    "w-full text-sm bg-dark-600 border-dark-500 rounded-lg py-2 px-3 text-white border focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors";

  return (
    <>
      <div className="w-full flex-shrink-0 space-y-6 pb-10">
        {/* BASIC FILTERS */}
        <div className="glass rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-accent-purple to-accent-pink rounded-full" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h3>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleInputChange("sortBy", e.target.value)}
              className={selectClass}
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="shipping_asc">Fastest Shipping</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Price Range</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice === "" ? "" : filters.minPrice}
                  onChange={(e) =>
                    handleInputChange("minPrice", e.target.value ? Number(e.target.value) : "")
                  }
                  className={`${inputClass} pl-7`}
                />
              </div>
              <span className="text-gray-600">—</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice === "" ? "" : filters.maxPrice}
                  onChange={(e) =>
                    handleInputChange("maxPrice", e.target.value ? Number(e.target.value) : "")
                  }
                  className={`${inputClass} pl-7`}
                />
              </div>
            </div>
          </div>

          {/* Sources */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-3">Marketplaces</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-dark-600/50 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors group">
                <input
                  type="checkbox"
                  checked={filters.marketplaces[Marketplace.AMAZON]}
                  onChange={() => toggleSource(Marketplace.AMAZON)}
                  className="w-4 h-4 rounded border-gray-600 bg-dark-700 text-amazon focus:ring-amazon focus:ring-offset-dark-700"
                />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amazon rounded-full" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    Amazon
                  </span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-dark-600/50 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors group">
                <input
                  type="checkbox"
                  checked={filters.marketplaces[Marketplace.EBAY]}
                  onChange={() => toggleSource(Marketplace.EBAY)}
                  className="w-4 h-4 rounded border-gray-600 bg-dark-700 text-ebay focus:ring-ebay focus:ring-offset-dark-700"
                />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-ebay rounded-full" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    eBay
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ADVANCED FILTERS (Locked for Guests) */}
        <div className="relative glass rounded-xl p-5 space-y-5">
          {!isLoggedIn && <LockedOverlay label="Advanced Filters" />}

          <div className={!isLoggedIn ? "opacity-30 pointer-events-none select-none" : ""}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-gradient-to-b from-accent-cyan to-accent-lime rounded-full" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Advanced</h3>
              </div>
              {isLoggedIn && (
                <span className="text-[10px] bg-accent-lime/20 text-accent-lime px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Unlocked
                </span>
              )}
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={selectClass}
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Computers">Computers</option>
                <option value="Toys">Toys</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
              </select>
            </div>

            {/* Condition */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-2">Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                className={selectClass}
              >
                <option value="all">Any Condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>

            {/* Shipping Country */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-400 mb-2">Shipping To</label>
              <select
                value={filters.shippingCountry || "US"}
                onChange={(e) => handleInputChange("shippingCountry", e.target.value)}
                className={selectClass}
              >
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
              </select>
            </div>

            {/* Save Preset Button (logged in only) */}
            {isLoggedIn && (
              <button
                onClick={() => setIsSaveModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-300 border border-dark-500 bg-dark-600 hover:bg-dark-500 hover:text-white font-medium py-2.5 px-4 rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Save Preset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save Preset Modal */}
      {isSaveModalOpen && (
        <SavePresetModal onSave={handleSavePreset} onClose={() => setIsSaveModalOpen(false)} />
      )}
    </>
  );
}

// Save Preset Modal Component
function SavePresetModal({
  onSave,
  onClose,
}: {
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-900/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative transform overflow-hidden rounded-2xl glass text-left shadow-2xl transition-all sm:w-full sm:max-w-md animate-scale-in">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white" id="modal-title">
                Save Filter Preset
              </h3>
              <p className="mt-1 text-sm text-gray-400">Save your current filters for quick access</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-dark-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Preset Name
            </label>
            <input
              type="text"
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-600 border border-dark-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors"
              placeholder="e.g. Headphones under $100"
            />

            {/* Suggested Names */}
            <div className="flex flex-wrap gap-2 mt-3">
              {["Electronics Deals", "Budget Finds", "Premium Items", "Gift Ideas"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setName(suggestion)}
                  className="px-3 py-1.5 text-xs font-medium bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500 rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-dark-400 text-gray-300 hover:bg-dark-600 hover:text-white font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:opacity-90 transition-all"
              >
                Save Preset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Filters;

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  size?: "sm" | "lg";
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  initialQuery = "",
  onSearch,
  size = "lg",
  placeholder = "Search for products...",
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const popularSearches = [
    "AirPods Pro",
    "MacBook",
    "Gaming Mouse",
    "Headphones",
    "Kindle",
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* Gradient glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple via-accent-pink to-accent-orange rounded-2xl blur opacity-30 group-hover:opacity-50 group-focus-within:opacity-50 transition duration-500" />

          <div
            className={`relative flex items-center gap-2 bg-dark-700 rounded-xl ${
              size === "lg" ? "p-2" : "p-1"
            }`}
          >
            <div className="flex-1 flex items-center gap-3 pl-4">
              <svg
                className={`text-gray-500 ${size === "lg" ? "w-5 h-5" : "w-4 h-4"}`}
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
              <input
                type="text"
                className={`flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 ${
                  size === "lg" ? "text-lg py-3" : "text-sm py-2"
                }`}
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus={autoFocus}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className={`bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold rounded-lg hover:opacity-90 transition-all active:scale-95 ${
                size === "lg" ? "px-8 py-3" : "px-4 py-2 text-sm"
              }`}
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Popular Searches */}
      {size === "lg" && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <span className="text-gray-500 text-sm">Popular:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term);
                if (onSearch) {
                  onSearch(term);
                } else {
                  router.push(`/?q=${encodeURIComponent(term)}`);
                }
              }}
              className="px-3 py-1 text-sm text-gray-400 hover:text-white bg-dark-600/50 hover:bg-dark-500 rounded-full transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

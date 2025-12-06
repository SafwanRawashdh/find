"use client";

import React, { useState } from "react";
import { Heart, Bell, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthRequiredModal } from "@/components/modals/AuthRequiredModal";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated, toggleFavorite } = useAuth();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Local state for immediate feedback (optimistic UI)
  const isFavorite = false; // In a real app, check against user.favorites

  const handleAction = (action: "favorite" | "alert") => {
    if (!isAuthenticated) {
      setModalMessage(
        action === "favorite"
          ? "Login to save this item to your favorites."
          : "Login to track price changes for this item."
      );
      setAuthModalOpen(true);
      return;
    }

    if (action === "favorite") {
      // Logic for favorite (mocked here but would call context)
      console.log("Toggling favorite for:", product.id);
      toggleFavorite(product.id);
    } else {
      // Logic for price alert
      console.log("Setting price alert for:", product.id);
      alert("Price alert set! (Mock)");
    }
  };

  return (
    <>
      <div className="group relative bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden hover:border-accent-purple/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {/* Marketplace Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`
            px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider
            ${product.marketplace === 'amazon'
              ? 'bg-[#FF9900] text-black'
              : 'bg-[#0053A0] text-white'}
          `}>
            {product.marketplace}
          </span>
        </div>

        {/* Image Area */}
        <div className="aspect-[4/3] bg-dark-700 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        </div>

        {/* Content Area */}
        <div className="p-4">
          <h3 className="text-white font-medium mb-1 line-clamp-2 min-h-[3rem] group-hover:text-accent-purple transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-accent-yellow text-sm">
              {'★'.repeat(Math.round(product.rating))}
              <span className="text-gray-600 ml-1 text-xs">({product.ratingCount})</span>
            </div>
          </div>

          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-white">${product.price}</p>
              {product.originalPrice && (
                <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-dark-600/50">
            <button
              onClick={() => handleAction("favorite")}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-dark-700 text-gray-300 hover:text-white hover:bg-dark-600 transition-colors text-xs font-medium"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-accent-pink text-accent-pink" : ""}`} />
              Favorite
            </button>
            <button
              onClick={() => handleAction("alert")}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-dark-700 text-gray-300 hover:text-white hover:bg-dark-600 transition-colors text-xs font-medium"
            >
              <Bell className="w-3.5 h-3.5" />
              Alert
            </button>
          </div>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="mt-3 flex items-center justify-center w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors border border-white/5"
          >
            View Details <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
          </a>
        </div>
      </div>

      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        message={modalMessage}
      />
    </>
  );
}

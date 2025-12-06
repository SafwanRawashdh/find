"use client";

import React from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { mockProducts } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
    const { user } = useAuth();

    // In a real app, we would filter by user.favorites or fetch from API
    // For demo, just show a subset of mock products
    const favoriteProducts = mockProducts.slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-accent-pink/10 rounded-xl">
                    <Heart className="w-6 h-6 text-accent-pink" />
                </div>
                <h1 className="text-3xl font-bold text-white">My Favorites</h1>
            </div>

            {favoriteProducts.length > 0 ? (
                <ProductGrid products={favoriteProducts} />
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-400">You haven&apos;t saved any products yet.</p>
                </div>
            )}
        </div>
    );
}

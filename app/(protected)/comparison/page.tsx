"use client";

import React from "react";
import { BarChart3, X } from "lucide-react";
import { mockProducts } from "@/lib/mockData";
import { Button } from "@/components/ui";

export default function ComparisonPage() {
    // Mock comparison list
    const comparisonList = mockProducts.slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-accent-lime/10 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-accent-lime" />
                </div>
                <h1 className="text-3xl font-bold text-white">Compare Products</h1>
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="min-w-[800px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-4 gap-4 mb-4 px-4">
                        <div className="font-medium text-gray-500 uppercase text-xs tracking-wider">Product</div>
                        <div className="font-medium text-gray-500 uppercase text-xs tracking-wider">Price</div>
                        <div className="font-medium text-gray-500 uppercase text-xs tracking-wider">Rating</div>
                        <div className="font-medium text-gray-500 uppercase text-xs tracking-wider">Marketplace</div>
                    </div>

                    <div className="space-y-4">
                        {comparisonList.map((product) => (
                            <div key={product.id} className="grid grid-cols-4 gap-4 items-center bg-dark-800 border border-dark-600 rounded-2xl p-4 hover:border-accent-lime/30 transition-colors group">
                                {/* Product */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-dark-700 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-white font-medium line-clamp-2 text-sm">{product.title}</h3>
                                </div>

                                {/* Price */}
                                <div>
                                    <span className="text-xl font-bold text-white">${product.price}</span>
                                    {product.originalPrice && (
                                        <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice}</span>
                                    )}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2">
                                    <span className="text-accent-yellow">★ {product.rating}</span>
                                    <span className="text-gray-500 text-sm">({product.ratingCount})</span>
                                </div>

                                {/* Marketplace */}
                                <div className="flex items-center justify-between">
                                    <span className="capitalize text-gray-300">{product.marketplace}</span>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-white transition-opacity">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

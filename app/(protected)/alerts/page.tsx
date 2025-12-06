"use client";

import React from "react";
import { Bell, Trash2 } from "lucide-react";
import { mockProducts } from "@/lib/mockData";

export default function AlertsPage() {
    // Mock alerts data joined with products
    const mockAlerts = [
        { id: "1", productId: "1", targetPrice: 180.00, createdAt: "2024-12-01", product: mockProducts[0] },
        { id: "2", productId: "3", targetPrice: 120.00, createdAt: "2024-12-05", product: mockProducts[2] },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-accent-purple/10 rounded-xl">
                    <Bell className="w-6 h-6 text-accent-purple" />
                </div>
                <h1 className="text-3xl font-bold text-white">Price Alerts</h1>
            </div>

            <div className="grid gap-4">
                {mockAlerts.map((alert) => (
                    <div key={alert.id} className="bg-dark-800 border border-dark-600 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-6">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-dark-700 rounded-xl flex-shrink-0 overflow-hidden">
                            <img
                                src={alert.product.imageUrl}
                                alt={alert.product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-white font-medium mb-1 line-clamp-1">{alert.product.title}</h3>
                            <p className="text-sm text-gray-400">Current Price: ${alert.product.price}</p>
                        </div>

                        {/* Alert Settings */}
                        <div className="flex items-center gap-6 bg-dark-700/50 px-4 py-2 rounded-xl">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Target</p>
                                <p className="text-accent-purple font-bold">${alert.targetPrice.toFixed(2)}</p>
                            </div>
                            <div className="h-8 w-px bg-dark-600" />
                            <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Created</p>
                                <p className="text-white text-sm">{alert.createdAt}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

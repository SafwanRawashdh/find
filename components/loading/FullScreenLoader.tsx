"use client";

import React from "react";

interface FullScreenLoaderProps {
    message?: string;
}

export function FullScreenLoader({
    message = "Loading...",
}: FullScreenLoaderProps) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-900">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-pink/10 rounded-full blur-[120px]" />

            <div className="relative flex flex-col items-center gap-6">
                {/* Logo */}
                <h1 className="text-5xl font-bold">
                    <span className="gradient-text">FIND</span>
                </h1>

                {/* Spinner */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-dark-700 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent-purple rounded-full animate-spin" />
                </div>

                {/* Message */}
                <p className="text-dark-400 font-medium animate-pulse">{message}</p>
            </div>
        </div>
    );
}

export default FullScreenLoader;

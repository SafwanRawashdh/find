import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
    className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-dark-700/50 bg-dark-800/50 overflow-hidden animate-pulse",
                className
            )}
        >
            {/* Image placeholder */}
            <div className="aspect-square bg-dark-700/50" />

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Marketplace badge */}
                <div className="h-5 w-16 rounded-full bg-dark-700/50" />

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-dark-700/50" />
                    <div className="h-4 w-3/4 rounded bg-dark-700/50" />
                </div>

                {/* Price */}
                <div className="h-6 w-24 rounded bg-dark-700/50" />

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="h-4 w-20 rounded bg-dark-700/50" />
                    <div className="h-4 w-12 rounded bg-dark-700/50" />
                </div>

                {/* Button */}
                <div className="h-10 w-full rounded-lg bg-dark-700/50 mt-4" />
            </div>
        </div>
    );
}

interface SkeletonRowProps {
    count?: number;
    title?: string;
}

export function SkeletonRow({ count = 4, title }: SkeletonRowProps) {
    return (
        <div className="space-y-4">
            {title && (
                <div className="flex items-center gap-3">
                    <div className="h-6 w-32 rounded bg-dark-700/50 animate-pulse" />
                    <div className="h-5 w-16 rounded-full bg-dark-700/50 animate-pulse" />
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    );
}

export default SkeletonCard;

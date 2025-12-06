import React from "react";

export function FiltersSkeleton() {
    return (
        <div className="rounded-2xl border border-dark-700/50 bg-dark-800/50 p-5 space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="h-6 w-20 rounded bg-dark-700/50" />
                <div className="h-4 w-16 rounded bg-dark-700/50" />
            </div>

            {/* Search */}
            <div className="h-10 w-full rounded-lg bg-dark-700/50" />

            {/* Section 1 - Marketplaces */}
            <div className="space-y-3">
                <div className="h-4 w-24 rounded bg-dark-700/50" />
                <div className="space-y-2">
                    <div className="h-8 w-full rounded-lg bg-dark-700/50" />
                    <div className="h-8 w-full rounded-lg bg-dark-700/50" />
                </div>
            </div>

            {/* Section 2 - Category */}
            <div className="space-y-3">
                <div className="h-4 w-20 rounded bg-dark-700/50" />
                <div className="h-10 w-full rounded-lg bg-dark-700/50" />
            </div>

            {/* Section 3 - Price */}
            <div className="space-y-3">
                <div className="h-4 w-24 rounded bg-dark-700/50" />
                <div className="flex gap-2">
                    <div className="h-10 w-1/2 rounded-lg bg-dark-700/50" />
                    <div className="h-10 w-1/2 rounded-lg bg-dark-700/50" />
                </div>
            </div>

            {/* Section 4 - Condition */}
            <div className="space-y-3">
                <div className="h-4 w-20 rounded bg-dark-700/50" />
                <div className="flex gap-2">
                    <div className="h-8 w-1/3 rounded-full bg-dark-700/50" />
                    <div className="h-8 w-1/3 rounded-full bg-dark-700/50" />
                    <div className="h-8 w-1/3 rounded-full bg-dark-700/50" />
                </div>
            </div>

            {/* Section 5 - Sort */}
            <div className="space-y-3">
                <div className="h-4 w-16 rounded bg-dark-700/50" />
                <div className="h-10 w-full rounded-lg bg-dark-700/50" />
            </div>
        </div>
    );
}

export default FiltersSkeleton;

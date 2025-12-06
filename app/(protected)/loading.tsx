import React from "react";
import { SkeletonRow } from "@/components/loading";
import { FiltersSkeleton } from "@/components/loading";

export default function ProtectedLoading() {
    return (
        <div className="relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[150px]" />
            <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-pink/5 rounded-full blur-[120px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters Skeleton */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <FiltersSkeleton />
                        </div>
                    </aside>

                    {/* Main Content Skeleton */}
                    <section className="flex-1 min-w-0 space-y-8">
                        <SkeletonRow count={4} title="Loading your dashboard..." />
                        <SkeletonRow count={4} />
                    </section>
                </div>
            </div>
        </div>
    );
}

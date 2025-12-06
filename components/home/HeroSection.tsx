import React from "react";
import SearchBar from "@/components/forms/SearchBar";

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 animated-gradient noise" />

      {/* Decorative Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent-purple/20 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-pink/15 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000" />
      <div className="absolute top-40 right-1/4 w-48 h-48 bg-accent-cyan/10 rounded-full blur-[80px] animate-float" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-lime opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-lime" />
            </span>
            <span className="text-sm text-gray-300 font-medium">
              Compare prices across 10,000+ deals
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight animate-slide-up">
            <span className="block text-white">Find the Best</span>
            <span className="block gradient-text">Deals Online</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Search across Amazon, eBay, and more. Compare prices, track history,
            and never miss a deal with intelligent price alerts.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto animate-slide-up">
            <SearchBar size="lg" onSearch={onSearch} autoFocus />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8 animate-fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">2M+</div>
              <div className="text-sm text-gray-500">Products</div>
            </div>
            <div className="text-center border-x border-dark-500">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-sm text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">$2.5M</div>
              <div className="text-sm text-gray-500">Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent" />
    </div>
  );
}

/**
 * HeroSection Component
 * 
 * Landing page hero section with search and promotional content.
 */

import React, { useState } from 'react';

export interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [heroSearch, setHeroSearch] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(heroSearch);
  };

  const popularSearches = ['AirPods Pro', 'MacBook', 'Gaming Mouse', 'Headphones', 'Kindle'];

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 animated-gradient noise"></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent-purple/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-pink/15 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000"></div>
      <div className="absolute top-40 right-1/4 w-48 h-48 bg-accent-cyan/10 rounded-full blur-[80px] animate-float"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-lime opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-lime"></span>
            </span>
            <span className="text-sm text-gray-300 font-medium">Compare prices across 10,000+ deals</span>
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
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto animate-slide-up">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple via-accent-pink to-accent-orange rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative flex items-center gap-2 bg-dark-700 rounded-xl p-2">
                <div className="flex-1 flex items-center gap-3 pl-4">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg py-3"
                    placeholder="Search for products..."
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold rounded-lg hover:opacity-90 transition-all active:scale-95"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
          
          {/* Popular Searches */}
          <div className="flex flex-wrap justify-center gap-2 animate-fade-in">
            <span className="text-gray-500 text-sm">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => { setHeroSearch(term); onSearch(term); }}
                className="px-3 py-1 text-sm text-gray-400 hover:text-white bg-dark-600/50 hover:bg-dark-500 rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
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
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent"></div>
    </div>
  );
}

export default HeroSection;

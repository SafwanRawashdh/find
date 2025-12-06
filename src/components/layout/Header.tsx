/**
 * Header Component
 * 
 * Main navigation header with search and user actions.
 */

import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useCart } from '../../providers/CartProvider';

export type AppView = 'home' | 'favorites' | 'cart' | 'profile';

export interface HeaderProps {
  onSearch: (query: string) => void;
  onNavigate: (view: AppView) => void;
  currentView: AppView;
}

export function Header({ onSearch, onNavigate, currentView }: HeaderProps) {
  const { isAuthenticated, user, signOut, useDemoMode, isLoading } = useAuth();
  const { totalItems } = useCart();
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView !== 'home') {
      onNavigate('home');
    }
    onSearch(searchInput);
  };

  const handleLogoClick = () => {
    onNavigate('home');
    setSearchInput('');
    onSearch('');
  };

  const hasFavorites = user?.favorites && user.favorites.length > 0;

  return (
    <header className="glass sticky top-0 z-40 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div 
          className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" 
          onClick={handleLogoClick}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple to-accent-pink rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-10 h-10 bg-dark-700 rounded-xl flex items-center justify-center border border-white/10">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight">
            <span className="gradient-text">FIND</span>
          </span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-xl relative">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 blur transition duration-300"></div>
            <div className="relative flex items-center bg-dark-700/80 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
              <svg className="w-5 h-5 text-gray-500 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 py-2.5 px-3 text-sm"
                placeholder="Search for a product..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  onSearch(e.target.value);
                }}
              />
              {searchInput && (
                <button 
                  type="button"
                  onClick={() => { setSearchInput(''); onSearch(''); }}
                  className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Navigation & Auth Section */}
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <button
            onClick={() => onNavigate('cart')}
            className={`relative p-2 rounded-lg transition-all ${
              currentView === 'cart'
                ? 'bg-accent-cyan/20 text-accent-cyan'
                : 'text-gray-400 hover:text-white hover:bg-dark-600'
            }`}
            title="Shopping Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-cyan rounded-full flex items-center justify-center text-xs font-bold text-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Favorites Link */}
              <button 
                onClick={() => onNavigate('favorites')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'favorites' 
                    ? 'bg-accent-purple/20 text-accent-purple' 
                    : 'text-gray-400 hover:text-white hover:bg-dark-600'
                }`}
                title="View Favorites"
              >
                <svg 
                  className={`w-5 h-5 transition-all ${hasFavorites ? 'text-accent-pink' : ''}`}
                  fill={hasFavorites ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:inline">Favorites</span>
                {hasFavorites && (
                  <span className="w-2 h-2 bg-accent-pink rounded-full animate-pulse"></span>
                )}
              </button>

              <div className="h-6 w-px bg-dark-500 mx-1 hidden sm:block"></div>

              {/* User Profile */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('profile')}
                  className="relative group"
                  title="Profile"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity"></div>
                  <div className={`relative h-10 w-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-full flex items-center justify-center font-bold text-white text-sm border-2 border-dark-900 transition-all ${
                    currentView === 'profile' ? 'ring-2 ring-accent-purple' : ''
                  }`}>
                    {user?.displayName.charAt(0).toUpperCase()}
                  </div>
                </button>
                <button 
                  onClick={() => {
                    signOut();
                    onNavigate('home');
                  }}
                  className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-dark-600 transition-colors"
                  title="Sign Out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={useDemoMode}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={useDemoMode}
                disabled={isLoading}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple to-accent-pink rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative block px-4 py-2 bg-dark-800 rounded-lg text-sm font-medium text-white">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading
                    </span>
                  ) : 'Sign Up Free'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

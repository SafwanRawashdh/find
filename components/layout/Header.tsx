import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onSearch: (query: string) => void;
  onNavigate: (view: 'home' | 'favorites') => void;
  currentView: 'home' | 'favorites';
}

const Header: React.FC<HeaderProps> = ({ onSearch, onNavigate, currentView }) => {
  const { isLoggedIn, user, login, logout, isLoading } = useAuth();
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
  }

  // Determine if user has favorites to toggle heart style
  const hasFavorites = user?.favorites && user.favorites.length > 0;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">FIND</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-2xl relative">
          <input
            type="text"
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="Search for a product... e.g. 'Headphones'"
            value={searchInput}
            onChange={(e) => {
                setSearchInput(e.target.value);
                onSearch(e.target.value);
            }}
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-brand-600 rounded-full hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Favorites Link */}
              <button 
                onClick={() => onNavigate('favorites')}
                className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                    currentView === 'favorites' ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
                }`}
                title="View Favorites"
              >
                <svg 
                  className="w-4 h-4 transition-all" 
                  fill={hasFavorites ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:inline">Favorites</span>
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500">Welcome,</p>
                <p className="text-sm font-semibold text-gray-800">{user?.displayName}</p>
              </div>
              <div className="h-9 w-9 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold border border-brand-200">
                {user?.displayName.charAt(0)}
              </div>
              <button 
                onClick={() => {
                    logout();
                    onNavigate('home');
                }}
                className="text-sm text-gray-600 hover:text-red-500 font-medium px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => login('guest@example.com', 'password')}
                disabled={isLoading}
                className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 text-sm"
              >
                Log In
              </button>
              <button 
                onClick={() => login('guest@example.com', 'password')}
                disabled={isLoading}
                className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2 rounded-full text-sm shadow-sm transition-colors"
              >
                {isLoading ? '...' : 'Sign Up'}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
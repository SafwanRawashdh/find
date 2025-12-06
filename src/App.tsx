/**
 * FIND - Fast Integrated Network of Deals
 * 
 * Main Application Component
 */

import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { CartProvider } from './providers/CartProvider';
import { Header, NotificationBar, type AppView } from './components/layout';
import { HeroSection } from './features/search';
import { LoadingSpinner } from './components/common';
import type { IProduct, IFilterState, Marketplace } from './types';
import { getProducts } from './services/products.service';

// Import existing components from root (will be migrated later)
import Filters from '../components/filters/Filters';
import ProductRow from '../components/products/ProductRow';
import ProductModal from '../components/products/ProductModal';
import FavoritesPage from '../pages/FavoritesPage';
import CartPage from '../pages/CartPage';
import ProfilePage from '../pages/ProfilePage';

// Utility for debouncing function calls
function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function(this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * Main Layout Component
 * 
 * Contains the main application layout and routing logic.
 */
function MainLayout() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<IFilterState>({
    query: '',
    minPrice: '',
    maxPrice: '',
    sources: {
      AMAZON: true,
      EBAY: true,
    },
    sortBy: 'rating_desc',
    shippingCountry: 'US',
    condition: 'all',
    currency: 'USD',
    category: 'all',
  });

  // Fetch products when filters change
  useEffect(() => {
    if (currentView !== 'home') return;
    if (!hasSearched && !filters.query) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const result = await getProducts({ filters });
        setProducts(result.products);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [filters, currentView, hasSearched]);

  // Create a stable debounced search function
  const debouncedUpdate = useRef(
    debounce((query: string) => {
      setFilters(prev => ({ ...prev, query }));
      setCurrentView('home');
      setHasSearched(true);
    }, 500)
  ).current;

  const handleSearch = (query: string) => {
    debouncedUpdate(query);
  };

  const handleHeroSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
    setHasSearched(true);
    setCurrentView('home');
  };

  // Filter products by marketplace
  const amazonProducts = products.filter(p => p.marketplace === 'AMAZON');
  const ebayProducts = products.filter(p => p.marketplace === 'EBAY');

  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans">
      <NotificationBar />
      <Header onSearch={handleSearch} onNavigate={setCurrentView} currentView={currentView} />

      <main>
        {currentView === 'home' ? (
          <>
            {/* Show Hero when no search has been performed */}
            {!hasSearched && <HeroSection onSearch={handleHeroSearch} />}
            
            {/* Show Results */}
            {hasSearched && (
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[150px]"></div>
                <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-pink/5 rounded-full blur-[120px]"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar Filters */}
                    <aside className="lg:w-72 flex-shrink-0">
                      <div className="sticky top-24">
                        <Filters filters={filters} setFilters={setFilters} />
                      </div>
                    </aside>

                    {/* Main Content */}
                    <section className="flex-1 min-w-0">
                      
                      {/* Search Status Bar */}
                      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          {filters.query && (
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm glass-light text-gray-200">
                              <svg className="w-4 h-4 mr-2 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              "{filters.query}"
                              <button 
                                onClick={() => { setFilters(prev => ({ ...prev, query: '' })); setHasSearched(false); }}
                                className="ml-2 hover:text-accent-pink transition-colors"
                              >
                                ×
                              </button>
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {products.length} results found
                        </span>
                      </div>

                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                          <LoadingSpinner size="lg" message="Searching marketplaces..." />
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {filters.sources.AMAZON && (
                            <ProductRow 
                              title="Amazon Results" 
                              items={amazonProducts} 
                              colorClass="from-amazon to-amazon-dark"
                              marketplace="amazon"
                              onViewDetails={setSelectedProduct}
                            />
                          )}
                          {filters.sources.EBAY && (
                            <ProductRow 
                              title="eBay Results" 
                              items={ebayProducts} 
                              colorClass="from-ebay to-ebay-blue"
                              marketplace="ebay"
                              onViewDetails={setSelectedProduct}
                            />
                          )}
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : currentView === 'favorites' ? (
          <FavoritesPage />
        ) : currentView === 'cart' ? (
          <CartPage />
        ) : currentView === 'profile' ? (
          <ProfilePage />
        ) : null}
      </main>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}

/**
 * App Root
 * 
 * Wraps the application with providers.
 */
export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

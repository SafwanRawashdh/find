import React, { useState, useEffect, useRef } from 'react';
import Header from './components/layout/Header';
import NotificationBar from './components/layout/NotificationBar';
import Filters from './components/filters/Filters';
import ProductRow from './components/products/ProductRow';
import ProductModal from './components/products/ProductModal';
import FavoritesPage from './pages/FavoritesPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IProduct, IFilterState, Marketplace } from './types';
import { productService } from './services/mockBackend';

// Utility for debouncing function calls
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

const MainLayout: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'favorites'>('home');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Filter State
  const [filters, setFilters] = useState<IFilterState>({
    query: '',
    minPrice: '',
    maxPrice: '',
    sources: {
      [Marketplace.AMAZON]: true,
      [Marketplace.EBAY]: true,
    },
    sortBy: 'rating_desc',
    shippingCountry: 'US',
    condition: 'all',
    currency: 'USD',
    category: 'all',
  });

  // Fetch Logic (only for Home)
  useEffect(() => {
    if (currentView !== 'home') return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productService.search(filters);
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce a bit for realistic feel
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [filters, currentView]);

  // Create a stable debounced search function
  const debouncedUpdate = useRef(
    debounce((query: string) => {
      setFilters(prev => ({ ...prev, query }));
      setCurrentView('home');
    }, 500)
  ).current;

  const handleSearch = (query: string) => {
    debouncedUpdate(query);
  };

  const amazonProducts = products.filter(p => p.marketplace === Marketplace.AMAZON);
  const ebayProducts = products.filter(p => p.marketplace === Marketplace.EBAY);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <NotificationBar />
      <Header onSearch={handleSearch} onNavigate={setCurrentView} currentView={currentView} />

      <main>
        {currentView === 'home' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Sidebar Filters */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="sticky top-24 bg-gray-50">
                  <Filters filters={filters} setFilters={setFilters} />
                </div>
              </aside>

              {/* Main Content */}
              <section className="flex-1 min-w-0">
                
                {/* Filter Chips / Active Status */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {filters.query && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800">
                        Search: "{filters.query}"
                        <button onClick={() => handleSearch('')} className="ml-2 hover:text-red-500">×</button>
                      </span>
                    )}
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm">Searching marketplaces...</p>
                  </div>
                ) : (
                  <>
                    {filters.sources[Marketplace.AMAZON] && (
                      <ProductRow 
                          title="Amazon Results" 
                          items={amazonProducts} 
                          colorClass="bg-orange-500"
                          onViewDetails={setSelectedProduct}
                        />
                    )}
                    {filters.sources[Marketplace.EBAY] && (
                      <ProductRow 
                          title="eBay Results" 
                          items={ebayProducts} 
                          colorClass="bg-blue-600"
                          onViewDetails={setSelectedProduct}
                      />
                    )}
                  </>
                )}
              </section>
            </div>
          </div>
        ) : (
          <FavoritesPage />
        )}
      </main>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default App;
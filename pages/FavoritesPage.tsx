import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IProduct } from '../types';
import { supabaseProductService as productService } from '../services/supabaseService';
import ProductCard from '../components/products/ProductCard';
import ProductModal from '../components/products/ProductModal';

const FavoritesPage: React.FC = () => {
  const { user, isLoggedIn, login } = useAuth();
  const [favorites, setFavorites] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFavorites = async () => {
      if (!isLoggedIn || !user?.favorites) {
        if (isMounted) {
          setFavorites([]);
          setLoading(false);
        }
        return;
      }

      if (user.favorites.length === 0) {
        if (isMounted) {
          setFavorites([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const data = await productService.getProductsByIds(user.favorites);
        if (isMounted) {
          setFavorites(data);
        }
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFavorites();

    return () => { isMounted = false; };
  }, [user?.favorites, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="glass rounded-3xl p-12 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center">
              <svg className="h-10 w-10 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Sign In Required</h2>
            <p className="text-gray-400 mb-8">Log in to view and manage your favorite products from Amazon and eBay.</p>
            <button 
              onClick={() => login('guest@example.com', 'password')}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:opacity-90 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[150px]"></div>
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-pink/5 rounded-full blur-[120px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">My Favorites</h1>
            </div>
            <p className="text-gray-400">Your saved products from Amazon and eBay</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold glass-light text-accent-purple">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favorites.length} {favorites.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 glass rounded-2xl">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-dark-500 border-t-accent-purple rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-accent-pink rounded-full animate-spin animation-delay-150"></div>
            </div>
            <p className="mt-4 text-gray-400 text-sm font-medium">Loading your favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl border border-dashed border-dark-400">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-600 flex items-center justify-center">
              <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No favorites yet</h3>
            <p className="text-gray-400 max-w-sm mx-auto">Products you mark as favorites while browsing will appear here for quick access.</p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-2 text-sm text-accent-purple">
                <span>Tip:</span>
                <span className="text-gray-400">Click the</span>
                <svg className="w-5 h-5 text-accent-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-gray-400">icon on any product</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product, index) => (
              <div 
                key={product._id} 
                className="flex justify-center animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard 
                  product={product} 
                  onViewDetails={setSelectedProduct} 
                />
              </div>
            ))}
          </div>
        )}

        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

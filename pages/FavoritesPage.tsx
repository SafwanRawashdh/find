import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IProduct } from '../types';
import { productService } from '../services/mockBackend';
import ProductCard from '../components/products/ProductCard';
import ProductModal from '../components/products/ProductModal';

const FavoritesPage: React.FC = () => {
  const { user, isLoggedIn } = useAuth();
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

      // Optimistic check: if favorites array is empty, clear list immediately
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 inline-block">
            <div className="bg-gray-100 p-4 rounded-full inline-flex mb-4">
                <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
            <p className="text-gray-500">You need to be logged in to view your favorite products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-500 mt-1">Manage your saved products from Amazon and eBay.</p>
        </div>
        <div className="hidden sm:block">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-800 border border-brand-200">
                {favorites.length} {favorites.length === 1 ? 'Item' : 'Items'}
            </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
           <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
           <p className="mt-4 text-gray-500 text-sm font-medium">Loading your favorites...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
            <div className="bg-gray-50 p-4 rounded-full shadow-inner inline-flex mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No favorites yet</h3>
            <p className="mt-2 text-gray-500 max-w-sm mx-auto">Items you mark as favorites while browsing will appear here for quick access.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map(product => (
                <div key={product._id} className="flex justify-center transition-all duration-300 hover:-translate-y-1">
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
  );
};

export default FavoritesPage;
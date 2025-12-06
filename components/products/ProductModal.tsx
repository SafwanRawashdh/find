import React, { useState, useMemo } from 'react';
import { IProduct, Marketplace } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import PriceAlertModal from './PriceAlertModal';
import PriceHistoryChart from './PriceHistoryChart';

interface ProductModalProps {
  product: IProduct | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { isLoggedIn, login, user, toggleFavorite } = useAuth();
  const { addToCart } = useCart();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const recentHistory = useMemo(() => {
    if (!product) return [];
    
    let history = product.priceHistory || [];
    
    if (history.length < 2) {
      history = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const price = product.price * (0.9 + Math.random() * 0.2);
        return {
          date: d.toISOString().split('T')[0],
          price: i === 6 ? product.price : price
        };
      });
    }

    return history.slice(-7);
  }, [product]);

  if (!product) return null;

  const isAmazon = product.marketplace === Marketplace.AMAZON;
  const isFavorite = user?.favorites?.includes(product._id) || false;

  const handleFavoriteAction = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!isLoggedIn) {
      if (window.confirm("You must be logged in to add favorites. Log in now?")) {
        await login('guest@example.com', 'pass');
      }
    } else {
      await toggleFavorite(product._id);
    }
  };

  const handleAlertAction = () => {
    if (!isLoggedIn) {
      if (window.confirm("You must be logged in to set price alerts. Log in now?")) {
        login('guest@example.com', 'pass');
      }
    } else {
      setIsAlertModalOpen(true);
    }
  };

  const purchaseUrl = product.productUrl || (isAmazon 
    ? `https://www.amazon.com/s?k=${encodeURIComponent(product.title)}` 
    : `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(product.title)}`);

  const amazonUrl = (isAmazon && product.productUrl) 
    ? product.productUrl 
    : `https://www.amazon.com/s?k=${encodeURIComponent(product.title)}`;

  const startPrice = recentHistory.length > 0 ? recentHistory[0].price : product.price;
  const isTrendingDown = product.price < startPrice;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-dark-900/90 backdrop-blur-md transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Modal Panel */}
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-2xl glass text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl animate-scale-in">
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-white z-10 transition-all"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left: Image & Chart */}
              <div className="md:w-1/2 bg-dark-700/50 p-8 flex flex-col items-center justify-center">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="max-h-[280px] object-contain mb-8" 
                />

                {/* Price History Chart */}
                <div className="w-full glass-light rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-white">7-Day Price History</h4>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      isTrendingDown 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isTrendingDown ? '↓ Trending Down' : '↑ Trending Up'}
                    </span>
                  </div>
                  <PriceHistoryChart 
                    data={recentHistory} 
                    width={350} 
                    height={140} 
                    showAxes={true} 
                    color={isAmazon ? '#ff9900' : '#e53238'}
                  />
                </div>
              </div>

              {/* Right: Info */}
              <div className="md:w-1/2 p-8 flex flex-col">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                    isAmazon 
                      ? 'bg-amazon/20 text-amazon border border-amazon/30' 
                      : 'bg-ebay/20 text-ebay border border-ebay/30'
                  }`}>
                    {isAmazon ? 'Amazon' : 'eBay'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold capitalize ${
                    product.condition === 'new' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {product.condition}
                  </span>
                </div>

                {/* Title and Favorite Button */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {product.title}
                  </h3>
                  <button 
                    onClick={handleFavoriteAction}
                    className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                      isFavorite 
                        ? 'text-accent-pink bg-accent-pink/20' 
                        : 'text-gray-500 hover:text-accent-pink hover:bg-dark-500'
                    }`}
                  >
                    <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-dark-500'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-accent-purple font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({product.ratingCount.toLocaleString()} reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">${product.price.toFixed(2)}</span>
                    <span className="text-lg text-gray-500">{product.currency}</span>
                  </div>
                  <p className="text-sm text-green-400 font-medium mt-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Estimated delivery: {product.shippingEstimate}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  {product.description || "No description available for this product. Check the marketplace for more details."}
                </p>

                {/* Action Buttons */}
                <div className="mt-auto space-y-3">
                  <button
                    onClick={() => {
                      addToCart(product);
                      setAddedToCart(true);
                      setTimeout(() => setAddedToCart(false), 2000);
                    }}
                    className={`w-full py-3.5 px-4 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 ${
                      addedToCart
                        ? 'bg-green-500'
                        : 'bg-gradient-to-r from-accent-cyan to-accent-purple'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>

                  <a 
                    href={purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center py-3.5 px-4 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                      isAmazon 
                        ? 'bg-gradient-to-r from-amazon to-amazon-dark' 
                        : 'bg-gradient-to-r from-ebay to-ebay-blue'
                    }`}
                  >
                    Buy on {isAmazon ? 'Amazon' : 'eBay'}
                  </a>
                  
                  {!isAmazon && (
                    <a 
                      href={amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3 px-4 rounded-xl border border-amazon/50 text-amazon hover:bg-amazon/10 font-medium transition-colors"
                    >
                      Also check on Amazon
                    </a>
                  )}

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={handleAlertAction}
                      className="py-3 px-3 rounded-xl border border-dark-400 text-gray-300 hover:text-accent-cyan hover:border-accent-cyan/50 hover:bg-accent-cyan/5 text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Price Alert
                    </button>
                    
                    <button 
                      onClick={(e) => handleFavoriteAction(e)}
                      className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        isFavorite 
                          ? 'border-accent-pink/50 bg-accent-pink/10 text-accent-pink' 
                          : 'border-dark-400 text-gray-300 hover:text-accent-pink hover:border-accent-pink/50 hover:bg-accent-pink/5'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {isFavorite ? 'Saved' : 'Favorite'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isAlertModalOpen && (
        <PriceAlertModal 
          product={product} 
          onClose={() => setIsAlertModalOpen(false)} 
        />
      )}
    </>
  );
};

export default ProductModal;

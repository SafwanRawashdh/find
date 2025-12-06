import React, { useState, useMemo } from 'react';
import { IProduct, Marketplace } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import PriceAlertModal from './PriceAlertModal';
import PriceHistoryChart from './PriceHistoryChart';

interface ProductCardProps {
  product: IProduct;
  onViewDetails: (product: IProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { isLoggedIn, login, user, toggleFavorite } = useAuth();
  const { addToCart } = useCart();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const isAmazon = product.marketplace === Marketplace.AMAZON;
  const isFavorite = isLoggedIn && user?.favorites?.includes(product._id);

  // Generate or slice history to last 7 days
  const recentHistory = useMemo(() => {
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

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      if (window.confirm("You must be logged in to add favorites. Log in now?")) {
        login('guest@example.com', 'pass');
      }
    } else {
      toggleFavorite(product._id);
    }
  };

  const handleAlertClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
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

  // Determine trend
  const trendColor = recentHistory.length > 0 && recentHistory[0].price > product.price 
    ? "#22c55e" 
    : "#ef4444";
  
  const trendDown = recentHistory.length > 0 && recentHistory[0].price > product.price;

  return (
    <>
      <div className="group flex-shrink-0 w-72 glass rounded-2xl overflow-hidden card-hover relative">
        {/* Image Area */}
        <div 
          className="h-52 w-full bg-dark-600/50 p-6 flex items-center justify-center cursor-pointer relative overflow-hidden"
          onClick={() => onViewDetails(product)}
        >
          {/* Background glow */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isAmazon ? 'bg-amazon/5' : 'bg-ebay/5'}`}></div>
          
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" 
          />
          
          {/* Marketplace Badge */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase flex items-center gap-1.5 ${
            isAmazon 
              ? 'bg-amazon/20 text-amazon border border-amazon/30' 
              : 'bg-ebay/20 text-ebay border border-ebay/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAmazon ? 'bg-amazon' : 'bg-ebay'}`}></span>
            {isAmazon ? 'Amazon' : 'eBay'}
          </div>
          
          {/* Condition Badge for Used Items */}
          {product.condition === 'used' && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Used
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start gap-2 mb-3">
            <h4 
              className="text-sm font-medium text-gray-200 line-clamp-2 min-h-[40px] cursor-pointer hover:text-white transition-colors flex-1"
              onClick={() => onViewDetails(product)}
              title={product.title}
            >
              {product.title}
            </h4>
            
            <div className="flex flex-col gap-1">
              {/* Favorite Button */}
              <button 
                onClick={handleFavorite}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                  isFavorite 
                    ? 'text-accent-pink bg-accent-pink/10' 
                    : 'text-gray-500 hover:text-accent-pink hover:bg-dark-500'
                }`}
              >
                <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Price Alert Button */}
              <button
                onClick={handleAlertClick}
                aria-label="Set Price Alert"
                className="flex-shrink-0 p-2 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-dark-500 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-dark-500'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.ratingCount.toLocaleString()})</span>
          </div>

          {/* Price & Chart */}
          <div className="mt-auto">
            <div className="flex justify-between items-end mb-3">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium flex items-center gap-1 ${trendDown ? 'text-green-400' : 'text-red-400'}`}>
                    <svg className={`w-3 h-3 ${trendDown ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    {trendDown ? 'Price dropped' : 'Price rose'}
                  </span>
                </div>
              </div>
              {/* Mini Sparkline Chart */}
              <div className="opacity-70 group-hover:opacity-100 transition-opacity" title="7-Day Price Trend">
                <PriceHistoryChart 
                  data={recentHistory} 
                  width={70} 
                  height={30} 
                  color={trendColor} 
                />
              </div>
            </div>
            
            {/* Shipping Info */}
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-4">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Arrives: {product.shippingEstimate}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <button 
                onClick={() => onViewDetails(product)}
                className="flex-1 py-2.5 px-3 bg-dark-500 border border-dark-400 text-gray-300 text-sm font-medium rounded-lg hover:bg-dark-400 hover:text-white transition-all"
              >
                Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                className={`flex-1 py-2.5 px-3 text-white text-sm font-medium rounded-lg shadow-lg transition-all flex items-center justify-center gap-1.5 ${
                  addedToCart
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90'
                }`}
              >
                {addedToCart ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>
            <a 
              href={purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-2.5 px-3 text-white text-sm font-medium rounded-lg shadow-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                isAmazon 
                  ? 'bg-gradient-to-r from-amazon to-amazon-dark hover:opacity-90' 
                  : 'bg-gradient-to-r from-ebay to-ebay-blue hover:opacity-90'
              }`}
            >
              Buy Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
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

export default ProductCard;

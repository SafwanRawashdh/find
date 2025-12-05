import React, { useState } from 'react';
import { IProduct, Marketplace } from '../../types';
import { useAuth } from '../../context/AuthContext';
import PriceAlertModal from './PriceAlertModal';

interface ProductCardProps {
  product: IProduct;
  onViewDetails: (product: IProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { isLoggedIn, login, user, toggleFavorite } = useAuth();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  
  const isAmazon = product.marketplace === Marketplace.AMAZON;
  // Check if product is in user's favorites list. If user is null, isFavorite is false.
  const isFavorite = user?.favorites?.includes(product._id) || false;

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click (view details)
    
    if (!isLoggedIn) {
      // Prompt guest to login
      if (window.confirm("You must be logged in to add favorites. Log in now?")) {
        login('guest@example.com', 'pass');
      }
    } else {
      // Toggle favorite
      toggleFavorite(product._id);
    }
  };

  const handleAlertClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    
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

  return (
    <>
      <div 
        className="group flex-shrink-0 w-64 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden relative"
      >
        {/* Image Area */}
        <div 
          className="h-48 w-full bg-gray-50 p-4 flex items-center justify-center cursor-pointer relative"
          onClick={() => onViewDetails(product)}
        >
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
          />
          
          {/* Marketplace Badge */}
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${isAmazon ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
            {isAmazon ? 'Amazon' : 'eBay'}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h4 
              className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] cursor-pointer hover:text-brand-600 flex-1"
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
                className={`flex-shrink-0 p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500 ${
                  isFavorite 
                    ? 'text-red-500 hover:bg-red-50' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                }`}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? (
                   // Solid Heart (Logged in & Favorite)
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                   </svg>
                ) : (
                   // Outline Heart (Not logged in OR Not favorite)
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                   </svg>
                )}
              </button>

              {/* Price Alert Bell Button */}
              <button
                onClick={handleAlertClick}
                aria-label="Set Price Alert"
                className="flex-shrink-0 p-1.5 rounded-full text-gray-400 hover:text-brand-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500"
                title="Set Price Alert"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-xs font-medium text-gray-700">{product.rating}</span>
              <span className="text-[10px] text-gray-400">({product.ratingCount})</span>
          </div>

          {/* Price */}
          <div className="mt-auto">
              <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500">{product.currency}</span>
              </div>
              <p className="text-[10px] text-green-600 font-medium mt-1">
                  Arrives: {product.shippingEstimate}
              </p>
          </div>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-2">
              <button 
                  onClick={() => onViewDetails(product)}
                  className="flex-1 py-1.5 px-3 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors"
              >
                  View details
              </button>
              <a 
                  href={purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Buy ${product.title} on ${isAmazon ? 'Amazon' : 'eBay'}`}
                  className={`flex-1 py-1.5 px-3 text-white text-xs font-medium rounded shadow-sm transition-colors text-center flex items-center justify-center gap-1 ${isAmazon ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                  Buy on {isAmazon ? 'Amazon' : 'eBay'}
                  <svg className="w-3 h-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
import React, { useState, useMemo } from 'react';
import { IProduct, Marketplace } from '../../types';
import { useAuth } from '../../context/AuthContext';
import PriceAlertModal from './PriceAlertModal';
import PriceHistoryChart from './PriceHistoryChart';

interface ProductModalProps {
  product: IProduct | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { isLoggedIn, login, user, toggleFavorite } = useAuth();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Generate or slice history to last 7 days
  const recentHistory = useMemo(() => {
    if (!product) return [];
    
    let history = product.priceHistory || [];
    
    // Fallback mock data if history is empty
    if (history.length < 2) {
      history = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        // Random price +/- 10% of current price
        const price = product.price * (0.9 + Math.random() * 0.2);
        return {
          date: d.toISOString().split('T')[0],
          price: i === 6 ? product.price : price
        };
      });
    }

    // Return last 7 entries
    return history.slice(-7);
  }, [product]);

  if (!product) return null;

  const isAmazon = product.marketplace === Marketplace.AMAZON;
  // Check if product is in user's favorites list. Safe check for null user/favorites.
  const isFavorite = user?.favorites?.includes(product._id) || false;

  const handleFavoriteAction = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!isLoggedIn) {
      // Prompt guest to login
      if (window.confirm("You must be logged in to add favorites. Log in now?")) {
        await login('guest@example.com', 'pass');
      }
    } else {
      // Toggle favorite status
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

  // Determine trend
  const startPrice = recentHistory.length > 0 ? recentHistory[0].price : product.price;
  const isTrendingDown = product.price < startPrice;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900/75 transition-opacity backdrop-blur-sm" onClick={onClose}></div>

        {/* Modal Panel */}
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 z-10 p-1 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left: Image & Chart */}
              <div className="md:w-1/2 bg-gray-50 p-8 flex flex-col items-center justify-center border-r border-gray-100">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="max-h-[300px] object-contain mix-blend-multiply mb-8" 
                />

                {/* Detailed Price History Chart */}
                <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="text-sm font-semibold text-gray-700">7-Day Price History</h4>
                     <span className={`text-xs font-bold px-2 py-0.5 rounded ${isTrendingDown ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isTrendingDown ? 'Trending Down' : 'Trending Up'}
                     </span>
                  </div>
                  <PriceHistoryChart 
                    data={recentHistory} 
                    width={400} 
                    height={150} 
                    showAxes={true} 
                    color={isAmazon ? '#f97316' : '#2563eb'}
                  />
                </div>
              </div>

              {/* Right: Info */}
              <div className="md:w-1/2 p-8 flex flex-col">
                <div className="mb-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAmazon ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                    {isAmazon ? 'Sold by Amazon' : 'Sold on eBay'}
                  </span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                    {product.condition}
                  </span>
                </div>

                {/* Title and Secondary Favorite Button */}
                <div className="flex items-start justify-between gap-4 mt-2">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {product.title}
                  </h3>
                  <button 
                    onClick={handleFavoriteAction}
                    className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                    title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    {isFavorite ? (
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(Math.round(product.rating))}
                    <span className="text-gray-200">{'★'.repeat(5 - Math.round(product.rating))}</span>
                  </div>
                  <span className="text-sm text-gray-500 underline">{product.ratingCount.toLocaleString()} reviews</span>
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">{product.currency}</span>
                </div>
                <p className="text-sm text-green-600 font-medium mt-1 mb-6">
                  Estimated delivery: {product.shippingEstimate}
                </p>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {product.description || "No description available for this product. Check the marketplace for more details."}
                </p>

                <div className="mt-auto space-y-3">
                  <a 
                    href={purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${isAmazon ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    Complete Purchase on {isAmazon ? 'Amazon' : 'eBay'}
                  </a>
                  
                  {!isAmazon && (
                    <a 
                      href={amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-2 px-4 rounded-lg border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 font-medium transition-colors"
                    >
                      View on Amazon
                    </a>
                  )}

                  {/* Advanced User Actions */}
                  <div className="grid grid-cols-2 gap-3">
                      <button 
                          onClick={handleAlertAction}
                          className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 active:scale-[0.98] ${
                              isLoggedIn 
                              ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                              : 'border-dashed border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          Set Price Alert
                      </button>
                      
                      {/* Primary Add to Favorites Button */}
                      <button 
                          onClick={(e) => handleFavoriteAction(e)}
                          className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                              isLoggedIn 
                              ? (isFavorite ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-300 hover:text-red-500')
                              : 'border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                      >
                          {isFavorite ? (
                            // Solid Heart (Favorite)
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          ) : (
                            // Outline Heart (Not Favorite)
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                          
                          {isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
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
import React, { useState } from 'react';
import { IProduct } from '../../types';

interface PriceAlertModalProps {
  product: IProduct;
  onClose: () => void;
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ product, onClose }) => {
  const [targetPrice, setTargetPrice] = useState<number>(() => Math.floor(product.price * 0.9));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Price alert set for ${product.title} at ${product.currency} ${targetPrice}`);
    onClose();
  };

  const percentOff = ((product.price - targetPrice) / product.price * 100).toFixed(0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-0" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark-900/90 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal Panel */}
      <div className="relative transform overflow-hidden rounded-2xl glass text-left shadow-2xl transition-all sm:w-full sm:max-w-md animate-scale-in">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white" id="modal-title">Set Price Alert</h3>
              <p className="mt-1 text-sm text-gray-400">
                Get notified when the price drops
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-dark-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-6">
            {/* Product Preview */}
            <div className="flex items-center gap-4 p-4 glass-light rounded-xl mb-6">
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-16 h-16 object-contain rounded-lg bg-dark-600/50 p-2"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium line-clamp-2">{product.title}</p>
                <p className="text-lg font-bold text-white mt-1">${product.price.toFixed(2)}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Alert me when price drops to
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-gray-500 font-medium">$</span>
                </div>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(parseFloat(e.target.value))}
                  className="w-full bg-dark-600 border border-dark-400 rounded-xl pl-8 pr-20 py-3.5 text-white text-lg font-bold focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-xs font-medium text-accent-lime bg-accent-lime/20 px-2 py-1 rounded-lg">
                    {percentOff}% off
                  </span>
                </div>
              </div>
              
              {/* Quick Select Buttons */}
              <div className="flex gap-2 mt-3">
                {[5, 10, 15, 20].map((percent) => (
                  <button
                    key={percent}
                    type="button"
                    onClick={() => setTargetPrice(Math.floor(product.price * (1 - percent / 100)))}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                      parseInt(percentOff) === percent
                        ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                        : 'bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500 border border-transparent'
                    }`}
                  >
                    -{percent}%
                  </button>
                ))}
              </div>
              
              <div className="mt-6 flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 py-3 px-4 rounded-xl bg-dark-600 border border-dark-400 text-gray-300 hover:text-white hover:bg-dark-500 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold hover:opacity-90 transition-all"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAlertModal;

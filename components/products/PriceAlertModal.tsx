import React, { useState } from 'react';
import { IProduct } from '../../types';

interface PriceAlertModalProps {
  product: IProduct;
  onClose: () => void;
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ product, onClose }) => {
  const [targetPrice, setTargetPrice] = useState<number>(() => Math.floor(product.price * 0.9)); // Default 10% drop

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    alert(`Price alert set for ${product.title} at ${product.currency} ${targetPrice}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0" aria-labelledby="modal-title" role="dialog" aria-modal="true">
       {/* Backdrop */}
       <div 
         className="fixed inset-0 bg-gray-900/75 transition-opacity backdrop-blur-sm" 
         onClick={onClose}
       ></div>
       
       {/* Modal Panel */}
       <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-md animate-fade-in">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
             <div className="sm:flex sm:items-start">
               <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 sm:mx-0 sm:h-10 sm:w-10">
                 <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                 </svg>
               </div>
               <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                 <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">Set Price Alert</h3>
                 <div className="mt-2">
                   <p className="text-sm text-gray-500">
                     Receive a notification when the price for <span className="font-medium text-gray-900">{product.title}</span> drops.
                   </p>
                   
                   <div className="mt-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-100">
                     <span className="text-sm text-gray-600">Current Price:</span>
                     <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                   </div>

                   <form onSubmit={handleSubmit} className="mt-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide">Target Price ({product.currency})</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(parseFloat(e.target.value))}
                          className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2 border"
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div className="mt-6 flex justify-end gap-3">
                        <button 
                          type="button" 
                          onClick={onClose} 
                          className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="inline-flex justify-center rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 sm:w-auto"
                        >
                          Create Alert
                        </button>
                      </div>
                   </form>
                 </div>
               </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default PriceAlertModal;
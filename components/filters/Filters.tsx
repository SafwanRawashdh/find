import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IFilterState, Marketplace } from '../../types';
import SavePresetModal from './SavePresetModal';

interface FiltersProps {
  filters: IFilterState;
  setFilters: React.Dispatch<React.SetStateAction<IFilterState>>;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
  const { isLoggedIn, login } = useAuth();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleInputChange = (field: keyof IFilterState, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const toggleSource = (source: Marketplace) => {
    setFilters(prev => ({
      ...prev,
      sources: { ...prev.sources, [source]: !prev.sources[source] }
    }));
  };

  const handleSavePreset = (name: string) => {
    // In a real application, this would save to the backend
    console.log(`Saving preset "${name}"`, filters);
    alert(`Preset "${name}" saved successfully!`);
    setIsSaveModalOpen(false);
  };

  // --- COMPONENT: LOCKED OVERLAY ---
  const LockedOverlay = ({ label }: { label: string }) => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-lg border border-gray-100/50">
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center max-w-[90%]">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-xs font-semibold text-gray-800 mb-1">{label}</p>
        <p className="text-[10px] text-gray-500 mb-2">Login required</p>
        <button 
          onClick={() => login('u', 'p')}
          className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700 transition-colors w-full"
        >
          Unlock
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-64 flex-shrink-0 space-y-8 pb-10">
        
        {/* BASIC FILTERS (Available to all) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Basic Filters</h3>
          
          {/* Sort */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
            <select 
              value={filters.sortBy}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
              className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 bg-white py-2 px-3 border"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="shipping_asc">Fastest Shipping</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="Min" 
                value={filters.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value ? Number(e.target.value) : '')}
                className="w-full text-sm border-gray-300 rounded-md shadow-sm border py-1.5 px-2"
              />
              <span className="text-gray-400">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={filters.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value ? Number(e.target.value) : '')}
                className="w-full text-sm border-gray-300 rounded-md shadow-sm border py-1.5 px-2"
              />
            </div>
          </div>

          {/* Sources */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Sources</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.sources[Marketplace.AMAZON]} 
                  onChange={() => toggleSource(Marketplace.AMAZON)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" 
                />
                <span className="text-sm text-gray-700">Amazon</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.sources[Marketplace.EBAY]} 
                  onChange={() => toggleSource(Marketplace.EBAY)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" 
                />
                <span className="text-sm text-gray-700">eBay</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* ADVANCED FILTERS (Locked for Guests) */}
        <div className="relative space-y-4">
          {!isLoggedIn && <LockedOverlay label="Advanced Filters" />}
          
          <div className={!isLoggedIn ? 'opacity-40 pointer-events-none select-none filter blur-[1px]' : ''}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Advanced</h3>
              {isLoggedIn && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Unlocked</span>}
            </div>

            {/* Category - NEW */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full text-sm border-gray-300 rounded-md shadow-sm bg-white py-2 px-3 border"
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Computers">Computers</option>
                <option value="Toys">Toys</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
              </select>
            </div>

            {/* Condition */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Condition</label>
              <select 
                value={filters.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className="w-full text-sm border-gray-300 rounded-md shadow-sm bg-white py-2 px-3 border"
              >
                <option value="all">Any Condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>

            {/* Shipping Country */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Shipping Destination</label>
              <select 
                value={filters.shippingCountry}
                onChange={(e) => handleInputChange('shippingCountry', e.target.value)}
                className="w-full text-sm border-gray-300 rounded-md shadow-sm bg-white py-2 px-3 border"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>

            {/* Currency */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Currency</label>
              <select 
                value={filters.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full text-sm border-gray-300 rounded-md shadow-sm bg-white py-2 px-3 border"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* Presets Action - Only visible when logged in */}
            {isLoggedIn && (
              <div className="mt-6">
                <button 
                  onClick={() => setIsSaveModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save Preset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isSaveModalOpen && (
        <SavePresetModal 
          onSave={handleSavePreset} 
          onClose={() => setIsSaveModalOpen(false)} 
        />
      )}
    </>
  );
};

export default Filters;
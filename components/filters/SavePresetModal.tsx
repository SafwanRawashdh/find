import React, { useState } from 'react';

interface SavePresetModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

const SavePresetModal: React.FC<SavePresetModalProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name);
    }
  };

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
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white" id="modal-title">Save Filter Preset</h3>
              <p className="mt-1 text-sm text-gray-400">
                Save your current filters for quick access
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
          
          <form onSubmit={handleSubmit} className="mt-6">
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Preset Name
            </label>
            <input 
              type="text" 
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-600 border border-dark-400 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors"
              placeholder="e.g. Headphones under $100"
            />
            
            {/* Suggested Names */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['Electronics Deals', 'Budget Finds', 'Premium Items', 'Gift Ideas'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setName(suggestion)}
                  className="px-3 py-1.5 text-xs font-medium bg-dark-600 text-gray-400 hover:text-white hover:bg-dark-500 rounded-lg transition-colors"
                >
                  {suggestion}
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
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Preset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SavePresetModal;

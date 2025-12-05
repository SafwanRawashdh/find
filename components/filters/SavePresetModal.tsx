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
                 <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                 </svg>
               </div>
               <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                 <h3 className="text-lg font-semibold leading-6 text-gray-900">Save Filter Preset</h3>
                 <div className="mt-2">
                   <p className="text-sm text-gray-500">
                     Give your current search filters a name to easily access them later.
                   </p>
                   
                   <form onSubmit={handleSubmit} className="mt-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Preset Name</label>
                      <input 
                        type="text" 
                        autoFocus
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm py-2 px-3 border"
                        placeholder="e.g. Headphones under $100"
                      />
                      
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
                          Save Preset
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

export default SavePresetModal;
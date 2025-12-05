import React from 'react';
import { IProduct, Marketplace } from '../../types';
import ProductCard from './ProductCard';

interface ProductRowProps {
  title: string;
  items: IProduct[];
  colorClass: string;
  onViewDetails: (product: IProduct) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ title, items, colorClass, onViewDetails }) => {
  return (
    <div className="mb-10 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className={`w-2 h-6 rounded-full ${colorClass}`}></span>
          {title}
          <span className="text-sm font-normal text-gray-500 ml-2">({items.length} found)</span>
        </h2>
        {items.length > 4 && <button className="text-sm text-brand-600 hover:underline">View All</button>}
      </div>
      
      {items.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500 border border-dashed border-gray-200">
          No products found matching your criteria.
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-4 pb-4 px-1 hide-scroll -mx-1">
          {items.map(product => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onViewDetails={onViewDetails} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductRow;
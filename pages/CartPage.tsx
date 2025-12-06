import React from 'react';
import { useCart } from '../context/CartContext';
import { Marketplace } from '../types';
import ProductModal from '../components/products/ProductModal';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice, getItemsByMarketplace } = useCart();
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);

  const amazonItems = getItemsByMarketplace(Marketplace.AMAZON);
  const ebayItems = getItemsByMarketplace(Marketplace.EBAY);
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[150px]"></div>
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-pink/5 rounded-full blur-[120px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20 glass rounded-2xl border border-dashed border-dark-400">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-600 flex items-center justify-center">
              <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-8">Add products from Amazon and eBay to get started!</p>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:opacity-90 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const CartSection = ({ 
    title, 
    items: sectionItems, 
    colorClass, 
    icon 
  }: { 
    title: string; 
    items: typeof items; 
    colorClass: string;
    icon: React.ReactNode;
  }) => {
    if (sectionItems.length === 0) return null;

    return (
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className="text-sm text-gray-500">({sectionItems.length} {sectionItems.length === 1 ? 'item' : 'items'})</span>
        </div>

        <div className="space-y-4">
          {sectionItems.map((item) => (
            <div
              key={item.product._id}
              className="glass rounded-xl p-5 hover:bg-dark-600/50 transition-all"
            >
              <div className="flex gap-5">
                {/* Product Image */}
                <div
                  className="w-24 h-24 flex-shrink-0 bg-dark-600 rounded-lg p-3 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedProduct(item.product)}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-semibold text-white mb-1 cursor-pointer hover:text-accent-purple transition-colors line-clamp-2"
                        onClick={() => setSelectedProduct(item.product)}
                      >
                        {item.product.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {item.product.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{item.product.condition}</span>
                        <span>•</span>
                        <span className="text-green-400">Arrives: {item.product.shippingEstimate}</span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-dark-500 transition-colors"
                      title="Remove from cart"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-400">Quantity:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-dark-600 hover:bg-dark-500 text-white flex items-center justify-center transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 text-center bg-dark-600 border border-dark-400 rounded-lg text-white text-sm focus:border-accent-purple focus:ring-1 focus:ring-accent-purple"
                        />
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-dark-600 hover:bg-dark-500 text-white flex items-center justify-center transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.product.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[150px]"></div>
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-pink/5 rounded-full blur-[120px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
            </div>
            <p className="text-gray-400">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 text-sm text-gray-400 hover:text-red-400 rounded-lg hover:bg-dark-600 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            <CartSection
              title="Amazon Products"
              items={amazonItems}
              colorClass="from-amazon to-amazon-dark"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.44-2.186 1.44-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.683zm3.186 7.705c-.209.189-.512.201-.745.074-1.052-.872-1.238-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095v-.41c0-.753.06-1.642-.384-2.294-.385-.579-1.124-.82-1.775-.82-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.549.582l-3.061-.333c-.259-.061-.548-.28-.474-.693C6.067 1.304 9.168 0 11.938 0c1.423 0 3.28.378 4.404 1.455 1.423 1.333 1.287 3.112 1.287 5.049v4.574c0 1.374.57 1.977 1.106 2.718.189.262.231.576-.005.772-.592.495-1.647 1.416-2.228 1.932-.003-.003-.007-.003-.01 0z"/>
                </svg>
              }
            />

            <CartSection
              title="eBay Products"
              items={ebayItems}
              colorClass="from-ebay to-ebay-blue"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.869 4.171c-.393-.186-.934-.109-1.088.188-.155.298.023.609.444.844l8.205 4.584c.213.119.432.144.613.093l.039-.015 8.205-4.584c.421-.235.599-.546.444-.844-.154-.297-.695-.374-1.088-.188l-8.203 4.586-8.571-4.664zm17.797 7.313l-5.583-3.112-5.375 3.004c-.192.107-.451.117-.613.019l-5.354-2.995-5.599 3.112c-.455.253-.633.584-.455.909.178.325.609.482 1.064.229l5.054-2.812 5.264 2.945c.181.101.458.098.621-.006l5.254-2.929 5.057 2.812c.455.253.886.096 1.064-.229.178-.325 0-.656-.455-.909zm0 4.632l-5.583-3.112-5.375 3.003c-.192.107-.451.117-.613.019l-5.354-2.995-5.599 3.112c-.455.253-.633.584-.455.909.178.325.609.482 1.064.229l5.054-2.812 5.264 2.945c.181.101.458.098.621-.006l5.254-2.929 5.057 2.812c.455.253.886.096 1.064-.229.178-.325 0-.656-.455-.909z"/>
                </svg>
              }
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Shipping</span>
                  <span className="text-white">Free</span>
                </div>
                <div className="border-t border-dark-500 pt-4">
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:opacity-90 transition-all"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full py-3 px-4 rounded-xl border border-dark-400 text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-dark-500">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default CartPage;


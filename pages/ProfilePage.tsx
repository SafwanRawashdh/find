import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProfilePage: React.FC = () => {
  const { user, isLoggedIn, login, logout } = useAuth();
  const { getTotalItems, getTotalPrice } = useCart();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'orders'>('profile');

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="glass rounded-3xl p-12 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center">
              <svg className="h-10 w-10 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Sign In Required</h2>
            <p className="text-gray-400 mb-8">Log in to view your profile and account settings.</p>
            <button
              onClick={() => login('guest@example.com', 'password')}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:opacity-90 transition-all"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Favorites', value: user?.favorites?.length || 0, icon: '❤️' },
    { label: 'Cart Items', value: getTotalItems(), icon: '🛒' },
    { label: 'Total Saved', value: `$${getTotalPrice().toFixed(2)}`, icon: '💰' },
    { label: 'Member Since', value: '2024', icon: '⭐' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[150px]"></div>
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-pink/5 rounded-full blur-[120px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-accent-purple to-accent-pink rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-dark-900">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-dark-700 rounded-full border-2 border-dark-900 hover:bg-dark-600 transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{user?.displayName || 'User'}</h1>
              <p className="text-gray-400 mb-4">{user?.email || 'No email'}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
                  Premium Member
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                  Verified Account
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-light rounded-xl p-4 text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
            { id: 'orders', label: 'Orders', icon: '📦' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white'
                  : 'glass text-gray-400 hover:text-white hover:bg-dark-600'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'profile' && (
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                  <input
                    type="text"
                    defaultValue={user?.displayName}
                    className="w-full px-4 py-3 bg-dark-600 border border-dark-400 rounded-xl text-white focus:border-accent-purple focus:ring-1 focus:ring-accent-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-3 bg-dark-600 border border-dark-400 rounded-xl text-white focus:border-accent-purple focus:ring-1 focus:ring-accent-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Default Country</label>
                  <select className="w-full px-4 py-3 bg-dark-600 border border-dark-400 rounded-xl text-white focus:border-accent-purple focus:ring-1 focus:ring-accent-purple">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Default Currency</label>
                  <select className="w-full px-4 py-3 bg-dark-600 border border-dark-400 rounded-xl text-white focus:border-accent-purple focus:ring-1 focus:ring-accent-purple">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:opacity-90 transition-all">
                  Save Changes
                </button>
                <button className="px-6 py-3 rounded-xl border border-dark-400 text-gray-300 hover:text-white hover:bg-dark-600 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-dark-600/50 rounded-xl">
                  <div>
                    <h3 className="text-white font-medium mb-1">Email Notifications</h3>
                    <p className="text-sm text-gray-400">Receive updates about price drops and new deals</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-600/50 rounded-xl">
                  <div>
                    <h3 className="text-white font-medium mb-1">Price Alerts</h3>
                    <p className="text-sm text-gray-400">Get notified when prices drop on your favorites</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-600/50 rounded-xl">
                  <div>
                    <h3 className="text-white font-medium mb-1">Marketing Emails</h3>
                    <p className="text-sm text-gray-400">Receive promotional offers and newsletters</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-dark-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
                  </label>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-dark-500">
                <h3 className="text-xl font-bold text-white mb-4">Danger Zone</h3>
                <button
                  onClick={logout}
                  className="px-6 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-600 flex items-center justify-center">
                  <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                <p className="text-gray-400 mb-8">Your completed orders will appear here</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:opacity-90 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


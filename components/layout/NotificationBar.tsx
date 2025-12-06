import React from 'react';
import { useAuth } from '../../context/AuthContext';

const NotificationBar: React.FC = () => {
  const { isLoggedIn, login } = useAuth();

  if (isLoggedIn) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-accent-purple/90 via-accent-pink/90 to-accent-orange/90 text-white py-2.5 px-4">
      {/* Animated shine effect */}
      <div className="absolute inset-0 shimmer"></div>
      
      <div className="relative flex items-center justify-center gap-2 text-sm">
        <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">
          Unlock price alerts, favorites & advanced filters — 
        </span>
        <button 
          onClick={() => login('guest@example.com', 'pass')} 
          className="font-bold underline underline-offset-2 hover:no-underline transition-all"
        >
          Sign in free →
        </button>
      </div>
    </div>
  );
};

export default NotificationBar;

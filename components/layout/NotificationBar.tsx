import React from 'react';
import { useAuth } from '../../context/AuthContext';

const NotificationBar: React.FC = () => {
  const { isLoggedIn, login } = useAuth();

  if (isLoggedIn) return null;

  return (
    <div className="bg-slate-900 text-white py-2 px-4 text-center text-sm font-medium">
      <span className="opacity-90">Log in to unlock advanced filters, favorites, and price alerts.</span>
      <button 
        onClick={() => login('guest@example.com', 'pass')} 
        className="ml-3 text-brand-300 hover:text-white underline underline-offset-2 transition-colors"
      >
        Sign in now
      </button>
    </div>
  );
};

export default NotificationBar;

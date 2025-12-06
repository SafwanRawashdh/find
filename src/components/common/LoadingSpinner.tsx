import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-dark-500 border-t-accent-purple rounded-full animate-spin`}
        />
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-accent-pink rounded-full animate-spin animation-delay-150`}
        />
      </div>
      {message && (
        <p className="text-gray-400 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;

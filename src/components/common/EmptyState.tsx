import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  tip?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  tip,
  className = '',
}) => {
  return (
    <div className={`text-center py-20 glass rounded-2xl border border-dashed border-dark-400 ${className}`}>
      {icon && (
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-600 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:opacity-90 transition-all"
        >
          {action.label}
        </button>
      )}
      {tip && (
        <div className="mt-8 flex justify-center">
          {tip}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

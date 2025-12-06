import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        text-center py-16 px-4
        glass rounded-2xl
        border border-dashed border-dark-400
        ${className}
      `}
    >
      {icon && (
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-dark-600 flex items-center justify-center text-gray-500">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 max-w-sm mx-auto mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}

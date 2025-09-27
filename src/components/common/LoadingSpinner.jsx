import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className={`${sizeClasses[size]} animate-spin`}>
          <svg
            className="w-full h-full text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        
        {message && (
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// Skeleton loading component for better UX
export const SkeletonLoader = ({ className = '', rows = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

// Card skeleton for ETF cards
export const ETFCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
        <div className="text-right">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-14"></div>
        </div>
      </div>
      
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  );
};

export default LoadingSpinner;

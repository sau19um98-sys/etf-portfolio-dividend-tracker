import React from 'react';
import { ClockIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const DelayedDataIndicator = ({ 
  isDelayed = true, 
  lastUpdated, 
  dataSource = 'Polygon Starter Plan',
  size = 'small',
  showDetails = false 
}) => {
  if (!isDelayed) return null;

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const sizeClasses = {
    small: {
      container: 'text-xs',
      icon: 'h-3 w-3',
      badge: 'px-1.5 py-0.5'
    },
    medium: {
      container: 'text-sm',
      icon: 'h-4 w-4',
      badge: 'px-2 py-1'
    },
    large: {
      container: 'text-base',
      icon: 'h-5 w-5',
      badge: 'px-3 py-1.5'
    }
  };

  const classes = sizeClasses[size];

  if (showDetails) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Delayed Market Data
            </h4>
            <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              <p>Data is delayed by approximately 15 minutes due to Polygon.io Starter plan limitations.</p>
              <div className="mt-2 space-y-1 text-xs">
                <p><strong>Data Source:</strong> {dataSource}</p>
                <p><strong>Last Updated:</strong> {formatLastUpdated(lastUpdated)}</p>
                <p><strong>Update Frequency:</strong> End-of-day prices only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 ${classes.container}`}>
      <span 
        className={`inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full ${classes.badge} font-medium`}
        title={`Data delayed ~15 minutes. Last updated: ${formatLastUpdated(lastUpdated)}`}
      >
        <ClockIcon className={classes.icon} />
        <span>Delayed</span>
      </span>
    </div>
  );
};

// Component for showing data freshness
export const DataFreshnessIndicator = ({ lastUpdated, className = '' }) => {
  const getStatusColor = (timestamp) => {
    if (!timestamp) return 'gray';
    
    const now = new Date();
    const updated = new Date(timestamp);
    const diffHours = (now - updated) / (1000 * 60 * 60);
    
    if (diffHours < 1) return 'green';
    if (diffHours < 24) return 'yellow';
    return 'red';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never updated';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just updated';
    }
  };

  const color = getStatusColor(lastUpdated);
  const colorClasses = {
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
    gray: 'text-gray-500 dark:text-gray-400'
  };

  return (
    <div className={`inline-flex items-center gap-1 text-xs ${colorClasses[color]} ${className}`}>
      <div className={`w-2 h-2 rounded-full ${
        color === 'green' ? 'bg-green-500' :
        color === 'yellow' ? 'bg-yellow-500' :
        color === 'red' ? 'bg-red-500' : 'bg-gray-400'
      }`} />
      <span>{formatTime(lastUpdated)}</span>
    </div>
  );
};

// Component for showing API plan limitations
export const PlanLimitationBanner = ({ plan = 'Starter' }) => {
  const limitations = {
    Starter: {
      title: 'Polygon.io Starter Plan',
      features: [
        '15-minute delayed data',
        'End-of-day prices only',
        '5 API calls per minute',
        'No real-time quotes'
      ],
      color: 'blue'
    },
    Free: {
      title: 'Polygon.io Free Tier',
      features: [
        'End-of-day data only',
        '5 API calls per minute',
        '2 years historical data',
        'No real-time features'
      ],
      color: 'gray'
    }
  };

  const config = limitations[plan] || limitations.Starter;
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    gray: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200'
  };

  return (
    <div className={`border rounded-lg p-3 ${colorClasses[config.color]}`}>
      <div className="flex items-start gap-2">
        <InformationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium">{config.title} Limitations</h4>
          <ul className="mt-1 text-xs space-y-0.5">
            {config.features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DelayedDataIndicator;

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

// Custom notification components
const SuccessNotification = ({ message, description }) => (
  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-200 dark:border-green-800">
    <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-medium text-gray-900 dark:text-white">{message}</p>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      )}
    </div>
  </div>
);

const ErrorNotification = ({ message, description }) => (
  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-200 dark:border-red-800">
    <XCircleIcon className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-medium text-gray-900 dark:text-white">{message}</p>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      )}
    </div>
  </div>
);

const WarningNotification = ({ message, description }) => (
  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-yellow-200 dark:border-yellow-800">
    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-medium text-gray-900 dark:text-white">{message}</p>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      )}
    </div>
  </div>
);

const InfoNotification = ({ message, description }) => (
  <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-200 dark:border-blue-800">
    <InformationCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-medium text-gray-900 dark:text-white">{message}</p>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      )}
    </div>
  </div>
);

// Notification service
export const notifications = {
  success: (message, description = null, options = {}) => {
    toast.custom(
      <SuccessNotification message={message} description={description} />,
      {
        duration: 4000,
        position: 'top-right',
        ...options
      }
    );
  },

  error: (message, description = null, options = {}) => {
    toast.custom(
      <ErrorNotification message={message} description={description} />,
      {
        duration: 6000,
        position: 'top-right',
        ...options
      }
    );
  },

  warning: (message, description = null, options = {}) => {
    toast.custom(
      <WarningNotification message={message} description={description} />,
      {
        duration: 5000,
        position: 'top-right',
        ...options
      }
    );
  },

  info: (message, description = null, options = {}) => {
    toast.custom(
      <InfoNotification message={message} description={description} />,
      {
        duration: 4000,
        position: 'top-right',
        ...options
      }
    );
  },

  // Loading notification with promise handling
  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong'
      },
      {
        position: 'top-right',
        ...options
      }
    );
  },

  // Dismiss all notifications
  dismiss: () => {
    toast.dismiss();
  }
};

// Pre-built notification messages for common actions
export const commonNotifications = {
  // Portfolio actions
  portfolioAdded: (etfSymbol) => 
    notifications.success(
      'ETF Added to Portfolio',
      `${etfSymbol} has been successfully added to your portfolio.`
    ),

  portfolioRemoved: (etfSymbol) =>
    notifications.success(
      'ETF Removed',
      `${etfSymbol} has been removed from your portfolio.`
    ),

  portfolioCleared: () =>
    notifications.warning(
      'Portfolio Cleared',
      'All holdings have been removed from your portfolio.'
    ),

  // Data refresh
  dataRefreshed: () =>
    notifications.success(
      'Data Refreshed',
      'Market data has been updated with the latest information.'
    ),

  dataRefreshError: () =>
    notifications.error(
      'Refresh Failed',
      'Unable to refresh market data. Please try again later.'
    ),

  dataRefreshCooldown: (timeRemaining) =>
    notifications.warning(
      'Refresh Limit Reached',
      `Please wait ${timeRemaining} before refreshing data again.`
    ),

  // Authentication
  loginSuccess: () =>
    notifications.success(
      'Welcome Back!',
      'You have been successfully logged in.'
    ),

  loginError: () =>
    notifications.error(
      'Login Failed',
      'Please check your credentials and try again.'
    ),

  logoutSuccess: () =>
    notifications.info(
      'Logged Out',
      'You have been successfully logged out.'
    ),

  // Settings
  settingsSaved: () =>
    notifications.success(
      'Settings Saved',
      'Your preferences have been updated.'
    ),

  // Network errors
  networkError: () =>
    notifications.error(
      'Connection Error',
      'Please check your internet connection and try again.'
    ),

  serverError: () =>
    notifications.error(
      'Server Error',
      'Our servers are experiencing issues. Please try again later.'
    ),

  // API errors
  apiKeyInvalid: () =>
    notifications.error(
      'API Configuration Error',
      'Invalid API credentials. Please contact support.'
    ),

  rateLimitExceeded: () =>
    notifications.warning(
      'Rate Limit Exceeded',
      'Too many requests. Please wait a moment before trying again.'
    )
};

// Main Toaster component to be included in App.jsx
const NotificationSystem = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
          margin: 0
        }
      }}
    />
  );
};

export default NotificationSystem;

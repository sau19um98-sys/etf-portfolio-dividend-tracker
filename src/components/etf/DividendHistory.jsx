import { useState } from 'react';
import { CalendarIcon, CurrencyDollarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { formatCurrency, formatDate } from '../../data/mockData';

const DividendHistory = ({ history, symbol }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Show last 3 payments by default, or all if showAll is true
  const displayHistory = showAll ? history : history.slice(0, 3);
  
  // Calculate growth rate
  const calculateGrowthRate = () => {
    if (history.length < 2) return 0;
    const latest = history[0].amount;
    const previous = history[1].amount;
    return ((latest - previous) / previous) * 100;
  };

  const growthRate = calculateGrowthRate();
  const totalDividends = history.reduce((sum, payment) => sum + payment.amount, 0);
  const averageDividend = totalDividends / history.length;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <CurrencyDollarIcon className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Latest</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(history[0]?.amount || 0)}
          </p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <ArrowTrendingUpIcon className={`w-5 h-5 mx-auto mb-1 ${growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          <p className="text-xs text-gray-500 dark:text-gray-400">Growth</p>
          <p className={`text-lg font-bold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
          </p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <CalendarIcon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(averageDividend)}
          </p>
        </div>
      </div>

      {/* Payment History */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Payments
          </h4>
          {history.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              {showAll ? 'Show Less' : `Show All (${history.length})`}
            </button>
          )}
        </div>

        <div className="space-y-2">
          {displayHistory.map((payment, index) => {
            const isLatest = index === 0;
            const previousPayment = history[index + 1];
            const changeFromPrevious = previousPayment 
              ? ((payment.amount - previousPayment.amount) / previousPayment.amount) * 100 
              : 0;

            return (
              <div 
                key={index} 
                className={`
                  relative flex justify-between items-center p-4 rounded-lg transition-all duration-200 hover:shadow-md
                  ${isLatest 
                    ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800' 
                    : 'bg-gray-50 dark:bg-gray-700/50'
                  }
                `}
              >
                {isLatest && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(payment.date)}
                    </p>
                    {isLatest && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                        Latest
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Ex: {formatDate(payment.exDate)}</span>
                    <span>Declared: {formatDate(payment.declarationDate)}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(payment.amount)}
                  </p>
                  {previousPayment && (
                    <p className={`text-xs font-medium ${
                      changeFromPrevious >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {changeFromPrevious >= 0 ? '+' : ''}{changeFromPrevious.toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dividend Frequency Info */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {symbol} Dividend Schedule
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Payments are typically made quarterly
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
              {history.length} payments tracked
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Total: {formatCurrency(totalDividends)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DividendHistory;

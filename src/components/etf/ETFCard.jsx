import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { formatCurrency, formatPercent, formatDate } from '../../data/mockData';
import DelayedDataIndicator from '../common/DelayedDataIndicator';

const ETFCard = ({ etf, onSelect, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = etf.change >= 0;
  
  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
          : 'hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]'
        }
        bg-white dark:bg-gray-800 shadow-lg
        ${isHovered ? 'shadow-2xl' : ''}
      `}
      onClick={() => onSelect(etf)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {etf.id}
              </h3>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {etf.sector}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
              {etf.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              AUM: ${etf.aum} • ER: {etf.expenseRatio}%
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(etf.price)}
            </div>
            <div className={`flex items-center justify-end text-sm font-medium ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              <span>
                {formatCurrency(Math.abs(etf.change))} ({isPositive ? '+' : ''}{etf.changePercent.toFixed(2)}%)
              </span>
            </div>
            <div className="mt-1">
              <DelayedDataIndicator 
                isDelayed={true} 
                size="small"
                dataSource="Polygon Starter"
              />
            </div>
          </div>
        </div>

        {/* Dividend Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Current Dividend</p>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(etf.dividend)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              {etf.dividendYield.toFixed(2)}% yield
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="w-3 h-3 text-blue-500" />
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Ex-Date</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatDate(etf.exDividendDate)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pay: {formatDate(etf.paymentDate)}
            </p>
          </div>
        </div>

        {/* Next Payment Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Next Payment</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatDate(etf.nextExDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">{etf.frequency}</p>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {Math.ceil((new Date(etf.nextExDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <button 
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
              ${isSelected 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            <ChartBarIcon className="w-4 h-4" />
            {isSelected ? 'Selected' : 'View Details'}
          </button>
        </div>

        {/* Hover effect indicator */}
        <div className={`
          absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300
          ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}
        `} />
      </div>
    </div>
  );
};

export default ETFCard;

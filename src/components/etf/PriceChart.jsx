import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ data, symbol, timeframe = '30D', dividendPerformanceHistory = [] }) => {
  const chartRef = useRef(null);
  const { isDark } = useTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [activeChart, setActiveChart] = useState('price');

  // Calculate price change
  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = firstPrice !== 0 ? (priceChange / firstPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  // Filter data based on timeframe
  const getFilteredData = () => {
    const days = selectedTimeframe === '7D' ? 7 : selectedTimeframe === '30D' ? 30 : data.length;
    return data.slice(-days);
  };

  const filteredData = getFilteredData();

  // Prepare dividend performance data
  const dividendYearlyData = (dividendPerformanceHistory || [])
    .filter(item => item.isYearSummary)
    .slice(0, 5)
    .reverse(); // Show oldest to newest

  const dividendChartData = {
    labels: dividendYearlyData.map(item => item.year.toString()),
    datasets: [
      {
        label: 'Annual Dividend',
        data: dividendYearlyData.map(item => item.totalAmount),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const chartData = {
    labels: filteredData.map(item => {
      const date = new Date(item.date);
      return selectedTimeframe === '7D' 
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Price',
        data: filteredData.map(item => item.price),
        borderColor: isPositive 
          ? 'rgba(34, 197, 94, 1)' 
          : 'rgba(239, 68, 68, 1)',
        backgroundColor: isPositive 
          ? 'rgba(34, 197, 94, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: isDark ? '#1f2937' : '#ffffff',
        pointBorderColor: isPositive 
          ? 'rgba(34, 197, 94, 1)' 
          : 'rgba(239, 68, 68, 1)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: isPositive 
          ? 'rgba(34, 197, 94, 1)' 
          : 'rgba(239, 68, 68, 1)',
        pointHoverBorderColor: isDark ? '#1f2937' : '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#f9fafb' : '#111827',
        bodyColor: isDark ? '#f9fafb' : '#111827',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        titleFont: { size: 12, weight: 'normal' },
        bodyFont: { size: 14, weight: 'bold' },
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(context) {
            const dataIndex = context[0].dataIndex;
            const date = new Date(filteredData[dataIndex].date);
            return date.toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
          },
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: selectedTimeframe === '7D' ? 7 : 8,
          font: {
            size: 11
          }
        },
        border: {
          color: isDark ? '#374151' : '#e5e7eb',
        }
      },
      y: {
        grid: {
          color: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.8)',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          callback: function(value) {
            return `$${value.toFixed(0)}`;
          },
          font: {
            size: 11
          }
        },
        border: {
          display: false,
        }
      },
    },
    elements: {
      point: {
        hoverRadius: 8,
      }
    }
  };

  const dividendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#f9fafb' : '#111827',
        bodyColor: isDark ? '#f9fafb' : '#111827',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        titleFont: { size: 12, weight: 'normal' },
        bodyFont: { size: 14, weight: 'bold' },
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `${context[0].label} Annual Dividend`;
          },
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            size: 11
          }
        },
        border: {
          color: isDark ? '#374151' : '#e5e7eb',
        }
      },
      y: {
        grid: {
          color: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.8)',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          callback: function(value) {
            return `$${value.toFixed(2)}`;
          },
          font: {
            size: 11
          }
        },
        border: {
          display: false,
        }
      },
    },
  };

  const timeframes = ['7D', '30D', 'ALL'];
  const chartTypes = [
    { id: 'price', label: 'Price Chart', icon: '📈' },
    { id: 'dividend', label: 'Dividend Performance', icon: '💰' }
  ];

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {chartTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveChart(type.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 ${
                activeChart === type.id
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header with stats and timeframe selector */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {symbol} {activeChart === 'price' ? 'Price Chart' : 'Dividend Performance (5 Years)'}
          </h3>
          <div className="flex items-center gap-4">
            {activeChart === 'price' ? (
              <>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${lastPrice.toFixed(2)}
                  </p>
                  <p className={`text-sm font-medium flex items-center gap-1 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span>{isPositive ? '↗' : '↘'}</span>
                    {isPositive ? '+' : ''}${Math.abs(priceChange).toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Period: {selectedTimeframe}</p>
                  <p>High: ${Math.max(...filteredData.map(d => d.price)).toFixed(2)}</p>
                  <p>Low: ${Math.min(...filteredData.map(d => d.price)).toFixed(2)}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${dividendYearlyData.length > 0 ? dividendYearlyData[dividendYearlyData.length - 1]?.totalAmount.toFixed(2) : '0.00'}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    Latest Annual Dividend
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>5-Year Range</p>
                  <p>High: ${dividendYearlyData.length > 0 ? Math.max(...dividendYearlyData.map(d => d.totalAmount)).toFixed(2) : '0.00'}</p>
                  <p>Low: ${dividendYearlyData.length > 0 ? Math.min(...dividendYearlyData.map(d => d.totalAmount)).toFixed(2) : '0.00'}</p>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Only show timeframe selector for price chart */}
        {activeChart === 'price' && (
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedTimeframe === tf
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="relative h-80 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        {activeChart === 'price' ? (
          <Line ref={chartRef} data={chartData} options={options} />
        ) : (
          <Bar data={dividendChartData} options={dividendOptions} />
        )}
      </div>

      {/* Chart insights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {activeChart === 'price' ? (
          <>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Volatility</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {(() => {
                  const prices = filteredData.map(d => d.price);
                  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
                  const variance = prices.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / prices.length;
                  const stdDev = Math.sqrt(variance);
                  return ((stdDev / avg) * 100).toFixed(1);
                })()}%
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trend</p>
              <p className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? 'Bullish' : 'Bearish'}
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Range</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ${(Math.max(...filteredData.map(d => d.price)) - Math.min(...filteredData.map(d => d.price))).toFixed(2)}
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Average</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ${(filteredData.reduce((sum, d) => sum + d.price, 0) / filteredData.length).toFixed(2)}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">5-Year Growth</p>
              <p className="text-sm font-semibold text-green-600">
                {dividendYearlyData.length >= 2 ? (
                  ((dividendYearlyData[dividendYearlyData.length - 1]?.totalAmount - dividendYearlyData[0]?.totalAmount) / dividendYearlyData[0]?.totalAmount * 100).toFixed(1)
                ) : 0}%
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Annual</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ${dividendYearlyData.length > 0 ? (dividendYearlyData.reduce((sum, d) => sum + d.totalAmount, 0) / dividendYearlyData.length).toFixed(2) : '0.00'}
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Cycle</p>
              <p className="text-sm font-semibold text-blue-600">
                {dividendYearlyData.length > 0 ? dividendYearlyData[0]?.frequency || 'Quarterly' : 'Quarterly'}
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total 5-Year</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ${dividendYearlyData.reduce((sum, d) => sum + d.totalAmount, 0).toFixed(2)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PriceChart;

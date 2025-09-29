import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import EnhancedChart from '../components/EnhancedChart';
import { formatCurrency } from '../utils/formatters';

const EnhancedPortfolio = () => {
  const { 
    userHoldings, 
    realtimeStatus: { enabled: realtimeEnabled, connectionStatus, toggleRealtime } 
  } = usePortfolio();
  
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  
  // Prepare chart data from holdings
  useEffect(() => {
    if (userHoldings && userHoldings.length > 0) {
      // Prepare allocation data for pie chart
      const labels = userHoldings.map(holding => holding.symbol);
      const values = userHoldings.map(holding => holding.marketValue);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Portfolio Allocation',
            data: values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)',
              'rgba(199, 199, 199, 0.8)',
              'rgba(83, 102, 255, 0.8)',
              'rgba(40, 159, 64, 0.8)',
              'rgba(210, 199, 199, 0.8)',
            ],
            borderWidth: 1
          }
        ]
      });
    }
  }, [userHoldings]);
  
  // Calculate total portfolio value
  const totalValue = userHoldings.reduce((sum, holding) => sum + holding.marketValue, 0);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enhanced Portfolio</h1>
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
            connectionStatus === 'connected' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
              : connectionStatus === 'connecting' 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
          }`}>
            {connectionStatus === 'connected' ? 'Live' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
          </span>
          <button
            onClick={toggleRealtime}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              realtimeEnabled
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {realtimeEnabled ? 'Disable Real-time' : 'Enable Real-time'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Portfolio Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalValue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Holdings</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{userHoldings.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Data Status</p>
              <p className={`text-sm font-medium ${
                realtimeEnabled ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
              }`}>
                {realtimeEnabled ? 'Real-time Updates' : 'Standard Updates'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Portfolio Allocation Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Portfolio Allocation</h2>
          <EnhancedChart 
            data={chartData} 
            type="doughnut" 
            height={300} 
            options={{
              plugins: {
                legend: {
                  position: 'right'
                }
              }
            }}
          />
        </div>
        
        {/* Holdings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 col-span-1 lg:col-span-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Holdings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shares</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Market Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {userHoldings.map((holding) => (
                  <tr key={holding.symbol}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{holding.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{holding.shares}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(holding.currentPrice)}
                      {realtimeEnabled && holding.isRealtime && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          Live
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(holding.marketValue)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      holding.change >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPortfolio;
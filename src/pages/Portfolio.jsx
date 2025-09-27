import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import AddHoldingModal from '../components/portfolio/AddHoldingModal';
import { usePortfolio } from '../context/PortfolioContext';
import { portfolioData, etfData, formatCurrency, formatPercent, formatDate } from '../data/mockData';
import { getUpcomingDividendsWithStats } from '../services/upcomingDividendsService';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PlusIcon,
  ChartPieIcon,
  BanknotesIcon,
  ArrowLeftIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddHolding, setShowAddHolding] = useState(false);
  const { userHoldings, userTransactions, addHolding } = usePortfolio();
  const navigate = useNavigate();

  // Handle adding new holding
  const handleAddHolding = async (newHolding) => {
    try {
      await addHolding(newHolding);
      // Show success message or update UI as needed
    } catch (error) {
      console.error('Error adding holding:', error);
      alert('Error adding holding: ' + error.message);
    }
  };

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    // Combine mock data holdings with user holdings
    const allHoldings = [...portfolioData.holdings, ...userHoldings];
    const holdings = allHoldings;
    
    // Get current prices for each holding
    const enrichedHoldings = holdings.map(holding => {
      const etf = etfData.find(e => e.id === holding.id);
      const currentPrice = etf?.price || holding.avgPrice;
      const currentValue = currentPrice * holding.shares;
      const gainLoss = currentValue - holding.costBasis;
      const gainLossPercent = (gainLoss / holding.costBasis) * 100;
      
      // Calculate monthly dividend based on ETF data and shares owned
      let monthlyDividend = 0;
      if (etf && etf.dividend && etf.frequency) {
        const annualDividend = etf.dividend * holding.shares;
        if (etf.frequency === 'Monthly') {
          monthlyDividend = annualDividend / 12;
        } else if (etf.frequency === 'Quarterly') {
          monthlyDividend = annualDividend / 4 / 3; // Quarterly divided by 3 months
        } else if (etf.frequency === 'Semi-annual') {
          monthlyDividend = annualDividend / 2 / 6; // Semi-annual divided by 6 months
        } else if (etf.frequency === 'Annual') {
          monthlyDividend = annualDividend / 12;
        }
      } else if (holding.monthlyDividend) {
        // Use existing monthlyDividend for mock data
        monthlyDividend = holding.monthlyDividend;
      }
      
      return {
        ...holding,
        currentPrice,
        currentValue,
        gainLoss,
        gainLossPercent,
        monthlyDividend,
        etf
      };
    });
    const totalValue = enrichedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalCost = enrichedHoldings.reduce((sum, h) => sum + h.costBasis, 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = (totalGainLoss / totalCost) * 100;

    // Calculate upcoming dividends based on user's actual holding
    const upcomingDividendsData = getUpcomingDividendsWithStats(enrichedHoldings, etfData);

    return {
      enrichedHoldings,
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      totalMonthlyDividend: enrichedHoldings.reduce((sum, h) => sum + (h.monthlyDividend || 0), 0),
      upcomingDividends: upcomingDividendsData.dividends,
      upcomingDividendsStats: upcomingDividendsData.stats
    };
  }, [userHoldings, etfData]);

  const allocationData = {
    labels: portfolioMetrics.enrichedHoldings.map(h => h.id),
    datasets: [
      {
        data: portfolioMetrics.enrichedHoldings.map(h => h.currentValue),
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#8B5CF6', // Purple
          '#06B6D4', // Cyan
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartPieIcon },
    { id: 'holdings', name: 'Holdings', icon: BanknotesIcon },
    { id: 'transactions', name: 'Transactions', icon: CurrencyDollarIcon },
    { id: 'dividends', name: 'Dividends', icon: CalendarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(portfolioMetrics.totalValue)}
                </p>
                <div className={`flex items-center mt-1 ${
                  portfolioMetrics.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {portfolioMetrics.totalGainLoss >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {formatCurrency(Math.abs(portfolioMetrics.totalGainLoss))} ({portfolioMetrics.totalGainLossPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <ChartPieIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(portfolioData.monthlyIncome)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Annual: {formatCurrency(portfolioData.annualIncome)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Annual Yield</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {portfolioData.annualYield.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  vs S&P 500: 1.42%
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(portfolioMetrics.totalCost)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {portfolioMetrics.enrichedHoldings.length} positions
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <BanknotesIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Portfolio Allocation Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Portfolio Allocation
                  </h3>
                  <div className="h-80">
                    <Doughnut data={allocationData} options={chartOptions} />
                  </div>
                </div>

                {/* Top Holdings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Top Holdings
                  </h3>
                  <div className="space-y-4">
                    {portfolioMetrics.enrichedHoldings
                      .sort((a, b) => b.currentValue - a.currentValue)
                      .slice(0, 5)
                      .map((holding, index) => (
                        <div key={holding.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                {holding.id}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{holding.id}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {holding.shares} shares
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(holding.currentValue)}
                            </p>
                            <p className={`text-sm ${
                              holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {holding.gainLoss >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Holdings Tab */}
            {activeTab === 'holdings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    My Holdings
                  </h3>
                  <button
                    onClick={() => setShowAddHolding(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Holding</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Symbol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Shares
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Avg Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Current Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Market Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Gain/Loss
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Monthly Dividend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {portfolioMetrics.enrichedHoldings.map((holding) => (
                        <tr key={holding.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                  {holding.id}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {holding.id}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {holding.etf?.name || 'ETF Name'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {holding.shares}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(holding.avgPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(holding.currentPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(holding.currentValue)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            holding.gainLoss >= 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {holding.gainLoss >= 0 ? '+' : ''}
                            {formatCurrency(holding.gainLoss)} ({holding.gainLossPercent.toFixed(2)}%)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                            {formatCurrency(holding.monthlyDividend)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Recent Transactions
                </h3>
                <div className="space-y-4">
                  {/* User Transactions */}
                  {userTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            B
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Buy {transaction.symbol}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {transaction.shares} shares @ {formatCurrency(transaction.price)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total: {formatCurrency(transaction.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Mock Transactions */}
                  {portfolioData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === 'BUY' 
                            ? 'bg-blue-100 dark:bg-blue-900' 
                            : 'bg-green-100 dark:bg-green-900'
                        }`}>
                          <span className={`text-sm font-semibold ${
                            transaction.type === 'BUY' 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {transaction.type === 'BUY' ? 'B' : 'D'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.type === 'BUY' ? 'Buy' : 'Dividend'} {transaction.symbol}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {transaction.type === 'BUY' ? (
                          <>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {transaction.shares} shares @ {formatCurrency(transaction.price)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Total: {formatCurrency(transaction.total)}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-green-600 dark:text-green-400">
                              +{formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.shares} shares
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dividends Tab */}
            {activeTab === 'dividends' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Upcoming Dividends
                  </h3>
                  {portfolioMetrics.upcomingDividendsStats && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {portfolioMetrics.upcomingDividendsStats.totalUpcoming} upcoming payments
                      </p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(portfolioMetrics.upcomingDividendsStats.totalEstimatedIncome)}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {portfolioMetrics.upcomingDividends && portfolioMetrics.upcomingDividends.length > 0 ? (
                    portfolioMetrics.upcomingDividends.map((dividend, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                            {dividend.symbol}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {dividend.symbol} Dividend Payment
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Ex-Date: {formatDate(dividend.exDate)}</span>
                            <span>Pay Date: {formatDate(dividend.payDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(dividend.estimatedAmount)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {dividend.shares} shares
                        </p>
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No upcoming dividends found for your current holdings.
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        Add ETFs to your portfolio to see upcoming dividend payments.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Holding Modal */}
      <AddHoldingModal
        isOpen={showAddHolding}
        onClose={() => setShowAddHolding(false)}
        onAddHolding={handleAddHolding}
      />
    </div>
  );
};

export default Portfolio;

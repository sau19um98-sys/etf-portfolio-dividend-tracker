import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import ETFCard from '../components/etf/ETFCard';
import DividendHistory from '../components/etf/DividendHistory';
import PriceChart from '../components/etf/PriceChart';
import DelayedDataIndicator, { DataFreshnessIndicator, PlanLimitationBanner } from '../components/common/DelayedDataIndicator';
import { usePortfolio } from '../context/PortfolioContext';
import { etfData, marketData, formatCurrency } from '../data/mockData';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedETF, setSelectedETF] = useState(etfData[0]);
  const [sortBy, setSortBy] = useState('symbol');
  const [filterBy, setFilterBy] = useState('all');
  const { userHoldings } = usePortfolio();
  const navigate = useNavigate();

  // Filter and sort ETFs
  const filteredAndSortedETFs = useMemo(() => {
    let filtered = etfData.filter(etf => {
      const matchesSearch = etf.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           etf.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'dividend' && etf.dividendYield > 3) ||
                           (filterBy === 'growth' && etf.changePercent > 0) ||
                           (filterBy === 'sector' && etf.sector === filterBy);
      
      return matchesSearch && matchesFilter;
    });

    // Sort ETFs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'symbol':
          return a.id.localeCompare(b.id);
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.changePercent - a.changePercent;
        case 'dividend':
          return b.dividendYield - a.dividendYield;
        case 'aum':
          return parseFloat(b.aum.replace('B', '')) - parseFloat(a.aum.replace('B', ''));
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, sortBy, filterBy]);

  // Calculate market stats
  const marketStats = useMemo(() => {
    const totalETFs = etfData.length;
    const avgDividendYield = etfData.reduce((sum, etf) => sum + etf.dividendYield, 0) / totalETFs;
    const gainers = etfData.filter(etf => etf.changePercent > 0).length;
    const losers = etfData.filter(etf => etf.changePercent < 0).length;
    
    return {
      totalETFs,
      avgDividendYield,
      gainers,
      losers,
      unchanged: totalETFs - gainers - losers
    };
  }, []);

  const handleETFSelect = (etf) => {
    setSelectedETF(etf);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onSearch={handleSearch} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Overview */}
        <div className="mb-8">
          {/* Delayed Data Warning */}
          <div className="mb-6">
            <PlanLimitationBanner plan="Starter" />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Market Overview</h2>
            <div className="flex items-center gap-3">
              <DataFreshnessIndicator lastUpdated={new Date().toISOString()} />
              <DelayedDataIndicator 
                isDelayed={true} 
                lastUpdated={new Date().toISOString()}
                dataSource="Polygon Starter Plan"
                size="small"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total ETFs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{marketStats.totalETFs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Dividend Yield</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{marketStats.avgDividendYield.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gainers Today</p>
                  <p className="text-2xl font-bold text-green-600">{marketStats.gainers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-red-600 dark:text-red-400 rotate-180" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Losers Today</p>
                  <p className="text-2xl font-bold text-red-600">{marketStats.losers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All ETFs</option>
                <option value="dividend">High Dividend (&gt;3%)</option>
                <option value="growth">Gainers Today</option>
                <option value="Technology">Technology</option>
                <option value="Financial">Financial</option>
                <option value="Dividend">Dividend Focus</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="symbol">Symbol</option>
                <option value="price">Price</option>
                <option value="change">% Change</option>
                <option value="dividend">Dividend Yield</option>
                <option value="aum">Assets Under Management</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedETFs.length} of {etfData.length} ETFs
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ETF Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAndSortedETFs.map((etf) => (
                <ETFCard
                  key={etf.id}
                  etf={etf}
                  onSelect={handleETFSelect}
                  isSelected={selectedETF?.id === etf.id}
                />
              ))}
            </div>

            {filteredAndSortedETFs.length === 0 && (
              <div className="text-center py-12">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No ETFs found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>

          {/* Selected ETF Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {selectedETF && (
                <>
                  {/* ETF Info Panel */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedETF.id} Details
                      </h3>
                      <button
                        onClick={() => navigate('/portfolio')}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add to Portfolio
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedETF.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedETF.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Assets Under Management</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">${selectedETF.aum}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Expense Ratio</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedETF.expenseRatio}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Frequency</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedETF.frequency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Sector</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedETF.sector}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Chart */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <PriceChart 
                      data={selectedETF.priceHistory} 
                      symbol={selectedETF.id}
                      dividendPerformanceHistory={selectedETF.dividendPerformanceHistory || []}
                    />
                  </div>

                  {/* Dividend History */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                    <DividendHistory history={selectedETF.dividendHistory} symbol={selectedETF.id} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

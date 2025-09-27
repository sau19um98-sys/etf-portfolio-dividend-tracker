import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import { getRefreshInfo, performDataRefresh } from '../services/dataRefreshService';
import DelayedDataIndicator, { PlanLimitationBanner } from '../components/common/DelayedDataIndicator';
import {
  ArrowLeftIcon,
  UserCircleIcon,
  PaintBrushIcon,
  BellIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  KeyIcon,
  ShieldCheckIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const { clearHoldings } = usePortfolio();
  
  // Settings state
  const [settings, setSettings] = useState({
    // Display preferences
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    
    // Portfolio preferences
    defaultView: 'overview',
    defaultSort: 'symbol',
    showPercentages: true,
    showGainLoss: true,
    
    // Notification preferences
    dividendAlerts: true,
    priceAlerts: false,
    emailNotifications: true,
    pushNotifications: false,
    
    // Data preferences
    autoRefresh: true,
    lastRefreshDate: null, // Track last refresh date
    marketHoursOnly: true
  });

  const [activeTab, setActiveTab] = useState('display');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [refreshInfo, setRefreshInfo] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Load refresh info on mount and when account tab is active
  useEffect(() => {
    if (activeTab === 'account') {
      setRefreshInfo(getRefreshInfo());
    }
  }, [activeTab]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleClearPortfolio = () => {
    clearHoldings();
    setShowConfirmClear(false);
    // Show success message
    alert('Portfolio data cleared successfully');
  };

  const handleDataRefresh = async () => {
    setIsRefreshing(true);
    try {
      await performDataRefresh();
      setRefreshInfo(getRefreshInfo()); // Update refresh info
      alert('Data refreshed successfully! Latest market data has been loaded.');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const tabs = [
    { id: 'display', name: 'Display', icon: PaintBrushIcon },
    { id: 'portfolio', name: 'Portfolio', icon: ChartBarIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'account', name: 'Account', icon: UserCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Customize your ETF Dividend Tracker experience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              
              {/* Display Settings */}
              {activeTab === 'display' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Display Preferences</h2>
                  
                  {/* Theme */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred color scheme</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency Display
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => updateSetting('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => updateSetting('dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  {/* Decimal Places */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Decimal Places
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={settings.decimalPlaces}
                      onChange={(e) => updateSetting('decimalPlaces', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Portfolio Settings */}
              {activeTab === 'portfolio' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Portfolio Preferences</h2>
                  
                  {/* Default View */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Portfolio View
                    </label>
                    <select
                      value={settings.defaultView}
                      onChange={(e) => updateSetting('defaultView', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="overview">Overview</option>
                      <option value="holdings">Holdings</option>
                      <option value="transactions">Transactions</option>
                      <option value="dividends">Dividends</option>
                    </select>
                  </div>

                  {/* Default Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Holdings Sort
                    </label>
                    <select
                      value={settings.defaultSort}
                      onChange={(e) => updateSetting('defaultSort', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="symbol">Symbol</option>
                      <option value="value">Market Value</option>
                      <option value="gainLoss">Gain/Loss</option>
                      <option value="dividend">Dividend Yield</option>
                    </select>
                  </div>

                  {/* Display Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Display Options</h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Show Percentages</span>
                      <input
                        type="checkbox"
                        checked={settings.showPercentages}
                        onChange={(e) => updateSetting('showPercentages', e.target.checked)}
                        className="rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Show Gain/Loss</span>
                      <input
                        type="checkbox"
                        checked={settings.showGainLoss}
                        onChange={(e) => updateSetting('showGainLoss', e.target.checked)}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <BellIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900 dark:text-blue-100">Email Service Information</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Email notifications are powered by our backend service using Appwrite's built-in email functionality. 
                          No additional email server setup required.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dividend Alerts</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about upcoming ex-dividend dates</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.dividendAlerts}
                        onChange={(e) => updateSetting('dividendAlerts', e.target.checked)}
                        className="rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Price Alerts</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about significant price changes</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.priceAlerts}
                        onChange={(e) => updateSetting('priceAlerts', e.target.checked)}
                        className="rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive daily portfolio summaries via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                        className="rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Browser notifications for important updates</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Settings</h2>
                  
                  {/* User Info */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <UserCircleIcon className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{currentUser?.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ETF Dividend Tracker User</p>
                      </div>
                    </div>
                  </div>

                  {/* Data Refresh Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Management</h3>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <ArrowPathIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">Market Data Refresh</h4>
                          </div>
                          
                          {refreshInfo && (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-blue-700 dark:text-blue-300">Last Refresh:</span>
                                <span className="font-medium text-blue-900 dark:text-blue-100">
                                  {refreshInfo.lastRefreshFormatted}
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-blue-700 dark:text-blue-300">Next Available:</span>
                                <span className="font-medium text-blue-900 dark:text-blue-100">
                                  {refreshInfo.nextRefreshAvailable}
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-blue-700 dark:text-blue-300">Refresh Policy:</span>
                                <span className="font-medium text-blue-900 dark:text-blue-100">
                                  Every {refreshInfo.refreshPolicy}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-3 space-y-3">
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              Market data is refreshed using Polygon.io Starter Plan with the following limitations:
                            </p>
                            
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <DelayedDataIndicator 
                                  isDelayed={true} 
                                  size="small"
                                  dataSource="Polygon Starter Plan"
                                />
                                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                  Data Limitations
                                </span>
                              </div>
                              <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                                <li>• 15-minute delayed market data</li>
                                <li>• End-of-day prices only</li>
                                <li>• 5 API calls per minute limit</li>
                                <li>• 24-hour refresh cooldown to conserve API quota</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={handleDataRefresh}
                          disabled={!refreshInfo?.canRefresh || isRefreshing}
                          className={`ml-4 px-4 py-2 rounded-lg font-medium transition-all ${
                            refreshInfo?.canRefresh && !isRefreshing
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isRefreshing ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Refreshing...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <ArrowPathIcon className="h-4 w-4" />
                              Refresh Data
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                    
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-200">Clear Portfolio Data</h4>
                          <p className="text-sm text-red-600 dark:text-red-400">This will permanently delete all your holdings and transactions</p>
                        </div>
                        <button
                          onClick={() => setShowConfirmClear(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Clear Portfolio Data?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This action cannot be undone. All your holdings and transaction history will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleClearPortfolio}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

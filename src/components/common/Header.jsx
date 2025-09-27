import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { marketData } from '../../data/mockData';

const Header = ({ searchTerm, setSearchTerm, onSearch }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/portfolio':
        return 'My Portfolio';
      default:
        return 'ETF Tracker';
    }
  };

  const isMarketOpen = marketData.isOpen;
  const nextEvent = isMarketOpen ? 'Market Close' : 'Market Open';
  const nextTime = isMarketOpen ? marketData.nextClose : marketData.nextOpen;

  // Get current time in ET
  const getETTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getNextEventTime = () => {
    return new Date(nextTime).toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ET</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {getPageTitle()}
                </h1>
                <div className="flex items-center space-x-3 text-xs">
                  <span className={`font-semibold animate-pulse ${isMarketOpen ? 'text-green-500' : 'text-red-500'}`}>
                    {isMarketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {getETTime()} ET
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Search Bar */}
          {onSearch && (
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Search ETFs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    onSearch(e.target.value);
                  }}
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        onSearch('');
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
                      title="Clear search"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Market Indices */}
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 dark:text-gray-400">S&P 500:</span>
                <span className={`font-medium ${marketData.indices.sp500.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketData.indices.sp500.value.toLocaleString()}
                </span>
                <span className={`text-xs ${marketData.indices.sp500.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({marketData.indices.sp500.change >= 0 ? '+' : ''}{marketData.indices.sp500.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
              >
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">SCHD Dividend Payment</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Ex-date approaching on March 24th</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Portfolio Update</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Your portfolio is up 2.3% today</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
              >
                {currentUser?.photoURL ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8" />
                )}
                <span className="hidden md:block text-sm font-medium">
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {currentUser?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {currentUser?.email}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate('/');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ChartBarIcon className="h-4 w-4 mr-3" />
                      Dashboard
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/portfolio');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <UserCircleIcon className="h-4 w-4 mr-3" />
                      My Portfolio
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

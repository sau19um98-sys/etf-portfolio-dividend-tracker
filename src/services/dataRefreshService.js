// Data refresh service with 24-hour limit
// This service manages data refreshing with user-friendly limitations

const REFRESH_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const LAST_REFRESH_KEY = 'lastDataRefresh';

/**
 * Check if data can be refreshed (24-hour cooldown)
 * @returns {Object} { canRefresh: boolean, timeUntilNext: number, lastRefresh: Date|null }
 */
export const checkRefreshAvailability = () => {
  const lastRefreshStr = localStorage.getItem(LAST_REFRESH_KEY);
  
  if (!lastRefreshStr) {
    return {
      canRefresh: true,
      timeUntilNext: 0,
      lastRefresh: null
    };
  }
  
  const lastRefresh = new Date(lastRefreshStr);
  const now = new Date();
  const timeSinceLastRefresh = now - lastRefresh;
  const timeUntilNext = Math.max(0, REFRESH_COOLDOWN_MS - timeSinceLastRefresh);
  
  return {
    canRefresh: timeSinceLastRefresh >= REFRESH_COOLDOWN_MS,
    timeUntilNext,
    lastRefresh
  };
};

/**
 * Record a data refresh timestamp
 */
export const recordRefresh = () => {
  const now = new Date().toISOString();
  localStorage.setItem(LAST_REFRESH_KEY, now);
};

/**
 * Format time until next refresh in human-readable format
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatTimeUntilRefresh = (milliseconds) => {
  if (milliseconds <= 0) return 'Available now';
  
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Get refresh status for UI display
 * @returns {Object} Status object with display information
 */
export const getRefreshStatus = () => {
  const { canRefresh, timeUntilNext, lastRefresh } = checkRefreshAvailability();
  
  return {
    canRefresh,
    timeUntilNext,
    lastRefresh,
    timeUntilNextFormatted: formatTimeUntilRefresh(timeUntilNext),
    lastRefreshFormatted: lastRefresh 
      ? lastRefresh.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Never'
  };
};

/**
 * Perform data refresh using Polygon Starter plan
 * @param {Array} symbols - Array of ETF symbols to refresh
 * @returns {Promise<Object>} Refresh result
 */
export const performDataRefresh = async (symbols = []) => {
  const { canRefresh } = checkRefreshAvailability();
  
  if (!canRefresh) {
    throw new Error('Data refresh is on cooldown. Please wait 24 hours between refreshes.');
  }
  
  try {
    console.log('Performing data refresh with Polygon Starter plan...');
    
    // Import the Polygon service
    const { default: polygonService } = await import('./polygonServiceStarter.js');
    
    const updatedETFs = [];
    const updatedPrices = {};
    const errors = [];
    
    // Check if we can make requests without hitting rate limits
    if (!polygonService.canMakeRequest()) {
      throw new Error('Rate limit reached. Please try again later.');
    }
    
    // Refresh data for provided symbols
    if (symbols.length > 0) {
      console.log(`Refreshing data for ${symbols.length} symbols...`);
      
      for (const symbol of symbols) {
        try {
          // Get updated price data
          const priceData = await polygonService.getPreviousDayData(symbol);
          updatedPrices[symbol] = priceData;
          
          // Get updated ETF details (less frequently to conserve API calls)
          const etfData = await polygonService.getETFDetails(symbol);
          updatedETFs.push(etfData);
          
          console.log(`Successfully refreshed ${symbol}`);
        } catch (error) {
          console.error(`Failed to refresh ${symbol}:`, error);
          errors.push({ symbol, error: error.message });
        }
      }
    }
    
    // Record the refresh
    recordRefresh();
    
    const result = {
      success: true,
      message: `Data refreshed successfully. Updated ${updatedETFs.length} ETFs.`,
      timestamp: new Date().toISOString(),
      updatedETFs,
      updatedPrices,
      errors,
      isDelayed: true,
      dataSource: 'Polygon Starter Plan',
      rateLimitInfo: polygonService.getStats()
    };
    
    // Add warnings if there were errors
    if (errors.length > 0) {
      result.warnings = [`${errors.length} symbols failed to update due to API limitations.`];
    }
    
    return result;
    
  } catch (error) {
    console.error('Data refresh failed:', error);
    throw error;
  }
};

/**
 * Check if automatic refresh should occur on app load
 * This respects the 24-hour limit but allows one refresh per day
 * @returns {boolean} Whether to perform automatic refresh
 */
export const shouldAutoRefreshOnLoad = () => {
  const { canRefresh, lastRefresh } = checkRefreshAvailability();
  
  // If never refreshed, allow refresh
  if (!lastRefresh) return true;
  
  // If can refresh (24 hours passed), allow refresh
  if (canRefresh) return true;
  
  // Otherwise, don't refresh
  return false;
};

/**
 * Get user-friendly refresh information for settings display
 * @returns {Object} Information for settings UI
 */
export const getRefreshInfo = () => {
  const status = getRefreshStatus();
  
  return {
    ...status,
    refreshPolicy: '24 hours',
    description: 'Data can be refreshed once every 24 hours to ensure optimal performance and respect API limits.',
    nextRefreshAvailable: status.canRefresh ? 'Now' : status.timeUntilNextFormatted
  };
};

export default {
  checkRefreshAvailability,
  recordRefresh,
  formatTimeUntilRefresh,
  getRefreshStatus,
  performDataRefresh,
  shouldAutoRefreshOnLoad,
  getRefreshInfo
};

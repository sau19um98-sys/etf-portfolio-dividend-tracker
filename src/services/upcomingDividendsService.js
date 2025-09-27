// Upcoming Dividends Service for Live Data Integration
// This service calculates upcoming dividends based on user's actual portfolio holdings

import { calculateNextExDate, getDaysUntilNextDividend } from '../utils/dateUtils';

/**
 * Calculate upcoming dividends based on user's portfolio holdings and ETF data
 * @param {Array} userHoldings - User's portfolio holdings
 * @param {Array} etfData - ETF data with dividend information
 * @param {number} daysAhead - How many days ahead to look for dividends (default: 90)
 * @returns {Array} Array of upcoming dividend payments
 */
export const calculateUpcomingDividends = (userHoldings, etfData, daysAhead = 90) => {
  const upcomingDividends = [];
  const today = new Date();
  const futureDate = new Date(today.getTime() + (daysAhead * 24 * 60 * 60 * 1000));

  userHoldings.forEach(holding => {
    // Find corresponding ETF data
    const etf = etfData.find(e => e.id === holding.id || e.symbol === holding.symbol);
    
    if (!etf || !etf.dividend || !etf.frequency) {
      return; // Skip if no ETF data or dividend info
    }

    // Calculate next ex-dividend date
    const nextExDate = calculateNextExDate(etf.exDividendDate, etf.frequency);
    const nextExDateObj = new Date(nextExDate);
    
    // Only include if within the specified timeframe
    if (nextExDateObj >= today && nextExDateObj <= futureDate) {
      // Calculate payment date (typically 2-3 business days after ex-date)
      const payDate = calculatePaymentDate(nextExDate);
      
      // Calculate estimated dividend amount based on shares owned
      const estimatedAmount = etf.dividend * holding.shares;
      
      // Calculate days until ex-dividend date
      const daysUntilEx = getDaysUntilNextDividend(nextExDate);
      
      upcomingDividends.push({
        id: `${holding.id}_${nextExDate}`,
        symbol: holding.symbol || holding.id,
        name: etf.name,
        exDate: nextExDate,
        payDate: payDate,
        estimatedAmount: estimatedAmount,
        shares: holding.shares,
        dividendPerShare: etf.dividend,
        frequency: etf.frequency,
        daysUntilEx: daysUntilEx,
        priority: daysUntilEx <= 7 ? 'high' : daysUntilEx <= 30 ? 'medium' : 'low'
      });
    }
  });

  // Sort by ex-dividend date (earliest first)
  return upcomingDividends.sort((a, b) => new Date(a.exDate) - new Date(b.exDate));
};

/**
 * Calculate payment date based on ex-dividend date
 * @param {string} exDate - Ex-dividend date (ISO string)
 * @returns {string} Payment date (ISO string)
 */
const calculatePaymentDate = (exDate) => {
  const exDateObj = new Date(exDate);
  let paymentDate = new Date(exDateObj);
  
  // Add 2-3 business days (using 3 for safety)
  let businessDaysAdded = 0;
  while (businessDaysAdded < 3) {
    paymentDate.setDate(paymentDate.getDate() + 1);
    
    // Skip weekends
    if (paymentDate.getDay() !== 0 && paymentDate.getDay() !== 6) {
      businessDaysAdded++;
    }
  }
  
  return paymentDate.toISOString().split('T')[0];
};

/**
 * Get upcoming dividends with enhanced information for display
 * @param {Array} userHoldings - User's portfolio holdings
 * @param {Array} etfData - ETF data
 * @returns {Object} Enhanced upcoming dividends data
 */
export const getUpcomingDividendsWithStats = (userHoldings, etfData) => {
  const upcomingDividends = calculateUpcomingDividends(userHoldings, etfData);
  
  // Calculate summary statistics
  const totalEstimatedIncome = upcomingDividends.reduce((sum, div) => sum + div.estimatedAmount, 0);
  const next30Days = upcomingDividends.filter(div => div.daysUntilEx <= 30);
  const next7Days = upcomingDividends.filter(div => div.daysUntilEx <= 7);
  
  return {
    dividends: upcomingDividends,
    stats: {
      totalUpcoming: upcomingDividends.length,
      totalEstimatedIncome,
      next30Days: next30Days.length,
      next7Days: next7Days.length,
      next30DaysIncome: next30Days.reduce((sum, div) => sum + div.estimatedAmount, 0),
      next7DaysIncome: next7Days.reduce((sum, div) => sum + div.estimatedAmount, 0)
    }
  };
};

/**
 * Filter upcoming dividends by time period
 * @param {Array} dividends - Array of dividend objects
 * @param {string} period - Time period ('week', 'month', 'quarter', 'all')
 * @returns {Array} Filtered dividends
 */
export const filterDividendsByPeriod = (dividends, period) => {
  const today = new Date();
  let cutoffDate;
  
  switch (period) {
    case 'week':
      cutoffDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
      break;
    case 'month':
      cutoffDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
      break;
    case 'quarter':
      cutoffDate = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
      break;
    default:
      return dividends; // Return all
  }
  
  return dividends.filter(div => new Date(div.exDate) <= cutoffDate);
};

/**
 * Get dividend calendar for a specific month
 * @param {Array} dividends - Array of dividend objects
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {Object} Calendar data with dividends by date
 */
export const getDividendCalendar = (dividends, year, month) => {
  const calendar = {};
  
  dividends.forEach(dividend => {
    const exDate = new Date(dividend.exDate);
    const payDate = new Date(dividend.payDate);
    
    // Add ex-dividend dates
    if (exDate.getFullYear() === year && exDate.getMonth() === month) {
      const dateKey = exDate.getDate();
      if (!calendar[dateKey]) calendar[dateKey] = { ex: [], pay: [] };
      calendar[dateKey].ex.push({ ...dividend, type: 'ex' });
    }
    
    // Add payment dates
    if (payDate.getFullYear() === year && payDate.getMonth() === month) {
      const dateKey = payDate.getDate();
      if (!calendar[dateKey]) calendar[dateKey] = { ex: [], pay: [] };
      calendar[dateKey].pay.push({ ...dividend, type: 'pay' });
    }
  });
  
  return calendar;
};

/**
 * Update mock upcoming dividends to use current year (transition helper)
 * @param {Array} mockUpcomingDividends - Mock dividend data
 * @returns {Array} Updated dividends with current year dates
 */
export const updateMockUpcomingDividendsForCurrentYear = (mockUpcomingDividends) => {
  const currentYear = new Date().getFullYear();
  
  return mockUpcomingDividends.map(dividend => {
    const updateDateToCurrentYear = (dateString) => {
      const date = new Date(dateString);
      date.setFullYear(currentYear);
      return date.toISOString().split('T')[0];
    };
    
    return {
      ...dividend,
      exDate: updateDateToCurrentYear(dividend.exDate),
      payDate: updateDateToCurrentYear(dividend.payDate)
    };
  });
};

export default {
  calculateUpcomingDividends,
  getUpcomingDividendsWithStats,
  filterDividendsByPeriod,
  getDividendCalendar,
  updateMockUpcomingDividendsForCurrentYear
};

// Utility functions for handling dynamic dates with live data

/**
 * Calculate next ex-dividend date based on frequency and last payment
 * @param {string} lastExDate - Last ex-dividend date (ISO string)
 * @param {string} frequency - Payment frequency ('Monthly', 'Quarterly', 'Semi-annual', 'Annual')
 * @returns {string} Next ex-dividend date (ISO string)
 */
export const calculateNextExDate = (lastExDate, frequency) => {
  const lastDate = new Date(lastExDate);
  const nextDate = new Date(lastDate);
  
  switch (frequency.toLowerCase()) {
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'semi-annual':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case 'annual':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      // Default to quarterly if frequency is unknown
      nextDate.setMonth(nextDate.getMonth() + 3);
  }
  
  return nextDate.toISOString().split('T')[0];
};

/**
 * Calculate payment date (typically 2-3 business days after ex-date)
 * @param {string} exDate - Ex-dividend date (ISO string)
 * @param {number} businessDays - Number of business days to add (default: 2)
 * @returns {string} Payment date (ISO string)
 */
export const calculatePaymentDate = (exDate, businessDays = 2) => {
  const exDateObj = new Date(exDate);
  let paymentDate = new Date(exDateObj);
  let daysAdded = 0;
  
  while (daysAdded < businessDays) {
    paymentDate.setDate(paymentDate.getDate() + 1);
    
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (paymentDate.getDay() !== 0 && paymentDate.getDay() !== 6) {
      daysAdded++;
    }
  }
  
  return paymentDate.toISOString().split('T')[0];
};

/**
 * Get days until next ex-dividend date
 * @param {string} nextExDate - Next ex-dividend date (ISO string)
 * @returns {number} Days until next ex-dividend date
 */
export const getDaysUntilNextDividend = (nextExDate) => {
  const today = new Date();
  const exDate = new Date(nextExDate);
  const diffTime = exDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/**
 * Check if a date is in the current year
 * @param {string} dateString - Date string (ISO format)
 * @returns {boolean} True if date is in current year
 */
export const isCurrentYear = (dateString) => {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  return date.getFullYear() === currentYear;
};

/**
 * Update ETF data with current year dates (for transitioning from mock to live data)
 * @param {Object} etfData - ETF data object
 * @returns {Object} Updated ETF data with current year dates
 */
export const updateETFDatesForCurrentYear = (etfData) => {
  const currentYear = new Date().getFullYear();
  
  // If dates are already current year, return as-is
  if (isCurrentYear(etfData.exDividendDate)) {
    return etfData;
  }
  
  // Update dates to current year
  const updatedData = { ...etfData };
  
  // Update ex-dividend date to current year
  const exDate = new Date(etfData.exDividendDate);
  exDate.setFullYear(currentYear);
  updatedData.exDividendDate = exDate.toISOString().split('T')[0];
  
  // Calculate payment date based on updated ex-date
  updatedData.paymentDate = calculatePaymentDate(updatedData.exDividendDate);
  
  // Calculate next ex-dividend date
  updatedData.nextExDate = calculateNextExDate(updatedData.exDividendDate, etfData.frequency);
  
  // Calculate next payment date
  updatedData.nextPaymentDate = calculatePaymentDate(updatedData.nextExDate);
  
  return updatedData;
};

/**
 * Format date for display (handles different input formats)
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDateForDisplay = (date, options = { year: 'numeric', month: 'short', day: 'numeric' }) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Get relative time string (e.g., "in 5 days", "2 days ago")
 * @param {string|Date} date - Target date
 * @returns {string} Relative time string
 */
export const getRelativeTimeString = (date) => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = targetDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

// Polygon.io API service for live ETF data
// This is a template for when you integrate live data

import { calculateNextExDate, calculatePaymentDate, updateETFDatesForCurrentYear } from '../utils/dateUtils';

const POLYGON_API_KEY = process.env.VITE_POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

/**
 * Fetch real-time ETF data from Polygon.io
 * @param {string} symbol - ETF symbol (e.g., 'SPY')
 * @returns {Promise<Object>} ETF data with current year dates
 */
export const fetchETFData = async (symbol) => {
  try {
    // Fetch current price and basic info
    const tickerResponse = await fetch(
      `${BASE_URL}/v3/reference/tickers/${symbol}?apikey=${POLYGON_API_KEY}`
    );
    const tickerData = await tickerResponse.json();
    
    // Fetch current price
    const priceResponse = await fetch(
      `${BASE_URL}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${POLYGON_API_KEY}`
    );
    const priceData = await priceResponse.json();
    
    // Fetch dividend information
    const dividendResponse = await fetch(
      `${BASE_URL}/v3/reference/dividends?ticker=${symbol}&limit=10&apikey=${POLYGON_API_KEY}`
    );
    const dividendData = await dividendResponse.json();
    
    // Process the data
    const currentPrice = priceData.results?.[0]?.c || 0;
    const previousClose = priceData.results?.[0]?.o || currentPrice;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    // Get latest dividend information
    const latestDividend = dividendData.results?.[0];
    const dividendAmount = latestDividend?.cash_amount || 0;
    const dividendYield = (dividendAmount * 4 / currentPrice) * 100; // Assuming quarterly
    
    // Determine payment frequency from dividend history
    const frequency = determineDividendFrequency(dividendData.results);
    
    // Calculate current year dates
    const exDividendDate = latestDividend?.ex_dividend_date || new Date().toISOString().split('T')[0];
    const paymentDate = latestDividend?.pay_date || calculatePaymentDate(exDividendDate);
    const nextExDate = calculateNextExDate(exDividendDate, frequency);
    const nextPaymentDate = calculatePaymentDate(nextExDate);
    
    // Return formatted ETF data with current year dates
    return {
      id: symbol,
      name: tickerData.results?.name || `${symbol} ETF`,
      price: currentPrice,
      change: change,
      changePercent: changePercent,
      dividend: dividendAmount,
      dividendYield: dividendYield,
      exDividendDate: exDividendDate,
      paymentDate: paymentDate,
      nextExDate: nextExDate,
      nextPaymentDate: nextPaymentDate,
      frequency: frequency,
      sector: tickerData.results?.sic_description || 'ETF',
      aum: 'N/A', // Would need additional data source
      expenseRatio: 0, // Would need additional data source
      // Add other fields as needed
    };
    
  } catch (error) {
    console.error(`Error fetching ETF data for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Determine dividend payment frequency from dividend history
 * @param {Array} dividendHistory - Array of dividend payments
 * @returns {string} Payment frequency
 */
const determineDividendFrequency = (dividendHistory) => {
  if (!dividendHistory || dividendHistory.length < 2) {
    return 'Quarterly'; // Default assumption
  }
  
  // Calculate average days between payments
  const dates = dividendHistory
    .map(d => new Date(d.ex_dividend_date))
    .sort((a, b) => b - a);
  
  if (dates.length < 2) return 'Quarterly';
  
  const avgDaysBetween = (dates[0] - dates[dates.length - 1]) / (dates.length - 1) / (1000 * 60 * 60 * 24);
  
  if (avgDaysBetween <= 35) return 'Monthly';
  if (avgDaysBetween <= 100) return 'Quarterly';
  if (avgDaysBetween <= 200) return 'Semi-annual';
  return 'Annual';
};

/**
 * Fetch multiple ETFs data
 * @param {Array<string>} symbols - Array of ETF symbols
 * @returns {Promise<Array>} Array of ETF data objects
 */
export const fetchMultipleETFs = async (symbols) => {
  const promises = symbols.map(symbol => fetchETFData(symbol));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
};

/**
 * Update mock data to use current year dates (transition helper)
 * @param {Array} mockETFData - Array of mock ETF data
 * @returns {Array} Updated ETF data with current year dates
 */
export const updateMockDataForCurrentYear = (mockETFData) => {
  return mockETFData.map(etf => updateETFDatesForCurrentYear(etf));
};

/**
 * WebSocket connection for real-time price updates
 */
export class PolygonWebSocket {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.ws = null;
    this.subscriptions = new Set();
    this.callbacks = new Map();
  }
  
  connect() {
    this.ws = new WebSocket(`wss://socket.polygon.io/stocks`);
    
    this.ws.onopen = () => {
      console.log('Polygon WebSocket connected');
      // Authenticate
      this.ws.send(JSON.stringify({
        action: 'auth',
        params: this.apiKey
      }));
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
    
    this.ws.onclose = () => {
      console.log('Polygon WebSocket disconnected');
      // Implement reconnection logic
    };
    
    this.ws.onerror = (error) => {
      console.error('Polygon WebSocket error:', error);
    };
  }
  
  subscribe(symbol, callback) {
    this.subscriptions.add(symbol);
    this.callbacks.set(symbol, callback);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: 'subscribe',
        params: `T.${symbol}`
      }));
    }
  }
  
  unsubscribe(symbol) {
    this.subscriptions.delete(symbol);
    this.callbacks.delete(symbol);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: 'unsubscribe',
        params: `T.${symbol}`
      }));
    }
  }
  
  handleMessage(data) {
    if (data.ev === 'T') { // Trade event
      const symbol = data.sym;
      const callback = this.callbacks.get(symbol);
      
      if (callback) {
        callback({
          symbol: symbol,
          price: data.p,
          timestamp: data.t,
          volume: data.s
        });
      }
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscriptions.clear();
    this.callbacks.clear();
  }
}

export default {
  fetchETFData,
  fetchMultipleETFs,
  updateMockDataForCurrentYear,
  PolygonWebSocket
};

// Polygon.io API service optimized for Stocks Starter Plan
// Features: End-of-day data, 15-minute delay, no real-time quotes/trades
// Limitations: No trades, quotes, financials & ratios

import { calculateNextExDate, calculatePaymentDate } from '../utils/dateUtils';

const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

class PolygonStarterService {
  constructor() {
    this.apiKey = POLYGON_API_KEY;
    this.baseURL = BASE_URL;
    this.rateLimitDelay = 12000; // 12 seconds between requests (5 per minute limit)
    this.cache = new Map();
    this.cacheExpiry = 15 * 60 * 1000; // 15 minutes cache for delayed data
    this.requestCount = 0;
    this.requestWindow = 60000; // 1 minute window
    this.requestTimestamps = [];
  }

  // Rate limiting helper
  async enforceRateLimit() {
    const now = Date.now();
    
    // Remove timestamps older than 1 minute
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => now - timestamp < this.requestWindow
    );
    
    // If we've made 5 requests in the last minute, wait
    if (this.requestTimestamps.length >= 5) {
      const oldestRequest = Math.min(...this.requestTimestamps);
      const waitTime = this.requestWindow - (now - oldestRequest) + 1000; // Add 1 second buffer
      
      if (waitTime > 0) {
        console.log(`Rate limit reached. Waiting ${Math.ceil(waitTime/1000)} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    this.requestTimestamps.push(now);
  }

  // Helper method to make API requests with rate limiting and caching
  async makeRequest(endpoint, params = {}) {
    if (!this.apiKey) {
      throw new Error('Polygon API key not configured');
    }

    // Create cache key
    const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`Using cached data for ${endpoint}`);
      return cached.data;
    }

    // Enforce rate limiting
    await this.enforceRateLimit();

    const url = new URL(`${this.baseURL}${endpoint}`);
    url.searchParams.append('apikey', this.apiKey);
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    try {
      console.log(`Making API request to: ${endpoint}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before making more requests.');
        }
        if (response.status === 403) {
          throw new Error('Access denied. This endpoint may not be available on the Starter plan.');
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error('Polygon API request failed:', error);
      throw error;
    }
  }

  // Get previous day's closing data (available on Starter plan)
  async getPreviousDayData(symbol) {
    try {
      const data = await this.makeRequest(`/v2/aggs/ticker/${symbol}/prev`);
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          symbol,
          price: result.c, // closing price
          change: result.c - result.o, // change from open
          changePercent: ((result.c - result.o) / result.o) * 100,
          volume: result.v,
          timestamp: new Date(result.t),
          high: result.h,
          low: result.l,
          open: result.o,
          isDelayed: true, // Always delayed data on Starter plan
          dataSource: 'Previous Day Close',
          lastUpdated: new Date().toISOString()
        };
      }
      
      throw new Error(`No price data found for ${symbol}`);
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      throw error;
    }
  }

  // Get multiple stock prices in batch (optimized for rate limits)
  async getBatchPrices(symbols) {
    const results = {};
    
    console.log(`Fetching prices for ${symbols.length} symbols with rate limiting`);
    
    // Process symbols one by one to respect rate limits
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      console.log(`Processing ${symbol} (${i + 1}/${symbols.length})`);
      
      try {
        results[symbol] = await this.getPreviousDayData(symbol);
      } catch (error) {
        console.error(`Failed to get price for ${symbol}:`, error);
        results[symbol] = {
          symbol,
          price: null,
          error: error.message,
          isDelayed: true,
          dataSource: 'Error',
          lastUpdated: new Date().toISOString()
        };
      }
    }
    
    return results;
  }

  // Get ETF/stock details with dividend information
  async getETFDetails(symbol) {
    try {
      console.log(`Fetching details for ${symbol}`);
      
      // Get basic ticker details
      const tickerData = await this.makeRequest(`/v3/reference/tickers/${symbol}`);
      
      if (!tickerData.results) {
        throw new Error(`No ticker data found for ${symbol}`);
      }

      const ticker = tickerData.results;
      
      // Get dividend information (available on Starter plan)
      const dividendData = await this.makeRequest(`/v3/reference/dividends`, {
        'ticker': symbol,
        'limit': 12, // Get last 12 dividends to determine frequency
        'sort': 'ex_dividend_date',
        'order': 'desc'
      });

      const dividends = dividendData.results || [];
      const latestDividend = dividends[0];

      // Calculate dividend metrics
      const frequency = this.estimateDividendFrequency(dividends);
      const annualDividend = this.calculateAnnualDividend(dividends, frequency);
      
      // Calculate next ex-dividend date (estimation based on historical pattern)
      let nextExDate = null;
      let nextPaymentDate = null;
      
      if (latestDividend && frequency !== 'Unknown') {
        const lastExDate = new Date(latestDividend.ex_dividend_date);
        nextExDate = calculateNextExDate(lastExDate, frequency);
        nextPaymentDate = calculatePaymentDate(nextExDate);
      }

      return {
        id: ticker.ticker, // For compatibility with existing code
        symbol: ticker.ticker,
        name: ticker.name,
        description: ticker.description || '',
        market: ticker.market,
        type: ticker.type,
        currency: ticker.currency_name || 'USD',
        dividend: latestDividend ? latestDividend.cash_amount : 0,
        annualDividend,
        exDividendDate: latestDividend ? latestDividend.ex_dividend_date : null,
        paymentDate: latestDividend ? latestDividend.pay_date : null,
        nextExDate: nextExDate ? nextExDate.toISOString().split('T')[0] : null,
        nextPaymentDate: nextPaymentDate ? nextPaymentDate.toISOString().split('T')[0] : null,
        frequency,
        sector: ticker.sic_description || 'ETF',
        dividendHistory: dividends.slice(0, 8).map(div => ({
          amount: div.cash_amount,
          exDate: div.ex_dividend_date,
          payDate: div.pay_date,
          recordDate: div.record_date
        })),
        lastUpdated: new Date().toISOString(),
        isDelayed: true,
        dataSource: 'Polygon Starter Plan'
      };
    } catch (error) {
      console.error(`Error fetching ETF details for ${symbol}:`, error);
      throw error;
    }
  }

  // Calculate annual dividend based on frequency and recent payments
  calculateAnnualDividend(dividends, frequency) {
    if (!dividends.length) return 0;
    
    const recentDividends = dividends.slice(0, 4); // Last 4 payments
    const avgDividend = recentDividends.reduce((sum, div) => sum + div.cash_amount, 0) / recentDividends.length;
    
    switch (frequency) {
      case 'Monthly':
        return avgDividend * 12;
      case 'Quarterly':
        return avgDividend * 4;
      case 'Semi-annual':
        return avgDividend * 2;
      case 'Annual':
        return avgDividend;
      default:
        return avgDividend * 4; // Default to quarterly
    }
  }

  // Estimate dividend frequency based on historical data
  estimateDividendFrequency(dividends) {
    if (dividends.length < 2) return 'Unknown';
    
    const dates = dividends.map(d => new Date(d.ex_dividend_date)).sort((a, b) => b - a);
    const intervals = [];
    
    for (let i = 0; i < Math.min(dates.length - 1, 4); i++) {
      const daysDiff = (dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24);
      intervals.push(daysDiff);
    }
    
    if (!intervals.length) return 'Unknown';
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    
    if (avgInterval <= 35) return 'Monthly';
    if (avgInterval <= 100) return 'Quarterly';
    if (avgInterval <= 200) return 'Semi-annual';
    return 'Annual';
  }

  // Search for ETFs/stocks (limited results to conserve API calls)
  async searchTickers(query) {
    try {
      const data = await this.makeRequest('/v3/reference/tickers', {
        search: query,
        type: 'ETF',
        market: 'stocks',
        active: 'true',
        limit: 10 // Reduced limit to conserve API calls
      });

      return (data.results || []).map(ticker => ({
        symbol: ticker.ticker,
        name: ticker.name,
        type: ticker.type,
        market: ticker.market,
        currency: ticker.currency_name || 'USD'
      }));
    } catch (error) {
      console.error('Error searching tickers:', error);
      throw error;
    }
  }

  // Get market status (useful for delayed data context)
  async getMarketStatus() {
    try {
      const data = await this.makeRequest('/v1/marketstatus/now');
      return {
        market: data.market,
        serverTime: data.serverTime,
        exchanges: data.exchanges,
        isOpen: data.market === 'open'
      };
    } catch (error) {
      console.error('Error fetching market status:', error);
      return {
        market: 'unknown',
        serverTime: new Date().toISOString(),
        exchanges: {},
        isOpen: false
      };
    }
  }

  // Fetch ETF data (compatible with existing code)
  async fetchETFData(symbol) {
    try {
      const [details, priceData] = await Promise.all([
        this.getETFDetails(symbol),
        this.getPreviousDayData(symbol)
      ]);

      return {
        ...details,
        price: priceData.price,
        change: priceData.change,
        changePercent: priceData.changePercent,
        volume: priceData.volume,
        high: priceData.high,
        low: priceData.low,
        open: priceData.open,
        dividendYield: details.annualDividend && priceData.price ? 
          (details.annualDividend / priceData.price) * 100 : 0,
        aum: 'N/A', // Not available on Starter plan
        expenseRatio: 0, // Not available on Starter plan
        isDelayed: true,
        dataSource: 'Polygon Starter Plan'
      };
    } catch (error) {
      console.error(`Error fetching ETF data for ${symbol}:`, error);
      throw error;
    }
  }

  // Fetch multiple ETFs (compatible with existing code)
  async fetchMultipleETFs(symbols) {
    const results = [];
    
    for (const symbol of symbols) {
      try {
        const etfData = await this.fetchETFData(symbol);
        results.push(etfData);
      } catch (error) {
        console.error(`Failed to fetch ${symbol}:`, error);
        // Continue with other symbols
      }
    }
    
    return results;
  }

  // Clear cache (useful for manual refresh)
  clearCache() {
    this.cache.clear();
    console.log('Polygon service cache cleared');
  }

  // Get cache and rate limit statistics
  getStats() {
    return {
      cacheSize: this.cache.size,
      recentRequests: this.requestTimestamps.length,
      rateLimitDelay: this.rateLimitDelay,
      cacheExpiry: this.cacheExpiry
    };
  }

  // Check if we can make a request without hitting rate limits
  canMakeRequest() {
    const now = Date.now();
    const recentRequests = this.requestTimestamps.filter(
      timestamp => now - timestamp < this.requestWindow
    );
    return recentRequests.length < 5;
  }
}

// Create singleton instance
const polygonStarterService = new PolygonStarterService();

// Export both the class and instance for flexibility
export { PolygonStarterService };
export default polygonStarterService;

// Export compatible functions for existing code
export const fetchETFData = (symbol) => polygonStarterService.fetchETFData(symbol);
export const fetchMultipleETFs = (symbols) => polygonStarterService.fetchMultipleETFs(symbols);

// Helper function to update mock data (for transition period)
export const updateMockDataForCurrentYear = (mockETFData) => {
  return mockETFData.map(etf => ({
    ...etf,
    lastUpdated: new Date().toISOString(),
    isDelayed: true,
    dataSource: 'Mock Data (Transition)'
  }));
};

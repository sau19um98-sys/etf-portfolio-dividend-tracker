// Generate realistic price history for the last 30 days
const generatePriceHistory = (basePrice, volatility = 0.02) => {
  const history = [];
  let currentPrice = basePrice;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some realistic price movement
    const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    currentPrice = Math.max(currentPrice + change, basePrice * 0.8);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2))
    });
  }
  
  return history;
};

// Generate dividend history
const generateDividendHistory = (quarterlyAmount, months = 12) => {
  const history = [];
  const today = new Date();
  
  for (let i = 0; i < months / 3; i++) {
    const paymentDate = new Date(today);
    paymentDate.setMonth(today.getMonth() - (i * 3));
    
    // Add some variation to dividend amounts
    const variation = (Math.random() - 0.5) * 0.1;
    const amount = quarterlyAmount * (1 + variation);
    
    history.push({
      date: paymentDate.toISOString().split('T')[0],
      amount: parseFloat(amount.toFixed(2)),
      exDate: new Date(paymentDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      declarationDate: new Date(paymentDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }
  
  return history.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Generate 5-year dividend performance history
const generateDividendPerformanceHistory = (quarterlyAmount, paymentFrequency = 'quarterly') => {
  const history = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Payment cycles per year based on frequency
  const paymentsPerYear = {
    'monthly': 12,
    'quarterly': 4,
    'semi-annual': 2,
    'annual': 1
  };
  
  const payments = paymentsPerYear[paymentFrequency] || 4;
  const monthsInterval = 12 / payments;
  
  // Generate 5 years of data
  for (let year = 0; year < 5; year++) {
    let yearTotal = 0;
    const targetYear = currentYear - year;
    
    for (let payment = 0; payment < payments; payment++) {
      const paymentDate = new Date(targetYear, (payment * monthsInterval), 15);
      
      // Add growth trend (slight increase each year) and some variation
      const growthFactor = 1 + (year * 0.03); // 3% annual growth
      const variation = (Math.random() - 0.5) * 0.15; // ±15% variation
      const baseAmount = quarterlyAmount * (12 / payments); // Adjust for frequency
      const amount = baseAmount * growthFactor * (1 + variation);
      
      yearTotal += amount;
      
      history.push({
        year: targetYear,
        quarter: Math.floor(payment * (4 / payments)) + 1,
        payment: payment + 1,
        date: paymentDate.toISOString().split('T')[0],
        amount: parseFloat(amount.toFixed(2)),
        frequency: paymentFrequency
      });
    }
    
    // Add year summary
    history.push({
      year: targetYear,
      isYearSummary: true,
      totalAmount: parseFloat(yearTotal.toFixed(2)),
      paymentsCount: payments,
      frequency: paymentFrequency
    });
  }
  
  return history.sort((a, b) => b.year - a.year);
};

export const etfData = [
  {
    id: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    price: 445.67,
    change: 2.34,
    changePercent: 0.53,
    dividend: 1.58,
    dividendYield: 1.42,
    exDividendDate: '2024-03-15',
    paymentDate: '2024-04-30',
    nextExDate: '2024-06-19',
    nextPaymentDate: '2024-07-31',
    frequency: 'Quarterly',
    sector: 'Broad Market',
    aum: '485.2B',
    expenseRatio: 0.09,
    priceHistory: generatePriceHistory(445.67),
    dividendHistory: generateDividendHistory(1.58),
    dividendPerformanceHistory: generateDividendPerformanceHistory(1.58, 'quarterly'),
    description: 'Tracks the S&P 500 Index, providing exposure to 500 of the largest U.S. companies.'
  },
  {
    id: 'QQQ',
    name: 'Invesco QQQ Trust',
    price: 378.92,
    change: -1.45,
    changePercent: -0.38,
    dividend: 0.65,
    dividendYield: 0.69,
    exDividendDate: '2024-03-20',
    paymentDate: '2024-04-30',
    nextExDate: '2024-06-19',
    nextPaymentDate: '2024-07-31',
    frequency: 'Quarterly',
    sector: 'Technology',
    aum: '245.8B',
    expenseRatio: 0.20,
    dividendHistory: generateDividendHistory(0.65),
    priceHistory: generatePriceHistory(378.92),
    dividendPerformanceHistory: generateDividendPerformanceHistory(0.65, 'quarterly'),
    description: 'Tracks the NASDAQ-100 Index, focusing on the largest non-financial companies.'
  },
  {
    id: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    price: 234.56,
    change: 1.78,
    changePercent: 0.76,
    dividend: 0.89,
    dividendYield: 1.52,
    exDividendDate: '2024-03-22',
    paymentDate: '2024-03-28',
    nextExDate: '2024-06-24',
    nextPaymentDate: '2024-06-28',
    frequency: 'Quarterly',
    sector: 'Total Market',
    aum: '350.1B',
    expenseRatio: 0.03,
    dividendHistory: generateDividendHistory(0.89),
    priceHistory: generatePriceHistory(234.56),
    dividendPerformanceHistory: generateDividendPerformanceHistory(0.89, 'quarterly'),
    description: 'Provides exposure to the entire U.S. stock market, including small-, mid-, and large-cap stocks.'
  },
  {
    id: 'SCHD',
    name: 'Schwab US Dividend Equity ETF',
    price: 78.43,
    change: 0.89,
    changePercent: 1.15,
    dividend: 0.74,
    dividendYield: 3.78,
    exDividendDate: '2024-03-25',
    paymentDate: '2024-03-28',
    nextExDate: '2024-06-24',
    nextPaymentDate: '2024-06-28',
    frequency: 'Quarterly',
    sector: 'Dividend',
    aum: '52.3B',
    expenseRatio: 0.06,
    dividendHistory: generateDividendHistory(0.74),
    priceHistory: generatePriceHistory(78.43),
    dividendPerformanceHistory: generateDividendPerformanceHistory(0.74, 'quarterly'),
    description: 'Focuses on high-dividend-yielding U.S. stocks with a history of consistent dividend payments.'
  },
  {
    id: 'VYM',
    name: 'Vanguard High Dividend Yield ETF',
    price: 112.87,
    change: 0.45,
    changePercent: 0.40,
    dividend: 0.89,
    dividendYield: 3.16,
    exDividendDate: '2024-03-18',
    paymentDate: '2024-03-22',
    nextExDate: '2024-06-17',
    nextPaymentDate: '2024-06-21',
    frequency: 'Quarterly',
    sector: 'Dividend',
    aum: '58.7B',
    expenseRatio: 0.06,
    dividendHistory: generateDividendHistory(0.89),
    priceHistory: generatePriceHistory(112.87),
    dividendPerformanceHistory: generateDividendPerformanceHistory(0.89, 'quarterly'),
    description: 'Tracks high-dividend-yielding U.S. stocks, excluding REITs.'
  },
  {
    id: 'JEPI',
    name: 'JPMorgan Equity Premium Income ETF',
    price: 56.78,
    change: 0.12,
    changePercent: 0.21,
    dividend: 0.48,
    dividendYield: 10.14,
    exDividendDate: '2024-03-28',
    paymentDate: '2024-04-02',
    nextExDate: '2024-04-30',
    nextPaymentDate: '2024-05-02',
    frequency: 'Monthly',
    sector: 'Income',
    aum: '34.2B',
    expenseRatio: 0.35,
    dividendHistory: [
      { date: '2024-03-01', amount: 0.48, exDate: '2024-02-28', declarationDate: '2024-02-15' },
      { date: '2024-02-01', amount: 0.47, exDate: '2024-01-30', declarationDate: '2024-01-15' },
      { date: '2024-01-02', amount: 0.49, exDate: '2023-12-28', declarationDate: '2023-12-15' }
    ],
    priceHistory: generatePriceHistory(56.78),
    dividendPerformanceHistory: generateDividendPerformanceHistory(0.49, 'monthly'),
    description: 'Seeks to deliver monthly income through equity exposure and covered call options.'
  },
  {
    id: 'QYLD',
    name: 'Global X NASDAQ 100 Covered Call ETF',
    price: 18.92,
    change: -0.08,
    changePercent: -0.42,
    dividend: 0.18,
    dividendYield: 11.40,
    exDividendDate: '2024-03-27',
    paymentDate: '2024-04-02',
    nextExDate: '2024-04-29',
    nextPaymentDate: '2024-05-02',
    frequency: 'Monthly',
    sector: 'Income',
    aum: '6.8B',
    expenseRatio: 0.60,
    dividendHistory: [
      { date: '2024-03-01', amount: 0.18, exDate: '2024-02-27', declarationDate: '2024-02-15' },
      { date: '2024-02-01', amount: 0.17, exDate: '2024-01-30', declarationDate: '2024-01-15' },
      { date: '2024-01-02', amount: 0.19, exDate: '2023-12-28', declarationDate: '2023-12-15' }
    ],
    priceHistory: generatePriceHistory(18.92),
    dividendPerformanceHistory: generateDividendPerformanceHistory(0.19, 'monthly'),
    description: 'Provides monthly income by writing covered calls on the NASDAQ-100 Index.'
  },
  {
    id: 'XLF',
    name: 'Financial Select Sector SPDR Fund',
    price: 38.45,
    change: 0.67,
    changePercent: 1.77,
    dividend: 0.35,
    dividendYield: 3.65,
    exDividendDate: '2024-03-19',
    paymentDate: '2024-03-25',
    nextExDate: '2024-06-18',
    nextPaymentDate: '2024-06-24',
    frequency: 'Quarterly',
    sector: 'Financial',
    aum: '42.1B',
    expenseRatio: 0.10,
    dividendHistory: generateDividendHistory(0.35),
    priceHistory: generatePriceHistory(38.45),
    dividendPerformanceHistory: generateDividendPerformanceHistory(0.35, 'quarterly'),
    description: 'Provides exposure to the financial sector of the S&P 500.'
  },
  {
    id: 'XLK',
    name: 'Technology Select Sector SPDR Fund',
    price: 198.76,
    change: -2.34,
    changePercent: -1.16,
    dividend: 0.78,
    dividendYield: 1.57,
    exDividendDate: '2024-03-20',
    paymentDate: '2024-03-26',
    nextExDate: '2024-06-19',
    nextPaymentDate: '2024-06-25',
    frequency: 'Quarterly',
    sector: 'Technology',
    aum: '67.9B',
    expenseRatio: 0.10,
    dividendHistory: generateDividendHistory(0.78),
    priceHistory: generatePriceHistory(198.76),
    dividendPerformanceHistory: generateDividendPerformanceHistory(0.78, 'quarterly'),
    description: 'Provides exposure to the technology sector of the S&P 500.'
  },
  {
    id: 'VXUS',
    name: 'Vanguard Total International Stock ETF',
    price: 58.23,
    change: 0.34,
    changePercent: 0.59,
    dividend: 0.52,
    dividendYield: 3.58,
    exDividendDate: '2024-03-21',
    paymentDate: '2024-03-26',
    nextExDate: '2024-06-20',
    nextPaymentDate: '2024-06-25',
    frequency: 'Quarterly',
    sector: 'International',
    aum: '89.4B',
    expenseRatio: 0.08,
    dividendHistory: generateDividendHistory(0.52),
    priceHistory: generatePriceHistory(58.23),
    dividendPerformanceHistory: generateDividendPerformanceHistory(0.52, 'quarterly'),
    description: 'Provides broad exposure to international developed and emerging markets.'
  }
];

export const portfolioData = {
  totalValue: 125847.32,
  totalCost: 118500.00,
  totalGainLoss: 7347.32,
  totalGainLossPercent: 6.20,
  monthlyIncome: 387.45,
  annualIncome: 4649.40,
  annualYield: 3.69,
  lastUpdated: new Date().toISOString(),
  holdings: [
    { 
      id: 'SPY', 
      shares: 25, 
      avgPrice: 425.30, 
      currentValue: 11141.75,
      costBasis: 10632.50,
      gainLoss: 509.25,
      gainLossPercent: 4.79,
      monthlyDividend: 32.92,
      annualDividend: 395.00
    },
    { 
      id: 'SCHD', 
      shares: 150, 
      avgPrice: 75.20, 
      currentValue: 11764.50,
      costBasis: 11280.00,
      gainLoss: 484.50,
      gainLossPercent: 4.29,
      monthlyDividend: 92.50,
      annualDividend: 1110.00
    },
    { 
      id: 'VTI', 
      shares: 50, 
      avgPrice: 228.45, 
      currentValue: 11728.00,
      costBasis: 11422.50,
      gainLoss: 305.50,
      gainLossPercent: 2.68,
      monthlyDividend: 37.08,
      annualDividend: 445.00
    },
    { 
      id: 'JEPI', 
      shares: 200, 
      avgPrice: 55.80, 
      currentValue: 11356.00,
      costBasis: 11160.00,
      gainLoss: 196.00,
      gainLossPercent: 1.76,
      monthlyDividend: 96.00,
      annualDividend: 1152.00
    },
    { 
      id: 'QQQ', 
      shares: 30, 
      avgPrice: 365.40, 
      currentValue: 11367.60,
      costBasis: 10962.00,
      gainLoss: 405.60,
      gainLossPercent: 3.70,
      monthlyDividend: 16.25,
      annualDividend: 195.00
    }
  ],
  recentTransactions: [
    {
      id: 1,
      type: 'BUY',
      symbol: 'SCHD',
      shares: 25,
      price: 78.43,
      total: 1960.75,
      date: '2024-03-15',
      fees: 0.00
    },
    {
      id: 2,
      type: 'DIVIDEND',
      symbol: 'JEPI',
      amount: 96.00,
      date: '2024-03-01',
      shares: 200
    },
    {
      id: 3,
      type: 'BUY',
      symbol: 'VTI',
      shares: 10,
      price: 232.10,
      total: 2321.00,
      date: '2024-02-28',
      fees: 0.00
    }
  ],
  upcomingDividends: [
    {
      symbol: 'JEPI',
      exDate: '2024-04-30',
      payDate: '2024-05-02',
      estimatedAmount: 96.00,
      shares: 200
    },
    {
      symbol: 'SCHD',
      exDate: '2024-06-24',
      payDate: '2024-06-28',
      estimatedAmount: 111.00,
      shares: 150
    },
    {
      symbol: 'SPY',
      exDate: '2024-06-21',
      payDate: '2024-07-31',
      estimatedAmount: 39.50,
      shares: 25
    }
  ]
};

// Function to check if market is currently open
const isMarketCurrentlyOpen = () => {
  const now = new Date();
  const etNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  const day = etNow.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = etNow.getHours();
  const minute = etNow.getMinutes();
  const timeInMinutes = hour * 60 + minute;
  
  // Market is closed on weekends
  if (day === 0 || day === 6) return false;
  
  // Market hours: 9:30 AM - 4:00 PM ET (570 minutes - 960 minutes)
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM
  
  return timeInMinutes >= marketOpen && timeInMinutes < marketClose;
};

// Function to get next market event
const getNextMarketEvent = () => {
  const now = new Date();
  const etNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  const day = etNow.getDay();
  const hour = etNow.getHours();
  const minute = etNow.getMinutes();
  
  const today = new Date(etNow);
  const tomorrow = new Date(etNow);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (day === 0) { // Sunday
    const mondayOpen = new Date(etNow);
    mondayOpen.setDate(mondayOpen.getDate() + 1);
    mondayOpen.setHours(9, 30, 0, 0);
    return { event: 'Market Open', time: mondayOpen.toISOString() };
  } else if (day === 6) { // Saturday
    const mondayOpen = new Date(etNow);
    mondayOpen.setDate(mondayOpen.getDate() + 2);
    mondayOpen.setHours(9, 30, 0, 0);
    return { event: 'Market Open', time: mondayOpen.toISOString() };
  } else { // Weekday
    const timeInMinutes = hour * 60 + minute;
    const marketOpen = 9 * 60 + 30;
    const marketClose = 16 * 60;
    
    if (timeInMinutes < marketOpen) {
      // Before market open
      today.setHours(9, 30, 0, 0);
      return { event: 'Market Open', time: today.toISOString() };
    } else if (timeInMinutes < marketClose) {
      // Market is open
      today.setHours(16, 0, 0, 0);
      return { event: 'Market Close', time: today.toISOString() };
    } else {
      // After market close
      if (day === 5) { // Friday
        const mondayOpen = new Date(etNow);
        mondayOpen.setDate(mondayOpen.getDate() + 3);
        mondayOpen.setHours(9, 30, 0, 0);
        return { event: 'Market Open', time: mondayOpen.toISOString() };
      } else {
        tomorrow.setHours(9, 30, 0, 0);
        return { event: 'Market Open', time: tomorrow.toISOString() };
      }
    }
  }
};

export const marketData = {
  get isOpen() { return isMarketCurrentlyOpen(); },
  get nextOpen() { 
    const next = getNextMarketEvent();
    return next.event === 'Market Open' ? next.time : null;
  },
  get nextClose() { 
    const next = getNextMarketEvent();
    return next.event === 'Market Close' ? next.time : null;
  },
  timezone: 'America/New_York',
  indices: {
    sp500: { value: 5234.18, change: 12.45, changePercent: 0.24 },
    nasdaq: { value: 16315.70, change: -23.67, changePercent: -0.14 },
    dow: { value: 39781.37, change: 45.23, changePercent: 0.11 }
  }
};

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatPercent = (percent) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(percent / 100);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Utility function to update dates to current year (for demo purposes)
export const updateDatesToCurrentYear = (etfArray) => {
  const currentYear = new Date().getFullYear();
  
  return etfArray.map(etf => {
    // Update dates to current year while maintaining month/day
    const updateDateToCurrentYear = (dateString) => {
      const date = new Date(dateString);
      date.setFullYear(currentYear);
      return date.toISOString().split('T')[0];
    };
    
    return {
      ...etf,
      exDividendDate: updateDateToCurrentYear(etf.exDividendDate),
      paymentDate: updateDateToCurrentYear(etf.paymentDate),
      nextExDate: updateDateToCurrentYear(etf.nextExDate),
      nextPaymentDate: updateDateToCurrentYear(etf.nextPaymentDate),
      // Update dividend history dates if they exist
      dividendHistory: etf.dividendHistory?.map(div => ({
        ...div,
        date: updateDateToCurrentYear(div.date),
        exDate: updateDateToCurrentYear(div.exDate),
        declarationDate: updateDateToCurrentYear(div.declarationDate)
      })) || etf.dividendHistory
    };
  });
};

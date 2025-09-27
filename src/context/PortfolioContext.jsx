import { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [userHoldings, setUserHoldings] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedHoldings = localStorage.getItem('userPortfolioHoldings');
    const savedTransactions = localStorage.getItem('userPortfolioTransactions');
    
    if (savedHoldings) {
      try {
        const parsed = JSON.parse(savedHoldings);
        console.log('Loaded holdings from localStorage:', parsed);
        setUserHoldings(parsed);
      } catch (error) {
        console.error('Error loading saved holdings:', error);
        setUserHoldings([]);
      }
    }
    
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        console.log('Loaded transactions from localStorage:', parsed);
        setUserTransactions(parsed);
      } catch (error) {
        console.error('Error loading saved transactions:', error);
        setUserTransactions([]);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // Save user data to localStorage whenever they change (but not on initial load)
  useEffect(() => {
    if (isLoaded && userHoldings.length >= 0) {
      console.log('Saving holdings to localStorage:', userHoldings);
      localStorage.setItem('userPortfolioHoldings', JSON.stringify(userHoldings));
    }
  }, [userHoldings, isLoaded]);

  useEffect(() => {
    if (isLoaded && userTransactions.length >= 0) {
      console.log('Saving transactions to localStorage:', userTransactions);
      localStorage.setItem('userPortfolioTransactions', JSON.stringify(userTransactions));
    }
  }, [userTransactions, isLoaded]);

  // Handle adding new holding
  const addHolding = (newHolding) => {
    try {
      console.log('Adding new holding:', newHolding);
      console.log('Current user holdings:', userHoldings);
      
      // Create transaction record
      const transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'buy',
        symbol: newHolding.symbol,
        name: newHolding.name,
        shares: newHolding.shares,
        price: newHolding.avgPrice,
        total: newHolding.costBasis,
        date: newHolding.purchaseDate,
        timestamp: new Date().toISOString()
      };
      
      // Add transaction to history
      setUserTransactions(prev => [transaction, ...prev]);
      
      const existingHoldingIndex = userHoldings.findIndex(h => h.id === newHolding.id);
      
      if (existingHoldingIndex >= 0) {
        // Update existing holding by averaging the prices and adding shares
        const existingHolding = userHoldings[existingHoldingIndex];
        const totalShares = existingHolding.shares + newHolding.shares;
        const totalCost = existingHolding.costBasis + newHolding.costBasis;
        const avgPrice = totalCost / totalShares;
        
        const updatedHolding = {
          ...existingHolding,
          shares: totalShares,
          avgPrice: avgPrice,
          costBasis: totalCost,
          purchaseDate: newHolding.purchaseDate // Use most recent purchase date
        };
        
        const updatedHoldings = [...userHoldings];
        updatedHoldings[existingHoldingIndex] = updatedHolding;
        setUserHoldings(updatedHoldings);
        console.log('Updated existing holding:', updatedHolding);
      } else {
        // Add new holding
        setUserHoldings(prev => {
          const newHoldings = [...prev, newHolding];
          console.log('Added new holding, new array:', newHoldings);
          return newHoldings;
        });
      }
    } catch (error) {
      console.error('Error adding holding:', error);
      throw error; // Re-throw so the UI can handle it
    }
  };

  // Handle removing a holding
  const removeHolding = (holdingId) => {
    setUserHoldings(prev => prev.filter(h => h.id !== holdingId));
  };

  // Handle updating a holding
  const updateHolding = (holdingId, updates) => {
    setUserHoldings(prev => 
      prev.map(h => h.id === holdingId ? { ...h, ...updates } : h)
    );
  };

  // Clear all holdings
  const clearHoldings = () => {
    setUserHoldings([]);
  };

  const value = {
    userHoldings,
    userTransactions,
    isLoaded,
    addHolding,
    removeHolding,
    updateHolding,
    clearHoldings
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

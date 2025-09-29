// Polygon.io WebSocket service for real-time stock data
import { useState, useEffect, useRef } from 'react';

const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
const POLYGON_WS_URL = 'wss://socket.polygon.io/stocks';

/**
 * Custom hook for real-time stock data using Polygon.io WebSockets
 * @param {Array} symbols - Array of stock symbols to subscribe to
 * @returns {Object} Real-time stock data and connection status
 */
export const usePolygonWebSocket = (symbols = []) => {
  const [stockData, setStockData] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    // Only connect if we have symbols and an API key
    if (!symbols.length || !POLYGON_API_KEY) {
      return;
    }

    const connectWebSocket = () => {
      try {
        setConnectionStatus('connecting');
        
        // Create WebSocket connection
        const ws = new WebSocket(POLYGON_WS_URL);
        wsRef.current = ws;
        
        // Connection opened
        ws.addEventListener('open', () => {
          setConnectionStatus('connected');
          console.log('Connected to Polygon.io WebSocket');
          
          // Authenticate with API key
          ws.send(JSON.stringify({ action: 'auth', params: POLYGON_API_KEY }));
          
          // Subscribe to stock symbols
          ws.send(JSON.stringify({
            action: 'subscribe',
            params: symbols.map(symbol => `T.${symbol}`)
          }));
        });
        
        // Listen for messages
        ws.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);
          
          // Handle different message types
          if (data[0]?.ev === 'T') {
            // Trade event
            const trade = data[0];
            const symbol = trade.sym;
            
            setStockData(prevData => ({
              ...prevData,
              [symbol]: {
                ...prevData[symbol],
                price: trade.p,
                size: trade.s,
                timestamp: trade.t,
                lastUpdated: new Date().toISOString()
              }
            }));
          } else if (data[0]?.ev === 'status') {
            // Status message
            console.log('Polygon.io status:', data[0]);
          }
        });
        
        // Handle errors
        ws.addEventListener('error', (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('error');
        });
        
        // Connection closed
        ws.addEventListener('close', () => {
          setConnectionStatus('disconnected');
          console.log('Disconnected from Polygon.io WebSocket');
          
          // Attempt to reconnect after delay
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 5000);
        });
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setConnectionStatus('error');
      }
    };
    
    // Initial connection
    connectWebSocket();
    
    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [symbols]);
  
  // Function to manually reconnect
  const reconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  };
  
  return {
    stockData,
    connectionStatus,
    reconnect
  };
};

/**
 * Format WebSocket data for display
 * @param {Object} stockData - Real-time stock data from WebSocket
 * @param {Object} baseData - Base stock data to merge with real-time updates
 * @returns {Object} Formatted stock data for display
 */
export const formatWebSocketData = (stockData, baseData) => {
  if (!stockData || !baseData) return baseData;
  
  const symbol = baseData.id;
  const realtimeData = stockData[symbol];
  
  if (!realtimeData) return baseData;
  
  const currentPrice = realtimeData.price;
  const previousPrice = baseData.price;
  const change = currentPrice - previousPrice;
  const changePercent = (change / previousPrice) * 100;
  
  return {
    ...baseData,
    price: currentPrice,
    change: change,
    changePercent: changePercent,
    lastUpdated: realtimeData.lastUpdated
  };
};
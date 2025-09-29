import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { useTheme } from '../contexts/ThemeContext';

const EnhancedChart = ({ 
  data, 
  type = 'line', 
  height = 300, 
  options = {}, 
  className = '' 
}) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const { isDarkMode } = useTheme();
  
  // Define theme-based colors
  const getThemeColors = () => {
    return {
      textColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
      gridColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      borderColor: isDarkMode ? 'rgba(56, 189, 248, 0.8)' : 'rgba(14, 165, 233, 0.8)',
      pointBackgroundColor: isDarkMode ? 'rgba(56, 189, 248, 1)' : 'rgba(14, 165, 233, 1)',
      positiveColor: isDarkMode ? 'rgba(34, 197, 94, 0.8)' : 'rgba(22, 163, 74, 0.8)',
      negativeColor: isDarkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(220, 38, 38, 0.8)',
    };
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const colors = getThemeColors();
      
      // Destroy previous chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      
      // Default options based on chart type
      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            labels: {
              color: colors.textColor,
              font: {
                family: "'Inter', sans-serif",
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: colors.backgroundColor,
            titleColor: colors.textColor,
            bodyColor: colors.textColor,
            borderColor: colors.borderColor,
            borderWidth: 1,
            cornerRadius: 6,
            padding: 10,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              // Add custom tooltip formatting based on chart type
              label: function(context) {
                if (type === 'line' || type === 'bar') {
                  return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                }
                return context.formattedValue;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: colors.gridColor,
              borderColor: colors.gridColor,
              tickColor: colors.gridColor
            },
            ticks: {
              color: colors.textColor,
              font: {
                family: "'Inter', sans-serif",
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: colors.gridColor,
              borderColor: colors.gridColor,
              tickColor: colors.gridColor
            },
            ticks: {
              color: colors.textColor,
              font: {
                family: "'Inter', sans-serif",
                size: 11
              },
              callback: function(value) {
                if (type === 'line' || type === 'bar') {
                  return '$' + value.toFixed(2);
                }
                return value;
              }
            }
          }
        }
      };
      
      // Special options for different chart types
      if (type === 'pie' || type === 'doughnut') {
        defaultOptions.plugins.tooltip.callbacks.label = function(context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${percentage}% ($${value.toFixed(2)})`;
        };
      }
      
      // Create gradient for line charts
      if (type === 'line') {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, isDarkMode ? 'rgba(56, 189, 248, 0.4)' : 'rgba(14, 165, 233, 0.4)');
        gradient.addColorStop(1, isDarkMode ? 'rgba(56, 189, 248, 0.0)' : 'rgba(14, 165, 233, 0.0)');
        
        // Apply gradient to datasets
        if (data.datasets && data.datasets.length > 0) {
          data.datasets.forEach(dataset => {
            dataset.backgroundColor = dataset.backgroundColor || gradient;
            dataset.borderColor = dataset.borderColor || colors.borderColor;
            dataset.pointBackgroundColor = dataset.pointBackgroundColor || colors.pointBackgroundColor;
            dataset.pointBorderColor = dataset.pointBorderColor || colors.borderColor;
            dataset.pointHoverBackgroundColor = dataset.pointHoverBackgroundColor || colors.backgroundColor;
            dataset.pointHoverBorderColor = dataset.pointHoverBorderColor || colors.borderColor;
          });
        }
      }
      
      // Apply dynamic colors to bar charts
      if (type === 'bar' && data.datasets && data.datasets.length > 0) {
        data.datasets.forEach(dataset => {
          if (!dataset.backgroundColor) {
            dataset.backgroundColor = dataset.data.map(value => 
              value >= 0 ? colors.positiveColor : colors.negativeColor
            );
          }
        });
      }
      
      // Merge default options with provided options
      const mergedOptions = { ...defaultOptions, ...options };
      
      // Create new chart
      chartRef.current = new Chart(ctx, {
        type,
        data,
        options: mergedOptions
      });
    }
    
    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, type, height, options, isDarkMode]);

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default EnhancedChart;
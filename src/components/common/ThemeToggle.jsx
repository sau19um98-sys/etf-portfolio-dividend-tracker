import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800
        ${theme === 'dark' 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
        }
        ${className}
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Toggle circle */}
      <span
        className={`
          absolute inline-block w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out
          ${theme === 'dark' ? 'translate-x-3' : '-translate-x-3'}
        `}
      >
        {/* Icon inside the circle */}
        <span className="absolute inset-0 flex items-center justify-center">
          {theme === 'dark' ? (
            <MoonIcon className="w-3 h-3 text-purple-600" />
          ) : (
            <SunIcon className="w-3 h-3 text-orange-500" />
          )}
        </span>
      </span>
      
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <SunIcon className={`w-3 h-3 transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-30 text-white' : 'opacity-0'
        }`} />
        <MoonIcon className={`w-3 h-3 transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-0' : 'opacity-30 text-white'
        }`} />
      </div>
    </button>
  );
};

export default ThemeToggle;

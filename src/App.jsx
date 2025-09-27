import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotificationSystem from './components/common/NotificationSystem';
import LoadingSpinner from './components/common/LoadingSpinner';
import { configStatus } from './config/appConfig';

// Protected Route component
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fullScreen message="Authenticating..." size="large" />;
  }
  
  return currentUser ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fullScreen message="Loading..." size="large" />;
  }
  
  return currentUser ? <Navigate to="/" replace /> : children;
};

function App() {
  // Check configuration status
  if (!configStatus.isValid) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Configuration Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The application is not properly configured. Please check your environment variables.
          </p>
          <ul className="text-sm text-red-600 dark:text-red-400 text-left">
            {configStatus.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <PortfolioProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <Routes>
                  {/* Public routes */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  
                  {/* Protected routes */}
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/portfolio"
                    element={
                      <PrivateRoute>
                        <Portfolio />
                      </PrivateRoute>
                    }
                  />
                  
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                  
                  {/* Catch all route - redirect to dashboard */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              
              {/* Global Notification System */}
              <NotificationSystem />
            </Router>
          </PortfolioProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

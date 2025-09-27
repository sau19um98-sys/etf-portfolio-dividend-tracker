import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Demo mode - simulate authentication without Firebase
  const demoUser = {
    uid: 'demo-user-123',
    email: 'demo@example.com',
    displayName: 'Demo User',
    photoURL: null
  };

  // Sign up with email and password (demo mode)
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        ...demoUser,
        email,
        displayName: displayName || 'New User'
      };
      
      setCurrentUser(user);
      localStorage.setItem('demoUser', JSON.stringify(user));
      return { user };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password (demo mode)
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        ...demoUser,
        email
      };
      
      setCurrentUser(user);
      localStorage.setItem('demoUser', JSON.stringify(user));
      return { user };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google (demo mode)
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        ...demoUser,
        displayName: 'Google Demo User',
        photoURL: null // Remove placeholder image to avoid network errors
      };
      
      setCurrentUser(user);
      localStorage.setItem('demoUser', JSON.stringify(user));
      return { user };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out (demo mode)
  const logout = async () => {
    try {
      setError(null);
      setCurrentUser(null);
      localStorage.removeItem('demoUser');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check for existing demo user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('demoUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('demoUser');
      }
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

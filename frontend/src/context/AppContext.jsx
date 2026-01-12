import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const authMode = localStorage.getItem('taxi_martha_auth_mode');
    if (authMode) {
      setIsAuthenticated(true);
      setIsAdmin(authMode === 'admin');
    }

    // Check dark mode preference
    const darkMode = localStorage.getItem('taxi_martha_dark_mode');
    if (darkMode === 'true') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const login = (mode) => {
    localStorage.setItem('taxi_martha_auth_mode', mode);
    setIsAuthenticated(true);
    setIsAdmin(mode === 'admin');
  };

  const logout = () => {
    localStorage.removeItem('taxi_martha_auth_mode');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('taxi_martha_dark_mode', newDark.toString());

    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const value = {
    isAdmin,
    setIsAdmin,
    isDark,
    toggleTheme,
    isAuthenticated,
    login,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    // TODO: Implement authentication check
    // Check sessionStorage or localStorage for auth token/flag
    const authStatus = sessionStorage.getItem('taxi_martha_auth');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const login = () => {
    // TODO: Implement login logic
    // Set authentication status in sessionStorage
    sessionStorage.setItem('taxi_martha_auth', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    // TODO: Implement logout logic
    // Clear authentication status
    sessionStorage.removeItem('taxi_martha_auth');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout
  };
};

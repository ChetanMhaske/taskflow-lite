import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, fetchCurrentUser, logoutUser } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'taskflow_auth_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify session on load
  useEffect(() => {
    let isMounted = true;

    async function checkAuthStatus() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetchCurrentUser(storedToken);
        if (isMounted && response?.user) {
          setUser(response.user);
          setToken(storedToken);
        }
      } catch (err) {
        console.warn('Stored token is invalid or expired:', err.message);
        if (isMounted) {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuthStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password);
    if (data?.token && data?.user) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    }
    throw new Error('Authentication response was incomplete.');
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

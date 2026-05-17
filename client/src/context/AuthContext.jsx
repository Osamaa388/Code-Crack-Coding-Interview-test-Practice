import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../utils/api.js';
import { getStoredToken, setStoredToken, clearStoredToken, isTokenExpired } from '../utils/token.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
    api.post('/auth/logout').catch(() => {});
  }, []);

  const loadUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    if (isTokenExpired(token)) {
      clearStoredToken();
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch {
      clearStoredToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const updateUser = useCallback((userData) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : userData));
  }, []);

  const loginWithRemember = useCallback((token, userData, remember = true) => {
    setStoredToken(token, remember);
    setUser(userData);
  }, []);

  const isAuthenticated = Boolean(user && getStoredToken());
  const isAdmin = user?.role === 'admin';

  const value = useMemo(
    () => ({ user, loading, login: loginWithRemember, logout, loadUser, updateUser, isAuthenticated, isAdmin }),
    [user, loading, loginWithRemember, logout, loadUser, updateUser, isAuthenticated, isAdmin]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

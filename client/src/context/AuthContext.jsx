import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, subscriptionAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      const { data } = await authAPI.getMe();
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      try {
        const subRes = await subscriptionAPI.getStatus();
        setSubscription(subRes.data.data);
      } catch (e) { /* no subscription */ }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    await fetchUser();
    return data.data;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSubscription(null);
  };

  const updateUser = async (updates) => {
    const { data } = await authAPI.updateMe(updates);
    setUser(data.data);
    localStorage.setItem('user', JSON.stringify(data.data));
    return data.data;
  };

  return (
    <AuthContext.Provider value={{
      user, subscription, loading,
      login, register, logout, updateUser,
      fetchUser, isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isSubscriber: user?.role === 'subscriber' || user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

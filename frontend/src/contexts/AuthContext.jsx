import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { errMsg } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dimangax_user')) || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('dimangax_token');
    if (!token) { setLoading(false); return; }

    let cancelled = false;
    api.get('/auth/me')
      .then(r => {
        if (cancelled) return;
        setUser(r.data);
        localStorage.setItem('dimangax_user', JSON.stringify(r.data));
      })
      .catch((err) => {
        if (cancelled) return;
        // Only clear if it's an auth error, not a network error
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('dimangax_token');
          localStorage.removeItem('dimangax_user');
          setUser(null);
        }
        // On network error, keep the cached user so the app still works offline-ish
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('dimangax_token', data.token);
      localStorage.setItem('dimangax_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      const e = new Error(errMsg(err, 'Login failed'));
      e.response = err.response;
      throw e;
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      localStorage.setItem('dimangax_token', data.token);
      localStorage.setItem('dimangax_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      const e = new Error(errMsg(err, 'Registration failed'));
      e.response = err.response;
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dimangax_token');
    localStorage.removeItem('dimangax_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('dimangax_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateUser,
      isAdmin: user?.role === 'admin',
      isAuthenticated: !!user,
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

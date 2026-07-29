import React, { createContext, useState, useEffect } from 'react';
import { loginUser as loginApi, registerUser as registerApi, getCurrentUser } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('drivepulse_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('drivepulse_token'));
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginApi(credentials);
      const { user: userData, token: authToken } = res.data;
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('drivepulse_user', JSON.stringify(userData));
      localStorage.setItem('drivepulse_token', authToken);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await registerApi(userData);
      const { user: newUser, token: authToken } = res.data;
      setUser(newUser);
      setToken(authToken);
      localStorage.setItem('drivepulse_user', JSON.stringify(newUser));
      localStorage.setItem('drivepulse_token', authToken);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('drivepulse_user');
    localStorage.removeItem('drivepulse_token');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

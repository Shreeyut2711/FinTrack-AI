import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, currency?: string) => Promise<void>;
  logout: () => void;
  updateUser: (u: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fintrack_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fintrack_token'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('fintrack_token', res.data.token);
        localStorage.setItem('fintrack_user', JSON.stringify(res.data.user));
      } else {
        throw new Error(res.data.error || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string, currency: string = 'INR') => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password: pass, currency });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('fintrack_token', res.data.token);
        localStorage.setItem('fintrack_user', JSON.stringify(res.data.user));
      } else {
        throw new Error(res.data.error || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedFields };
      setUser(newUser);
      localStorage.setItem('fintrack_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE_URL}api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setIsAdmin(response.data.user.role === 'admin');
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}api/auth/login`, { email, password });
    const user = response.data; // Assuming the response contains user data including role
    localStorage.setItem('token', user.token);
    setUser(user);
    setIsAuthenticated(true);
    setIsAdmin(user.role === 'admin'); // Set admin status based on user role
    return user; // Return user data for further use
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
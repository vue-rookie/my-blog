"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check local storage on load to persist login session briefly
  useEffect(() => {
    const session = sessionStorage.getItem('nebula_admin');
    if (session === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/blog/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAdmin(true);
        sessionStorage.setItem('nebula_admin', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录请求失败:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('nebula_admin');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
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
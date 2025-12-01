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

  const login = (password: string) => {
    // Simple client-side gate. In a real app, use a backend.
    if (password === 'nebula') {
      setIsAdmin(true);
      sessionStorage.setItem('nebula_admin', 'true');
      return true;
    }
    return false;
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
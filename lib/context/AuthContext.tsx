"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

interface User {
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "limewp-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setIsAuthenticated(true);
        setUser(parsed.user);
      }
    } catch {
      // Invalid stored data
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const userData = { email };
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userData }));
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

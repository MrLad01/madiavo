'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user types
export type UserRole = 'user' | 'admin' | null;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  // logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you'd check for a stored token and validate it
        const storedUser = localStorage.getItem('authUser');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

const login = async (email: string, password: string): Promise<boolean> => {
  setIsLoading(true);

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // include cookies if your backend sets them
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const responseData = await res.json();

    const data = responseData.data

    const user: AuthUser = {
      id: data.user.user_id,
      email: data.user.email,
      name: `${data.user.first_name} ${data.user.last_name}`,
      role: data.user.role,
    };

    localStorage.setItem('authUser', JSON.stringify(user));
    setUser(user);
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  } finally {
    setIsLoading(false);
  }
};


  const signup = async (name: string, email: string,): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock error case for demo purposes
      if (email === 'taken@example.com') {
        throw new Error('Email address is already in use');
      }
      
      // In a real app, you'd create the user via API
      const user: AuthUser = {
        id: '123456',
        email,
        name,
        role: 'user' // Default role for new signups
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('authUser', JSON.stringify(user));
      
      setUser(user);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // const logout = () => {
  //   localStorage.removeItem('authUser');
  //   setUser(null);
  // };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    // logout,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
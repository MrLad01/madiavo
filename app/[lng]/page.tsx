'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import LoginPage from './components/Auth Pages/LoginPage';
import SignUpPage from './components/Auth Pages/SignUpPage';
import ForgotPasswordPage from './components/Auth Pages/ForgotPasswordPage';
import EmailVerificationPage from './components/Auth Pages/EmailVerificationPage';
import ResetPasswordPage from './components/Auth Pages/ResetPasswordPage';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';

// TypeScript Interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface LoginResponse {
  user: User;
  token: string;
  expires_at: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// API service for authentication
class AuthService {
  private static API_URL = '/api';
  private static TOKEN_KEY = 'madiavo_auth_token';

  // Method to register a new user
  static async register(userData: { fullName: string, email: string, password: string }): Promise<User> {
    try {
      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Method to log in a user
  static async login(credentials: { email: string, password: string }): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Save token to localStorage
      localStorage.setItem(this.TOKEN_KEY, data.token);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Method to log out a user
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    // Optionally, call an API endpoint to invalidate the token on the server
  }

  // Method to request a password reset
  static async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset request failed');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Method to reset a password with token
  static async resetPassword(token: string, password: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Method to verify email
  static async verifyEmail(token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email verification failed');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Method to get current user
  static async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    
    if (!token) {
      return null;
    }
    
    try {
      const response = await fetch(`${this.API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          return null;
        }
        throw new Error('Failed to get user data');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Method to get user activity logs
  static async getActivityLogs(): Promise<ActivityLog[]> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    try {
      const response = await fetch(`${this.API_URL}/auth/activity-logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get activity logs');
      }

      const data = await response.json();
      return data.logs;
    } catch (error) {
      console.error('Get activity logs error:', error);
      throw error;
    }
  }

  // Method to check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // Method to get stored token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

// Main App component that switches between pages
export default function AuthPages() {
  const params = useParams();
  const [currentPage, setCurrentPage] = useState('login');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [resetPasswordSent, setResetPasswordSent] = useState(false);
  
  // Ensure we have a language parameter
  if (!params?.lng || typeof params.lng !== 'string') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-xl font-medium text-red-600">Language parameter missing</h2>
          <p className="mt-2 text-gray-600">Please access this page through a valid language route.</p>
        </div>
      </div>
    );
  }
  
  // Handle page navigation
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage 
          onSignUpClick={() => setCurrentPage('signup')}
          onForgotPasswordClick={() => setCurrentPage('forgot-password')}
        />;
      case 'signup':
        return <SignUpPage 
          onLoginClick={() => setCurrentPage('login')}
          onSubmitSuccess={() => setEmailVerificationSent(true)}
        />;
      case 'forgot-password':
        return <ForgotPasswordPage 
          onLoginClick={() => setCurrentPage('login')}
          onSubmitSuccess={() => setResetPasswordSent(true)}
        />;
      case 'email-verification':
        return <EmailVerificationPage 
          onBackToLogin={() => setCurrentPage('login')}
        />;
      case 'reset-password':
        return <ResetPasswordPage 
          onSuccessfulReset={() => setCurrentPage('login')}
        />;
      default:
        return <LoginPage 
          onSignUpClick={() => setCurrentPage('signup')}
          onForgotPasswordClick={() => setCurrentPage('forgot-password')}
        />;
    }
  };

  return (
    <>
      <LanguageSwitcher />
      <ThemeSwitcher />
      {emailVerificationSent ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a verification email to your inbox. Please check and follow the instructions to verify your account.
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  setEmailVerificationSent(false);
                  setCurrentPage('login');
                }}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      ) : resetPasswordSent ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Check Your Email</h2>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  setResetPasswordSent(false);
                  setCurrentPage('login');
                }}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      ) : (
        renderPage()
      )}
    </>
  );
}
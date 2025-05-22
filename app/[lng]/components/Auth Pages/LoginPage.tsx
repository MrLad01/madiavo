'use client';
import { useState } from "react";
import { useT } from '../../../i18n/client'
import { ArrowRight, AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

interface LoginPageProps {
  onSignUpClick: () => void;
  onForgotPasswordClick: () => void;
}

export default function LoginPage({ onSignUpClick, onForgotPasswordClick }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useT('common');
  const { login, isLoading } = useAuth();
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset error message
    setErrorMessage('');
    
    // Basic validation
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // Redirect based on user role (will be handled by your protected routes)
        router.push('/lt/admin');
      } else {
        setErrorMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-start bg-gray-100 dark:bg-gray-200">
      <div className="max-w-md w-full h-screen flex flex-col items-center justify-center space-y-6 bg-white dark:bg-gray-900 dark:text-white p-3 rounded-r-2xl dark:rounded-r-lg shadow-r-md">
        <div className="flex flex-col gap-1">
          <h1 className="text-center text-4xl font-extrabold text-indigo-600 dark:text-white">Madiavo.</h1>
          <h2 className="text-center text-sm text-gray-600 dark:text-white dark:opacity-70">{t('Sign in to your account')}</h2>
        </div>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="gap-3 flex flex-col">
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">{t('email address')}</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrorMessage('');
                }}
                className="appearance-none rounded-md relative block w-full p-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('email address')}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">{t('password')}</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrorMessage('');
                }}
                className="appearance-none rounded-md relative block w-full p-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('password')}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              <div className="text-xs pt-1 absolute right-0">
                <button
                  type="button"
                  onClick={onForgotPasswordClick}
                  className="font-medium cursor-pointer text-indigo-600 hover:text-indigo-500"
                >
                  {t('Forgot your password?')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-start pt-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 cursor-pointer text-indigo-600 dark:text-white focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-900 dark:text-white">
                {t('Remember me')}
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  {t('Sign in')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-white">
            {t(`Don't have an account?`)}{' '}
            <button 
              onClick={onSignUpClick} 
              className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500"
            >
              {t('Register')}
            </button>
          </p>
      </div>
    </div>
  );
}
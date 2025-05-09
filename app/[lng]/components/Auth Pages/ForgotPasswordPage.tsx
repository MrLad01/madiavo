'use client';
import { useState } from "react";
import { useT } from '../../../i18n/client';
import { ArrowRight, AlertCircle, Mail } from "lucide-react";

interface ForgotPasswordPageProps {
    onLoginClick: () => void;
    onSubmitSuccess: () => void;
}

// Forgot Password Page Component
export default function ForgotPasswordPage({ onLoginClick, onSubmitSuccess }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useT('common')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset error message
    setErrorMessage('');
    
    // Basic validation
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make an actual API call to your backend
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      
      // For demo purposes, let's show an error for a specific email
      if (email === 'unknown@example.com') {
        throw new Error('Email not found in our system');
      }
      
      // Handle successful password reset request
      console.log('Password reset email sent');
      onSubmitSuccess();
      
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Failed to send reset email. Please try again.');
      } else {
        setErrorMessage('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 dark:text-white p-8 rounded-xl shadow-md">
        <div>
          <h1 className="text-center text-4xl font-extrabold text-indigo-600 dark:text-white">Madiavo.</h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-indigo-600 dark:opacity-75">{t('Reset your password')}</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t(`Enter your email address and we'll send you a link to reset your password.`)}
          </p>
        </div>
        
        {errorMessage && (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
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
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full p-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('email address')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('Sending reset link')}...
                </span>
              ) : (
                <span className="flex items-center">
                  {t('Send reset link')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={onLoginClick}
              className="font-medium text-indigo-600 dark:text-white cursor-pointer hover:text-indigo-500"
            >
              {t('Back to login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
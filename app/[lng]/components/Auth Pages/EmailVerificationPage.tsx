'use client';
import { useState } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";

interface EmailVerificationPageProps {
    onBackToLogin: () => void;
}

// Email Verification Page Component
export default function EmailVerificationPage({ onBackToLogin }: EmailVerificationPageProps) {
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Reset error message
      setErrorMessage('');
      
      // Basic validation
      if (!verificationCode) {
        setErrorMessage('Please enter the verification code');
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Here you would make an actual API call to your backend
        // const response = await fetch('/api/auth/verify-email', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ code: verificationCode }),
        // });
        
        // For demo purposes, let's show an error for a specific code
        if (verificationCode === '0000') {
          throw new Error('Invalid or expired verification code');
        }
        
        // Handle successful verification
        console.log('Email verified successfully');
        onBackToLogin();
        
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message || 'Verification failed. Please try again.');
        } else {
          setErrorMessage('Verification failed. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div>
            <h1 className="text-center text-4xl font-extrabold text-indigo-600">madiavo</h1>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Verify your email</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please enter the verification code that was sent to your email address.
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
              <div>
                <label htmlFor="verification-code" className="sr-only">Verification code</label>
                <input
                  id="verification-code"
                  name="code"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Verification code"
                />
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
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Verify email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
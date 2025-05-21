'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/app/context/AuthContext';


interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Skip checks while loading authentication state
    if (isLoading) return;
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // If role requirements exist, check them
    if (requiredRole && user) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      // If user doesn't have required role, redirect to appropriate page
      if (!roles.includes(user.role)) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'user') {
          router.push('/dashboard');
        } else {
          router.push('/auth/login');
        }
      }
    }
  }, [isAuthenticated, isLoading, requiredRole, user, router]);

  // Show loading or nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500">loading.....</div>
      </div>
    );
  }

  // If user is authenticated and has required role (or no role is required), render children
  return <>{children}</>;
};

export default ProtectedRoute;
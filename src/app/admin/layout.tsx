/**
 * Admin Dashboard Layout
 * Provides authentication protection and layout structure
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminAuth } from '@/lib/admin/auth';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/Header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current path is auth-related
  const isAuthRoute = pathname?.startsWith('/admin/auth');

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AdminAuth.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);

      // Only redirect to login if not authenticated and not already on an auth route
      if (!authenticated && !isAuthRoute) {
        router.push('/admin/auth/login');
      }
      
      // Redirect to admin dashboard if authenticated and on login page
      if (authenticated && pathname === '/admin/auth/login') {
        router.push('/admin');
      }
    };

    checkAuth();

    // Check authentication status periodically
    const interval = setInterval(checkAuth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [router, pathname, isAuthRoute]);

  const handleLogout = () => {
    AdminAuth.logout();
    setIsAuthenticated(false);
    router.push('/admin/auth/login');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fm-neutral-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fm-magenta-700"></div>
          <p className="text-sm text-fm-neutral-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Auth routes (login, etc.) - render without authentication
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Not authenticated for protected routes
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fm-neutral-50">
        <div className="text-center">
          <p className="text-fm-neutral-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Authenticated - show full admin layout
  return (
    <div className="min-h-screen bg-fm-neutral-50">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Header */}
        <AdminHeader />
        
        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
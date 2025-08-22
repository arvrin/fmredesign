/**
 * Admin Login Page
 * Simple password-based authentication
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { AdminAuth } from '@/lib/admin/auth';
import { Button } from '@/design-system/components/atoms/Button/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    if (AdminAuth.isAuthenticated()) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = AdminAuth.authenticate(password);

    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fm-magenta-50 to-fm-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-fm-magenta-700">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-fm-neutral-900">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-fm-neutral-600">
            Enter your admin password to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-fm-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-fm-neutral-400 hover:text-fm-neutral-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-fm-neutral-400 hover:text-fm-neutral-600" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Authentication Failed
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              size="lg"
              className="justify-center"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          {/* Help text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-fm-neutral-500">
              This is a password-protected admin area for Freaking Minds team members only.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-fm-neutral-500">
            © 2025 Freaking Minds. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
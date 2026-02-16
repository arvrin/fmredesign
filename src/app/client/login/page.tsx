'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DashboardCard as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardButton as Button,
} from '@/design-system';
import { Input } from '@/components/ui/Input';
import { Shield, Mail, AlertCircle, Info } from 'lucide-react';

export default function ClientLoginPage() {
  return (
    <Suspense>
      <ClientLoginForm />
    </Suspense>
  );
}

function ClientLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get('error') === 'session_expired';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    sessionExpired ? 'Your session has expired. Please log in again.' : null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/client-portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push(data.data.redirectUrl);
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fm-magenta-50 via-orange-50/30 to-fm-magenta-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <Card variant="glass" className="overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-fm-magenta-600/10 to-fm-magenta-400/10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-400 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-500 bg-clip-text text-transparent">
              FreakingMinds Client Portal
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your Progress Hub - Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-fm-magenta-500 focus:ring-fm-magenta-500 bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  showPasswordToggle
                  className="h-12 rounded-xl border-gray-200 focus:border-fm-magenta-500 focus:ring-fm-magenta-500 bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="client"
                size="lg"
                fullWidth
                loading={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50/50 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Info className="h-4 w-4 text-gray-500" />
                <p className="font-medium">Need login credentials?</p>
              </div>
              <p className="mt-1">Contact your account manager for your portal password.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

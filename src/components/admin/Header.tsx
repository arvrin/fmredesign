/**
 * Admin Dashboard Header
 */

'use client';

import { Bell, Search, User } from 'lucide-react';
import { AdminAuth } from '@/lib/admin/auth';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AdminHeader({ title = "Dashboard", subtitle }: AdminHeaderProps) {
  const session = AdminAuth.getSession();

  const formatTimeRemaining = () => {
    if (!session) return '';
    
    const timeRemaining = session.expiresAt - Date.now();
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    
    if (hoursRemaining > 1) {
      return `${hoursRemaining}h remaining`;
    } else if (hoursRemaining === 1) {
      return '1h remaining';
    } else {
      const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));
      return `${minutesRemaining}m remaining`;
    }
  };

  return (
    <header className="bg-white border-b border-fm-neutral-200 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex h-16 justify-between items-center">
        {/* Logo and Title */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="Freaking Minds" 
              className="h-10 w-auto flex-shrink-0"
            />
            <div>
              <h1 className="text-2xl font-bold leading-7 text-fm-neutral-900 sm:truncate sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-fm-neutral-500">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-x-4">
          {/* Search (placeholder for future) */}
          <button className="rounded-full p-1 text-fm-neutral-500 hover:text-fm-neutral-700 focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2">
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications (placeholder for future) */}
          <button className="rounded-full p-1 text-fm-neutral-500 hover:text-fm-neutral-700 focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2">
            <Bell className="h-5 w-5" />
          </button>

          {/* Session info */}
          <div className="flex items-center gap-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-fm-neutral-900">Admin</p>
              <p className="text-xs text-fm-neutral-500">
                {formatTimeRemaining()}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fm-magenta-100">
              <User className="h-4 w-4 text-fm-magenta-700" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
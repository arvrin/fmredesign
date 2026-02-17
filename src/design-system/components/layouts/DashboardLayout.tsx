'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '../primitives/Button';
import {
  Menu,
  X,
  ChevronLeft,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  variant?: 'admin' | 'client';
  navigation?: NavigationItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  onLogout?: () => void;
  className?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
  badge?: string | number;
  children?: NavigationItem[];
}

const layoutVariants = {
  admin: {
    bg: 'bg-gradient-to-br from-fm-magenta-50 via-white to-fm-magenta-50/50',
    sidebar: 'bg-white/95 backdrop-blur-md border-r border-fm-magenta-200',
    header: 'bg-white/80 backdrop-blur-md border-b border-fm-magenta-200',
    accent: 'text-fm-magenta-700',
    logo: 'FreakingMinds Admin',
    theme: 'Command Center'
  },
  client: {
    bg: 'bg-[#FEFCFB]',
    sidebar: 'bg-white border-r border-fm-magenta-100/50',
    header: 'bg-white border-b border-fm-magenta-100/30',
    accent: 'text-fm-magenta-700',
    logo: 'Client Portal',
    theme: 'Your Progress Hub'
  }
};

const SIDEBAR_STORAGE_KEY = 'fm-sidebar-collapsed';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  variant = 'admin',
  navigation = [],
  user,
  onLogout,
  className
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const styles = layoutVariants[variant];

  // Persist sidebar collapsed state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === 'true') setSidebarCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const defaultNavigation: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: variant === 'admin' ? '/admin' : '/client',
      icon: <div className="w-5 h-5 rounded bg-current opacity-20" />,
      active: true
    }
  ];

  const navItems = navigation.length > 0 ? navigation : defaultNavigation;

  return (
    <div className={cn('min-h-screen flex', styles.bg, className)}>
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 flex flex-col transition-all duration-300',
          styles.sidebar,
          sidebarCollapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ zIndex: 50 }}
      >
        {/* Sidebar Header */}
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center py-3 gap-1 border-b border-fm-neutral-100">
            <Link href="/" aria-label="FreakingMinds home">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-700 flex items-center justify-center text-white font-bold text-sm hover:opacity-80 transition-opacity">
                FM
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="hidden lg:flex"
              style={{ height: '28px', width: '28px', padding: 0 }}
              aria-label="Expand sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 border-b border-fm-neutral-100">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-700 flex items-center justify-center text-white font-bold text-sm">
                FM
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-fm-neutral-900">{styles.logo}</h1>
                <p className="text-xs text-fm-neutral-500">{styles.theme}</p>
              </div>
            </Link>

            {/* Collapse toggle — desktop */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(true)}
              className="hidden lg:flex"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Mobile close */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2" aria-label="Dashboard navigation">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                'hover:bg-fm-magenta-50/60 hover:scale-105 active:scale-95',
                item.active
                  ? 'bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 shadow-[0_4px_12px_rgba(168,37,72,0.3)] text-white'
                  : 'text-fm-neutral-700 hover:text-fm-neutral-900'
              )}
            >
              {item.icon && (
                <span className={cn('flex-shrink-0 relative', item.active ? 'text-white' : styles.accent)}>
                  {item.icon}
                  {/* Badge dot when sidebar is collapsed */}
                  {sidebarCollapsed && item.badge && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-fm-magenta-500 rounded-full" />
                  )}
                </span>
              )}
              {!sidebarCollapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-fm-magenta-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        {user && (
          <div className="p-4 border-t border-fm-neutral-100">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-fm-magenta-50/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-fm-magenta-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-fm-neutral-900 truncate">{user.name}</p>
                  <p className="text-xs text-fm-neutral-500 truncate">{user.email}</p>
                </div>
                {onLogout && (
                  <Button variant="ghost" size="sm" onClick={onLogout} aria-label="Log out">
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-fm-magenta-600" />
                </div>
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    aria-label="Log out"
                    style={{ height: '28px', width: '28px', padding: 0 }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className={cn('flex-1 flex flex-col', sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64')}>
        {/* Header */}
        <header className={cn('flex items-center justify-between p-4 lg:px-6', styles.header)}>
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-fm-magenta-500 rounded-full" />
            </Button>

            <Button variant="ghost" size="sm" aria-label="Help center">
              <HelpCircle className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm" aria-label="Settings">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
          style={{ zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

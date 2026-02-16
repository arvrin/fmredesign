'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../primitives/Button';
import { 
  Menu, 
  X, 
  ChevronLeft,
  Bell,
  Search,
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
    bg: 'bg-gradient-to-br from-fm-magenta-50/30 via-white to-fm-neutral-50',
    sidebar: 'bg-white/95 backdrop-blur-md border-r border-fm-magenta-100',
    header: 'bg-white/80 backdrop-blur-md border-b border-fm-magenta-100',
    accent: 'text-fm-magenta-700',
    logo: 'Client Portal',
    theme: 'Your Progress Hub'
  }
};

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
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300',
        styles.sidebar,
        sidebarCollapsed ? 'w-16' : 'w-64',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 flex items-center justify-center text-white font-bold text-sm')}>
                FM
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">{styles.logo}</h1>
                <p className="text-xs text-gray-500">{styles.theme}</p>
              </div>
            </div>
          )}
          
          {/* Collapse toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex"
          >
            <ChevronLeft className={cn('w-4 h-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
          </Button>
          
          {/* Mobile close */}
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                'hover:bg-gray-100/60 hover:scale-105 active:scale-95',
                item.active ? cn('bg-gradient-to-r shadow-md text-white', 
                  variant === 'admin' ? 'from-fm-magenta-600 to-fm-magenta-700' : 'from-fm-magenta-500 to-fm-magenta-700'
                ) : 'text-gray-700 hover:text-gray-900'
              )}
            >
              {item.icon && (
                <span className={cn('flex-shrink-0', item.active ? 'text-white' : styles.accent)}>
                  {item.icon}
                </span>
              )}
              {!sidebarCollapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </a>
          ))}
        </nav>

        {/* User Section */}
        {user && (
          <div className="p-4 border-t border-gray-100">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                {onLogout && (
                  <Button variant="ghost" size="sm" onClick={onLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="w-full">
                <User className="w-4 h-4" />
              </Button>
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
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Search - Desktop only for now */}
            <div className="hidden md:flex items-center gap-2 bg-white/60 border border-gray-200 rounded-xl px-3 py-2 min-w-[300px]">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="sm">
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
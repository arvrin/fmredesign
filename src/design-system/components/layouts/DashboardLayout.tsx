'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  User,
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
    sidebar: 'bg-white/95 border-r border-fm-magenta-200',
    header: 'bg-white/95 border-b border-fm-magenta-200',
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

/* ── Tiny icon button for sidebar / header chrome ── */
const IconBtn: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }
> = ({ className, label, children, ...props }) => (
  <button
    className={cn(
      'flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
      'text-fm-neutral-400 hover:text-fm-neutral-700 hover:bg-fm-neutral-100',
      'transition-colors duration-150',
      className
    )}
    aria-label={label}
    {...props}
  >
    {children}
  </button>
);

/* ======================================================================== */

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  variant = 'admin',
  navigation = [],
  user,
  onLogout,
  className
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const styles = layoutVariants[variant];

  /* Persist collapsed preference */
  useEffect(() => {
    try {
      if (localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true') setCollapsed(true);
    } catch { /* SSR / privacy mode */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed)); } catch {}
  }, [collapsed]);

  const defaultNav: NavigationItem[] = [{
    label: 'Dashboard',
    href: variant === 'admin' ? '/admin' : '/client',
    icon: <div className="w-5 h-5 rounded bg-current opacity-20" />,
    active: true
  }];

  const navItems = navigation.length > 0 ? navigation : defaultNav;

  return (
    <div className={cn('min-h-screen flex', styles.bg, className)}>
      {/* ─────────────── Sidebar ─────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 flex flex-col',
          'transition-[width,transform] duration-300 ease-in-out',
          styles.sidebar,
          /* Width: always 256 on mobile, 72 or 256 on desktop */
          'w-64',
          collapsed && 'lg:w-[72px]',
          /* Slide: hidden off-screen on mobile until opened */
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ zIndex: 50 }}
      >
        {/* ── Header ── */}
        <div className={cn(
          'shrink-0 flex items-center h-14 border-b border-fm-neutral-100',
          collapsed ? 'px-4 lg:justify-center lg:px-0' : 'px-4 justify-between'
        )}>
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0',
              collapsed && 'lg:gap-0'
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              FM
            </div>
            {/* Text: always on mobile, hidden on desktop when collapsed */}
            <div className={cn('min-w-0', collapsed && 'lg:hidden')}>
              <h1 className="font-display font-bold text-[15px] leading-tight text-fm-neutral-900 truncate">
                {styles.logo}
              </h1>
              <p className="text-[11px] text-fm-neutral-500 truncate">{styles.theme}</p>
            </div>
          </Link>

          {/* Push controls right */}
          <div className={cn('flex-1', collapsed && 'lg:hidden')} />

          {/* Desktop: collapse button (only when expanded) */}
          {!collapsed && (
            <IconBtn
              onClick={() => setCollapsed(true)}
              label="Collapse sidebar"
              className="hidden lg:flex"
            >
              <PanelLeftClose className="w-4 h-4" />
            </IconBtn>
          )}

          {/* Mobile close */}
          <IconBtn
            onClick={() => setMobileOpen(false)}
            label="Close menu"
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </IconBtn>
        </div>

        {/* ── Navigation ── */}
        <nav
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden',
            'py-3 space-y-0.5',
            collapsed ? 'px-3 lg:px-2' : 'px-3'
          )}
          aria-label="Dashboard navigation"
        >
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group/nav relative flex items-center rounded-xl text-[13px] font-medium',
                'transition-all duration-200',
                /* Layout */
                collapsed
                  ? 'gap-3 px-3 py-2.5 lg:justify-center lg:px-0 lg:py-2.5'
                  : 'gap-3 px-3 py-2.5',
                /* Active / inactive */
                item.active
                  ? 'bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 text-white shadow-[0_4px_12px_rgba(168,37,72,0.25)]'
                  : 'text-fm-neutral-600 hover:text-fm-neutral-900 hover:bg-fm-magenta-50/50'
              )}
            >
              {item.icon && (
                <span className={cn(
                  'shrink-0 relative flex items-center justify-center',
                  item.active ? 'text-white' : styles.accent
                )}>
                  {item.icon}
                  {/* Badge dot — collapsed desktop only */}
                  {collapsed && item.badge && (
                    <span className="hidden lg:block absolute -top-1 -right-1.5 w-2 h-2 bg-fm-magenta-500 rounded-full ring-2 ring-white" />
                  )}
                </span>
              )}

              {/* Label: always on mobile, hidden on desktop when collapsed */}
              <span className={cn('truncate', collapsed && 'lg:hidden')}>
                {item.label}
              </span>

              {/* Badge pill */}
              {item.badge && (
                <span className={cn(
                  'ml-auto text-[11px] font-semibold rounded-full px-1.5 py-0.5 shrink-0',
                  item.active
                    ? 'bg-white/20 text-white'
                    : 'bg-fm-magenta-100 text-fm-magenta-700',
                  collapsed && 'lg:hidden'
                )}>
                  {item.badge}
                </span>
              )}

              {/* Tooltip — collapsed desktop only */}
              {collapsed && (
                <span
                  className={cn(
                    'hidden lg:block absolute left-full ml-3 px-2.5 py-1 rounded-lg',
                    'bg-fm-neutral-900 text-white text-xs font-medium whitespace-nowrap',
                    'opacity-0 pointer-events-none',
                    'group-hover/nav:opacity-100',
                    'transition-opacity duration-150',
                    'shadow-lg'
                  )}
                  style={{ zIndex: 60 }}
                >
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* ── Expand toggle — collapsed desktop only ── */}
        {collapsed && (
          <div className="hidden lg:flex shrink-0 justify-center py-2 border-t border-fm-neutral-100">
            <IconBtn onClick={() => setCollapsed(false)} label="Expand sidebar">
              <PanelLeftOpen className="w-4 h-4" />
            </IconBtn>
          </div>
        )}

        {/* ── User section ── */}
        {user && (
          <div className={cn(
            'shrink-0 border-t border-fm-neutral-100',
            collapsed ? 'p-3 lg:py-3 lg:px-2' : 'p-3'
          )}>
            <div className={cn(
              'flex items-center rounded-xl transition-colors',
              collapsed
                ? 'gap-3 px-1.5 py-1 lg:flex-col lg:items-center lg:gap-1.5 lg:px-0 lg:py-0'
                : 'gap-3 px-1.5 py-1 hover:bg-fm-magenta-50/30'
            )}>
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center shrink-0"
                title={collapsed ? user.name : undefined}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-fm-magenta-600" />
                )}
              </div>

              {/* Info: always on mobile, hidden on desktop when collapsed */}
              <div className={cn('flex-1 min-w-0', collapsed && 'lg:hidden')}>
                <p className="text-sm font-medium text-fm-neutral-900 truncate">{user.name}</p>
                <p className="text-[11px] text-fm-neutral-500 truncate">{user.email}</p>
              </div>

              {/* Logout */}
              {onLogout && (
                <IconBtn
                  onClick={onLogout}
                  label="Log out"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </IconBtn>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* ─────────────── Main content ─────────────── */}
      <div className={cn(
        'flex-1 flex flex-col min-w-0',
        'transition-[margin-left] duration-300 ease-in-out',
        collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
      )}>
        {/* Top bar */}
        <header
          className={cn(
            'sticky top-0 flex items-center justify-between h-14 px-4 lg:px-6',
            styles.header
          )}
          style={{ zIndex: 30 }}
        >
          {/* Left — mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-fm-neutral-600 hover:text-fm-neutral-900 hover:bg-fm-neutral-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Spacer on desktop */}
          <div className="hidden lg:block" />

          {/* Right — actions */}
          <div className="flex items-center gap-1">
            <IconBtn label="Notifications" className="relative w-9 h-9">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-fm-magenta-500 rounded-full" />
            </IconBtn>
            <IconBtn label="Help center" className="w-9 h-9">
              <HelpCircle className="w-[18px] h-[18px]" />
            </IconBtn>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* ─────────────── Mobile overlay ─────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden"
          style={{ zIndex: 40 }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

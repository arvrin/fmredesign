/**
 * Admin Dashboard Sidebar
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Target,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Search,
  Sparkles,
  Briefcase,
  Calendar,
  Presentation,
  UsersRound,
  UserCog,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
  onLogout: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Invoice Generator',
    href: '/admin/invoice',
    icon: FileText,
  },
  {
    name: 'Proposals',
    href: '/admin/proposals',
    icon: Presentation,
  },
  {
    name: 'Leads',
    href: '/admin/leads',
    icon: Target,
  },
  {
    name: 'Clients',
    href: '/admin/clients',
    icon: Users,
  },
  {
    name: 'Team',
    href: '/admin/team',
    icon: UsersRound,
  },
  {
    name: 'Projects',
    href: '/admin/projects',
    icon: Briefcase,
  },
  {
    name: 'Content Calendar',
    href: '/admin/content',
    icon: Calendar,
  },
  {
    name: 'Support Tickets',
    href: '/admin/support',
    icon: MessageSquare,
  },
  {
    name: 'Discovery',
    href: '/admin/discovery',
    icon: Search,
  },
  {
    name: 'CreativeMinds',
    href: '/admin/creativeminds',
    icon: Sparkles,
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: UserCog,
  },
  {
    name: 'Admin System',
    href: '/admin/system',
    icon: Shield,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-fm-neutral-200 px-4">
        <Link href="/admin" className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="Freaking Minds" 
            className="h-8 w-auto flex-shrink-0"
          />
          <span className="text-lg font-semibold text-fm-neutral-900">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobileMenu}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                active
                  ? 'bg-fm-magenta-50 text-fm-magenta-700 border-r-2 border-fm-magenta-700'
                  : 'text-fm-neutral-700 hover:bg-fm-neutral-50 hover:text-fm-neutral-900'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  active ? 'text-fm-magenta-700' : 'text-fm-neutral-500 group-hover:text-fm-neutral-700'
                )}
              />
              {item.name}
              {item.badge && (
                <span className="ml-auto rounded-full bg-fm-magenta-100 px-2 py-0.5 text-xs font-medium text-fm-magenta-700">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-fm-neutral-200 p-4">
        <button
          onClick={() => {
            onLogout();
            closeMobileMenu();
          }}
          className="group flex w-full items-center px-3 py-2 text-sm font-medium text-fm-neutral-700 rounded-lg hover:bg-fm-neutral-50 hover:text-fm-neutral-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-fm-neutral-500 group-hover:text-fm-neutral-700" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-fm-neutral-700 hover:bg-fm-neutral-100 hover:text-fm-neutral-900 focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-fm-neutral-200">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-fm-neutral-900/20 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar panel */}
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-fm-neutral-200">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
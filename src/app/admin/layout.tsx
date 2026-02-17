/**
 * Admin Dashboard Layout
 * Uses the design-system DashboardLayout with command palette, breadcrumbs,
 * toast provider, and error boundary.
 */

'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminAuth } from '@/lib/admin/auth';
import { DashboardLayout, type NavigationGroup } from '@/design-system';
import { CommandPalette } from '@/components/admin/CommandPalette';
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary';
import { ToastProvider } from '@/components/ui/toast-provider';
import { useBreadcrumbs, type BreadcrumbItem } from '@/hooks/useBreadcrumbs';
import {
  Breadcrumb,
  BreadcrumbItem as BCItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Calendar,
  Search,
  Sparkles,
  Settings,
  Shield,
  UserCog,
  Presentation,
  UsersRound,
} from 'lucide-react';
import React from 'react';

/* ── Navigation configuration ── */
const adminNavigation: NavigationGroup[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: 'Clients', href: '/admin/clients', icon: <Users className="w-5 h-5" /> },
      { label: 'Projects', href: '/admin/projects', icon: <Briefcase className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Content Calendar', href: '/admin/content', icon: <Calendar className="w-5 h-5" /> },
      { label: 'Invoices', href: '/admin/invoice', icon: <FileText className="w-5 h-5" /> },
      { label: 'Proposals', href: '/admin/proposals', icon: <Presentation className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Team', href: '/admin/team', icon: <UsersRound className="w-5 h-5" /> },
      { label: 'Discovery', href: '/admin/discovery', icon: <Search className="w-5 h-5" /> },
      { label: 'CreativeMinds', href: '/admin/creativeminds', icon: <Sparkles className="w-5 h-5" /> },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Users', href: '/admin/users', icon: <UserCog className="w-5 h-5" /> },
      { label: 'Admin System', href: '/admin/system', icon: <Shield className="w-5 h-5" /> },
      { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
    ],
  },
];

/* ── Breadcrumb renderer ── */
function AdminBreadcrumbs() {
  const crumbs = useBreadcrumbs();
  if (crumbs.length <= 1) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb.href}>
            {i > 0 && <BreadcrumbSeparator />}
            <BCItem>
              {i === crumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              )}
            </BCItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/* ── Layout component ── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);

  const isAuthRoute = pathname?.startsWith('/admin/auth');

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AdminAuth.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);

      if (!authenticated && !isAuthRoute) {
        router.push('/admin/auth/login');
      }
      if (authenticated && pathname === '/admin/auth/login') {
        router.push('/admin');
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, [router, pathname, isAuthRoute]);

  const handleLogout = useCallback(() => {
    AdminAuth.logout();
    setIsAuthenticated(false);
    router.push('/admin/auth/login');
  }, [router]);

  const handleCommandPalette = useCallback(() => {
    setCommandOpen(true);
  }, []);

  /* Get user info for sidebar */
  const currentUser = AdminAuth.getCurrentUser();
  const user = currentUser
    ? {
        name: currentUser.user?.name ?? 'Admin',
        email: currentUser.user?.email ?? 'Super Admin',
        role: currentUser.authMethod === 'password' ? 'Super Admin' : currentUser.user?.role ?? 'Viewer',
      }
    : undefined;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fm-magenta-700" />
          <p className="text-sm text-fm-neutral-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Auth routes — render without layout
  if (isAuthRoute) {
    return (
      <>
        {children}
        <ToastProvider />
      </>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)]">
        <p className="text-fm-neutral-600">Redirecting to login...</p>
      </div>
    );
  }

  // Authenticated — full admin layout
  return (
    <>
      <DashboardLayout
        variant="admin"
        navigation={adminNavigation}
        user={user}
        onLogout={handleLogout}
        onCommandPalette={handleCommandPalette}
        breadcrumb={
          <Suspense fallback={null}>
            <AdminBreadcrumbs />
          </Suspense>
        }
      >
        <AdminErrorBoundary>{children}</AdminErrorBoundary>
      </DashboardLayout>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <ToastProvider />
    </>
  );
}

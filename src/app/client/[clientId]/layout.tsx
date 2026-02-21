'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  DashboardLayout,
  DashboardCard as Card,
} from '@/design-system';
import type { NotificationItem } from '@/design-system/components/layouts/DashboardLayout';
import {
  BarChart3,
  Briefcase,
  Calendar,
  PieChart,
  MessageSquare,
  AlertCircle,
  FolderOpen,
  FileText,
  ScrollText,
  Settings,
} from 'lucide-react';
import {
  ClientPortalProvider,
  type ClientProfile,
} from '@/lib/client-portal/context';

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const slug = params.clientId as string;

  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Notification state
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/client-portal/${slug}/profile`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Client not found. Please check your link.');
          return;
        }
        throw new Error('Failed to fetch client profile');
      }
      const json = await res.json();
      setProfile(json.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load client data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/client-portal/${slug}/profile`);
      if (res.ok) {
        const json = await res.json();
        setProfile(json.data);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  }, [slug]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`/api/client-portal/${slug}/notifications?limit=20`);
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch {
      // Silent fail — notifications are non-critical
    }
  }, [slug]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await fetch(`/api/client-portal/${slug}/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Silent fail
    }
  }, [slug]);

  const handleNotificationClick = useCallback(async (id: string, actionUrl?: string) => {
    // Mark single notification read
    try {
      await fetch(`/api/client-portal/${slug}/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silent fail
    }
    // Navigate if action URL provided
    if (actionUrl) {
      router.push(actionUrl);
    }
  }, [slug, router]);

  useEffect(() => {
    if (!slug) return;
    fetchProfile();
  }, [slug, fetchProfile]);

  // Initial notification fetch + poll every 60s
  useEffect(() => {
    if (!slug || loading) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [slug, loading, fetchNotifications]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/client-portal/logout', { method: 'POST' });
    } catch {
      // Ignore — redirect regardless
    }
    router.push('/client/login');
  }, [router]);

  const basePath = `/client/${slug}`;
  const navigationItems = [
    {
      items: [
        { label: 'Overview', href: basePath, icon: <BarChart3 className="w-5 h-5" /> },
        { label: 'Projects', href: `${basePath}/projects`, icon: <Briefcase className="w-5 h-5" /> },
        { label: 'Content', href: `${basePath}/content`, icon: <Calendar className="w-5 h-5" /> },
        { label: 'Reports', href: `${basePath}/reports`, icon: <PieChart className="w-5 h-5" /> },
        { label: 'Documents', href: `${basePath}/documents`, icon: <FolderOpen className="w-5 h-5" /> },
        { label: 'Proposals', href: `${basePath}/proposals`, icon: <ScrollText className="w-5 h-5" /> },
        { label: 'Support', href: `${basePath}/support`, icon: <MessageSquare className="w-5 h-5" /> },
        { label: 'Contracts', href: `${basePath}/contracts`, icon: <FileText className="w-5 h-5" /> },
        { label: 'Settings', href: `${basePath}/settings`, icon: <Settings className="w-5 h-5" /> },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFCFB] flex items-center justify-center">
        <Card variant="client" className="p-8" style={{ textAlign: 'center' as const }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto" />
          <p className="mt-4 text-fm-neutral-600 font-medium">Loading your dashboard...</p>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#FEFCFB] flex items-center justify-center">
        <Card variant="client" className="p-8" style={{ textAlign: 'center' as const }}>
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-fm-neutral-900 font-semibold text-lg">{error || 'Client not found'}</p>
          <p className="text-fm-neutral-600 mt-2">Please contact your account manager for assistance.</p>
        </Card>
      </div>
    );
  }

  return (
    <ClientPortalProvider value={{ profile, clientId: profile.id, slug, refreshProfile }}>
      <DashboardLayout
        variant="client"
        navigation={navigationItems}
        user={{
          name: profile.name,
          email: profile.primaryContact?.email || '',
          role: profile.industry,
        }}
        onLogout={handleLogout}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={handleNotificationClick}
        onRefreshNotifications={fetchNotifications}
      >
        {children}
      </DashboardLayout>
    </ClientPortalProvider>
  );
}

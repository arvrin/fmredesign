'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  DashboardLayout,
  DashboardCard as Card,
} from '@/design-system';
import {
  BarChart3,
  User,
  Briefcase,
  Settings,
  AlertCircle,
} from 'lucide-react';
import {
  TalentPortalProvider,
  type TalentProfile,
} from '@/lib/talent-portal/context';

export default function TalentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/talent/${slug}/profile`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/creativeminds/login');
          return;
        }
        if (res.status === 404) {
          setError('Profile not found.');
          return;
        }
        throw new Error('Failed to fetch profile');
      }
      const json = await res.json();
      setProfile(json.profile);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    if (!slug) return;
    fetchProfile();
  }, [slug, fetchProfile]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/talent/logout', { method: 'POST' });
    } catch {
      // Redirect regardless
    }
    router.push('/creativeminds/login');
  }, [router]);

  const basePath = `/creativeminds/portal/${slug}`;
  const navigationItems = [
    {
      items: [
        { label: 'Dashboard', href: basePath, icon: <BarChart3 className="w-5 h-5" /> },
        { label: 'Profile', href: `${basePath}/profile`, icon: <User className="w-5 h-5" /> },
        { label: 'Briefs', href: `${basePath}/briefs`, icon: <Briefcase className="w-5 h-5" /> },
        { label: 'Settings', href: `${basePath}/settings`, icon: <Settings className="w-5 h-5" /> },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFCFB] flex items-center justify-center">
        <Card variant="client" className="p-8" style={{ textAlign: 'center' as const }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto" />
          <p className="mt-4 text-fm-neutral-600 font-medium">Loading your portal...</p>
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
          <p className="text-fm-neutral-900 font-semibold text-lg">{error || 'Profile not found'}</p>
          <p className="text-fm-neutral-600 mt-2">Please contact support for assistance.</p>
        </Card>
      </div>
    );
  }

  const personalInfo = profile.personalInfo as Record<string, unknown>;
  const fullName = (personalInfo?.fullName as string) || 'Talent';
  const emailStr = (personalInfo?.email as string) || profile.email || '';
  const professionalDetails = profile.professionalDetails as Record<string, unknown>;
  const category = (professionalDetails?.primaryCategory as string) || 'Creative';

  return (
    <TalentPortalProvider initialProfile={profile} slug={slug}>
      <DashboardLayout
        variant="client"
        navigation={navigationItems}
        user={{
          name: fullName,
          email: emailStr,
          role: category,
        }}
        onLogout={handleLogout}
      >
        {children}
      </DashboardLayout>
    </TalentPortalProvider>
  );
}

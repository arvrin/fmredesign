'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface TalentProfile {
  id: string;
  applicationId: string;
  profileSlug: string;
  email: string;
  personalInfo: Record<string, unknown>;
  professionalDetails: Record<string, unknown>;
  portfolioLinks: Record<string, unknown>;
  socialMedia: Record<string, unknown>;
  availability: Record<string, unknown>;
  preferences: Record<string, unknown>;
  pricing: Record<string, unknown>;
  ratings: Record<string, unknown>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TalentPortalContextValue {
  profile: TalentProfile | null;
  slug: string;
  refreshProfile: () => void;
}

const TalentPortalContext = createContext<TalentPortalContextValue | null>(null);

export function TalentPortalProvider({
  children,
  initialProfile,
  slug,
}: {
  children: ReactNode;
  initialProfile: TalentProfile | null;
  slug: string;
}) {
  const [profile, setProfile] = useState<TalentProfile | null>(initialProfile);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/talent/${slug}/profile`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.profile) {
          setProfile(json.profile);
        }
      }
    } catch {
      // silent
    }
  }, [slug]);

  return (
    <TalentPortalContext.Provider value={{ profile, slug, refreshProfile }}>
      {children}
    </TalentPortalContext.Provider>
  );
}

export function useTalentPortal() {
  const ctx = useContext(TalentPortalContext);
  if (!ctx) {
    throw new Error('useTalentPortal must be used within TalentPortalProvider');
  }
  return ctx;
}

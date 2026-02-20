'use client';

import { createContext, useContext } from 'react';

export interface ClientProfile {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  status: string;
  health: string;
  accountManager: string;
  onboardedAt: string;
  createdAt: string;
  primaryContact?: { email: string };
  contractDetails: {
    type: string;
    value: number;
    currency: string;
    startDate: string | null;
    endDate?: string;
    billingCycle: string;
    retainerAmount?: number;
    services: string[];
    isActive: boolean;
  };
}

interface ClientPortalContextType {
  profile: ClientProfile;
  clientId: string;
  slug: string;
  refreshProfile?: () => void;
}

const ClientPortalContext = createContext<ClientPortalContextType | null>(null);

export function ClientPortalProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ClientPortalContextType;
}) {
  return (
    <ClientPortalContext.Provider value={value}>
      {children}
    </ClientPortalContext.Provider>
  );
}

export function useClientPortal() {
  const ctx = useContext(ClientPortalContext);
  if (!ctx) {
    throw new Error('useClientPortal must be used within ClientPortalProvider');
  }
  return ctx;
}

/**
 * Hook for managing social media accounts (Meta Graph API).
 * Follows the same pattern as useLeads — owns all state.
 */

'use client';

import { useState, useCallback } from 'react';
import type { SocialAccount, SocialPlatform } from '@/lib/social/types';

interface VerifiedTokenInfo {
  pageId: string;
  pageName: string;
  instagramAccountId: string | null;
  hasInstagram: boolean;
}

export interface UseSocialAccountsReturn {
  accounts: SocialAccount[];
  loading: boolean;
  adding: boolean;
  verifying: boolean;
  loadAccounts: (clientId: string) => Promise<void>;
  verifyToken: (token: string) => Promise<VerifiedTokenInfo | null>;
  addAccount: (input: {
    clientId: string;
    platform: SocialPlatform;
    pageId: string;
    pageName: string;
    instagramAccountId?: string;
    accessToken: string;
  }) => Promise<boolean>;
  removeAccount: (id: string) => Promise<boolean>;
  toggleActive: (id: string, isActive: boolean) => Promise<boolean>;
}

export function useSocialAccounts(): UseSocialAccountsReturn {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const loadAccounts = useCallback(async (clientId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/social/accounts?clientId=${clientId}`);
      const result = await res.json();
      if (result.success) {
        setAccounts(result.data || []);
      }
    } catch (err) {
      console.error('Failed to load social accounts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyToken = useCallback(async (token: string): Promise<VerifiedTokenInfo | null> => {
    setVerifying(true);
    try {
      const res = await fetch('/api/admin/social/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token }),
      });
      const result = await res.json();
      if (result.success) {
        return result.data;
      }
      return null;
    } catch {
      return null;
    } finally {
      setVerifying(false);
    }
  }, []);

  const addAccount = useCallback(async (input: {
    clientId: string;
    platform: SocialPlatform;
    pageId: string;
    pageName: string;
    instagramAccountId?: string;
    accessToken: string;
  }): Promise<boolean> => {
    setAdding(true);
    try {
      const res = await fetch('/api/admin/social/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const result = await res.json();
      if (result.success) {
        setAccounts((prev) => [result.data, ...prev]);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setAdding(false);
    }
  }, []);

  const removeAccount = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/social/accounts?id=${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setAccounts((prev) => prev.filter((a) => a.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const toggleActive = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/social/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive }),
      });
      const result = await res.json();
      if (result.success) {
        setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, isActive } : a)));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return {
    accounts,
    loading,
    adding,
    verifying,
    loadAccounts,
    verifyToken,
    addAccount,
    removeAccount,
    toggleActive,
  };
}

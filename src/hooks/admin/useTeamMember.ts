'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TeamMember } from '@/lib/admin/types';

export function useTeamMember(memberId: string) {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMember = useCallback(async () => {
    if (!memberId) { setLoading(false); return; }
    try {
      const res = await fetch(`/api/team?id=${memberId}`);
      const result = await res.json();
      if (result.success && result.data) {
        setMember(result.data);
      }
    } catch (err) {
      console.error('Error fetching team member:', err);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`/api/team?id=${memberId}`);
        const result = await res.json();
        if (!cancelled && result.success && result.data) {
          setMember(result.data);
        }
      } catch (err) {
        console.error('Error fetching team member:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (memberId) {
      load();
    } else {
      setLoading(false);
    }

    return () => { cancelled = true; };
  }, [memberId]);

  const refresh = useCallback(() => {
    fetchMember();
  }, [fetchMember]);

  return { member, loading, setMember, refresh };
}

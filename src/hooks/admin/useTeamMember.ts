'use client';

import { useState, useEffect } from 'react';
import type { TeamMember } from '@/lib/admin/types';

export function useTeamMember(memberId: string) {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchMember = async () => {
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
      fetchMember();
    } else {
      setLoading(false);
    }

    return () => { cancelled = true; };
  }, [memberId]);

  return { member, loading, setMember };
}

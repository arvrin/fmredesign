'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TeamRole } from '@/lib/admin/types';

export interface TeamMemberOption {
  id: string;
  name: string;
  role: TeamRole;
  department: string;
  status: string;
}

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/team');
        const result = await res.json();
        if (!cancelled && result.success) {
          const active = (result.data || []).filter(
            (m: any) => m.status === 'active'
          );
          setTeamMembers(
            active.map((m: any) => ({
              id: m.id,
              name: m.name,
              role: m.role,
              department: m.department,
              status: m.status,
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTeam();
    return () => { cancelled = true; };
  }, []);

  const getByRole = useCallback(
    (role: TeamRole) => teamMembers.filter((m) => m.role === role),
    [teamMembers]
  );

  const getByRoles = useCallback(
    (roles: TeamRole[]) => teamMembers.filter((m) => roles.includes(m.role)),
    [teamMembers]
  );

  return { teamMembers, loading, getByRole, getByRoles };
}

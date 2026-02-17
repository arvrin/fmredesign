'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

const labelMap: Record<string, string> = {
  admin: 'Dashboard',
  clients: 'Clients',
  projects: 'Projects',
  content: 'Content Calendar',
  invoice: 'Invoices',
  proposals: 'Proposals',
  team: 'Team',
  users: 'User Management',
  settings: 'Settings',
  system: 'Admin System',
  discovery: 'Discovery',
  creativeminds: 'CreativeMinds',
  leads: 'Leads',
  support: 'Support',
  new: 'New',
  edit: 'Edit',
  assignments: 'Assignments',
  documents: 'Documents',
  performance: 'Performance',
  report: 'Report',
};

export function useBreadcrumbs(overrides?: { label?: string }): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    if (!pathname) return [];

    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] !== 'admin') return [];

    const crumbs: BreadcrumbItem[] = [];
    let path = '';

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      path += `/${seg}`;

      // Skip the first 'admin' segment — it becomes "Dashboard"
      if (i === 0) {
        crumbs.push({ label: 'Dashboard', href: '/admin' });
        continue;
      }

      // Dynamic segments (e.g., [clientId]) — use override or "Detail"
      const isDynamic = !labelMap[seg] && !/^(new|edit)$/.test(seg);
      if (isDynamic && i === segments.length - 1 && overrides?.label) {
        crumbs.push({ label: overrides.label, href: path });
      } else if (isDynamic) {
        crumbs.push({ label: 'Detail', href: path });
      } else {
        crumbs.push({ label: labelMap[seg] ?? seg, href: path });
      }
    }

    return crumbs;
  }, [pathname, overrides?.label]);
}

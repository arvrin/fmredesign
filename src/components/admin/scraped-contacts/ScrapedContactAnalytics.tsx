/**
 * ScrapedContactAnalytics Component
 * Renders the dashboard stats cards for scraped contacts.
 */

'use client';

import { Users, Mail, Phone, UserCheck } from 'lucide-react';
import { MetricCard } from '@/design-system';
import type { ScrapedContactStats } from '@/lib/admin/scraped-contact-types';

interface ScrapedContactAnalyticsProps {
  stats: ScrapedContactStats;
}

export function ScrapedContactAnalytics({ stats }: ScrapedContactAnalyticsProps) {
  const emailPct = stats.total > 0 ? Math.round((stats.withEmail / stats.total) * 100) : 0;
  const phonePct = stats.total > 0 ? Math.round((stats.withPhone / stats.total) * 100) : 0;
  const converted = stats.byStatus?.converted || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <MetricCard
        title="Total Contacts"
        value={stats.total}
        subtitle={`From ${Object.keys(stats.bySource).length} source(s)`}
        icon={<Users className="w-6 h-6" />}
        variant="admin"
      />

      <MetricCard
        title="With Email"
        value={stats.withEmail}
        subtitle={`${emailPct}% of total`}
        icon={<Mail className="w-6 h-6" />}
        variant="admin"
      />

      <MetricCard
        title="With Phone"
        value={stats.withPhone}
        subtitle={`${phonePct}% of total`}
        icon={<Phone className="w-6 h-6" />}
        variant="admin"
      />

      <MetricCard
        title="Converted"
        value={converted}
        subtitle="Converted to leads"
        icon={<UserCheck className="w-6 h-6" />}
        variant="admin"
      />
    </div>
  );
}

/**
 * LeadAnalytics Component
 * Renders the dashboard stats cards (Total Leads, Hot Leads, Conversion Rate, Avg Value).
 */

'use client';

import { Users, TrendingUp, Target, Star } from 'lucide-react';
import { MetricCard } from '@/design-system';
import type { LeadDashboardStats } from '@/lib/admin/lead-types';

interface LeadAnalyticsProps {
  dashboardStats: LeadDashboardStats;
}

export function LeadAnalytics({ dashboardStats }: LeadAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <MetricCard
        title="Total Leads"
        value={dashboardStats.totalLeads}
        subtitle={`+${dashboardStats.recentLeads} new this week`}
        icon={<Users className="w-6 h-6" />}
        variant="admin"
        change={{
          value: dashboardStats.recentLeads,
          type: dashboardStats.recentLeads > 0 ? 'increase' : 'neutral',
          period: 'this week',
        }}
      />

      <MetricCard
        title="Hot Leads"
        value={dashboardStats.hotLeads}
        subtitle="Require immediate attention"
        icon={<Target className="w-6 h-6" />}
        variant="admin"
        change={{
          value: dashboardStats.hotLeads,
          type: dashboardStats.hotLeads > 0 ? 'increase' : 'neutral',
          period: 'active',
        }}
      />

      <MetricCard
        title="Conversion Rate"
        value={`${dashboardStats.conversionRate.toFixed(1)}%`}
        subtitle="Lead to client conversion"
        icon={<TrendingUp className="w-6 h-6" />}
        variant="admin"
      />

      <MetricCard
        title="Avg Lead Value"
        value={`₹${Math.round(dashboardStats.averageLeadValue / 1000)}K`}
        subtitle="Based on budget range"
        icon={<Star className="w-6 h-6" />}
        variant="admin"
      />
    </div>
  );
}

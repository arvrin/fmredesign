/**
 * AnalyticsView — statistics and status distribution charts
 * for the CreativeMinds Analytics tab.
 */

'use client';

import { TalentApplication, TalentProfile, TALENT_CATEGORIES } from '@/lib/admin/talent-types';
import { Users, Clock, UserCheck, Star } from 'lucide-react';

interface AnalyticsViewProps {
  applications: TalentApplication[];
  talents: TalentProfile[];
}

export function AnalyticsView({ applications, talents }: AnalyticsViewProps) {
  const stats = {
    totalApplications: applications.length,
    pendingReview: applications.filter((a) => a.status === 'submitted').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    activeTalents: talents.length,
    topCategory:
      Object.entries(
        applications.reduce((acc, app) => {
          acc[app.professionalDetails.category] =
            (acc[app.professionalDetails.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None',
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          icon={<Users className="h-5 w-5 text-blue-600" />}
          label="Applications"
          value={stats.totalApplications}
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-yellow-600" />}
          label="Pending Review"
          value={stats.pendingReview}
        />
        <StatCard
          icon={<UserCheck className="h-5 w-5 text-green-600" />}
          label="Active Talents"
          value={stats.activeTalents}
        />
        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-5 w-5 text-fm-magenta-600" />
            <span className="text-sm font-medium text-fm-neutral-600">Top Category</span>
          </div>
          <div className="text-lg font-semibold text-fm-neutral-900">
            {TALENT_CATEGORIES[stats.topCategory as keyof typeof TALENT_CATEGORIES]?.label ||
              'None'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">
          Application Status Distribution
        </h3>
        <div className="space-y-3">
          <StatusBar
            label="Submitted"
            count={stats.pendingReview}
            total={stats.totalApplications}
            color="bg-blue-500"
          />
          <StatusBar
            label="Approved"
            count={stats.approved}
            total={stats.totalApplications}
            color="bg-green-500"
          />
          <StatusBar
            label="Rejected"
            count={stats.rejected}
            total={stats.totalApplications}
            color="bg-red-500"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Internal helper components                                         */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium text-fm-neutral-600">{label}</span>
      </div>
      <div className="text-2xl font-bold text-fm-neutral-900">{value}</div>
    </div>
  );
}

function StatusBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-32 h-2 bg-fm-neutral-200 rounded-full">
          <div
            className={`h-2 ${color} rounded-full`}
            style={{ width: `${pct}%` }}
          ></div>
        </div>
        <span className="text-sm">{count}</span>
      </div>
    </div>
  );
}

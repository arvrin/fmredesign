'use client';

import { Briefcase, History, RotateCw, Settings } from 'lucide-react';
import { MetricCard, MetricCardSkeleton } from '@/design-system';
import { ScrapeJobList } from './ScrapeJobList';
import { ScrapeJobRunHistory } from './ScrapeJobRunHistory';
import { ScrapeRotationConfig } from './ScrapeRotationConfig';
import { ScrapeSourceSettings } from './ScrapeSourceSettings';
import type { UseScrapeJobsReturn, ScrapeJobTab } from '@/hooks/admin/useScrapeJobs';

const TABS: { id: ScrapeJobTab; label: string; icon: React.ReactNode }[] = [
  { id: 'jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'runs', label: 'Run History', icon: <History className="w-4 h-4" /> },
  { id: 'rotation', label: 'Rotation', icon: <RotateCw className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

interface ScrapeJobDashboardProps {
  hook: UseScrapeJobsReturn;
}

export function ScrapeJobDashboard({ hook }: ScrapeJobDashboardProps) {
  const { stats, loading, activeTab, setActiveTab } = hook;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Jobs"
            value={stats.totalJobs}
            icon={<Briefcase className="w-5 h-5" />}
          />
          <MetricCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={<Briefcase className="w-5 h-5" />}
          />
          <MetricCard
            title="Total Runs"
            value={stats.totalRuns}
            icon={<History className="w-5 h-5" />}
          />
          <MetricCard
            title="Contacts Imported"
            value={stats.totalContactsImported}
            icon={<RotateCw className="w-5 h-5" />}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-white/10">
        <nav className="flex gap-1 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-fm-magenta-600 text-white'
                  : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/20'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'jobs' && <ScrapeJobList hook={hook} />}
      {activeTab === 'runs' && <ScrapeJobRunHistory hook={hook} />}
      {activeTab === 'rotation' && <ScrapeRotationConfig hook={hook} />}
      {activeTab === 'settings' && <ScrapeSourceSettings hook={hook} />}
    </div>
  );
}

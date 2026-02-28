'use client';

import { Play, Pause, Trash2, Plus, Globe, MapPin, Linkedin } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { RUN_STATUS_OPTIONS, SOURCE_PLATFORM_OPTIONS } from '@/lib/admin/scrape-job-types';
import type { ScrapeJob } from '@/lib/admin/scrape-job-types';
import type { UseScrapeJobsReturn } from '@/hooks/admin/useScrapeJobs';

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  bni: <Globe className="w-4 h-4" />,
  google_maps: <MapPin className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
};

function getSourceLabel(platform: string): string {
  return SOURCE_PLATFORM_OPTIONS.find((o) => o.value === platform)?.label || platform;
}

function getStatusBadge(status: string) {
  const opt = RUN_STATUS_OPTIONS.find((o) => o.value === status);
  return opt ? (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${opt.color}`}>
      {opt.label}
    </span>
  ) : null;
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface ScrapeJobListProps {
  hook: UseScrapeJobsReturn;
}

export function ScrapeJobList({ hook }: ScrapeJobListProps) {
  const { jobs, setShowCreateJob, triggerJob, updateJob, deleteJob } = hook;

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-fm-neutral-500">{jobs.length} job(s)</p>
        <DashboardButton variant="primary" size="sm" onClick={() => setShowCreateJob(true)}>
          <Plus className="w-4 h-4" />
          New Job
        </DashboardButton>
      </div>

      {/* Job Cards */}
      {jobs.length === 0 ? (
        <div className="rounded-xl border border-fm-neutral-200 bg-white p-12" style={{ textAlign: 'center' }}>
          <Globe className="w-10 h-10 text-fm-neutral-300 mx-auto mb-3" />
          <p className="text-fm-neutral-500 mb-4">No scrape jobs yet</p>
          <DashboardButton variant="primary" size="sm" onClick={() => setShowCreateJob(true)}>
            Create Your First Job
          </DashboardButton>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onTrigger={() => triggerJob(job.id)}
              onToggleActive={() => updateJob(job.id, { isActive: !job.isActive })}
              onDelete={() => {
                if (confirm(`Delete job "${job.name}"? This will also delete all run history.`)) {
                  deleteJob(job.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({
  job,
  onTrigger,
  onToggleActive,
  onDelete,
}: {
  job: ScrapeJob;
  onTrigger: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}) {
  const latestRun = job.latestRun;

  return (
    <div className="rounded-xl border border-fm-neutral-200 bg-white p-4 hover:bg-fm-neutral-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Info */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 p-2 rounded-lg bg-fm-neutral-100 shrink-0">
            {SOURCE_ICONS[job.sourcePlatform] || <Globe className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-fm-neutral-900 truncate">{job.name}</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-fm-neutral-100 text-fm-neutral-600">
                {getSourceLabel(job.sourcePlatform)}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-fm-neutral-100 text-fm-neutral-600">
                {job.scheduleType}
              </span>
              {!job.isActive && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                  Paused
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-fm-neutral-500">
              <span>Last run: {formatRelativeTime(job.lastRunAt)}</span>
              {latestRun && (
                <>
                  <span>{getStatusBadge(latestRun.status)}</span>
                  {latestRun.contactsImported > 0 && (
                    <span>{latestRun.contactsImported} imported</span>
                  )}
                </>
              )}
            </div>
            {/* Params preview */}
            {Object.keys(job.params).length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {Object.entries(job.params).slice(0, 3).map(([k, v]) => (
                  <span key={k} className="text-xs text-fm-neutral-500 bg-fm-neutral-50 px-1.5 py-0.5 rounded">
                    {k}: {String(v)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <DashboardButton
            variant="primary"
            size="sm"
            onClick={onTrigger}
            title="Trigger a run"
          >
            <Play className="w-3.5 h-3.5" />
            Run
          </DashboardButton>
          <button
            onClick={onToggleActive}
            className="p-2 rounded-lg text-fm-neutral-400 hover:text-fm-neutral-700 hover:bg-fm-neutral-100 transition-colors"
            title={job.isActive ? 'Pause job' : 'Activate job'}
          >
            <Pause className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-fm-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete job"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

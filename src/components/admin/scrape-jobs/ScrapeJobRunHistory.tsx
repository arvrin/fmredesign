'use client';

import { RefreshCw, AlertCircle, Clock, Users } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { RUN_STATUS_OPTIONS, SOURCE_PLATFORM_OPTIONS } from '@/lib/admin/scrape-job-types';
import type { ScrapeJobRun } from '@/lib/admin/scrape-job-types';
import type { UseScrapeJobsReturn } from '@/hooks/admin/useScrapeJobs';

function getSourceLabel(platform: string): string {
  return SOURCE_PLATFORM_OPTIONS.find((o) => o.value === platform)?.label || platform;
}

function getStatusBadge(status: string) {
  const opt = RUN_STATUS_OPTIONS.find((o) => o.value === status);
  if (!opt) return null;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${opt.color}`}>
      {opt.label}
    </span>
  );
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '-';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ScrapeJobRunHistoryProps {
  hook: UseScrapeJobsReturn;
}

export function ScrapeJobRunHistory({ hook }: ScrapeJobRunHistoryProps) {
  const { runs, loadRuns } = hook;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-fm-neutral-500">{runs.length} run(s)</p>
        <DashboardButton variant="secondary" size="sm" onClick={() => loadRuns()}>
          <RefreshCw className="w-4 h-4" />
          Refresh
        </DashboardButton>
      </div>

      {/* Run Table */}
      {runs.length === 0 ? (
        <div className="rounded-xl border border-fm-neutral-200 bg-white p-12" style={{ textAlign: 'center' }}>
          <Clock className="w-10 h-10 text-fm-neutral-300 mx-auto mb-3" />
          <p className="text-fm-neutral-500">No runs yet. Trigger a job to see history.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-fm-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fm-neutral-200 bg-fm-neutral-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">Job</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">Contacts</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">Trigger</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fm-neutral-100">
                {runs.map((run) => (
                  <RunRow key={run.id} run={run} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function RunRow({ run }: { run: ScrapeJobRun }) {
  return (
    <tr className="hover:bg-fm-neutral-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-fm-neutral-900 text-sm">{run.jobName || run.jobId}</span>
          {run.jobSourcePlatform && (
            <span className="text-xs text-fm-neutral-400">{getSourceLabel(run.jobSourcePlatform)}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">{getStatusBadge(run.status)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-fm-neutral-400" />
          <span className="text-fm-neutral-700">
            {run.contactsFound > 0 ? (
              <>
                <span className="text-green-600">{run.contactsImported}</span>
                <span className="text-fm-neutral-400"> / {run.contactsFound}</span>
                {run.contactsSkipped > 0 && (
                  <span className="text-fm-neutral-400 text-xs ml-1">({run.contactsSkipped} skipped)</span>
                )}
              </>
            ) : (
              <span className="text-fm-neutral-400">-</span>
            )}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-fm-neutral-500 text-sm">
        {formatDuration(run.durationSeconds)}
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-fm-neutral-500 capitalize">{run.triggeredBy}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-fm-neutral-500">{formatDate(run.startedAt || run.createdAt)}</span>
      </td>
      {run.errorMessage && (
        <td className="px-4 py-1 col-span-6">
          <div className="flex items-start gap-1.5 text-xs text-red-600">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="truncate max-w-md">{run.errorMessage}</span>
          </div>
        </td>
      )}
    </tr>
  );
}

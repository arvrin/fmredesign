/**
 * Scrape Jobs Page
 * Manage automated scraping: create jobs, view runs, configure rotation & credentials.
 *
 * Thin composition layer — data fetching and state live in useScrapeJobs(),
 * UI in ScrapeJobDashboard.
 */

'use client';

import dynamic from 'next/dynamic';
import { Bot, ArrowLeft } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrapeJobDashboard } from '@/components/admin/scrape-jobs';
import { useScrapeJobs } from '@/hooks/admin/useScrapeJobs';
import Link from 'next/link';

const ScrapeJobCreateModal = dynamic(
  () =>
    import('@/components/admin/scrape-jobs/ScrapeJobCreateModal').then((m) => ({
      default: m.ScrapeJobCreateModal,
    })),
  { ssr: false }
);

export default function ScrapeJobsPage() {
  const hook = useScrapeJobs();

  if (hook.loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Scrape Jobs"
        description="Automated lead scraping — create jobs, configure rotation, and view results"
        icon={<Bot className="w-6 h-6" />}
        actions={
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/admin/scraped-contacts">
              <DashboardButton variant="secondary" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Contacts
              </DashboardButton>
            </Link>
          </div>
        }
      />

      <ScrapeJobDashboard hook={hook} />

      <ScrapeJobCreateModal
        isOpen={hook.showCreateJob}
        onClose={() => hook.setShowCreateJob(false)}
        onCreate={hook.createJob}
      />
    </div>
  );
}

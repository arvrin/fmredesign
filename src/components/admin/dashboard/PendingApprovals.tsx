'use client';

import Link from 'next/link';
import { UserCheck, FileCheck } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

interface TalentApp {
  id: string;
  name: string;
  email: string;
  category: string;
  status: string;
  createdAt: string;
}

interface ReviewContent {
  id: string;
  title: string;
  status: string;
  platform: string;
  type: string;
  scheduledDate: string;
  clientId: string;
}

interface PendingApprovalsProps {
  talentApplications: TalentApp[];
  contentReview: ReviewContent[];
}

export function PendingApprovals({ talentApplications, contentReview }: PendingApprovalsProps) {
  if (talentApplications.length === 0 && contentReview.length === 0) return null;

  return (
    <div className="divide-y divide-fm-neutral-100">
      {contentReview.map((item) => (
        <Link
          key={item.id}
          href={`/admin/content/${item.id}`}
          className="flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-amber-50/50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <FileCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-fm-neutral-900 truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge status={item.status} />
                <span className="text-xs text-fm-neutral-500 capitalize">{item.platform} &middot; {item.type}</span>
              </div>
            </div>
          </div>
          <span className="text-xs text-fm-neutral-500 shrink-0 ml-4">
            {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'No date'}
          </span>
        </Link>
      ))}
      {talentApplications.map((app) => (
        <Link
          key={app.id}
          href="/admin/creativeminds"
          className="flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-amber-50/50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-fm-neutral-900 truncate">{app.name}</p>
              <p className="text-xs text-fm-neutral-500 mt-0.5 capitalize">{app.category} &middot; {app.email}</p>
            </div>
          </div>
          <span className="text-xs text-fm-neutral-500 shrink-0 ml-4">
            {new Date(app.createdAt).toLocaleDateString()}
          </span>
        </Link>
      ))}
    </div>
  );
}

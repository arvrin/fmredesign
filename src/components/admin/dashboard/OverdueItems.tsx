'use client';

import Link from 'next/link';
import { AlertCircle, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

interface OverdueContent {
  id: string;
  title: string;
  status: string;
  platform: string;
  type: string;
  scheduledDate: string;
  clientId: string;
}

interface OverdueProject {
  id: string;
  name: string;
  status: string;
  endDate: string;
  progress: number;
  clientId: string;
}

interface OverdueItemsProps {
  content: OverdueContent[];
  projects: OverdueProject[];
}

function daysOverdue(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function OverdueItems({ content, projects }: OverdueItemsProps) {
  if (content.length === 0 && projects.length === 0) return null;

  return (
    <div className="divide-y divide-fm-neutral-100">
      {content.map((item) => (
        <Link
          key={item.id}
          href={`/admin/content/${item.id}`}
          className="flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-red-50/50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-fm-neutral-900 truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge status={item.status} />
                <span className="text-xs text-fm-neutral-500 capitalize">{item.platform}</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-medium text-red-600 shrink-0 ml-4 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {daysOverdue(item.scheduledDate)}d overdue
          </span>
        </Link>
      ))}
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/admin/projects/${project.id}`}
          className="flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-red-50/50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-fm-neutral-900 truncate">{project.name}</p>
              <p className="text-xs text-fm-neutral-500 mt-0.5">{project.progress}% complete</p>
            </div>
          </div>
          <span className="text-xs font-medium text-red-600 shrink-0 ml-4 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {daysOverdue(project.endDate)}d overdue
          </span>
        </Link>
      ))}
    </div>
  );
}

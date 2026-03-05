'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/progress-bar';

interface ActiveProject {
  id: string;
  name: string;
  status: string;
  progress: number;
  endDate: string;
  clientId: string;
  type: string;
}

interface ProjectPulseProps {
  projects: ActiveProject[];
}

export function ProjectPulse({ projects }: ProjectPulseProps) {
  if (projects.length === 0) return null;

  return (
    <div className="divide-y divide-fm-neutral-100">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/admin/projects/${project.id}`}
          className="flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-fm-neutral-50/50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full shrink-0',
                project.progress >= 75 ? 'bg-emerald-500' :
                project.progress >= 40 ? 'bg-amber-500' :
                'bg-red-400'
              )}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-fm-neutral-900 truncate">{project.name}</p>
              <p className="text-xs text-fm-neutral-500 capitalize">
                {project.type?.replace('_', ' ')} &middot; {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No deadline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <ProgressBar value={project.progress || 0} size="sm" className="w-16" />
            <span className="text-xs font-medium text-fm-neutral-700 w-8" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              {project.progress || 0}%
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

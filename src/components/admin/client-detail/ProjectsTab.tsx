'use client';

import Link from 'next/link';
import { DashboardCard as Card, CardContent, DashboardButton } from '@/design-system';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { ClientProject } from '@/hooks/admin/useClientDetail';
import { Briefcase, Plus } from 'lucide-react';

interface ProjectsTabProps {
  projects: ClientProject[];
  loading: boolean;
  onFetchProjects: () => void;
}

export function ProjectsTab({ projects, loading, onFetchProjects }: ProjectsTabProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase className="h-6 w-6" />}
        title="No Projects Yet"
        description="This client does not have any projects."
        action={
          <Link href="/admin/projects/new">
            <DashboardButton>
              <Plus className="h-4 w-4" />
              Create Project
            </DashboardButton>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-fm-neutral-900">
                    {project.name}
                  </h3>
                  <StatusBadge status={project.status} />
                </div>
                {project.description && (
                  <p className="text-sm text-fm-neutral-600 mb-3">{project.description}</p>
                )}
                {typeof project.progress === 'number' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-fm-neutral-500">Progress</span>
                      <span className="text-xs font-medium text-fm-neutral-700">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-fm-neutral-200 rounded-full h-1.5">
                      <div
                        className="bg-fm-magenta-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-4 text-sm text-fm-neutral-500 flex-wrap">
                  {project.type && (
                    <span className="capitalize">{project.type.replace(/_/g, ' ')}</span>
                  )}
                  {project.startDate && (
                    <span>
                      {new Date(project.startDate).toLocaleDateString()} -{' '}
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : 'Ongoing'}
                    </span>
                  )}
                </div>
              </div>
              <Link href={`/admin/projects/${project.id}`} className="self-start">
                <DashboardButton variant="secondary" size="sm">
                  View Project
                </DashboardButton>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

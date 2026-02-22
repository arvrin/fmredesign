'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MetricCard,
  DashboardCard as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardButton as Button
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import {
  Briefcase,
  Calendar,
  Clock,
  Target,
  DollarSign,
  CheckCircle2,
  Download,
  ChevronRight
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import { formatContractCurrency } from '@/lib/admin/contract-types';
import { getStatusColor, getPriorityColor } from '@/lib/client-portal/status-colors';
import { downloadCSV } from '@/lib/client-portal/export';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress-bar';
import { FilterTabBar } from '@/components/ui/filter-tab-bar';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'review' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  team: string[];
  deliverables: {
    total: number;
    completed: number;
  };
  milestones: {
    name: string;
    date: string;
    status: 'upcoming' | 'in-progress' | 'completed';
  }[];
  lastUpdate: string;
}

export default function ClientProjectsPage() {
  const { clientId, slug, profile } = useClientPortal();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/client-portal/${clientId}/projects?limit=50`);
        if (res.ok) {
          const data = await res.json();
          const mapped = (data.data || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            status: p.status || 'planning',
            priority: p.priority || 'medium',
            progress: p.progress || 0,
            startDate: p.startDate || '',
            endDate: p.endDate || '',
            budget: p.budget || 0,
            spent: p.spent || 0,
            team: [],
            deliverables: {
              total: (p.deliverables || []).length,
              completed: (p.deliverables || []).filter((d: any) => d.status === 'completed').length
            },
            milestones: (p.milestones || []).map((m: any) => ({
              name: m.title || m.name || '',
              date: m.dueDate || m.date || '',
              status: m.isCompleted ? 'completed' : 'upcoming'
            })),
            lastUpdate: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : ''
          }));
          setProjects(mapped);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['active', 'planning', 'review'].includes(project.status);
    if (filter === 'completed') return project.status === 'completed';
    return true;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  // Calculate summary metrics
  const activeProjects = projects.filter(p => ['active', 'planning', 'review'].includes(p.status)).length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-display font-bold text-fm-neutral-900">
              Your <span className="v2-accent">Projects</span>
            </h1>
            <p className="text-fm-neutral-600 mt-1 font-medium text-sm sm:text-base">Track progress and milestones across all initiatives</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-fm-magenta-600"
              onClick={() => {
                const headers = ['Name', 'Status', 'Priority', 'Progress', 'Budget', 'Spent', 'Start Date', 'End Date'];
                const rows = projects.map(p => [
                  p.name, p.status, p.priority, `${p.progress}%`,
                  String(p.budget), String(p.spent), p.startDate, p.endDate,
                ]);
                downloadCSV('projects-report.csv', headers, rows);
              }}
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          subtitle="Currently in progress"
          icon={<Briefcase className="w-6 h-6" />}
          variant="client"
        />

        <MetricCard
          title="Completed"
          value={completedProjects}
          subtitle="Successfully delivered"
          icon={<CheckCircle2 className="w-6 h-6" />}
          variant="client"
        />

        <MetricCard
          title="Total Investment"
          value={totalBudget}
          subtitle="Across all projects"
          icon={<DollarSign className="w-6 h-6" />}
          variant="client"
          formatter={(val) => formatContractCurrency(Number(val), profile.contractDetails.currency)}
        />

        <MetricCard
          title="Overall Progress"
          value={`${avgProgress}%`}
          subtitle="Average completion"
          icon={<Target className="w-6 h-6" />}
          variant="client"
        />
      </div>

      {/* Filter Tabs */}
      <FilterTabBar
        tabs={[
          { key: 'all', label: 'All Projects', count: projects.length },
          { key: 'active', label: 'Active', count: activeProjects },
          { key: 'completed', label: 'Completed', count: completedProjects },
        ]}
        active={filter}
        onChange={(key) => setFilter(key as 'all' | 'active' | 'completed')}
        variant="client"
        className="mb-6"
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} variant="client" hover glow className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <div
                      className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`}
                      role="img"
                      aria-label={`${project.priority} priority`}
                    />
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(project.status)} variant="secondary">
                  {project.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-fm-neutral-600">Overall Progress</span>
                  <span className="font-semibold text-fm-magenta-600">{project.progress}%</span>
                </div>
                <ProgressBar value={project.progress} gradient />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-fm-neutral-100">
                <div>
                  <div className="text-sm text-fm-neutral-600 mb-1">Timeline</div>
                  <div className="flex items-center text-sm font-medium">
                    <Calendar className="w-4 h-4 mr-1 text-fm-neutral-400" />
                    {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -
                    {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-fm-neutral-600 mb-1">Budget Used</div>
                  <div className="flex items-center text-sm font-medium">
                    <DollarSign className="w-4 h-4 mr-1 text-fm-neutral-400" />
                    {project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0}%
                    <span className="text-fm-neutral-500 ml-1">
                      ({formatContractCurrency(project.spent, profile.contractDetails.currency)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-fm-neutral-600 mb-1">Deliverables</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-fm-magenta-600">
                      {project.deliverables.completed}
                    </span>
                    <span className="text-sm text-fm-neutral-500">of {project.deliverables.total} completed</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {member.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-fm-neutral-200 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-fm-neutral-600 font-medium">+{project.team.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="pt-3">
                <div className="text-sm font-medium text-fm-neutral-700 mb-3">Upcoming Milestones</div>
                <div className="space-y-2">
                  {project.milestones
                    .filter(m => m.status !== 'completed')
                    .slice(0, 2)
                    .map((milestone, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {milestone.status === 'in-progress' ? (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          ) : (
                            <Target className="w-4 h-4 text-fm-neutral-400" />
                          )}
                          <span className={milestone.status === 'in-progress' ? 'font-medium' : 'text-fm-neutral-600'}>
                            {milestone.name}
                          </span>
                        </div>
                        <span className="text-fm-neutral-500">
                          {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-fm-neutral-500">Updated {project.lastUpdate}</span>
                <Link
                  href={`/client/${slug}/projects/${project.id}`}
                  className="text-sm font-medium text-fm-magenta-600 hover:text-fm-magenta-700 flex items-center"
                >
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <EmptyState
          icon={<Briefcase className="w-6 h-6" />}
          title="No projects found"
          description={
            filter === 'all'
              ? "You don't have any projects yet"
              : `No ${filter} projects at the moment`
          }
          action={
            filter !== 'all' ? (
              <Button variant="ghost" size="sm" onClick={() => setFilter('all')} className="text-fm-magenta-600">
                View All Projects
              </Button>
            ) : undefined
          }
        />
      )}
    </>
  );
}

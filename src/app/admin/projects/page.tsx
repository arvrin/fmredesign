/**
 * Projects Management Page
 * Professional project listing and management interface
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Clock,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Circle
} from 'lucide-react';
import { adminToast } from '@/lib/admin/toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import {
  DashboardButton,
  DashboardCard,
  CardContent,
  CardHeader,
  CardTitle,
  MetricCard,
  MetricCardSkeleton
} from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress-bar';
import { TagChip } from '@/components/ui/tag-chip';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import type { Project, ProjectStatus, ProjectType } from '@/lib/admin/project-types';
import { ProjectUtils } from '@/lib/admin/project-types';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'startDate' | 'endDate' | 'status' | 'budget'>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects?sortBy=createdAt&sortDirection=desc');
        const result = await response.json();

        if (result.success) {
          setProjects(result.data);
          setFilteredProjects(result.data);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        adminToast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(project => project.type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'startDate' || sortBy === 'endDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'budget') {
        aValue = parseFloat(aValue.toString());
        bValue = parseFloat(bValue.toString());
      }

      if (sortDirection === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchQuery, statusFilter, typeFilter, sortBy, sortDirection]);

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'active':
        return <Circle className="h-4 w-4 text-blue-500 fill-current" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'paused':
        return <Circle className="h-4 w-4 text-orange-500" />;
      case 'cancelled':
        return <Circle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-fm-neutral-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-fm-neutral-500';
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId));
        adminToast.success('Project deleted');
      } else {
        adminToast.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      adminToast.error('Error deleting project');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="h-16 rounded-xl" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <PageHeader
        title="Projects"
        description="Manage client projects and deliverables"
        actions={
          <DashboardButton
            variant="primary"
            size="sm"
            onClick={() => router.push('/admin/projects/new')}
          >
            <Plus className="h-4 w-4" />
            New Project
          </DashboardButton>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Projects"
          value={projects.length}
          subtitle="All projects"
          icon={<Calendar className="w-6 h-6" />}
          variant="admin"
        />

        <MetricCard
          title="Active Projects"
          value={projects.filter(p => p.status === 'active').length}
          subtitle="In progress"
          icon={<Circle className="w-6 h-6 fill-current" />}
          variant="admin"
          change={{
            value: Math.round((projects.filter(p => p.status === 'active').length / (projects.length || 1)) * 100),
            type: 'neutral',
            period: 'of total'
          }}
        />

        <MetricCard
          title="Total Budget"
          value={ProjectUtils.formatBudget(projects.reduce((sum, p) => sum + (p.budget || 0), 0))}
          subtitle="All projects value"
          icon={<DollarSign className="w-6 h-6" />}
          variant="admin"
        />

        <MetricCard
          title="Team Members"
          value={new Set(projects.flatMap(p => p.assignedTalent || [])).size}
          subtitle="Unique contributors"
          icon={<Users className="w-6 h-6" />}
          variant="admin"
        />
      </div>

      {/* Filters and Search */}
      <DashboardCard variant="admin" className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </Select>

            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ProjectType | 'all')}
            >
              <option value="all">All Types</option>
              <option value="social_media">Social Media</option>
              <option value="web_development">Web Development</option>
              <option value="branding">Branding</option>
              <option value="seo">SEO</option>
              <option value="paid_ads">Paid Ads</option>
              <option value="content_marketing">Content Marketing</option>
              <option value="full_service">Full Service</option>
            </Select>

            <DashboardButton
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </DashboardButton>
          </div>
        </div>
      </DashboardCard>

      {/* Projects List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-6 h-6" />}
            title="No projects found"
            description={
              projects.length === 0
                ? "Get started by creating your first project"
                : "Try adjusting your search or filter criteria"
            }
            action={
              projects.length === 0 ? (
                <DashboardButton variant="primary" size="sm" onClick={() => router.push('/admin/projects/new')}>
                  Create First Project
                </DashboardButton>
              ) : undefined
            }
          />
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border border-fm-neutral-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    {getStatusIcon(project.status)}
                    <h3 className="text-lg font-semibold text-fm-neutral-900">
                      {project.name}
                    </h3>
                    <StatusBadge status={project.status} />
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} title={`${project.priority} priority`}></div>
                  </div>

                  <p className="text-fm-neutral-600 mb-4">{project.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-sm">
                    <div>
                      <span className="text-fm-neutral-500">Type:</span>
                      <span className="ml-2 font-medium">{project.type.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-fm-neutral-500">Budget:</span>
                      <span className="ml-2 font-medium">{ProjectUtils.formatBudget(project.budget)}</span>
                    </div>
                    <div>
                      <span className="text-fm-neutral-500">Timeline:</span>
                      <span className="ml-2 font-medium">
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-fm-neutral-500">Team:</span>
                      <span className="ml-2 font-medium">{(project.assignedTalent || []).length} members</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-fm-neutral-700">Progress</span>
                      <span className="text-sm text-fm-neutral-600">{project.progress}%</span>
                    </div>
                    <ProgressBar value={project.progress} size="md" />
                  </div>

                  {/* Tags */}
                  {(project.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {(project.tags || []).slice(0, 3).map((tag, index) => (
                        <TagChip key={index}>{tag}</TagChip>
                      ))}
                      {(project.tags || []).length > 3 && (
                        <TagChip>+{(project.tags || []).length - 3} more</TagChip>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
                  <DashboardButton
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/projects/${project.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </DashboardButton>
                  <DashboardButton
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </DashboardButton>
                  <DashboardButton
                    variant="danger-ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </DashboardButton>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteConfirm) handleDeleteProject(deleteConfirm);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}

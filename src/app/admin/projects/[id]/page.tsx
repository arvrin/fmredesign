/**
 * Project Detail Page
 * Displays comprehensive project information in a clean admin layout
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Target,
  FileText,
  Edit,
  CheckCircle,
  AlertCircle,
  Circle,
  Tag,
  MessageSquare,
  BarChart3,
  Star,
  Briefcase
} from 'lucide-react';
import {
  DashboardButton,
  DashboardCard,
  CardContent,
  CardHeader,
  CardTitle
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import type {
  Project,
  ProjectStatus,
  ProjectPriority,
  ProjectMilestone,
  ProjectDeliverable
} from '@/lib/admin/project-types';
import { ProjectUtils } from '@/lib/admin/project-types';

// ---------------------------------------------------------------------------
// Helper: status badge variant mapping
// ---------------------------------------------------------------------------
function getStatusBadgeVariant(status: ProjectStatus): 'default' | 'info' | 'warning' | 'success' | 'danger' | 'secondary' {
  const map: Record<ProjectStatus, 'default' | 'info' | 'warning' | 'success' | 'danger' | 'secondary'> = {
    planning: 'default',
    active: 'info',
    review: 'warning',
    completed: 'success',
    paused: 'warning',
    cancelled: 'danger',
  };
  return map[status] ?? 'default';
}

function getStatusLabel(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    planning: 'Planning',
    active: 'Active',
    review: 'In Review',
    completed: 'Completed',
    paused: 'Paused',
    cancelled: 'Cancelled',
  };
  return labels[status] ?? status;
}

// ---------------------------------------------------------------------------
// Helper: priority badge variant mapping
// ---------------------------------------------------------------------------
function getPriorityBadgeVariant(priority: ProjectPriority): 'default' | 'info' | 'warning' | 'danger' {
  const map: Record<ProjectPriority, 'default' | 'info' | 'warning' | 'danger'> = {
    low: 'default',
    medium: 'info',
    high: 'warning',
    critical: 'danger',
  };
  return map[priority] ?? 'default';
}

function getPriorityLabel(priority: ProjectPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

// ---------------------------------------------------------------------------
// Helper: project type display name
// ---------------------------------------------------------------------------
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    social_media: 'Social Media',
    web_development: 'Web Development',
    branding: 'Branding',
    seo: 'SEO',
    paid_ads: 'Paid Ads',
    content_marketing: 'Content Marketing',
    full_service: 'Full Service',
  };
  return labels[type] ?? type.replace(/_/g, ' ');
}

// ---------------------------------------------------------------------------
// Helper: deliverable status color
// ---------------------------------------------------------------------------
function getDeliverableStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'review':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
    default:
      return 'bg-fm-neutral-100 text-fm-neutral-800';
  }
}

// ---------------------------------------------------------------------------
// Helper: format a date string for display
// ---------------------------------------------------------------------------
function formatDate(dateStr: string): string {
  if (!dateStr) return '--';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch('/api/projects');
        const result = await response.json();

        if (result.success) {
          const found = result.data.find((p: Project) => p.id === id);
          if (found) {
            setProject(found);
          } else {
            setError('Project not found');
          }
        } else {
          setError('Failed to load projects');
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  // ------ Loading state ------ //
  if (loading) {
    return (
      <div className="min-h-screen bg-fm-neutral-50 flex items-center justify-center">
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto mb-4" />
          <p className="text-fm-neutral-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  // ------ Error / not found state ------ //
  if (error || !project) {
    return (
      <div className="min-h-screen bg-fm-neutral-50 flex items-center justify-center">
        <div style={{ textAlign: 'center' }}>
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-fm-neutral-900 font-medium text-lg mb-2">
            {error || 'Project not found'}
          </p>
          <p className="text-fm-neutral-600 mb-6">
            The project you are looking for may have been removed or the link is
            incorrect.
          </p>
          <DashboardButton
            variant="ghost"
            onClick={() => router.push('/admin/projects')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </DashboardButton>
        </div>
      </div>
    );
  }

  // ------ Computed values ------ //
  const daysRemaining = ProjectUtils.getDaysRemaining(project.endDate);
  const isOverdue = ProjectUtils.isProjectOverdue(project.endDate) && project.status !== 'completed' && project.status !== 'cancelled';
  const completedMilestones = project.milestones.filter((m) => m.isCompleted).length;
  const completedDeliverables = project.deliverables.filter((d) => d.status === 'completed').length;
  // The API may return a `spent` field that is not in the strict TypeScript interface
  const spentAmount = (project as Project & { spent?: number }).spent;
  const budgetUtilization = spentAmount != null ? Math.round((spentAmount / project.budget) * 100) : null;

  return (
    <div className="min-h-screen bg-fm-neutral-50">
      {/* ---------------------------------------------------------------- */}
      {/* Top bar: back button + header                                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white border-b border-fm-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Back button */}
          <div className="mb-4">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 text-fm-neutral-600 hover:text-fm-magenta-600 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </div>

          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-fm-neutral-900 truncate">
                  {project.name}
                </h1>
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
                <Badge variant={getPriorityBadgeVariant(project.priority)}>
                  {getPriorityLabel(project.priority)} Priority
                </Badge>
              </div>
              <p className="text-fm-neutral-600 mt-1">
                {getTypeLabel(project.type)}
                {project.clientId && <span> &middot; Client {project.clientId}</span>}
              </p>
            </div>
            <DashboardButton
              variant="admin"
              size="md"
              onClick={() => router.push(`/admin/projects/${id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </DashboardButton>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Main content                                                      */}
      {/* ---------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ============================================================= */}
        {/* Overview Cards Row                                              */}
        {/* ============================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Budget */}
          <DashboardCard variant="default" padding="md">
            <CardContent>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-fm-neutral-600">Budget</span>
              </div>
              <p className="text-2xl font-bold text-fm-neutral-900">
                {ProjectUtils.formatBudget(project.budget)}
              </p>
              {budgetUtilization != null && (
                <p className="text-sm text-fm-neutral-600 mt-1">
                  {ProjectUtils.formatBudget(spentAmount!)} spent ({budgetUtilization}%)
                </p>
              )}
              <p className="text-xs text-fm-neutral-500 mt-1">
                Rate: {ProjectUtils.formatBudget(project.hourlyRate)}/hr
              </p>
            </CardContent>
          </DashboardCard>

          {/* Timeline */}
          <DashboardCard variant="default" padding="md">
            <CardContent>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-fm-neutral-600">Timeline</span>
              </div>
              <p className="text-sm font-semibold text-fm-neutral-900">
                {formatDate(project.startDate)} &ndash; {formatDate(project.endDate)}
              </p>
              {project.status !== 'completed' && project.status !== 'cancelled' && (
                <p className={`text-sm mt-1 font-medium ${isOverdue ? 'text-red-600' : 'text-fm-neutral-600'}`}>
                  {isOverdue
                    ? `Overdue by ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''}`
                    : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`}
                </p>
              )}
            </CardContent>
          </DashboardCard>

          {/* Hours */}
          <DashboardCard variant="default" padding="md">
            <CardContent>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-fm-neutral-600">Hours</span>
              </div>
              <p className="text-2xl font-bold text-fm-neutral-900">
                {project.actualHours ?? 0}
                <span className="text-base font-normal text-fm-neutral-500">
                  {' '}/ {project.estimatedHours}h
                </span>
              </p>
              <p className="text-xs text-fm-neutral-500 mt-1">
                Estimated vs Actual
              </p>
            </CardContent>
          </DashboardCard>

          {/* Client Satisfaction */}
          <DashboardCard variant="default" padding="md">
            <CardContent>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-fm-neutral-600">Satisfaction</span>
              </div>
              {project.clientSatisfaction != null ? (
                <>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= project.clientSatisfaction!
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-fm-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-fm-neutral-600 mt-1">
                    {project.clientSatisfaction}/5 rating
                  </p>
                </>
              ) : (
                <p className="text-sm text-fm-neutral-500 mt-1">Not rated yet</p>
              )}
            </CardContent>
          </DashboardCard>
        </div>

        {/* ============================================================= */}
        {/* Progress Bar                                                    */}
        {/* ============================================================= */}
        <DashboardCard variant="default" padding="md">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-fm-magenta-600" />
                <span className="text-sm font-semibold text-fm-neutral-900">Overall Progress</span>
              </div>
              <span className="text-lg font-bold text-fm-magenta-600">{project.progress}%</span>
            </div>
            <div className="w-full bg-fm-neutral-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700"
                style={{ width: `${Math.min(project.progress, 100)}%` }}
              />
            </div>
          </CardContent>
        </DashboardCard>

        {/* ============================================================= */}
        {/* Description                                                     */}
        {/* ============================================================= */}
        <DashboardCard variant="default" padding="none">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-fm-magenta-600" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <p className="text-fm-neutral-700 leading-relaxed whitespace-pre-wrap">
              {project.description || 'No description provided.'}
            </p>
          </CardContent>
        </DashboardCard>

        {/* Two-column layout for milestones + deliverables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* =========================================================== */}
          {/* Milestones                                                    */}
          {/* =========================================================== */}
          <DashboardCard variant="default" padding="none">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-fm-magenta-600" />
                  Milestones
                </span>
                {project.milestones.length > 0 && (
                  <span className="text-sm font-normal text-fm-neutral-500">
                    {completedMilestones}/{project.milestones.length} completed
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {project.milestones.length === 0 ? (
                <p className="text-fm-neutral-500 text-sm py-4" style={{ textAlign: 'center' }}>
                  No milestones defined for this project.
                </p>
              ) : (
                <div className="space-y-4">
                  {project.milestones.map((milestone: ProjectMilestone) => (
                    <div
                      key={milestone.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border ${
                        milestone.isCompleted
                          ? 'bg-green-50 border-green-200'
                          : 'bg-fm-neutral-50 border-fm-neutral-200'
                      }`}
                    >
                      {milestone.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-fm-neutral-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm ${
                            milestone.isCompleted
                              ? 'text-green-800 line-through'
                              : 'text-fm-neutral-900'
                          }`}
                        >
                          {milestone.title}
                        </p>
                        {milestone.description && (
                          <p className="text-fm-neutral-600 text-xs mt-1">
                            {milestone.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-fm-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {formatDate(milestone.dueDate)}
                          </span>
                          {milestone.assignedTo && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {milestone.assignedTo}
                            </span>
                          )}
                          {milestone.isCompleted && milestone.completedAt && (
                            <span className="text-green-600">
                              Completed {formatDate(milestone.completedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </DashboardCard>

          {/* =========================================================== */}
          {/* Deliverables                                                  */}
          {/* =========================================================== */}
          <DashboardCard variant="default" padding="none">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-fm-magenta-600" />
                  Deliverables
                </span>
                {project.deliverables.length > 0 && (
                  <span className="text-sm font-normal text-fm-neutral-500">
                    {completedDeliverables}/{project.deliverables.length} completed
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {project.deliverables.length === 0 ? (
                <p className="text-fm-neutral-500 text-sm py-4" style={{ textAlign: 'center' }}>
                  No deliverables defined for this project.
                </p>
              ) : (
                <div className="space-y-4">
                  {project.deliverables.map((deliverable: ProjectDeliverable) => (
                    <div
                      key={deliverable.id}
                      className="p-4 rounded-lg border bg-fm-neutral-50 border-fm-neutral-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-fm-neutral-900">
                            {deliverable.title}
                          </p>
                          {deliverable.description && (
                            <p className="text-fm-neutral-600 text-xs mt-1">
                              {deliverable.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${getDeliverableStatusColor(
                            deliverable.status
                          )}`}
                        >
                          {deliverable.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-fm-neutral-500">
                        <span className="capitalize">{deliverable.type}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {formatDate(deliverable.dueDate)}
                        </span>
                        {deliverable.assignedTo && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {deliverable.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </DashboardCard>
        </div>

        {/* Two-column layout for team + content requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* =========================================================== */}
          {/* Team                                                          */}
          {/* =========================================================== */}
          <DashboardCard variant="default" padding="none">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-fm-magenta-600" />
                Team
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                {/* Project Manager */}
                <div className="flex items-center gap-3 p-3 bg-fm-magenta-50 rounded-lg border border-fm-magenta-200">
                  <div className="h-9 w-9 rounded-full bg-fm-magenta-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-4 w-4 text-fm-magenta-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-fm-neutral-900">
                      {project.projectManager || 'Unassigned'}
                    </p>
                    <p className="text-xs text-fm-magenta-600 font-medium">Project Manager</p>
                  </div>
                </div>

                {/* Assigned Talent */}
                {project.assignedTalent.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold text-fm-neutral-500 uppercase tracking-wider mb-3">
                      Assigned Talent ({project.assignedTalent.length})
                    </p>
                    <div className="space-y-2">
                      {project.assignedTalent.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-fm-neutral-50 rounded-lg border border-fm-neutral-200"
                        >
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                            {member
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <p className="text-sm font-medium text-fm-neutral-900">{member}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-fm-neutral-500 text-sm">No team members assigned.</p>
                )}
              </div>
            </CardContent>
          </DashboardCard>

          {/* =========================================================== */}
          {/* Content Requirements                                          */}
          {/* =========================================================== */}
          <DashboardCard variant="default" padding="none">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-fm-magenta-600" />
                Content Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {project.contentRequirements ? (
                <div className="space-y-5">
                  {/* Posts per week */}
                  <div>
                    <p className="text-xs font-semibold text-fm-neutral-500 uppercase tracking-wider mb-1">
                      Posts Per Week
                    </p>
                    <p className="text-2xl font-bold text-fm-neutral-900">
                      {project.contentRequirements.postsPerWeek}
                    </p>
                  </div>

                  {/* Platforms */}
                  {project.contentRequirements.platforms.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-fm-neutral-500 uppercase tracking-wider mb-2">
                        Platforms
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.contentRequirements.platforms.map((platform, index) => (
                          <Badge key={index} variant="info">
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content Types */}
                  {project.contentRequirements.contentTypes.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-fm-neutral-500 uppercase tracking-wider mb-2">
                        Content Types
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.contentRequirements.contentTypes.map((type, index) => (
                          <Badge key={index} variant="secondary">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brand Guidelines */}
                  {project.contentRequirements.brandGuidelines && (
                    <div>
                      <p className="text-xs font-semibold text-fm-neutral-500 uppercase tracking-wider mb-1">
                        Brand Guidelines
                      </p>
                      <p className="text-sm text-fm-neutral-700">
                        {project.contentRequirements.brandGuidelines}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-fm-neutral-500 text-sm py-4" style={{ textAlign: 'center' }}>
                  No content requirements defined.
                </p>
              )}
            </CardContent>
          </DashboardCard>
        </div>

        {/* ============================================================= */}
        {/* Tags                                                            */}
        {/* ============================================================= */}
        {project.tags.length > 0 && (
          <DashboardCard variant="default" padding="none">
            <CardHeader className="px-6 pt-6">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-fm-magenta-600" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-fm-neutral-100 text-fm-neutral-700 rounded-full border border-fm-neutral-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </DashboardCard>
        )}

        {/* ============================================================= */}
        {/* Notes                                                           */}
        {/* ============================================================= */}
        <DashboardCard variant="default" padding="none">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-fm-magenta-600" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {project.notes ? (
              <p className="text-fm-neutral-700 text-sm leading-relaxed whitespace-pre-wrap">
                {project.notes}
              </p>
            ) : (
              <p className="text-fm-neutral-500 text-sm">No notes added.</p>
            )}
          </CardContent>
        </DashboardCard>

        {/* ============================================================= */}
        {/* Metadata footer                                                 */}
        {/* ============================================================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-fm-neutral-500 border-t border-fm-neutral-200 pt-6">
          <span>Created {formatDate(project.createdAt)}</span>
          <span>Last updated {formatDate(project.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

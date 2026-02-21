/**
 * Content Calendar Management Page
 * Professional content planning and scheduling interface
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
  BarChart3,
  Clock,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Circle,
  FileText,
  Image,
  Video,
  Repeat,
  Hash,
  AtSign
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
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import type { ContentItem, ContentStatus, ContentType, Platform } from '@/lib/admin/project-types';
import { ProjectUtils } from '@/lib/admin/project-types';

export default function ContentCalendarPage() {
  const router = useRouter();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<'scheduledDate' | 'createdAt' | 'title' | 'status'>('scheduledDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [projects, setProjects] = useState<any[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load content and projects
  useEffect(() => {
    const loadData = async () => {
      try {
        const [contentResponse, projectsResponse] = await Promise.all([
          fetch('/api/content?sortBy=scheduledDate&sortDirection=asc'),
          fetch('/api/projects')
        ]);

        const contentResult = await contentResponse.json();
        const projectsResult = await projectsResponse.json();

        if (contentResult.success) {
          setContentItems(contentResult.data);
          setFilteredContent(contentResult.data);
        }

        if (projectsResult.success) {
          setProjects(projectsResult.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        adminToast.error('Failed to load content data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = contentItems;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // Platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(item => item.platform === platformFilter);
    }

    // Project filter
    if (projectFilter !== 'all') {
      filtered = filtered.filter(item => item.projectId === projectFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'scheduledDate' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    setFilteredContent(filtered);
  }, [contentItems, searchQuery, statusFilter, typeFilter, platformFilter, projectFilter, sortBy, sortDirection]);

  const getStatusIcon = (status: ContentStatus) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-purple-500" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'revision_needed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-fm-neutral-400" />;
    }
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'video':
      case 'reel':
        return <Video className="h-4 w-4" />;
      case 'carousel':
        return <Repeat className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      default:
        return <Image className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: Platform) => {
    switch (platform) {
      case 'instagram':
        return 'bg-pink-100 text-pink-800';
      case 'facebook':
        return 'bg-blue-100 text-blue-800';
      case 'linkedin':
        return 'bg-blue-100 text-blue-800';
      case 'twitter':
        return 'bg-sky-100 text-sky-800';
      case 'youtube':
        return 'bg-red-100 text-red-800';
      case 'tiktok':
        return 'bg-black text-white';
      case 'website':
        return 'bg-green-100 text-green-800';
      case 'email':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-fm-neutral-100 text-fm-neutral-800';
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      const response = await fetch(`/api/content?id=${contentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setContentItems(contentItems.filter(c => c.id !== contentId));
        adminToast.success('Content deleted');
      } else {
        adminToast.error('Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      adminToast.error('Error deleting content');
    }
  };

  const getUpcomingContent = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    return contentItems.filter(item => {
      const scheduleDate = new Date(item.scheduledDate);
      return scheduleDate >= now && scheduleDate <= sevenDaysFromNow &&
             ['approved', 'scheduled'].includes(item.status);
    });
  };

  const getContentByStatus = (status: ContentStatus) => {
    return contentItems.filter(item => item.status === status).length;
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-56" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
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
        title="Content Calendar"
        description="Plan, create, and schedule your content across all platforms"
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-white border border-fm-neutral-200 rounded-lg p-1">
              <DashboardButton
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="text-xs"
              >
                List
              </DashboardButton>
              <DashboardButton
                variant={viewMode === 'calendar' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="text-xs"
              >
                Calendar
              </DashboardButton>
            </div>
            <DashboardButton
              variant="primary"
              size="sm"
              onClick={() => router.push('/admin/content/new')}
            >
              <Plus className="h-4 w-4" />
              New Content
            </DashboardButton>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Content"
          value={contentItems.length}
          subtitle="All content pieces"
          icon={<FileText className="w-6 h-6" />}
          variant="admin"
        />

        <MetricCard
          title="Scheduled"
          value={getContentByStatus('scheduled')}
          subtitle="Ready to publish"
          icon={<Clock className="w-6 h-6" />}
          variant="admin"
          change={{
            value: Math.round((getContentByStatus('scheduled') / (contentItems.length || 1)) * 100),
            type: 'neutral',
            period: 'of total'
          }}
        />

        <MetricCard
          title="Published"
          value={getContentByStatus('published')}
          subtitle="Live content"
          icon={<CheckCircle className="w-6 h-6" />}
          variant="admin"
          change={{
            value: Math.round((getContentByStatus('published') / (contentItems.length || 1)) * 100),
            type: 'increase',
            period: 'success rate'
          }}
        />

        <MetricCard
          title="This Week"
          value={getUpcomingContent().length}
          subtitle="Upcoming posts"
          icon={<Calendar className="w-6 h-6" />}
          variant="admin"
        />
      </div>

      {/* Filters and Search */}
      <DashboardCard variant="admin" className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'all')}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="revision_needed">Needs Revision</option>
            </Select>

            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ContentType | 'all')}
            >
              <option value="all">All Types</option>
              <option value="post">Post</option>
              <option value="story">Story</option>
              <option value="reel">Reel</option>
              <option value="carousel">Carousel</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="ad">Ad</option>
              <option value="email">Email</option>
            </Select>

            <Select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as Platform | 'all')}
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="website">Website</option>
              <option value="email">Email</option>
            </Select>

            <Select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </Select>
          </div>
        </div>
      </DashboardCard>

      {/* Content List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredContent.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-6 h-6" />}
            title="No content found"
            description={
              contentItems.length === 0
                ? "Get started by creating your first content piece"
                : "Try adjusting your search or filter criteria"
            }
            action={
              contentItems.length === 0 ? (
                <DashboardButton variant="primary" size="sm" onClick={() => router.push('/admin/content/new')}>
                  Create First Content
                </DashboardButton>
              ) : undefined
            }
          />
        ) : (
          filteredContent.map((content) => {
            const project = projects.find(p => p.id === content.projectId);
            return (
              <div key={content.id} className="bg-white rounded-xl border border-fm-neutral-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      {getStatusIcon(content.status)}
                      <div className="flex items-center gap-2">
                        {getTypeIcon(content.type)}
                        <h3 className="text-lg font-semibold text-fm-neutral-900">
                          {content.title}
                        </h3>
                      </div>
                      <StatusBadge status={content.status} />
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlatformColor(content.platform)}`}>
                        {content.platform}
                      </span>
                    </div>

                    <p className="text-fm-neutral-600 mb-4 line-clamp-2">{content.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-sm mb-4">
                      <div>
                        <span className="text-fm-neutral-500">Project:</span>
                        <span className="ml-2 font-medium">{project?.name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-fm-neutral-500">Scheduled:</span>
                        <span className="ml-2 font-medium">
                          {new Date(content.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-fm-neutral-500">Designer:</span>
                        <span className="ml-2 font-medium">{content.assignedDesigner || 'Unassigned'}</span>
                      </div>
                      <div>
                        <span className="text-fm-neutral-500">Writer:</span>
                        <span className="ml-2 font-medium">{content.assignedWriter || 'Unassigned'}</span>
                      </div>
                    </div>

                    {/* Content preview */}
                    {content.content && (
                      <div className="bg-fm-neutral-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-fm-neutral-700 line-clamp-2">{content.content}</p>
                      </div>
                    )}

                    {/* Hashtags and Mentions */}
                    <div className="flex flex-wrap gap-2">
                      {content.hashtags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
                          <Hash className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                      {content.mentions.slice(0, 2).map((mention, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-600 rounded-full">
                          <AtSign className="h-3 w-3" />
                          {mention}
                        </span>
                      ))}
                      {(content.hashtags.length > 3 || content.mentions.length > 2) && (
                        <span className="px-2 py-1 text-xs bg-fm-neutral-100 text-fm-neutral-600 rounded-full">
                          +{(content.hashtags.length - 3) + (content.mentions.length - 2)} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
                    <DashboardButton
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/content/${content.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </DashboardButton>
                    <DashboardButton
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/content/${content.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </DashboardButton>
                    <DashboardButton
                      variant="danger-ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(content.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </DashboardButton>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete Content"
        description="Are you sure you want to delete this content item? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteConfirm) handleDeleteContent(deleteConfirm);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}

/**
 * Content Calendar Management Page
 * Professional content planning and scheduling interface
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Calendar,
  Clock,
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
  AtSign,
  Sparkles,
  ChevronDown,
  LayoutList,
  Layers,
  CalendarDays,
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
import { SocialPublishStatus } from '@/components/admin/social/SocialPublishStatus';
import { Pagination } from '@/components/admin/Pagination';
import { ContentCalendar } from '@/components/content-calendar';
import type { CalendarContentItem } from '@/components/content-calendar';
import { getPlatformColor } from '@/lib/admin/format-helpers';
import type { ContentItem, ContentStatus, ContentType, Platform } from '@/lib/admin/project-types';

const PAGE_SIZE = 25;

export default function ContentCalendarPage() {
  const router = useRouter();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string | 'all'>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grouped' | 'flat' | 'calendar'>('grouped');
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());

  // Calendar view state
  const [calendarItems, setCalendarItems] = useState<CalendarContentItem[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const calendarRangeRef = useRef<{ start: string; end: string } | null>(null);

  // Calendar data fetching
  const fetchCalendarContent = useCallback(async (startDate: string, endDate: string) => {
    try {
      setCalendarLoading(true);
      const params = new URLSearchParams();
      params.set('startDate', startDate);
      params.set('endDate', endDate);
      params.set('sortBy', 'scheduledDate');
      params.set('sortDirection', 'asc');
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (platformFilter !== 'all') params.set('platform', platformFilter);
      if (clientFilter !== 'all') params.set('clientId', clientFilter);
      if (searchQuery) params.set('search', searchQuery);
      if (projectFilter !== 'all') params.set('projectId', projectFilter);

      const response = await fetch(`/api/content?${params}`);
      const result = await response.json();

      if (result.success) {
        const mapped: CalendarContentItem[] = (result.data || []).map((c: any) => ({
          id: c.id,
          title: c.title || 'Untitled',
          scheduledDate: c.scheduledDate || '',
          status: c.status || 'draft',
          type: c.type || 'post',
          platform: c.platform || 'website',
          clientId: c.clientId,
          description: c.description,
        }));
        setCalendarItems(mapped);
      }
    } catch (error) {
      console.error('Error loading calendar content:', error);
    } finally {
      setCalendarLoading(false);
    }
  }, [statusFilter, typeFilter, platformFilter, clientFilter, searchQuery, projectFilter]);

  const handleCalendarDateRangeChange = useCallback(
    (start: string, end: string) => {
      calendarRangeRef.current = { start, end };
      if (viewMode === 'calendar') {
        fetchCalendarContent(start, end);
      }
    },
    [viewMode, fetchCalendarContent]
  );

  // Re-fetch calendar data when filters change while in calendar mode
  useEffect(() => {
    if (viewMode === 'calendar' && calendarRangeRef.current) {
      fetchCalendarContent(calendarRangeRef.current.start, calendarRangeRef.current.end);
    }
  }, [viewMode, fetchCalendarContent]);

  // AI Generate — disabled (no backend endpoint yet; use n8n workflow)

  // Build API URL from filter state and fetch content
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(PAGE_SIZE));
      params.set('sortBy', 'scheduledDate');
      params.set('sortDirection', 'asc');
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (platformFilter !== 'all') params.set('platform', platformFilter);
      if (clientFilter !== 'all') params.set('clientId', clientFilter);

      const response = await fetch(`/api/content?${params}`);
      const result = await response.json();

      if (result.success) {
        setContentItems(result.data);
        setTotalItems(result.pagination?.totalItems ?? result.total ?? 0);
        setTotalPages(result.pagination?.totalPages ?? 1);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      adminToast.error('Failed to load content data');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter, platformFilter, clientFilter]);

  // Fetch content when filters or page change
  useEffect(() => { fetchContent(); }, [fetchContent]);

  // Load projects and clients once for lookups + filter dropdowns
  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(result => { if (result.success) setProjects(result.data); })
      .catch(() => {});
    fetch('/api/clients')
      .then(r => r.json())
      .then(result => {
        if (result.success) {
          setClients(
            (result.data || [])
              .filter((c: any) => c.status === 'active')
              .map((c: any) => ({ id: c.id, name: c.name }))
          );
        }
      })
      .catch(() => {});
  }, []);

  // Client-side search + project filter on the current page's items
  const filteredContent = contentItems.filter(item => {
    if (projectFilter !== 'all' && item.projectId !== projectFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      (item.hashtags || []).some(tag => tag.toLowerCase().includes(q))
    );
  });

  // Group content by client for grouped view
  const groupedContent = useMemo(() => {
    if (viewMode !== 'grouped') return null;
    const groups: Record<string, { clientName: string; items: ContentItem[] }> = {};
    for (const item of filteredContent) {
      const cid = item.clientId || '_unassigned';
      if (!groups[cid]) {
        const name = clients.find(c => c.id === cid)?.name || 'Unassigned';
        groups[cid] = { clientName: name, items: [] };
      }
      groups[cid].items.push(item);
    }
    return Object.entries(groups).sort((a, b) =>
      a[1].clientName.localeCompare(b[1].clientName)
    );
  }, [filteredContent, clients, viewMode]);

  // Expand/collapse helpers
  const toggleClient = (clientId: string) => {
    setExpandedClients(prev => {
      const next = new Set(prev);
      if (next.has(clientId)) next.delete(clientId);
      else next.add(clientId);
      return next;
    });
  };

  const expandAll = () => {
    if (groupedContent) {
      setExpandedClients(new Set(groupedContent.map(([id]) => id)));
    }
  };

  const collapseAll = () => setExpandedClients(new Set());

  // Auto-expand all groups on first load
  useEffect(() => {
    if (groupedContent && groupedContent.length > 0 && expandedClients.size === 0) {
      setExpandedClients(new Set(groupedContent.map(([id]) => id)));
    }
  }, [groupedContent]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset to page 1 when server-side filters change
  const handleStatusFilter = (v: ContentStatus | 'all') => { setStatusFilter(v); setPage(1); };
  const handleTypeFilter = (v: ContentType | 'all') => { setTypeFilter(v); setPage(1); };
  const handlePlatformFilter = (v: Platform | 'all') => { setPlatformFilter(v); setPage(1); };
  const handleClientFilter = (v: string) => { setClientFilter(v); setPage(1); };

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

  const handleDeleteContent = async (contentId: string) => {
    try {
      const response = await fetch(`/api/content?id=${contentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        adminToast.success('Content deleted');
        fetchContent(); // Re-fetch current page
      } else {
        adminToast.error('Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      adminToast.error('Error deleting content');
    }
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
          <div className="flex items-center gap-2">
            <DashboardButton
              variant="secondary"
              size="sm"
              disabled
              title="Use n8n workflow for AI generation"
            >
              <Sparkles className="h-4 w-4" />
              AI Generate
            </DashboardButton>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <MetricCard
          title="Total Results"
          value={totalItems}
          subtitle={statusFilter !== 'all' || typeFilter !== 'all' || platformFilter !== 'all' ? 'Matching filters' : 'All content pieces'}
          icon={<FileText className="w-6 h-6" />}
          variant="admin"
        />

        <MetricCard
          title="On This Page"
          value={filteredContent.length}
          subtitle={`Page ${page} of ${totalPages}`}
          icon={<Clock className="w-6 h-6" />}
          variant="admin"
        />

        <MetricCard
          title="Page Size"
          value={PAGE_SIZE}
          subtitle="Items per page"
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

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-fm-neutral-200 overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode('grouped')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'grouped'
                  ? 'bg-fm-magenta-600 text-white'
                  : 'bg-white text-fm-neutral-600 hover:bg-fm-neutral-50'
              }`}
            >
              <Layers className="h-4 w-4" />
              Grouped
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'flat'
                  ? 'bg-fm-magenta-600 text-white'
                  : 'bg-white text-fm-neutral-600 hover:bg-fm-neutral-50'
              }`}
            >
              <LayoutList className="h-4 w-4" />
              Flat
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-fm-magenta-600 text-white'
                  : 'bg-white text-fm-neutral-600 hover:bg-fm-neutral-50'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </button>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value as ContentStatus | 'all')}
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
            onChange={(e) => handleTypeFilter(e.target.value as ContentType | 'all')}
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
            onChange={(e) => handlePlatformFilter(e.target.value as Platform | 'all')}
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
            value={clientFilter}
            onChange={(e) => handleClientFilter(e.target.value)}
          >
            <option value="all">All Clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
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
      </DashboardCard>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <ContentCalendar
          items={calendarItems}
          loading={calendarLoading}
          variant="admin"
          onDateRangeChange={handleCalendarDateRangeChange}
          onItemClick={(id) => router.push(`/admin/content/${id}`)}
          getClientName={(clientId) =>
            clients.find((c) => c.id === clientId)?.name || 'Unknown'
          }
        />
      )}

      {/* List / Grouped views (hidden in calendar mode) */}
      {viewMode !== 'calendar' && <>

      {/* Expand/Collapse controls for grouped view */}
      {viewMode === 'grouped' && filteredContent.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-fm-neutral-500">
            {groupedContent?.length || 0} client{(groupedContent?.length || 0) !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-sm text-fm-magenta-600 hover:text-fm-magenta-700 font-medium transition-colors"
            >
              Expand All
            </button>
            <span className="text-fm-neutral-300">|</span>
            <button
              onClick={collapseAll}
              className="text-sm text-fm-magenta-600 hover:text-fm-magenta-700 font-medium transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredContent.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-6 h-6" />}
            title="No content found"
            description={
              totalItems === 0 && statusFilter === 'all' && typeFilter === 'all' && platformFilter === 'all' && clientFilter === 'all'
                ? "Get started by creating your first content piece"
                : "Try adjusting your search or filter criteria"
            }
            action={
              totalItems === 0 && statusFilter === 'all' && clientFilter === 'all' ? (
                <DashboardButton variant="primary" size="sm" onClick={() => router.push('/admin/content/new')}>
                  Create First Content
                </DashboardButton>
              ) : undefined
            }
          />
        ) : viewMode === 'grouped' && groupedContent ? (
          /* Grouped view */
          groupedContent.map(([clientId, { clientName, items }]) => {
            const isExpanded = expandedClients.has(clientId);
            // Platform breakdown
            const platformCounts: Record<string, number> = {};
            for (const item of items) {
              const p = item.platform || 'other';
              platformCounts[p] = (platformCounts[p] || 0) + 1;
            }
            const platformSummary = Object.entries(platformCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([p, count]) => {
                const abbr: Record<string, string> = {
                  instagram: 'IG', facebook: 'FB', linkedin: 'LI',
                  twitter: 'TW', youtube: 'YT', tiktok: 'TT',
                  website: 'Web', email: 'Email',
                };
                return `${count} ${abbr[p] || p}`;
              });

            return (
              <div key={clientId} className="rounded-xl border border-fm-neutral-200 overflow-hidden bg-white">
                {/* Client header */}
                <button
                  onClick={() => toggleClient(clientId)}
                  className="w-full flex items-center gap-3 px-4 sm:px-6 py-3.5 bg-fm-neutral-50 hover:bg-fm-neutral-100 transition-colors"
                >
                  <ChevronDown
                    className={`h-5 w-5 text-fm-neutral-500 shrink-0 transition-transform duration-200 ${
                      isExpanded ? '' : '-rotate-90'
                    }`}
                  />
                  <span className="font-semibold text-fm-neutral-900 text-base">
                    {clientName}
                  </span>
                  <span className="text-sm text-fm-neutral-500 bg-fm-neutral-200 px-2 py-0.5 rounded-full">
                    {items.length} {items.length === 1 ? 'post' : 'posts'}
                  </span>
                  <div className="hidden sm:flex items-center gap-1.5 ml-auto">
                    {platformSummary.map((label) => (
                      <span
                        key={label}
                        className="text-xs text-fm-neutral-500 bg-white border border-fm-neutral-200 px-2 py-0.5 rounded-full"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </button>

                {/* Collapsible content items */}
                {isExpanded && (
                  <div className="divide-y divide-fm-neutral-100">
                    {items.map((content) => {
                      const project = projects.find(p => p.id === content.projectId);
                      return (
                        <div key={content.id} className="p-4 sm:p-6 hover:bg-fm-neutral-50/50 transition-colors">
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
                                <SocialPublishStatus
                                  platform={content.platform}
                                  metaPostId={content.metaPostId}
                                  publishError={content.lastPublishError}
                                />
                                {content.aiGenerated && (
                                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700">
                                    AI Draft
                                  </span>
                                )}
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

                              {content.content && (
                                <div className="bg-fm-neutral-50 rounded-lg p-3 mb-4">
                                  <p className="text-sm text-fm-neutral-700 line-clamp-2">{content.content}</p>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2">
                                {(content.hashtags || []).slice(0, 3).map((tag, index) => (
                                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
                                    <Hash className="h-3 w-3" />
                                    {tag}
                                  </span>
                                ))}
                                {(content.mentions || []).slice(0, 2).map((mention, index) => (
                                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-600 rounded-full">
                                    <AtSign className="h-3 w-3" />
                                    {mention}
                                  </span>
                                ))}
                                {((content.hashtags || []).length > 3 || (content.mentions || []).length > 2) && (
                                  <span className="px-2 py-1 text-xs bg-fm-neutral-100 text-fm-neutral-600 rounded-full">
                                    +{((content.hashtags || []).length - 3) + ((content.mentions || []).length - 2)} more
                                  </span>
                                )}
                              </div>
                            </div>

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
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Flat view (original) */
          filteredContent.map((content) => {
            const project = projects.find(p => p.id === content.projectId);
            const clientName = clients.find(c => c.id === content.clientId)?.name;
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
                      <SocialPublishStatus
                        platform={content.platform}
                        metaPostId={content.metaPostId}
                        publishError={content.lastPublishError}
                      />
                      {content.aiGenerated && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700">
                          AI Draft
                        </span>
                      )}
                    </div>

                    <p className="text-fm-neutral-600 mb-4 line-clamp-2">{content.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 text-sm mb-4">
                      <div>
                        <span className="text-fm-neutral-500">Client:</span>
                        <span className="ml-2 font-medium">{clientName || 'N/A'}</span>
                      </div>
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

                    {content.content && (
                      <div className="bg-fm-neutral-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-fm-neutral-700 line-clamp-2">{content.content}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {(content.hashtags || []).slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
                          <Hash className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                      {(content.mentions || []).slice(0, 2).map((mention, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-600 rounded-full">
                          <AtSign className="h-3 w-3" />
                          {mention}
                        </span>
                      ))}
                      {((content.hashtags || []).length > 3 || (content.mentions || []).length > 2) && (
                        <span className="px-2 py-1 text-xs bg-fm-neutral-100 text-fm-neutral-600 rounded-full">
                          +{((content.hashtags || []).length - 3) + ((content.mentions || []).length - 2)} more
                        </span>
                      )}
                    </div>
                  </div>

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

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      </>}

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

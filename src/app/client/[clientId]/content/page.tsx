'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MetricCard,
  DashboardCard as Card,
  CardContent,
  CardHeader,
  DashboardButton as Button
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  CalendarDays,
  LayoutGrid,
  FileText,
  Video,
  Image,
  PenTool,
  Clock,
  CheckCircle2,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Download,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  X,
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import { getStatusColor } from '@/lib/client-portal/status-colors';
import { downloadCSV } from '@/lib/client-portal/export';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { FilterTabBar } from '@/components/ui/filter-tab-bar';
import { ContentCalendar } from '@/components/content-calendar';
import type { CalendarContentItem } from '@/components/content-calendar';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'post' | 'story' | 'reel' | 'carousel' | 'video' | 'article' | 'ad' | 'email';
  platform: string;
  status: 'draft' | 'scheduled' | 'published' | 'review' | 'approved' | 'revision_needed';
  scheduledDate: string;
  publishedDate?: string;
  author: string;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    impressions: number;
  };
  thumbnail?: string;
  tags: string[];
  clientFeedback?: string;
  revisionNotes?: string;
  approvedAt?: string;
}

export default function ClientContentPage() {
  const { clientId } = useClientPortal();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view') === 'calendar' ? 'calendar' : 'grid';

  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'scheduled' | 'draft' | 'review'>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>(initialView);
  const [calendarItems, setCalendarItems] = useState<CalendarContentItem[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const calendarRangeRef = useRef<{ start: string; end: string } | null>(null);
  const [detailPanelItem, setDetailPanelItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/client-portal/${clientId}/content?limit=50`);
        if (res.ok) {
          const data = await res.json();
          const mapped: ContentItem[] = (data.data || []).map((c: any) => ({
            id: c.id,
            title: c.title || 'Untitled',
            description: c.description || '',
            type: c.type || 'post',
            platform: c.platform || 'Website',
            status: c.status || 'draft',
            scheduledDate: c.scheduledDate || '',
            publishedDate: c.publishedDate,
            author: c.author || '',
            engagement: c.engagement ? {
              likes: c.engagement.likes || 0,
              comments: c.engagement.comments || 0,
              shares: c.engagement.shares || 0,
              reach: c.engagement.reach || 0,
              impressions: c.engagement.impressions || 0,
            } : undefined,
            tags: Array.isArray(c.tags) ? c.tags : [],
            clientFeedback: c.clientFeedback,
            revisionNotes: c.revisionNotes,
            approvedAt: c.approvedAt,
          }));
          setContentItems(mapped);
        }
      } catch (err) {
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  // Calendar data fetching
  const fetchCalendarContent = useCallback(async (startDate: string, endDate: string) => {
    if (!clientId) return;
    try {
      setCalendarLoading(true);
      const params = new URLSearchParams();
      params.set('startDate', startDate);
      params.set('endDate', endDate);
      params.set('limit', '200');
      if (filter !== 'all') params.set('status', filter);

      const res = await fetch(`/api/client-portal/${clientId}/content?${params}`);
      if (res.ok) {
        const data = await res.json();
        const mapped: CalendarContentItem[] = (data.data || []).map((c: any) => ({
          id: c.id,
          title: c.title || 'Untitled',
          scheduledDate: c.scheduledDate || c.scheduled_date || '',
          status: c.status || 'draft',
          type: c.type || 'post',
          platform: c.platform || 'website',
          description: c.description,
        }));
        setCalendarItems(mapped);
      }
    } catch (err) {
      console.error('Error fetching calendar content:', err);
    } finally {
      setCalendarLoading(false);
    }
  }, [clientId, filter]);

  const handleCalendarDateRangeChange = useCallback(
    (start: string, end: string) => {
      calendarRangeRef.current = { start, end };
      if (viewMode === 'calendar') {
        fetchCalendarContent(start, end);
      }
    },
    [viewMode, fetchCalendarContent]
  );

  // Re-fetch calendar data when filter changes while in calendar mode
  useEffect(() => {
    if (viewMode === 'calendar' && calendarRangeRef.current) {
      fetchCalendarContent(calendarRangeRef.current.start, calendarRangeRef.current.end);
    }
  }, [viewMode, fetchCalendarContent]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <Image className="w-4 h-4" />;
      case 'story': return <Clock className="w-4 h-4" />;
      case 'reel': return <Video className="w-4 h-4" />;
      case 'carousel': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'article': return <PenTool className="w-4 h-4" />;
      case 'ad': return <TrendingUp className="w-4 h-4" />;
      case 'email': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (lowerPlatform.includes('facebook')) return <Facebook className="w-4 h-4" />;
    if (lowerPlatform.includes('twitter')) return <Twitter className="w-4 h-4" />;
    if (lowerPlatform.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (lowerPlatform.includes('youtube')) return <Youtube className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const handleContentAction = async (contentId: string, action: 'approve' | 'request_revision') => {
    try {
      setActioningId(contentId);
      const feedback = feedbackMap[contentId] || '';
      const res = await fetch(`/api/client-portal/${clientId}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, action, feedback }),
      });
      if (res.ok) {
        const json = await res.json();
        setContentItems((prev) =>
          prev.map((item) =>
            item.id === contentId
              ? {
                  ...item,
                  status: json.data.status,
                  ...(action === 'approve'
                    ? { approvedAt: new Date().toISOString(), clientFeedback: feedback }
                    : { revisionNotes: feedback }),
                }
              : item
          )
        );
        setExpandedReviewId(null);
        setFeedbackMap((prev) => {
          const next = { ...prev };
          delete next[contentId];
          return next;
        });
      }
    } catch (err) {
      console.error('Error performing content action:', err);
    } finally {
      setActioningId(null);
    }
  };

  const reviewContent = contentItems.filter(item => item.status === 'review');

  const filteredContent = contentItems.filter(item => {
    const matchesStatus = filter === 'all' || item.status === filter;
    const matchesMonth = !selectedMonth || (item.scheduledDate && item.scheduledDate.startsWith(selectedMonth));
    return matchesStatus && matchesMonth;
  });

  const publishedContent = contentItems.filter(item => item.status === 'published');
  const scheduledContent = contentItems.filter(item => item.status === 'scheduled');
  const avgLikes = publishedContent.length > 0
    ? publishedContent.reduce((sum, item) => sum + (item.engagement?.likes || 0), 0) / publishedContent.length
    : 0;
  const totalReach = publishedContent.reduce((sum, item) =>
    sum + (item.engagement?.reach || 0), 0);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-display font-bold text-fm-neutral-900">
              Content <span className="v2-accent">Calendar</span>
            </h1>
            <p className="text-fm-neutral-600 mt-1 font-medium text-sm sm:text-base">Manage and track your content publishing schedule</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-fm-magenta-600"
              onClick={() => {
                const headers = ['Title', 'Type', 'Platform', 'Status', 'Scheduled Date', 'Author'];
                const rows = contentItems.map(c => [
                  c.title, c.type, c.platform, c.status, c.scheduledDate, c.author,
                ]);
                downloadCSV('content-calendar.csv', headers, rows);
              }}
            >
              <Download className="w-4 h-4" />
              Export Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
        <MetricCard
          title="Published Content"
          value={publishedContent.length}
          subtitle="This month"
          icon={<CheckCircle2 className="w-6 h-6" />}
          variant="client"
        />

        <MetricCard
          title="Scheduled"
          value={scheduledContent.length}
          subtitle="Upcoming content"
          icon={<Clock className="w-6 h-6" />}
          variant="client"
        />

        <MetricCard
          title="Total Reach"
          value={totalReach}
          subtitle="Across all content"
          icon={<Eye className="w-6 h-6" />}
          variant="client"
          formatter={(val) => new Intl.NumberFormat('en-US', {
            notation: 'compact'
          }).format(Number(val))}
        />

        <MetricCard
          title="Avg Likes"
          value={Math.round(avgLikes)}
          subtitle="Per published post"
          icon={<Heart className="w-6 h-6" />}
          variant="client"
          formatter={(val) => new Intl.NumberFormat('en-US', {
            notation: 'compact'
          }).format(Number(val))}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <FilterTabBar
          tabs={[
            { key: 'all', label: 'All', count: contentItems.length },
            { key: 'published', label: 'Published', count: publishedContent.length },
            { key: 'scheduled', label: 'Scheduled', count: scheduledContent.length },
            { key: 'review', label: 'Review', count: reviewContent.length },
            { key: 'draft', label: 'Drafts', count: contentItems.filter(i => i.status === 'draft').length },
          ]}
          active={filter}
          onChange={(key) => setFilter(key as typeof filter)}
          variant="client"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Grid / Calendar toggle */}
          <div className="flex items-center rounded-lg border border-fm-neutral-200 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-fm-magenta-600 text-white'
                  : 'bg-white text-fm-neutral-600 hover:bg-fm-neutral-50'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-fm-magenta-600 text-white'
                  : 'bg-white text-fm-neutral-600 hover:bg-fm-neutral-50'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </button>
          </div>

          {viewMode === 'grid' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 text-sm border border-fm-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-300"
            />
          )}
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <ContentCalendar
          items={calendarItems}
          loading={calendarLoading}
          variant="client"
          onDateRangeChange={handleCalendarDateRangeChange}
          onItemClick={(id) => {
            const item = contentItems.find((c) => c.id === id);
            if (item) setDetailPanelItem(item);
          }}
        />
      )}

      {/* Content Detail Slide-Over Panel */}
      {detailPanelItem && (
        <div className="fixed inset-0" style={{ zIndex: 50 }}>
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDetailPanelItem(null)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-fm-neutral-100 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-fm-neutral-900 truncate">
                {detailPanelItem.title}
              </h3>
              <button
                onClick={() => setDetailPanelItem(null)}
                className="p-1.5 rounded-lg hover:bg-fm-neutral-100 transition-colors"
              >
                <X className="h-5 w-5 text-fm-neutral-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getStatusColor(detailPanelItem.status)} variant="secondary">
                  {detailPanelItem.status}
                </Badge>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                  {detailPanelItem.platform}
                </span>
                <span className="text-xs text-fm-neutral-500 capitalize">
                  {detailPanelItem.type}
                </span>
              </div>
              {detailPanelItem.description && (
                <div>
                  <p className="text-sm font-medium text-fm-neutral-700 mb-1">Description</p>
                  <p className="text-sm text-fm-neutral-600">{detailPanelItem.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-fm-neutral-700 mb-1">Scheduled Date</p>
                <p className="text-sm text-fm-neutral-600">
                  {detailPanelItem.scheduledDate
                    ? new Date(detailPanelItem.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Not scheduled'}
                </p>
              </div>
              {detailPanelItem.author && (
                <div>
                  <p className="text-sm font-medium text-fm-neutral-700 mb-1">Author</p>
                  <p className="text-sm text-fm-neutral-600">{detailPanelItem.author}</p>
                </div>
              )}

              {/* Approval actions for review items */}
              {detailPanelItem.status === 'review' && (
                <div className="pt-4 border-t border-fm-neutral-100 space-y-3">
                  <textarea
                    value={feedbackMap[detailPanelItem.id] || ''}
                    onChange={(e) =>
                      setFeedbackMap((prev) => ({
                        ...prev,
                        [detailPanelItem.id]: e.target.value,
                      }))
                    }
                    placeholder="Add feedback (optional)..."
                    rows={3}
                    className="w-full rounded-md border border-fm-neutral-300 bg-fm-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="client"
                      size="sm"
                      disabled={actioningId === detailPanelItem.id}
                      onClick={() => {
                        handleContentAction(detailPanelItem.id, 'approve');
                        setDetailPanelItem(null);
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button
                      variant="warning-ghost"
                      size="sm"
                      disabled={actioningId === detailPanelItem.id}
                      onClick={() => {
                        handleContentAction(detailPanelItem.id, 'request_revision');
                        setDetailPanelItem(null);
                      }}
                    >
                      Request Revision
                    </Button>
                  </div>
                </div>
              )}

              {detailPanelItem.clientFeedback && (
                <div className="pt-3 border-t border-fm-neutral-100">
                  <p className="text-xs text-fm-neutral-500 mb-1">Your Feedback</p>
                  <p className="text-sm text-fm-neutral-700 bg-green-50 rounded-md p-2">
                    {detailPanelItem.clientFeedback}
                  </p>
                </div>
              )}
              {detailPanelItem.revisionNotes && (
                <div className="pt-3 border-t border-fm-neutral-100">
                  <p className="text-xs text-fm-neutral-500 mb-1">Revision Notes</p>
                  <p className="text-sm text-fm-neutral-700 bg-orange-50 rounded-md p-2">
                    {detailPanelItem.revisionNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      {viewMode === 'grid' && <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <Card key={item.id} variant="client" hover glow className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fm-magenta-100 to-fm-magenta-100 flex items-center justify-center text-fm-magenta-600">
                    {getTypeIcon(item.type)}
                  </div>
                  <Badge className={getStatusColor(item.status)} variant="secondary">
                    {item.status}
                  </Badge>
                </div>
                <div className="text-fm-neutral-400">
                  {getPlatformIcon(item.platform)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-fm-neutral-900 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-fm-neutral-600 line-clamp-2 mt-1">{item.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-fm-neutral-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(item.scheduledDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <span className="text-xs">{item.author}</span>
              </div>

              {/* Engagement Metrics (for published content) */}
              {item.status === 'published' && item.engagement && (
                <div className="pt-3 border-t border-fm-neutral-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-fm-neutral-500 mb-1">Reach</div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-fm-neutral-400" />
                        <span className="text-sm font-medium">
                          {new Intl.NumberFormat('en-US', {
                            notation: 'compact'
                          }).format(item.engagement.reach)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-fm-neutral-500 mb-1">Likes</div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-fm-neutral-400" />
                        <span className="text-sm font-medium">{item.engagement.likes.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-fm-neutral-500 mb-1">Shares</div>
                      <div className="flex items-center">
                        <Share2 className="w-4 h-4 mr-1 text-fm-neutral-400" />
                        <span className="text-sm font-medium">{item.engagement.shares.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-fm-neutral-500 mb-1">Comments</div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-fm-neutral-400" />
                        <span className="text-sm font-medium">{item.engagement.comments.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-2">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-fm-neutral-100 text-fm-neutral-600 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Feedback display */}
              {item.clientFeedback && (
                <div className="pt-2 border-t border-fm-neutral-100">
                  <p className="text-xs text-fm-neutral-500 mb-1">Your Feedback</p>
                  <p className="text-sm text-fm-neutral-700 bg-green-50 rounded-md p-2">{item.clientFeedback}</p>
                </div>
              )}
              {item.revisionNotes && (
                <div className="pt-2 border-t border-fm-neutral-100">
                  <p className="text-xs text-fm-neutral-500 mb-1">Revision Notes</p>
                  <p className="text-sm text-fm-neutral-700 bg-orange-50 rounded-md p-2">{item.revisionNotes}</p>
                </div>
              )}

              {/* Review Actions */}
              {item.status === 'review' && (
                <div className="pt-3 border-t border-fm-neutral-100 space-y-2">
                  {expandedReviewId === item.id ? (
                    <>
                      <textarea
                        value={feedbackMap[item.id] || ''}
                        onChange={(e) => setFeedbackMap((prev) => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Add feedback (optional)..."
                        rows={2}
                        className="w-full rounded-md border border-fm-neutral-300 bg-fm-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="client"
                          size="sm"
                          disabled={actioningId === item.id}
                          onClick={() => handleContentAction(item.id, 'approve')}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          variant="warning-ghost"
                          size="sm"
                          disabled={actioningId === item.id}
                          onClick={() => handleContentAction(item.id, 'request_revision')}
                        >
                          Request Revision
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedReviewId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="client"
                        size="sm"
                        onClick={() => setExpandedReviewId(item.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-600 hover:bg-orange-50"
                        onClick={() => setExpandedReviewId(item.id)}
                      >
                        Request Revision
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Content type label */}
              <div className="pt-2">
                <span className="text-xs uppercase tracking-wider font-medium text-fm-magenta-600">
                  {item.type}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>}

      {viewMode === 'grid' && filteredContent.length === 0 && (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="No content found"
          description={
            filter === 'all'
              ? "No content items scheduled yet"
              : `No ${filter} content at the moment`
          }
        />
      )}
    </>
  );
}

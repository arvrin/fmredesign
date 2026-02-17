/**
 * Content Detail Page
 * Displays full details for a single content item including
 * preview, scheduling, assignments, media, and client feedback.
 */

'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Image,
  Video,
  Hash,
  AtSign,
  MessageSquare,
  Edit,
  Clock,
  User,
  FileText,
  Tag,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  DashboardButton,
  DashboardCard,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import type {
  ContentItem,
  ContentStatus,
  ContentType,
  Platform,
} from '@/lib/admin/project-types';

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function getStatusBadgeVariant(
  status: ContentStatus
): 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'default' {
  switch (status) {
    case 'published':
      return 'success';
    case 'approved':
      return 'info';
    case 'scheduled':
      return 'secondary';
    case 'review':
      return 'warning';
    case 'revision_needed':
      return 'danger';
    case 'draft':
    default:
      return 'default';
  }
}

function getStatusLabel(status: ContentStatus): string {
  switch (status) {
    case 'revision_needed':
      return 'Revision Needed';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function getPlatformColor(platform: Platform): string {
  const map: Record<Platform, string> = {
    instagram: 'bg-pink-100 text-pink-800 border-pink-200',
    facebook: 'bg-blue-100 text-blue-800 border-blue-200',
    linkedin: 'bg-blue-100 text-blue-800 border-blue-200',
    twitter: 'bg-sky-100 text-sky-800 border-sky-200',
    youtube: 'bg-red-100 text-red-800 border-red-200',
    tiktok: 'bg-neutral-900 text-white border-neutral-700',
    website: 'bg-green-100 text-green-800 border-green-200',
    email: 'bg-purple-100 text-purple-800 border-purple-200',
  };
  return map[platform] ?? 'bg-fm-neutral-100 text-fm-neutral-800 border-fm-neutral-200';
}

function getTypeLabel(type: ContentType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/content');

        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const found = result.data.find(
            (item: ContentItem) => item.id === id
          );
          if (found) {
            setContent(found);
          } else {
            setError('Content item not found');
          }
        } else {
          setError('Failed to load content data');
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-fm-neutral-50 flex items-center justify-center">
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto mb-4" />
          <p className="text-fm-neutral-600">Loading content details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !content) {
    return (
      <div className="min-h-screen bg-fm-neutral-50 flex items-center justify-center">
        <div style={{ textAlign: 'center' }}>
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-fm-neutral-900 font-medium mb-2">
            {error || 'Content not found'}
          </p>
          <p className="text-fm-neutral-600 mb-6">
            The content item you are looking for does not exist or could not be
            loaded.
          </p>
          <DashboardButton
            variant="ghost"
            onClick={() => router.push('/admin/content')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content Calendar
          </DashboardButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fm-neutral-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* ---------------------------------------------------------------- */}
        {/* Back button                                                      */}
        {/* ---------------------------------------------------------------- */}
        <DashboardButton
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/content')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Content Calendar
        </DashboardButton>

        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-fm-neutral-900 mb-3">
                {content.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={getStatusBadgeVariant(content.status)} size="sm">
                  {getStatusLabel(content.status)}
                </Badge>

                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getPlatformColor(content.platform)}`}
                >
                  {content.platform.charAt(0).toUpperCase() +
                    content.platform.slice(1)}
                </span>

                <Badge variant="default" size="sm">
                  {getTypeLabel(content.type)}
                </Badge>
              </div>

              {content.description && (
                <p className="text-fm-neutral-600 mt-3 leading-relaxed">
                  {content.description}
                </p>
              )}
            </div>

            <DashboardButton
              variant="admin"
              size="sm"
              onClick={() => router.push(`/admin/content/${id}/edit`)}
              className="shrink-0"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Content
            </DashboardButton>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Main Grid                                                        */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column -- 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Preview */}
            <DashboardCard variant="admin" padding="none">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-fm-magenta-600" />
                  Content Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="bg-fm-neutral-50 rounded-lg p-4 border border-fm-neutral-200">
                  <p className="text-fm-neutral-700 whitespace-pre-wrap leading-relaxed">
                    {content.content || 'No content body provided.'}
                  </p>
                </div>
              </CardContent>
            </DashboardCard>

            {/* Hashtags and Mentions */}
            {(content.hashtags.length > 0 || content.mentions.length > 0) && (
              <DashboardCard variant="admin" padding="none">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-fm-magenta-600" />
                    Hashtags and Mentions
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                  {content.hashtags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-fm-neutral-700 mb-2">
                        Hashtags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {content.hashtags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                          >
                            <Hash className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {content.mentions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-fm-neutral-700 mb-2">
                        Mentions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {content.mentions.map((mention, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-sm bg-green-50 text-green-700 rounded-full border border-green-200"
                          >
                            <AtSign className="h-3 w-3" />
                            {mention}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </DashboardCard>
            )}

            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <DashboardCard variant="admin" padding="none">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-fm-magenta-600" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </DashboardCard>
            )}

            {/* Client Feedback and Revision Notes */}
            {(content.clientFeedback || content.revisionNotes) && (
              <DashboardCard variant="admin" padding="none">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-fm-magenta-600" />
                    Feedback and Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                  {content.clientFeedback && (
                    <div>
                      <p className="text-sm font-medium text-fm-neutral-700 mb-1">
                        Client Feedback
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-900 whitespace-pre-wrap">
                          {content.clientFeedback}
                        </p>
                      </div>
                    </div>
                  )}

                  {content.revisionNotes && (
                    <div>
                      <p className="text-sm font-medium text-fm-neutral-700 mb-1">
                        Revision Notes
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-900 whitespace-pre-wrap">
                          {content.revisionNotes}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </DashboardCard>
            )}

            {/* Media Section */}
            {(content.imageUrl || content.videoUrl) && (
              <DashboardCard variant="admin" padding="none">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-fm-magenta-600" />
                    Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                  {content.imageUrl && (
                    <div>
                      <p className="text-sm font-medium text-fm-neutral-700 mb-2">
                        Image
                      </p>
                      <div className="rounded-lg overflow-hidden border border-fm-neutral-200 bg-fm-neutral-50">
                        <img
                          src={content.imageUrl}
                          alt={content.title}
                          className="w-full max-h-96 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling;
                            if (fallback) {
                              (fallback as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                        <div
                          className="hidden items-center justify-center gap-2 p-6 text-fm-neutral-500"
                          style={{ display: 'none' }}
                        >
                          <Image className="h-5 w-5" />
                          <span className="text-sm">Image could not be loaded</span>
                        </div>
                      </div>
                      <a
                        href={content.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-sm text-fm-magenta-600 hover:text-fm-magenta-700"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open image in new tab
                      </a>
                    </div>
                  )}

                  {content.videoUrl && (
                    <div>
                      <p className="text-sm font-medium text-fm-neutral-700 mb-2">
                        Video
                      </p>
                      <div className="flex items-center gap-3 bg-fm-neutral-50 rounded-lg p-4 border border-fm-neutral-200">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-fm-magenta-100 flex items-center justify-center">
                          <Video className="h-5 w-5 text-fm-magenta-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-fm-neutral-700 truncate">
                            {content.videoUrl}
                          </p>
                        </div>
                        <a
                          href={content.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0"
                        >
                          <DashboardButton variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </DashboardButton>
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </DashboardCard>
            )}

            {/* Files Section */}
            {content.files && content.files.length > 0 && (
              <DashboardCard variant="admin" padding="none">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-fm-magenta-600" />
                    Files ({content.files.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-2">
                    {content.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-fm-neutral-50 rounded-lg p-3 border border-fm-neutral-200"
                      >
                        <FileText className="h-4 w-4 text-fm-neutral-500 flex-shrink-0" />
                        <span className="text-sm text-fm-neutral-700 truncate flex-1">
                          {file}
                        </span>
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-fm-magenta-600 hover:text-fm-magenta-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </DashboardCard>
            )}
          </div>

          {/* Right column -- 1/3 width sidebar on large screens */}
          <div className="space-y-6">
            {/* Scheduling Info */}
            <DashboardCard variant="admin" padding="none">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-fm-magenta-600" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-4">
                <div>
                  <p className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider mb-1">
                    Scheduled Date
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-fm-neutral-400" />
                    <p className="text-sm font-medium text-fm-neutral-900">
                      {formatDate(content.scheduledDate)}
                    </p>
                  </div>
                </div>

                {content.publishedDate && (
                  <div>
                    <p className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider mb-1">
                      Published Date
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <p className="text-sm font-medium text-fm-neutral-900">
                        {formatDate(content.publishedDate)}
                      </p>
                    </div>
                  </div>
                )}

                {content.approvedAt && (
                  <div>
                    <p className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider mb-1">
                      Approved At
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-medium text-fm-neutral-900">
                        {formatDateTime(content.approvedAt)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t border-fm-neutral-200 pt-4">
                  <p className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider mb-1">
                    Created
                  </p>
                  <p className="text-sm text-fm-neutral-600">
                    {formatDateTime(content.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm text-fm-neutral-600">
                    {formatDateTime(content.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </DashboardCard>

            {/* Assignment Info */}
            <DashboardCard variant="admin" padding="none">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-fm-magenta-600" />
                  Assignments
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-4">
                <div>
                  <p className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider mb-1">
                    Designer
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-fm-magenta-100 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-fm-magenta-600" />
                    </div>
                    <p className="text-sm font-medium text-fm-neutral-900">
                      {content.assignedDesigner || 'Unassigned'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider mb-1">
                    Writer
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-fm-neutral-900">
                      {content.assignedWriter || 'Unassigned'}
                    </p>
                  </div>
                </div>

                {content.assignedTo && (
                  <div>
                    <p className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider mb-1">
                      Assigned To
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-fm-neutral-900">
                        {content.assignedTo}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </DashboardCard>

            {/* IDs and Metadata */}
            <DashboardCard variant="admin" padding="none">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="flex items-center gap-2 text-base">
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 space-y-3">
                <div>
                  <p className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider mb-0.5">
                    Content ID
                  </p>
                  <p className="text-xs text-fm-neutral-600 font-mono break-all">
                    {content.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider mb-0.5">
                    Project ID
                  </p>
                  <p className="text-xs text-fm-neutral-600 font-mono break-all">
                    {content.projectId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider mb-0.5">
                    Client ID
                  </p>
                  <p className="text-xs text-fm-neutral-600 font-mono break-all">
                    {content.clientId}
                  </p>
                </div>
              </CardContent>
            </DashboardCard>

            {/* Engagement Metrics (if published) */}
            {content.engagement && (
              <DashboardCard variant="admin" padding="none">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="flex items-center gap-2 text-base">
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-fm-neutral-50 rounded-lg p-3 border border-fm-neutral-200">
                      <p className="text-xs text-fm-neutral-500 mb-0.5">Likes</p>
                      <p className="text-lg font-bold text-fm-neutral-900">
                        {content.engagement.likes.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-fm-neutral-50 rounded-lg p-3 border border-fm-neutral-200">
                      <p className="text-xs text-fm-neutral-500 mb-0.5">
                        Comments
                      </p>
                      <p className="text-lg font-bold text-fm-neutral-900">
                        {content.engagement.comments.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-fm-neutral-50 rounded-lg p-3 border border-fm-neutral-200">
                      <p className="text-xs text-fm-neutral-500 mb-0.5">Shares</p>
                      <p className="text-lg font-bold text-fm-neutral-900">
                        {content.engagement.shares.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-fm-neutral-50 rounded-lg p-3 border border-fm-neutral-200">
                      <p className="text-xs text-fm-neutral-500 mb-0.5">Reach</p>
                      <p className="text-lg font-bold text-fm-neutral-900">
                        {content.engagement.reach.toLocaleString()}
                      </p>
                    </div>
                    <div className="col-span-2 bg-fm-neutral-50 rounded-lg p-3 border border-fm-neutral-200">
                      <p className="text-xs text-fm-neutral-500 mb-0.5">
                        Impressions
                      </p>
                      <p className="text-lg font-bold text-fm-neutral-900">
                        {content.engagement.impressions.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </DashboardCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

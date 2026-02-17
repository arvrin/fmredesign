'use client';

import { useState, useEffect } from 'react';
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
  FileText,
  Video,
  Image,
  Mic,
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
  Globe
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import { getStatusColor } from '@/lib/client-portal/status-colors';
import { downloadCSV } from '@/lib/client-portal/export';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'blog' | 'social' | 'video' | 'infographic' | 'podcast' | 'email';
  platform: string;
  status: 'draft' | 'scheduled' | 'published' | 'review';
  scheduledDate: string;
  publishedDate?: string;
  author: string;
  performance?: {
    views: number;
    engagement: number;
    shares: number;
    conversions: number;
  };
  thumbnail?: string;
  tags: string[];
}

export default function ClientContentPage() {
  const { clientId } = useClientPortal();

  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

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
            performance: c.engagement ? {
              views: c.engagement.views || 0,
              engagement: c.engagement.engagement || 0,
              shares: c.engagement.shares || 0,
              conversions: c.engagement.conversions || 0
            } : undefined,
            tags: Array.isArray(c.tags) ? c.tags : []
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return <PenTool className="w-4 h-4" />;
      case 'social': return <Share2 className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'infographic': return <Image className="w-4 h-4" />;
      case 'podcast': return <Mic className="w-4 h-4" />;
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

  const filteredContent = contentItems.filter(item => {
    const matchesStatus = filter === 'all' || item.status === filter;
    const matchesMonth = !selectedMonth || item.scheduledDate.startsWith(selectedMonth);
    return matchesStatus && matchesMonth;
  });

  const publishedContent = contentItems.filter(item => item.status === 'published');
  const scheduledContent = contentItems.filter(item => item.status === 'scheduled');
  const totalEngagement = publishedContent.reduce((sum, item) =>
    sum + (item.performance?.engagement || 0), 0) / publishedContent.length || 0;
  const totalViews = publishedContent.reduce((sum, item) =>
    sum + (item.performance?.views || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fm-magenta-600" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-fm-neutral-900">
              Content <span className="v2-accent">Calendar</span>
            </h1>
            <p className="text-fm-neutral-600 mt-1 font-medium">Manage and track your content publishing schedule</p>
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
              <Download className="w-4 h-4 mr-2" />
              Export Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          title="Total Views"
          value={totalViews}
          subtitle="Across all content"
          icon={<Eye className="w-6 h-6" />}
          variant="client"
          formatter={(val) => new Intl.NumberFormat('en-US', {
            notation: 'compact'
          }).format(Number(val))}
        />

        <MetricCard
          title="Avg Engagement"
          value={`${totalEngagement.toFixed(1)}%`}
          subtitle="Engagement rate"
          icon={<TrendingUp className="w-6 h-6" />}
          variant="client"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant={filter === 'all' ? 'client' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Content ({contentItems.length})
          </Button>
          <Button
            variant={filter === 'published' ? 'client' : 'ghost'}
            size="sm"
            onClick={() => setFilter('published')}
          >
            Published ({publishedContent.length})
          </Button>
          <Button
            variant={filter === 'scheduled' ? 'client' : 'ghost'}
            size="sm"
            onClick={() => setFilter('scheduled')}
          >
            Scheduled ({scheduledContent.length})
          </Button>
          <Button
            variant={filter === 'draft' ? 'client' : 'ghost'}
            size="sm"
            onClick={() => setFilter('draft')}
          >
            Drafts ({contentItems.filter(i => i.status === 'draft').length})
          </Button>
        </div>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-1.5 text-sm border border-fm-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-300"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

              {/* Performance Metrics (for published content) */}
              {item.status === 'published' && item.performance && (
                <div className="pt-3 border-t border-fm-neutral-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-fm-neutral-500 mb-1">Views</div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-fm-neutral-400" />
                        <span className="text-sm font-medium">
                          {new Intl.NumberFormat('en-US', {
                            notation: 'compact'
                          }).format(item.performance.views)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-fm-neutral-500 mb-1">Engagement</div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-fm-neutral-400" />
                        <span className="text-sm font-medium">{item.performance.engagement}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-fm-neutral-500 mb-1">Shares</div>
                      <div className="flex items-center">
                        <Share2 className="w-4 h-4 mr-1 text-fm-neutral-400" />
                        <span className="text-sm font-medium">{item.performance.shares}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-fm-neutral-500 mb-1">Conversions</div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-fm-neutral-400" />
                        <span className="text-sm font-medium">{item.performance.conversions}</span>
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

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs uppercase tracking-wider font-medium text-fm-magenta-600">
                  {item.type}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-fm-magenta-600 hover:bg-fm-magenta-50"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <Card variant="glass" className="p-12 text-center">
          <FileText className="w-16 h-16 text-fm-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">No content found</h3>
          <p className="text-fm-neutral-600">
            {filter === 'all'
              ? "No content items scheduled yet"
              : `No ${filter} content at the moment`}
          </p>
        </Card>
      )}
    </>
  );
}

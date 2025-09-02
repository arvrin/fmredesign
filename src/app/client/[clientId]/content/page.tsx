'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  DashboardLayout,
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
  Calendar,
  FileText,
  Video,
  Image,
  Mic,
  PenTool,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Briefcase,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Globe
} from 'lucide-react';

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
  const params = useParams();
  const clientId = params.clientId as string;
  
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    // Simulate fetching content data
    setTimeout(() => {
      setContentItems([
        {
          id: '1',
          title: 'Ultimate Guide to Digital Marketing in 2024',
          description: 'Comprehensive blog post covering latest digital marketing trends and strategies',
          type: 'blog',
          platform: 'Website',
          status: 'published',
          scheduledDate: '2024-03-15T10:00:00',
          publishedDate: '2024-03-15T10:00:00',
          author: 'Sarah Wilson',
          performance: {
            views: 12500,
            engagement: 8.5,
            shares: 245,
            conversions: 48
          },
          tags: ['Digital Marketing', 'SEO', 'Content Strategy']
        },
        {
          id: '2',
          title: 'Product Launch Announcement',
          description: 'Social media campaign for new product launch across multiple platforms',
          type: 'social',
          platform: 'Instagram, Facebook, LinkedIn',
          status: 'scheduled',
          scheduledDate: '2024-04-01T14:00:00',
          author: 'Mike Johnson',
          tags: ['Product Launch', 'Social Media', 'Campaign']
        },
        {
          id: '3',
          title: 'Customer Success Story Video',
          description: 'Video testimonial featuring successful client implementation',
          type: 'video',
          platform: 'YouTube',
          status: 'review',
          scheduledDate: '2024-04-05T12:00:00',
          author: 'Tom Brown',
          tags: ['Video', 'Testimonial', 'Case Study']
        },
        {
          id: '4',
          title: 'Monthly Newsletter - March Edition',
          description: 'Email newsletter with company updates, insights, and exclusive offers',
          type: 'email',
          platform: 'Email',
          status: 'published',
          scheduledDate: '2024-03-01T09:00:00',
          publishedDate: '2024-03-01T09:00:00',
          author: 'Lisa Park',
          performance: {
            views: 5800,
            engagement: 24.3,
            shares: 89,
            conversions: 156
          },
          tags: ['Newsletter', 'Email Marketing', 'Updates']
        },
        {
          id: '5',
          title: 'Industry Insights Infographic',
          description: 'Visual representation of market trends and statistics',
          type: 'infographic',
          platform: 'Pinterest, Instagram',
          status: 'scheduled',
          scheduledDate: '2024-04-10T11:00:00',
          author: 'Alex Chen',
          tags: ['Infographic', 'Data Visualization', 'Insights']
        },
        {
          id: '6',
          title: 'Expert Interview Podcast Episode',
          description: 'Interview with industry expert on emerging technologies',
          type: 'podcast',
          platform: 'Spotify, Apple Podcasts',
          status: 'draft',
          scheduledDate: '2024-04-15T16:00:00',
          author: 'John Doe',
          tags: ['Podcast', 'Interview', 'Technology']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const publishedContent = contentItems.filter(item => item.status === 'published');
  const scheduledContent = contentItems.filter(item => item.status === 'scheduled');
  const totalEngagement = publishedContent.reduce((sum, item) => 
    sum + (item.performance?.engagement || 0), 0) / publishedContent.length || 0;
  const totalViews = publishedContent.reduce((sum, item) => 
    sum + (item.performance?.views || 0), 0);

  const navigationItems = [
    {
      label: 'Overview',
      href: `/client/${clientId}`,
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      label: 'Projects',
      href: `/client/${clientId}/projects`,
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      label: 'Content',
      href: `/client/${clientId}/content`,
      icon: <Calendar className="w-5 h-5" />,
      active: true
    },
    {
      label: 'Reports',
      href: `/client/${clientId}/reports`,
      icon: <PieChart className="w-5 h-5" />
    },
    {
      label: 'Support',
      href: `/client/${clientId}/support`,
      icon: <MessageSquare className="w-5 h-5" />
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fm-magenta-50 via-orange-50/30 to-fm-magenta-50 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading content calendar...</p>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout
      variant="client"
      navigation={navigationItems}
      user={{
        name: 'Client Name',
        email: 'client@example.com',
        role: 'Industry'
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fm-magenta-600 to-fm-orange-600 bg-clip-text text-transparent">
              Content Calendar
            </h1>
            <p className="text-gray-600 mt-1 font-medium">Manage and track your content publishing schedule</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-fm-magenta-600">
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
          change={{
            value: 12,
            type: 'increase',
            period: 'vs last month'
          }}
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
          change={{
            value: 2.3,
            type: 'increase',
            period: 'vs last month'
          }}
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
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <Card key={item.id} variant="client" hover glow className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fm-magenta-100 to-fm-orange-100 flex items-center justify-center text-fm-magenta-600">
                    {getTypeIcon(item.type)}
                  </div>
                  <Badge className={getStatusColor(item.status)} variant="secondary">
                    {item.status}
                  </Badge>
                </div>
                <div className="text-gray-400">
                  {getPlatformIcon(item.platform)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
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
                <div className="pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Views</div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm font-medium">
                          {new Intl.NumberFormat('en-US', {
                            notation: 'compact'
                          }).format(item.performance.views)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Engagement</div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm font-medium">{item.performance.engagement}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Shares</div>
                      <div className="flex items-center">
                        <Share2 className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm font-medium">{item.performance.shares}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Conversions</div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm font-medium">{item.performance.conversions}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-2">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
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
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "No content items scheduled yet"
              : `No ${filter} content at the moment`}
          </p>
        </Card>
      )}
    </DashboardLayout>
  );
}
/**
 * Analytics Dashboard Component
 * Comprehensive performance analytics and reporting for clients
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  Heart,
  Share2,
  DollarSign,
  Target,
  Activity,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  Smartphone,
  Mail,
  Search,
  ShoppingCart,
  Clock,
  Star
} from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';
import { 
  ClientAnalytics, 
  MetricData, 
  CustomMetric,
  ClientProfile,
  Campaign,
  ClientUtils 
} from '@/lib/admin/client-types';
import { ClientService } from '@/lib/admin/client-service';

interface AnalyticsDashboardProps {
  clientId?: string; // If provided, show analytics for specific client
  campaigns?: Campaign[]; // Optional campaign filter
}

export function AnalyticsDashboard({ clientId, campaigns }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<ClientAnalytics | null>(null);
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<'overview' | 'social' | 'ads' | 'website' | 'custom'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalytics();
  }, [clientId, period]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    
    if (clientId) {
      const clientData = ClientService.getClientById(clientId);
      setClient(clientData);
      
      const analyticsData = ClientService.getClientAnalytics(clientId, period);
      setAnalytics(analyticsData);
    }
    
    setIsLoading(false);
    setLastUpdated(new Date());
  };

  const refreshData = () => {
    loadAnalytics();
  };

  const getMetricColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-fm-neutral-600';
    }
  };

  const getMetricIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4" />;
      case 'down': return <ArrowDownRight className="h-4 w-4" />;
      case 'stable': return <div className="h-4 w-4 border-t-2 border-fm-neutral-400"></div>;
    }
  };

  const formatChange = (metric: MetricData) => {
    const sign = metric.changePercent >= 0 ? '+' : '';
    return `${sign}${metric.changePercent.toFixed(1)}%`;
  };

  const formatMetricValue = (value: number, unit: string) => {
    if (unit === '₹' || unit === 'INR') {
      return ClientUtils.formatCurrency(value);
    }
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    if (unit === 'x') {
      return `${value.toFixed(1)}x`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const MetricCard = ({ 
    title, 
    metric, 
    icon: Icon, 
    color = 'blue' 
  }: { 
    title: string; 
    metric: MetricData; 
    icon: any; 
    color?: string;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-700',
      green: 'bg-green-50 text-green-700',
      purple: 'bg-purple-50 text-purple-700',
      orange: 'bg-orange-50 text-orange-700',
      red: 'bg-red-50 text-red-700'
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-fm-neutral-600">{title}</p>
              <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-fm-neutral-900">
                  {formatMetricValue(metric.current, metric.unit)}
                </p>
                <div className={`flex items-center space-x-1 text-sm ${getMetricColor(metric.trend)}`}>
                  {getMetricIcon(metric.trend)}
                  <span>{formatChange(metric)}</span>
                  <span className="text-fm-neutral-500">vs last {period}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-fm-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-fm-neutral-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-fm-neutral-200 rounded-xl mt-6"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-12 text-center">
        <BarChart3 className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">No analytics data</h3>
        <p className="text-fm-neutral-600 mb-6">
          Analytics data will appear here once campaigns are active and data is collected.
        </p>
        <Button onClick={refreshData} icon={<RefreshCw className="h-4 w-4" />}>
          Refresh Data
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">
              {client ? `${client.name} Analytics` : 'Performance Analytics'}
            </h2>
            <p className="text-fm-neutral-600 mt-1">
              Comprehensive performance metrics and insights
            </p>
            <p className="text-sm text-fm-neutral-500 mt-2">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1 mt-6 bg-fm-neutral-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'social', name: 'Social Media', icon: Heart },
            { id: 'ads', name: 'Paid Ads', icon: Target },
            { id: 'website', name: 'Website', icon: Globe },
            { id: 'custom', name: 'Custom', icon: Star }
          ].map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-white text-fm-magenta-700 shadow-sm'
                    : 'text-fm-neutral-600 hover:text-fm-neutral-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedCategory === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Social Media Followers"
              metric={analytics.socialMedia.followers}
              icon={Users}
              color="blue"
            />
            <MetricCard
              title="Website Traffic"
              metric={analytics.website.traffic}
              icon={Globe}
              color="green"
            />
            <MetricCard
              title="Ad Spend ROAS"
              metric={analytics.paidAds.roas}
              icon={DollarSign}
              color="purple"
            />
            <MetricCard
              title="Total Conversions"
              metric={analytics.website.conversions}
              icon={Target}
              color="orange"
            />
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">
                Social Media Performance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-fm-neutral-900">Followers Growth</p>
                      <p className="text-sm text-fm-neutral-600">Total social media followers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-fm-neutral-900">
                      {formatMetricValue(analytics.socialMedia.followers.current, analytics.socialMedia.followers.unit)}
                    </p>
                    <p className={`text-sm ${getMetricColor(analytics.socialMedia.followers.trend)}`}>
                      {formatChange(analytics.socialMedia.followers)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <Heart className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-fm-neutral-900">Engagement Rate</p>
                      <p className="text-sm text-fm-neutral-600">Average engagement across platforms</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-fm-neutral-900">
                      {formatMetricValue(analytics.socialMedia.engagement.current, analytics.socialMedia.engagement.unit)}
                    </p>
                    <p className={`text-sm ${getMetricColor(analytics.socialMedia.engagement.trend)}`}>
                      {formatChange(analytics.socialMedia.engagement)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Eye className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-fm-neutral-900">Reach</p>
                      <p className="text-sm text-fm-neutral-600">People reached across platforms</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-fm-neutral-900">
                      {formatMetricValue(analytics.socialMedia.reach.current, analytics.socialMedia.reach.unit)}
                    </p>
                    <p className={`text-sm ${getMetricColor(analytics.socialMedia.reach.trend)}`}>
                      {formatChange(analytics.socialMedia.reach)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">
                Website & Conversion Performance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Globe className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-fm-neutral-900">Website Sessions</p>
                      <p className="text-sm text-fm-neutral-600">Total website traffic</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-fm-neutral-900">
                      {formatMetricValue(analytics.website.traffic.current, analytics.website.traffic.unit)}
                    </p>
                    <p className={`text-sm ${getMetricColor(analytics.website.traffic.trend)}`}>
                      {formatChange(analytics.website.traffic)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <MousePointer className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-fm-neutral-900">Lead Generation</p>
                      <p className="text-sm text-fm-neutral-600">New leads generated</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-fm-neutral-900">
                      {formatMetricValue(analytics.website.leads.current, analytics.website.leads.unit)}
                    </p>
                    <p className={`text-sm ${getMetricColor(analytics.website.leads.trend)}`}>
                      {formatChange(analytics.website.leads)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Target className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-fm-neutral-900">Conversions</p>
                      <p className="text-sm text-fm-neutral-600">Goal completions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-fm-neutral-900">
                      {formatMetricValue(analytics.website.conversions.current, analytics.website.conversions.unit)}
                    </p>
                    <p className={`text-sm ${getMetricColor(analytics.website.conversions.trend)}`}>
                      {formatChange(analytics.website.conversions)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Tab */}
      {selectedCategory === 'social' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Followers"
            metric={analytics.socialMedia.followers}
            icon={Users}
            color="blue"
          />
          <MetricCard
            title="Engagement Rate"
            metric={analytics.socialMedia.engagement}
            icon={Heart}
            color="red"
          />
          <MetricCard
            title="Reach"
            metric={analytics.socialMedia.reach}
            icon={Eye}
            color="purple"
          />
          <MetricCard
            title="Impressions"
            metric={analytics.socialMedia.impressions}
            icon={Activity}
            color="green"
          />
        </div>
      )}

      {/* Paid Ads Tab */}
      {selectedCategory === 'ads' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Total Spend"
              metric={analytics.paidAds.spend}
              icon={DollarSign}
              color="red"
            />
            <MetricCard
              title="ROAS"
              metric={analytics.paidAds.roas}
              icon={TrendingUp}
              color="green"
            />
            <MetricCard
              title="Impressions"
              metric={analytics.paidAds.impressions}
              icon={Eye}
              color="blue"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Clicks"
              metric={analytics.paidAds.clicks}
              icon={MousePointer}
              color="orange"
            />
            <MetricCard
              title="Click-Through Rate"
              metric={analytics.paidAds.ctr}
              icon={Target}
              color="purple"
            />
          </div>
        </div>
      )}

      {/* Website Tab */}
      {selectedCategory === 'website' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Traffic"
              metric={analytics.website.traffic}
              icon={Globe}
              color="green"
            />
            <MetricCard
              title="Bounce Rate"
              metric={analytics.website.bounceRate}
              icon={ArrowDownRight}
              color="red"
            />
            <MetricCard
              title="Session Duration"
              metric={analytics.website.sessionDuration}
              icon={Clock}
              color="blue"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Leads Generated"
              metric={analytics.website.leads}
              icon={Users}
              color="orange"
            />
            <MetricCard
              title="Conversions"
              metric={analytics.website.conversions}
              icon={Target}
              color="purple"
            />
          </div>
        </div>
      )}

      {/* Custom Metrics Tab */}
      {selectedCategory === 'custom' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.customMetrics.map((metric) => (
              <div key={metric.id} className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-fm-neutral-900 mb-1">{metric.name}</h3>
                    <p className="text-sm text-fm-neutral-600 mb-3">{metric.description}</p>
                    <p className="text-2xl font-bold text-fm-neutral-900">
                      {formatMetricValue(metric.value, metric.unit)}
                    </p>
                  </div>
                  <div className="p-3 bg-fm-magenta-50 rounded-lg">
                    <Star className="h-6 w-6 text-fm-magenta-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {analytics.customMetrics.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-12 text-center">
              <Star className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">No custom metrics</h3>
              <p className="text-fm-neutral-600 mb-6">
                Create custom metrics to track specific KPIs important to this client
              </p>
              <Button>Add Custom Metric</Button>
            </div>
          )}
        </div>
      )}

      {/* Insights & Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-fm-magenta-50 rounded-lg">
            <Zap className="h-5 w-5 text-fm-magenta-700" />
          </div>
          <h3 className="text-lg font-semibold text-fm-neutral-900">AI Insights & Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">🎯 Strong Performance</h4>
            <p className="text-green-800 text-sm">
              Social media engagement is up {analytics.socialMedia.engagement.changePercent.toFixed(1)}% compared to last {period}. 
              The current strategy is resonating well with the audience.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">⚡ Optimization Opportunity</h4>
            <p className="text-yellow-800 text-sm">
              Website bounce rate at {analytics.website.bounceRate.current}% suggests room for landing page optimization. 
              Consider A/B testing page layouts and content.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📈 Growth Trend</h4>
            <p className="text-blue-800 text-sm">
              Paid ads ROAS of {analytics.paidAds.roas.current}x is performing well. 
              Consider increasing budget allocation to high-performing campaigns.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">🚀 Next Steps</h4>
            <p className="text-purple-800 text-sm">
              Lead generation is trending upward. Implement lead nurturing campaigns to maximize conversion rates 
              and improve customer lifetime value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
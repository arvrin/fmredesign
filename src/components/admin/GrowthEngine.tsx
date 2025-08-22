/**
 * Growth & Opportunities Engine Component
 * AI-powered growth insights and opportunity identification
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp,
  Target,
  DollarSign,
  Users,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Zap,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Filter,
  Download,
  Share2,
  RefreshCw,
  Gauge,
  PieChart,
  LineChart,
  Activity,
  Briefcase,
  Heart,
  MessageCircle,
  Eye,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/design-system/components/atoms/Button/Button';
import { ClientProfile } from '@/lib/admin/client-types';
import { ClientService } from '@/lib/admin/client-service';

interface GrowthEngineProps {
  clientId?: string;
}

interface GrowthOpportunity {
  id: string;
  title: string;
  description: string;
  category: 'upsell' | 'cross-sell' | 'retention' | 'expansion' | 'optimization';
  priority: 'high' | 'medium' | 'low';
  potentialValue: number;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  confidence: number; // 0-100
  status: 'identified' | 'in_progress' | 'completed' | 'dismissed';
  createdAt: string;
  dueDate?: string;
  tags: string[];
}

interface GrowthMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  target?: number;
  unit: string;
  period: string;
  trend: number[]; // historical data for sparkline
}

interface GrowthInsight {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
  timestamp: string;
}

export function GrowthEngine({ clientId }: GrowthEngineProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [opportunities, setOpportunities] = useState<GrowthOpportunity[]>([]);
  const [metrics, setMetrics] = useState<GrowthMetric[]>([]);
  const [insights, setInsights] = useState<GrowthInsight[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    loadData();
  }, [clientId, selectedTimeframe]);

  const loadData = () => {
    // Load client data
    if (clientId) {
      const clientData = ClientService.getClientById(clientId);
      setClient(clientData);
    }

    // Load sample growth opportunities
    const sampleOpportunities: GrowthOpportunity[] = [
      {
        id: 'opp-001',
        title: 'Social Media Management Upgrade',
        description: 'Client currently on basic plan. High engagement rates suggest readiness for premium social media package with video content and stories.',
        category: 'upsell',
        priority: 'high',
        potentialValue: 15000,
        effort: 'medium',
        timeline: '2-3 weeks',
        confidence: 85,
        status: 'identified',
        createdAt: '2024-08-20T10:00:00Z',
        dueDate: '2024-09-15T00:00:00Z',
        tags: ['social-media', 'video-content', 'high-engagement']
      },
      {
        id: 'opp-002',
        title: 'Email Marketing Automation',
        description: 'Customer database analysis shows 40% engagement rate. Perfect candidate for automated drip campaigns to boost conversions.',
        category: 'cross-sell',
        priority: 'medium',
        potentialValue: 8000,
        effort: 'low',
        timeline: '1-2 weeks',
        confidence: 75,
        status: 'in_progress',
        createdAt: '2024-08-18T14:30:00Z',
        tags: ['email-marketing', 'automation', 'conversions']
      },
      {
        id: 'opp-003',
        title: 'Brand Identity Refresh',
        description: 'Market research indicates brand perception gaps. Comprehensive rebrand could increase market share by 25%.',
        category: 'expansion',
        priority: 'high',
        potentialValue: 35000,
        effort: 'high',
        timeline: '2-3 months',
        confidence: 90,
        status: 'identified',
        createdAt: '2024-08-15T09:15:00Z',
        tags: ['branding', 'market-research', 'competitive-advantage']
      },
      {
        id: 'opp-004',
        title: 'Content Performance Optimization',
        description: 'Analytics show declining engagement on recent posts. Content strategy review and optimization could boost performance by 40%.',
        category: 'optimization',
        priority: 'medium',
        potentialValue: 5000,
        effort: 'low',
        timeline: '1 week',
        confidence: 70,
        status: 'identified',
        createdAt: '2024-08-22T11:45:00Z',
        tags: ['content-strategy', 'analytics', 'engagement']
      }
    ];

    // Load sample growth metrics
    const sampleMetrics: GrowthMetric[] = [
      {
        id: 'metric-001',
        name: 'Account Value',
        value: 45000,
        change: 12.5,
        changeType: 'increase',
        target: 50000,
        unit: '₹',
        period: 'This Month',
        trend: [35000, 37000, 39000, 42000, 45000]
      },
      {
        id: 'metric-002',
        name: 'Service Utilization',
        value: 75,
        change: 8.3,
        changeType: 'increase',
        target: 85,
        unit: '%',
        period: 'Current Quarter',
        trend: [65, 68, 70, 73, 75]
      },
      {
        id: 'metric-003',
        name: 'Client Satisfaction',
        value: 4.6,
        change: 0.2,
        changeType: 'increase',
        target: 4.8,
        unit: '/5',
        period: 'Last 3 Months',
        trend: [4.2, 4.3, 4.4, 4.5, 4.6]
      },
      {
        id: 'metric-004',
        name: 'Engagement Rate',
        value: 8.5,
        change: -2.1,
        changeType: 'decrease',
        target: 10,
        unit: '%',
        period: 'Last 30 Days',
        trend: [10.2, 9.8, 9.1, 8.8, 8.5]
      }
    ];

    // Load sample growth insights
    const sampleInsights: GrowthInsight[] = [
      {
        id: 'insight-001',
        type: 'positive',
        title: 'Social Media Engagement Surge',
        description: 'Instagram engagement increased by 45% this month, indicating strong content resonance.',
        impact: 'high',
        category: 'Social Media',
        actionable: true,
        timestamp: '2024-08-22T08:00:00Z'
      },
      {
        id: 'insight-002',
        type: 'warning',
        title: 'Content Frequency Drop',
        description: 'Blog posting frequency decreased by 30%. This may impact SEO rankings and lead generation.',
        impact: 'medium',
        category: 'Content Marketing',
        actionable: true,
        timestamp: '2024-08-21T15:30:00Z'
      },
      {
        id: 'insight-003',
        type: 'neutral',
        title: 'Seasonal Campaign Opportunity',
        description: 'Historical data suggests 25% increase in conversions during festive season. Consider campaign planning.',
        impact: 'medium',
        category: 'Campaign Strategy',
        actionable: true,
        timestamp: '2024-08-20T12:15:00Z'
      },
      {
        id: 'insight-004',
        type: 'negative',
        title: 'Email Open Rate Decline',
        description: 'Email open rates dropped by 15% compared to last quarter. List hygiene and subject line optimization needed.',
        impact: 'medium',
        category: 'Email Marketing',
        actionable: true,
        timestamp: '2024-08-19T10:45:00Z'
      }
    ];

    setOpportunities(sampleOpportunities);
    setMetrics(sampleMetrics);
    setInsights(sampleInsights);
  };

  const generateNewInsights = async () => {
    setIsGeneratingInsights(true);
    
    // Simulate AI insight generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newInsight: GrowthInsight = {
      id: `insight-${Date.now()}`,
      type: 'positive',
      title: 'Cross-platform Content Strategy Opportunity',
      description: 'AI analysis suggests repurposing top-performing LinkedIn content for Instagram could increase reach by 35%.',
      impact: 'high',
      category: 'Content Strategy',
      actionable: true,
      timestamp: new Date().toISOString()
    };
    
    setInsights(prev => [newInsight, ...prev]);
    setIsGeneratingInsights(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'upsell': return <TrendingUp className="h-4 w-4" />;
      case 'cross-sell': return <Target className="h-4 w-4" />;
      case 'retention': return <Heart className="h-4 w-4" />;
      case 'expansion': return <Zap className="h-4 w-4" />;
      case 'optimization': return <Gauge className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'negative': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return <Lightbulb className="h-5 w-5 text-blue-600" />;
    }
  };

  const filteredOpportunities = opportunities.filter(opp => 
    selectedCategory === 'all' || opp.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">Growth & Opportunities Engine</h2>
            <p className="text-fm-neutral-600 mt-1">
              {client ? `AI-powered growth insights for ${client.name}` : 'Intelligent business growth recommendations'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={generateNewInsights}
              disabled={isGeneratingInsights}
            >
              {isGeneratingInsights ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {isGeneratingInsights ? 'Generating...' : 'Generate Insights'}
            </Button>
            
            <Button size="sm" icon={<Download className="h-4 w-4" />}>
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Growth Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-fm-neutral-900">{metric.name}</h3>
              <Activity className="h-5 w-5 text-fm-neutral-400" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-fm-neutral-900">
                  {metric.unit === '₹' ? `₹${metric.value.toLocaleString()}` : 
                   metric.unit === '%' ? `${metric.value}%` : 
                   `${metric.value}${metric.unit}`}
                </span>
                {metric.target && (
                  <span className="text-sm text-fm-neutral-500">
                    / {metric.unit === '₹' ? `₹${metric.target.toLocaleString()}` : 
                        metric.unit === '%' ? `${metric.target}%` : 
                        `${metric.target}${metric.unit}`}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {metric.changeType === 'increase' ? (
                  <ArrowUp className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-sm text-fm-neutral-500">{metric.period}</span>
              </div>
              
              {/* Simple trend indicator */}
              <div className="flex items-center space-x-1 mt-2">
                {metric.trend.map((value, index) => (
                  <div
                    key={index}
                    className="h-2 w-2 bg-fm-magenta-200 rounded"
                    style={{
                      opacity: 0.3 + (value / Math.max(...metric.trend)) * 0.7
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Opportunities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-fm-neutral-900">Growth Opportunities</h3>
            
            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-sm border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="upsell">Upsell</option>
                <option value="cross-sell">Cross-sell</option>
                <option value="retention">Retention</option>
                <option value="expansion">Expansion</option>
                <option value="optimization">Optimization</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="border border-fm-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-fm-magenta-50 rounded-lg">
                        {getCategoryIcon(opportunity.category)}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-fm-neutral-900">{opportunity.title}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(opportunity.priority)}`}>
                            {opportunity.priority} priority
                          </span>
                          <span className="text-sm text-fm-neutral-500">
                            ₹{opportunity.potentialValue.toLocaleString()} potential
                          </span>
                          <span className="text-sm text-fm-neutral-500">
                            {opportunity.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-fm-neutral-600 text-sm mb-3">
                      {opportunity.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-fm-neutral-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{opportunity.timeline}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Gauge className="h-4 w-4" />
                          <span>{opportunity.effort} effort</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {opportunity.status === 'in_progress' && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            In Progress
                          </span>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                    
                    {opportunity.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {opportunity.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-fm-neutral-100 text-fm-neutral-600 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredOpportunities.length === 0 && (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
              <h4 className="font-semibold text-fm-neutral-900 mb-2">No opportunities found</h4>
              <p className="text-fm-neutral-600">
                Try adjusting your category filter or generate new insights.
              </p>
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-6">AI Insights</h3>
          
          <div className="space-y-4">
            {insights.slice(0, 5).map((insight) => (
              <div
                key={insight.id}
                className="border border-fm-neutral-200 rounded-lg p-4"
              >
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-fm-neutral-900 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-fm-neutral-600 mb-2">
                      {insight.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-fm-neutral-100 text-fm-neutral-700 text-xs rounded">
                          {insight.category}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                          insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {insight.impact} impact
                        </span>
                      </div>
                      
                      {insight.actionable && (
                        <Button size="sm" variant="outline">
                          Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={generateNewInsights}
            disabled={isGeneratingInsights}
          >
            {isGeneratingInsights ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Lightbulb className="h-4 w-4 mr-2" />
            )}
            {isGeneratingInsights ? 'Analyzing...' : 'Generate More Insights'}
          </Button>
        </div>
      </div>

      {/* Growth Action Plan */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-fm-neutral-900">Recommended Action Plan</h3>
          <Button size="sm" icon={<Share2 className="h-4 w-4" />}>
            Share Plan
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-fm-neutral-900 flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span>Immediate Wins (1-2 weeks)</span>
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-medium text-green-900">Content Optimization</h5>
                <p className="text-sm text-green-700 mt-1">
                  Optimize underperforming posts based on analytics data
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-green-600">₹5,000 potential</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-fm-neutral-900 flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Medium-term Goals (1-2 months)</span>
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-900">Email Automation</h5>
                <p className="text-sm text-blue-700 mt-1">
                  Implement automated drip campaigns for lead nurturing
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-blue-600">₹8,000 potential</span>
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-fm-neutral-900 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <span>Long-term Strategy (3+ months)</span>
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h5 className="font-medium text-purple-900">Brand Refresh</h5>
                <p className="text-sm text-purple-700 mt-1">
                  Comprehensive brand identity and market positioning update
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-purple-600">₹35,000 potential</span>
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
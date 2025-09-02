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
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Target,
  DollarSign,
  Calendar,
  Download,
  FileText,
  Filter,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Briefcase,
  MessageSquare,
  Globe,
  Zap,
  Award
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  period: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  generatedDate: string;
  metrics: {
    name: string;
    value: number | string;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  }[];
}

interface PerformanceData {
  month: string;
  traffic: number;
  leads: number;
  conversions: number;
  revenue: number;
}

export default function ClientReportsPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  
  const [reports, setReports] = useState<Report[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  useEffect(() => {
    // Simulate fetching reports data
    setTimeout(() => {
      setReports([
        {
          id: '1',
          title: 'March 2024 Performance Report',
          period: 'March 2024',
          type: 'monthly',
          generatedDate: '2024-04-01',
          metrics: [
            { name: 'Website Traffic', value: 45678, change: 12.5, trend: 'up' },
            { name: 'Lead Generation', value: 892, change: 8.3, trend: 'up' },
            { name: 'Conversion Rate', value: '3.2%', change: -0.5, trend: 'down' },
            { name: 'Revenue Generated', value: 285000, change: 15.7, trend: 'up' }
          ]
        },
        {
          id: '2',
          title: 'Q1 2024 Quarterly Review',
          period: 'Q1 2024',
          type: 'quarterly',
          generatedDate: '2024-04-05',
          metrics: [
            { name: 'Total Reach', value: 1250000, change: 22.4, trend: 'up' },
            { name: 'Engagement Rate', value: '5.8%', change: 1.2, trend: 'up' },
            { name: 'ROI', value: '245%', change: 18.0, trend: 'up' },
            { name: 'Customer Acquisition', value: 428, change: 25.3, trend: 'up' }
          ]
        }
      ]);

      setPerformanceData([
        { month: 'Jan', traffic: 38500, leads: 720, conversions: 28, revenue: 225000 },
        { month: 'Feb', traffic: 41200, leads: 810, conversions: 35, revenue: 248000 },
        { month: 'Mar', traffic: 45678, leads: 892, conversions: 42, revenue: 285000 },
        { month: 'Apr', traffic: 48900, leads: 920, conversions: 38, revenue: 295000 },
        { month: 'May', traffic: 52300, leads: 980, conversions: 45, revenue: 318000 },
        { month: 'Jun', traffic: 55600, leads: 1050, conversions: 52, revenue: 342000 }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

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
      icon: <Calendar className="w-5 h-5" />
    },
    {
      label: 'Reports',
      href: `/client/${clientId}/reports`,
      icon: <PieChart className="w-5 h-5" />,
      active: true
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
          <p className="mt-4 text-gray-600 font-medium">Loading reports...</p>
        </Card>
      </div>
    );
  }

  // Calculate summary metrics
  const currentMonthData = performanceData[performanceData.length - 1];
  const previousMonthData = performanceData[performanceData.length - 2];
  
  const trafficGrowth = ((currentMonthData.traffic - previousMonthData.traffic) / previousMonthData.traffic) * 100;
  const leadsGrowth = ((currentMonthData.leads - previousMonthData.leads) / previousMonthData.leads) * 100;
  const revenueGrowth = ((currentMonthData.revenue - previousMonthData.revenue) / previousMonthData.revenue) * 100;

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
              Performance Reports
            </h1>
            <p className="text-gray-600 mt-1 font-medium">Track your marketing performance and ROI</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="client" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Website Traffic"
          value={currentMonthData.traffic}
          subtitle="This month"
          icon={<Users className="w-6 h-6" />}
          variant="client"
          change={{
            value: Math.abs(trafficGrowth),
            type: trafficGrowth > 0 ? 'increase' : 'decrease',
            period: 'vs last month'
          }}
          formatter={(val) => new Intl.NumberFormat('en-US').format(Number(val))}
        />
        
        <MetricCard
          title="Leads Generated"
          value={currentMonthData.leads}
          subtitle="Quality leads"
          icon={<Target className="w-6 h-6" />}
          variant="client"
          change={{
            value: Math.abs(leadsGrowth),
            type: leadsGrowth > 0 ? 'increase' : 'decrease',
            period: 'vs last month'
          }}
        />
        
        <MetricCard
          title="Conversion Rate"
          value={`${((currentMonthData.conversions / currentMonthData.leads) * 100).toFixed(1)}%`}
          subtitle="Lead to customer"
          icon={<TrendingUp className="w-6 h-6" />}
          variant="client"
        />
        
        <MetricCard
          title="Revenue Impact"
          value={currentMonthData.revenue}
          subtitle="Generated this month"
          icon={<DollarSign className="w-6 h-6" />}
          variant="client"
          change={{
            value: Math.abs(revenueGrowth),
            type: revenueGrowth > 0 ? 'increase' : 'decrease',
            period: 'vs last month'
          }}
          formatter={(val) => new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            notation: 'compact'
          }).format(Number(val))}
        />
      </div>

      {/* Performance Chart */}
      <Card variant="client" className="mb-8" hover glow>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Performance Overview</CardTitle>
              <CardDescription>Key metrics trend over the last 6 months</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedPeriod === 'monthly' ? 'client' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod('monthly')}
              >
                Monthly
              </Button>
              <Button
                variant={selectedPeriod === 'quarterly' ? 'client' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod('quarterly')}
              >
                Quarterly
              </Button>
              <Button
                variant={selectedPeriod === 'annual' ? 'client' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod('annual')}
              >
                Annual
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Simplified Chart Visualization */}
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-fm-magenta-500 mr-2"></div>
                  <span>Traffic</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-fm-orange-500 mr-2"></div>
                  <span>Leads</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Revenue</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-4">
              {performanceData.map((data, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-xs text-gray-500 text-center">{data.month}</div>
                  <div className="relative h-32 flex items-end justify-center space-x-1">
                    <div 
                      className="w-3 bg-gradient-to-t from-fm-magenta-500 to-fm-magenta-300 rounded-t"
                      style={{ height: `${(data.traffic / 60000) * 100}%` }}
                      title={`Traffic: ${data.traffic.toLocaleString()}`}
                    ></div>
                    <div 
                      className="w-3 bg-gradient-to-t from-fm-orange-500 to-fm-orange-300 rounded-t"
                      style={{ height: `${(data.leads / 1200) * 100}%` }}
                      title={`Leads: ${data.leads}`}
                    ></div>
                    <div 
                      className="w-3 bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                      style={{ height: `${(data.revenue / 400000) * 100}%` }}
                      title={`Revenue: ₹${(data.revenue / 1000).toFixed(0)}K`}
                    ></div>
                  </div>
                  <div className="text-xs text-center text-gray-600 font-medium">
                    ₹{(data.revenue / 1000).toFixed(0)}K
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Reports</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} variant="client" hover>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="text-sm">{report.period}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {report.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {report.metrics.map((metric, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-xs text-gray-500">{metric.name}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">
                            {typeof metric.value === 'number' 
                              ? metric.name.includes('Revenue') 
                                ? new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    notation: 'compact'
                                  }).format(metric.value)
                                : metric.value.toLocaleString()
                              : metric.value}
                          </span>
                          <div className={`flex items-center text-xs ${
                            metric.trend === 'up' ? 'text-green-600' : 
                            metric.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {metric.trend === 'up' ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : metric.trend === 'down' ? (
                              <ArrowDownRight className="w-3 h-3" />
                            ) : null}
                            {Math.abs(metric.change)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Generated {new Date(report.generatedDate).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" className="text-fm-magenta-600">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
          <Card variant="client" hover glow>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Strong Traffic Growth</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Website traffic has increased by 22% over the last quarter, exceeding targets.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Improved Engagement</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Content engagement rates have improved by 15%, indicating better audience resonance.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Conversion Opportunity</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Consider A/B testing landing pages to improve conversion rate from current 3.2% to target 4%.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">ROI Achievement</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Current ROI stands at 245%, surpassing the quarterly target of 200%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="glass" className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start text-fm-magenta-600">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Performance Review
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-fm-magenta-600">
                <FileText className="w-4 h-4 mr-2" />
                Request Custom Report
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-fm-magenta-600">
                <Activity className="w-4 h-4 mr-2" />
                View Real-time Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
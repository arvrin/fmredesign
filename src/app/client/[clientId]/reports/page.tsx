'use client';

import { useState, useEffect } from 'react';
import {
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
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Download,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Award,
  Calendar,
  Share2,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import { formatContractCurrency } from '@/lib/admin/contract-types';
import { downloadCSV } from '@/lib/client-portal/export';

interface Report {
  id: string;
  title: string;
  period: string;
  type: string;
  generatedDate: string;
  metrics: {
    name: string;
    value: number | string;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  }[];
}

interface MonthlyPerformance {
  month: string;
  published: number;
  total: number;
  views: number;
  engagement: number;
}

interface Insight {
  type: 'positive' | 'warning' | 'neutral';
  title: string;
  description: string;
}

interface ReportsSummary {
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalSpent: number;
  avgProgress: number;
  publishedContent: number;
  totalViews: number;
  avgEngagement: number;
  contentDelta: number;
  publishedThisMonth: number;
  publishedLastMonth: number;
}

export default function ClientReportsPage() {
  const { clientId, profile } = useClientPortal();

  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [monthlyPerformance, setMonthlyPerformance] = useState<MonthlyPerformance[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/client-portal/${clientId}/reports`);
        if (res.ok) {
          const json = await res.json();
          const d = json.data;
          setSummary(d.summary);
          setReports(d.reports || []);
          setMonthlyPerformance(d.monthlyPerformance || []);
          setInsights(d.insights || []);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const handleDownloadReport = () => {
    if (!summary || !monthlyPerformance.length) return;
    const headers = ['Month', 'Published', 'Total Content', 'Views', 'Engagement %'];
    const rows = monthlyPerformance.map((m) => [
      m.month,
      String(m.published),
      String(m.total),
      String(m.views),
      String(m.engagement),
    ]);
    downloadCSV('performance-report.csv', headers, rows);
  };

  const handleShareReport = async () => {
    try {
      setShareLoading(true);
      const res = await fetch(`/api/client-portal/${clientId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType: 'report',
          resourceId: clientId,
          label: 'Performance Report',
          expiresInDays: 30,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const fullUrl = `${window.location.origin}${json.data.url}`;
        setShareUrl(fullUrl);
      }
    } catch (err) {
      console.error('Error creating share link:', err);
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fm-magenta-600" />
      </div>
    );
  }

  const s = summary || {
    activeProjects: 0, completedProjects: 0, totalBudget: 0, totalSpent: 0,
    avgProgress: 0, publishedContent: 0, totalViews: 0, avgEngagement: 0,
    contentDelta: 0, publishedThisMonth: 0, publishedLastMonth: 0,
  };

  const insightIcons: Record<string, React.ReactNode> = {
    positive: <TrendingUp className="w-4 h-4 text-green-600" />,
    warning: <Zap className="w-4 h-4 text-yellow-600" />,
    neutral: <Activity className="w-4 h-4 text-fm-neutral-500" />,
  };
  const insightBg: Record<string, string> = {
    positive: 'bg-green-100',
    warning: 'bg-yellow-100',
    neutral: 'bg-fm-neutral-100',
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-display font-bold text-fm-neutral-900">
              Performance <span className="v2-accent">Reports</span>
            </h1>
            <p className="text-fm-neutral-600 mt-1 font-medium text-sm sm:text-base">Track your marketing performance and ROI</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="client" size="sm" onClick={handleDownloadReport}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Report</span>
              <span className="sm:hidden">Download</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-fm-magenta-600"
              onClick={handleShareReport}
              disabled={shareLoading}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{shareLoading ? 'Sharing...' : 'Share Report'}</span>
              <span className="sm:hidden">{shareLoading ? '...' : 'Share'}</span>
            </Button>
          </div>
        </div>

        {/* Share URL */}
        {shareUrl && (
          <div className="mt-4 p-4 bg-fm-neutral-50 border border-fm-neutral-200 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 text-sm bg-white border border-fm-neutral-300 rounded-md px-3 py-2 text-fm-neutral-700"
            />
            <div className="flex items-center gap-2">
              <Button variant="client" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShareUrl(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
        <MetricCard
          title="Active Projects"
          value={s.activeProjects}
          subtitle="Currently in progress"
          icon={<Target className="w-6 h-6" />}
          variant="client"
        />

        <MetricCard
          title="Published Content"
          value={s.publishedContent}
          subtitle="Total published"
          icon={<FileText className="w-6 h-6" />}
          variant="client"
          change={s.contentDelta !== 0 ? {
            value: Math.abs(s.contentDelta),
            type: s.contentDelta > 0 ? 'increase' : 'decrease',
            period: 'vs last month'
          } : undefined}
        />

        <MetricCard
          title="Total Views"
          value={s.totalViews}
          subtitle="Across all content"
          icon={<Users className="w-6 h-6" />}
          variant="client"
          formatter={(val) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(Number(val))}
        />

        <MetricCard
          title="Avg Engagement"
          value={`${s.avgEngagement}%`}
          subtitle="Engagement rate"
          icon={<TrendingUp className="w-6 h-6" />}
          variant="client"
        />
      </div>

      {/* Performance Chart */}
      <Card variant="client" className="mb-8" hover glow>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">Performance Overview</CardTitle>
              <CardDescription>Content metrics trend over the last 6 months</CardDescription>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-fm-neutral-600 mb-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-fm-magenta-500 mr-2"></div>
                  <span>Published</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-fm-magenta-300 mr-2"></div>
                  <span>Total</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Views</span>
                </div>
              </div>
            </div>

            {monthlyPerformance.length > 0 ? (
              <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
              <div className="grid grid-cols-6 gap-4 min-w-[400px]">
                {monthlyPerformance.map((data, idx) => {
                  const maxPublished = Math.max(...monthlyPerformance.map(m => m.published), 1);
                  const maxTotal = Math.max(...monthlyPerformance.map(m => m.total), 1);
                  const maxViews = Math.max(...monthlyPerformance.map(m => m.views), 1);
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="text-xs text-fm-neutral-500 text-center">{data.month}</div>
                      <div className="relative h-32 flex items-end justify-center space-x-1">
                        <div
                          className="w-3 bg-gradient-to-t from-fm-magenta-500 to-fm-magenta-300 rounded-t"
                          style={{ height: `${Math.max((data.published / maxPublished) * 100, 4)}%` }}
                          title={`Published: ${data.published}`}
                        ></div>
                        <div
                          className="w-3 bg-gradient-to-t from-fm-magenta-300 to-fm-magenta-100 rounded-t"
                          style={{ height: `${Math.max((data.total / maxTotal) * 100, 4)}%` }}
                          title={`Total: ${data.total}`}
                        ></div>
                        <div
                          className="w-3 bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                          style={{ height: `${Math.max((data.views / maxViews) * 100, 4)}%` }}
                          title={`Views: ${data.views}`}
                        ></div>
                      </div>
                      <div className="text-xs text-center text-fm-neutral-600 font-medium">
                        {data.published} pub
                      </div>
                    </div>
                  );
                })}
              </div>
              </div>
            ) : (
              <div className="text-center py-12 text-fm-neutral-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-fm-neutral-300" />
                <p>Performance data will appear as content is published</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-display font-semibold text-fm-neutral-900 mb-4">Recent Reports</h2>
          {reports.length > 0 ? (
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
                          <div className="text-xs text-fm-neutral-500">{metric.name}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-fm-neutral-900">
                              {typeof metric.value === 'number'
                                ? metric.name.includes('Budget')
                                  ? formatContractCurrency(metric.value, profile.contractDetails.currency)
                                  : metric.value.toLocaleString()
                                : metric.value}
                            </span>
                            {metric.change !== 0 && (
                              <div className={`flex items-center text-xs ${
                                metric.trend === 'up' ? 'text-green-600' :
                                metric.trend === 'down' ? 'text-red-600' : 'text-fm-neutral-500'
                              }`}>
                                {metric.trend === 'up' ? (
                                  <ArrowUpRight className="w-3 h-3" />
                                ) : metric.trend === 'down' ? (
                                  <ArrowDownRight className="w-3 h-3" />
                                ) : null}
                                {Math.abs(metric.change)}%
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-fm-neutral-100">
                      <span className="text-xs text-fm-neutral-500">
                        Generated {new Date(report.generatedDate).toLocaleDateString()}
                      </span>
                      <Button variant="ghost" size="sm" className="text-fm-magenta-600" onClick={handleDownloadReport}>
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="glass" className="p-8 text-center">
              <FileText className="w-12 h-12 text-fm-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">No reports yet</h3>
              <p className="text-fm-neutral-600">Reports will be generated as projects and content data accumulates</p>
            </Card>
          )}
        </div>

        {/* Insights & Recommendations */}
        <div>
          <h2 className="text-xl font-display font-semibold text-fm-neutral-900 mb-4">Key Insights</h2>
          <Card variant="client" hover glow>
            <CardContent className="space-y-4 p-6">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg ${insightBg[insight.type] || 'bg-fm-neutral-100'} flex items-center justify-center flex-shrink-0`}>
                    {insightIcons[insight.type] || <Activity className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-fm-neutral-900">{insight.title}</h3>
                    <p className="text-sm text-fm-neutral-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="glass" className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start text-fm-magenta-600">
                <Calendar className="w-4 h-4" />
                Schedule Performance Review
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-fm-magenta-600">
                <FileText className="w-4 h-4" />
                Request Custom Report
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-fm-magenta-600">
                <Activity className="w-4 h-4" />
                View Real-time Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

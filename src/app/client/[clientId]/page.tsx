'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MetricCard,
  DashboardCard as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  IconBox,
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  TrendingUp,
  FileText,
  MessageSquare,
  Shield,
  Target,
  Calendar,
  Activity,
  Award,
  Briefcase,
  Handshake,
  CreditCard,
  CheckCircle2,
  Timer,
  ChevronDown,
} from 'lucide-react';
import { AGENCY_SERVICES } from '@/lib/admin/types';
import { formatContractCurrency } from '@/lib/admin/contract-types';
import { useClientPortal } from '@/lib/client-portal/context';
import { getStatusColor, getHealthColor } from '@/lib/client-portal/status-colors';

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
}

interface ContentItem {
  id: string;
  title: string;
  status: string;
  type: string;
  platform: string;
  scheduledDate: string;
}

interface ActivityItem {
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

function formatPartnerDuration(isoDate: string): { text: string; exact: string } {
  const start = new Date(isoDate);
  const now = new Date();
  const totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  let text = '';
  if (years > 0) text += `${years} year${years > 1 ? 's' : ''}`;
  if (years > 0 && months > 0) text += ' ';
  if (months > 0) text += `${months} month${months > 1 ? 's' : ''}`;
  if (!text) text = 'Less than a month';

  const exact = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return { text, exact };
}

function getNextBillingDate(startDate: string, billingCycle: string): string | null {
  if (billingCycle === 'one-time') return null;
  const start = new Date(startDate);
  const now = new Date();
  const next = new Date(start);

  while (next <= now) {
    if (billingCycle === 'monthly') next.setMonth(next.getMonth() + 1);
    else if (billingCycle === 'quarterly') next.setMonth(next.getMonth() + 3);
    else if (billingCycle === 'yearly') next.setFullYear(next.getFullYear() + 1);
    else next.setMonth(next.getMonth() + 1);
  }

  return next.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getContractProgress(startDate: string, endDate?: string): number | null {
  if (!endDate) return null;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();
  if (end <= start) return 100;
  const progress = Math.round(((now - start) / (end - start)) * 100);
  return Math.max(0, Math.min(100, progress));
}

function getServiceName(serviceId: string): string {
  const service = AGENCY_SERVICES.find(s => s.id === serviceId);
  return service?.name || serviceId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function ClientDashboard() {
  const { profile, clientId, slug } = useClientPortal();

  const [projects, setProjects] = useState<Project[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [partnershipExpanded, setPartnershipExpanded] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    const fetchPageData = async () => {
      try {
        setPageLoading(true);

        const [projectsResponse, contentResponse, activityResponse] = await Promise.all([
          fetch(`/api/client-portal/${clientId}/projects`),
          fetch(`/api/client-portal/${clientId}/content`),
          fetch(`/api/client-portal/${clientId}/activity`),
        ]);

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.data || []);
        }

        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          setContentItems(contentData.data || []);
        }

        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setActivities(activityData.data || []);
        }
      } catch (err) {
        console.error('Error fetching page data:', err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchPageData();
  }, [clientId]);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fm-magenta-600" />
      </div>
    );
  }

  // Calculate metrics for the dashboard
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalProjects = projects.length;
  const thisMonthContent = contentItems.filter(c => {
    const itemDate = new Date(c.scheduledDate);
    const now = new Date();
    return itemDate.getMonth() === now.getMonth() &&
           itemDate.getFullYear() === now.getFullYear();
  }).length;

  const avgProgress = projects.length > 0 ?
    Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0;

  const hasContract = !!profile.contractDetails.startDate;
  const partnerDuration = hasContract
    ? formatPartnerDuration(profile.contractDetails.startDate!)
    : null;
  const nextBilling = hasContract
    ? getNextBillingDate(profile.contractDetails.startDate!, profile.contractDetails.billingCycle)
    : null;
  const contractProgress = hasContract
    ? getContractProgress(profile.contractDetails.startDate!, profile.contractDetails.endDate)
    : null;

  return (
    <>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {profile.logo && (
              <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-fm-magenta-100 shadow-lg">
                <img
                  src={profile.logo}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-display font-bold text-fm-neutral-900">
                Welcome back, <span className="v2-accent">{profile.name}</span>
              </h1>
              <p className="text-fm-neutral-600 mt-1 font-medium capitalize">
                {profile.industry} • Managed by {profile.accountManager}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={getStatusColor(profile.status)} variant="secondary">
              {profile.status}
            </Badge>
            <div className={`flex items-center px-3 py-1 rounded-full bg-white/80 border ${getHealthColor(profile.health)}`}>
              <Activity className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium capitalize">{profile.health}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          subtitle="Currently in progress"
          icon={<Briefcase className="w-6 h-6" />}
          change={{
            value: totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0,
            type: activeProjects > 0 ? 'increase' : 'neutral',
            period: 'of total'
          }}
          variant="client"
        />

        <MetricCard
          title="Content This Month"
          value={thisMonthContent}
          subtitle="Scheduled publications"
          icon={<Calendar className="w-6 h-6" />}
          variant="client"
        />

        <MetricCard
          title="Contract Value"
          value={hasContract ? profile.contractDetails.value : 'Pending'}
          subtitle={hasContract ? 'Total project investment' : 'Awaiting contract signature'}
          icon={<TrendingUp className="w-6 h-6" />}
          formatter={hasContract ? (val) => formatContractCurrency(Number(val), profile.contractDetails.currency) : undefined}
          variant="client"
        />

        <MetricCard
          title="Overall Progress"
          value={`${avgProgress}%`}
          subtitle="Across all projects"
          icon={<Target className="w-6 h-6" />}
          variant="client"
        />
      </div>

      {/* Partnership Details — Collapsible */}
      <Card variant="client" hover glow className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconBox>
                <Handshake className="w-5 h-5" />
              </IconBox>
              <div>
                <CardTitle className="text-xl">Partnership Details</CardTitle>
                <CardDescription className="mt-0.5">Your engagement overview with FreakingMinds</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {hasContract ? (
                profile.contractDetails.isActive && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    Active Partnership
                  </Badge>
                )
              ) : (
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                  Awaiting Contract
                </Badge>
              )}
              <button
                onClick={() => setPartnershipExpanded(!partnershipExpanded)}
                className="p-2 rounded-lg hover:bg-fm-neutral-100 transition-colors"
                aria-label={partnershipExpanded ? 'Collapse details' : 'Expand details'}
              >
                <ChevronDown
                  className={`w-5 h-5 text-fm-neutral-500 transition-transform duration-300 ${partnershipExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Key Info — Always Visible */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <IconBox size="sm">
                <Timer className="w-4 h-4" />
              </IconBox>
              <div>
                <p className="text-xs text-fm-neutral-500">{hasContract ? 'Partner Since' : 'Client Since'}</p>
                <p className="font-medium text-fm-neutral-900 text-sm">
                  {partnerDuration ? partnerDuration.text : formatPartnerDuration(profile.createdAt).text}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <IconBox size="sm">
                <Briefcase className="w-4 h-4" />
              </IconBox>
              <div>
                <p className="text-xs text-fm-neutral-500">Package</p>
                <p className="font-medium text-fm-neutral-900 text-sm capitalize">{profile.contractDetails.type.replace(/-/g, ' ')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <IconBox size="sm">
                <CreditCard className="w-4 h-4" />
              </IconBox>
              <div>
                <p className="text-xs text-fm-neutral-500">Billing</p>
                <p className="font-medium text-fm-neutral-900 text-sm capitalize">{profile.contractDetails.billingCycle.replace(/-/g, ' ')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <IconBox size="sm">
                <Users className="w-4 h-4" />
              </IconBox>
              <div>
                <p className="text-xs text-fm-neutral-500">Account Manager</p>
                <p className="font-medium text-fm-neutral-900 text-sm">{profile.accountManager}</p>
              </div>
            </div>
          </div>

          {/* Expanded Details — Collapsible */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${partnershipExpanded ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}
          >
            <div className="border-t border-fm-neutral-100 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {hasContract ? (
                  <>
                    {/* Left — Detailed Financial Info */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <IconBox size="sm">
                          <TrendingUp className="w-4 h-4" />
                        </IconBox>
                        <div>
                          <p className="text-sm text-fm-neutral-500">Contract Value</p>
                          <p className="font-medium text-fm-neutral-900">
                            {formatContractCurrency(profile.contractDetails.value, profile.contractDetails.currency)}
                            {(profile.contractDetails.retainerAmount ?? 0) > 0 && (
                              <span className="text-fm-neutral-500 font-normal">
                                {' '}(Retainer: {formatContractCurrency(profile.contractDetails.retainerAmount!, profile.contractDetails.currency)}/mo)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {nextBilling && (
                        <div className="flex items-center space-x-3">
                          <IconBox size="sm">
                            <Calendar className="w-4 h-4" />
                          </IconBox>
                          <div>
                            <p className="text-sm text-fm-neutral-500">Next Billing</p>
                            <p className="font-medium text-fm-neutral-900">{nextBilling}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <IconBox size="sm">
                          <Timer className="w-4 h-4" />
                        </IconBox>
                        <div>
                          <p className="text-sm text-fm-neutral-500">Started</p>
                          <p className="font-medium text-fm-neutral-900">{partnerDuration!.exact}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right — Services & Timeline */}
                    <div className="space-y-6">
                      {/* Services Subscribed */}
                      <div>
                        <p className="text-sm text-fm-neutral-500 mb-3 font-medium">Services Subscribed</p>
                        {profile.contractDetails.services.length > 0 ? (
                          <div className="space-y-2">
                            {profile.contractDetails.services.map((serviceId) => (
                              <div key={serviceId} className="flex items-center space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-fm-neutral-700">{getServiceName(serviceId)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-fm-neutral-400 italic">No specific services listed</p>
                        )}
                      </div>

                      {/* Contract Timeline */}
                      <div>
                        <p className="text-sm text-fm-neutral-500 mb-3 font-medium">Contract Period</p>
                        <div className="text-sm text-fm-neutral-700 mb-2">
                          {new Date(profile.contractDetails.startDate!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' — '}
                          {profile.contractDetails.endDate
                            ? new Date(profile.contractDetails.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Ongoing'
                          }
                        </div>
                        {contractProgress !== null ? (
                          <div className="space-y-1">
                            <div className="w-full bg-fm-neutral-200 rounded-full h-2.5">
                              <div
                                className="bg-gradient-to-r from-fm-magenta-500 to-fm-magenta-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${contractProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-fm-neutral-500">{contractProgress}% elapsed</p>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-xs text-green-600 font-medium">Ongoing — No fixed end date</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="lg:col-span-2 flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-amber-500" />
                    </div>
                    <p className="font-medium text-fm-neutral-900 mb-1">Awaiting Contract Signature</p>
                    <p className="text-sm text-fm-neutral-500 max-w-md">
                      Partnership details will appear here once your contract has been reviewed and accepted.
                    </p>
                    <Link
                      href={`/client/${slug}/contracts`}
                      className="mt-4 inline-flex items-center text-sm font-medium text-fm-magenta-600 hover:text-fm-magenta-700 hover:bg-fm-magenta-50 px-4 py-2 rounded-md transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Contracts
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects & Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Projects */}
        <Card variant="client" hover glow>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <IconBox>
                  <Briefcase className="w-5 h-5" />
                </IconBox>
                <CardTitle className="text-xl">Recent Projects</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-fm-magenta-50 text-fm-magenta-700 border-fm-magenta-200">
                {projects.length} Total
              </Badge>
            </div>
            <CardDescription>Track progress across all your active initiatives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
                <p className="text-fm-neutral-600 font-medium">No projects yet</p>
                <p className="text-fm-neutral-500 text-sm">New projects will appear here once set up</p>
              </div>
            ) : (
              projects.slice(0, 3).map((project) => (
                <Card key={project.id} variant="glass" className="border-fm-magenta-100">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-fm-neutral-900">{project.name}</h4>
                        <Badge className={getStatusColor(project.status)} variant="secondary">
                          {project.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-fm-neutral-600">
                        {new Date(project.startDate).toLocaleDateString()} -
                        {new Date(project.endDate).toLocaleDateString()}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-fm-neutral-600">Progress</span>
                          <span className="font-medium text-fm-magenta-600">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-fm-neutral-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-fm-magenta-500 to-fm-magenta-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-fm-neutral-600">
                          Budget: {formatContractCurrency(project.budget, profile.contractDetails.currency)}
                        </span>
                        <Link
                          href={`/client/${slug}/projects`}
                          className="text-sm font-medium text-fm-magenta-600 hover:text-fm-magenta-700 hover:bg-fm-magenta-50 px-3 py-1.5 rounded-md transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {projects.length > 3 && (
              <div className="pt-4 border-t border-fm-neutral-100">
                <Link
                  href={`/client/${slug}/projects`}
                  className="flex items-center justify-center w-full text-sm font-medium text-fm-magenta-600 hover:text-fm-magenta-700 hover:bg-fm-magenta-50 py-2 rounded-md transition-colors"
                >
                  View All {projects.length} Projects
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Calendar */}
        <Card variant="client" hover glow>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <IconBox>
                  <Calendar className="w-5 h-5" />
                </IconBox>
                <CardTitle className="text-xl">Content Calendar</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-fm-magenta-50 text-fm-magenta-700 border-fm-magenta-200">
                {thisMonthContent} This Month
              </Badge>
            </div>
            <CardDescription>Upcoming content and publications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentItems.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
                <p className="text-fm-neutral-600 font-medium">No content scheduled</p>
                <p className="text-fm-neutral-500 text-sm">Content items will appear here once created</p>
              </div>
            ) : (
              contentItems.slice(0, 4).map((item) => (
                <Card key={item.id} variant="glass" className="border-fm-magenta-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium text-fm-neutral-900">{item.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-fm-neutral-600">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                            {item.platform}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{item.type}</span>
                          <span>•</span>
                          <span>{new Date(item.scheduledDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(item.status)} variant="secondary">
                        {item.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {contentItems.length > 4 && (
              <div className="pt-4 border-t border-fm-neutral-100">
                <Link
                  href={`/client/${slug}/content`}
                  className="flex items-center justify-center w-full text-sm font-medium text-fm-magenta-600 hover:text-fm-magenta-700 hover:bg-fm-magenta-50 py-2 rounded-md transition-colors"
                >
                  View Full Calendar
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card variant="glass" hover>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <IconBox>
                <Activity className="w-5 h-5" />
              </IconBox>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </div>
            <CardDescription>Latest updates across your account</CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity, idx) => {
                  const iconMap: Record<string, React.ReactNode> = {
                    project_created: <Briefcase className="w-4 h-4 text-fm-magenta-600" />,
                    project_updated: <Briefcase className="w-4 h-4 text-blue-600" />,
                    content_created: <Calendar className="w-4 h-4 text-purple-600" />,
                    content_approved: <CheckCircle2 className="w-4 h-4 text-green-600" />,
                    content_published: <Calendar className="w-4 h-4 text-green-600" />,
                    ticket_created: <MessageSquare className="w-4 h-4 text-orange-600" />,
                    ticket_updated: <MessageSquare className="w-4 h-4 text-blue-600" />,
                    document_shared: <FileText className="w-4 h-4 text-fm-magenta-600" />,
                  };

                  return (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-fm-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {iconMap[activity.type] || <Activity className="w-4 h-4 text-fm-neutral-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-fm-neutral-900">{activity.title}</p>
                        <p className="text-sm text-fm-neutral-600 truncate">{activity.description}</p>
                        <p className="text-xs text-fm-neutral-500 mt-0.5">
                          {new Date(activity.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Activity className="w-10 h-10 text-fm-neutral-300 mx-auto mb-2" />
                <p className="text-fm-neutral-500 text-sm">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Support & Resources */}
        <Card variant="glass" hover>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <IconBox>
                <Shield className="w-5 h-5" />
              </IconBox>
              <CardTitle className="text-xl">Support & Resources</CardTitle>
            </div>
            <CardDescription>Get help and access important information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-fm-neutral-600">
              Need help? Reach out to your account manager <span className="font-medium text-fm-neutral-900">{profile.accountManager}</span> or submit a support request.
            </p>

            <Link
              href={`/client/${slug}/support`}
              className="inline-flex items-center justify-center w-full rounded-md bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 px-6 py-3 text-sm font-medium text-white shadow-sm hover:from-fm-magenta-700 hover:to-fm-magenta-800 transition-all"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Get Support
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

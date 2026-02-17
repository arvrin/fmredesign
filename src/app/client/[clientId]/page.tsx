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
} from 'lucide-react';
import { AGENCY_SERVICES } from '@/lib/admin/types';
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
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    const fetchPageData = async () => {
      try {
        setPageLoading(true);

        const [projectsResponse, contentResponse] = await Promise.all([
          fetch(`/api/client-portal/${clientId}/projects`),
          fetch(`/api/client-portal/${clientId}/content`),
        ]);

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.data || []);
        }

        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          setContentItems(contentData.data || []);
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

  const partnerDuration = formatPartnerDuration(profile.onboardedAt);
  const nextBilling = getNextBillingDate(profile.contractDetails.startDate, profile.contractDetails.billingCycle);
  const contractProgress = getContractProgress(profile.contractDetails.startDate, profile.contractDetails.endDate);

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
          value={profile.contractDetails.value}
          subtitle={`Total project investment`}
          icon={<TrendingUp className="w-6 h-6" />}
          formatter={(val) => new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: profile.contractDetails.currency,
            minimumFractionDigits: 0,
            notation: 'compact'
          }).format(Number(val))}
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

      {/* Partnership Details */}
      <Card variant="client" hover glow className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconBox>
                <Handshake className="w-5 h-5" />
              </IconBox>
              <CardTitle className="text-xl">Partnership Details</CardTitle>
            </div>
            {profile.contractDetails.isActive && (
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                Active Partnership
              </Badge>
            )}
          </div>
          <CardDescription>Your engagement overview with FreakingMinds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column -- Key Info */}
            <div className="space-y-4">
              {/* Partner Since */}
              <div className="flex items-center space-x-3">
                <IconBox size="sm">
                  <Timer className="w-4 h-4" />
                </IconBox>
                <div>
                  <p className="text-sm text-fm-neutral-500">Partner Since</p>
                  <p className="font-medium text-fm-neutral-900">{partnerDuration.text} <span className="text-fm-neutral-500 font-normal">(since {partnerDuration.exact})</span></p>
                </div>
              </div>

              {/* Package Type */}
              <div className="flex items-center space-x-3">
                <IconBox size="sm">
                  <Briefcase className="w-4 h-4" />
                </IconBox>
                <div>
                  <p className="text-sm text-fm-neutral-500">Package Type</p>
                  <p className="font-medium text-fm-neutral-900 capitalize">{profile.contractDetails.type.replace(/-/g, ' ')} Plan</p>
                </div>
              </div>

              {/* Billing Cycle */}
              <div className="flex items-center space-x-3">
                <IconBox size="sm">
                  <CreditCard className="w-4 h-4" />
                </IconBox>
                <div>
                  <p className="text-sm text-fm-neutral-500">Billing Cycle</p>
                  <p className="font-medium text-fm-neutral-900 capitalize">
                    {profile.contractDetails.billingCycle.replace(/-/g, ' ')}
                    {nextBilling && <span className="text-fm-neutral-500 font-normal"> — Next billing: {nextBilling}</span>}
                  </p>
                </div>
              </div>

              {/* Contract Value */}
              <div className="flex items-center space-x-3">
                <IconBox size="sm">
                  <TrendingUp className="w-4 h-4" />
                </IconBox>
                <div>
                  <p className="text-sm text-fm-neutral-500">Contract Value</p>
                  <p className="font-medium text-fm-neutral-900">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: profile.contractDetails.currency, minimumFractionDigits: 0 }).format(profile.contractDetails.value)}
                    {profile.contractDetails.retainerAmount > 0 && (
                      <span className="text-fm-neutral-500 font-normal">
                        {' '}(Retainer: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: profile.contractDetails.currency, minimumFractionDigits: 0 }).format(profile.contractDetails.retainerAmount)}/mo)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Account Manager */}
              <div className="flex items-center space-x-3">
                <IconBox size="sm">
                  <Users className="w-4 h-4" />
                </IconBox>
                <div>
                  <p className="text-sm text-fm-neutral-500">Account Manager</p>
                  <p className="font-medium text-fm-neutral-900">{profile.accountManager}</p>
                </div>
              </div>
            </div>

            {/* Right Column -- Services & Timeline */}
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
                  {new Date(profile.contractDetails.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                          Budget: {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            minimumFractionDigits: 0,
                            notation: 'compact'
                          }).format(project.budget)}
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
        {/* Quick Actions */}
        <Card variant="glass" hover>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <IconBox>
                <Activity className="w-5 h-5" />
              </IconBox>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </div>
            <CardDescription>Frequently used features and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href={`/client/${slug}/reports`}
              className="flex items-center w-full text-left h-auto p-4 rounded-md hover:bg-fm-neutral-50 transition-colors"
            >
              <FileText className="w-5 h-5 mr-3 text-fm-magenta-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-fm-neutral-900">Project Reports</div>
                <div className="text-sm text-fm-neutral-500">View detailed progress reports</div>
              </div>
            </Link>
            <Link
              href={`/client/${slug}/support`}
              className="flex items-center w-full text-left h-auto p-4 rounded-md hover:bg-fm-neutral-50 transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-3 text-fm-magenta-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-fm-neutral-900">Contact Manager</div>
                <div className="text-sm text-fm-neutral-500">Get in touch with {profile.accountManager}</div>
              </div>
            </Link>
            <Link
              href={`/client/${slug}/reports`}
              className="flex items-center w-full text-left h-auto p-4 rounded-md hover:bg-fm-neutral-50 transition-colors"
            >
              <Award className="w-5 h-5 mr-3 text-fm-magenta-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-fm-neutral-900">Success Metrics</div>
                <div className="text-sm text-fm-neutral-500">Track ROI and performance</div>
              </div>
            </Link>
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

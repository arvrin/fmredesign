'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  FileText,
  MessageSquare,
  Shield,
  BarChart3,
  Target,
  Calendar,
  Activity,
  Award,
  Briefcase,
  PieChart,
  Handshake,
  CreditCard,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { AGENCY_SERVICES } from '@/lib/admin/types';

interface ClientProfile {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  status: string;
  health: string;
  accountManager: string;
  onboardedAt: string;
  contractDetails: {
    type: string;
    value: number;
    currency: string;
    startDate: string;
    endDate?: string;
    billingCycle: string;
    retainerAmount: number;
    services: string[];
    isActive: boolean;
  };
}

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
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;

  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;

    const fetchClientData = async () => {
      try {
        setLoading(true);

        // Fetch client profile
        const clientResponse = await fetch(`/api/client-portal/${clientId}/profile`);
        if (!clientResponse.ok) {
          if (clientResponse.status === 404) {
            setError('Client not found. Please check your link.');
            return;
          }
          throw new Error('Failed to fetch client profile');
        }
        const clientData = await clientResponse.json();
        setClientProfile(clientData.data);

        // Fetch projects
        const projectsResponse = await fetch(`/api/client-portal/${clientId}/projects`);
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData.data || []);
        }

        // Fetch content
        const contentResponse = await fetch(`/api/client-portal/${clientId}/content`);
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          setContentItems(contentData.data || []);
        }

      } catch (err) {
        console.error('Error fetching client data:', err);
        setError('Failed to load client data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleLogout = async () => {
    try {
      await fetch('/api/client-portal/logout', { method: 'POST' });
    } catch {
      // Ignore errors — redirect regardless
    }
    router.push('/client/login');
  };

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fm-magenta-50 via-orange-50/30 to-fm-magenta-50 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </Card>
      </div>
    );
  }

  if (error || !clientProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fm-magenta-50 via-orange-50/30 to-fm-magenta-50 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-gray-900 font-semibold text-lg">{error || 'Client not found'}</p>
          <p className="text-gray-600 mt-2">Please contact your account manager for assistance.</p>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

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

  const partnerDuration = formatPartnerDuration(clientProfile.onboardedAt);
  const nextBilling = getNextBillingDate(clientProfile.contractDetails.startDate, clientProfile.contractDetails.billingCycle);
  const contractProgress = getContractProgress(clientProfile.contractDetails.startDate, clientProfile.contractDetails.endDate);

  // Navigation items for client dashboard
  const navigationItems = [
    {
      label: 'Overview',
      href: `/client/${clientId}`,
      icon: <BarChart3 className="w-5 h-5" />,
      active: true
    },
    {
      label: 'Projects',
      href: `/client/${clientId}/projects`,
      icon: <Briefcase className="w-5 h-5" />,
      badge: activeProjects > 0 ? activeProjects : undefined
    },
    {
      label: 'Content',
      href: `/client/${clientId}/content`,
      icon: <Calendar className="w-5 h-5" />,
      badge: thisMonthContent > 0 ? thisMonthContent : undefined
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

  return (
    <DashboardLayout
      variant="client"
      navigation={navigationItems}
      user={{
        name: clientProfile.name,
        email: `contact@${clientProfile.name.toLowerCase().replace(/\s+/g, '')}.com`,
        role: clientProfile.industry
      }}
      onLogout={handleLogout}
    >
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {clientProfile.logo && (
              <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-fm-magenta-100 shadow-lg">
                <img
                  src={clientProfile.logo}
                  alt={clientProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-500 bg-clip-text text-transparent">
                Welcome back, {clientProfile.name}
              </h1>
              <p className="text-gray-600 mt-1 font-medium capitalize">
                {clientProfile.industry} • Managed by {clientProfile.accountManager}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={getStatusColor(clientProfile.status)} variant="secondary">
              {clientProfile.status}
            </Badge>
            <div className={`flex items-center px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border ${getHealthColor(clientProfile.health)}`}>
              <Activity className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium capitalize">{clientProfile.health}</span>
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
          change={{
            value: 15,
            type: 'increase',
            period: 'vs last month'
          }}
          variant="client"
        />

        <MetricCard
          title="Contract Value"
          value={clientProfile.contractDetails.value}
          subtitle={`Total project investment`}
          icon={<TrendingUp className="w-6 h-6" />}
          formatter={(val) => new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: clientProfile.contractDetails.currency,
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
          change={{
            value: avgProgress > 50 ? 8 : -3,
            type: avgProgress > 50 ? 'increase' : 'decrease',
            period: 'this quarter'
          }}
          variant="client"
        />
      </div>

      {/* Partnership Details */}
      <Card variant="client" hover glow className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 flex items-center justify-center">
                <Handshake className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">Partnership Details</CardTitle>
            </div>
            {clientProfile.contractDetails.isActive && (
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                Active Partnership
              </Badge>
            )}
          </div>
          <CardDescription>Your engagement overview with FreakingMinds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column — Key Info */}
            <div className="space-y-4">
              {/* Partner Since */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center flex-shrink-0">
                  <Timer className="w-4 h-4 text-fm-magenta-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Partner Since</p>
                  <p className="font-medium text-gray-900">{partnerDuration.text} <span className="text-gray-500 font-normal">(since {partnerDuration.exact})</span></p>
                </div>
              </div>

              {/* Package Type */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-fm-magenta-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Package Type</p>
                  <p className="font-medium text-gray-900 capitalize">{clientProfile.contractDetails.type.replace(/-/g, ' ')} Plan</p>
                </div>
              </div>

              {/* Billing Cycle */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-fm-magenta-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Billing Cycle</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {clientProfile.contractDetails.billingCycle.replace(/-/g, ' ')}
                    {nextBilling && <span className="text-gray-500 font-normal"> — Next billing: {nextBilling}</span>}
                  </p>
                </div>
              </div>

              {/* Contract Value */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-fm-magenta-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contract Value</p>
                  <p className="font-medium text-gray-900">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: clientProfile.contractDetails.currency, minimumFractionDigits: 0 }).format(clientProfile.contractDetails.value)}
                    {clientProfile.contractDetails.retainerAmount > 0 && (
                      <span className="text-gray-500 font-normal">
                        {' '}(Retainer: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: clientProfile.contractDetails.currency, minimumFractionDigits: 0 }).format(clientProfile.contractDetails.retainerAmount)}/mo)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Account Manager */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-fm-magenta-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-fm-magenta-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Manager</p>
                  <p className="font-medium text-gray-900">{clientProfile.accountManager}</p>
                </div>
              </div>
            </div>

            {/* Right Column — Services & Timeline */}
            <div className="space-y-6">
              {/* Services Subscribed */}
              <div>
                <p className="text-sm text-gray-500 mb-3 font-medium">Services Subscribed</p>
                {clientProfile.contractDetails.services.length > 0 ? (
                  <div className="space-y-2">
                    {clientProfile.contractDetails.services.map((serviceId) => (
                      <div key={serviceId} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{getServiceName(serviceId)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No specific services listed</p>
                )}
              </div>

              {/* Contract Timeline */}
              <div>
                <p className="text-sm text-gray-500 mb-3 font-medium">Contract Period</p>
                <div className="text-sm text-gray-700 mb-2">
                  {new Date(clientProfile.contractDetails.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' — '}
                  {clientProfile.contractDetails.endDate
                    ? new Date(clientProfile.contractDetails.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Ongoing'
                  }
                </div>
                {contractProgress !== null ? (
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-fm-magenta-500 to-fm-magenta-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${contractProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{contractProgress}% elapsed</p>
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
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
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No projects yet</p>
                <p className="text-gray-500 text-sm">New projects will appear here once set up</p>
              </div>
            ) : (
              projects.slice(0, 3).map((project) => (
                <Card key={project.id} variant="glass" className="border-fm-magenta-100">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <Badge className={getStatusColor(project.status)} variant="secondary">
                          {project.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(project.startDate).toLocaleDateString()} -
                        {new Date(project.endDate).toLocaleDateString()}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-fm-magenta-600">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-fm-magenta-500 to-fm-magenta-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-gray-600">
                          Budget: {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            minimumFractionDigits: 0,
                            notation: 'compact'
                          }).format(project.budget)}
                        </span>
                        <Button variant="ghost" size="sm" className="text-fm-magenta-600 hover:bg-fm-magenta-50">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {projects.length > 3 && (
              <div className="pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="w-full text-fm-magenta-600 hover:bg-fm-magenta-50">
                  View All {projects.length} Projects
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Calendar */}
        <Card variant="client" hover glow>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
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
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No content scheduled</p>
                <p className="text-gray-500 text-sm">Content items will appear here once created</p>
              </div>
            ) : (
              contentItems.slice(0, 4).map((item) => (
                <Card key={item.id} variant="glass" className="border-fm-magenta-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
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
              <div className="pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="w-full text-fm-magenta-600 hover:bg-fm-magenta-50">
                  View Full Calendar
                </Button>
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
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </div>
            <CardDescription>Frequently used features and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" size="lg" className="w-full justify-start text-left h-auto p-4">
              <FileText className="w-5 h-5 mr-3 text-fm-magenta-600" />
              <div>
                <div className="font-medium">Project Reports</div>
                <div className="text-sm text-gray-500">View detailed progress reports</div>
              </div>
            </Button>
            <Button variant="ghost" size="lg" className="w-full justify-start text-left h-auto p-4">
              <MessageSquare className="w-5 h-5 mr-3 text-fm-magenta-600" />
              <div>
                <div className="font-medium">Contact Manager</div>
                <div className="text-sm text-gray-500">Get in touch with {clientProfile.accountManager}</div>
              </div>
            </Button>
            <Button variant="ghost" size="lg" className="w-full justify-start text-left h-auto p-4">
              <Award className="w-5 h-5 mr-3 text-fm-magenta-600" />
              <div>
                <div className="font-medium">Success Metrics</div>
                <div className="text-sm text-gray-500">Track ROI and performance</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Support & Resources */}
        <Card variant="glass" hover>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">Support & Resources</CardTitle>
            </div>
            <CardDescription>Get help and access important information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Need help? Reach out to your account manager <span className="font-medium text-gray-900">{clientProfile.accountManager}</span> or submit a support request.
            </p>

            <Button variant="client" size="lg" className="w-full">
              <MessageSquare className="w-5 h-5 mr-2" />
              Get Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

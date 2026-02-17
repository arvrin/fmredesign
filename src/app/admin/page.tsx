/**
 * FreakingMinds Admin Command Center
 * Professional dashboard for managing the business operations
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  Briefcase,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  Activity,
  Award,
  Zap,
  Settings,
  Eye
} from 'lucide-react';
import { InvoiceUtils } from '@/lib/admin/types';
import {
  MetricCard,
  DashboardCard as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardButton as Button
} from '@/design-system';

interface DashboardInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'partial';
  createdAt: string;
  lineItems: any[];
  notes: string;
}

interface DashboardStats {
  totalInvoices: number;
  totalClients: number;
  totalRevenue: number;
  pendingInvoices: number;
  totalProjects: number;
  activeProjects: number;
  totalContent: number;
  scheduledContent: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    totalClients: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalContent: 0,
    scheduledContent: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<DashboardInvoice[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [upcomingContent, setUpcomingContent] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch all data from Supabase-backed APIs in parallel
      const [invoicesResponse, clientsResponse, projectsResponse, contentResponse] = await Promise.all([
        fetch('/api/invoices').catch(() => ({ json: () => Promise.resolve({ success: false, data: [] }) })),
        fetch('/api/clients').catch(() => ({ json: () => Promise.resolve({ success: false, data: [] }) })),
        fetch('/api/projects').catch(() => ({ json: () => Promise.resolve({ success: false, data: [] }) })),
        fetch('/api/content').catch(() => ({ json: () => Promise.resolve({ success: false, data: [] }) }))
      ]);

      const invoicesResult = await invoicesResponse.json();
      const clientsResult = await clientsResponse.json();
      const projectsResult = await projectsResponse.json();
      const contentResult = await contentResponse.json();

      const invoices: DashboardInvoice[] = invoicesResult.success ? invoicesResult.data : [];
      const clients = clientsResult.success ? clientsResult.data : [];
      const projects = projectsResult.success ? projectsResult.data : [];
      const content = contentResult.success ? contentResult.data : [];

      // Calculate stats
      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

      const pendingInvoices = invoices.filter(
        inv => inv.status === 'sent' || inv.status === 'overdue'
      ).length;

      const activeProjects = projects.filter((p: any) => p.status === 'active').length;

      // Get upcoming content (next 7 days)
      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);

      const scheduledContent = content.filter((c: any) => {
        const scheduleDate = new Date(c.scheduledDate);
        return scheduleDate >= now && scheduleDate <= sevenDaysFromNow &&
               ['approved', 'scheduled'].includes(c.status);
      }).length;

      setStats({
        totalInvoices: invoices.length,
        totalClients: clients.length,
        totalRevenue,
        pendingInvoices,
        totalProjects: projects.length,
        activeProjects,
        totalContent: content.length,
        scheduledContent,
      });

      // Get recent data
      const recentInvoicesData = invoices
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      const recentProjectsData = projects
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      const upcomingContentData = content
        .filter((c: any) => {
          const scheduleDate = new Date(c.scheduledDate);
          return scheduleDate >= now && ['approved', 'scheduled'].includes(c.status);
        })
        .sort((a: any, b: any) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
        .slice(0, 5);

      setRecentInvoices(recentInvoicesData);
      setRecentProjects(recentProjectsData);
      setUpcomingContent(upcomingContentData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getStatusColor = (status: DashboardInvoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-fm-neutral-100 text-fm-neutral-800';
    }
  };

  const quickActions = [
    {
      title: 'Create Project',
      description: 'Start a new project for a client',
      href: '/admin/projects/new',
      icon: Briefcase,
      color: 'bg-fm-magenta-50 text-fm-magenta-700',
    },
    {
      title: 'Schedule Content',
      description: 'Add content to your calendar',
      href: '/admin/content/new',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Create Invoice',
      description: 'Generate a new invoice for a client',
      href: '/admin/invoice',
      icon: FileText,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Add Client',
      description: 'Add a new client to your database',
      href: '/admin/clients',
      icon: Users,
      color: 'bg-green-50 text-green-700',
    },
    {
      title: 'Lead Analytics',
      description: 'Track leads and conversions',
      href: '/admin/leads',
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-700',
    },
  ];

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: Briefcase,
      color: 'bg-fm-magenta-50 text-fm-magenta-700',
      change: `${stats.activeProjects} active`,
    },
    {
      title: 'Total Content',
      value: stats.totalContent,
      icon: Calendar,
      color: 'bg-purple-50 text-purple-700',
      change: `${stats.scheduledContent} scheduled this week`,
    },
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-blue-50 text-blue-700',
      change: '+8% from last month',
    },
    {
      title: 'Total Revenue',
      value: InvoiceUtils.formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-green-50 text-green-700',
      change: '+23% from last month',
    },
    {
      title: 'Pending Invoices',
      value: stats.pendingInvoices,
      icon: Clock,
      color: 'bg-orange-50 text-orange-700',
      change: stats.pendingInvoices > 0 ? 'Needs attention' : 'All caught up!',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Command Center Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 bg-clip-text text-transparent">
              FreakingMinds Command Center
            </h1>
            <p className="mt-2 text-gray-600 font-medium">
              Your business operations at a glance • Real-time insights and control
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="admin" size="md">
              <Plus className="w-4 h-4 mr-2" />
              Quick Action
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <MetricCard
          title="Total Projects"
          value={stats.totalProjects}
          subtitle="All time projects"
          icon={<Briefcase className="w-6 h-6" />}
          change={{
            value: stats.activeProjects,
            type: stats.activeProjects > 0 ? 'increase' : 'neutral',
            period: 'active now'
          }}
          variant="admin"
        />

        <MetricCard
          title="Content Pipeline"
          value={stats.totalContent}
          subtitle="Total content created"
          icon={<Calendar className="w-6 h-6" />}
          change={{
            value: stats.scheduledContent,
            type: stats.scheduledContent > 0 ? 'increase' : 'neutral',
            period: 'scheduled this week'
          }}
          variant="admin"
        />

        <MetricCard
          title="Client Portfolio"
          value={stats.totalClients}
          subtitle="Active relationships"
          icon={<Users className="w-6 h-6" />}
          change={{
            value: 8,
            type: 'increase',
            period: 'growth this month'
          }}
          variant="admin"
        />

        <MetricCard
          title="Revenue Generated"
          value={stats.totalRevenue}
          subtitle="Total collected"
          icon={<DollarSign className="w-6 h-6" />}
          formatter={(val) => InvoiceUtils.formatCurrency(Number(val))}
          change={{
            value: 23,
            type: 'increase',
            period: 'vs last month'
          }}
          variant="admin"
        />

        <MetricCard
          title="Pending Actions"
          value={stats.pendingInvoices}
          subtitle="Require attention"
          icon={<AlertCircle className="w-6 h-6" />}
          change={{
            value: stats.pendingInvoices > 0 ? -15 : 0,
            type: stats.pendingInvoices > 0 ? 'decrease' : 'neutral',
            period: stats.pendingInvoices > 0 ? 'needs review' : 'all clear'
          }}
          variant="admin"
        />
      </div>

      {/* Quick Actions */}
      <Card variant="admin" hover glow className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>Streamline your workflow with one-click operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Card variant="glass" hover className="group border-indigo-100 h-full">
                    <CardContent className="p-4">
                      <div className="flex flex-col h-full">
                        <div className={`inline-flex p-3 rounded-xl ${action.color} mb-4 self-start`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 mb-2">
                            {action.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors self-end mt-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card variant="admin" hover glow className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">Revenue Stream</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/admin/invoice">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
              <Link href="/admin/invoice">
                <Button variant="admin" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </Link>
            </div>
          </div>
          <CardDescription>Track payments and manage client billing</CardDescription>
        </CardHeader>
        <CardContent>
          {recentInvoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Invoice</h3>
              <p className="text-gray-600 mb-6">Create your first invoice to start tracking revenue</p>
              <Link href="/admin/invoice">
                <Button variant="admin" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create First Invoice
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <Card key={invoice.id} variant="glass" className="border-indigo-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h4>
                            <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{invoice.clientName}</span>
                            <span>•</span>
                            <span>{InvoiceUtils.formatDate(invoice.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-indigo-600">
                          {InvoiceUtils.formatCurrency(invoice.total)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {recentInvoices.length >= 5 && (
                <div className="pt-4 border-t border-indigo-100">
                  <Link href="/admin/invoice">
                    <Button variant="ghost" size="sm" className="w-full text-indigo-600 hover:bg-indigo-50">
                      View All Invoices
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Operations Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects */}
        <Card variant="admin" hover glow>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">Active Projects</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/admin/projects">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </div>
            <CardDescription>Monitor project progress and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Launch</h3>
                <p className="text-gray-600 mb-6">Create your first project to get started</p>
                <Link href="/admin/projects/new">
                  <Button variant="admin" size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <Card key={project.id} variant="glass" className="border-indigo-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            project.status === 'active' ? 'bg-emerald-500 shadow-emerald-500/50 shadow-lg' :
                            project.status === 'completed' ? 'bg-blue-500 shadow-blue-500/50 shadow-lg' :
                            project.status === 'planning' ? 'bg-yellow-500 shadow-yellow-500/50 shadow-lg' :
                            'bg-gray-400'
                          }`}></div>
                          <div>
                            <p className="font-semibold text-gray-900">{project.name}</p>
                            <p className="text-sm text-gray-600 capitalize">
                              {project.type?.replace('_', ' ')} • {project.status}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No deadline'}
                          </p>
                          <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${project.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {recentProjects.length > 0 && (
                  <div className="pt-4 border-t border-indigo-100">
                    <Link href="/admin/projects">
                      <Button variant="ghost" size="sm" className="w-full text-indigo-600 hover:bg-indigo-50">
                        View All Projects
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Pipeline */}
        <Card variant="admin" hover glow>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">Content Pipeline</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/admin/content">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Calendar
                  </Button>
                </Link>
              </div>
            </div>
            <CardDescription>Upcoming content scheduled for publication</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingContent.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Ready</h3>
                <p className="text-gray-600 mb-6">Schedule content to see your upcoming publications</p>
                <Link href="/admin/content/new">
                  <Button variant="admin" size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Schedule Content
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingContent.map((content) => (
                  <Card key={content.id} variant="glass" className="border-indigo-100">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            content.platform === 'instagram' ? 'bg-gradient-to-br from-pink-100 to-pink-200' :
                            content.platform === 'facebook' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                            content.platform === 'linkedin' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                            content.platform === 'twitter' ? 'bg-gradient-to-br from-sky-100 to-sky-200' :
                            'bg-gradient-to-br from-gray-100 to-gray-200'
                          }`}>
                            {content.type === 'video' || content.type === 'reel' ? (
                              <Activity className={`h-4 w-4 ${
                                content.platform === 'instagram' ? 'text-pink-600' :
                                content.platform === 'facebook' ? 'text-blue-600' :
                                content.platform === 'linkedin' ? 'text-blue-600' :
                                content.platform === 'twitter' ? 'text-sky-600' :
                                'text-gray-600'
                              }`} />
                            ) : (
                              <CheckCircle className={`h-4 w-4 ${
                                content.platform === 'instagram' ? 'text-pink-600' :
                                content.platform === 'facebook' ? 'text-blue-600' :
                                content.platform === 'linkedin' ? 'text-blue-600' :
                                content.platform === 'twitter' ? 'text-sky-600' :
                                'text-gray-600'
                              }`} />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{content.title}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium capitalize">
                                {content.platform}
                              </span>
                              <span>•</span>
                              <span className="capitalize">{content.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(content.scheduledDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(content.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {upcomingContent.length > 0 && (
                  <div className="pt-4 border-t border-indigo-100">
                    <Link href="/admin/content">
                      <Button variant="ghost" size="sm" className="w-full text-indigo-600 hover:bg-indigo-50">
                        View Content Calendar
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
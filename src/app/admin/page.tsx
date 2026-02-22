/**
 * FreakingMinds Admin Command Center
 * Dashboard home with metrics, quick actions, and activity feed.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Users,
  DollarSign,
  Calendar,
  Plus,
  ArrowRight,
  Briefcase,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { InvoiceUtils } from '@/lib/admin/types';
import { MetricCard, MetricCardSkeleton, DashboardButton } from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';
import { adminToast } from '@/lib/admin/toast';

/* ── Types ── */
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
  lineItems: unknown[];
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

/* ── Greeting helper ── */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ── Skeleton cards ── */
function DashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Metric skeletons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {[...Array(4)].map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      {/* Activity skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main dashboard ── */
export default function AdminDashboard() {
  const router = useRouter();
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [invoicesResponse, clientsResponse, projectsResponse, contentResponse] =
        await Promise.all([
          fetch('/api/invoices').catch(() => ({ json: () => Promise.resolve({ success: false, data: [] }) })),
          fetch('/api/clients').catch(() => ({ json: () => Promise.resolve({ success: false, data: [] }) })),
          fetch('/api/projects').catch(() => ({ json: () => Promise.resolve({ success: false, data: [] }) })),
          fetch('/api/content').catch(() => ({ json: () => Promise.resolve({ success: false, data: [] }) })),
        ]);

      const invoicesResult = await invoicesResponse.json();
      const clientsResult = await clientsResponse.json();
      const projectsResult = await projectsResponse.json();
      const contentResult = await contentResponse.json();

      const invoices: DashboardInvoice[] = invoicesResult.success ? invoicesResult.data : [];
      const clients = clientsResult.success ? clientsResult.data : [];
      const projects = projectsResult.success ? projectsResult.data : [];
      const content = contentResult.success ? contentResult.data : [];

      const totalRevenue = invoices
        .filter((inv) => inv.status === 'paid')
        .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

      const pendingInvoices = invoices.filter(
        (inv) => inv.status === 'sent' || inv.status === 'overdue'
      ).length;

      const activeProjects = projects.filter((p: any) => p.status === 'active').length;

      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);

      const scheduledContent = content.filter((c: any) => {
        const scheduleDate = new Date(c.scheduledDate);
        return (
          scheduleDate >= now &&
          scheduleDate <= sevenDaysFromNow &&
          ['approved', 'scheduled'].includes(c.status)
        );
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

      setRecentInvoices(
        invoices
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
      );

      setRecentProjects(
        projects
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
      );

      setUpcomingContent(
        content
          .filter((c: any) => {
            const scheduleDate = new Date(c.scheduledDate);
            return scheduleDate >= now && ['approved', 'scheduled'].includes(c.status);
          })
          .sort((a: any, b: any) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
          .slice(0, 5)
      );
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      adminToast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { title: 'New Project', href: '/admin/projects/new', icon: Briefcase, color: 'bg-fm-magenta-50 text-fm-magenta-700' },
    { title: 'Schedule Content', href: '/admin/content/new', icon: Calendar, color: 'bg-violet-50 text-violet-700' },
    { title: 'Create Invoice', href: '/admin/invoice', icon: FileText, color: 'bg-sky-50 text-sky-700' },
    { title: 'Add Client', href: '/admin/clients', icon: Users, color: 'bg-emerald-50 text-emerald-700' },
  ];

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Header */}
      <PageHeader
        title={`${getGreeting()}`}
        description="Your business operations at a glance — real-time insights and control."
      />

      {/* Key Metrics — 2×2 on mobile, 3-col on tablet, 4-col on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        <MetricCard
          title="Clients"
          value={stats.totalClients}
          subtitle="Active relationships"
          icon={<Users className="w-6 h-6" />}
          change={{
            value: stats.totalClients,
            type: stats.totalClients > 0 ? 'increase' : 'neutral',
            period: 'total',
          }}
          variant="admin"
        />
        <MetricCard
          title="Revenue"
          value={stats.totalRevenue}
          subtitle="Total collected"
          icon={<DollarSign className="w-6 h-6" />}
          formatter={(val) => InvoiceUtils.formatCurrency(Number(val))}
          change={{
            value: stats.pendingInvoices,
            type: stats.pendingInvoices > 0 ? 'decrease' : 'neutral',
            period: stats.pendingInvoices > 0 ? `${stats.pendingInvoices} pending` : 'all collected',
          }}
          variant="admin"
        />
        <MetricCard
          title="Projects"
          value={stats.totalProjects}
          subtitle={`${stats.activeProjects} active`}
          icon={<Briefcase className="w-6 h-6" />}
          change={{
            value: stats.activeProjects,
            type: stats.activeProjects > 0 ? 'increase' : 'neutral',
            period: 'active now',
          }}
          variant="admin"
        />
        <MetricCard
          title="Upcoming Content"
          value={stats.scheduledContent}
          subtitle="Next 7 days"
          icon={<Calendar className="w-6 h-6" />}
          change={{
            value: stats.totalContent,
            type: stats.scheduledContent > 0 ? 'increase' : 'neutral',
            period: `${stats.totalContent} total items`,
          }}
          variant="admin"
        />
      </div>

      {/* Quick Actions — clean grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex flex-col items-center gap-2 sm:gap-3 rounded-xl border border-fm-neutral-200 bg-white p-3 sm:p-5 transition-all duration-200 hover:border-fm-magenta-200 hover:shadow-fm-sm"
            >
              <div className={cn('p-3 rounded-xl transition-transform duration-200 group-hover:scale-110', action.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-fm-neutral-700 group-hover:text-fm-neutral-900">
                {action.title}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Activity — two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Invoices */}
        <section className="rounded-xl border border-fm-neutral-200 bg-white">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-fm-neutral-100">
            <h2 className="text-sm font-semibold text-fm-neutral-900">Recent Invoices</h2>
            <Link href="/admin/invoice" className="text-xs font-medium text-fm-magenta-700 hover:text-fm-magenta-800 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentInvoices.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-6 h-6" />}
              title="No invoices yet"
              description="Create your first invoice to start tracking revenue."
              action={
                <DashboardButton variant="primary" size="sm" onClick={() => router.push('/admin/invoice')}>
                  <Plus className="w-4 h-4" /> Create Invoice
                </DashboardButton>
              }
              className="py-10"
            />
          ) : (
            <div className="divide-y divide-fm-neutral-100">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-fm-neutral-50/50 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-medium text-fm-neutral-900">{invoice.invoiceNumber}</span>
                      <StatusBadge status={invoice.status} />
                    </div>
                    <p className="text-xs text-fm-neutral-500 mt-0.5 truncate">
                      {invoice.clientName} &middot; {InvoiceUtils.formatDate(invoice.date)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-fm-neutral-900 shrink-0 ml-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {InvoiceUtils.formatCurrency(invoice.total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Active Projects */}
        <section className="rounded-xl border border-fm-neutral-200 bg-white">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-fm-neutral-100">
            <h2 className="text-sm font-semibold text-fm-neutral-900">Active Projects</h2>
            <Link href="/admin/projects" className="text-xs font-medium text-fm-magenta-700 hover:text-fm-magenta-800 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="w-6 h-6" />}
              title="No projects yet"
              description="Create your first project to get started."
              action={
                <DashboardButton variant="primary" size="sm" onClick={() => router.push('/admin/projects/new')}>
                  <Plus className="w-4 h-4" /> Create Project
                </DashboardButton>
              }
              className="py-10"
            />
          ) : (
            <div className="divide-y divide-fm-neutral-100">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-fm-neutral-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-2.5 h-2.5 rounded-full shrink-0',
                        project.status === 'active' ? 'bg-emerald-500' :
                        project.status === 'completed' ? 'bg-blue-500' :
                        project.status === 'planning' ? 'bg-amber-500' :
                        'bg-fm-neutral-300'
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-fm-neutral-900 truncate">{project.name}</p>
                      <p className="text-xs text-fm-neutral-500 capitalize">
                        {project.type?.replace('_', ' ')} &middot; {project.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-xs text-fm-neutral-500">
                      {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No deadline'}
                    </p>
                    <ProgressBar value={project.progress || 0} size="sm" className="w-16 mt-1.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Upcoming Content */}
      {upcomingContent.length > 0 && (
        <section className="rounded-xl border border-fm-neutral-200 bg-white">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-fm-neutral-100">
            <h2 className="text-sm font-semibold text-fm-neutral-900">Upcoming Content</h2>
            <Link href="/admin/content" className="text-xs font-medium text-fm-magenta-700 hover:text-fm-magenta-800 flex items-center gap-1">
              Calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-fm-neutral-100">
            {upcomingContent.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-fm-neutral-50/50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-fm-neutral-900 truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-fm-neutral-500 capitalize">{item.platform} &middot; {item.type}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs font-medium text-fm-neutral-700" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {new Date(item.scheduledDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-fm-neutral-400" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {new Date(item.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

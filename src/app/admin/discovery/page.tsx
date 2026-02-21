/**
 * Discovery Dashboard
 * Overview of all discovery sessions
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DiscoverySession, DISCOVERY_SECTIONS } from '@/lib/admin/discovery-types';
import { DiscoveryService } from '@/lib/admin/discovery-service';
import {
  DashboardButton,
  DashboardCard,
  CardContent,
  CardHeader,
  CardTitle,
  MetricCard
} from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  BarChart3,
  Users,
  Calendar
} from 'lucide-react';
import { adminToast } from '@/lib/admin/toast';

export default function DiscoveryDashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<DiscoverySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/discovery');
      const result = await response.json();

      if (result.success) {
        setSessions(result.data || []);
      }
    } catch (error) {
      console.error('Error loading discovery sessions:', error);
      adminToast.error('Failed to load discovery sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.companyFundamentals?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.projectOverview?.projectName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-fm-neutral-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <PageHeader
          title="Discovery Sessions"
          description="Comprehensive client analysis and requirement gathering"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-fm-neutral-200 p-4 sm:p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-fm-neutral-200 p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Discovery Sessions"
        description="Comprehensive client analysis and requirement gathering"
        actions={
          <DashboardButton
            variant="primary"
            size="lg"
            onClick={() => router.push('/admin/discovery/new')}
          >
            <Plus className="h-4 w-4" />
            New Discovery
          </DashboardButton>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Sessions"
          value={sessions.length}
          subtitle="All discovery sessions"
          icon={<FileText className="w-6 h-6" />}
          variant="admin"
        />

        <MetricCard
          title="In Progress"
          value={sessions.filter(s => s.status === 'in_progress').length}
          subtitle="Active sessions"
          icon={<Clock className="w-6 h-6" />}
          variant="admin"
          change={{
            value: Math.round((sessions.filter(s => s.status === 'in_progress').length / (sessions.length || 1)) * 100),
            type: 'neutral',
            period: 'of total'
          }}
        />

        <MetricCard
          title="Completed"
          value={sessions.filter(s => s.status === 'completed').length}
          subtitle="Finished sessions"
          icon={<CheckCircle className="w-6 h-6" />}
          variant="admin"
          change={{
            value: Math.round((sessions.filter(s => s.status === 'completed').length / (sessions.length || 1)) * 100),
            type: 'increase',
            period: 'completion rate'
          }}
        />

        <MetricCard
          title="Avg Completion"
          value={`${sessions.length > 0
            ? Math.round(sessions.reduce((acc, s) => acc + (s.completedSections?.length || 0), 0) / sessions.length / 10 * 100)
            : 0}%`}
          subtitle="Progress across all"
          icon={<BarChart3 className="w-6 h-6" />}
          variant="admin"
        />
      </div>

      {/* Filters */}
      <DashboardCard variant="admin" className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or project name..."
              className="pl-10"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
      </DashboardCard>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title={sessions.length === 0 ? 'No discovery sessions yet' : 'No sessions match your filters'}
          description={sessions.length === 0 ? 'Create your first discovery session to get started.' : 'Try adjusting your search or filter criteria.'}
          action={sessions.length === 0 ? (
            <DashboardButton
              onClick={() => router.push('/admin/discovery/new')}
            >
              <Plus className="h-4 w-4" />
              Start First Discovery
            </DashboardButton>
          ) : undefined}
        />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-xl border border-fm-neutral-200 shadow-sm">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                      {getStatusIcon(session.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-fm-neutral-900">
                          {session.companyFundamentals?.companyName || 'Untitled Company'}
                        </h3>
                        <p className="text-fm-neutral-600 text-sm">
                          {session.projectOverview?.projectName || 'Untitled Project'} •
                          {session.projectOverview?.projectType?.replace('_', ' ') || 'Unknown Type'}
                        </p>
                      </div>

                      <StatusBadge status={session.status} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 text-sm mb-4">
                      <div>
                        <span className="text-fm-neutral-500">Progress:</span>
                        <p className="font-medium">
                          {session.completedSections?.length || 0}/10 sections
                          <span className="text-fm-neutral-400">
                            ({Math.round(((session.completedSections?.length || 0) / 10) * 100)}%)
                          </span>
                        </p>
                      </div>

                      <div>
                        <span className="text-fm-neutral-500">Created:</span>
                        <p className="font-medium">
                          {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>

                      <div>
                        <span className="text-fm-neutral-500">Updated:</span>
                        <p className="font-medium">
                          {session.updatedAt ? new Date(session.updatedAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>

                      <div>
                        <span className="text-fm-neutral-500">Assigned To:</span>
                        <p className="font-medium">{session.assignedTo || 'Unassigned'}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-fm-neutral-600 mb-1">
                        <span>Completion Progress</span>
                        <span>{Math.round(((session.completedSections?.length || 0) / 10) * 100)}%</span>
                      </div>
                      <div className="w-full bg-fm-neutral-200 rounded-full h-2">
                        <div
                          className="bg-fm-magenta-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((session.completedSections?.length || 0) / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:ml-4 flex-wrap">
                    <DashboardButton
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/admin/discovery/new?sessionId=${session.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      {session.status === 'completed' ? 'View' : 'Continue'}
                    </DashboardButton>

                    {session.status === 'completed' && (
                      <DashboardButton
                        variant="primary"
                        size="sm"
                        onClick={() => router.push(`/admin/discovery/${session.id}/report`)}
                      >
                        <FileText className="h-4 w-4" />
                        Report
                      </DashboardButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

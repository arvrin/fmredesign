/**
 * Team Member Performance Page
 * Detailed performance analytics and metrics
 */

'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Clock,
  Star,
  BarChart3,
  User,
  Users,
  Award,
  Briefcase
} from 'lucide-react';
import {
  DashboardCard as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardButton,
  MetricCard
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useTeamMember } from '@/hooks/admin/useTeamMember';
import type { TeamAssignment } from '@/lib/admin/types';

interface TeamMemberPerformanceProps {
  params: Promise<{
    memberId: string;
  }>;
}

export default function TeamMemberPerformancePage({ params }: TeamMemberPerformanceProps) {
  const router = useRouter();
  const { memberId } = use(params);
  const { member, loading: isLoading } = useTeamMember(memberId);
  const [assignments, setAssignments] = useState<TeamAssignment[]>([]);
  const [clientMap, setClientMap] = useState<Record<string, { name: string }>>({});
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    const loadData = async () => {
      try {
        const [assignRes, clientRes] = await Promise.all([
          fetch(`/api/team/assignments?teamMemberId=${memberId}`),
          fetch('/api/clients'),
        ]);
        const assignResult = await assignRes.json();
        const clientResult = await clientRes.json();

        if (assignResult.success) setAssignments(assignResult.data || []);
        if (clientResult.success) {
          const map: Record<string, { name: string }> = {};
          (clientResult.data || []).forEach((c: any) => { map[c.id] = { name: c.name }; });
          setClientMap(map);
        }
      } catch { /* ignore */ }
      setDataLoading(false);
    };
    loadData();
  }, [memberId, isLoading]);

  if (isLoading || dataLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<User className="h-6 w-6" />}
          title="Team Member Not Found"
          description="The requested team member could not be found."
          action={
            <DashboardButton onClick={() => router.push('/admin/team')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </DashboardButton>
          }
        />
      </div>
    );
  }

  const activeAssignments = assignments.filter(a => a.status === 'active');
  const completedAssignments = assignments.filter(a => a.status === 'completed');
  const totalHours = activeAssignments.reduce((sum, a) => sum + a.hoursAllocated, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${member.name} - Performance`}
        description="Performance Analytics"
        actions={
          <DashboardButton
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/admin/team/${memberId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </DashboardButton>
        }
      />

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Client Rating"
          value={member.clientRatings ? member.clientRatings.toString() : 'N/A'}
          subtitle="Average rating"
          icon={<Star className="w-6 h-6" />}
          variant="admin"
          change={member.clientRatings > 0 ? {
            value: member.clientRatings,
            type: member.clientRatings >= 4.5 ? 'positive' : member.clientRatings >= 4.0 ? 'neutral' : 'negative',
            period: 'out of 5'
          } : undefined}
        />
        <MetricCard
          title="Tasks Completed"
          value={member.tasksCompleted.toString()}
          subtitle="Total completed"
          icon={<Target className="w-6 h-6" />}
          variant="admin"
        />
        <MetricCard
          title="Efficiency"
          value={`${member.efficiency}%`}
          subtitle="Work efficiency"
          icon={<TrendingUp className="w-6 h-6" />}
          variant="admin"
          change={{
            value: member.efficiency,
            type: member.efficiency >= 90 ? 'positive' : member.efficiency >= 75 ? 'neutral' : 'negative',
            period: 'efficiency rate'
          }}
        />
        <MetricCard
          title="Weekly Hours"
          value={`${member.capacity}h`}
          subtitle="Allocated capacity"
          icon={<Clock className="w-6 h-6" />}
          variant="admin"
        />
      </div>

      {/* Client Allocation */}
      <Card variant="admin">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-fm-magenta-600" />
            Client Allocation
          </CardTitle>
          <CardDescription>
            {activeAssignments.length} active client{activeAssignments.length !== 1 ? 's' : ''} &middot; {totalHours}h allocated / {member.capacity}h capacity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeAssignments.length > 0 ? (
            <div className="space-y-3">
              {activeAssignments.map(a => {
                const pct = Math.round((a.hoursAllocated / member.capacity) * 100);
                const clientName = clientMap[a.clientId]?.name || 'Unknown Client';
                return (
                  <div key={a.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-fm-neutral-900">{clientName}</span>
                      <span className="text-fm-neutral-600">{a.hoursAllocated}h/week ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-fm-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-fm-magenta-600 transition-all"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-fm-neutral-500 py-4">No active client assignments.</p>
          )}
        </CardContent>
      </Card>

      {/* Skills & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="admin">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-fm-magenta-600" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {member.skills && member.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-fm-neutral-500">No skills listed.</p>
            )}
          </CardContent>
        </Card>

        <Card variant="admin">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-fm-magenta-600" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {member.certifications && member.certifications.length > 0 ? (
              <div className="space-y-3">
                {member.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-3 p-3 bg-fm-neutral-50 rounded-lg border border-fm-neutral-200">
                    <Award className="w-4 h-4 text-fm-magenta-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-fm-neutral-900 text-sm">{cert.name}</p>
                      <p className="text-xs text-fm-neutral-600">
                        {cert.issuer} &middot; {new Date(cert.dateObtained).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-fm-neutral-500">No certifications listed.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assignment Stats */}
      <Card variant="admin">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-fm-magenta-600" />
            Assignment Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-fm-neutral-50 rounded-lg border border-fm-neutral-200" style={{ textAlign: 'center' }}>
              <p className="text-2xl font-bold text-fm-magenta-600">{activeAssignments.length}</p>
              <p className="text-sm text-fm-neutral-600">Active Assignments</p>
            </div>
            <div className="p-4 bg-fm-neutral-50 rounded-lg border border-fm-neutral-200" style={{ textAlign: 'center' }}>
              <p className="text-2xl font-bold text-fm-magenta-600">{completedAssignments.length}</p>
              <p className="text-sm text-fm-neutral-600">Completed</p>
            </div>
            <div className="p-4 bg-fm-neutral-50 rounded-lg border border-fm-neutral-200" style={{ textAlign: 'center' }}>
              <p className="text-2xl font-bold text-fm-magenta-600">{totalHours}h</p>
              <p className="text-sm text-fm-neutral-600">Weekly Hours Allocated</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

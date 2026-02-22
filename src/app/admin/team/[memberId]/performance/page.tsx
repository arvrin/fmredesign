/**
 * Team Member Performance Page
 * Detailed performance analytics and metrics
 */

'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Clock,
  Star,
  BarChart3,
  User
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
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useTeamMember } from '@/hooks/admin/useTeamMember';

interface TeamMemberPerformanceProps {
  params: Promise<{
    memberId: string;
  }>;
}

export default function TeamMemberPerformancePage({ params }: TeamMemberPerformanceProps) {
  const router = useRouter();
  const { memberId } = use(params);
  const { member, loading: isLoading } = useTeamMember(memberId);

  if (isLoading) {
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

      {/* Performance Details */}
      <Card variant="admin">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-fm-magenta-600" />
            Detailed Performance Analytics
          </CardTitle>
          <CardDescription>
            Advanced performance tracking and analytics coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<BarChart3 className="h-6 w-6" />}
            title="Performance Analytics Coming Soon"
            description="Advanced performance tracking, detailed analytics, time tracking integration, and productivity metrics will be available here."
            action={
              <DashboardButton
                variant="secondary"
                onClick={() => router.push(`/admin/team/${memberId}`)}
              >
                Back to Profile
              </DashboardButton>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

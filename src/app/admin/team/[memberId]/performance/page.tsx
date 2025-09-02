/**
 * Team Member Performance Page
 * Detailed performance analytics and metrics
 */

'use client';

import { useState, useEffect } from 'react';
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
  DashboardButton as Button,
  MetricCard
} from '@/design-system';
import { TeamService } from '@/lib/admin/team-service';
import { TeamMember } from '@/lib/admin/types';

interface TeamMemberPerformanceProps {
  params: {
    memberId: string;
  };
}

export default function TeamMemberPerformancePage({ params }: TeamMemberPerformanceProps) {
  const router = useRouter();
  const { memberId } = params;
  const [member, setMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMemberData();
  }, [memberId]);

  const loadMemberData = async () => {
    try {
      const memberData = TeamService.getTeamMemberById(memberId);
      setMember(memberData);
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fm-magenta-600"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Team Member Not Found</h2>
        <p className="text-gray-600 mb-6">The requested team member could not be found.</p>
        <Button onClick={() => router.push('/admin/team')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Team
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push(`/admin/team/${memberId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-fm-magenta-100 flex items-center justify-center text-fm-magenta-600 font-bold">
              {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-fm-neutral-900">{member.name}</h1>
              <p className="text-fm-magenta-600 font-medium">Performance Analytics</p>
            </div>
          </div>
        </div>
      </div>

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
        <CardContent className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Analytics Coming Soon</h3>
          <p className="text-gray-500 mb-6">
            Advanced performance tracking, detailed analytics, time tracking integration, 
            and productivity metrics will be available here.
          </p>
          <Button 
            variant="outline"
            onClick={() => router.push(`/admin/team/${memberId}`)}
          >
            Back to Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
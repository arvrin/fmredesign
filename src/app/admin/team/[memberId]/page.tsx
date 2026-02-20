/**
 * Individual Team Member Profile Page
 * Comprehensive view of team member details, performance, and assignments
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Star,
  Award,
  Briefcase,
  Users,
  FileText,
  DollarSign,
  Settings,
  User,
  Target,
  Activity
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
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { TeamMember, TEAM_ROLES, TEAM_DEPARTMENTS } from '@/lib/admin/types';

interface TeamMemberProfileProps {
  params: Promise<{
    memberId: string;
  }>;
}

export default function TeamMemberProfilePage({ params }: TeamMemberProfileProps) {
  const router = useRouter();
  const { memberId } = use(params);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [assignedClients, setAssignedClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMemberData();
  }, [memberId]);

  const loadMemberData = async () => {
    try {
      // Fetch team member from API
      const res = await fetch(`/api/team?id=${memberId}`);
      const result = await res.json();

      if (result.success && result.data) {
        setMember(result.data);

        // Load assigned clients via assignments API
        if (result.data.assignedClients && result.data.assignedClients.length > 0) {
          try {
            const clientsRes = await fetch('/api/clients');
            const clientsResult = await clientsRes.json();
            if (clientsResult.success && clientsResult.data) {
              const assignedClientIds = result.data.assignedClients;
              const clients = clientsResult.data.filter((c: any) =>
                assignedClientIds.includes(c.id)
              );
              setAssignedClients(clients);
            }
          } catch {
            // Clients fetch failed, not critical
          }
        }
      }
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 100) return 'text-red-600';
    if (workload >= 80) return 'text-orange-600';
    if (workload >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'office': return '🏢';
      case 'remote': return '🏠';
      case 'hybrid': return '🔄';
      default: return '📍';
    }
  };

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
        title={member.name}
        description={`${TEAM_ROLES[member.role]} - ${TEAM_DEPARTMENTS[member.department]}`}
        actions={
          <div className="flex items-center gap-3">
            <DashboardButton
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/team')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </DashboardButton>
            <StatusBadge status={member.status} />
            <Badge variant="outline">
              {member.type}
            </Badge>
            <DashboardButton
              variant="primary"
              size="sm"
              onClick={() => router.push(`/admin/team/${memberId}/edit`)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </DashboardButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              icon={<Activity className="w-6 h-6" />}
              variant="admin"
              change={{
                value: member.efficiency,
                type: member.efficiency >= 90 ? 'positive' : member.efficiency >= 75 ? 'neutral' : 'negative',
                period: 'efficiency rate'
              }}
            />
          </div>

          {/* Contact Information */}
          <Card variant="admin">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-fm-magenta-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-fm-neutral-500" />
                    <div>
                      <p className="text-sm font-medium text-fm-neutral-700">Email</p>
                      <p className="text-fm-neutral-900">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-fm-neutral-500" />
                    <div>
                      <p className="text-sm font-medium text-fm-neutral-700">Phone</p>
                      <p className="text-fm-neutral-900">{member.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-fm-neutral-500" />
                    <div>
                      <p className="text-sm font-medium text-fm-neutral-700">Work Location</p>
                      <p className="text-fm-neutral-900">
                        {getLocationIcon(member.location)} {member.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-fm-neutral-500" />
                    <div>
                      <p className="text-sm font-medium text-fm-neutral-700">Start Date</p>
                      <p className="text-fm-neutral-900">
                        {new Date(member.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Expertise */}
          <Card variant="admin">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-fm-magenta-600" />
                Skills & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              {member.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-fm-magenta-100 text-fm-magenta-700 rounded-full border border-fm-magenta-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-fm-neutral-500">No skills added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Assigned Clients */}
          <Card variant="admin">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-fm-magenta-600" />
                Assigned Clients ({assignedClients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedClients.length > 0 ? (
                <div className="space-y-3">
                  {assignedClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-3 bg-fm-neutral-50 rounded-lg border border-fm-neutral-200"
                    >
                      <div>
                        <h4 className="font-medium text-fm-neutral-900">{client.name}</h4>
                        <p className="text-sm text-fm-neutral-600">{client.industry}</p>
                      </div>
                      <StatusBadge status={client.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Users className="h-6 w-6" />}
                  title="No clients assigned yet"
                />
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {member.notes && (
            <Card variant="admin">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-fm-magenta-600" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-fm-neutral-700 leading-relaxed">{member.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Work Details & Stats */}
        <div className="space-y-6">
          {/* Work Details */}
          <Card variant="admin">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-fm-magenta-600" />
                Work Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-fm-neutral-700">Department</p>
                  <p className="text-fm-neutral-900">{TEAM_DEPARTMENTS[member.department]}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-fm-neutral-700">Seniority</p>
                  <p className="text-fm-neutral-900 capitalize">{member.seniority}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-fm-neutral-700">Work Type</p>
                  <p className="text-fm-neutral-900 capitalize">{member.workType.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-fm-neutral-700">Weekly Capacity</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-fm-neutral-500" />
                    <span className="text-fm-neutral-900">{member.capacity} hours</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-fm-neutral-700">Current Workload</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-fm-neutral-500" />
                    <span className={`font-medium ${getWorkloadColor(member.workload)}`}>
                      {member.workload}% utilized
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card variant="admin">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-fm-magenta-600" />
                Compensation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-fm-neutral-700">Type</p>
                <p className="text-fm-neutral-900 capitalize">{member.compensation.type.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-fm-neutral-700">Amount</p>
                <p className="text-fm-neutral-900">
                  INR {member.compensation.amount.toLocaleString('en-IN')}
                  <span className="text-sm text-fm-neutral-500 ml-1">
                    /{member.compensation.type === 'salary' ? 'month' : member.compensation.type === 'hourly' ? 'hour' : 'project'}
                  </span>
                </p>
              </div>
              {member.compensation.billingRate && (
                <div>
                  <p className="text-sm font-medium text-fm-neutral-700">Client Billing Rate</p>
                  <p className="text-fm-neutral-900">INR {member.compensation.billingRate.toLocaleString('en-IN')}/hour</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card variant="admin">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-fm-magenta-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DashboardButton
                variant="secondary"
                className="w-full justify-start"
                onClick={() => router.push(`/admin/team/${memberId}/assignments`)}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Assignments
              </DashboardButton>
              <DashboardButton
                variant="secondary"
                className="w-full justify-start"
                onClick={() => router.push(`/admin/team/${memberId}/performance`)}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Performance
              </DashboardButton>
              <DashboardButton
                variant="secondary"
                className="w-full justify-start"
                onClick={() => router.push(`/admin/team/${memberId}/documents`)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Manage Documents
              </DashboardButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

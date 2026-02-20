/**
 * Team Member Assignment Management
 * Manage client assignments for individual team members
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Users,
  Clock,
  Star,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  User,
  Building
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
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import { TeamMember, TeamAssignment, TEAM_ROLES } from '@/lib/admin/types';
import { adminToast } from '@/lib/admin/toast';

interface TeamAssignmentManagementProps {
  params: Promise<{
    memberId: string;
  }>;
}

export default function TeamAssignmentManagementPage({ params }: TeamAssignmentManagementProps) {
  const router = useRouter();
  const { memberId } = use(params);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [assignments, setAssignments] = useState<TeamAssignment[]>([]);
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const [clientMap, setClientMap] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    clientId: '',
    hoursAllocated: 10,
    isLead: false,
    role: 'Team Member'
  });

  useEffect(() => {
    loadAssignmentData();
  }, [memberId]);

  const loadAssignmentData = async () => {
    try {
      // Load team member from API
      const memberRes = await fetch(`/api/team?id=${memberId}`);
      const memberResult = await memberRes.json();
      if (!memberResult.success || !memberResult.data) return;
      setMember(memberResult.data);

      // Load current assignments from API
      const assignmentsRes = await fetch(`/api/team/assignments?teamMemberId=${memberId}`);
      const assignmentsResult = await assignmentsRes.json();
      const memberAssignments = assignmentsResult.success ? assignmentsResult.data : [];
      setAssignments(memberAssignments);

      // Load all clients from API
      const clientsRes = await fetch('/api/clients');
      const clientsResult = await clientsRes.json();
      const allClients = clientsResult.success ? clientsResult.data : [];

      // Build client lookup map
      const map: Record<string, any> = {};
      allClients.forEach((client: any) => { map[client.id] = client; });
      setClientMap(map);

      // Filter available clients (not currently assigned)
      const assignedClientIds = memberAssignments.map((a: any) => a.clientId);
      const available = allClients.filter((client: any) => !assignedClientIds.includes(client.id));
      setAvailableClients(available);
    } catch (error) {
      console.error('Error loading assignment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAssignment = async () => {
    if (!newAssignment.clientId || !member) return;

    try {
      const res = await fetch('/api/team/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamMemberId: memberId,
          clientId: newAssignment.clientId,
          hoursAllocated: newAssignment.hoursAllocated,
          isLead: newAssignment.isLead,
          role: newAssignment.role,
        }),
      });
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create assignment');
      }

      adminToast.success('Assignment added successfully');

      // Reload data
      await loadAssignmentData();
      setShowAddForm(false);
      setNewAssignment({
        clientId: '',
        hoursAllocated: 10,
        isLead: false,
        role: 'Team Member'
      });
    } catch (error) {
      console.error('Error adding assignment:', error);
      adminToast.error('Failed to add assignment');
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      const res = await fetch(`/api/team/assignments?id=${assignmentId}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to remove assignment');
      }

      adminToast.success('Assignment removed successfully');
      await loadAssignmentData();
    } catch (error) {
      console.error('Error removing assignment:', error);
      adminToast.error('Failed to remove assignment');
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 100) return 'text-red-600';
    if (workload >= 80) return 'text-orange-600';
    if (workload >= 60) return 'text-yellow-600';
    return 'text-green-600';
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

  const totalAllocatedHours = assignments.reduce((sum, a) => sum + a.hoursAllocated, 0);
  const workloadPercentage = Math.round((totalAllocatedHours / member.capacity) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${member.name} - Assignments`}
        description={`${TEAM_ROLES[member.role]} - Assignment Management`}
        actions={
          <div className="flex items-center gap-3">
            <DashboardButton
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/team/${memberId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </DashboardButton>
            <DashboardButton
              variant="admin"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Assignment
            </DashboardButton>
          </div>
        }
      />

      {/* Workload Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Weekly Capacity"
          value={`${member.capacity}h`}
          subtitle="Total available"
          icon={<Clock className="w-6 h-6" />}
          variant="admin"
        />
        <MetricCard
          title="Allocated Hours"
          value={`${totalAllocatedHours}h`}
          subtitle="Currently assigned"
          icon={<Users className="w-6 h-6" />}
          variant="admin"
        />
        <MetricCard
          title="Workload"
          value={`${workloadPercentage}%`}
          subtitle="Capacity utilization"
          icon={<Star className="w-6 h-6" />}
          variant="admin"
          change={{
            value: workloadPercentage,
            type: workloadPercentage > 100 ? 'negative' : workloadPercentage > 85 ? 'neutral' : 'positive',
            period: 'utilization'
          }}
        />
        <MetricCard
          title="Available Hours"
          value={`${Math.max(0, member.capacity - totalAllocatedHours)}h`}
          subtitle="Remaining capacity"
          icon={<CheckCircle className="w-6 h-6" />}
          variant="admin"
        />
      </div>

      {/* Workload Warning */}
      {workloadPercentage > 100 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-800">Overallocation Warning</h3>
              <p className="text-sm text-red-700">
                This team member is allocated {totalAllocatedHours} hours but only has {member.capacity} hours capacity per week.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Assignment Form */}
      {showAddForm && (
        <Card variant="admin">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-fm-magenta-600" />
              Add New Client Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Select Client"
                value={newAssignment.clientId}
                onChange={(e) => setNewAssignment(prev => ({ ...prev, clientId: e.target.value }))}
                required
              >
                <option value="">Choose a client...</option>
                {availableClients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>

              <Input
                label="Weekly Hours"
                type="number"
                min={1}
                max={member.capacity}
                value={newAssignment.hoursAllocated}
                onChange={(e) => setNewAssignment(prev => ({ ...prev, hoursAllocated: parseInt(e.target.value) || 1 }))}
                required
              />

              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Role
                </label>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newAssignment.isLead}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, isLead: e.target.checked }))}
                      className="rounded border-fm-neutral-300 text-fm-magenta-600 focus:ring-fm-magenta-500"
                    />
                    <span className="text-sm text-fm-neutral-700">Account Lead</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-fm-neutral-200">
              <DashboardButton
                variant="ghost"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </DashboardButton>
              <DashboardButton
                variant="admin"
                onClick={handleAddAssignment}
                disabled={!newAssignment.clientId}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Add Assignment
              </DashboardButton>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Assignments */}
      <Card variant="admin">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-fm-magenta-600" />
                Current Client Assignments
              </CardTitle>
              <CardDescription>
                {assignments.length} active assignments
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments.map((assignment) => {
                const client = clientMap[assignment.clientId];
                if (!client) return null;

                return (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 bg-fm-neutral-50 rounded-lg border border-fm-neutral-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-fm-magenta-100 flex items-center justify-center">
                        <Building className="w-5 h-5 text-fm-magenta-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-fm-neutral-900">{client.name}</h4>
                          {assignment.isLead && (
                            <Badge variant="default" className="bg-fm-magenta-100 text-fm-magenta-700">
                              Account Lead
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-fm-neutral-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {assignment.hoursAllocated}h/week
                          </span>
                          <span>Since {new Date(assignment.startDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={assignment.status} />
                      <DashboardButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </DashboardButton>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Users className="h-6 w-6" />}
              title="No Client Assignments"
              description="This team member hasn't been assigned to any clients yet."
              action={
                <DashboardButton
                  variant="admin"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Assignment
                </DashboardButton>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Assignment History */}
      <Card variant="admin">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-fm-magenta-600" />
            Assignment History
          </CardTitle>
          <CardDescription>
            Past and completed assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Clock className="h-6 w-6" />}
            title="Assignment history tracking coming soon"
          />
        </CardContent>
      </Card>
    </div>
  );
}

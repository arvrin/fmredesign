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
  DashboardButton as Button,
  MetricCard
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { TeamService } from '@/lib/admin/team-service';
import { ClientService } from '@/lib/admin/client-service';
import { TeamMember, TeamAssignment, TEAM_ROLES } from '@/lib/admin/types';

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
      // Load team member
      const memberData = TeamService.getTeamMemberById(memberId);
      if (!memberData) return;
      setMember(memberData);

      // Load current assignments
      const memberAssignments = TeamService.getAssignmentsByTeamMember(memberId);
      setAssignments(memberAssignments);

      // Load available clients (not currently assigned to this member)
      const allClients = await ClientService.getAllClients();
      const assignedClientIds = memberAssignments.map(a => a.clientId);
      const available = allClients.filter(client => !assignedClientIds.includes(client.id));
      setAvailableClients(available);

      // Build a lookup map for all clients (for use in render)
      const map: Record<string, any> = {};
      allClients.forEach(client => { map[client.id] = client; });
      setClientMap(map);
    } catch (error) {
      console.error('Error loading assignment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAssignment = async () => {
    if (!newAssignment.clientId || !member) return;

    try {
      TeamService.assignTeamMemberToClient(
        memberId,
        newAssignment.clientId,
        newAssignment.hoursAllocated,
        newAssignment.isLead
      );

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
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      TeamService.removeAssignment(assignmentId);
      await loadAssignmentData();
    } catch (error) {
      console.error('Error removing assignment:', error);
    }
  };

  const getClientById = (clientId: string) => {
    return availableClients.find(c => c.id === clientId) || 
           assignments.find(a => a.clientId === clientId);
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 100) return 'text-red-600';
    if (workload >= 80) return 'text-orange-600';
    if (workload >= 60) return 'text-yellow-600';
    return 'text-green-600';
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
        <User className="w-16 h-16 text-fm-neutral-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-fm-neutral-900 mb-2">Team Member Not Found</h2>
        <p className="text-fm-neutral-600 mb-6">The requested team member could not be found.</p>
        <Button onClick={() => router.push('/admin/team')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Team
        </Button>
      </div>
    );
  }

  const totalAllocatedHours = assignments.reduce((sum, a) => sum + a.hoursAllocated, 0);
  const workloadPercentage = Math.round((totalAllocatedHours / member.capacity) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
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
                <p className="text-fm-magenta-600 font-medium">
                  {TEAM_ROLES[member.role]} - Assignment Management
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="admin" 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Assignment
          </Button>
        </div>
      </div>

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
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Select Client *
                </label>
                <select
                  value={newAssignment.clientId}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, clientId: e.target.value }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                  required
                >
                  <option value="">Choose a client...</option>
                  {availableClients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                  Weekly Hours *
                </label>
                <input
                  type="number"
                  min="1"
                  max={member.capacity}
                  value={newAssignment.hoursAllocated}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, hoursAllocated: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                  required
                />
              </div>
              
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
              <Button
                variant="ghost"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="admin"
                onClick={handleAddAssignment}
                disabled={!newAssignment.clientId}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Add Assignment
              </Button>
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
                      <Badge 
                        variant="outline"
                        className={assignment.status === 'active' ? 'border-green-300 text-green-700' : ''}
                      >
                        {assignment.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-fm-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-fm-neutral-900 mb-2">No Client Assignments</h3>
              <p className="text-fm-neutral-500 mb-4">
                This team member hasn't been assigned to any clients yet.
              </p>
              <Button 
                variant="admin" 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add First Assignment
              </Button>
            </div>
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
          <div className="text-center py-6">
            <Clock className="w-12 h-12 text-fm-neutral-400 mx-auto mb-3" />
            <p className="text-fm-neutral-500">Assignment history tracking coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
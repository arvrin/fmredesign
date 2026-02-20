'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardCard as Card, CardContent, CardHeader, CardTitle, DashboardButton } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import ClientPortalLink from '@/components/admin/ClientPortalLink';
import { TEAM_ROLES, type TeamRole } from '@/lib/admin/types';
import { adminToast } from '@/lib/admin/toast';
import ContractsTab from '@/components/admin/ContractsTab';
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  TrendingUp,
  Users,
  AlertCircle,
  Plus,
  Trash2,
  Clock,
  Star,
  Briefcase,
  Save,
  UserCheck,
  UserMinus,
  FileText,
} from 'lucide-react';

interface ClientProfile {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  website?: string;
  description?: string;
  status: string;
  health: string;
  primaryContact: {
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
  additionalContacts: Array<{
    name: string;
    email: string;
    role: string;
  }>;
  headquarters: {
    city: string;
    state: string;
    country: string;
  };
  contractDetails: {
    value: number;
    currency: string;
    startDate: string;
    endDate?: string;
  };
  accountManager: string;
  createdAt: string;
}

export default function AdminClientDetail() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;

  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedTeamMembers, setAssignedTeamMembers] = useState<any[]>([]);
  const [availableTeamMembers, setAvailableTeamMembers] = useState<any[]>([]);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [newTeamAssignment, setNewTeamAssignment] = useState({
    teamMemberId: '',
    hoursAllocated: 10,
    isLead: false
  });
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    
    const fetchClientData = async () => {
      try {
        setLoading(true);
        
        // Fetch client profile using the client portal API for consistency
        const response = await fetch(`/api/client-portal/${clientId}/profile`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Client not found');
            return;
          }
          throw new Error('Failed to fetch client profile');
        }
        
        const data = await response.json();
        setClientProfile(data.data);

        // Load team assignments for this client via API
        await loadTeamData();

      } catch (err) {
        console.error('Error fetching client data:', err);
        setError('Failed to load client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const loadTeamData = async () => {
    try {
      // Fetch assignments for this client
      const assignmentsRes = await fetch(`/api/team/assignments?clientId=${clientId}`);
      const assignmentsResult = await assignmentsRes.json();
      const assignments = assignmentsResult.success ? assignmentsResult.data : [];

      // Fetch all team members
      const teamRes = await fetch('/api/team');
      const teamResult = await teamRes.json();
      const allTeamMembers = teamResult.success ? teamResult.data : [];

      // Build assigned team members list with assignment data
      const assigned: any[] = [];
      for (const assignment of assignments) {
        const member = allTeamMembers.find((m: any) => m.id === assignment.teamMemberId);
        if (member) {
          assigned.push({
            id: member.id,
            name: member.name,
            role: member.role,
            status: member.status,
            hoursAllocated: assignment.hoursAllocated,
            isLead: assignment.isLead,
            assignmentId: assignment.id,
          });
        }
      }
      setAssignedTeamMembers(assigned);

      // Filter available team members (active, not already assigned)
      const assignedMemberIds = assigned.map((m: any) => m.id);
      const available = allTeamMembers.filter((member: any) =>
        member.status === 'active' && !assignedMemberIds.includes(member.id)
      );
      setAvailableTeamMembers(available);
    } catch (err) {
      console.error('Error loading team data:', err);
    }
  };

  // Fetch projects for this client
  const fetchClientProjects = useCallback(async () => {
    if (!clientId) return;
    setProjectsLoading(true);
    try {
      const res = await fetch(`/api/projects?clientId=${clientId}`);
      const result = await res.json();
      if (result.success) {
        setClientProjects(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setProjectsLoading(false);
    }
  }, [clientId]);

  // Fetch activity feed (tickets + content) for this client
  const fetchActivityFeed = useCallback(async () => {
    if (!clientId) return;
    setActivityLoading(true);
    try {
      const [ticketsRes, contentRes] = await Promise.all([
        fetch(`/api/admin/support?clientId=${clientId}`).catch(() => null),
        fetch(`/api/content?clientId=${clientId}`).catch(() => null),
      ]);

      const items: any[] = [];

      if (ticketsRes) {
        const ticketsResult = await ticketsRes.json();
        if (ticketsResult.success && ticketsResult.data) {
          ticketsResult.data.forEach((t: any) => {
            items.push({
              id: t.id,
              type: 'ticket',
              title: t.title,
              status: t.status,
              priority: t.priority,
              date: t.createdAt || t.created_at,
            });
          });
        }
      }

      if (contentRes) {
        const contentResult = await contentRes.json();
        if (contentResult.success && contentResult.data) {
          contentResult.data.forEach((c: any) => {
            items.push({
              id: c.id,
              type: 'content',
              title: c.title,
              status: c.status,
              platform: c.platform,
              date: c.scheduledDate || c.createdAt || c.created_at,
            });
          });
        }
      }

      // Sort by date descending
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setActivityFeed(items);
    } catch (err) {
      console.error('Error fetching activity feed:', err);
    } finally {
      setActivityLoading(false);
    }
  }, [clientId]);

  // Eagerly load projects & activity data when the client profile loads
  useEffect(() => {
    if (clientProfile) {
      fetchClientProjects();
      fetchActivityFeed();
    }
  }, [clientProfile, fetchClientProjects, fetchActivityFeed]);

  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-fm-magenta-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-fm-neutral-600';
    }
  };

  const handleAddTeamMember = async () => {
    if (!newTeamAssignment.teamMemberId || !clientProfile) return;

    try {
      const res = await fetch('/api/team/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamMemberId: newTeamAssignment.teamMemberId,
          clientId,
          hoursAllocated: newTeamAssignment.hoursAllocated,
          isLead: newTeamAssignment.isLead,
        }),
      });
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to assign team member');
      }

      adminToast.success('Team member assigned successfully');

      // Reload team data
      await loadTeamData();
      setShowAddTeamForm(false);
      setNewTeamAssignment({
        teamMemberId: '',
        hoursAllocated: 10,
        isLead: false
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      adminToast.error('Failed to assign team member');
    }
  };

  const handleRemoveTeamMember = async (member: any) => {
    if (!clientProfile) return;

    try {
      const assignmentId = member.assignmentId;
      if (!assignmentId) {
        console.error('No assignment ID found for member:', member.id);
        return;
      }

      const res = await fetch(`/api/team/assignments?id=${assignmentId}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to remove team member');
      }

      adminToast.success('Team member removed from client');

      // Reload team data
      await loadTeamData();
    } catch (error) {
      console.error('Error removing team member:', error);
      adminToast.error('Failed to remove team member');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !clientProfile) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<AlertCircle className="h-6 w-6" />}
          title={error || 'Client not found'}
          action={
            <DashboardButton
              onClick={() => router.back()}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </DashboardButton>
          }
        />
      </div>
    );
  }

  // Extract additional emails for portal link generation
  const additionalEmails = clientProfile.additionalContacts.map(contact => contact.email);

  return (
    <div className="space-y-6">
      <PageHeader
        title={clientProfile.name}
        description={`${clientProfile.industry} • Managed by ${clientProfile.accountManager}`}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <DashboardButton
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </DashboardButton>
            <StatusBadge status={clientProfile.status} />
            <div className={`flex items-center ${getHealthColor(clientProfile.health)}`}>
              <div className="h-2 w-2 rounded-full bg-current mr-2"></div>
              <span className="text-sm font-medium capitalize">{clientProfile.health}</span>
            </div>
          </div>
        }
      />
      <div>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portal">Client Portal</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clientProfile.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-fm-neutral-400 mr-3" />
                      <a 
                        href={clientProfile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-fm-magenta-600 hover:underline"
                      >
                        {clientProfile.website}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-fm-neutral-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-fm-neutral-900">
                        {clientProfile.headquarters.city}, {clientProfile.headquarters.state}
                      </p>
                      <p className="text-sm text-fm-neutral-600">{clientProfile.headquarters.country}</p>
                    </div>
                  </div>
                  
                  {clientProfile.description && (
                    <div>
                      <p className="text-sm text-fm-neutral-600">{clientProfile.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Primary Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Primary Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-fm-neutral-900">{clientProfile.primaryContact.name}</p>
                    <p className="text-sm text-fm-neutral-600">{clientProfile.primaryContact.role}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-fm-neutral-400 mr-3" />
                      <a 
                        href={`mailto:${clientProfile.primaryContact.email}`}
                        className="text-fm-magenta-600 hover:underline"
                      >
                        {clientProfile.primaryContact.email}
                      </a>
                    </div>
                    
                    {clientProfile.primaryContact.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-fm-neutral-400 mr-3" />
                        <a 
                          href={`tel:${clientProfile.primaryContact.phone}`}
                          className="text-fm-magenta-600 hover:underline"
                        >
                          {clientProfile.primaryContact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contract Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Contract Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-fm-neutral-600">Contract Value</p>
                    <p className="text-2xl font-bold text-fm-neutral-900">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: clientProfile.contractDetails.currency,
                        minimumFractionDigits: 0
                      }).format(clientProfile.contractDetails.value)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-fm-neutral-600">Start Date</p>
                    <p className="text-lg font-medium text-fm-neutral-900">
                      {new Date(clientProfile.contractDetails.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-fm-neutral-600">End Date</p>
                    <p className="text-lg font-medium text-fm-neutral-900">
                      {clientProfile.contractDetails.endDate 
                        ? new Date(clientProfile.contractDetails.endDate).toLocaleDateString()
                        : 'Ongoing'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portal" className="space-y-6">
            <ClientPortalLink
              clientId={clientProfile.id}
              clientName={clientProfile.name}
              primaryEmail={clientProfile.primaryContact.email}
              additionalEmails={additionalEmails}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6" onFocusCapture={() => { if (clientProjects.length === 0 && !projectsLoading) fetchClientProjects(); }}>
            {projectsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
              </div>
            ) : clientProjects.length === 0 ? (
              <EmptyState
                icon={<Briefcase className="h-6 w-6" />}
                title="No Projects Yet"
                description="This client does not have any projects."
                action={
                  <DashboardButton onClick={() => router.push('/admin/projects/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </DashboardButton>
                }
              />
            ) : (
              <div className="space-y-4">
                {clientProjects.map((project: any) => {
                  return (
                    <Card key={project.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-fm-neutral-900">{project.name}</h3>
                              <StatusBadge status={project.status} />
                            </div>
                            {project.description && (
                              <p className="text-sm text-fm-neutral-600 mb-3">{project.description}</p>
                            )}
                            {typeof project.progress === 'number' && (
                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-fm-neutral-500">Progress</span>
                                  <span className="text-xs font-medium text-fm-neutral-700">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-fm-neutral-200 rounded-full h-1.5">
                                  <div
                                    className="bg-fm-magenta-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-sm text-fm-neutral-500">
                              {project.type && (
                                <span className="capitalize">{project.type.replace(/_/g, ' ')}</span>
                              )}
                              {project.startDate && (
                                <span>{new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}</span>
                              )}
                            </div>
                          </div>
                          <Link href={`/admin/projects/${project.id}`}>
                            <DashboardButton variant="outline" size="sm">
                              View Project
                            </DashboardButton>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <ContractsTab clientId={clientId} clientName={clientProfile?.name} />
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {/* Team Assignment Form */}
            {showAddTeamForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Assign Team Member
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Select
                        label="Select Team Member *"
                        value={newTeamAssignment.teamMemberId}
                        onChange={(e) => setNewTeamAssignment(prev => ({ ...prev, teamMemberId: e.target.value }))}
                        required
                      >
                        <option value="">Choose a team member...</option>
                        {availableTeamMembers.map((member: any) => (
                          <option key={member.id} value={member.id}>
                            {member.name} - {TEAM_ROLES[member.role as TeamRole]}
                          </option>
                        ))}
                      </Select>
                    </div>
                    
                    <div>
                      <Input
                        label="Weekly Hours"
                        type="number"
                        min={1}
                        max={40}
                        value={newTeamAssignment.hoursAllocated}
                        onChange={(e) => setNewTeamAssignment(prev => ({ ...prev, hoursAllocated: parseInt(e.target.value) || 1 }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                        Role
                      </label>
                      <div className="flex items-center pt-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newTeamAssignment.isLead}
                            onChange={(e) => setNewTeamAssignment(prev => ({ ...prev, isLead: e.target.checked }))}
                            className="rounded border-fm-neutral-300 text-fm-magenta-600 focus:ring-fm-magenta-700"
                          />
                          <span className="ml-2 text-sm text-fm-neutral-700">Account Lead</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-4 pt-4 border-t border-fm-neutral-200">
                    <DashboardButton
                      onClick={() => setShowAddTeamForm(false)}
                      variant="outline"
                    >
                      Cancel
                    </DashboardButton>
                    <DashboardButton
                      onClick={handleAddTeamMember}
                      disabled={!newTeamAssignment.teamMemberId}
                      className="flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Assign Team Member
                    </DashboardButton>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assigned Team Members */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Assigned Team Members ({assignedTeamMembers.length})
                  </CardTitle>
                  <DashboardButton
                    onClick={() => setShowAddTeamForm(true)}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Member
                  </DashboardButton>
                </div>
              </CardHeader>
              <CardContent>
                {assignedTeamMembers.length > 0 ? (
                  <div className="space-y-4">
                    {assignedTeamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-fm-neutral-50 rounded-lg border border-fm-neutral-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-fm-magenta-100 flex items-center justify-center text-fm-magenta-600 font-medium">
                            {member.name.split(' ').map((n: any) => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-fm-neutral-900">{member.name}</h4>
                              {member.isLead && (
                                <Badge className="bg-fm-magenta-100 text-fm-magenta-800">
                                  Account Lead
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-fm-neutral-600">
                              <span className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1" />
                                {TEAM_ROLES[member.role as TeamRole]}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {member.hoursAllocated}h/week
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <StatusBadge status={member.status} />
                          <DashboardButton
                            onClick={() => handleRemoveTeamMember(member)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <UserMinus className="h-4 w-4" />
                          </DashboardButton>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Users className="h-6 w-6" />}
                    title="No Team Members Assigned"
                    description="This client doesn't have any team members assigned yet."
                    action={
                      <DashboardButton
                        onClick={() => setShowAddTeamForm(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Assign First Member
                      </DashboardButton>
                    }
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            {activityLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </div>
            ) : activityFeed.length === 0 ? (
              <EmptyState
                icon={<Clock className="h-6 w-6" />}
                title="No Activity Yet"
                description="Support tickets and content items will appear here."
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityFeed.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="flex items-start gap-4 p-3 rounded-lg border border-fm-neutral-200 hover:bg-fm-neutral-50 transition-colors"
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          item.type === 'ticket' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.type === 'ticket' ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <Calendar className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-fm-neutral-900 truncate">
                              {item.title}
                            </span>
                            <Badge className={`text-xs ${
                              item.type === 'ticket' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {item.type === 'ticket' ? 'Support Ticket' : 'Content'}
                            </Badge>
                            {item.status && (
                              <Badge variant="outline" className="text-xs">
                                {item.status.replace(/_/g, ' ')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-fm-neutral-500">
                            {item.date && (
                              <span>{new Date(item.date).toLocaleDateString()}</span>
                            )}
                            {item.platform && (
                              <span className="capitalize">{item.platform}</span>
                            )}
                            {item.priority && (
                              <span className="capitalize">{item.priority}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

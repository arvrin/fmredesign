'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/primitives/Card';
import { Button } from '@/design-system/components/primitives/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientPortalLink from '@/components/admin/ClientPortalLink';
import { TeamService } from '@/lib/admin/team-service';
import { TEAM_ROLES, type TeamRole } from '@/lib/admin/types';
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
  UserMinus
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
        
        // Load team assignments for this client
        const assignedMembers = TeamService.getTeamMembersForClient(clientId);
        setAssignedTeamMembers(assignedMembers);

        // Load available team members (not assigned to this client)
        const allTeamMembers = TeamService.getAllTeamMembers();
        const assignedMemberIds = assignedMembers.map((m: any) => m.id);
        const available = allTeamMembers.filter(member => 
          member.status === 'active' && !assignedMemberIds.includes(member.id)
        );
        setAvailableTeamMembers(available);

      } catch (err) {
        console.error('Error fetching client data:', err);
        setError('Failed to load client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-fm-neutral-100 text-fm-neutral-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'churned': return 'bg-red-100 text-red-800';
      default: return 'bg-fm-neutral-100 text-fm-neutral-800';
    }
  };

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
      TeamService.assignTeamMemberToClient(
        newTeamAssignment.teamMemberId,
        clientId,
        newTeamAssignment.hoursAllocated,
        newTeamAssignment.isLead
      );
      
      // Reload team data
      const assignedMembers = TeamService.getTeamMembersForClient(clientId);
      setAssignedTeamMembers(assignedMembers);

      const allTeamMembers = TeamService.getAllTeamMembers();
      const assignedMemberIds = assignedMembers.map((m: any) => m.id);
      const available = allTeamMembers.filter(member =>
        member.status === 'active' && !assignedMemberIds.includes(member.id)
      );
      setAvailableTeamMembers(available);

      setShowAddTeamForm(false);
      setNewTeamAssignment({
        teamMemberId: '',
        hoursAllocated: 10,
        isLead: false
      });
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  const handleRemoveTeamMember = async (teamMemberId: string) => {
    if (!clientProfile) return;
    
    try {
      TeamService.removeTeamMemberFromClient(teamMemberId, clientId);

      // Reload team data
      const assignedMembers = TeamService.getTeamMembersForClient(clientId);
      setAssignedTeamMembers(assignedMembers);

      const allTeamMembers = TeamService.getAllTeamMembers();
      const assignedMemberIds = assignedMembers.map((m: any) => m.id);
      const available = allTeamMembers.filter(member => 
        member.status === 'active' && !assignedMemberIds.includes(member.id)
      );
      setAvailableTeamMembers(available);
    } catch (error) {
      console.error('Error removing team member:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fm-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto"></div>
          <p className="mt-4 text-fm-neutral-600">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error || !clientProfile) {
    return (
      <div className="min-h-screen bg-fm-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-fm-neutral-900 font-medium">{error || 'Client not found'}</p>
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Extract additional emails for portal link generation
  const additionalEmails = clientProfile.additionalContacts.map(contact => contact.email);

  return (
    <div className="min-h-screen bg-fm-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-fm-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => router.back()}
                  variant="ghost"
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                
                <div className="flex items-center space-x-4">
                  {clientProfile.logo && (
                    <img 
                      src={clientProfile.logo} 
                      alt={clientProfile.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-fm-neutral-900">{clientProfile.name}</h1>
                    <p className="text-fm-neutral-600 capitalize">
                      {clientProfile.industry} • Managed by {clientProfile.accountManager}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(clientProfile.status)}>
                  {clientProfile.status}
                </Badge>
                <div className={`flex items-center ${getHealthColor(clientProfile.health)}`}>
                  <div className="h-2 w-2 rounded-full bg-current mr-2"></div>
                  <span className="text-sm font-medium capitalize">{clientProfile.health}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portal">Client Portal</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
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

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-fm-neutral-600">Projects integration coming soon</p>
              </CardContent>
            </Card>
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
                      <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                        Select Team Member *
                      </label>
                      <select
                        value={newTeamAssignment.teamMemberId}
                        onChange={(e) => setNewTeamAssignment(prev => ({ ...prev, teamMemberId: e.target.value }))}
                        className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
                        required
                      >
                        <option value="">Choose a team member...</option>
                        {availableTeamMembers.map((member: any) => (
                          <option key={member.id} value={member.id}>
                            {member.name} - {TEAM_ROLES[member.role as TeamRole]}
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
                        max="40"
                        value={newTeamAssignment.hoursAllocated}
                        onChange={(e) => setNewTeamAssignment(prev => ({ ...prev, hoursAllocated: parseInt(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
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
                    <Button
                      onClick={() => setShowAddTeamForm(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddTeamMember}
                      disabled={!newTeamAssignment.teamMemberId}
                      className="flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Assign Team Member
                    </Button>
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
                  <Button
                    onClick={() => setShowAddTeamForm(true)}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Member
                  </Button>
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
                          <Badge variant="outline">
                            {member.status}
                          </Badge>
                          <Button
                            onClick={() => handleRemoveTeamMember(member.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-fm-neutral-900 mb-2">No Team Members Assigned</h3>
                    <p className="text-fm-neutral-500 mb-4">
                      This client doesn't have any team members assigned yet.
                    </p>
                    <Button
                      onClick={() => setShowAddTeamForm(true)}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Assign First Member
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-fm-neutral-600">Communication history coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
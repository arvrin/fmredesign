/**
 * Team Management Dashboard
 * Main team overview and directory page
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  Plus, 
  Filter,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Building,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  Award
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
import { TeamMember, TeamMetrics, TEAM_ROLES, TEAM_DEPARTMENTS } from '@/lib/admin/types';

export default function TeamDashboardPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamMetrics, setTeamMetrics] = useState<TeamMetrics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = () => {
    try {
      const members = TeamService.getAllTeamMembers();
      const metrics = TeamService.getTeamMetrics();
      
      setTeamMembers(members);
      setTeamMetrics(metrics);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      TEAM_ROLES[member.role].toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    const matchesType = selectedType === 'all' || member.type === selectedType;
    
    return matchesSearch && matchesDepartment && matchesType;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'on-leave': return 'warning';
      case 'terminated': return 'destructive';
      default: return 'secondary';
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fm-magenta-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-fm-neutral-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-fm-magenta-600" />
              Team Management
            </h1>
            <p className="text-sm text-fm-neutral-500 mt-1">
              Manage your in-house employees and freelancers
            </p>
          </div>
          <Button 
            variant="admin" 
            className="flex items-center gap-2"
            onClick={() => router.push('/admin/team/new')}
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </Button>
        </div>
      </div>

      {/* Team Metrics */}
      {teamMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Team"
            value={teamMetrics.totalMembers.toString()}
            subtitle={`${teamMetrics.activeMembers} active members`}
            icon={<Users className="w-6 h-6" />}
            variant="admin"
          />
          <MetricCard
            title="Employees"
            value={teamMetrics.employees.toString()}
            subtitle={`${teamMetrics.freelancers} freelancers`}
            icon={<Building className="w-6 h-6" />}
            variant="admin"
          />
          <MetricCard
            title="Team Utilization"
            value={`${teamMetrics.avgUtilization}%`}
            subtitle="Average workload"
            icon={<TrendingUp className="w-6 h-6" />}
            variant="admin"
            change={{
              value: teamMetrics.avgUtilization,
              type: teamMetrics.avgUtilization > 85 ? 'negative' : 'positive',
              period: 'utilization'
            }}
          />
          <MetricCard
            title="Total Capacity"
            value={`${teamMetrics.totalCapacity}h`}
            subtitle="Hours per week"
            icon={<Clock className="w-6 h-6" />}
            variant="admin"
          />
        </div>
      )}

      {/* Search and Filters */}
      <Card variant="admin">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            >
              <option value="all">All Departments</option>
              {Object.entries(TEAM_DEPARTMENTS).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            >
              <option value="all">All Types</option>
              <option value="employee">Employees</option>
              <option value="freelancer">Freelancers</option>
              <option value="contractor">Contractors</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Team Directory */}
      <Card variant="admin">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-fm-magenta-600" />
                Team Directory
              </CardTitle>
              <CardDescription>
                {filteredTeamMembers.length} of {teamMembers.length} team members
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            {filteredTeamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-fm-neutral-50 rounded-lg p-4 border border-fm-neutral-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-fm-magenta-100 flex items-center justify-center text-fm-magenta-600 font-semibold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    
                    {/* Member Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-fm-neutral-900">
                          {member.name}
                        </h3>
                        <Badge variant={getStatusBadgeVariant(member.status)}>
                          {member.status}
                        </Badge>
                        <Badge variant="outline">
                          {member.type}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <p className="text-fm-magenta-600 font-medium">
                            {TEAM_ROLES[member.role]} • {TEAM_DEPARTMENTS[member.department]}
                          </p>
                          <div className="flex items-center gap-2 text-fm-neutral-600">
                            <Mail className="w-4 h-4" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-fm-neutral-600">
                            <Phone className="w-4 h-4" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-fm-neutral-600">
                            <MapPin className="w-4 h-4" />
                            <span>{getLocationIcon(member.location)} {member.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-fm-neutral-600">
                            <Clock className="w-4 h-4" />
                            <span>{member.capacity}h/week</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-fm-neutral-600" />
                            <span className={`font-medium ${getWorkloadColor(member.workload)}`}>
                              {member.workload}% utilized
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      {member.skills.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {member.skills.slice(0, 6).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-fm-neutral-100 text-fm-neutral-700 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {member.skills.length > 6 && (
                              <span className="px-2 py-1 text-xs bg-fm-neutral-100 text-fm-neutral-700 rounded-full">
                                +{member.skills.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    {member.clientRatings > 0 && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{member.clientRatings}</span>
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => router.push(`/admin/team/${member.id}`)}
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/admin/team/${member.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTeamMembers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
/**
 * Projects Management Page
 * Professional project listing and management interface
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Users, 
  DollarSign, 
  Clock, 
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Circle
} from 'lucide-react';
import { 
  DashboardButton, 
  DashboardCard, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  MetricCard 
} from '@/design-system';
import type { Project, ProjectStatus, ProjectType } from '@/lib/admin/project-types';
import { ProjectUtils } from '@/lib/admin/project-types';

interface ProjectsPageProps {}

export default function ProjectsPage({}: ProjectsPageProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'startDate' | 'endDate' | 'status' | 'budget'>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects?sortBy=createdAt&sortDirection=desc');
        const result = await response.json();
        
        if (result.success) {
          setProjects(result.data);
          setFilteredProjects(result.data);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(project => project.type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'startDate' || sortBy === 'endDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'budget') {
        aValue = parseFloat(aValue.toString());
        bValue = parseFloat(bValue.toString());
      }

      if (sortDirection === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchQuery, statusFilter, typeFilter, sortBy, sortDirection]);

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'active':
        return <Circle className="h-4 w-4 text-blue-500 fill-current" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'paused':
        return <Circle className="h-4 w-4 text-orange-500" />;
      case 'cancelled':
        return <Circle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'planning':
        return 'bg-gray-100 text-gray-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId));
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fm-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fm-magenta-600 mx-auto mb-4"></div>
          <p className="text-fm-neutral-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fm-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 bg-clip-text text-transparent">Projects</h1>
            <p className="text-gray-600 font-medium">Manage client projects and deliverables</p>
          </div>
          <DashboardButton
            variant="admin"
            size="lg"
            onClick={() => router.push('/admin/projects/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </DashboardButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Projects"
            value={projects.length}
            subtitle="All projects"
            icon={<Calendar className="w-6 h-6" />}
            variant="admin"
          />

          <MetricCard
            title="Active Projects"
            value={projects.filter(p => p.status === 'active').length}
            subtitle="In progress"
            icon={<Circle className="w-6 h-6 fill-current" />}
            variant="admin"
            change={{
              value: Math.round((projects.filter(p => p.status === 'active').length / (projects.length || 1)) * 100),
              type: 'neutral',
              period: 'of total'
            }}
          />

          <MetricCard
            title="Total Budget"
            value={ProjectUtils.formatBudget(projects.reduce((sum, p) => sum + (p.budget || 0), 0))}
            subtitle="All projects value"
            icon={<DollarSign className="w-6 h-6" />}
            variant="admin"
          />

          <MetricCard
            title="Team Members"
            value={new Set(projects.flatMap(p => p.assignedTalent)).size}
            subtitle="Unique contributors"
            icon={<Users className="w-6 h-6" />}
            variant="admin"
          />
        </div>

        {/* Filters and Search */}
        <DashboardCard variant="admin" className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
                className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as ProjectType | 'all')}
                className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700"
              >
                <option value="all">All Types</option>
                <option value="social_media">Social Media</option>
                <option value="web_development">Web Development</option>
                <option value="branding">Branding</option>
                <option value="seo">SEO</option>
                <option value="paid_ads">Paid Ads</option>
                <option value="content_marketing">Content Marketing</option>
                <option value="full_service">Full Service</option>
              </select>

              <DashboardButton
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </DashboardButton>
            </div>
          </div>
        </DashboardCard>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-fm-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-fm-neutral-900 mb-2">No projects found</h3>
              <p className="text-fm-neutral-600 mb-4">
                {projects.length === 0 
                  ? "Get started by creating your first project"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {projects.length === 0 && (
                <DashboardButton onClick={() => router.push('/admin/projects/new')}>
                  Create First Project
                </DashboardButton>
              )}
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl border border-fm-neutral-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(project.status)}
                      <h3 className="text-lg font-semibold text-fm-neutral-900">
                        {project.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} title={`${project.priority} priority`}></div>
                    </div>
                    
                    <p className="text-fm-neutral-600 mb-4">{project.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-fm-neutral-500">Type:</span>
                        <span className="ml-2 font-medium">{project.type.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-fm-neutral-500">Budget:</span>
                        <span className="ml-2 font-medium">{ProjectUtils.formatBudget(project.budget)}</span>
                      </div>
                      <div>
                        <span className="text-fm-neutral-500">Timeline:</span>
                        <span className="ml-2 font-medium">
                          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-fm-neutral-500">Team:</span>
                        <span className="ml-2 font-medium">{project.assignedTalent.length} members</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-fm-neutral-700">Progress</span>
                        <span className="text-sm text-fm-neutral-600">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-fm-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-fm-magenta-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Tags */}
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-fm-neutral-100 text-fm-neutral-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-fm-neutral-100 text-fm-neutral-600 rounded-full">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <DashboardButton
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/projects/${project.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </DashboardButton>
                    <DashboardButton
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </DashboardButton>
                    <DashboardButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </DashboardButton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
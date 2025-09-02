/**
 * Lead Management Dashboard
 * Comprehensive lead tracking and conversion system for admin users
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Clock, 
  Search, 
  Filter,
  Plus,
  Download,
  Mail,
  Phone,
  Globe,
  Calendar,
  Tag,
  ArrowUpDown,
  MoreVertical,
  Eye,
  Edit,
  UserCheck,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  DashboardButton, 
  DashboardCard, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  MetricCard 
} from '@/design-system';
import { AddLeadModal } from '@/components/admin/AddLeadModal';
import type { 
  LeadProfile, 
  LeadStatus, 
  LeadPriority, 
  LeadSource, 
  LeadAnalytics,
  LeadDashboardStats,
  LeadFilters 
} from '@/lib/admin/lead-types';

interface LeadDashboardProps {}

export default function LeadDashboard({}: LeadDashboardProps) {
  const [leads, setLeads] = useState<LeadProfile[]>([]);
  const [analytics, setAnalytics] = useState<LeadAnalytics | null>(null);
  const [dashboardStats, setDashboardStats] = useState<LeadDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<LeadFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddLead, setShowAddLead] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, [filters, sortBy, sortDirection, searchQuery]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.status) params.set('status', filters.status.join(','));
      if (filters.priority) params.set('priority', filters.priority.join(','));
      if (filters.source) params.set('source', filters.source.join(','));
      if (searchQuery) params.set('search', searchQuery);
      
      params.set('sortBy', sortBy);
      params.set('sortDirection', sortDirection);

      // Fetch leads
      const leadsResponse = await fetch(`/api/leads?${params}`);
      const leadsData = await leadsResponse.json();
      
      if (leadsData.success) {
        setLeads(leadsData.data);
      }

      // Fetch analytics
      const analyticsResponse = await fetch('/api/leads/analytics?type=full');
      const analyticsData = await analyticsResponse.json();
      
      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/leads/analytics?type=dashboard');
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setDashboardStats(statsData.data);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: leadId,
          status
        }),
      });

      if (response.ok) {
        await loadDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const convertToClient = async (leadId: string) => {
    try {
      const response = await fetch('/api/leads/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId }),
      });

      if (response.ok) {
        await loadDashboardData(); // Refresh data
        alert('Lead successfully converted to client!');
      }
    } catch (error) {
      console.error('Error converting lead:', error);
      alert('Failed to convert lead to client');
    }
  };

  const getPriorityColor = (priority: LeadPriority) => {
    const colors = {
      hot: 'text-red-600 bg-red-100',
      warm: 'text-orange-600 bg-orange-100',
      cool: 'text-blue-600 bg-blue-100',
      cold: 'text-gray-600 bg-gray-100'
    };
    return colors[priority] || colors.cold;
  };

  const getStatusColor = (status: LeadStatus) => {
    const colors = {
      new: 'text-green-600 bg-green-100',
      contacted: 'text-blue-600 bg-blue-100',
      qualified: 'text-fm-magenta-600 bg-purple-100',
      discovery_scheduled: 'text-indigo-600 bg-indigo-100',
      discovery_completed: 'text-cyan-600 bg-cyan-100',
      proposal_sent: 'text-yellow-600 bg-yellow-100',
      negotiating: 'text-orange-600 bg-orange-100',
      won: 'text-green-600 bg-green-100',
      lost: 'text-red-600 bg-red-100',
      archived: 'text-gray-600 bg-gray-100'
    };
    return colors[status] || colors.new;
  };

  const formatStatus = (status: LeadStatus) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPriority = (priority: LeadPriority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 bg-clip-text text-transparent">Lead Management</h1>
          <p className="text-gray-600 mt-1 font-medium">Track, qualify, and convert your leads</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <DashboardButton variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </DashboardButton>
          <DashboardButton variant="admin" size="sm" onClick={() => setShowAddLead(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </DashboardButton>
        </div>
      </div>

      {/* Stats Cards */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalLeads}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600">+{dashboardStats.recentLeads}</span>
              <span className="text-gray-500 ml-1">new this week</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">{dashboardStats.hotLeads}</p>
              </div>
              <Target className="w-8 h-8 text-red-600" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Require immediate attention</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardStats.conversionRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Lead to client conversion</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Lead Value</p>
                <p className="text-2xl font-bold text-fm-magenta-600">
                  ₹{Math.round(dashboardStats.averageLeadValue / 1000)}K
                </p>
              </div>
              <Star className="w-8 h-8 text-fm-magenta-600" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Based on budget range</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-transparent"
              />
            </div>
            <DashboardButton variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </DashboardButton>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortBy(field);
                setSortDirection(direction as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-transparent"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="leadScore-desc">Highest Score</option>
              <option value="leadScore-asc">Lowest Score</option>
              <option value="company-asc">Company A-Z</option>
              <option value="company-desc">Company Z-A</option>
            </select>

            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'table'
                    ? 'bg-fm-magenta-600 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'cards'
                    ? 'bg-fm-magenta-600 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-fm-magenta-600 focus:ring-fm-magenta-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads(new Set(leads.map(l => l.id)));
                        } else {
                          setSelectedLeads(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLeads.has(lead.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedLeads);
                          if (e.target.checked) {
                            newSelected.add(lead.id);
                          } else {
                            newSelected.delete(lead.id);
                          }
                          setSelectedLeads(newSelected);
                        }}
                        className="rounded border-gray-300 text-fm-magenta-600 focus:ring-fm-magenta-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {lead.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                      {lead.website && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          <a 
                            href={lead.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {lead.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">{lead.companySize}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {lead.projectType.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {lead.projectDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lead.budgetRange.replace(/_/g, ' ').replace(/k/g, 'K')}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {lead.timeline.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                        {formatPriority(lead.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 ${getStatusColor(lead.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="discovery_scheduled">Discovery Scheduled</option>
                        <option value="discovery_completed">Discovery Completed</option>
                        <option value="proposal_sent">Proposal Sent</option>
                        <option value="negotiating">Negotiating</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.leadScore}
                        </div>
                        <div className="ml-2 w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-fm-magenta-600"
                            style={{ width: `${lead.leadScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <DashboardButton variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </DashboardButton>
                        <DashboardButton variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </DashboardButton>
                        {(lead.status === 'qualified' || lead.status === 'discovery_completed' || lead.status === 'proposal_sent') && (
                          <DashboardButton 
                            variant="ghost" 
                            size="sm"
                            onClick={() => convertToClient(lead.id)}
                          >
                            <UserCheck className="w-4 h-4 text-green-600" />
                          </DashboardButton>
                        )}
                        <DashboardButton variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </DashboardButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                    <p className="text-sm text-gray-600">{lead.company}</p>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                      {formatPriority(lead.priority)}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{lead.leadScore}/100</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 capitalize">
                    {lead.projectType.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {lead.projectDescription}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    Budget: <span className="font-medium">{lead.budgetRange.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {lead.timeline.replace(/_/g, ' ')}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                    className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${getStatusColor(lead.status)}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="discovery_scheduled">Discovery Scheduled</option>
                    <option value="discovery_completed">Discovery Completed</option>
                    <option value="proposal_sent">Proposal Sent</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                    <option value="archived">Archived</option>
                  </select>
                  
                  <div className="flex items-center space-x-1">
                    <DashboardButton variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </DashboardButton>
                    <DashboardButton variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </DashboardButton>
                    {(lead.status === 'qualified' || lead.status === 'discovery_completed' || lead.status === 'proposal_sent') && (
                      <DashboardButton 
                        variant="ghost" 
                        size="sm"
                        onClick={() => convertToClient(lead.id)}
                        title="Convert to Client"
                      >
                        <UserCheck className="w-4 h-4 text-green-600" />
                      </DashboardButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {leads.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || Object.keys(filters).length > 0
              ? 'Try adjusting your search or filters'
              : 'Get started by capturing your first lead'}
          </p>
          <DashboardButton variant="primary" onClick={() => setShowAddLead(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Lead
          </DashboardButton>
        </div>
      )}

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={showAddLead}
        onClose={() => setShowAddLead(false)}
        onLeadAdded={() => {
          loadDashboardData();
        }}
      />
    </div>
  );
}
/**
 * Lead Management Dashboard
 * Comprehensive lead tracking and conversion system for admin users
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { adminToast } from '@/lib/admin/toast';
import {
  DashboardButton,
  DashboardCard,
  CardContent,
  CardHeader,
  CardTitle,
  MetricCard,
  MetricCardSkeleton
} from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
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

export default function LeadDashboard() {
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
      adminToast.error('Failed to load lead data');
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
      adminToast.error('Failed to update lead status');
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
        adminToast.success('Lead successfully converted to client!');
      }
    } catch (error) {
      console.error('Error converting lead:', error);
      adminToast.error('Failed to convert lead to client');
    }
  };

  const [selectedLead, setSelectedLead] = useState<LeadProfile | null>(null);

  const exportLeads = useCallback(() => {
    if (leads.length === 0) return;
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Project Type', 'Budget', 'Status', 'Priority', 'Score', 'Created'];
    const rows = leads.map(l => [
      l.name, l.email, l.phone || '', l.company,
      l.projectType.replace(/_/g, ' '), l.budgetRange.replace(/_/g, ' '),
      l.status.replace(/_/g, ' '), l.priority, String(l.leadScore),
      new Date(l.createdAt).toLocaleDateString()
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [leads]);

  const formatStatus = (status: LeadStatus) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPriority = (priority: LeadPriority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Lead Management"
        description="Track, qualify, and convert your leads"
        actions={
          <div className="flex items-center gap-3">
            <DashboardButton variant="outline" size="sm" onClick={exportLeads}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </DashboardButton>
            <DashboardButton variant="admin" size="sm" onClick={() => setShowAddLead(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </DashboardButton>
          </div>
        }
      />

      {/* Stats Cards */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Leads"
            value={dashboardStats.totalLeads}
            subtitle={`+${dashboardStats.recentLeads} new this week`}
            icon={<Users className="w-6 h-6" />}
            variant="admin"
            change={{
              value: dashboardStats.recentLeads,
              type: dashboardStats.recentLeads > 0 ? 'increase' : 'neutral',
              period: 'this week'
            }}
          />

          <MetricCard
            title="Hot Leads"
            value={dashboardStats.hotLeads}
            subtitle="Require immediate attention"
            icon={<Target className="w-6 h-6" />}
            variant="admin"
            change={{
              value: dashboardStats.hotLeads,
              type: dashboardStats.hotLeads > 0 ? 'increase' : 'neutral',
              period: 'active'
            }}
          />

          <MetricCard
            title="Conversion Rate"
            value={`${dashboardStats.conversionRate.toFixed(1)}%`}
            subtitle="Lead to client conversion"
            icon={<TrendingUp className="w-6 h-6" />}
            variant="admin"
          />

          <MetricCard
            title="Avg Lead Value"
            value={`₹${Math.round(dashboardStats.averageLeadValue / 1000)}K`}
            subtitle="Based on budget range"
            icon={<Star className="w-6 h-6" />}
            variant="admin"
          />
        </div>
      )}

      {/* Filters and Search */}
      <DashboardCard variant="admin" className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-64">
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <DashboardButton variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </DashboardButton>
          </div>

          <div className="flex items-center space-x-4">
            <Select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortBy(field);
                setSortDirection(direction as 'asc' | 'desc');
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="leadScore-desc">Highest Score</option>
              <option value="leadScore-asc">Lowest Score</option>
              <option value="company-asc">Company A-Z</option>
              <option value="company-desc">Company Z-A</option>
            </Select>

            <div className="flex items-center gap-1 bg-white border border-fm-neutral-200 rounded-lg p-1">
              <DashboardButton
                variant={viewMode === 'table' ? 'admin' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="text-xs"
              >
                Table
              </DashboardButton>
              <DashboardButton
                variant={viewMode === 'cards' ? 'admin' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="text-xs"
              >
                Cards
              </DashboardButton>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Leads Table */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-fm-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-fm-neutral-200">
              <thead className="bg-fm-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-fm-neutral-300 text-fm-magenta-600 focus:ring-fm-magenta-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads(new Set(leads.map(l => l.id)));
                        } else {
                          setSelectedLeads(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-fm-neutral-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-fm-neutral-50">
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
                        className="rounded border-fm-neutral-300 text-fm-magenta-600 focus:ring-fm-magenta-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-fm-neutral-900">
                            {lead.name}
                          </div>
                          <div className="text-sm text-fm-neutral-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="text-sm text-fm-neutral-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-fm-neutral-900">{lead.company}</div>
                      {lead.website && (
                        <div className="text-sm text-fm-neutral-500 flex items-center">
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
                      <div className="text-xs text-fm-neutral-500">{lead.companySize}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-fm-neutral-900 capitalize">
                        {lead.projectType.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm text-fm-neutral-500 line-clamp-2">
                        {lead.projectDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-fm-neutral-900">
                        {lead.budgetRange.replace(/_/g, ' ').replace(/k/g, 'K')}
                      </div>
                      <div className="text-sm text-fm-neutral-500 capitalize">
                        {lead.timeline.replace(/_/g, ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={lead.priority}>
                        {formatPriority(lead.priority)}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className="text-xs font-medium rounded-full px-2.5 py-0.5 border border-fm-neutral-200 bg-white text-fm-neutral-700 focus:ring-2 focus:ring-fm-magenta-500 focus:border-transparent"
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
                        <div className="text-sm font-medium text-fm-neutral-900">
                          {lead.leadScore}
                        </div>
                        <div className="ml-2 w-12 bg-fm-neutral-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-fm-magenta-600"
                            style={{ width: `${lead.leadScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fm-neutral-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <DashboardButton variant="ghost" size="sm" onClick={() => setSelectedLead(lead)} title="View details">
                          <Eye className="w-4 h-4" />
                        </DashboardButton>
                        <DashboardButton variant="ghost" size="sm" onClick={() => setSelectedLead(lead)} title="Edit lead">
                          <Edit className="w-4 h-4" />
                        </DashboardButton>
                        {(lead.status === 'qualified' || lead.status === 'discovery_completed' || lead.status === 'proposal_sent') && (
                          <DashboardButton
                            variant="ghost"
                            size="sm"
                            onClick={() => convertToClient(lead.id)}
                            title="Convert to client"
                          >
                            <UserCheck className="w-4 h-4 text-green-600" />
                          </DashboardButton>
                        )}
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
            <div key={lead.id} className="bg-white rounded-xl border border-fm-neutral-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-fm-neutral-900">{lead.name}</h3>
                    <p className="text-sm text-fm-neutral-600">{lead.company}</p>
                    <p className="text-sm text-fm-neutral-500">{lead.email}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <StatusBadge status={lead.priority}>
                      {formatPriority(lead.priority)}
                    </StatusBadge>
                    <span className="text-sm font-medium text-fm-neutral-900">{lead.leadScore}/100</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-fm-neutral-700 capitalize">
                    {lead.projectType.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-fm-neutral-600 line-clamp-2 mt-1">
                    {lead.projectDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-fm-neutral-600">
                    Budget: <span className="font-medium">{lead.budgetRange.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-sm text-fm-neutral-600">
                    {lead.timeline.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                    className="text-xs font-medium rounded-full px-3 py-1 border border-fm-neutral-200 bg-white text-fm-neutral-700 focus:ring-2 focus:ring-fm-magenta-500 focus:border-transparent"
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
                    <DashboardButton variant="ghost" size="sm" onClick={() => setSelectedLead(lead)} title="View details">
                      <Eye className="w-4 h-4" />
                    </DashboardButton>
                    <DashboardButton variant="ghost" size="sm" onClick={() => setSelectedLead(lead)} title="Edit lead">
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
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No leads found"
          description={
            searchQuery || Object.keys(filters).length > 0
              ? 'Try adjusting your search or filters'
              : 'Get started by capturing your first lead'
          }
          action={
            <DashboardButton variant="admin" size="sm" onClick={() => setShowAddLead(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Lead
            </DashboardButton>
          }
        />
      )}

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedLead(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-fm-neutral-900">Lead Details</h2>
                <DashboardButton variant="ghost" size="sm" onClick={() => setSelectedLead(null)}>
                  &times;
                </DashboardButton>
              </div>
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-fm-neutral-900">{selectedLead.name}</h3>
                  <p className="text-sm text-fm-neutral-600">{selectedLead.company}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-fm-neutral-500 block">Email</span>
                    <a href={`mailto:${selectedLead.email}`} className="text-fm-magenta-600 font-medium">{selectedLead.email}</a>
                  </div>
                  {selectedLead.phone && (
                    <div>
                      <span className="text-fm-neutral-500 block">Phone</span>
                      <a href={`tel:${selectedLead.phone}`} className="text-fm-magenta-600 font-medium">{selectedLead.phone}</a>
                    </div>
                  )}
                  {selectedLead.website && (
                    <div>
                      <span className="text-fm-neutral-500 block">Website</span>
                      <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-fm-magenta-600 font-medium truncate block">{selectedLead.website.replace(/^https?:\/\//, '')}</a>
                    </div>
                  )}
                  <div>
                    <span className="text-fm-neutral-500 block">Company Size</span>
                    <p className="font-medium text-fm-neutral-900">{selectedLead.companySize}</p>
                  </div>
                </div>
                <hr className="border-fm-neutral-200" />
                <div className="space-y-3">
                  <div>
                    <span className="text-fm-neutral-500 text-sm block">Project Type</span>
                    <p className="font-medium text-fm-neutral-900 capitalize">{selectedLead.projectType.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <span className="text-fm-neutral-500 text-sm block">Description</span>
                    <p className="text-fm-neutral-700 text-sm">{selectedLead.projectDescription}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-fm-neutral-500 text-sm block">Budget</span>
                      <p className="font-medium text-fm-neutral-900">{selectedLead.budgetRange.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <span className="text-fm-neutral-500 text-sm block">Timeline</span>
                      <p className="font-medium text-fm-neutral-900 capitalize">{selectedLead.timeline.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-fm-neutral-500 text-sm block">Primary Challenge</span>
                    <p className="text-fm-neutral-700 text-sm">{selectedLead.primaryChallenge}</p>
                  </div>
                </div>
                <hr className="border-fm-neutral-200" />
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-fm-neutral-500 block">Status</span>
                    <StatusBadge status={selectedLead.status}>
                      {formatStatus(selectedLead.status)}
                    </StatusBadge>
                  </div>
                  <div>
                    <span className="text-fm-neutral-500 block">Priority</span>
                    <StatusBadge status={selectedLead.priority}>
                      {formatPriority(selectedLead.priority)}
                    </StatusBadge>
                  </div>
                  <div>
                    <span className="text-fm-neutral-500 block">Score</span>
                    <p className="font-bold text-fm-neutral-900">{selectedLead.leadScore}/100</p>
                  </div>
                </div>
                <div className="text-xs text-fm-neutral-500">
                  Created: {new Date(selectedLead.createdAt).toLocaleString()}
                </div>
                {(selectedLead.status === 'qualified' || selectedLead.status === 'discovery_completed' || selectedLead.status === 'proposal_sent') && (
                  <DashboardButton variant="admin" size="sm" onClick={() => { convertToClient(selectedLead.id); setSelectedLead(null); }} className="w-full justify-center">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Convert to Client
                  </DashboardButton>
                )}
              </div>
            </div>
          </div>
        </>
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

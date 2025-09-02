/**
 * Client Dashboard Component
 * Comprehensive client management interface for Freaking Minds Agency
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Calendar,
  MessageSquare,
  BarChart3,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Globe,
  MapPin
} from 'lucide-react';
import { 
  DashboardButton, 
  DashboardCard, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  MetricCard 
} from '@/design-system';
import { ClientUtils } from '@/lib/admin/client-types';
import { AddClientModal } from './AddClientModal';

// Define actual client data structure from API
interface ApiClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  industry: string;
  status: 'active' | 'inactive' | 'paused' | 'churned';
  createdAt: string;
  totalValue: string | number;
  health: 'excellent' | 'good' | 'warning' | 'critical';
}

type ClientHealth = 'excellent' | 'good' | 'warning' | 'critical';
type ClientStatus = 'active' | 'inactive' | 'paused' | 'churned';
import { ClientService } from '@/lib/admin/client-service';

interface ClientDashboardProps {
  onClientSelect?: (client: ApiClient) => void;
}

export function ClientDashboard({ onClientSelect }: ClientDashboardProps) {
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<ApiClient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ClientStatus | 'all'>('all');
  const [selectedHealth, setSelectedHealth] = useState<ClientHealth | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddClient, setShowAddClient] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    const initializeData = async () => {
      await loadClients();
      await loadDashboardStats();
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchQuery, selectedStatus, selectedHealth]);

  const loadClients = async () => {
    try {
      // Fetch directly from API instead of ClientService
      const response = await fetch('/api/clients');
      const result = await response.json();
      const clientData = result.success ? result.data : [];
      setClients(clientData);
    } catch (error) {
      console.error('Error loading clients:', error);
      // Fallback to empty array or show error message
      setClients([]);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const stats = await ClientService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setDashboardStats({
        totalClients: 0,
        activeClients: 0,
        activeCampaigns: 0,
        totalRevenue: 0,
        avgClientValue: 0,
        healthDistribution: {
          excellent: 0,
          good: 0,
          warning: 0,
          critical: 0
        },
        recentActivity: []
      });
    }
  };

  const filterClients = () => {
    let filtered = clients;

    // Search filter
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        (client.industry && client.industry.toLowerCase().includes(searchTerm)) ||
        (client.email && client.email.toLowerCase().includes(searchTerm)) ||
        (client.company && client.company.toLowerCase().includes(searchTerm))
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(client => client.status === selectedStatus);
    }

    // Health filter
    if (selectedHealth !== 'all') {
      filtered = filtered.filter(client => client.health === selectedHealth);
    }

    setFilteredClients(filtered);
  };

  const getHealthIcon = (health: ClientHealth) => {
    // Handle null, undefined, or invalid health values
    const safeHealth = health || 'good';
    
    switch (safeHealth) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: ClientStatus) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
      churned: 'bg-red-100 text-red-800'
    };

    // Handle null, undefined, or invalid status
    const safeStatus = status || 'active';

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[safeStatus] || colors.active}`}>
        {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
      </span>
    );
  };

  const handleClientClick = (client: ApiClient) => {
    if (onClientSelect) {
      onClientSelect(client);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 bg-clip-text text-transparent">Client Management</h1>
            <p className="text-gray-600 mt-1 font-medium">
              Manage your agency relationships and track client success
            </p>
          </div>
          <DashboardButton
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddClient(true)}
          >
            Add New Client
          </DashboardButton>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Clients"
            value={dashboardStats.totalClients}
            subtitle={`${dashboardStats.activeClients} active`}
            icon={<Users className="w-6 h-6" />}
            variant="admin"
            change={{
              value: Math.round((dashboardStats.activeClients / dashboardStats.totalClients) * 100),
              type: 'increase',
              period: 'active rate'
            }}
          />

          <MetricCard
            title="Active Campaigns"
            value={dashboardStats.activeCampaigns}
            subtitle="Currently running"
            icon={<Target className="w-6 h-6" />}
            variant="admin"
          />

          <MetricCard
            title="Total Revenue"
            value={ClientUtils.formatCurrency(dashboardStats.totalRevenue)}
            subtitle={`Avg: ${ClientUtils.formatCurrency(dashboardStats.avgClientValue)}`}
            icon={<DollarSign className="w-6 h-6" />}
            variant="admin"
          />

          <MetricCard
            title="Health Score"
            value={`${dashboardStats.healthDistribution.excellent + dashboardStats.healthDistribution.good}/${dashboardStats.totalClients}`}
            subtitle="Healthy clients"
            icon={<Activity className="w-6 h-6" />}
            variant="admin"
          />
        </div>
      )}

      {/* Filters and Search */}
      <DashboardCard variant="admin" className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
            <input
              type="text"
              placeholder="Search clients by name, industry, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ClientStatus | 'all')}
            className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="paused">Paused</option>
            <option value="churned">Churned</option>
          </select>

          {/* Health Filter */}
          <select
            value={selectedHealth}
            onChange={(e) => setSelectedHealth(e.target.value as ClientHealth | 'all')}
            className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
          >
            <option value="all">All Health</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <DashboardButton
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </DashboardButton>
            <DashboardButton
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </DashboardButton>
          </div>
        </div>
      </DashboardCard>

      {/* Client Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
      }>
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className={`bg-white rounded-xl shadow-sm border border-fm-neutral-200 hover:shadow-md transition-shadow cursor-pointer ${
              viewMode === 'list' ? 'p-4' : 'p-6'
            }`}
            onClick={() => handleClientClick(client)}
          >
            {viewMode === 'grid' ? (
              // Grid View
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-fm-magenta-100 rounded-lg flex items-center justify-center">
                      <span className="text-fm-magenta-700 font-bold text-lg">
                        {client.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-fm-neutral-900">{client.name}</h3>
                      <p className="text-sm text-fm-neutral-600">
                        {client.industry || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getHealthIcon(client.health)}
                    <button className="p-1 hover:bg-fm-neutral-100 rounded">
                      <MoreVertical className="h-4 w-4 text-fm-neutral-400" />
                    </button>
                  </div>
                </div>

                {/* Status and Value */}
                <div className="flex items-center justify-between">
                  {getStatusBadge(client.status)}
                  <span className="text-sm font-medium text-fm-neutral-900">
                    {ClientUtils.formatCurrency(client.totalValue || 0)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-fm-neutral-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {client.email || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-fm-neutral-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {client.phone || 'N/A'}
                  </div>
                </div>

                {/* Account Manager */}
                <div className="pt-3 border-t border-fm-neutral-100">
                  <p className="text-xs text-fm-neutral-500 uppercase tracking-wide">
                    Account Manager
                  </p>
                  <p className="text-sm font-medium text-fm-neutral-900">
                    Freaking Minds Team
                  </p>
                </div>

                {/* Action DashboardButtons */}
                <div className="flex space-x-2 pt-2">
                  <DashboardButton size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </DashboardButton>
                  <DashboardButton size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </DashboardButton>
                  <DashboardButton size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4" />
                  </DashboardButton>
                </div>
              </div>
            ) : (
              // List View
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-fm-magenta-100 rounded-lg flex items-center justify-center">
                    <span className="text-fm-magenta-700 font-bold">
                      {client.name?.charAt(0) || 'C'}
                    </span>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-semibold text-fm-neutral-900">{client.name}</h3>
                      <p className="text-sm text-fm-neutral-600">
                        {client.industry || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-fm-neutral-600">{client.name}</p>
                      <p className="text-xs text-fm-neutral-500">{client.email || 'N/A'}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(client.status)}
                      {getHealthIcon(client.health)}
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-fm-neutral-900">
                        {ClientUtils.formatCurrency(client.totalValue || 0)}
                      </p>
                      <p className="text-xs text-fm-neutral-500">
                        {client.status === 'active' ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <DashboardButton size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </DashboardButton>
                  <DashboardButton size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </DashboardButton>
                  <DashboardButton size="sm" variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </DashboardButton>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-12 text-center">
          <Users className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">
            No clients found
          </h3>
          <p className="text-fm-neutral-600 mb-6">
            {searchQuery || selectedStatus !== 'all' || selectedHealth !== 'all'
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by adding your first client.'}
          </p>
          <DashboardButton
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddClient(true)}
          >
            Add New Client
          </DashboardButton>
        </div>
      )}

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={showAddClient}
        onClose={() => setShowAddClient(false)}
        onClientAdded={() => {
          loadClients();
          loadDashboardStats();
        }}
      />
    </div>
  );
}
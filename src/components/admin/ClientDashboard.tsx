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
import { Button } from '@/design-system/components/atoms/Button/Button';
import { ClientProfile, ClientHealth, ClientStatus, ClientUtils, INDUSTRIES } from '@/lib/admin/client-types';
import { ClientService } from '@/lib/admin/client-service';

interface ClientDashboardProps {
  onClientSelect?: (client: ClientProfile) => void;
}

export function ClientDashboard({ onClientSelect }: ClientDashboardProps) {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ClientStatus | 'all'>('all');
  const [selectedHealth, setSelectedHealth] = useState<ClientHealth | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddClient, setShowAddClient] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    const initializeData = async () => {
      await loadClients();
      loadDashboardStats();
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchQuery, selectedStatus, selectedHealth]);

  const loadClients = async () => {
    try {
      const clientData = await ClientService.getAllClients();
      setClients(clientData);
    } catch (error) {
      console.error('Error loading clients:', error);
      // Fallback to empty array or show error message
      setClients([]);
    }
  };

  const loadDashboardStats = () => {
    const stats = ClientService.getDashboardStats();
    setDashboardStats(stats);
  };

  const filterClients = () => {
    let filtered = clients;

    // Search filter
    if (searchQuery) {
      filtered = ClientService.searchClients(searchQuery);
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
    switch (health) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: ClientStatus) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
      churned: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleClientClick = (client: ClientProfile) => {
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
            <h1 className="text-3xl font-bold text-fm-neutral-900">Client Management</h1>
            <p className="text-fm-neutral-600 mt-1">
              Manage your agency relationships and track client success
            </p>
          </div>
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddClient(true)}
          >
            Add New Client
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-fm-neutral-600">Total Clients</p>
                <p className="text-2xl font-bold text-fm-neutral-900">
                  {dashboardStats.totalClients}
                </p>
              </div>
              <div className="p-3 bg-fm-magenta-50 rounded-lg">
                <Users className="h-6 w-6 text-fm-magenta-700" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-medium">
                {dashboardStats.activeClients} active
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-fm-neutral-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-fm-neutral-900">
                  {dashboardStats.activeCampaigns}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Target className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-fm-neutral-600">Total Revenue</p>
                <p className="text-2xl font-bold text-fm-neutral-900">
                  {ClientUtils.formatCurrency(dashboardStats.totalRevenue)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-fm-neutral-600">
                Avg: {ClientUtils.formatCurrency(dashboardStats.avgClientValue)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-fm-neutral-600">Health Distribution</p>
                <div className="flex space-x-2 mt-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-fm-neutral-600">{dashboardStats.healthDistribution.excellent}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                    <span className="text-xs text-fm-neutral-600">{dashboardStats.healthDistribution.warning}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span className="text-xs text-fm-neutral-600">{dashboardStats.healthDistribution.critical}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Activity className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
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
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>
      </div>

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
                        {client.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-fm-neutral-900">{client.name}</h3>
                      <p className="text-sm text-fm-neutral-600">
                        {INDUSTRIES[client.industry]}
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
                    {ClientUtils.formatCurrency(client.contractDetails.value)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-fm-neutral-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {client.primaryContact.email}
                  </div>
                  <div className="flex items-center text-sm text-fm-neutral-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {client.primaryContact.phone || 'N/A'}
                  </div>
                </div>

                {/* Account Manager */}
                <div className="pt-3 border-t border-fm-neutral-100">
                  <p className="text-xs text-fm-neutral-500 uppercase tracking-wide">
                    Account Manager
                  </p>
                  <p className="text-sm font-medium text-fm-neutral-900">
                    {client.accountManager}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              // List View
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-fm-magenta-100 rounded-lg flex items-center justify-center">
                    <span className="text-fm-magenta-700 font-bold">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-semibold text-fm-neutral-900">{client.name}</h3>
                      <p className="text-sm text-fm-neutral-600">
                        {INDUSTRIES[client.industry]}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-fm-neutral-600">{client.primaryContact.name}</p>
                      <p className="text-xs text-fm-neutral-500">{client.primaryContact.email}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(client.status)}
                      {getHealthIcon(client.health)}
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-fm-neutral-900">
                        {ClientUtils.formatCurrency(client.contractDetails.value)}
                      </p>
                      <p className="text-xs text-fm-neutral-500">
                        {client.contractDetails.billingCycle}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
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
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddClient(true)}
          >
            Add New Client
          </Button>
        </div>
      )}
    </div>
  );
}
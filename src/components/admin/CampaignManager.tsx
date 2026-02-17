/**
 * Campaign Management Component
 * Professional campaign and deliverables management for agency operations
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Target,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Play,
  Pause,
  Square,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Filter,
  Search,
  TrendingUp,
  FileText,
  MessageSquare,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  Upload,
  Download,
  ThumbsUp,
  ThumbsDown,
  Send,
  Star
} from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';
import { 
  Campaign, 
  Deliverable, 
  CampaignStatus, 
  CampaignType,
  DeliverableStatus,
  ClientProfile,
  ClientUtils,
  CAMPAIGN_TYPES 
} from '@/lib/admin/client-types';
import { ClientService } from '@/lib/admin/client-service';

interface CampaignManagerProps {
  clientId?: string; // If provided, show campaigns for specific client
  showClientColumn?: boolean; // Show client column in table view
}

export function CampaignManager({ clientId, showClientColumn = true }: CampaignManagerProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [activeTab, setActiveTab] = useState<'campaigns' | 'deliverables' | 'calendar'>('campaigns');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CampaignType | 'all'>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [clientId]);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchQuery, statusFilter, typeFilter, clientFilter]);

  const loadData = () => {
    const allClients = ClientService.getAllClients();
    setClients(allClients);

    let campaignData: Campaign[];
    if (clientId) {
      campaignData = ClientService.getCampaignsByClient(clientId);
    } else {
      campaignData = ClientService.getAllCampaigns();
    }
    setCampaigns(campaignData);

    const deliverableData = ClientService.getAllDeliverables();
    setDeliverables(deliverableData);
  };

  const filterCampaigns = () => {
    let filtered = campaigns;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.type === typeFilter);
    }

    // Client filter
    if (clientFilter !== 'all' && !clientId) {
      filtered = filtered.filter(campaign => campaign.clientId === clientFilter);
    }

    setFilteredCampaigns(filtered);
  };

  const getStatusColor = (status: CampaignStatus) => {
    const colors = {
      planning: 'bg-fm-neutral-100 text-fm-neutral-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getStatusIcon = (status: CampaignStatus) => {
    switch (status) {
      case 'planning': return <Clock className="h-4 w-4" />;
      case 'active': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <Square className="h-4 w-4" />;
    }
  };

  const getDeliverableStatusColor = (status: DeliverableStatus) => {
    const colors = {
      not_started: 'bg-fm-neutral-100 text-fm-neutral-800',
      in_progress: 'bg-blue-100 text-blue-800',
      review: 'bg-yellow-100 text-yellow-800',
      revisions: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      delivered: 'bg-purple-100 text-purple-800'
    };
    return colors[status];
  };

  const getCampaignClient = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    return clients.find(client => client.id === campaign?.clientId);
  };

  const getCampaignDeliverables = (campaignId: string) => {
    return deliverables.filter(d => d.campaignId === campaignId);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">
              {clientId ? 'Client Campaigns' : 'Campaign Management'}
            </h2>
            <p className="text-fm-neutral-600 mt-1">
              Track and manage all marketing campaigns and deliverables
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button size="sm" icon={<Plus className="h-4 w-4" />}>
              New Campaign
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6 bg-fm-neutral-100 p-1 rounded-lg w-fit">
          {[
            { id: 'campaigns', name: 'Campaigns', icon: Target },
            { id: 'deliverables', name: 'Deliverables', icon: FileText },
            { id: 'calendar', name: 'Calendar', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-fm-magenta-700 shadow-sm'
                    : 'text-fm-neutral-600 hover:text-fm-neutral-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
            <input
              type="text"
              placeholder="Search campaigns or deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | 'all')}
              className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as CampaignType | 'all')}
              className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {Object.entries(CAMPAIGN_TYPES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>

            {!clientId && showClientColumn && (
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
              >
                <option value="all">All Clients</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 border border-fm-neutral-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-fm-magenta-100 text-fm-magenta-700' : 'text-fm-neutral-600'}`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-fm-magenta-100 text-fm-magenta-700' : 'text-fm-neutral-600'}`}
              >
                <FileText className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-fm-magenta-100 text-fm-magenta-700' : 'text-fm-neutral-600'}`}
              >
                <PieChart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-fm-neutral-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-fm-neutral-900">
                    {filteredCampaigns.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Play className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-fm-neutral-600">Total Budget</p>
                  <p className="text-2xl font-bold text-fm-neutral-900">
                    {ClientUtils.formatCurrency(
                      filteredCampaigns.reduce((sum, c) => sum + c.budget, 0)
                    )}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-fm-neutral-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-fm-neutral-900">
                    {Math.round(
                      filteredCampaigns.reduce((sum, c) => sum + c.progress, 0) / filteredCampaigns.length || 0
                    )}%
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-fm-neutral-600">Deliverables</p>
                  <p className="text-2xl font-bold text-fm-neutral-900">
                    {deliverables.filter(d => 
                      filteredCampaigns.some(c => c.id === d.campaignId)
                    ).length}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Grid/List */}
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : viewMode === 'kanban'
              ? 'grid grid-cols-1 md:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {viewMode === 'kanban' ? (
              // Kanban Board
              <>
                {['planning', 'active', 'paused', 'completed'].map((status) => (
                  <div key={status} className="bg-white rounded-xl shadow-sm border border-fm-neutral-200">
                    <div className="p-4 border-b border-fm-neutral-200">
                      <h3 className="font-semibold text-fm-neutral-900 capitalize flex items-center">
                        {getStatusIcon(status as CampaignStatus)}
                        <span className="ml-2">{status}</span>
                        <span className="ml-2 text-sm text-fm-neutral-500">
                          ({filteredCampaigns.filter(c => c.status === status).length})
                        </span>
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {filteredCampaigns
                        .filter(campaign => campaign.status === status)
                        .map((campaign) => {
                          const client = getCampaignClient(campaign.id);
                          return (
                            <div
                              key={campaign.id}
                              className="p-3 border border-fm-neutral-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setSelectedCampaign(campaign)}
                            >
                              <h4 className="font-medium text-fm-neutral-900 text-sm mb-1">
                                {campaign.name}
                              </h4>
                              {client && (
                                <p className="text-xs text-fm-neutral-500 mb-2">{client.name}</p>
                              )}
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-fm-neutral-600">
                                  {campaign.progress}% complete
                                </span>
                                <span className="text-fm-neutral-600">
                                  {ClientUtils.formatCurrency(campaign.budget)}
                                </span>
                              </div>
                              <div className="mt-2 w-full bg-fm-neutral-200 rounded-full h-1">
                                <div 
                                  className={`h-1 rounded-full ${getProgressColor(campaign.progress)}`}
                                  style={{ width: `${campaign.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Grid and List View
              filteredCampaigns.map((campaign) => {
                const client = getCampaignClient(campaign.id);
                const campaignDeliverables = getCampaignDeliverables(campaign.id);

                return viewMode === 'grid' ? (
                  // Grid Card
                  <div
                    key={campaign.id}
                    className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-fm-neutral-900 mb-1">{campaign.name}</h3>
                          {client && !clientId && (
                            <p className="text-sm text-fm-neutral-600">{client.name}</p>
                          )}
                          <span className="text-xs text-fm-neutral-500">
                            {CAMPAIGN_TYPES[campaign.type]}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                          <button className="p-1 hover:bg-fm-neutral-100 rounded">
                            <MoreVertical className="h-4 w-4 text-fm-neutral-400" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-fm-neutral-600 line-clamp-2">
                        {campaign.description}
                      </p>

                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-fm-neutral-600">Progress</span>
                          <span className="font-medium text-fm-neutral-900">{campaign.progress}%</span>
                        </div>
                        <div className="w-full bg-fm-neutral-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(campaign.progress)}`}
                            style={{ width: `${campaign.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-fm-neutral-500">Budget</p>
                          <p className="font-medium text-fm-neutral-900">
                            {ClientUtils.formatCurrency(campaign.budget)}
                          </p>
                        </div>
                        <div>
                          <p className="text-fm-neutral-500">Spent</p>
                          <p className="font-medium text-fm-neutral-900">
                            {ClientUtils.formatCurrency(campaign.spentAmount)}
                          </p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="text-sm">
                        <p className="text-fm-neutral-500">Timeline</p>
                        <p className="font-medium text-fm-neutral-900">
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Deliverables */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-fm-neutral-600">
                          {campaignDeliverables.length} deliverable(s)
                        </span>
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List Item
                  <div
                    key={campaign.id}
                    className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-fm-magenta-100 rounded-lg flex items-center justify-center">
                          <Target className="h-5 w-5 text-fm-magenta-700" />
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="md:col-span-2">
                            <h3 className="font-semibold text-fm-neutral-900">{campaign.name}</h3>
                            <p className="text-sm text-fm-neutral-600">
                              {client?.name} • {CAMPAIGN_TYPES[campaign.type]}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-fm-neutral-900">
                              {ClientUtils.formatCurrency(campaign.budget)}
                            </p>
                            <p className="text-xs text-fm-neutral-500">
                              {ClientUtils.formatCurrency(campaign.spentAmount)} spent
                            </p>
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                {campaign.status}
                              </span>
                            </div>
                            <p className="text-xs text-fm-neutral-500 mt-1">
                              {campaign.progress}% complete
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm font-medium text-fm-neutral-900">
                              {new Date(campaign.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-fm-neutral-500">
                              {campaignDeliverables.length} deliverables
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
                  </div>
                );
              })
            )}
          </div>

          {/* Empty State */}
          {filteredCampaigns.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-12 text-center">
              <Target className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">
                No campaigns found
              </h3>
              <p className="text-fm-neutral-600 mb-6">
                Create your first campaign or adjust your filters
              </p>
              <Button icon={<Plus className="h-4 w-4" />}>
                Create New Campaign
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Deliverables Tab */}
      {activeTab === 'deliverables' && (
        <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-fm-neutral-900">Deliverables</h3>
            <Button size="sm" icon={<Plus className="h-4 w-4" />}>
              Add Deliverable
            </Button>
          </div>
          
          <div className="space-y-4">
            {deliverables
              .filter(deliverable => 
                !clientId || filteredCampaigns.some(c => c.id === deliverable.campaignId)
              )
              .map((deliverable) => {
                const campaign = campaigns.find(c => c.id === deliverable.campaignId);
                const client = campaign ? getCampaignClient(campaign.id) : null;
                
                return (
                  <div key={deliverable.id} className="border border-fm-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-fm-neutral-900">{deliverable.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliverableStatusColor(deliverable.status)}`}>
                            {deliverable.status.replace('_', ' ')}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-fm-neutral-100 text-fm-neutral-700 capitalize">
                            {deliverable.type}
                          </span>
                        </div>
                        <p className="text-sm text-fm-neutral-600 mb-3">{deliverable.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-fm-neutral-500">Campaign</p>
                            <p className="font-medium text-fm-neutral-900">{campaign?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-fm-neutral-500">Client</p>
                            <p className="font-medium text-fm-neutral-900">{client?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-fm-neutral-500">Due Date</p>
                            <p className="font-medium text-fm-neutral-900">
                              {new Date(deliverable.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-fm-neutral-500">Assigned To</p>
                            <p className="font-medium text-fm-neutral-900">{deliverable.assignedTo}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {deliverable.status === 'review' && (
                          <>
                            <Button size="sm" variant="outline">
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
            {deliverables.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
                <h4 className="font-semibold text-fm-neutral-900 mb-2">No deliverables yet</h4>
                <p className="text-fm-neutral-600">Create deliverables for your campaigns</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
            <h4 className="font-semibold text-fm-neutral-900 mb-2">Campaign Calendar</h4>
            <p className="text-fm-neutral-600">
              Timeline view of all campaigns and deliverable due dates
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
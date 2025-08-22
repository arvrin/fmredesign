/**
 * Client Profile Component
 * Detailed client view with all phases integrated
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Edit,
  MoreVertical,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  MessageSquare,
  FileText,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Globe,
  MapPin,
  Building,
  User,
  Briefcase,
  BarChart3,
  PieChart,
  Activity,
  Upload,
  Download,
  Send,
  Plus,
  Filter,
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Star,
  Zap,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/design-system/components/atoms/Button/Button';
import { 
  ClientProfile as ClientProfileType, 
  Campaign, 
  ClientAnalytics, 
  Deliverable, 
  GrowthOpportunity,
  ClientUtils,
  INDUSTRIES,
  CAMPAIGN_TYPES,
  ClientHealth 
} from '@/lib/admin/client-types';
import { ClientService } from '@/lib/admin/client-service-enhanced';
import { CommunicationHub } from './CommunicationHub';
import { DocumentManager } from './DocumentManager';
import { GrowthEngine } from './GrowthEngine';

interface ClientProfileProps {
  clientId: string;
  onBack: () => void;
}

export function ClientProfile({ clientId, onBack }: ClientProfileProps) {
  const [client, setClient] = useState<ClientProfileType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'analytics' | 'communication' | 'files' | 'opportunities'>('overview');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<ClientAnalytics | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [opportunities, setOpportunities] = useState<GrowthOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    setLoading(true);
    
    // Load client profile
    const clientData = await ClientService.getClientById(clientId);
    setClient(clientData);
    
    if (clientData) {
      // Load related data
      const campaignData = ClientService.getCampaignsByClient(clientId);
      setCampaigns(campaignData);
      
      const analyticsData = ClientService.getClientAnalytics(clientId);
      setAnalytics(analyticsData);
      
      const deliverablesData = ClientService.getClientDeliverables(clientId);
      setDeliverables(deliverablesData);
      
      const opportunityData = ClientService.getGrowthOpportunities(clientId);
      setOpportunities(opportunityData);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-fm-neutral-200 rounded w-1/3"></div>
          <div className="h-64 bg-fm-neutral-200 rounded"></div>
          <div className="h-96 bg-fm-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold text-fm-neutral-900">Client not found</h2>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
      </div>
    );
  }

  const getHealthColor = (health: ClientHealth) => {
    const colors = {
      excellent: 'text-green-600 bg-green-50',
      good: 'text-blue-600 bg-blue-50',
      warning: 'text-yellow-600 bg-yellow-50',
      critical: 'text-red-600 bg-red-50'
    };
    return colors[health];
  };

  const getHealthIcon = (health: ClientHealth) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="h-5 w-5" />;
      case 'good': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertCircle className="h-5 w-5" />;
      case 'critical': return <AlertCircle className="h-5 w-5" />;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'campaigns', name: 'Campaigns', icon: Target },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'communication', name: 'Communication', icon: MessageSquare },
    { id: 'files', name: 'Files & Assets', icon: FileText },
    { id: 'opportunities', name: 'Growth', icon: TrendingUp }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-fm-magenta-100 rounded-xl flex items-center justify-center">
                <span className="text-fm-magenta-700 font-bold text-2xl">
                  {client.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-fm-neutral-900">{client.name}</h1>
                <p className="text-fm-neutral-600">{INDUSTRIES[client.industry]}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(client.health)}`}>
                    {getHealthIcon(client.health)}
                    <span className="capitalize">{client.health}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 capitalize">
                    {client.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-fm-magenta-700 text-white'
                    : 'text-fm-neutral-600 hover:text-fm-neutral-900 hover:bg-fm-neutral-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-fm-neutral-400" />
                      <div>
                        <p className="text-sm text-fm-neutral-600">Company Size</p>
                        <p className="font-medium text-fm-neutral-900 capitalize">{client.companySize}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-fm-neutral-400" />
                      <div>
                        <p className="text-sm text-fm-neutral-600">Founded</p>
                        <p className="font-medium text-fm-neutral-900">{client.founded || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-fm-neutral-400" />
                      <div>
                        <p className="text-sm text-fm-neutral-600">Website</p>
                        <a href={client.website} target="_blank" rel="noopener noreferrer" 
                           className="font-medium text-fm-magenta-700 hover:underline">
                          {client.website}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-fm-neutral-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-fm-neutral-600">Headquarters</p>
                        <p className="font-medium text-fm-neutral-900">
                          {client.headquarters.city}, {client.headquarters.state}
                          <br />
                          {client.headquarters.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-fm-neutral-400" />
                      <div>
                        <p className="text-sm text-fm-neutral-600">Account Manager</p>
                        <p className="font-medium text-fm-neutral-900">{client.accountManager}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">Primary Contact</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-fm-neutral-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-fm-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-fm-neutral-900">{client.primaryContact.name}</h4>
                    <p className="text-sm text-fm-neutral-600">{client.primaryContact.role}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <a href={`mailto:${client.primaryContact.email}`} 
                         className="flex items-center text-sm text-fm-neutral-600 hover:text-fm-magenta-700">
                        <Mail className="h-4 w-4 mr-1" />
                        {client.primaryContact.email}
                      </a>
                      {client.primaryContact.phone && (
                        <a href={`tel:${client.primaryContact.phone}`} 
                           className="flex items-center text-sm text-fm-neutral-600 hover:text-fm-magenta-700">
                          <Phone className="h-4 w-4 mr-1" />
                          {client.primaryContact.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {client.description && (
                <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">About</h3>
                  <p className="text-fm-neutral-700 leading-relaxed">{client.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contract Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">Contract Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-fm-neutral-600">Contract Value</p>
                    <p className="text-2xl font-bold text-fm-neutral-900">
                      {ClientUtils.formatCurrency(client.contractDetails.value)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-fm-neutral-600">Type</p>
                      <p className="font-medium text-fm-neutral-900 capitalize">
                        {client.contractDetails.type.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-fm-neutral-600">Billing</p>
                      <p className="font-medium text-fm-neutral-900 capitalize">
                        {client.contractDetails.billingCycle.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-fm-neutral-600">Contract Period</p>
                    <p className="font-medium text-fm-neutral-900">
                      {new Date(client.contractDetails.startDate).toLocaleDateString()} - 
                      {client.contractDetails.endDate ? new Date(client.contractDetails.endDate).toLocaleDateString() : 'Ongoing'}
                    </p>
                  </div>
                  {client.contractDetails.endDate && (
                    <div>
                      <p className="text-sm text-fm-neutral-600">Days Remaining</p>
                      <p className="font-medium text-fm-neutral-900">
                        {ClientUtils.getContractTimeRemaining(client.contractDetails)} days
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Active Campaigns</span>
                    <span className="font-medium text-fm-neutral-900">
                      {campaigns.filter(c => c.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Total Campaigns</span>
                    <span className="font-medium text-fm-neutral-900">{campaigns.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Pending Deliverables</span>
                    <span className="font-medium text-fm-neutral-900">
                      {deliverables.filter(d => ['in_progress', 'review'].includes(d.status)).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Growth Opportunities</span>
                    <span className="font-medium text-fm-neutral-900">
                      {opportunities.filter(o => ['identified', 'proposed'].includes(o.status)).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {client.tags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-fm-neutral-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-fm-neutral-100 text-fm-neutral-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-fm-neutral-900">Campaigns & Projects</h3>
                <Button size="sm" icon={<Plus className="h-4 w-4" />}>
                  New Campaign
                </Button>
              </div>
              
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-fm-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-fm-neutral-900">{campaign.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                            campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-fm-neutral-100 text-fm-neutral-700">
                            {CAMPAIGN_TYPES[campaign.type]}
                          </span>
                        </div>
                        <p className="text-sm text-fm-neutral-600 mb-3">{campaign.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                          <div>
                            <p className="text-fm-neutral-500">Progress</p>
                            <p className="font-medium text-fm-neutral-900">{campaign.progress}%</p>
                          </div>
                          <div>
                            <p className="text-fm-neutral-500">End Date</p>
                            <p className="font-medium text-fm-neutral-900">
                              {new Date(campaign.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="w-full bg-fm-neutral-200 rounded-full h-2">
                            <div 
                              className="bg-fm-magenta-600 h-2 rounded-full" 
                              style={{ width: `${campaign.progress}%` }}
                            ></div>
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
                      </div>
                    </div>
                  </div>
                ))}
                
                {campaigns.length === 0 && (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-fm-neutral-900 mb-2">No campaigns yet</h4>
                    <p className="text-fm-neutral-600">Create the first campaign for this client</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Social Media Metrics */}
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-fm-neutral-900">Followers</h4>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-fm-neutral-900">
                  {analytics.socialMedia.followers.current.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">
                  +{analytics.socialMedia.followers.changePercent}% from last period
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-fm-neutral-900">Engagement</h4>
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-fm-neutral-900">
                  {analytics.socialMedia.engagement.current}%
                </p>
                <p className="text-sm text-green-600">
                  +{analytics.socialMedia.engagement.changePercent}% from last period
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-fm-neutral-900">Website Traffic</h4>
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-fm-neutral-900">
                  {analytics.website.traffic.current.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">
                  +{analytics.website.traffic.changePercent}% from last period
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-fm-neutral-900">ROAS</h4>
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-fm-neutral-900">
                  {analytics.paidAds.roas.current}x
                </p>
                <p className="text-sm text-green-600">
                  +{analytics.paidAds.roas.changePercent}% from last period
                </p>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <h4 className="font-semibold text-fm-neutral-900 mb-4">Social Media Performance</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Reach</span>
                    <span className="font-medium text-fm-neutral-900">
                      {analytics.socialMedia.reach.current.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Impressions</span>
                    <span className="font-medium text-fm-neutral-900">
                      {analytics.socialMedia.impressions.current.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <h4 className="font-semibold text-fm-neutral-900 mb-4">Paid Advertising</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Clicks</span>
                    <span className="font-medium text-fm-neutral-900">
                      {analytics.paidAds.clicks.current.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">CTR</span>
                    <span className="font-medium text-fm-neutral-900">
                      {analytics.paidAds.ctr.current}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Conversions</span>
                    <span className="font-medium text-fm-neutral-900">
                      {analytics.paidAds.conversions.current.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-fm-neutral-900">Communication Hub</h3>
              <Button size="sm" icon={<Plus className="h-4 w-4" />}>
                New Message
              </Button>
            </div>
            
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
              <h4 className="font-semibold text-fm-neutral-900 mb-2">Communication Center</h4>
              <p className="text-fm-neutral-600">
                Message center, meeting notes, and collaboration tools will be available here
              </p>
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-fm-neutral-900">Files & Assets</h3>
              <Button size="sm" icon={<Upload className="h-4 w-4" />}>
                Upload Files
              </Button>
            </div>
            
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
              <h4 className="font-semibold text-fm-neutral-900 mb-2">Document Library</h4>
              <p className="text-fm-neutral-600">
                Shared files, creative assets, and project documents will be managed here
              </p>
            </div>
          </div>
        )}

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <GrowthEngine clientId={clientId} />
        )}
        
        {activeTab === 'communication' && (
          <CommunicationHub clientId={clientId} />
        )}
        
        {activeTab === 'files' && (
          <DocumentManager clientId={clientId} />
        )}
      </div>
    </div>
  );
}
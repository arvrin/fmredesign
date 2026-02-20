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
import { Button } from '@/design-system/components/primitives/Button';
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
import { ClientService } from '@/lib/admin/client-service';
import { adminToast } from '@/lib/admin/toast';
import { CommunicationHub } from './CommunicationHub';
import { DocumentManager } from './DocumentManager';
import { GrowthEngine } from './GrowthEngine';
import ContractsTab from './ContractsTab';

interface ClientProfileProps {
  clientId: string;
  onBack: () => void;
}

export function ClientProfile({ clientId, onBack }: ClientProfileProps) {
  const [client, setClient] = useState<ClientProfileType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'analytics' | 'communication' | 'files' | 'contracts' | 'opportunities'>('overview');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<ClientAnalytics | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [opportunities, setOpportunities] = useState<GrowthOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

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
      
      // Initialize edit data with comprehensive fields
      setEditData({
        // Basic Information
        name: clientData.name,
        email: clientData.primaryContact?.email || '',
        phone: clientData.primaryContact?.phone || '',
        website: clientData.website || '',
        
        // Address Information
        street: clientData.headquarters?.street || '',
        city: clientData.headquarters?.city || '',
        state: clientData.headquarters?.state || '',
        zipCode: clientData.headquarters?.zipCode || '',
        country: clientData.headquarters?.country || 'India',
        
        // Business Information
        industry: clientData.industry,
        companySize: clientData.companySize || 'medium',
        founded: clientData.founded || '',
        
        // Tax & Legal
        gstNumber: clientData.gstNumber || '',
        
        // Account Management
        status: clientData.status,
        health: clientData.health,
        
        // Contract Details
        contractType: clientData.contractDetails?.type || 'project',
        contractValue: clientData.contractDetails?.value || 0,
        billingCycle: clientData.contractDetails?.billingCycle || 'monthly',
        
        // Contact Details
        contactRole: clientData.primaryContact?.role || 'Primary Contact',
        linkedIn: clientData.primaryContact?.linkedInUrl || ''
      });
    }
    
    setLoading(false);
  };

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    // Reset edit data to original values
    if (client) {
      setEditData({
        // Basic Information
        name: client.name,
        email: client.primaryContact?.email || '',
        phone: client.primaryContact?.phone || '',
        website: client.website || '',
        
        // Address Information
        street: client.headquarters?.street || '',
        city: client.headquarters?.city || '',
        state: client.headquarters?.state || '',
        zipCode: client.headquarters?.zipCode || '',
        country: client.headquarters?.country || 'India',
        
        // Business Information
        industry: client.industry,
        companySize: client.companySize || 'medium',
        founded: client.founded || '',
        
        // Tax & Legal
        gstNumber: client.gstNumber || '',
        
        // Account Management
        status: client.status,
        health: client.health,
        
        // Contract Details
        contractType: client.contractDetails?.type || 'project',
        contractValue: client.contractDetails?.value || 0,
        billingCycle: client.contractDetails?.billingCycle || 'monthly',
        
        // Contact Details
        contactRole: client.primaryContact?.role || 'Primary Contact',
        linkedIn: client.primaryContact?.linkedInUrl || ''
      });
    }
  };

  const handleEditSave = async () => {
    if (!client) return;
    
    try {
      const addressData = {
        street: editData.street,
        city: editData.city,
        state: editData.state,
        zipCode: editData.zipCode,
        country: editData.country
      };
      
      // Update client data with all fields
      const updatedClient = {
        ...client,
        // Basic Information
        name: editData.name,
        website: editData.website,
        industry: editData.industry,
        companySize: editData.companySize,
        founded: editData.founded,
        
        // Tax & Legal
        gstNumber: editData.gstNumber,
        
        // Account Management
        status: editData.status,
        health: editData.health,
        
        // Contact Information
        primaryContact: {
          ...client.primaryContact,
          email: editData.email,
          phone: editData.phone,
          role: editData.contactRole,
          linkedInUrl: editData.linkedIn
        },
        
        // Address Information
        headquarters: {
          ...client.headquarters,
          street: editData.street,
          city: editData.city,
          state: editData.state,
          zipCode: editData.zipCode,
          country: editData.country
        },
        
        // Contract Details
        contractDetails: {
          ...client.contractDetails,
          type: editData.contractType,
          value: parseFloat(editData.contractValue) || 0,
          billingCycle: editData.billingCycle
        },
        
        updatedAt: new Date().toISOString()
      };


      // Save via API first with flat data structure
      try {
        const response = await fetch('/api/clients', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: client.id,
            // Basic Information
            name: editData.name,
            email: editData.email,
            phone: editData.phone,
            website: editData.website,
            industry: editData.industry,
            companySize: editData.companySize,
            founded: editData.founded,
            
            // Address Information - using flat structure like AddClientModal
            address: editData.street,
            city: editData.city,
            state: editData.state,
            zipCode: editData.zipCode,
            country: editData.country,
            
            // Tax & Legal
            gstNumber: editData.gstNumber,
            
            // Account Management
            status: editData.status,
            health: editData.health,
            
            // Contract Information
            contractType: editData.contractType,
            contractValue: editData.contractValue,
            billingCycle: editData.billingCycle,
            
            // Contact Details
            contactRole: editData.contactRole,
            linkedIn: editData.linkedIn
          }),
        });
        
        if (!response.ok) {
          console.error('API update failed:', response.status);
        }
      } catch (apiError) {
        console.error('Error saving client via API:', apiError);
      }
      
      // Update local state
      setClient(updatedClient);
      setIsEditing(false);
      
      adminToast.success('Client updated successfully!');
    } catch (error) {
      console.error('Error updating client:', error);
      adminToast.error('Error updating client. Please try again.');
    }
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
    { id: 'contracts', name: 'Contracts', icon: Briefcase },
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
                <p className="text-fm-neutral-600">{(client as any).industry || 'Not specified'}</p>
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
            <Button variant="secondary" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="secondary" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            {!isEditing ? (
              <Button variant="secondary" size="sm" onClick={handleEditStart}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={handleEditSave}>
                  Save
                </Button>
                <Button variant="secondary" size="sm" onClick={handleEditCancel}>
                  Cancel
                </Button>
              </div>
            )}
            <Button variant="secondary" size="sm">
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
                <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-fm-neutral-400" />
                      <div>
                        <p className="text-sm text-fm-neutral-600">Company Size</p>
                        <p className="font-medium text-fm-neutral-900 capitalize">{(client as any).companySize || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-fm-neutral-400" />
                      <div>
                        <p className="text-sm text-fm-neutral-600">Founded</p>
                        <p className="font-medium text-fm-neutral-900">{(client as any).founded || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-fm-neutral-400" />
                      <div>
                        <p className="text-sm text-fm-neutral-600">Website</p>
                        <a href={(client as any).website} target="_blank" rel="noopener noreferrer" 
                           className="font-medium text-fm-magenta-700 hover:underline">
                          {(client as any).website || 'N/A'}
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
                          {(client as any).city || 'N/A'}, {(client as any).state || 'N/A'}
                          <br />
                          {(client as any).country || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-fm-neutral-400" />
                      <div>
                        <p className="text-sm text-fm-neutral-600">Account Manager</p>
                        <p className="font-medium text-fm-neutral-900">{(client as any).accountManager || 'Not assigned'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information - Editable */}
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Primary Contact</h3>
                
                {!isEditing ? (
                  // Display mode
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-fm-neutral-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-fm-neutral-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-fm-neutral-900">{client.name || 'N/A'}</h4>
                      <p className="text-sm text-fm-neutral-600">Primary Contact</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <a href={`mailto:${client.primaryContact?.email}`} 
                           className="flex items-center text-sm text-fm-neutral-600 hover:text-fm-magenta-700">
                          <Mail className="h-4 w-4 mr-1" />
                          {client.primaryContact?.email || 'N/A'}
                        </a>
                        {client.primaryContact?.phone && (
                          <a href={`tel:${client.primaryContact?.phone}`} 
                             className="flex items-center text-sm text-fm-neutral-600 hover:text-fm-magenta-700">
                            <Phone className="h-4 w-4 mr-1" />
                            {client.primaryContact?.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Comprehensive Edit Mode
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-fm-neutral-900 mb-3 pb-2 border-b border-fm-neutral-200">Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Client Name *</label>
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Email *</label>
                          <input
                            type="email"
                            value={editData.email || ''}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Phone</label>
                          <input
                            type="tel"
                            value={editData.phone || ''}
                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Website</label>
                          <input
                            type="url"
                            value={editData.website || ''}
                            onChange={(e) => setEditData({...editData, website: e.target.value})}
                            placeholder="https://example.com"
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Contact Role</label>
                          <input
                            type="text"
                            value={editData.contactRole || ''}
                            onChange={(e) => setEditData({...editData, contactRole: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">LinkedIn</label>
                          <input
                            type="url"
                            value={editData.linkedIn || ''}
                            onChange={(e) => setEditData({...editData, linkedIn: e.target.value})}
                            placeholder="https://linkedin.com/in/..."
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-fm-neutral-900 mb-3 pb-2 border-b border-fm-neutral-200">Address Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Street Address</label>
                          <input
                            type="text"
                            value={editData.street || ''}
                            onChange={(e) => setEditData({...editData, street: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">City</label>
                          <input
                            type="text"
                            value={editData.city || ''}
                            onChange={(e) => setEditData({...editData, city: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">State</label>
                          <input
                            type="text"
                            value={editData.state || ''}
                            onChange={(e) => setEditData({...editData, state: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">ZIP Code</label>
                          <input
                            type="text"
                            value={editData.zipCode || ''}
                            onChange={(e) => setEditData({...editData, zipCode: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Country</label>
                          <select
                            value={editData.country || ''}
                            onChange={(e) => setEditData({...editData, country: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
                          >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-fm-neutral-900 mb-3 pb-2 border-b border-fm-neutral-200">Business Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Industry</label>
                          <select
                            value={editData.industry || ''}
                            onChange={(e) => setEditData({...editData, industry: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
                          >
                            <option value="">Select Industry</option>
                            <option value="technology">Technology</option>
                            <option value="hospitality">Hospitality</option>
                            <option value="finance">Finance</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="education">Education</option>
                            <option value="retail">Retail</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Company Size</label>
                          <select
                            value={editData.companySize || ''}
                            onChange={(e) => setEditData({...editData, companySize: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
                          >
                            <option value="startup">Startup (1-10)</option>
                            <option value="small">Small (11-50)</option>
                            <option value="medium">Medium (51-200)</option>
                            <option value="enterprise">Enterprise (200+)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Founded Year</label>
                          <input
                            type="number"
                            value={editData.founded || ''}
                            onChange={(e) => setEditData({...editData, founded: e.target.value})}
                            min="1900"
                            max="2025"
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">GST Number</label>
                          <input
                            type="text"
                            value={editData.gstNumber || ''}
                            onChange={(e) => setEditData({...editData, gstNumber: e.target.value})}
                            placeholder="22AAAAA0000A1Z5"
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account & Contract Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-fm-neutral-900 mb-3 pb-2 border-b border-fm-neutral-200">Account Management</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Status</label>
                          <select
                            value={editData.status || ''}
                            onChange={(e) => setEditData({...editData, status: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="prospect">Prospect</option>
                            <option value="churned">Churned</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Health Status</label>
                          <select
                            value={editData.health || ''}
                            onChange={(e) => setEditData({...editData, health: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
                          >
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="warning">Warning</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Contract Type</label>
                          <select
                            value={editData.contractType || ''}
                            onChange={(e) => setEditData({...editData, contractType: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
                          >
                            <option value="project">Project</option>
                            <option value="retainer">Retainer</option>
                            <option value="performance">Performance</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Contract Value (₹)</label>
                          <input
                            type="number"
                            value={editData.contractValue || ''}
                            onChange={(e) => setEditData({...editData, contractValue: e.target.value})}
                            min="0"
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Billing Cycle</label>
                          <select
                            value={editData.billingCycle || ''}
                            onChange={(e) => setEditData({...editData, billingCycle: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annually">Annually</option>
                            <option value="one_time">One Time</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {(client as any).description && (
                <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                  <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">About</h3>
                  <p className="text-fm-neutral-700 leading-relaxed">{(client as any).description}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contract Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Contract Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-fm-neutral-600">Contract Value</p>
                    <p className="text-2xl font-bold text-fm-neutral-900">
                      {ClientUtils.formatCurrency(parseFloat((client as any).totalValue) || 0)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-fm-neutral-600">Type</p>
                      <p className="font-medium text-fm-neutral-900 capitalize">
                        {((client as any).contractType || 'retainer').replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-fm-neutral-600">Billing</p>
                      <p className="font-medium text-fm-neutral-900 capitalize">
                        {((client as any).billingCycle || 'monthly').replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-fm-neutral-600">Contract Period</p>
                    <p className="font-medium text-fm-neutral-900">
                      {new Date((client as any).createdAt || Date.now()).toLocaleDateString()} - Ongoing
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Quick Stats</h3>
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
              {((client as any).tags && (client as any).tags.length > 0) && (
                <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
                  <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {((client as any).tags || []).map((tag: string, index: number) => (
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
                <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Campaigns & Projects</h3>
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
                            'bg-fm-neutral-100 text-fm-neutral-800'
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
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
              <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Communication Hub</h3>
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
              <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Files & Assets</h3>
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

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <ContractsTab clientId={clientId} clientName={client?.name} />
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
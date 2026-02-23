/**
 * Client Profile Component
 * Detailed client view with all phases integrated
 */

'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Edit,
  Calendar,
  FileText,
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
  Eye,
  FolderOpen,
  Layers,
  LifeBuoy,
  Palette,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  X,
} from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';
import {
  ClientProfile as ClientProfileType,
  ClientUtils,
  ClientHealth
} from '@/lib/admin/client-types';
import { ClientService } from '@/lib/admin/client-service';
import { adminToast } from '@/lib/admin/toast';
import { useTeamMembers } from '@/hooks/admin/useTeamMembers';
import { TEAM_ROLES } from '@/lib/admin/types';
import ContractsTab from './ContractsTab';
import { useRef } from 'react';

// Types for API responses
interface ProjectItem {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  type?: string;
  status: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  spent?: number;
  progress: number;
  milestones?: any[];
  deliverables?: any[];
  createdAt: string;
}

interface ContentItem {
  id: string;
  title: string;
  status: string;
  platform?: string;
  type?: string;
  scheduledDate?: string;
  createdAt: string;
}

interface TicketItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category?: string;
  assignedTo?: string;
  createdAt: string;
}

interface ClientProfileProps {
  clientId: string;
  onBack: () => void;
}

export function ClientProfile({ clientId, onBack }: ClientProfileProps) {
  const { teamMembers } = useTeamMembers();
  const [client, setClient] = useState<ClientProfileType | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'support' | 'content' | 'contracts'>('overview');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [brandColorInputs, setBrandColorInputs] = useState<string[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    setLoading(true);
    
    // Load client profile
    const clientData = await ClientService.getClientById(clientId);
    setClient(clientData);
    
    if (clientData) {
      // Load related data from real APIs in parallel
      const [projectsRes, ticketsRes, contentRes] = await Promise.allSettled([
        fetch(`/api/projects?clientId=${clientId}`),
        fetch(`/api/admin/support?clientId=${clientId}`),
        fetch(`/api/content?clientId=${clientId}`),
      ]);

      if (projectsRes.status === 'fulfilled' && projectsRes.value.ok) {
        const d = await projectsRes.value.json();
        setProjects(d.data || []);
      }
      if (ticketsRes.status === 'fulfilled' && ticketsRes.value.ok) {
        const d = await ticketsRes.value.json();
        setTickets(d.data || []);
      }
      if (contentRes.status === 'fulfilled' && contentRes.value.ok) {
        const d = await contentRes.value.json();
        setContentItems(d.data || []);
      }

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
        accountManager: (clientData as any).accountManager || '',

        // Contract Details
        contractType: clientData.contractDetails?.type || 'project',
        contractValue: clientData.contractDetails?.value || 0,
        billingCycle: clientData.contractDetails?.billingCycle || 'monthly',

        // Contact Details
        contactRole: clientData.primaryContact?.role || 'Primary Contact',
        linkedIn: clientData.primaryContact?.linkedInUrl || '',

        // Brand Identity
        logoUrl: (clientData as any).logoUrl || '',
        brandFonts: ((clientData as any).brandFonts || []).join(', '),
        tagline: (clientData as any).tagline || '',
        brandGuidelinesUrl: (clientData as any).brandGuidelinesUrl || '',
      });

      // Initialize brand color inputs
      const colors = (clientData as any).brandColors || [];
      setBrandColorInputs(colors.length > 0 ? colors : []);
      setLogoPreview((clientData as any).logoUrl || null);
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
        accountManager: (client as any).accountManager || '',

        // Contract Details
        contractType: client.contractDetails?.type || 'project',
        contractValue: client.contractDetails?.value || 0,
        billingCycle: client.contractDetails?.billingCycle || 'monthly',

        // Contact Details
        contactRole: client.primaryContact?.role || 'Primary Contact',
        linkedIn: client.primaryContact?.linkedInUrl || '',

        // Brand Identity
        logoUrl: (client as any).logoUrl || '',
        brandFonts: ((client as any).brandFonts || []).join(', '),
        tagline: (client as any).tagline || '',
        brandGuidelinesUrl: (client as any).brandGuidelinesUrl || '',
      });

      const colors = (client as any).brandColors || [];
      setBrandColorInputs(colors.length > 0 ? colors : []);
      setLogoPreview((client as any).logoUrl || null);
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
            accountManager: editData.accountManager,

            // Contract Information
            contractType: editData.contractType,
            contractValue: editData.contractValue,
            billingCycle: editData.billingCycle,
            
            // Contact Details
            contactRole: editData.contactRole,
            linkedIn: editData.linkedIn,

            // Brand Identity
            logoUrl: editData.logoUrl || undefined,
            brandColors: brandColorInputs.filter(c => /^#[0-9a-fA-F]{6}$/.test(c)),
            brandFonts: editData.brandFonts ? editData.brandFonts.split(',').map((f: string) => f.trim()).filter(Boolean) : [],
            tagline: editData.tagline || undefined,
            brandGuidelinesUrl: editData.brandGuidelinesUrl || undefined,
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
    { id: 'projects', name: 'Projects', icon: Layers },
    { id: 'content', name: 'Content', icon: FolderOpen },
    { id: 'support', name: 'Support', icon: LifeBuoy },
    { id: 'contracts', name: 'Contracts', icon: Briefcase },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Button
              variant="ghost"
              onClick={onBack}
              icon={<ArrowLeft className="h-4 w-4" />}
              className="shrink-0"
            >
              <span className="hidden sm:inline">Back</span>
            </Button>
            {(client as any).logoUrl ? (
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-fm-neutral-200 bg-white flex items-center justify-center shrink-0">
                <img src={(client as any).logoUrl} alt={`${client.name} logo`} className="max-w-full max-h-full object-contain p-1" />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-fm-magenta-100 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-fm-magenta-700 font-bold text-lg sm:text-2xl">
                  {client.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-fm-neutral-900 truncate">{client.name}</h1>
              <p className="text-sm text-fm-neutral-600">{(client as any).industry || 'Not specified'}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <div className={`flex items-center gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${getHealthColor(client.health)}`}>
                  {getHealthIcon(client.health)}
                  <span className="capitalize">{client.health}</span>
                </div>
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 capitalize">
                  {client.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {!isEditing ? (
              <Button variant="secondary" size="sm" onClick={handleEditStart}>
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Edit</span>
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
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-1">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'bg-fm-magenta-700 text-white'
                    : 'text-fm-neutral-600 hover:text-fm-neutral-900 hover:bg-fm-neutral-50'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>
        {/* Right fade hint for scroll on mobile */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden rounded-r-xl" />
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Client Information */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Primary Contact</h3>

                {!isEditing ? (
                  // Display mode
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-fm-neutral-100 rounded-full flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-fm-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-fm-neutral-900 truncate">{client.name || 'N/A'}</h4>
                      <p className="text-sm text-fm-neutral-600">Primary Contact</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
                        <a href={`mailto:${client.primaryContact?.email}`}
                           className="flex items-center text-sm text-fm-neutral-600 hover:text-fm-magenta-700 truncate">
                          <Mail className="h-4 w-4 mr-1 shrink-0" />
                          <span className="truncate">{client.primaryContact?.email || 'N/A'}</span>
                        </a>
                        {client.primaryContact?.phone && (
                          <a href={`tel:${client.primaryContact?.phone}`}
                             className="flex items-center text-sm text-fm-neutral-600 hover:text-fm-magenta-700">
                            <Phone className="h-4 w-4 mr-1 shrink-0" />
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
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Account Manager</label>
                          <select
                            value={editData.accountManager || ''}
                            onChange={(e) => setEditData({...editData, accountManager: e.target.value})}
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
                          >
                            <option value="">Not assigned</option>
                            {teamMembers.map((member) => (
                              <option key={member.id} value={member.name}>
                                {member.name} — {TEAM_ROLES[member.role]}
                              </option>
                            ))}
                          </select>
                        </div>
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

                    {/* Brand Identity Edit Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-fm-neutral-900 mb-3 pb-2 border-b border-fm-neutral-200 flex items-center gap-1.5">
                        <Palette className="h-4 w-4" />
                        Brand Identity
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Logo Upload */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Brand Logo</label>
                          <div className="flex items-center gap-4">
                            {logoPreview ? (
                              <div className="relative w-16 h-16 rounded-lg border border-fm-neutral-200 overflow-hidden bg-fm-neutral-50 flex items-center justify-center">
                                <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                                <button
                                  type="button"
                                  onClick={() => { setLogoPreview(null); setEditData({...editData, logoUrl: ''}); }}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => logoInputRef.current?.click()}
                                className="w-16 h-16 rounded-lg border-2 border-dashed border-fm-neutral-300 flex items-center justify-center cursor-pointer hover:border-fm-magenta-400 transition-colors"
                              >
                                <Upload className="h-5 w-5 text-fm-neutral-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                disabled={logoUploading}
                                className="text-sm text-fm-magenta-700 hover:text-fm-magenta-800 font-medium"
                              >
                                {logoUploading ? 'Uploading...' : 'Upload logo'}
                              </button>
                              <p className="text-xs text-fm-neutral-500 mt-0.5">PNG, JPEG, SVG, or WebP. Max 2MB.</p>
                            </div>
                            <input
                              ref={logoInputRef}
                              type="file"
                              accept="image/png,image/jpeg,image/svg+xml,image/webp"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setLogoUploading(true);
                                try {
                                  const fd = new FormData();
                                  fd.append('file', file);
                                  fd.append('clientId', clientId);
                                  const res = await fetch('/api/admin/upload-logo', { method: 'POST', body: fd });
                                  const result = await res.json();
                                  if (result.success) {
                                    setEditData({...editData, logoUrl: result.url});
                                    setLogoPreview(result.url);
                                  } else {
                                    adminToast.error(result.error || 'Failed to upload logo');
                                  }
                                } catch { adminToast.error('Failed to upload logo'); }
                                finally { setLogoUploading(false); }
                              }}
                            />
                          </div>
                        </div>

                        {/* Brand Colors */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Brand Colors</label>
                          <div className="space-y-2">
                            {brandColorInputs.map((color, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={color}
                                  onChange={(e) => {
                                    const updated = [...brandColorInputs];
                                    updated[index] = e.target.value;
                                    setBrandColorInputs(updated);
                                  }}
                                  className="w-10 h-10 rounded cursor-pointer border border-fm-neutral-200"
                                />
                                <input
                                  type="text"
                                  value={color}
                                  onChange={(e) => {
                                    const updated = [...brandColorInputs];
                                    updated[index] = e.target.value;
                                    setBrandColorInputs(updated);
                                  }}
                                  className="w-28 h-10 px-2 text-sm bg-fm-neutral-50 border border-fm-neutral-300 rounded-md font-mono"
                                />
                                <span className="text-xs text-fm-neutral-500">
                                  {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Accent'}
                                </span>
                                {brandColorInputs.length > 1 && (
                                  <button type="button" onClick={() => setBrandColorInputs(brandColorInputs.filter((_, i) => i !== index))} className="p-1 text-fm-neutral-400 hover:text-red-500">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                            {brandColorInputs.length < 5 && (
                              <button type="button" onClick={() => setBrandColorInputs([...brandColorInputs, '#000000'])} className="flex items-center gap-1 text-sm text-fm-magenta-700 hover:text-fm-magenta-800">
                                <Plus className="h-3.5 w-3.5" /> Add color
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Tagline */}
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Tagline / Slogan</label>
                          <input
                            type="text"
                            value={editData.tagline || ''}
                            onChange={(e) => setEditData({...editData, tagline: e.target.value})}
                            placeholder="Your brand's catchphrase"
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>

                        {/* Brand Fonts */}
                        <div>
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Brand Fonts</label>
                          <input
                            type="text"
                            value={editData.brandFonts || ''}
                            onChange={(e) => setEditData({...editData, brandFonts: e.target.value})}
                            placeholder="Poppins, Montserrat"
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                          <p className="text-xs text-fm-neutral-500 mt-1">Comma-separated font names</p>
                        </div>

                        {/* Brand Guidelines URL */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Brand Guidelines URL</label>
                          <input
                            type="url"
                            value={editData.brandGuidelinesUrl || ''}
                            onChange={(e) => setEditData({...editData, brandGuidelinesUrl: e.target.value})}
                            placeholder="https://drive.google.com/..."
                            className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {(client as any).description && (
                <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
                  <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">About</h3>
                  <p className="text-fm-neutral-700 leading-relaxed">{(client as any).description}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Contract Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
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
              <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Active Projects</span>
                    <span className="font-medium text-fm-neutral-900">
                      {projects.filter(p => p.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Total Projects</span>
                    <span className="font-medium text-fm-neutral-900">{projects.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Content Items</span>
                    <span className="font-medium text-fm-neutral-900">{contentItems.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-fm-neutral-600">Open Tickets</span>
                    <span className="font-medium text-fm-neutral-900">
                      {tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Brand Identity Card */}
              {((client as any).logoUrl || ((client as any).brandColors && (client as any).brandColors.length > 0) || (client as any).tagline) && (
                <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
                  <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100 flex items-center gap-1.5">
                    <Palette className="h-4 w-4" />
                    Brand Identity
                  </h3>
                  <div className="space-y-4">
                    {(client as any).logoUrl && (
                      <div>
                        <p className="text-sm text-fm-neutral-600 mb-2">Logo</p>
                        <div className="w-20 h-20 rounded-lg border border-fm-neutral-200 overflow-hidden bg-fm-neutral-50 flex items-center justify-center">
                          <img src={(client as any).logoUrl} alt={`${client.name} logo`} className="max-w-full max-h-full object-contain" />
                        </div>
                      </div>
                    )}
                    {(client as any).brandColors && (client as any).brandColors.length > 0 && (
                      <div>
                        <p className="text-sm text-fm-neutral-600 mb-2">Colors</p>
                        <div className="flex gap-2 flex-wrap">
                          {((client as any).brandColors as string[]).map((color: string, i: number) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div className="w-8 h-8 rounded-md border border-fm-neutral-200" style={{ backgroundColor: color }} />
                              <span className="text-xs text-fm-neutral-600 font-mono">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {(client as any).tagline && (
                      <div>
                        <p className="text-sm text-fm-neutral-600">Tagline</p>
                        <p className="font-medium text-fm-neutral-900 italic">"{(client as any).tagline}"</p>
                      </div>
                    )}
                    {(client as any).brandFonts && (client as any).brandFonts.length > 0 && (
                      <div>
                        <p className="text-sm text-fm-neutral-600">Fonts</p>
                        <p className="font-medium text-fm-neutral-900">{((client as any).brandFonts as string[]).join(', ')}</p>
                      </div>
                    )}
                    {(client as any).brandGuidelinesUrl && (
                      <a href={(client as any).brandGuidelinesUrl} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-1 text-sm text-fm-magenta-700 hover:underline">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Brand Guidelines
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {((client as any).tags && (client as any).tags.length > 0) && (
                <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
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

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Projects</h3>
              </div>

              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-fm-neutral-200 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h4 className="font-semibold text-fm-neutral-900 text-sm sm:text-base">{project.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'active' ? 'bg-green-100 text-green-800' :
                            project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                            project.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
                            'bg-fm-neutral-100 text-fm-neutral-800'
                          }`}>
                            {project.status}
                          </span>
                          {project.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.priority === 'high' ? 'bg-red-100 text-red-800' :
                              project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-fm-neutral-100 text-fm-neutral-700'
                            }`}>
                              {project.priority}
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-fm-neutral-600 mb-3">{project.description}</p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {project.budget != null && (
                            <div>
                              <p className="text-fm-neutral-500">Budget</p>
                              <p className="font-medium text-fm-neutral-900">
                                {ClientUtils.formatCurrency(project.budget)}
                              </p>
                            </div>
                          )}
                          {project.spent != null && (
                            <div>
                              <p className="text-fm-neutral-500">Spent</p>
                              <p className="font-medium text-fm-neutral-900">
                                {ClientUtils.formatCurrency(project.spent)}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-fm-neutral-500">Progress</p>
                            <p className="font-medium text-fm-neutral-900">{project.progress}%</p>
                          </div>
                          {project.endDate && (
                            <div>
                              <p className="text-fm-neutral-500">End Date</p>
                              <p className="font-medium text-fm-neutral-900">
                                {new Date(project.endDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-3">
                          <div className="w-full bg-fm-neutral-200 rounded-full h-2">
                            <div
                              className="bg-fm-magenta-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" variant="secondary" onClick={() => window.open(`/admin/projects/${project.id}`, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="text-center py-8">
                    <Layers className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-fm-neutral-900 mb-2">No projects yet</h4>
                    <p className="text-fm-neutral-600">Create a project for this client from the Projects page</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Content Calendar</h3>
            </div>

            {contentItems.length > 0 ? (
              <div className="space-y-3">
                {contentItems.map((item) => (
                  <div key={item.id} className="border border-fm-neutral-200 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-medium text-fm-neutral-900 text-sm sm:text-base truncate">{item.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'published' ? 'bg-green-100 text-green-800' :
                            item.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'in-review' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'draft' ? 'bg-fm-neutral-100 text-fm-neutral-700' :
                            'bg-fm-neutral-100 text-fm-neutral-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-fm-neutral-500">
                          {item.platform && <span className="capitalize">{item.platform}</span>}
                          {item.type && <span className="capitalize">{item.type}</span>}
                          {item.scheduledDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(item.scheduledDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button size="sm" variant="secondary" onClick={() => window.open(`/admin/content/${item.id}`, '_blank')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <FolderOpen className="h-10 w-10 sm:h-12 sm:w-12 text-fm-neutral-400 mx-auto mb-4" />
                <h4 className="font-semibold text-fm-neutral-900 mb-2">No content items</h4>
                <p className="text-sm sm:text-base text-fm-neutral-600">
                  Content calendar items for this client will appear here
                </p>
              </div>
            )}
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Support Tickets</h3>
            </div>

            {tickets.length > 0 ? (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border border-fm-neutral-200 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-medium text-fm-neutral-900 text-sm sm:text-base">{ticket.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                            ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-fm-neutral-100 text-fm-neutral-700'
                          }`}>
                            {ticket.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-fm-neutral-100 text-fm-neutral-700'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                        {ticket.description && (
                          <p className="text-sm text-fm-neutral-600 line-clamp-2 mb-1">{ticket.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-fm-neutral-500">
                          {ticket.category && <span className="capitalize">{ticket.category}</span>}
                          {ticket.assignedTo && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {ticket.assignedTo}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <LifeBuoy className="h-10 w-10 sm:h-12 sm:w-12 text-fm-neutral-400 mx-auto mb-4" />
                <h4 className="font-semibold text-fm-neutral-900 mb-2">No support tickets</h4>
                <p className="text-sm sm:text-base text-fm-neutral-600">
                  Support tickets from this client will appear here
                </p>
              </div>
            )}
          </div>
        )}

        {/* Contracts Tab */}
        {activeTab === 'contracts' && (
          <ContractsTab clientId={clientId} clientName={client?.name} />
        )}
      </div>
    </div>
  );
}
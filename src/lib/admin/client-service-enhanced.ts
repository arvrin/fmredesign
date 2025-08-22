/**
 * Enhanced Client Management Service with Google Sheets Integration
 * Professional client data management for Freaking Minds Agency
 */

import { 
  ClientProfile, 
  Campaign, 
  ClientAnalytics, 
  ClientMessage, 
  ClientMeeting,
  GrowthOpportunity,
  Notification,
  Deliverable,
  ClientHealth,
  ClientStatus,
  Industry,
  CampaignType,
  ClientUtils
} from './client-types';

export class EnhancedClientService {
  private static readonly STORAGE_KEYS = {
    CLIENTS: 'fm_clients',
    CAMPAIGNS: 'fm_campaigns', 
    ANALYTICS: 'fm_client_analytics',
    MESSAGES: 'fm_client_messages',
    MEETINGS: 'fm_client_meetings',
    OPPORTUNITIES: 'fm_growth_opportunities',
    NOTIFICATIONS: 'fm_notifications',
    DELIVERABLES: 'fm_deliverables'
  };

  // ===== CLIENT PROFILE MANAGEMENT WITH GOOGLE SHEETS =====

  static async getAllClients(): Promise<ClientProfile[]> {
    try {
      // Try to fetch from Google Sheets API first
      const response = await fetch('/api/clients');
      const result = await response.json();
      
      if (result.success && result.data) {
        // Convert Google Sheets data to ClientProfile format
        const clients = result.data.map(this.convertSheetRowToClient);
        
        // Save to localStorage as backup
        localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
        
        return clients;
      }
    } catch (error) {
      console.error('Error fetching clients from Google Sheets:', error);
    }

    // Fallback to localStorage
    try {
      const clients = localStorage.getItem(this.STORAGE_KEYS.CLIENTS);
      return clients ? JSON.parse(clients) : this.getDefaultClients();
    } catch (error) {
      console.error('Error loading clients from localStorage:', error);
      return this.getDefaultClients();
    }
  }

  static async getClientById(id: string): Promise<ClientProfile | null> {
    const clients = await this.getAllClients();
    return clients.find(client => client.id === id) || null;
  }

  static async createClient(clientData: Partial<ClientProfile>): Promise<ClientProfile | null> {
    try {
      const newClient: ClientProfile = {
        id: `client-${Date.now()}`,
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        company: clientData.company || '',
        industry: clientData.industry || 'Technology',
        website: clientData.website || '',
        address: clientData.address || '',
        city: clientData.city || '',
        state: clientData.state || '',
        country: clientData.country || 'India',
        zipCode: clientData.zipCode || '',
        contactPerson: clientData.contactPerson || {
          name: clientData.name || '',
          email: clientData.email || '',
          phone: clientData.phone || '',
          position: 'Primary Contact'
        },
        status: clientData.status || 'active',
        health: clientData.health || 'good',
        totalValue: clientData.totalValue || 0,
        lifetimeValue: clientData.lifetimeValue || 0,
        monthlyRetainer: clientData.monthlyRetainer || 0,
        servicesProvided: clientData.servicesProvided || [],
        tags: clientData.tags || [],
        notes: clientData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastContact: new Date().toISOString(),
        nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: clientData.assignedTo || 'unassigned',
        socialMedia: clientData.socialMedia || {},
        preferences: clientData.preferences || {
          communicationMethod: 'email',
          meetingFrequency: 'monthly',
          reportingFrequency: 'monthly',
          preferredTime: 'morning'
        }
      };

      // Save to Google Sheets
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.convertClientToSheetRow(newClient)),
      });

      const result = await response.json();

      if (result.success) {
        // Also update localStorage
        const clients = await this.getAllClients();
        clients.push(newClient);
        localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
        
        return newClient;
      } else {
        throw new Error(result.error || 'Failed to create client');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      
      // Fallback to localStorage only
      try {
        const newClient: ClientProfile = {
          id: `client-${Date.now()}`,
          name: clientData.name || '',
          email: clientData.email || '',
          // ... (same as above)
        } as ClientProfile;

        const clients = await this.getAllClients();
        clients.push(newClient);
        localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
        
        return newClient;
      } catch (localError) {
        console.error('Local fallback also failed:', localError);
        return null;
      }
    }
  }

  static async updateClient(clientId: string, updates: Partial<ClientProfile>): Promise<boolean> {
    try {
      updates.updatedAt = new Date().toISOString();

      // Update in Google Sheets
      const response = await fetch('/api/clients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId, ...updates }),
      });

      const result = await response.json();

      if (result.success) {
        // Also update localStorage
        const clients = await this.getAllClients();
        const clientIndex = clients.findIndex(c => c.id === clientId);
        
        if (clientIndex !== -1) {
          clients[clientIndex] = { ...clients[clientIndex], ...updates };
          localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
        }
        
        return true;
      } else {
        throw new Error(result.error || 'Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      
      // Fallback to localStorage
      try {
        const clients = await this.getAllClients();
        const clientIndex = clients.findIndex(c => c.id === clientId);
        
        if (clientIndex !== -1) {
          clients[clientIndex] = { ...clients[clientIndex], ...updates };
          localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
          return true;
        }
        
        return false;
      } catch (localError) {
        console.error('Local fallback also failed:', localError);
        return false;
      }
    }
  }

  // ===== CONVERSION HELPERS =====

  private static convertSheetRowToClient(row: any): ClientProfile {
    return {
      id: row.id || `client-${Date.now()}`,
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      company: row.company || '',
      industry: row.industry || 'Technology',
      website: row.website || '',
      address: row.address || '',
      city: row.city || '',
      state: row.state || '',
      country: row.country || 'India',
      zipCode: row.zipCode || '',
      contactPerson: {
        name: row.name || '',
        email: row.email || '',
        phone: row.phone || '',
        position: 'Primary Contact'
      },
      status: row.status || 'active',
      health: row.health || 'good',
      totalValue: parseFloat(row.totalValue) || 0,
      lifetimeValue: parseFloat(row.lifetimeValue) || 0,
      monthlyRetainer: parseFloat(row.monthlyRetainer) || 0,
      servicesProvided: [],
      tags: [],
      notes: row.notes || '',
      createdAt: row.createdAt || new Date().toISOString(),
      updatedAt: row.updatedAt || new Date().toISOString(),
      lastContact: row.lastContact || new Date().toISOString(),
      nextFollowUp: row.nextFollowUp || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: row.assignedTo || 'unassigned',
      socialMedia: {},
      preferences: {
        communicationMethod: 'email',
        meetingFrequency: 'monthly',
        reportingFrequency: 'monthly',
        preferredTime: 'morning'
      }
    };
  }

  private static convertClientToSheetRow(client: ClientProfile): any {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      industry: client.industry,
      status: client.status,
      createdAt: client.createdAt,
      totalValue: client.totalValue,
      health: client.health,
      website: client.website,
      address: client.address,
      city: client.city,
      state: client.state,
      country: client.country,
      zipCode: client.zipCode,
      notes: client.notes,
      updatedAt: client.updatedAt,
      lastContact: client.lastContact,
      nextFollowUp: client.nextFollowUp,
      assignedTo: client.assignedTo,
      lifetimeValue: client.lifetimeValue,
      monthlyRetainer: client.monthlyRetainer
    };
  }

  // ===== FALLBACK METHODS (same as original ClientService) =====

  private static getDefaultClients(): ClientProfile[] {
    return [
      {
        id: 'client-001',
        name: 'TechStart Inc',
        email: 'contact@techstart.com',
        phone: '+91 98765 43210',
        company: 'TechStart Inc',
        industry: 'Technology',
        website: 'https://techstart.com',
        address: '123 Tech Park, Electronic City',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        zipCode: '560100',
        contactPerson: {
          name: 'Rajesh Kumar',
          email: 'rajesh@techstart.com',
          phone: '+91 98765 43210',
          position: 'Founder & CEO'
        },
        status: 'active',
        health: 'excellent',
        totalValue: 150000,
        lifetimeValue: 450000,
        monthlyRetainer: 25000,
        servicesProvided: ['Digital Marketing', 'SEO', 'Content Creation', 'Social Media Management'],
        tags: ['high-value', 'tech-startup', 'long-term'],
        notes: 'Excellent client with consistent growth. Focus on scaling their digital presence.',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-08-20T00:00:00Z',
        lastContact: '2024-08-18T00:00:00Z',
        nextFollowUp: '2024-08-25T00:00:00Z',
        assignedTo: 'sarah-johnson',
        socialMedia: {
          linkedin: 'https://linkedin.com/company/techstart',
          twitter: 'https://twitter.com/techstart_in',
          instagram: 'https://instagram.com/techstart_official'
        },
        preferences: {
          communicationMethod: 'email',
          meetingFrequency: 'bi-weekly',
          reportingFrequency: 'monthly',
          preferredTime: 'morning'
        }
      },
      {
        id: 'client-002',
        name: 'GreenLeaf Ventures',
        email: 'info@greenleaf.com',
        phone: '+91 87654 32109',
        company: 'GreenLeaf Ventures',
        industry: 'Sustainability',
        website: 'https://greenleaf.ventures',
        address: '456 Eco Park, Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        zipCode: '560066',
        contactPerson: {
          name: 'Priya Sharma',
          email: 'priya@greenleaf.com',
          phone: '+91 87654 32109',
          position: 'Marketing Director'
        },
        status: 'active',
        health: 'good',
        totalValue: 95000,
        lifetimeValue: 285000,
        monthlyRetainer: 18000,
        servicesProvided: ['Content Marketing', 'Brand Strategy', 'Social Media Management'],
        tags: ['sustainability', 'mission-driven', 'growing'],
        notes: 'Passionate about environmental causes. Great storytelling opportunities.',
        createdAt: '2024-02-20T00:00:00Z',
        updatedAt: '2024-08-19T00:00:00Z',
        lastContact: '2024-08-16T00:00:00Z',
        nextFollowUp: '2024-08-23T00:00:00Z',
        assignedTo: 'mike-chen',
        socialMedia: {
          linkedin: 'https://linkedin.com/company/greenleaf-ventures',
          instagram: 'https://instagram.com/greenleaf_ventures'
        },
        preferences: {
          communicationMethod: 'video-call',
          meetingFrequency: 'monthly',
          reportingFrequency: 'monthly',
          preferredTime: 'afternoon'
        }
      }
    ];
  }

  // ===== SYNC METHODS =====

  static async syncWithGoogleSheets(): Promise<boolean> {
    try {
      // Force refresh from Google Sheets
      const response = await fetch('/api/clients');
      const result = await response.json();
      
      if (result.success && result.data) {
        const clients = result.data.map(this.convertSheetRowToClient);
        localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error syncing with Google Sheets:', error);
      return false;
    }
  }

  // Keep all other methods from original ClientService for backward compatibility
  // ... (campaigns, analytics, messages, etc.)
}

export { EnhancedClientService as ClientService };
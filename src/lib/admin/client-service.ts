/**
 * Client Management Service
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
import { AdminStorage } from './storage';
import { TeamService } from './team-service';

export class ClientService {
  private static readonly STORAGE_KEYS = {
    CLIENTS: 'fm_admin_clients',
    CAMPAIGNS: 'fm_campaigns', 
    ANALYTICS: 'fm_client_analytics',
    MESSAGES: 'fm_client_messages',
    MEETINGS: 'fm_client_meetings',
    OPPORTUNITIES: 'fm_growth_opportunities',
    NOTIFICATIONS: 'fm_notifications',
    DELIVERABLES: 'fm_deliverables'
  };

  // ===== DATE UTILITY METHODS =====
  
  /**
   * Safely validate and format date strings
   */
  static validateAndFormatDate(dateValue: any): string | null {
    if (!dateValue) return null;
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return null; // Invalid date
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Invalid date value:', dateValue);
      return null;
    }
  }
  
  /**
   * Safely get ISO string for dates
   */
  static safeToISOString(dateValue: any): string {
    if (!dateValue) return new Date().toISOString();
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return new Date().toISOString(); // Return current date for invalid dates
      }
      return date.toISOString();
    } catch (error) {
      console.warn('Invalid date value, using current date:', dateValue);
      return new Date().toISOString();
    }
  }

  // ===== CLIENT PROFILE MANAGEMENT =====

  static getAllClients(): ClientProfile[] {
    try {
      // Run migration first to fix any old client structures
      this.migrateOldClients();
      
      const clients = localStorage.getItem(this.STORAGE_KEYS.CLIENTS);
      return clients ? JSON.parse(clients) : this.getDefaultClients();
    } catch (error) {
      console.error('Error loading clients:', error);
      return this.getDefaultClients();
    }
  }

  /**
   * Get invoice-compatible clients from registered clients and manual entries
   */
  static async getInvoiceClients(): Promise<Array<{id: string; name: string; email: string; phone: string; address: string; city: string; state: string; zipCode: string; country: string; gstNumber?: string}>> {
    try {
      // Get registered clients from the clients API
      const baseUrl = typeof window === 'undefined' 
        ? process.env.NEXT_PUBLIC_BASE_URL || ''
        : '';
      const fetchUrl = `${baseUrl}/api/clients?sortBy=createdAt&sortDirection=desc`;
      const response = await fetch(fetchUrl);
      const result = await response.json();
      
      if (!result.success) {
        console.warn('Failed to fetch clients from API, falling back to localStorage');
        try {
          return AdminStorage.getClients();
        } catch (storageError) {
          console.error('Error loading from localStorage:', storageError);
          return [];
        }
      }

      const clients = result.data || [];
      
      // Convert registered clients to invoice client format with better field mapping including GST
      const clientsFromAPI = clients.map((client: any) => {
        // Handle nested data structures properly
        const primaryContact = client.primaryContact || {};
        const headquarters = client.headquarters || {};
        
        const mappedClient = {
          id: client.id, // Don't add prefix to avoid ID conflicts
          name: client.name || 'Unknown Client',
          email: primaryContact.email || client.email || '',
          phone: primaryContact.phone || client.phone || '',
          address: headquarters.street || client.address || headquarters.address || '',
          city: headquarters.city || client.city || '',
          state: headquarters.state || client.state || '',
          zipCode: headquarters.zipCode || client.zipCode || '',
          country: headquarters.country || client.country || 'India',
          gstNumber: client.gstNumber || ''
        };
        
        // Debug HARSH client specifically
        if (client.name && client.name.includes('HARSH')) {
        }
        
        return mappedClient;
      });

      // Skip localStorage clients for now - only use API clients
      // const manualClients = AdminStorage.getClients();

      // Use only API clients
      const allClients = [...clientsFromAPI];

      // Remove duplicates by ID first, then by email (but not both for same record)
      const uniqueClients = allClients.filter((client, index, self) => {
        // First check for ID duplicates (most important)
        const idIndex = self.findIndex(c => c.id === client.id);
        if (idIndex !== index) {
          return false;
        }
        
        // Only check email duplicates if ID is unique (avoid double filtering)
        if (client.email) {
          const emailIndex = self.findIndex(c => 
            c.email && 
            c.email.toLowerCase() === client.email.toLowerCase() && 
            c.id !== client.id  // Ensure we're not comparing with the same client by ID
          );
          if (emailIndex !== -1 && emailIndex < index) {
            return false;
          }
        }
        
        return true;
      });

      const sortedClients = uniqueClients.sort((a, b) => a.name.localeCompare(b.name));
      
      // Special check for HARSH
      const harshClient = sortedClients.find(c => c.name.includes('HARSH'));
      if (harshClient) {
      } else {
      }
      
      return sortedClients;
    } catch (error) {
      console.error('Error fetching invoice clients:', error);
      // Fallback to localStorage only
      try {
        return AdminStorage.getClients();
      } catch (storageError) {
        console.error('Error loading from localStorage fallback:', storageError);
        return [];
      }
    }
  }

  static async getClientById(id: string): Promise<ClientProfile | null> {
    try {
      // First check localStorage clients
      const localClients = this.getAllClients();
      const localClient = localClients.find(client => client.id === id);
      if (localClient) {
        return localClient;
      }

      // If not found in localStorage, check API clients
      const baseUrl = typeof window !== 'undefined' 
        ? '' 
        : process.env.NEXT_PUBLIC_BASE_URL || '';
      
      const response = await fetch(`${baseUrl}/api/clients`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const apiClient = result.data.find((client: any) => client.id === id);
        if (apiClient) {
          
          try {
            // Convert API client to ClientProfile format
            return {
            id: apiClient.id,
            name: apiClient.name,
            industry: apiClient.industry || 'other',
            website: '',
            description: `Client from ${apiClient.company}`,
            
            primaryContact: {
              id: `contact-${apiClient.id}`,
              name: apiClient.name,
              email: apiClient.email || '',
              phone: apiClient.phone || '',
              role: 'Primary Contact',
              isPrimary: true
            },
            additionalContacts: [],
            
            companySize: 'medium',
            founded: '',
            headquarters: {
              street: apiClient.address || apiClient.company || '',
              city: apiClient.city || '',
              state: apiClient.state || '',
              zipCode: apiClient.zipCode || '',
              country: apiClient.country || 'India'
            },
            
            accountManager: 'user-001',
            status: apiClient.status || 'active',
            health: apiClient.health || 'good',
            
            contractDetails: {
              type: 'project',
              startDate: this.validateAndFormatDate(apiClient.createdAt) || new Date().toISOString().split('T')[0],
              endDate: undefined,
              value: parseInt(apiClient.totalValue) || 0,
              currency: 'INR',
              billingCycle: 'monthly',
              services: [],
              isActive: true
            },
            
            onboardedAt: this.safeToISOString(apiClient.createdAt),
            lastActivity: new Date().toISOString(),
            createdAt: this.safeToISOString(apiClient.createdAt),
            updatedAt: new Date().toISOString(),
            tags: [apiClient.industry || 'general'],
            notes: []
            };
          } catch (conversionError) {
            console.error('Error converting API client to ClientProfile:', conversionError);
            console.error('Problematic API client data:', apiClient);
            return null;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting client by ID:', error);
      return null;
    }
  }

  /**
   * Migrate old flat client structure to proper ClientProfile structure
   */
  static migrateOldClients(): void {
    try {
      const clients = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CLIENTS) || '[]');
      let migrationNeeded = false;
      
      const migratedClients = clients.map((client: any) => {
        // Check if client needs migration (old flat structure)
        if (!client.primaryContact || !client.headquarters || !client.contractDetails) {
          migrationNeeded = true;
          
          return {
            id: client.id,
            name: client.name || client.company,
            logo: client.logo || undefined,
            industry: client.industry || 'other',
            website: client.website || undefined,
            description: client.description || `Client: ${client.name || client.company}`,
            
            // Contact Information
            primaryContact: {
              id: `contact-${client.id || Date.now()}`,
              name: client.name || 'Primary Contact',
              email: client.email || '',
              phone: client.phone || '',
              role: 'Primary Contact',
              department: client.department || undefined,
              isPrimary: true,
              linkedInUrl: client.linkedIn || undefined
            },
            additionalContacts: client.additionalContacts || [],
            
            // Business Details
            companySize: client.companySize || 'medium',
            founded: client.founded || undefined,
            headquarters: {
              street: client.address || '',
              city: client.city || '',
              state: client.state || '',
              zipCode: client.zipCode || '',
              country: client.country || 'India'
            },
            
            // Account Management
            accountManager: client.accountManager || 'admin',
            status: client.status || 'active',
            health: client.health || 'good',
            
            // Contract & Billing
            contractDetails: {
              type: client.contractType || 'project',
              startDate: this.validateAndFormatDate(client.contractStartDate) || new Date().toISOString().split('T')[0],
              endDate: this.validateAndFormatDate(client.contractEndDate),
              value: parseFloat(client.totalValue) || 0,
              currency: 'INR',
              billingCycle: client.billingCycle || 'monthly',
              retainerAmount: client.retainerAmount || undefined,
              services: client.services || [],
              terms: client.terms || undefined,
              isActive: true
            },
            
            // Tax & Legal
            gstNumber: client.gstNumber || undefined,
            
            // Metadata
            onboardedAt: this.safeToISOString(client.onboardedAt || client.createdAt),
            lastActivity: this.safeToISOString(client.lastActivity),
            createdAt: this.safeToISOString(client.createdAt),
            updatedAt: new Date().toISOString(),
            tags: client.tags || [],
            notes: client.notes || []
          };
        }
        
        return client; // Already properly structured
      });
      
      if (migrationNeeded) {
        localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(migratedClients));
      }
    } catch (error) {
      console.error('Error during client migration:', error);
    }
  }

  /**
   * Get assigned team members for a client
   */
  static getClientTeamMembers(clientId: string) {
    return TeamService.getTeamMembersForClient(clientId);
  }

  /**
   * Assign team member to client
   */
  static assignTeamMemberToClient(clientId: string, teamMemberId: string, hoursAllocated: number, isLead = false) {
    return TeamService.assignTeamMemberToClient(teamMemberId, clientId, hoursAllocated, isLead);
  }

  /**
   * Remove team member from client
   */
  static removeTeamMemberFromClient(clientId: string, teamMemberId: string) {
    return TeamService.removeTeamMemberFromClient(teamMemberId, clientId);
  }

  static saveClient(client: ClientProfile): void {
    const clients = this.getAllClients();
    const existingIndex = clients.findIndex(c => c.id === client.id);
    
    if (existingIndex >= 0) {
      clients[existingIndex] = { ...client, updatedAt: new Date().toISOString() };
    } else {
      clients.push({ ...client, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }

  static deleteClient(id: string): void {
    const clients = this.getAllClients().filter(client => client.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }

  static getClientsByStatus(status: ClientStatus): ClientProfile[] {
    return this.getAllClients().filter(client => client.status === status);
  }

  static getClientsByHealth(health: ClientHealth): ClientProfile[] {
    return this.getAllClients().filter(client => client.health === health);
  }

  static getClientsByIndustry(industry: Industry): ClientProfile[] {
    return this.getAllClients().filter(client => client.industry === industry);
  }

  static searchClients(query: string): ClientProfile[] {
    const searchTerm = query.toLowerCase();
    return this.getAllClients().filter(client =>
      client.name.toLowerCase().includes(searchTerm) ||
      client.industry.toLowerCase().includes(searchTerm) ||
      client.primaryContact.name.toLowerCase().includes(searchTerm) ||
      client.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // ===== CAMPAIGN MANAGEMENT =====

  static getAllCampaigns(): Campaign[] {
    try {
      // Check if localStorage is available (client-side only)
      if (typeof window === 'undefined') {
        return this.getDefaultCampaigns();
      }
      
      const campaigns = localStorage.getItem(this.STORAGE_KEYS.CAMPAIGNS);
      return campaigns ? JSON.parse(campaigns) : this.getDefaultCampaigns();
    } catch (error) {
      console.error('Error loading campaigns:', error);
      return this.getDefaultCampaigns();
    }
  }

  static getCampaignsByClient(clientId: string): Campaign[] {
    return this.getAllCampaigns().filter(campaign => campaign.clientId === clientId);
  }

  static saveCampaign(campaign: Campaign): void {
    const campaigns = this.getAllCampaigns();
    const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
    
    if (existingIndex >= 0) {
      campaigns[existingIndex] = { ...campaign, updatedAt: new Date().toISOString() };
    } else {
      campaigns.push({ ...campaign, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(this.STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }

  static getActiveCampaigns(): Campaign[] {
    return this.getAllCampaigns().filter(campaign => campaign.status === 'active');
  }

  static getCampaignsByType(type: CampaignType): Campaign[] {
    return this.getAllCampaigns().filter(campaign => campaign.type === type);
  }

  // ===== ANALYTICS & PERFORMANCE =====

  static getClientAnalytics(clientId: string, period: 'week' | 'month' | 'quarter' | 'year' = 'month'): ClientAnalytics | null {
    try {
      const analytics = localStorage.getItem(this.STORAGE_KEYS.ANALYTICS);
      const allAnalytics: ClientAnalytics[] = analytics ? JSON.parse(analytics) : [];
      return allAnalytics.find(a => a.clientId === clientId && a.period === period) || this.generateSampleAnalytics(clientId, period);
    } catch (error) {
      console.error('Error loading analytics:', error);
      return null;
    }
  }

  static saveClientAnalytics(analytics: ClientAnalytics): void {
    const allAnalytics = this.getAllAnalytics();
    const existingIndex = allAnalytics.findIndex(a => 
      a.clientId === analytics.clientId && a.period === analytics.period
    );
    
    if (existingIndex >= 0) {
      allAnalytics[existingIndex] = analytics;
    } else {
      allAnalytics.push(analytics);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.ANALYTICS, JSON.stringify(allAnalytics));
  }

  static getAllAnalytics(): ClientAnalytics[] {
    try {
      const analytics = localStorage.getItem(this.STORAGE_KEYS.ANALYTICS);
      return analytics ? JSON.parse(analytics) : [];
    } catch (error) {
      return [];
    }
  }

  // ===== COMMUNICATION & MESSAGES =====

  static getClientMessages(clientId: string): ClientMessage[] {
    try {
      const messages = localStorage.getItem(this.STORAGE_KEYS.MESSAGES);
      const allMessages: ClientMessage[] = messages ? JSON.parse(messages) : [];
      return allMessages.filter(msg => msg.clientId === clientId).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      return [];
    }
  }

  static saveMessage(message: ClientMessage): void {
    const messages = this.getAllMessages();
    messages.push(message);
    localStorage.setItem(this.STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }

  static getAllMessages(): ClientMessage[] {
    try {
      const messages = localStorage.getItem(this.STORAGE_KEYS.MESSAGES);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      return [];
    }
  }

  static markMessageAsRead(messageId: string): void {
    const messages = this.getAllMessages();
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex >= 0) {
      messages[messageIndex].isRead = true;
      messages[messageIndex].readAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    }
  }

  // ===== MEETINGS & CALLS =====

  static getClientMeetings(clientId: string): ClientMeeting[] {
    try {
      const meetings = localStorage.getItem(this.STORAGE_KEYS.MEETINGS);
      const allMeetings: ClientMeeting[] = meetings ? JSON.parse(meetings) : [];
      return allMeetings.filter(meeting => meeting.clientId === clientId);
    } catch (error) {
      return [];
    }
  }

  static saveMeeting(meeting: ClientMeeting): void {
    const meetings = this.getAllMeetings();
    const existingIndex = meetings.findIndex(m => m.id === meeting.id);
    
    if (existingIndex >= 0) {
      meetings[existingIndex] = { ...meeting, updatedAt: new Date().toISOString() };
    } else {
      meetings.push({ ...meeting, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(this.STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
  }

  static getAllMeetings(): ClientMeeting[] {
    try {
      const meetings = localStorage.getItem(this.STORAGE_KEYS.MEETINGS);
      return meetings ? JSON.parse(meetings) : [];
    } catch (error) {
      return [];
    }
  }

  // ===== GROWTH OPPORTUNITIES =====

  static getGrowthOpportunities(clientId?: string): GrowthOpportunity[] {
    try {
      const opportunities = localStorage.getItem(this.STORAGE_KEYS.OPPORTUNITIES);
      const allOpportunities: GrowthOpportunity[] = opportunities ? JSON.parse(opportunities) : this.getDefaultOpportunities();
      
      return clientId 
        ? allOpportunities.filter(opp => opp.clientId === clientId)
        : allOpportunities;
    } catch (error) {
      return [];
    }
  }

  static saveGrowthOpportunity(opportunity: GrowthOpportunity): void {
    const opportunities = this.getGrowthOpportunities();
    const existingIndex = opportunities.findIndex(opp => opp.id === opportunity.id);
    
    if (existingIndex >= 0) {
      opportunities[existingIndex] = opportunity;
    } else {
      opportunities.push(opportunity);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
  }

  // ===== DELIVERABLES MANAGEMENT =====

  static getClientDeliverables(clientId: string): Deliverable[] {
    try {
      const deliverables = localStorage.getItem(this.STORAGE_KEYS.DELIVERABLES);
      const allDeliverables: Deliverable[] = deliverables ? JSON.parse(deliverables) : [];
      
      // Get campaigns for this client first
      const clientCampaigns = this.getCampaignsByClient(clientId);
      const campaignIds = clientCampaigns.map(c => c.id);
      
      return allDeliverables.filter(del => campaignIds.includes(del.campaignId));
    } catch (error) {
      return [];
    }
  }

  static saveDeliverable(deliverable: Deliverable): void {
    const deliverables = this.getAllDeliverables();
    const existingIndex = deliverables.findIndex(d => d.id === deliverable.id);
    
    if (existingIndex >= 0) {
      deliverables[existingIndex] = { ...deliverable, updatedAt: new Date().toISOString() };
    } else {
      deliverables.push({ ...deliverable, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(this.STORAGE_KEYS.DELIVERABLES, JSON.stringify(deliverables));
  }

  static getAllDeliverables(): Deliverable[] {
    try {
      const deliverables = localStorage.getItem(this.STORAGE_KEYS.DELIVERABLES);
      return deliverables ? JSON.parse(deliverables) : [];
    } catch (error) {
      return [];
    }
  }

  // ===== NOTIFICATIONS =====

  static getNotifications(userId: string): Notification[] {
    try {
      const notifications = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS);
      const allNotifications: Notification[] = notifications ? JSON.parse(notifications) : [];
      return allNotifications.filter(notif => notif.userId === userId).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      return [];
    }
  }

  static createNotification(notification: Notification): void {
    const notifications = this.getAllNotifications();
    notifications.push(notification);
    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  static markNotificationAsRead(notificationId: string): void {
    const notifications = this.getAllNotifications();
    const notificationIndex = notifications.findIndex(notif => notif.id === notificationId);
    if (notificationIndex >= 0) {
      notifications[notificationIndex].isRead = true;
      notifications[notificationIndex].readAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  }

  static getAllNotifications(): Notification[] {
    try {
      const notifications = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS);
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      return [];
    }
  }

  // ===== DASHBOARD ANALYTICS =====

  static async getDashboardStats() {
    try {
      // Determine the base URL for API calls
      const baseUrl = typeof window !== 'undefined' 
        ? '' 
        : process.env.NEXT_PUBLIC_BASE_URL || '';
      
      // Fetch real client data from API instead of localStorage
      const response = await fetch(`${baseUrl}/api/clients`);
      const result = await response.json();
      const clients = result.success ? result.data : [];
      
      
      const campaigns = this.getAllCampaigns();
      const activeClients = clients.filter((c: any) => c.status === 'active');
      const activeCampaigns = campaigns.filter(c => c.status === 'active');
      
      // Calculate total revenue using the correct field name and handle string values
      const totalRevenue = clients.reduce((sum: number, client: any) => {
        const value = typeof client.totalValue === 'string' ? parseFloat(client.totalValue) || 0 : client.totalValue || 0;
        return sum + value;
      }, 0);
      const avgClientValue = totalRevenue / (clients.length || 1);
      
      const healthDistribution = {
        excellent: clients.filter((c: any) => c.health === 'excellent').length,
        good: clients.filter((c: any) => c.health === 'good').length,
        warning: clients.filter((c: any) => c.health === 'warning').length,
        critical: clients.filter((c: any) => c.health === 'critical').length
      };

      return {
        totalClients: clients.length,
        activeClients: activeClients.length,
        activeCampaigns: activeCampaigns.length,
        totalRevenue,
        avgClientValue,
        healthDistribution,
        recentActivity: await this.getRecentActivity()
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      // Fallback to mock data if API fails
      return this.getMockDashboardStats();
    }
  }

  static getMockDashboardStats() {
    return {
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
    };
  }

  static async getRecentActivity() {
    try {
      const activities: Array<{type: string; description: string; timestamp: string; clientName?: string}> = [];
      
      // Determine the base URL for API calls
      const baseUrl = typeof window !== 'undefined' 
        ? '' 
        : process.env.NEXT_PUBLIC_BASE_URL || '';
      
      // Fetch real client data from API
      const response = await fetch(`${baseUrl}/api/clients`);
      const result = await response.json();
      const clients = result.success ? result.data : [];
      
      // Recent client additions
      const recentClients = clients
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      recentClients.forEach((client: any) => {
        activities.push({
          type: 'client_added',
          description: `New client "${client.name}" added`,
          timestamp: client.createdAt,
          clientName: client.name
        });
      });

      // Recent campaigns (fallback to mock data for now)
      const campaigns = this.getAllCampaigns()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      campaigns.forEach(campaign => {
        const client = clients.find((c: any) => c.id === campaign.clientId);
        activities.push({
          type: 'campaign_started',
          description: `Campaign "${campaign.name}" started`,
          timestamp: campaign.createdAt,
          clientName: client?.name
        });
      });

      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  // ===== DEFAULT DATA GENERATORS =====

  private static getDefaultClients(): ClientProfile[] {
    return [
      {
        id: 'client-001',
        name: 'TechStart Solutions',
        industry: 'technology',
        website: 'https://techstartsolutions.com',
        description: 'Fast-growing B2B SaaS company specializing in project management tools',
        
        primaryContact: {
          id: 'contact-001',
          name: 'Rajesh Kumar',
          email: 'rajesh@techstartsolutions.com',
          phone: '+91 98765 43210',
          role: 'Marketing Director',
          isPrimary: true
        },
        additionalContacts: [],
        
        companySize: 'medium',
        founded: '2019',
        headquarters: {
          street: '123 Tech Park',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        },
        
        accountManager: 'user-001',
        status: 'active',
        health: 'excellent',
        
        contractDetails: {
          type: 'retainer',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          value: 480000,
          currency: 'INR',
          billingCycle: 'monthly',
          retainerAmount: 40000,
          services: ['social-media-management', 'paid-advertising', 'content-marketing'],
          isActive: true
        },
        
        onboardedAt: '2024-01-01T00:00:00Z',
        lastActivity: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        tags: ['saas', 'b2b', 'high-value'],
        notes: []
      },
      
      {
        id: 'client-002',
        name: 'Green Earth Organics',
        industry: 'food_beverage',
        website: 'https://greenearthorganics.in',
        description: 'Sustainable organic food brand focused on healthy living',
        
        primaryContact: {
          id: 'contact-002',
          name: 'Priya Sharma',
          email: 'priya@greenearthorganics.in',
          phone: '+91 87654 32109',
          role: 'Brand Manager',
          isPrimary: true
        },
        additionalContacts: [],
        
        companySize: 'small',
        founded: '2020',
        headquarters: {
          street: '456 Organic Lane',
          city: 'Pune',
          state: 'Maharashtra',
          zipCode: '411001',
          country: 'India'
        },
        
        accountManager: 'user-002',
        status: 'active',
        health: 'good',
        
        contractDetails: {
          type: 'project',
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          value: 150000,
          currency: 'INR',
          billingCycle: 'one_time',
          services: ['brand-identity-design', 'website-development', 'social-media-management'],
          isActive: true
        },
        
        onboardedAt: '2024-06-01T00:00:00Z',
        lastActivity: new Date().toISOString(),
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        tags: ['organic', 'sustainable', 'brand-focused'],
        notes: []
      },

      {
        id: 'client-003',
        name: 'FinSecure Insurance',
        industry: 'finance',
        website: 'https://finsecureinsurance.com',
        description: 'Leading insurance provider with focus on digital transformation',
        
        primaryContact: {
          id: 'contact-003',
          name: 'Amit Patel',
          email: 'amit@finsecureinsurance.com',
          phone: '+91 76543 21098',
          role: 'Digital Marketing Head',
          isPrimary: true
        },
        additionalContacts: [],
        
        companySize: 'enterprise',
        founded: '2010',
        headquarters: {
          street: '789 Financial District',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        
        accountManager: 'user-001',
        status: 'active',
        health: 'warning',
        
        contractDetails: {
          type: 'retainer',
          startDate: '2024-03-01',
          endDate: '2025-02-28',
          value: 720000,
          currency: 'INR',
          billingCycle: 'monthly',
          retainerAmount: 60000,
          services: ['digital-strategy-consulting', 'paid-advertising', 'website-development'],
          isActive: true
        },
        
        onboardedAt: '2024-03-01T00:00:00Z',
        lastActivity: new Date().toISOString(),
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        tags: ['finance', 'enterprise', 'digital-transformation'],
        notes: []
      }
    ];
  }

  private static getDefaultCampaigns(): Campaign[] {
    return [
      {
        id: 'campaign-001',
        clientId: 'client-001',
        name: 'TechStart Q4 Growth Campaign',
        description: 'Comprehensive digital marketing campaign to increase product adoption',
        type: 'social_media',
        status: 'active',
        
        startDate: '2024-10-01',
        endDate: '2024-12-31',
        budget: 200000,
        spentAmount: 75000,
        
        objectives: [
          'Increase website traffic by 150%',
          'Generate 500 qualified leads',
          'Improve brand awareness by 80%'
        ],
        kpis: [
          {
            id: 'kpi-001',
            name: 'Website Traffic',
            target: 10000,
            current: 6500,
            unit: 'visits',
            trend: 'up'
          },
          {
            id: 'kpi-002',
            name: 'Lead Generation',
            target: 500,
            current: 187,
            unit: 'leads',
            trend: 'up'
          }
        ],
        
        assignedTeam: ['user-001', 'user-002'],
        deliverables: [],
        progress: 65,
        milestones: [
          {
            id: 'milestone-001',
            name: 'Campaign Launch',
            description: 'All creative assets ready and campaign launched',
            dueDate: '2024-10-15',
            isCompleted: true,
            completedAt: '2024-10-12T10:00:00Z'
          },
          {
            id: 'milestone-002',
            name: 'Mid-campaign Review',
            description: 'Performance review and optimization',
            dueDate: '2024-11-15',
            isCompleted: false
          }
        ],
        
        createdAt: '2024-09-15T00:00:00Z',
        updatedAt: new Date().toISOString()
      },

      {
        id: 'campaign-002',
        clientId: 'client-002',
        name: 'Organic Brand Launch',
        description: 'Brand identity and digital presence launch for Green Earth Organics',
        type: 'branding',
        status: 'active',
        
        startDate: '2024-06-01',
        endDate: '2024-08-31',
        budget: 150000,
        spentAmount: 120000,
        
        objectives: [
          'Develop complete brand identity',
          'Launch responsive website',
          'Create social media presence'
        ],
        kpis: [
          {
            id: 'kpi-003',
            name: 'Brand Recognition',
            target: 100,
            current: 85,
            unit: 'score',
            trend: 'up'
          }
        ],
        
        assignedTeam: ['user-002', 'user-003'],
        deliverables: [],
        progress: 80,
        milestones: [
          {
            id: 'milestone-003',
            name: 'Brand Identity Complete',
            description: 'Logo, colors, typography finalized',
            dueDate: '2024-06-30',
            isCompleted: true,
            completedAt: '2024-06-25T14:00:00Z'
          },
          {
            id: 'milestone-004',
            name: 'Website Launch',
            description: 'Website development and launch',
            dueDate: '2024-08-15',
            isCompleted: false
          }
        ],
        
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      }
    ];
  }

  private static getDefaultOpportunities(): GrowthOpportunity[] {
    return [
      {
        id: 'opp-001',
        clientId: 'client-001',
        title: 'SEO Services Addition',
        description: 'Client expressed interest in improving organic search presence',
        type: 'upsell',
        potentialValue: 30000,
        probability: 75,
        suggestedServices: ['seo-optimization'],
        rationale: 'Current campaigns are performing well, client ready to expand to organic search',
        identifiedAt: new Date().toISOString(),
        estimatedCloseDate: '2024-12-01',
        status: 'proposed',
        assignedTo: 'user-001',
        notes: ['Discussed in last client call', 'Preparing proposal']
      },
      {
        id: 'opp-002',
        clientId: 'client-002',
        title: 'E-commerce Platform Development',
        description: 'Opportunity to develop online store for direct-to-consumer sales',
        type: 'cross_sell',
        potentialValue: 200000,
        probability: 60,
        suggestedServices: ['ecommerce-development', 'digital-strategy-consulting'],
        rationale: 'Brand launch successful, ready for online sales expansion',
        identifiedAt: new Date().toISOString(),
        estimatedCloseDate: '2024-11-15',
        status: 'identified',
        assignedTo: 'user-002',
        notes: ['Client mentioned expanding to online sales', 'Need to schedule discovery call']
      }
    ];
  }

  private static generateSampleAnalytics(clientId: string, period: string): ClientAnalytics {
    // Generate sample analytics data
    const baseNumbers = {
      followers: Math.floor(Math.random() * 50000) + 10000,
      engagement: Math.floor(Math.random() * 10) + 2,
      reach: Math.floor(Math.random() * 100000) + 50000,
      clicks: Math.floor(Math.random() * 5000) + 1000,
      conversions: Math.floor(Math.random() * 500) + 100
    };

    return {
      clientId,
      period: period as any,
      
      socialMedia: {
        followers: {
          current: baseNumbers.followers,
          previous: Math.floor(baseNumbers.followers * 0.9),
          change: Math.floor(baseNumbers.followers * 0.1),
          changePercent: 10,
          trend: 'up',
          unit: 'followers'
        },
        engagement: {
          current: baseNumbers.engagement,
          previous: baseNumbers.engagement - 0.5,
          change: 0.5,
          changePercent: 12.5,
          trend: 'up',
          unit: '%'
        },
        reach: {
          current: baseNumbers.reach,
          previous: Math.floor(baseNumbers.reach * 0.85),
          change: Math.floor(baseNumbers.reach * 0.15),
          changePercent: 15,
          trend: 'up',
          unit: 'impressions'
        },
        impressions: {
          current: baseNumbers.reach * 2,
          previous: Math.floor(baseNumbers.reach * 1.7),
          change: Math.floor(baseNumbers.reach * 0.3),
          changePercent: 18,
          trend: 'up',
          unit: 'impressions'
        }
      },
      
      paidAds: {
        impressions: {
          current: baseNumbers.reach * 3,
          previous: Math.floor(baseNumbers.reach * 2.5),
          change: Math.floor(baseNumbers.reach * 0.5),
          changePercent: 20,
          trend: 'up',
          unit: 'impressions'
        },
        clicks: {
          current: baseNumbers.clicks,
          previous: Math.floor(baseNumbers.clicks * 0.8),
          change: Math.floor(baseNumbers.clicks * 0.2),
          changePercent: 25,
          trend: 'up',
          unit: 'clicks'
        },
        ctr: {
          current: 2.5,
          previous: 2.1,
          change: 0.4,
          changePercent: 19,
          trend: 'up',
          unit: '%'
        },
        conversions: {
          current: baseNumbers.conversions,
          previous: Math.floor(baseNumbers.conversions * 0.75),
          change: Math.floor(baseNumbers.conversions * 0.25),
          changePercent: 33,
          trend: 'up',
          unit: 'conversions'
        },
        roas: {
          current: 4.2,
          previous: 3.8,
          change: 0.4,
          changePercent: 10.5,
          trend: 'up',
          unit: 'x'
        },
        spend: {
          current: 25000,
          previous: 22000,
          change: 3000,
          changePercent: 13.6,
          trend: 'up',
          unit: '₹'
        }
      },
      
      website: {
        traffic: {
          current: 15000,
          previous: 12000,
          change: 3000,
          changePercent: 25,
          trend: 'up',
          unit: 'sessions'
        },
        leads: {
          current: 450,
          previous: 320,
          change: 130,
          changePercent: 40.6,
          trend: 'up',
          unit: 'leads'
        },
        conversions: {
          current: 180,
          previous: 140,
          change: 40,
          changePercent: 28.6,
          trend: 'up',
          unit: 'conversions'
        },
        bounceRate: {
          current: 35,
          previous: 42,
          change: -7,
          changePercent: -16.7,
          trend: 'down',
          unit: '%'
        },
        sessionDuration: {
          current: 155,
          previous: 135,
          change: 20,
          changePercent: 14.8,
          trend: 'up',
          unit: 'seconds'
        }
      },
      
      customMetrics: [
        {
          id: 'custom-001',
          name: 'Email Subscribers',
          value: 2850,
          unit: 'subscribers',
          description: 'Total email newsletter subscribers'
        },
        {
          id: 'custom-002',
          name: 'Customer Satisfaction',
          value: 4.6,
          unit: '/5',
          description: 'Average customer satisfaction rating'
        }
      ],
      
      generatedAt: new Date().toISOString()
    };
  }
}
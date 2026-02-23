/**
 * Client Management Service
 * Thin API client for Supabase-backed client data.
 * Campaign/analytics/messages/meetings remain localStorage (no backend tables yet).
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
  CampaignType,
} from './client-types';
/** Helper: build fetch base URL (empty on client, env var on server) */
function apiBase(): string {
  return typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_BASE_URL || '');
}

/** Convert API response row → ClientProfile shape expected by components */
function apiRowToProfile(row: any): ClientProfile {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry || 'other',
    website: row.website || '',
    description: '',
    primaryContact: {
      id: `contact-${row.id}`,
      name: row.name,
      email: row.email || '',
      phone: row.phone || '',
      role: 'Primary Contact',
      isPrimary: true,
    },
    additionalContacts: [],
    companySize: row.companySize || 'medium',
    founded: '',
    headquarters: {
      street: row.address || '',
      city: row.city || '',
      state: row.state || '',
      zipCode: row.zipCode || '',
      country: row.country || 'India',
    },
    accountManager: row.accountManager || 'admin',
    status: row.status || 'active',
    health: row.health || 'good',
    contractDetails: {
      type: row.contractType || 'project',
      startDate: row.contractStartDate || new Date().toISOString().split('T')[0],
      endDate: row.contractEndDate || undefined,
      value: parseFloat(row.contractValue || row.totalValue) || 0,
      currency: 'INR',
      billingCycle: row.billingCycle || 'monthly',
      services: row.services || [],
      isActive: true,
    },
    gstNumber: row.gstNumber || undefined,
    brandName: row.brandName || undefined,
    parentClientId: row.parentClientId || undefined,
    isBrandGroup: row.isBrandGroup || false,
    logoUrl: row.logoUrl || undefined,
    brandColors: row.brandColors || [],
    brandFonts: row.brandFonts || [],
    tagline: row.tagline || undefined,
    brandGuidelinesUrl: row.brandGuidelinesUrl || undefined,
    onboardedAt: row.createdAt || new Date().toISOString(),
    lastActivity: row.updatedAt || new Date().toISOString(),
    createdAt: row.createdAt || new Date().toISOString(),
    updatedAt: row.updatedAt || new Date().toISOString(),
    tags: row.tags || [],
    notes: row.notes || [],
  };
}

export class ClientService {
  private static readonly STORAGE_KEYS = {
    CAMPAIGNS: 'fm_campaigns',
    ANALYTICS: 'fm_client_analytics',
    MESSAGES: 'fm_client_messages',
    MEETINGS: 'fm_client_meetings',
    OPPORTUNITIES: 'fm_growth_opportunities',
    NOTIFICATIONS: 'fm_notifications',
    DELIVERABLES: 'fm_deliverables',
  };

  // ===== CLIENT PROFILE MANAGEMENT (API-backed) =====

  /** Fetch all clients from Supabase via API */
  static async getAllClients(): Promise<ClientProfile[]> {
    try {
      const response = await fetch(`${apiBase()}/api/clients`);
      const result = await response.json();
      if (result.success && result.data) {
        return result.data.map(apiRowToProfile);
      }
      return [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  }

  /** Fetch a single client by ID from API */
  static async getClientById(id: string): Promise<ClientProfile | null> {
    try {
      const response = await fetch(`${apiBase()}/api/clients`);
      const result = await response.json();
      if (result.success && result.data) {
        const row = result.data.find((c: any) => c.id === id);
        return row ? apiRowToProfile(row) : null;
      }
      return null;
    } catch (error) {
      console.error('Error getting client by ID:', error);
      return null;
    }
  }

  /** Get invoice-compatible client list from API */
  static async getInvoiceClients(): Promise<Array<{
    id: string; name: string; email: string; phone: string;
    address: string; city: string; state: string; zipCode: string;
    country: string; gstNumber?: string;
  }>> {
    try {
      const response = await fetch(`${apiBase()}/api/clients`);
      const result = await response.json();
      if (!result.success) return [];

      return (result.data || []).map((client: any) => ({
        id: client.id,
        name: client.name || 'Unknown Client',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zipCode: client.zipCode || '',
        country: client.country || 'India',
        gstNumber: client.gstNumber || '',
      })).sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching invoice clients:', error);
      return [];
    }
  }

  // ===== TEAM MANAGEMENT (migrated to /api/team/assignments — use API directly) =====
  // Team assignment methods have been removed. Use fetch('/api/team/assignments', ...) directly.

  // ===== CAMPAIGN MANAGEMENT (localStorage — no backend table) =====

  static getAllCampaigns(): Campaign[] {
    try {
      if (typeof window === 'undefined') return this.getDefaultCampaigns();
      const campaigns = localStorage.getItem(this.STORAGE_KEYS.CAMPAIGNS);
      return campaigns ? JSON.parse(campaigns) : this.getDefaultCampaigns();
    } catch {
      return this.getDefaultCampaigns();
    }
  }

  static getCampaignsByClient(clientId: string): Campaign[] {
    return this.getAllCampaigns().filter(c => c.clientId === clientId);
  }

  static saveCampaign(campaign: Campaign): void {
    const campaigns = this.getAllCampaigns();
    const idx = campaigns.findIndex(c => c.id === campaign.id);
    if (idx >= 0) {
      campaigns[idx] = { ...campaign, updatedAt: new Date().toISOString() };
    } else {
      campaigns.push({ ...campaign, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(this.STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }

  static getActiveCampaigns(): Campaign[] {
    return this.getAllCampaigns().filter(c => c.status === 'active');
  }

  static getCampaignsByType(type: CampaignType): Campaign[] {
    return this.getAllCampaigns().filter(c => c.type === type);
  }

  // ===== ANALYTICS (localStorage — no backend table) =====

  static getClientAnalytics(clientId: string, period: 'week' | 'month' | 'quarter' | 'year' = 'month'): ClientAnalytics | null {
    try {
      const analytics = localStorage.getItem(this.STORAGE_KEYS.ANALYTICS);
      const all: ClientAnalytics[] = analytics ? JSON.parse(analytics) : [];
      return all.find(a => a.clientId === clientId && a.period === period) || this.generateSampleAnalytics(clientId, period);
    } catch {
      return null;
    }
  }

  static saveClientAnalytics(analytics: ClientAnalytics): void {
    const all = this.getAllAnalytics();
    const idx = all.findIndex(a => a.clientId === analytics.clientId && a.period === analytics.period);
    if (idx >= 0) all[idx] = analytics; else all.push(analytics);
    localStorage.setItem(this.STORAGE_KEYS.ANALYTICS, JSON.stringify(all));
  }

  static getAllAnalytics(): ClientAnalytics[] {
    try {
      const analytics = localStorage.getItem(this.STORAGE_KEYS.ANALYTICS);
      return analytics ? JSON.parse(analytics) : [];
    } catch { return []; }
  }

  // ===== COMMUNICATION & MESSAGES (localStorage) =====

  static getClientMessages(clientId: string): ClientMessage[] {
    try {
      const messages = localStorage.getItem(this.STORAGE_KEYS.MESSAGES);
      const all: ClientMessage[] = messages ? JSON.parse(messages) : [];
      return all.filter(m => m.clientId === clientId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch { return []; }
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
    } catch { return []; }
  }

  static markMessageAsRead(messageId: string): void {
    const messages = this.getAllMessages();
    const msg = messages.find(m => m.id === messageId);
    if (msg) {
      msg.isRead = true;
      msg.readAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    }
  }

  // ===== MEETINGS (localStorage) =====

  static getClientMeetings(clientId: string): ClientMeeting[] {
    try {
      const meetings = localStorage.getItem(this.STORAGE_KEYS.MEETINGS);
      const all: ClientMeeting[] = meetings ? JSON.parse(meetings) : [];
      return all.filter(m => m.clientId === clientId);
    } catch { return []; }
  }

  static saveMeeting(meeting: ClientMeeting): void {
    const meetings = this.getAllMeetings();
    const idx = meetings.findIndex(m => m.id === meeting.id);
    if (idx >= 0) {
      meetings[idx] = { ...meeting, updatedAt: new Date().toISOString() };
    } else {
      meetings.push({ ...meeting, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(this.STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
  }

  static getAllMeetings(): ClientMeeting[] {
    try {
      const meetings = localStorage.getItem(this.STORAGE_KEYS.MEETINGS);
      return meetings ? JSON.parse(meetings) : [];
    } catch { return []; }
  }

  // ===== GROWTH OPPORTUNITIES (localStorage) =====

  static getGrowthOpportunities(clientId?: string): GrowthOpportunity[] {
    try {
      const opps = localStorage.getItem(this.STORAGE_KEYS.OPPORTUNITIES);
      const all: GrowthOpportunity[] = opps ? JSON.parse(opps) : this.getDefaultOpportunities();
      return clientId ? all.filter(o => o.clientId === clientId) : all;
    } catch { return []; }
  }

  static saveGrowthOpportunity(opportunity: GrowthOpportunity): void {
    const opps = this.getGrowthOpportunities();
    const idx = opps.findIndex(o => o.id === opportunity.id);
    if (idx >= 0) opps[idx] = opportunity; else opps.push(opportunity);
    localStorage.setItem(this.STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
  }

  // ===== DELIVERABLES (localStorage) =====

  static getClientDeliverables(clientId: string): Deliverable[] {
    try {
      const deliverables = localStorage.getItem(this.STORAGE_KEYS.DELIVERABLES);
      const all: Deliverable[] = deliverables ? JSON.parse(deliverables) : [];
      const campaignIds = this.getCampaignsByClient(clientId).map(c => c.id);
      return all.filter(d => campaignIds.includes(d.campaignId));
    } catch { return []; }
  }

  static saveDeliverable(deliverable: Deliverable): void {
    const all = this.getAllDeliverables();
    const idx = all.findIndex(d => d.id === deliverable.id);
    if (idx >= 0) {
      all[idx] = { ...deliverable, updatedAt: new Date().toISOString() };
    } else {
      all.push({ ...deliverable, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(this.STORAGE_KEYS.DELIVERABLES, JSON.stringify(all));
  }

  static getAllDeliverables(): Deliverable[] {
    try {
      const deliverables = localStorage.getItem(this.STORAGE_KEYS.DELIVERABLES);
      return deliverables ? JSON.parse(deliverables) : [];
    } catch { return []; }
  }

  // ===== NOTIFICATIONS (localStorage) =====

  static getNotifications(userId: string): Notification[] {
    try {
      const notifs = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS);
      const all: Notification[] = notifs ? JSON.parse(notifs) : [];
      return all.filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch { return []; }
  }

  static createNotification(notification: Notification): void {
    const all = this.getAllNotifications();
    all.push(notification);
    localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
  }

  static markNotificationAsRead(notificationId: string): void {
    const all = this.getAllNotifications();
    const notif = all.find(n => n.id === notificationId);
    if (notif) {
      notif.isRead = true;
      notif.readAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    }
  }

  static getAllNotifications(): Notification[] {
    try {
      const notifs = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS);
      return notifs ? JSON.parse(notifs) : [];
    } catch { return []; }
  }

  // ===== DASHBOARD ANALYTICS (API-backed) =====

  static async getDashboardStats() {
    try {
      const response = await fetch(`${apiBase()}/api/clients`);
      const result = await response.json();
      const clients = result.success ? result.data : [];

      const campaigns = this.getAllCampaigns();
      const activeClients = clients.filter((c: any) => c.status === 'active');
      const activeCampaigns = campaigns.filter(c => c.status === 'active');

      const totalRevenue = clients.reduce((sum: number, client: any) => {
        const value = typeof client.totalValue === 'string' ? parseFloat(client.totalValue) || 0 : client.totalValue || 0;
        return sum + value;
      }, 0);

      return {
        totalClients: clients.length,
        activeClients: activeClients.length,
        activeCampaigns: activeCampaigns.length,
        totalRevenue,
        avgClientValue: totalRevenue / (clients.length || 1),
        healthDistribution: {
          excellent: clients.filter((c: any) => c.health === 'excellent').length,
          good: clients.filter((c: any) => c.health === 'good').length,
          warning: clients.filter((c: any) => c.health === 'warning').length,
          critical: clients.filter((c: any) => c.health === 'critical').length,
        },
        recentActivity: await this.getRecentActivity(),
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalClients: 0, activeClients: 0, activeCampaigns: 0,
        totalRevenue: 0, avgClientValue: 0,
        healthDistribution: { excellent: 0, good: 0, warning: 0, critical: 0 },
        recentActivity: [],
      };
    }
  }

  static async getRecentActivity() {
    try {
      const response = await fetch(`${apiBase()}/api/clients`);
      const result = await response.json();
      const clients = result.success ? result.data : [];
      const activities: Array<{ type: string; description: string; timestamp: string; clientName?: string }> = [];

      clients
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .forEach((client: any) => {
          activities.push({
            type: 'client_added',
            description: `New client "${client.name}" added`,
            timestamp: client.createdAt,
            clientName: client.name,
          });
        });

      this.getAllCampaigns()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .forEach(campaign => {
          const client = clients.find((c: any) => c.id === campaign.clientId);
          activities.push({
            type: 'campaign_started',
            description: `Campaign "${campaign.name}" started`,
            timestamp: campaign.createdAt,
            clientName: client?.name,
          });
        });

      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    } catch {
      return [];
    }
  }

  // ===== DEFAULT DATA (demo) =====

  private static getDefaultCampaigns(): Campaign[] {
    return [
      {
        id: 'campaign-001', clientId: 'client-001', name: 'TechStart Q4 Growth Campaign',
        description: 'Comprehensive digital marketing campaign to increase product adoption',
        type: 'social_media', status: 'active', startDate: '2024-10-01', endDate: '2024-12-31',
        budget: 200000, spentAmount: 75000,
        objectives: ['Increase website traffic by 150%', 'Generate 500 qualified leads', 'Improve brand awareness by 80%'],
        kpis: [
          { id: 'kpi-001', name: 'Website Traffic', target: 10000, current: 6500, unit: 'visits', trend: 'up' },
          { id: 'kpi-002', name: 'Lead Generation', target: 500, current: 187, unit: 'leads', trend: 'up' },
        ],
        assignedTeam: ['user-001', 'user-002'], deliverables: [], progress: 65,
        milestones: [
          { id: 'milestone-001', name: 'Campaign Launch', description: 'All creative assets ready and campaign launched', dueDate: '2024-10-15', isCompleted: true, completedAt: '2024-10-12T10:00:00Z' },
          { id: 'milestone-002', name: 'Mid-campaign Review', description: 'Performance review and optimization', dueDate: '2024-11-15', isCompleted: false },
        ],
        createdAt: '2024-09-15T00:00:00Z', updatedAt: new Date().toISOString(),
      },
      {
        id: 'campaign-002', clientId: 'client-002', name: 'Organic Brand Launch',
        description: 'Brand identity and digital presence launch for Green Earth Organics',
        type: 'branding', status: 'active', startDate: '2024-06-01', endDate: '2024-08-31',
        budget: 150000, spentAmount: 120000,
        objectives: ['Develop complete brand identity', 'Launch responsive website', 'Create social media presence'],
        kpis: [{ id: 'kpi-003', name: 'Brand Recognition', target: 100, current: 85, unit: 'score', trend: 'up' }],
        assignedTeam: ['user-002', 'user-003'], deliverables: [], progress: 80,
        milestones: [
          { id: 'milestone-003', name: 'Brand Identity Complete', description: 'Logo, colors, typography finalized', dueDate: '2024-06-30', isCompleted: true, completedAt: '2024-06-25T14:00:00Z' },
          { id: 'milestone-004', name: 'Website Launch', description: 'Website development and launch', dueDate: '2024-08-15', isCompleted: false },
        ],
        createdAt: '2024-06-01T00:00:00Z', updatedAt: new Date().toISOString(),
      },
    ];
  }

  private static getDefaultOpportunities(): GrowthOpportunity[] {
    return [
      {
        id: 'opp-001', clientId: 'client-001', title: 'SEO Services Addition',
        description: 'Client expressed interest in improving organic search presence',
        type: 'upsell', potentialValue: 30000, probability: 75,
        suggestedServices: ['seo-optimization'],
        rationale: 'Current campaigns are performing well, client ready to expand to organic search',
        identifiedAt: new Date().toISOString(), estimatedCloseDate: '2024-12-01',
        status: 'proposed', assignedTo: 'user-001',
        notes: ['Discussed in last client call', 'Preparing proposal'],
      },
      {
        id: 'opp-002', clientId: 'client-002', title: 'E-commerce Platform Development',
        description: 'Opportunity to develop online store for direct-to-consumer sales',
        type: 'cross_sell', potentialValue: 200000, probability: 60,
        suggestedServices: ['ecommerce-development', 'digital-strategy-consulting'],
        rationale: 'Brand launch successful, ready for online sales expansion',
        identifiedAt: new Date().toISOString(), estimatedCloseDate: '2024-11-15',
        status: 'identified', assignedTo: 'user-002',
        notes: ['Client mentioned expanding to online sales', 'Need to schedule discovery call'],
      },
    ];
  }

  private static generateSampleAnalytics(clientId: string, period: string): ClientAnalytics {
    const base = {
      followers: Math.floor(Math.random() * 50000) + 10000,
      engagement: Math.floor(Math.random() * 10) + 2,
      reach: Math.floor(Math.random() * 100000) + 50000,
      clicks: Math.floor(Math.random() * 5000) + 1000,
      conversions: Math.floor(Math.random() * 500) + 100,
    };

    return {
      clientId, period: period as any,
      socialMedia: {
        followers: { current: base.followers, previous: Math.floor(base.followers * 0.9), change: Math.floor(base.followers * 0.1), changePercent: 10, trend: 'up', unit: 'followers' },
        engagement: { current: base.engagement, previous: base.engagement - 0.5, change: 0.5, changePercent: 12.5, trend: 'up', unit: '%' },
        reach: { current: base.reach, previous: Math.floor(base.reach * 0.85), change: Math.floor(base.reach * 0.15), changePercent: 15, trend: 'up', unit: 'impressions' },
        impressions: { current: base.reach * 2, previous: Math.floor(base.reach * 1.7), change: Math.floor(base.reach * 0.3), changePercent: 18, trend: 'up', unit: 'impressions' },
      },
      paidAds: {
        impressions: { current: base.reach * 3, previous: Math.floor(base.reach * 2.5), change: Math.floor(base.reach * 0.5), changePercent: 20, trend: 'up', unit: 'impressions' },
        clicks: { current: base.clicks, previous: Math.floor(base.clicks * 0.8), change: Math.floor(base.clicks * 0.2), changePercent: 25, trend: 'up', unit: 'clicks' },
        ctr: { current: 2.5, previous: 2.1, change: 0.4, changePercent: 19, trend: 'up', unit: '%' },
        conversions: { current: base.conversions, previous: Math.floor(base.conversions * 0.75), change: Math.floor(base.conversions * 0.25), changePercent: 33, trend: 'up', unit: 'conversions' },
        roas: { current: 4.2, previous: 3.8, change: 0.4, changePercent: 10.5, trend: 'up', unit: 'x' },
        spend: { current: 25000, previous: 22000, change: 3000, changePercent: 13.6, trend: 'up', unit: '₹' },
      },
      website: {
        traffic: { current: 15000, previous: 12000, change: 3000, changePercent: 25, trend: 'up', unit: 'sessions' },
        leads: { current: 450, previous: 320, change: 130, changePercent: 40.6, trend: 'up', unit: 'leads' },
        conversions: { current: 180, previous: 140, change: 40, changePercent: 28.6, trend: 'up', unit: 'conversions' },
        bounceRate: { current: 35, previous: 42, change: -7, changePercent: -16.7, trend: 'down', unit: '%' },
        sessionDuration: { current: 155, previous: 135, change: 20, changePercent: 14.8, trend: 'up', unit: 'seconds' },
      },
      customMetrics: [
        { id: 'custom-001', name: 'Email Subscribers', value: 2850, unit: 'subscribers', description: 'Total email newsletter subscribers' },
        { id: 'custom-002', name: 'Customer Satisfaction', value: 4.6, unit: '/5', description: 'Average customer satisfaction rating' },
      ],
      generatedAt: new Date().toISOString(),
    };
  }
}

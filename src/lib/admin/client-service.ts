/**
 * Client Management Service
 * Thin API client for Supabase-backed client data.
 */

import { ClientProfile } from './client-types';

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

  // ===== DASHBOARD ANALYTICS (API-backed) =====

  static async getDashboardStats() {
    try {
      const response = await fetch(`${apiBase()}/api/clients`);
      const result = await response.json();
      const clients = result.success ? result.data : [];
      const activeClients = clients.filter((c: any) => c.status === 'active');

      const totalRevenue = clients.reduce((sum: number, client: any) => {
        const value = typeof client.totalValue === 'string' ? parseFloat(client.totalValue) || 0 : client.totalValue || 0;
        return sum + value;
      }, 0);

      return {
        totalClients: clients.length,
        activeClients: activeClients.length,
        totalRevenue,
        avgClientValue: totalRevenue / (clients.length || 1),
        healthDistribution: {
          excellent: clients.filter((c: any) => c.health === 'excellent').length,
          good: clients.filter((c: any) => c.health === 'good').length,
          warning: clients.filter((c: any) => c.health === 'warning').length,
          critical: clients.filter((c: any) => c.health === 'critical').length,
        },
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalClients: 0, activeClients: 0,
        totalRevenue: 0, avgClientValue: 0,
        healthDistribution: { excellent: 0, good: 0, warning: 0, critical: 0 },
      };
    }
  }
}

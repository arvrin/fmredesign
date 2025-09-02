/**
 * Client Portal Profile API
 * Provides client-specific profile information for the client dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';
import type { ClientProfile } from '@/lib/admin/client-types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const sheetsService = new GoogleSheetsService();
    
    // Get client data from Google Sheets
    let clientsData: any[][];
    try {
      clientsData = await sheetsService.readSheet('Clients');
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    if (clientsData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Convert to objects
    const headers = clientsData[0];
    const clients = clientsData.slice(1).map(row => {
      const client: any = {};
      headers.forEach((header: string, index: number) => {
        if (header && row[index] !== undefined) {
          client[header] = row[index];
        }
      });
      return client;
    });

    // Find the specific client
    const client = clients.find((c: any) => c.id === clientId);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Transform client data for the response
    const clientProfile = transformClientData(client);

    return NextResponse.json({
      success: true,
      data: clientProfile
    });

  } catch (error) {
    console.error('Error fetching client profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch client profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Transform raw client data from Google Sheets to client profile format
 */
function transformClientData(data: any): ClientProfile {
  return {
    id: data.id || '',
    name: data.name || data.companyName || '',
    logo: data.logo || '',
    industry: data.industry || 'other',
    website: data.website || '',
    description: data.description || '',
    
    // Contact Information (simplified for client view)
    primaryContact: {
      id: data.primaryContactId || 'contact-1',
      name: data.primaryContactName || data.contactName || '',
      email: data.primaryContactEmail || data.email || '',
      phone: data.primaryContactPhone || data.phone || '',
      role: data.primaryContactRole || 'Primary Contact',
      department: data.primaryContactDepartment || '',
      isPrimary: true,
      linkedInUrl: data.linkedInUrl || ''
    },
    additionalContacts: [], // Not exposed to clients
    
    // Business Details
    companySize: data.companySize || 'small',
    founded: data.founded || '',
    headquarters: {
      street: data.street || '',
      city: data.city || '',
      state: data.state || '',
      zipCode: data.zipCode || '',
      country: data.country || 'India'
    },
    
    // Account Management (limited info for client)
    accountManager: data.accountManager || 'Account Manager',
    status: data.status || 'active',
    health: data.health || 'good',
    
    // Contract & Billing (limited info)
    contractDetails: {
      type: data.contractType || 'retainer',
      startDate: data.contractStartDate || data.startDate || new Date().toISOString(),
      endDate: data.contractEndDate || data.endDate || undefined,
      value: parseFloat(data.contractValue || data.totalValue || '0'),
      currency: data.currency || 'INR',
      billingCycle: data.billingCycle || 'monthly',
      retainerAmount: parseFloat(data.retainerAmount || '0'),
      services: data.services ? data.services.split(',').map((s: string) => s.trim()) : [],
      terms: data.terms || '',
      isActive: data.status === 'active'
    },
    
    // Metadata
    onboardedAt: data.onboardedAt || data.createdAt || new Date().toISOString(),
    lastActivity: data.lastActivity || data.updatedAt || new Date().toISOString(),
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
    notes: [] // Internal notes not exposed to clients
  };
}
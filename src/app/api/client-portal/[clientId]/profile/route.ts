/**
 * Client Portal Profile API
 * Provides client-specific profile information from Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
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

    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error || !client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Transform Supabase snake_case data to client profile format
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
      },
      { status: 500 }
    );
  }
}

/**
 * Transform Supabase row to client profile format
 */
function transformClientData(data: any): ClientProfile {
  return {
    id: data.id || '',
    name: data.name || '',
    logo: data.logo || '',
    industry: data.industry || 'other',
    website: data.website || '',
    description: data.description || '',

    primaryContact: {
      id: 'contact-1',
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      role: 'Primary Contact',
      department: '',
      isPrimary: true,
      linkedInUrl: ''
    },
    additionalContacts: [],

    companySize: data.company_size || 'small',
    founded: data.founded || '',
    headquarters: {
      street: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zipCode: data.zip_code || '',
      country: data.country || 'India'
    },

    accountManager: data.account_manager || 'Account Manager',
    status: data.status || 'active',
    health: data.health || 'good',

    contractDetails: {
      type: data.contract_type || 'retainer',
      startDate: data.contract_start_date || new Date().toISOString(),
      endDate: data.contract_end_date || undefined,
      value: parseFloat(data.contract_value || data.total_value || '0'),
      currency: data.currency || 'INR',
      billingCycle: data.billing_cycle || 'monthly',
      retainerAmount: parseFloat(data.retainer_amount || '0'),
      services: data.services ? (typeof data.services === 'string' ? data.services.split(',').map((s: string) => s.trim()) : data.services) : [],
      terms: data.terms || '',
      isActive: data.status === 'active'
    },

    onboardedAt: data.created_at || new Date().toISOString(),
    lastActivity: data.updated_at || new Date().toISOString(),
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    tags: data.tags ? (typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()) : data.tags) : [],
    notes: []
  };
}

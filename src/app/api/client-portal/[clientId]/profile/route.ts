/**
 * Client Portal Profile API
 * Provides client-specific profile information from Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { resolveClientId } from '@/lib/client-portal/resolve-client';
import { requireClientAuth } from '@/lib/client-session';
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

    const authError = await requireClientAuth(request, clientId);
    if (authError) return authError;

    const resolved = await resolveClientId(clientId);
    if (!resolved) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', resolved.id)
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

const ALLOWED_FIELDS = [
  'name', 'email', 'phone', 'website', 'description',
  'logo', 'address', 'city', 'state', 'zip_code', 'country',
];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    const authError = await requireClientAuth(request, clientId);
    if (authError) return authError;

    const resolved = await resolveClientId(clientId);
    if (!resolved) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const body = await request.json();

    // Filter to only allowed fields
    const updates: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (ALLOWED_FIELDS.includes(key)) {
        updates[key] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();
    updates.last_activity = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from('clients')
      .update(updates)
      .eq('id', resolved.id);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating client profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
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
      startDate: data.contract_start_date || null,
      endDate: data.contract_end_date || undefined,
      value: parseFloat(data.contract_value || data.total_value || '0'),
      currency: data.currency || 'INR',
      billingCycle: data.billing_cycle || 'monthly',
      retainerAmount: parseFloat(data.retainer_amount || '0'),
      services: data.services ? (typeof data.services === 'string' ? data.services.split(',').map((s: string) => s.trim()) : data.services) : [],
      terms: data.terms || '',
      isActive: data.status === 'active'
    },

    onboardedAt: data.onboarded_at || data.created_at || new Date().toISOString(),
    lastActivity: data.updated_at || new Date().toISOString(),
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    tags: data.tags ? (typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()) : data.tags) : [],
    notes: []
  };
}

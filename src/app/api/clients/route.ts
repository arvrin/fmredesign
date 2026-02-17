/**
 * Clients API Route
 * Handles client operations with Supabase (single source of truth)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform snake_case to camelCase for frontend compatibility
    const formatted = (clients || []).map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      city: c.city,
      state: c.state,
      zipCode: c.zip_code,
      country: c.country,
      gstNumber: c.gst_number,
      industry: c.industry,
      companySize: c.company_size,
      website: c.website,
      status: c.status,
      health: c.health,
      accountManager: c.account_manager,
      contractType: c.contract_type,
      contractValue: c.contract_value,
      contractStartDate: c.contract_start_date,
      contractEndDate: c.contract_end_date,
      billingCycle: c.billing_cycle,
      services: c.services,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      totalValue: c.total_value,
      tags: c.tags,
      notes: c.notes,
    }));

    const response = NextResponse.json({
      success: true,
      data: formatted,
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    if (!formData.id) {
      formData.id = `client-${Date.now()}`;
    }

    // Build the structured client data for the response
    const clientData = {
      id: formData.id,
      name: formData.name || formData.company,
      logo: formData.logo || undefined,
      industry: formData.industry || 'other',
      website: formData.website || undefined,
      description: formData.description || undefined,
      primaryContact: {
        id: `contact-${Date.now()}`,
        name: formData.name || 'Primary Contact',
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.contactRole || 'Primary Contact',
        department: formData.department || undefined,
        isPrimary: true,
        linkedInUrl: formData.linkedIn || undefined,
      },
      additionalContacts: [],
      companySize: formData.companySize || 'medium',
      founded: formData.founded || undefined,
      headquarters: {
        street: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        country: formData.country || 'India',
      },
      accountManager: formData.accountManager || 'admin',
      status: formData.status || 'active',
      health: formData.health || 'good',
      contractDetails: {
        type: formData.contractType || 'project',
        startDate: new Date().toISOString(),
        endDate: formData.contractEndDate || undefined,
        value: parseFloat(formData.totalValue) || 0,
        currency: 'INR',
        billingCycle: formData.billingCycle || 'monthly',
        retainerAmount: formData.retainerAmount || undefined,
        services: formData.services || [],
        terms: formData.terms || undefined,
        isActive: true,
      },
      gstNumber: formData.gstNumber || undefined,
      onboardedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags || [],
      notes: [],
    };

    // Write to Supabase
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('clients').upsert([
      {
        id: clientData.id,
        name: clientData.name,
        email: clientData.primaryContact.email,
        phone: clientData.primaryContact.phone || null,
        industry: clientData.industry,
        website: formData.website || null,
        address: clientData.headquarters.street || null,
        city: clientData.headquarters.city || null,
        state: clientData.headquarters.state || null,
        zip_code: clientData.headquarters.zipCode || null,
        country: clientData.headquarters.country || null,
        gst_number: clientData.gstNumber || null,
        company_size: clientData.companySize,
        status: clientData.status,
        health: clientData.health,
        account_manager: clientData.accountManager,
        contract_type: clientData.contractDetails.type,
        contract_value: clientData.contractDetails.value,
        contract_start_date: clientData.contractDetails.startDate,
        contract_end_date: formData.contractEndDate || null,
        billing_cycle: clientData.contractDetails.billingCycle,
        total_value: clientData.contractDetails.value,
        portal_password: formData.portalPassword || null,
        services: Array.isArray(clientData.contractDetails.services)
          ? clientData.contractDetails.services
          : null,
        tags: Array.isArray(clientData.tags) ? clientData.tags : null,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: clientData,
      message: 'Client created successfully',
    });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...formData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (formData.name) updates.name = formData.name;
    if (formData.email) updates.email = formData.email;
    if (formData.phone !== undefined) updates.phone = formData.phone || null;
    if (formData.industry) updates.industry = formData.industry;
    if (formData.website !== undefined) updates.website = formData.website || null;
    if (formData.address !== undefined) updates.address = formData.address || null;
    if (formData.city !== undefined) updates.city = formData.city || null;
    if (formData.state !== undefined) updates.state = formData.state || null;
    if (formData.zipCode !== undefined) updates.zip_code = formData.zipCode || null;
    if (formData.country !== undefined) updates.country = formData.country || null;
    if (formData.gstNumber !== undefined) updates.gst_number = formData.gstNumber || null;
    if (formData.companySize) updates.company_size = formData.companySize;
    if (formData.status) updates.status = formData.status;
    if (formData.health) updates.health = formData.health;
    if (formData.accountManager) updates.account_manager = formData.accountManager;
    if (formData.contractType) updates.contract_type = formData.contractType;
    if (formData.contractValue !== undefined) updates.contract_value = parseFloat(formData.contractValue) || 0;
    if (formData.contractStartDate) updates.contract_start_date = formData.contractStartDate;
    if (formData.contractEndDate !== undefined) updates.contract_end_date = formData.contractEndDate || null;
    if (formData.billingCycle) updates.billing_cycle = formData.billingCycle;
    if (formData.totalValue !== undefined) updates.total_value = parseFloat(formData.totalValue) || 0;
    if (formData.services) updates.services = formData.services;
    if (formData.tags) updates.tags = formData.tags;
    if (formData.portalPassword !== undefined) updates.portal_password = formData.portalPassword || null;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    // Build response data matching original format
    const clientData = {
      id,
      name: formData.name,
      primaryContact: {
        id: `contact-${Date.now()}`,
        name: formData.name || 'Primary Contact',
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.contactRole || 'Primary Contact',
        isPrimary: true,
      },
      additionalContacts: [],
      companySize: formData.companySize || 'medium',
      headquarters: {
        street: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        country: formData.country || 'India',
      },
      accountManager: formData.accountManager || 'admin',
      status: formData.status || 'active',
      health: formData.health || 'good',
      contractDetails: {
        type: formData.contractType || 'project',
        startDate: formData.contractStartDate || new Date().toISOString(),
        endDate: formData.contractEndDate || undefined,
        value: parseFloat(formData.contractValue) || 0,
        currency: 'INR',
        billingCycle: formData.billingCycle || 'monthly',
        services: formData.services || [],
        isActive: true,
      },
      gstNumber: formData.gstNumber || undefined,
      industry: formData.industry || 'other',
      website: formData.website || undefined,
      updatedAt: new Date().toISOString(),
      tags: formData.tags || [],
      notes: formData.notes || [],
    };

    return NextResponse.json({
      success: true,
      data: clientData,
      message: 'Client updated successfully',
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('id');

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('clients').delete().eq('id', clientId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Client with ID ${clientId} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}

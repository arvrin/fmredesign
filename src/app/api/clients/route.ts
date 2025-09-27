/**
 * Clients API Route
 * Handles client operations with Google Sheets integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    const clients = await googleSheetsService.getClients();

    const response = NextResponse.json({
      success: true,
      data: clients
    });

    // Prevent caching to ensure fresh data
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
    
    // Generate client ID if not provided
    if (!formData.id) {
      formData.id = `client-${Date.now()}`;
    }
    
    // Transform form data to proper ClientProfile structure
    const clientData = {
      id: formData.id,
      name: formData.name || formData.company, // Use company as fallback for name
      logo: formData.logo || undefined,
      industry: formData.industry || 'other',
      website: formData.website || undefined,
      description: formData.description || undefined,
      
      // Contact Information
      primaryContact: {
        id: `contact-${Date.now()}`,
        name: formData.name || 'Primary Contact',
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.contactRole || 'Primary Contact',
        department: formData.department || undefined,
        isPrimary: true,
        linkedInUrl: formData.linkedIn || undefined
      },
      additionalContacts: [],
      
      // Business Details
      companySize: formData.companySize || 'medium',
      founded: formData.founded || undefined,
      headquarters: {
        street: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        country: formData.country || 'India'
      },
      
      // Account Management
      accountManager: formData.accountManager || 'admin',
      status: formData.status || 'active',
      health: formData.health || 'good',
      
      // Contract & Billing
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
        isActive: true
      },
      
      // Tax & Legal
      gstNumber: formData.gstNumber || undefined,
      
      // Metadata
      onboardedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags || [],
      notes: []
    };
    
    // Flatten the client data for Google Sheets storage
    const flatClientData = {
      id: clientData.id,
      name: clientData.name,
      email: clientData.primaryContact.email,
      phone: clientData.primaryContact.phone,
      address: clientData.headquarters.street,
      city: clientData.headquarters.city,
      state: clientData.headquarters.state,
      zipCode: clientData.headquarters.zipCode,
      country: clientData.headquarters.country,
      gstNumber: clientData.gstNumber,
      industry: clientData.industry,
      companySize: clientData.companySize,
      website: formData.website,
      status: clientData.status,
      health: clientData.health,
      accountManager: clientData.accountManager,
      contractType: clientData.contractDetails.type,
      contractValue: clientData.contractDetails.value,
      contractStartDate: clientData.contractDetails.startDate,
      contractEndDate: formData.contractEndDate,
      billingCycle: clientData.contractDetails.billingCycle,
      services: Array.isArray(clientData.contractDetails.services) ? clientData.contractDetails.services.join(', ') : '',
      createdAt: clientData.createdAt,
      updatedAt: clientData.updatedAt,
      totalValue: clientData.contractDetails.value,
      tags: Array.isArray(clientData.tags) ? clientData.tags.join(', ') : '',
      notes: ''
    };

    const success = await googleSheetsService.addClient(flatClientData);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        data: clientData,
        message: 'Client created successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to create client' },
        { status: 500 }
      );
    }
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
    
    
    // Transform flat form data to proper ClientProfile structure
    const clientData = {
      id: id,
      name: formData.name,
      logo: formData.logo || undefined,
      industry: formData.industry || 'other',
      website: formData.website || undefined,
      description: formData.description || undefined,
      
      // Contact Information
      primaryContact: {
        id: `contact-${Date.now()}`,
        name: formData.name || 'Primary Contact',
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.contactRole || 'Primary Contact',
        department: formData.department || undefined,
        isPrimary: true,
        linkedInUrl: formData.linkedIn || undefined
      },
      additionalContacts: [],
      
      // Business Details
      companySize: formData.companySize || 'medium',
      founded: formData.founded || undefined,
      headquarters: {
        street: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
        country: formData.country || 'India'
      },
      
      // Account Management
      accountManager: formData.accountManager || 'admin',
      status: formData.status || 'active',
      health: formData.health || 'good',
      
      // Contract & Billing
      contractDetails: {
        type: formData.contractType || 'project',
        startDate: formData.contractStartDate || new Date().toISOString(),
        endDate: formData.contractEndDate || undefined,
        value: parseFloat(formData.contractValue) || 0,
        currency: 'INR',
        billingCycle: formData.billingCycle || 'monthly',
        retainerAmount: formData.retainerAmount || undefined,
        services: formData.services || [],
        terms: formData.terms || undefined,
        isActive: true
      },
      
      // Tax & Legal
      gstNumber: formData.gstNumber || undefined,
      
      // Metadata
      onboardedAt: formData.onboardedAt || new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags || [],
      notes: formData.notes || []
    };
    
    
    const success = await googleSheetsService.updateClient(id, clientData);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        data: clientData,
        message: 'Client updated successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to update client' },
        { status: 500 }
      );
    }
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
    
    
    const success = await googleSheetsService.deleteClient(clientId);
    
    if (success) {
      return NextResponse.json({ 
        success: true,
        message: `Client with ID ${clientId} deleted successfully` 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to delete client or client not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
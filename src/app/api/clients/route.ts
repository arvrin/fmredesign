/**
 * Clients API Route
 * Handles client operations with Google Sheets integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    const clients = await googleSheetsService.getClients();
    
    return NextResponse.json({ 
      success: true, 
      data: clients 
    });
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
    const clientData = await request.json();
    
    // Generate client ID if not provided
    if (!clientData.id) {
      clientData.id = `client-${Date.now()}`;
    }
    
    // Add timestamps and defaults
    clientData.createdAt = new Date().toISOString();
    clientData.status = clientData.status || 'active';
    clientData.health = clientData.health || 'good';
    clientData.totalValue = clientData.totalValue || 0;
    
    const success = await googleSheetsService.addClient(clientData);
    
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
    const { clientId, ...updates } = await request.json();
    
    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }
    
    // Add update timestamp
    updates.updatedAt = new Date().toISOString();
    
    const success = await googleSheetsService.updateClient(clientId, updates);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
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
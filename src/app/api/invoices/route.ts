/**
 * Invoice API Route
 * Handles invoice operations with Google Sheets integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    
    const invoices = await googleSheetsService.getInvoices();
    
    // Filter by client if specified
    const filteredInvoices = clientId 
      ? invoices.filter(invoice => invoice.clientId === clientId)
      : invoices;
    
    return NextResponse.json({ 
      success: true, 
      data: filteredInvoices 
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json();
    
    // Generate invoice ID and number if not provided
    if (!invoiceData.id) {
      invoiceData.id = `inv-${Date.now()}`;
    }
    
    if (!invoiceData.invoiceNumber) {
      const year = new Date().getFullYear();
      const timestamp = Date.now().toString().slice(-4);
      invoiceData.invoiceNumber = `FM-${year}-${timestamp}`;
    }
    
    // Add timestamps
    invoiceData.createdAt = new Date().toISOString();
    invoiceData.status = invoiceData.status || 'draft';
    
    const success = await googleSheetsService.addInvoice(invoiceData);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        data: invoiceData,
        message: 'Invoice created successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to create invoice' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { invoiceId, status } = await request.json();
    
    if (!invoiceId || !status) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID and status are required' },
        { status: 400 }
      );
    }
    
    const success = await googleSheetsService.updateInvoiceStatus(invoiceId, status);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Invoice status updated successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to update invoice status' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}
/**
 * Invoice API Route
 * Handles invoice operations with Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const supabase = getSupabaseAdmin();
    let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Transform to camelCase for frontend compatibility
    const invoices = (data || []).map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoice_number,
      clientId: inv.client_id,
      clientName: inv.client_name,
      date: inv.date,
      dueDate: inv.due_date,
      subtotal: inv.subtotal,
      tax: inv.tax,
      total: inv.total,
      status: inv.status,
      createdAt: inv.created_at,
      lineItems: inv.line_items,
      notes: inv.notes,
    }));

    return NextResponse.json({
      success: true,
      data: invoices,
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

    if (!invoiceData.id) {
      invoiceData.id = `inv-${Date.now()}`;
    }

    if (!invoiceData.invoiceNumber) {
      const year = new Date().getFullYear();
      const timestamp = Date.now().toString().slice(-4);
      invoiceData.invoiceNumber = `FM-${year}-${timestamp}`;
    }

    const record = {
      id: invoiceData.id,
      invoice_number: invoiceData.invoiceNumber,
      client_id: invoiceData.clientId,
      client_name: invoiceData.clientName,
      date: invoiceData.date,
      due_date: invoiceData.dueDate,
      subtotal: parseFloat(invoiceData.subtotal) || 0,
      tax: parseFloat(invoiceData.tax) || 0,
      total: parseFloat(invoiceData.total) || 0,
      status: invoiceData.status || 'draft',
      line_items: invoiceData.lineItems || [],
      notes: invoiceData.notes || '',
    };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('invoices').insert(record);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: invoiceData,
      message: 'Invoice created successfully',
    });
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

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', invoiceId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Invoice status updated successfully',
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

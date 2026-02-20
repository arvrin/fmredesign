/**
 * Invoice API Route
 * CRUD operations for invoices with Supabase persistence.
 *
 * GET  /api/invoices          - List all invoices (with optional filters)
 * POST /api/invoices          - Create or update (upsert) an invoice
 * PUT  /api/invoices          - Update invoice status or fields
 * DELETE /api/invoices?id=xyz - Delete an invoice
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth, requirePermission } from '@/lib/admin-auth-middleware';
import { createInvoiceSchema, updateInvoiceSchema, validateBody } from '@/lib/validations/schemas';
import { notifyTeam, invoiceCreatedEmail } from '@/lib/email/send';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SELECT_COLS = [
  'id', 'invoice_number', 'client_id', 'client_name', 'client_email',
  'client_phone', 'client_address', 'client_city', 'client_state',
  'client_country', 'client_gst_number', 'date', 'due_date', 'subtotal',
  'tax_rate', 'tax_amount', 'tax', 'total', 'status', 'line_items',
  'notes', 'terms', 'created_at', 'updated_at',
].join(', ');

/** Transform a Supabase row (snake_case) → API response (camelCase) */
function transformInvoice(row: Record<string, unknown>) {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    date: row.date,
    dueDate: row.due_date,
    client: {
      id: row.client_id || '',
      name: row.client_name || '',
      email: row.client_email || '',
      phone: row.client_phone || '',
      address: row.client_address || '',
      city: row.client_city || '',
      state: row.client_state || '',
      country: row.client_country || 'India',
      gstNumber: row.client_gst_number || '',
    },
    lineItems: row.line_items || [],
    subtotal: Number(row.subtotal) || 0,
    taxRate: Number(row.tax_rate) || 18,
    taxAmount: Number(row.tax_amount) || Number(row.tax) || 0,
    total: Number(row.total) || 0,
    notes: row.notes || '',
    terms: row.terms || '',
    status: row.status || 'draft',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Build Supabase record from request body */
function buildRecord(body: Record<string, unknown>) {
  const client = (body.client || {}) as Record<string, unknown>;

  return {
    id: (body.id as string) || `inv-${Date.now()}`,
    invoice_number: body.invoiceNumber as string,
    date: body.date as string,
    due_date: body.dueDate as string,
    client_id: (client.id as string) || (body.clientId as string) || '',
    client_name: (client.name as string) || (body.clientName as string) || '',
    client_email: (client.email as string) || '',
    client_phone: (client.phone as string) || '',
    client_address: (client.address as string) || '',
    client_city: (client.city as string) || '',
    client_state: (client.state as string) || '',
    client_country: (client.country as string) || 'India',
    client_gst_number: (client.gstNumber as string) || '',
    line_items: body.lineItems || [],
    subtotal: parseFloat(String(body.subtotal)) || 0,
    tax_rate: parseFloat(String(body.taxRate)) || 18,
    tax_amount: parseFloat(String(body.taxAmount)) || 0,
    tax: parseFloat(String(body.taxAmount)) || 0,
    total: parseFloat(String(body.total)) || 0,
    notes: (body.notes as string) || '',
    terms: (body.terms as string) || '',
    status: (body.status as string) || 'draft',
    updated_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// GET - List invoices
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('invoices')
      .select(SELECT_COLS)
      .order('created_at', { ascending: false });

    if (clientId) query = query.eq('client_id', clientId);
    if (status) query = query.eq('status', status);
    if (search) {
      query = query.or(
        `invoice_number.ilike.%${search}%,client_name.ilike.%${search}%`,
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    const invoices = ((data || []) as unknown as Record<string, unknown>[]).map(transformInvoice);

    // Summary stats
    const stats = {
      total: invoices.length,
      draft: invoices.filter(i => i.status === 'draft').length,
      sent: invoices.filter(i => i.status === 'sent').length,
      paid: invoices.filter(i => i.status === 'paid').length,
      overdue: invoices.filter(i => i.status === 'overdue').length,
      totalOutstanding: invoices
        .filter(i => i.status === 'sent' || i.status === 'overdue')
        .reduce((s, i) => s + i.total, 0),
      totalPaid: invoices
        .filter(i => i.status === 'paid')
        .reduce((s, i) => s + i.total, 0),
    };

    return NextResponse.json({ success: true, data: invoices, stats });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST - Create or upsert invoice
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'finance.write');
  if ('error' in auth) return auth.error;

  try {
    const rawBody = await request.json();
    const validation = validateBody(createInvoiceSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const body = rawBody;
    const record = buildRecord(body);

    const supabase = getSupabaseAdmin();

    // Upsert: if id exists, update; otherwise insert
    const { error } = await supabase
      .from('invoices')
      .upsert(record, { onConflict: 'id' });

    if (error) throw error;

    // Fire-and-forget email notification
    const emailData = invoiceCreatedEmail({
      invoiceNumber: record.invoice_number,
      clientName: record.client_name,
      total: record.total,
      currency: record.client_country?.toLowerCase() === 'india' ? 'INR' : (body.currency as string) || 'INR',
      dueDate: record.due_date,
      status: record.status,
    });
    notifyTeam(emailData.subject, emailData.html);

    return NextResponse.json({
      success: true,
      data: { id: record.id },
      message: 'Invoice saved successfully',
    });
  } catch (error) {
    console.error('Error saving invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save invoice' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// PUT - Update invoice status or specific fields
// ---------------------------------------------------------------------------

export async function PUT(request: NextRequest) {
  const auth = await requirePermission(request, 'finance.write');
  if ('error' in auth) return auth.error;

  try {
    const rawBody = await request.json();
    const validation = validateBody(updateInvoiceSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const body = rawBody as Record<string, unknown>;
    const { invoiceId, status, ...rest } = body;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updates.status = status;

    // Allow partial field updates
    if (rest.notes !== undefined) updates.notes = rest.notes;
    if (rest.terms !== undefined) updates.terms = rest.terms;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', invoiceId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE - Remove an invoice
// ---------------------------------------------------------------------------

export async function DELETE(request: NextRequest) {
  const auth = await requirePermission(request, 'finance.delete');
  if ('error' in auth) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required' },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('invoices').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete invoice' },
      { status: 500 },
    );
  }
}

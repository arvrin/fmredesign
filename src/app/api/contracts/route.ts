/**
 * Admin Contracts API
 * GET    /api/contracts?clientId=xxx       — list contracts for a client
 * GET    /api/contracts?id=xxx             — single contract
 * POST   /api/contracts                   — create contract
 * PUT    /api/contracts                   — update contract (status, fields)
 * DELETE /api/contracts?id=xxx            — delete contract
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth, requirePermission } from '@/lib/admin-auth-middleware';
import { createContractSchema, updateContractSchema, validateBody } from '@/lib/validations/schemas';
import { logAuditEvent, getClientIP } from '@/lib/admin/audit-log';
import { transformContract } from '@/lib/admin/contract-types';
import { notifyTeam, contractCreatedEmail, contractStatusEmail } from '@/lib/email/send';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const id = searchParams.get('id');

    const supabase = getSupabaseAdmin();

    if (id) {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return NextResponse.json({ success: false, error: 'Contract not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: transformContract(data) });
    }

    let query = supabase.from('contracts').select('*').order('created_at', { ascending: false });
    if (clientId) query = query.eq('client_id', clientId);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: (data || []).map(transformContract),
    });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch contracts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'clients.write');
  if ('error' in auth) return auth.error;

  try {
    const rawBody = await request.json();
    const validation = validateBody(createContractSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const body = validation.data;

    const id = `contract-${Date.now()}`;
    const record = {
      id,
      client_id: body.clientId,
      title: body.title.trim(),
      contract_number: body.contractNumber?.trim() || null,
      status: 'draft',
      services: body.services,
      total_value: body.services.reduce((sum: number, s: { total: number }) => sum + s.total, 0),
      currency: body.currency || 'INR',
      start_date: body.startDate || null,
      end_date: body.endDate || null,
      payment_terms: body.paymentTerms?.trim() || null,
      billing_cycle: body.billingCycle || null,
      terms_and_conditions: body.termsAndConditions?.trim() || null,
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('contracts').insert(record).select().single();
    if (error) throw error;

    // Fire-and-forget email notification
    const emailData = contractCreatedEmail({
      title: record.title,
      contractNumber: record.contract_number || undefined,
      totalValue: record.total_value,
      currency: record.currency,
    });
    notifyTeam(emailData.subject, emailData.html);

    logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'create',
      resource_type: 'contract',
      resource_id: id,
      details: { title: body.title, clientId: body.clientId, totalValue: body.totalValue },
      ip_address: getClientIP(request),
    });

    return NextResponse.json(
      { success: true, data: transformContract(data), message: 'Contract created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json({ success: false, error: 'Failed to create contract' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requirePermission(request, 'clients.write');
  if ('error' in auth) return auth.error;

  try {
    const rawBody = await request.json();
    const validation = validateBody(updateContractSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const { id, ...body } = rawBody;

    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.contractNumber !== undefined) updates.contract_number = body.contractNumber || null;
    if (body.services !== undefined) {
      updates.services = body.services;
      // Recompute total from services
      updates.total_value = (body.services as Array<{ total: number }>).reduce(
        (sum: number, s: { total: number }) => sum + s.total, 0
      );
    }
    if (body.startDate !== undefined) updates.start_date = body.startDate || null;
    if (body.endDate !== undefined) updates.end_date = body.endDate || null;
    if (body.paymentTerms !== undefined) updates.payment_terms = body.paymentTerms || null;
    if (body.billingCycle !== undefined) updates.billing_cycle = body.billingCycle || null;
    if (body.termsAndConditions !== undefined) updates.terms_and_conditions = body.termsAndConditions || null;
    if (body.revisionNotes !== undefined) updates.revision_notes = body.revisionNotes || null;

    // Status transitions — admin can only set draft or sent
    if (body.status !== undefined) {
      const ADMIN_SETTABLE = ['draft', 'sent'];
      if (!ADMIN_SETTABLE.includes(body.status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status transition' },
          { status: 400 }
        );
      }
      updates.status = body.status;
      if (body.status === 'sent') {
        updates.sent_at = new Date().toISOString();
        updates.client_feedback = null; // Clear stale feedback on re-send
      }
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('contracts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ success: false, error: 'Contract not found' }, { status: 404 });

    // Fire-and-forget email when status changes
    if (body.status === 'sent') {
      const emailData = contractStatusEmail({ title: data.title, action: 'sent' });
      notifyTeam(emailData.subject, emailData.html);
    }

    logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'update',
      resource_type: 'contract',
      resource_id: id,
      details: { updatedFields: Object.keys(updates), newStatus: body.status },
      ip_address: getClientIP(request),
    });

    return NextResponse.json({ success: true, data: transformContract(data), message: 'Contract updated' });
  } catch (error) {
    console.error('Error updating contract:', error);
    return NextResponse.json({ success: false, error: 'Failed to update contract' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requirePermission(request, 'clients.delete');
  if ('error' in auth) return auth.error;

  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Contract ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Verify contract exists and is deletable
    const { data: existing } = await supabase
      .from('contracts')
      .select('id, status')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Contract not found' }, { status: 404 });
    }

    if (existing.status === 'accepted' || existing.status === 'sent') {
      return NextResponse.json(
        { success: false, error: `Cannot delete a contract with status "${existing.status}"` },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('contracts').delete().eq('id', id);
    if (error) throw error;

    logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'delete',
      resource_type: 'contract',
      resource_id: id,
      details: {},
      ip_address: getClientIP(request),
    });

    return NextResponse.json({ success: true, message: 'Contract deleted successfully' });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete contract' }, { status: 500 });
  }
}

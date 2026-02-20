/**
 * Client Portal Contracts API
 * GET  — list sent/accepted/rejected/edit_requested contracts for this client
 * PUT  — client takes action (accept/reject/request_edit) on a sent contract
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireClientAuth } from '@/lib/client-session';
import { resolveClientId } from '@/lib/client-portal/resolve-client';
import { notifyAdmins } from '@/lib/notifications';
import { contractActionSchema, validateBody } from '@/lib/validations/schemas';
import { transformContract } from '@/lib/admin/contract-types';
import { notifyTeam, contractStatusEmail } from '@/lib/email/send';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;

    const authError = await requireClientAuth(request, clientId);
    if (authError) return authError;

    const resolved = await resolveClientId(clientId);
    if (!resolved) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('client_id', resolved.id)
      .in('status', ['sent', 'accepted', 'rejected', 'edit_requested'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase contracts query error:', error);
      return NextResponse.json({ success: true, data: [], total: 0 });
    }

    const contracts = (data || []).map(transformContract);
    return NextResponse.json({ success: true, data: contracts, total: contracts.length });
  } catch (error) {
    console.error('Error fetching client contracts:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch contracts' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;

    const authError = await requireClientAuth(request, clientId);
    if (authError) return authError;

    const resolved = await resolveClientId(clientId);
    if (!resolved) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const rawBody = await request.json();
    const validation = validateBody(contractActionSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const { contractId, action, feedback } = validation.data;

    // Verify contract belongs to this client and is in 'sent' status
    const supabase = getSupabaseAdmin();
    const { data: contract, error: fetchError } = await supabase
      .from('contracts')
      .select('id, status, client_id, title, services, total_value, start_date, end_date, currency, billing_cycle')
      .eq('id', contractId)
      .eq('client_id', resolved.id)
      .single();

    if (fetchError || !contract) {
      return NextResponse.json({ success: false, error: 'Contract not found' }, { status: 404 });
    }

    if (contract.status !== 'sent') {
      return NextResponse.json(
        { success: false, error: 'Contract is not awaiting review' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (action === 'accept') {
      updates.status = 'accepted';
      updates.accepted_at = new Date().toISOString();
      if (feedback) updates.client_feedback = feedback;
    } else if (action === 'reject') {
      updates.status = 'rejected';
      updates.rejected_at = new Date().toISOString();
      if (feedback) updates.client_feedback = feedback;
    } else {
      // request_edit
      updates.status = 'edit_requested';
      if (feedback) updates.client_feedback = feedback;
    }

    const { error: updateError } = await supabase
      .from('contracts')
      .update(updates)
      .eq('id', contractId);

    if (updateError) {
      console.error('Supabase contract update error:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to update contract' }, { status: 500 });
    }

    // Fire-and-forget: sync contract data to client record + activate projects
    if (action === 'accept') {
      const now = new Date().toISOString();

      // Extract service names from contract's services JSONB
      let serviceNames: string[] = [];
      if (contract.services) {
        const services = typeof contract.services === 'string'
          ? JSON.parse(contract.services)
          : contract.services;
        if (Array.isArray(services)) {
          serviceNames = services.map((s: { name?: string; id?: string } | string) =>
            typeof s === 'string' ? s : (s.name || s.id || '')
          ).filter(Boolean);
        }
      }

      // Derive contract_type from billing_cycle
      const contractType = contract.billing_cycle === 'one-time' ? 'project' : 'retainer';

      // Sync to clients table
      supabase
        .from('clients')
        .update({
          contract_value: contract.total_value,
          contract_start_date: contract.start_date,
          contract_end_date: contract.end_date,
          services: serviceNames,
          onboarded_at: now,
          contract_type: contractType,
          billing_cycle: contract.billing_cycle,
          updated_at: now,
        })
        .eq('id', resolved.id)
        .then(({ error: syncErr }) => {
          if (syncErr) console.error('Failed to sync contract data to client:', syncErr);
          else console.log(`Synced contract data to client ${resolved.id}`);
        });

      // Activate all planning projects for this client
      supabase
        .from('projects')
        .update({ status: 'active', updated_at: now })
        .eq('client_id', resolved.id)
        .eq('status', 'planning')
        .then(({ error: projErr, count }) => {
          if (projErr) console.error('Failed to activate projects:', projErr);
          else console.log(`Activated ${count ?? 0} planning projects for client ${resolved.id}`);
        });
    }

    // Fire-and-forget: notify admin team with branded template
    const actionMap = { accept: 'accepted', reject: 'rejected', request_edit: 'edit_requested' } as const;
    const emailData = contractStatusEmail({
      title: contract.title as string,
      action: actionMap[action],
      clientFeedback: feedback || undefined,
    });
    notifyTeam(emailData.subject, emailData.html);

    // In-app notification for admin team
    const notifTitles = {
      accept: 'Client accepted contract',
      reject: 'Client rejected contract',
      request_edit: 'Client requested contract edits',
    } as const;
    notifyAdmins({
      type: action === 'accept' ? 'contract_accepted' : action === 'reject' ? 'contract_rejected' : 'contract_edit_requested',
      title: notifTitles[action],
      message: `${contract.title}${feedback ? ` — "${feedback}"` : ''}`,
      priority: 'high',
      clientId: resolved.id,
      actionUrl: '/admin/clients',
    });

    return NextResponse.json({ success: true, data: { status: updates.status } });
  } catch (error) {
    console.error('Error updating contract:', error);
    return NextResponse.json({ success: false, error: 'Failed to update contract' }, { status: 500 });
  }
}

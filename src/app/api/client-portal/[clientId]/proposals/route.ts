/**
 * Client Portal Proposals API
 * GET — list proposals sent to this client
 * PUT — client takes action (approve/decline/request_edit) on a proposal
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase';
import { resolveClientId } from '@/lib/client-portal/resolve-client';
import { requireClientAuth } from '@/lib/client-session';
import { notifyAdmins } from '@/lib/notifications';
import { proposalActionSchema, validateBody } from '@/lib/validations/schemas';
import { notifyTeam, proposalStatusEmail } from '@/lib/email/send';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;

    const authError = await requireClientAuth(request, clientId);
    if (authError) return authError;

    const client = await resolveClientId(clientId);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const { data: proposals, error } = await supabaseAdmin
      .from('proposals')
      .select('*')
      .eq('client_id', client.id)
      .in('status', ['sent', 'viewed', 'approved', 'declined', 'expired', 'converted', 'edit_requested'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase proposals query error:', error);
      return NextResponse.json({ success: true, data: [], total: 0 });
    }

    const transformed = (proposals || []).map((p) => ({
      id: p.id,
      proposalNumber: p.proposal_number,
      title: p.title,
      proposalType: p.proposal_type,
      status: p.status,
      validUntil: p.valid_until,
      investment: p.investment || {},
      servicePackages: p.service_packages || [],
      customServices: p.custom_services || [],
      timeline: p.timeline || {},
      executiveSummary: p.executive_summary,
      problemStatement: p.problem_statement,
      proposedSolution: p.proposed_solution,
      whyFreakingMinds: p.why_freaking_minds,
      nextSteps: p.next_steps,
      sentAt: p.sent_at,
      viewedAt: p.viewed_at,
      approvedAt: p.approved_at,
      createdAt: p.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: transformed,
      total: transformed.length,
    });
  } catch (error) {
    console.error('Error fetching client proposals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch proposals' },
      { status: 500 }
    );
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
    const validation = validateBody(proposalActionSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const { proposalId, action, feedback } = validation.data;

    // Verify proposal belongs to this client and is actionable
    const supabase = getSupabaseAdmin();
    const { data: proposal, error: fetchError } = await supabase
      .from('proposals')
      .select('id, status, client_id, title, proposal_number')
      .eq('id', proposalId)
      .eq('client_id', resolved.id)
      .single();

    if (fetchError || !proposal) {
      return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 });
    }

    if (proposal.status !== 'sent' && proposal.status !== 'viewed') {
      return NextResponse.json(
        { success: false, error: 'Proposal is not awaiting review' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (action === 'approve') {
      updates.status = 'approved';
      updates.approved_at = new Date().toISOString();
      if (feedback) updates.client_feedback = feedback;
    } else if (action === 'decline') {
      updates.status = 'declined';
      updates.declined_at = new Date().toISOString();
      if (feedback) updates.client_feedback = feedback;
    } else {
      // request_edit
      updates.status = 'edit_requested';
      if (feedback) updates.client_feedback = feedback;
    }

    const { error: updateError } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', proposalId);

    if (updateError) {
      console.error('Supabase proposal update error:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to update proposal' }, { status: 500 });
    }

    // Fire-and-forget: email notification to admin team
    const actionMap = { approve: 'approved', decline: 'declined', request_edit: 'edit_requested' } as const;
    const emailData = proposalStatusEmail({
      title: proposal.title as string,
      proposalNumber: (proposal.proposal_number as string) || undefined,
      action: actionMap[action],
      clientFeedback: feedback || undefined,
    });
    notifyTeam(emailData.subject, emailData.html);

    // In-app notification for admin team
    const notifTitles = {
      approve: 'Client approved proposal',
      decline: 'Client declined proposal',
      request_edit: 'Client requested proposal edits',
    } as const;
    notifyAdmins({
      type: action === 'approve' ? 'proposal_approved' : action === 'decline' ? 'proposal_declined' : 'proposal_edit_requested',
      title: notifTitles[action],
      message: `${proposal.title}${feedback ? ` — "${feedback}"` : ''}`,
      priority: 'high',
      clientId: resolved.id,
      actionUrl: '/admin/proposals',
    });

    return NextResponse.json({ success: true, data: { status: updates.status } });
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json({ success: false, error: 'Failed to update proposal' }, { status: 500 });
  }
}

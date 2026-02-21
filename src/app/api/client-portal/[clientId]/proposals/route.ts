/**
 * Client Portal Proposals API
 * GET — list proposals sent to this client
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { resolveClientId } from '@/lib/client-portal/resolve-client';
import { requireClientAuth } from '@/lib/client-session';

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
      .in('status', ['sent', 'viewed', 'approved', 'declined', 'expired', 'converted'])
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

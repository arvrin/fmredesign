/**
 * Proposals API Route
 * Handles CRUD operations for proposals (Supabase)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';

// GET /api/proposals - Fetch all proposals
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();
    const searchParams = request.nextUrl.searchParams;

    let query = supabase.from('proposals').select('*');

    const statusFilter = searchParams.get('status');
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const typeFilter = searchParams.get('proposalType');
    if (typeFilter && typeFilter !== 'all') {
      query = query.eq('proposal_type', typeFilter);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    // Transform snake_case to camelCase
    const proposals = (data || []).map((row) => ({
      id: row.id,
      proposalNumber: row.proposal_number,
      title: row.title,
      client: {
        isExisting: row.client_is_existing,
        clientId: row.client_id,
        prospectInfo: row.prospect_info,
      },
      servicePackages: row.service_packages || [],
      customServices: row.custom_services || [],
      timeline: row.timeline || {},
      investment: row.investment || {},
      proposalType: row.proposal_type,
      validUntil: row.valid_until,
      status: row.status,
      executiveSummary: row.executive_summary,
      problemStatement: row.problem_statement,
      proposedSolution: row.proposed_solution,
      whyFreakingMinds: row.why_freaking_minds,
      nextSteps: row.next_steps,
      termsAndConditions: row.terms_and_conditions,
      template: row.template,
      brandColors: row.brand_colors,
      includeCaseStudies: row.include_case_studies,
      includeTestimonials: row.include_testimonials,
      createdBy: row.created_by,
      sentAt: row.sent_at,
      viewedAt: row.viewed_at,
      approvedAt: row.approved_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    // Calculate stats
    const stats = {
      total: proposals.length,
      draft: 0, sent: 0, viewed: 0, approved: 0,
      declined: 0, expired: 0, converted: 0,
      approvalRate: 0, conversionRate: 0,
    };
    proposals.forEach((p) => {
      if (p.status in stats) (stats as any)[p.status]++;
    });
    const sentCount = stats.sent + stats.viewed + stats.approved + stats.declined + stats.expired + stats.converted;
    if (sentCount > 0) {
      stats.approvalRate = ((stats.approved + stats.converted) / sentCount) * 100;
      stats.conversionRate = (stats.converted / sentCount) * 100;
    }

    const response = NextResponse.json({
      success: true,
      data: proposals,
      stats,
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST /api/proposals - Create or update a proposal
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    // Generate proposal number if not provided
    let proposalNumber = body.proposalNumber;
    if (!proposalNumber) {
      const year = new Date().getFullYear();
      // Get highest existing number for this year
      const { data: existing } = await supabase
        .from('proposals')
        .select('proposal_number')
        .like('proposal_number', `PM%/${year}`)
        .order('proposal_number', { ascending: false })
        .limit(1);

      let counter = 163;
      if (existing && existing.length > 0) {
        const match = existing[0].proposal_number.match(/^PM(\d+)\//);
        if (match) counter = parseInt(match[1]);
      }
      proposalNumber = `PM${counter + 1}/${year}`;
    }

    const id = body.id || `prop-${Date.now()}`;

    const record = {
      id,
      proposal_number: proposalNumber,
      title: body.title || 'Untitled Proposal',
      client_is_existing: body.client?.isExisting ?? false,
      client_id: body.client?.clientId || null,
      prospect_info: body.client?.prospectInfo || null,
      service_packages: body.servicePackages || [],
      custom_services: body.customServices || [],
      timeline: body.timeline || {},
      investment: body.investment || {},
      proposal_type: body.proposalType || 'project',
      valid_until: body.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: body.status || 'draft',
      executive_summary: body.executiveSummary || null,
      problem_statement: body.problemStatement || null,
      proposed_solution: body.proposedSolution || null,
      why_freaking_minds: body.whyFreakingMinds || null,
      next_steps: body.nextSteps || null,
      terms_and_conditions: body.termsAndConditions || null,
      template: body.template || 'professional',
      brand_colors: body.brandColors || null,
      include_case_studies: body.includeCaseStudies ?? false,
      include_testimonials: body.includeTestimonials ?? false,
      created_by: body.createdBy || 'admin',
      sent_at: body.sentAt || null,
      viewed_at: body.viewedAt || null,
      approved_at: body.approvedAt || null,
    };

    const { error } = await supabase.from('proposals').upsert(record);
    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: { ...body, id, proposalNumber },
      message: 'Proposal saved successfully',
    });
  } catch (error) {
    console.error('Error saving proposal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save proposal' },
      { status: 500 }
    );
  }
}

// PUT /api/proposals - Update proposal status
export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { id, status, ...rest } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Proposal ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };

    if (status) {
      updates.status = status;
      if (status === 'sent') updates.sent_at = new Date().toISOString();
      if (status === 'viewed') updates.viewed_at = new Date().toISOString();
      if (status === 'approved') updates.approved_at = new Date().toISOString();
    }

    // Map any additional camelCase fields to snake_case
    if (rest.title) updates.title = rest.title;
    if (rest.proposalType) updates.proposal_type = rest.proposalType;

    const { error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Proposal updated successfully',
    });
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update proposal' },
      { status: 500 }
    );
  }
}

// DELETE /api/proposals - Delete a proposal
export async function DELETE(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Proposal ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('proposals').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Proposal deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete proposal' },
      { status: 500 }
    );
  }
}

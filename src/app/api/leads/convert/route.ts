/**
 * Lead to Client Conversion API
 * Converts a qualified lead into a client record
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { logAuditEvent, getAuditUser, getClientIP } from '@/lib/admin/audit-log';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function uniqueSlug(base: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  let slug = base;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from('clients')
      .select('id')
      .eq('slug', slug)
      .limit(1);
    if (!data || data.length === 0) return slug;
    counter++;
    slug = `${base}-${counter}`;
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { leadId } = await request.json();

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Fetch the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    if (lead.status === 'won' && lead.client_id) {
      return NextResponse.json(
        { success: false, error: 'Lead has already been converted to a client' },
        { status: 400 }
      );
    }

    // Create client from lead data
    const clientId = `client-${Date.now()}`;
    const clientName = lead.company || lead.name;

    const { error: clientError } = await supabase.from('clients').insert({
      id: clientId,
      name: clientName,
      email: lead.email,
      phone: lead.phone || null,
      industry: lead.industry || 'other',
      website: lead.website || null,
      company_size: lead.company_size || 'medium',
      status: 'active',
      health: 'good',
      account_manager: lead.assigned_to || 'admin',
      contract_type: 'project',
      contract_value: 0,
      contract_start_date: new Date().toISOString(),
      billing_cycle: 'monthly',
      total_value: 0,
      slug: await uniqueSlug(slugify(clientName)),
      services: lead.project_type ? [lead.project_type] : [],
      tags: lead.tags || [],
    });

    if (clientError) throw clientError;

    // Update lead status to 'won' and link to client
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        status: 'won',
        converted_to_client_at: new Date().toISOString(),
        client_id: clientId,
      })
      .eq('id', leadId);

    if (updateError) throw updateError;

    // Fire-and-forget audit log
    const auditUser = getAuditUser(request);
    logAuditEvent({
      ...auditUser,
      action: 'create',
      resource_type: 'client',
      resource_id: clientId,
      details: { convertedFromLead: leadId, clientName },
      ip_address: getClientIP(request),
    });

    return NextResponse.json({
      success: true,
      data: { leadId, clientId },
      message: 'Lead successfully converted to client',
    });
  } catch (error) {
    console.error('Error converting lead to client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to convert lead to client' },
      { status: 500 }
    );
  }
}

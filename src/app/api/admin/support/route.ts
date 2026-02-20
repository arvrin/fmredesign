/**
 * Admin Support Tickets API
 * GET  — list all tickets across all clients (with client name)
 * PUT  — update ticket status / assigned_to
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth, requirePermission } from '@/lib/admin-auth-middleware';
import { notifyRecipient, ticketStatusUpdateEmail } from '@/lib/email/send';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    let query = supabaseAdmin
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data: tickets, error } = await query;

    if (error) {
      console.error('Admin support tickets query error:', error);
      return NextResponse.json({ success: true, data: [], total: 0 });
    }

    // Fetch all unique client IDs to get names
    const clientIds = [
      ...new Set((tickets || []).map((t) => t.client_id)),
    ];

    let clientMap: Record<string, string> = {};
    if (clientIds.length > 0) {
      const { data: clients } = await supabaseAdmin
        .from('clients')
        .select('id, name')
        .in('id', clientIds);

      clientMap = (clients || []).reduce(
        (acc, c) => ({ ...acc, [c.id]: c.name }),
        {} as Record<string, string>
      );
    }

    const transformed = (tickets || []).map((t) => ({
      id: t.id,
      clientId: t.client_id,
      clientName: clientMap[t.client_id] || 'Unknown Client',
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      category: t.category,
      assignedTo: t.assigned_to || 'Support Team',
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: transformed,
      total: transformed.length,
    });
  } catch (error) {
    console.error('Error fetching admin support tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch support tickets' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requirePermission(request, 'clients.write');
  if ('error' in auth) return auth.error;

  try {
    const body = await request.json();
    const { ticketId, status, assignedTo } = body;

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, string> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (assignedTo !== undefined) updates.assigned_to = assignedTo;

    const { data: ticket, error } = await supabaseAdmin
      .from('support_tickets')
      .update(updates)
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      console.error('Admin ticket update error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update ticket' },
        { status: 500 }
      );
    }

    // Fire-and-forget: notify client about status change
    if (status && ticket.client_id) {
      const { data: client } = await supabaseAdmin
        .from('clients')
        .select('name, email')
        .eq('id', ticket.client_id)
        .single();

      if (client?.email) {
        const emailData = ticketStatusUpdateEmail({
          clientName: client.name || 'there',
          title: ticket.title,
          newStatus: status,
          assignedTo: ticket.assigned_to,
        });
        notifyRecipient(client.email, emailData.subject, emailData.html);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: ticket.id,
        status: ticket.status,
        assignedTo: ticket.assigned_to,
        updatedAt: ticket.updated_at,
      },
    });
  } catch (error) {
    console.error('Error updating support ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}

/**
 * Admin Support Tickets API
 * GET  — list all tickets across all clients (with client name); fetch replies with ?ticketId=X&replies=true
 * PUT  — update ticket status / assigned_to
 * POST — send an admin reply to a ticket
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth, requirePermission } from '@/lib/admin-auth-middleware';
import { notifyRecipient, ticketStatusUpdateEmail } from '@/lib/email/send';
import { notifyClient } from '@/lib/notifications';
import { logAuditEvent, getClientIP } from '@/lib/admin/audit-log';

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

    // If requesting replies for a specific ticket
    const ticketId = searchParams.get('ticketId');
    const includeReplies = searchParams.get('replies');

    if (ticketId && includeReplies === 'true') {
      const { data: replies, error: repliesErr } = await supabaseAdmin
        .from('ticket_replies')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (repliesErr) {
        console.error('Replies query error:', repliesErr);
        return NextResponse.json({ success: true, data: [] });
      }

      const transformed = (replies || []).map((r: Record<string, unknown>) => ({
        id: r.id,
        ticketId: r.ticket_id,
        senderType: r.sender_type,
        senderName: r.sender_name,
        message: r.message,
        createdAt: r.created_at,
      }));

      return NextResponse.json({ success: true, data: transformed });
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

      // In-app notification for the client
      const statusLabels: Record<string, string> = {
        open: 'reopened',
        in_progress: 'being worked on',
        resolved: 'resolved',
        closed: 'closed',
      };
      notifyClient(ticket.client_id, {
        type: 'ticket_status_updated',
        title: `Support ticket ${statusLabels[status] || 'updated'}`,
        message: ticket.title,
        priority: status === 'resolved' ? 'high' : 'normal',
        actionUrl: `/client/${ticket.client_id}/support`,
      });
    }

    // Fire-and-forget audit log
    await logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'update',
      resource_type: 'support_ticket',
      resource_id: ticketId,
      details: { newStatus: status, assignedTo, title: ticket.title },
      ip_address: getClientIP(request),
    });

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

export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'clients.write');
  if ('error' in auth) return auth.error;

  try {
    const body = await request.json();
    const { ticketId, message } = body;

    if (!ticketId || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID and message are required' },
        { status: 400 }
      );
    }

    // Get the ticket to find client_id
    const { data: ticket, error: ticketErr } = await supabaseAdmin
      .from('support_tickets')
      .select('id, client_id, title')
      .eq('id', ticketId)
      .single();

    if (ticketErr || !ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Insert reply
    const { data: reply, error: replyErr } = await supabaseAdmin
      .from('ticket_replies')
      .insert({
        ticket_id: ticketId,
        sender_type: 'admin',
        sender_name: auth.user.name,
        message: message.trim(),
      })
      .select()
      .single();

    if (replyErr) {
      console.error('Insert reply error:', replyErr);
      return NextResponse.json(
        { success: false, error: 'Failed to send reply' },
        { status: 500 }
      );
    }

    // Update ticket's updated_at
    await supabaseAdmin
      .from('support_tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticketId);

    // Fire-and-forget: notify client
    if (ticket.client_id) {
      notifyClient(ticket.client_id, {
        type: 'ticket_reply',
        title: 'New reply on your support ticket',
        message: ticket.title,
        actionUrl: `/client/${ticket.client_id}/support`,
      });
    }

    // Audit log
    await logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'create',
      resource_type: 'ticket_reply',
      resource_id: reply.id,
      details: { ticketId, ticketTitle: ticket.title },
      ip_address: getClientIP(request),
    });

    return NextResponse.json({
      success: true,
      data: {
        id: reply.id,
        ticketId: reply.ticket_id,
        senderType: reply.sender_type,
        senderName: reply.sender_name,
        message: reply.message,
        createdAt: reply.created_at,
      },
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}

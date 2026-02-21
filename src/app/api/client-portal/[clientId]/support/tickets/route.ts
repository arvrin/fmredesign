/**
 * Client Portal Support Tickets API
 * GET  — list tickets for this client (includes reply counts)
 * POST — create a new ticket
 * PUT  — send a client reply to a ticket
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { resolveClientId } from '@/lib/client-portal/resolve-client';
import { requireClientAuth } from '@/lib/client-session';
import { notifyTeam, newSupportTicketEmail } from '@/lib/email/send';
import { notifyAdmins } from '@/lib/notifications';

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

    // If requesting replies for a specific ticket
    const ticketId = request.nextUrl.searchParams.get('ticketId');
    const includeReplies = request.nextUrl.searchParams.get('replies');

    if (ticketId && includeReplies === 'true') {
      // Verify ticket belongs to this client
      const { data: ticketCheck } = await supabaseAdmin
        .from('support_tickets')
        .select('id')
        .eq('id', ticketId)
        .eq('client_id', client.id)
        .single();

      if (!ticketCheck) {
        return NextResponse.json(
          { success: false, error: 'Ticket not found' },
          { status: 404 }
        );
      }

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

    const { data: tickets, error } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase support_tickets query error:', error);
      return NextResponse.json({ success: true, data: [], total: 0 });
    }

    // Fetch reply counts for all tickets
    const ticketIds = (tickets || []).map((t: Record<string, unknown>) => t.id);
    const replyCounts: Record<string, number> = {};
    if (ticketIds.length > 0) {
      const { data: replies } = await supabaseAdmin
        .from('ticket_replies')
        .select('ticket_id')
        .in('ticket_id', ticketIds);

      (replies || []).forEach((r: Record<string, unknown>) => {
        const tid = r.ticket_id as string;
        replyCounts[tid] = (replyCounts[tid] || 0) + 1;
      });
    }

    const transformed = (tickets || []).map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      category: t.category,
      assignedTo: t.assigned_to || 'Support Team',
      replyCount: replyCounts[t.id as string] || 0,
      createdDate: t.created_at
        ? new Date(t.created_at).toISOString().split('T')[0]
        : '',
      lastUpdate: t.updated_at
        ? new Date(t.updated_at).toISOString().split('T')[0]
        : '',
    }));

    return NextResponse.json({
      success: true,
      data: transformed,
      total: transformed.length,
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch support tickets' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const body = await request.json();
    const { title, description, priority, category } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const { data: ticket, error } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        client_id: client.id,
        title,
        description,
        priority: priority || 'medium',
        category: category || 'general',
        status: 'open',
        assigned_to: 'Support Team',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create ticket' },
        { status: 500 }
      );
    }

    // Fire-and-forget email notification
    Promise.resolve(
      supabaseAdmin.from('clients').select('name').eq('id', client.id).single()
    ).then(({ data: clientRow }) => {
      const emailData = newSupportTicketEmail({
        ticketId: ticket.id,
        clientName: clientRow?.name || 'Unknown Client',
        title,
        description,
        priority: priority || 'medium',
        category: category || 'general',
      });
      notifyTeam(emailData.subject, emailData.html);
    }).catch((err: unknown) => console.error('Email notification failed:', err));

    // In-app notification for admin team
    notifyAdmins({
      type: 'ticket_created',
      title: 'New support ticket',
      message: `${title} — ${priority || 'medium'} priority`,
      priority: priority === 'urgent' || priority === 'high' ? 'high' : 'normal',
      clientId: client.id,
      actionUrl: '/admin/support',
    });

    return NextResponse.json({
      success: true,
      data: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        assignedTo: ticket.assigned_to,
        createdDate: new Date(ticket.created_at).toISOString().split('T')[0],
        lastUpdate: new Date(ticket.updated_at).toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create support ticket' },
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

    const client = await resolveClientId(clientId);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { ticketId, message } = body;

    if (!ticketId || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Ticket ID and message are required' },
        { status: 400 }
      );
    }

    // Verify ticket belongs to this client
    const { data: ticket, error: ticketErr } = await supabaseAdmin
      .from('support_tickets')
      .select('id, title, client_id')
      .eq('id', ticketId)
      .eq('client_id', client.id)
      .single();

    if (ticketErr || !ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Get client name for sender_name
    const { data: clientRow } = await supabaseAdmin
      .from('clients')
      .select('name')
      .eq('id', client.id)
      .single();

    // Insert reply
    const { data: reply, error: replyErr } = await supabaseAdmin
      .from('ticket_replies')
      .insert({
        ticket_id: ticketId,
        sender_type: 'client',
        sender_name: clientRow?.name || 'Client',
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

    // Fire-and-forget: notify admins
    notifyAdmins({
      type: 'ticket_reply',
      title: 'Client replied to support ticket',
      message: `${clientRow?.name || 'Client'}: ${ticket.title}`,
      clientId: client.id,
      actionUrl: '/admin/support',
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

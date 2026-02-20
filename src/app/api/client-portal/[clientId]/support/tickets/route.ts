/**
 * Client Portal Support Tickets API
 * GET  — list tickets for this client
 * POST — create a new ticket
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

    const { data: tickets, error } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase support_tickets query error:', error);
      return NextResponse.json({ success: true, data: [], total: 0 });
    }

    const transformed = (tickets || []).map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      category: t.category,
      assignedTo: t.assigned_to || 'Support Team',
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

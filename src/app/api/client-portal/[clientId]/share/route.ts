/**
 * Client Portal Share Links API
 * CRUD operations for shareable read-only links
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { resolveClientId } from '@/lib/client-portal/resolve-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    const resolved = await resolveClientId(clientId);
    if (!resolved) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const { data: links, error } = await supabaseAdmin
      .from('share_links')
      .select('*')
      .eq('client_id', resolved.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase share links query error:', error);
      return NextResponse.json({ success: true, data: [] });
    }

    const now = new Date();
    const transformed = (links || []).map((link) => ({
      id: link.id,
      token: link.token,
      resourceType: link.resource_type,
      resourceId: link.resource_id,
      label: link.label || '',
      expiresAt: link.expires_at,
      createdAt: link.created_at,
      status: link.expires_at && new Date(link.expires_at) < now ? 'expired' : 'active',
    }));

    return NextResponse.json({ success: true, data: transformed });
  } catch (error) {
    console.error('Error fetching share links:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch share links' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    const resolved = await resolveClientId(clientId);
    if (!resolved) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const body = await request.json();
    const { resourceType, resourceId, label, expiresInDays } = body;

    if (!resourceType || !resourceId) {
      return NextResponse.json({ success: false, error: 'resourceType and resourceId are required' }, { status: 400 });
    }

    if (!['project', 'report'].includes(resourceType)) {
      return NextResponse.json({ success: false, error: 'Invalid resource type' }, { status: 400 });
    }

    const insertData: Record<string, unknown> = {
      client_id: resolved.id,
      resource_type: resourceType,
      resource_id: resourceId,
      label: label || null,
    };

    if (expiresInDays && expiresInDays > 0) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
      insertData.expires_at = expiresAt.toISOString();
    }

    const { data: link, error } = await supabaseAdmin
      .from('share_links')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase share link insert error:', error);
      return NextResponse.json({ success: false, error: 'Failed to create share link' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: link.id,
        token: link.token,
        url: `/shared/${link.token}`,
      },
    });
  } catch (error) {
    console.error('Error creating share link:', error);
    return NextResponse.json({ success: false, error: 'Failed to create share link' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    const resolved = await resolveClientId(clientId);
    if (!resolved) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const { searchParams } = request.nextUrl;
    const linkId = searchParams.get('id');

    if (!linkId) {
      return NextResponse.json({ success: false, error: 'Link ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('share_links')
      .delete()
      .eq('id', linkId)
      .eq('client_id', resolved.id);

    if (error) {
      console.error('Supabase share link delete error:', error);
      return NextResponse.json({ success: false, error: 'Failed to delete share link' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting share link:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete share link' }, { status: 500 });
  }
}

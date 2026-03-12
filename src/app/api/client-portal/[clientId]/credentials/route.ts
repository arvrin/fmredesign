/**
 * Client Portal Credentials API
 * GET    — list client's credentials (masked)
 * POST   — add new credential
 * PUT    — update credential
 * DELETE — delete credential
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireClientAuth } from '@/lib/client-session';
import { resolveClientId } from '@/lib/client-portal/resolve-client';
import { encryptToken, decryptToken } from '@/lib/social/token-crypto';
import { maskCredentials } from '@/lib/admin/credential-types';
import type { ClientCredential } from '@/lib/admin/credential-types';

// ────────────────────────────────────────────────────────────
// GET — list credentials (masked)
// ────────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const authError = await requireClientAuth(request, clientId);
  if (authError) return authError;

  const resolved = await resolveClientId(clientId);
  if (!resolved) {
    return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('client_credentials')
    .select('*')
    .eq('client_id', resolved.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching credentials:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch credentials' }, { status: 500 });
  }

  // Mask all credential values before sending to frontend
  const masked = (data as ClientCredential[]).map((row) => {
    try {
      const decrypted = JSON.parse(decryptToken(row.credentials));
      return {
        id: row.id,
        client_id: row.client_id,
        platform: row.platform,
        credential_type: row.credential_type,
        label: row.label,
        credentials_masked: maskCredentials(decrypted),
        status: row.status,
        notes: row.notes,
        added_by: row.added_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    } catch {
      return {
        id: row.id,
        client_id: row.client_id,
        platform: row.platform,
        credential_type: row.credential_type,
        label: row.label,
        credentials_masked: {},
        status: row.status,
        notes: row.notes,
        added_by: row.added_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    }
  });

  return NextResponse.json({ success: true, data: masked });
}

// ────────────────────────────────────────────────────────────
// POST — add new credential
// ────────────────────────────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const authError = await requireClientAuth(request, clientId);
  if (authError) return authError;

  const resolved = await resolveClientId(clientId);
  if (!resolved) {
    return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
  }

  const body = await request.json();
  const { platform, credential_type, label, credentials, notes } = body;

  if (!platform || !credentials || typeof credentials !== 'object') {
    return NextResponse.json(
      { success: false, error: 'platform and credentials are required' },
      { status: 400 }
    );
  }

  // Encrypt the credentials JSON blob
  const encrypted = encryptToken(JSON.stringify(credentials));

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('client_credentials')
    .insert({
      client_id: resolved.id,
      platform,
      credential_type: credential_type || 'login',
      label: label || null,
      credentials: encrypted,
      notes: notes || null,
      added_by: 'client',
    })
    .select('id, platform, credential_type, label, status, notes, added_by, created_at, updated_at')
    .single();

  if (error) {
    console.error('Error creating credential:', error);
    return NextResponse.json({ success: false, error: 'Failed to save credential' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: {
      ...data,
      client_id: resolved.id,
      credentials_masked: maskCredentials(credentials),
    },
  }, { status: 201 });
}

// ────────────────────────────────────────────────────────────
// PUT — update credential
// ────────────────────────────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const authError = await requireClientAuth(request, clientId);
  if (authError) return authError;

  const resolved = await resolveClientId(clientId);
  if (!resolved) {
    return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
  }

  const body = await request.json();
  const { id, platform, credential_type, label, credentials, notes, status } = body;

  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
  }

  // Verify credential belongs to this client
  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from('client_credentials')
    .select('id, client_id')
    .eq('id', id)
    .eq('client_id', resolved.id)
    .single();

  if (!existing) {
    return NextResponse.json({ success: false, error: 'Credential not found' }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  if (platform) updates.platform = platform;
  if (credential_type) updates.credential_type = credential_type;
  if (label !== undefined) updates.label = label || null;
  if (notes !== undefined) updates.notes = notes || null;
  if (status) updates.status = status;
  if (credentials && typeof credentials === 'object') {
    updates.credentials = encryptToken(JSON.stringify(credentials));
  }

  const { error } = await supabase
    .from('client_credentials')
    .update(updates)
    .eq('id', id)
    .eq('client_id', resolved.id);

  if (error) {
    console.error('Error updating credential:', error);
    return NextResponse.json({ success: false, error: 'Failed to update credential' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// ────────────────────────────────────────────────────────────
// DELETE — remove credential
// ────────────────────────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  const authError = await requireClientAuth(request, clientId);
  if (authError) return authError;

  const resolved = await resolveClientId(clientId);
  if (!resolved) {
    return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('client_credentials')
    .delete()
    .eq('id', id)
    .eq('client_id', resolved.id);

  if (error) {
    console.error('Error deleting credential:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete credential' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

/**
 * Admin Credential Reveal API
 * GET ?id=xxx — returns decrypted credential values (admin-only)
 *
 * This endpoint is intentionally separate from the main credentials API
 * to make it clear that revealing secrets is a distinct, auditable action.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { decryptToken } from '@/lib/social/token-crypto';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('client_credentials')
    .select('id, credentials')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, error: 'Credential not found' }, { status: 404 });
  }

  try {
    const decrypted = JSON.parse(decryptToken(data.credentials));
    return NextResponse.json({ success: true, data: decrypted });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to decrypt credential' }, { status: 500 });
  }
}

/**
 * Admin Document Storage API
 * GET  ?clientId=xxx — returns storage usage info
 * PUT  { clientId, storageLimitMb } — update client's storage limit
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  const clientId = request.nextUrl.searchParams.get('clientId');
  if (!clientId) {
    return NextResponse.json({ success: false, error: 'clientId is required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const [{ data: docs }, { data: client }] = await Promise.all([
    supabase
      .from('client_documents')
      .select('file_size')
      .eq('client_id', clientId),
    supabase
      .from('clients')
      .select('storage_limit_mb')
      .eq('id', clientId)
      .single(),
  ]);

  const usedBytes = (docs || []).reduce((sum, d) => sum + (Number(d.file_size) || 0), 0);
  const limitMb = client?.storage_limit_mb || 500;
  const limitBytes = limitMb * 1024 * 1024;

  return NextResponse.json({
    success: true,
    data: {
      usedBytes,
      limitBytes,
      percentage: Math.round((usedBytes / limitBytes) * 100),
      fileCount: (docs || []).length,
    },
  });
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { clientId, storageLimitMb } = await request.json();

    if (!clientId || typeof storageLimitMb !== 'number' || storageLimitMb < 1) {
      return NextResponse.json(
        { success: false, error: 'clientId and valid storageLimitMb are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('clients')
      .update({ storage_limit_mb: storageLimitMb })
      .eq('id', clientId);

    if (error) {
      return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

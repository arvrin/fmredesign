/**
 * Admin Document Preview API
 * GET ?id=xxx — returns Drive webViewLink for preview
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: doc, error } = await supabase
    .from('client_documents')
    .select('drive_web_view_link, file_url')
    .eq('id', id)
    .single();

  if (error || !doc) {
    return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
  }

  const url = doc.drive_web_view_link || doc.file_url || null;

  return NextResponse.json({
    success: true,
    data: { url },
  });
}

/**
 * Admin Document Download API
 * GET ?id=xxx — proxy download from Google Drive
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { getSupabaseAdmin } from '@/lib/supabase';
import { downloadFile } from '@/lib/google-drive';

export const maxDuration = 60;

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
    .select('drive_file_id, name, file_type')
    .eq('id', id)
    .single();

  if (error || !doc) {
    return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
  }

  if (!doc.drive_file_id) {
    // Legacy doc with only file_url — redirect to it
    return NextResponse.json({ success: false, error: 'No Drive file associated' }, { status: 404 });
  }

  try {
    const { stream, mimeType, fileName } = await downloadFile(doc.drive_file_id);

    return new NextResponse(stream, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(doc.name || fileName)}"`,
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (err) {
    console.error('Download error:', err);
    return NextResponse.json({ success: false, error: 'Download failed' }, { status: 500 });
  }
}

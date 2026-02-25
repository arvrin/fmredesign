/**
 * Client Portal Document Download
 * GET ?id=xxx — proxied download (verifies doc belongs to client + client_visible)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { resolveClientId } from '@/lib/client-portal/resolve-client';
import { requireClientAuth } from '@/lib/client-session';
import { downloadFile } from '@/lib/google-drive';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;
  if (!clientId) {
    return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
  }

  const authError = await requireClientAuth(request, clientId);
  if (authError) return authError;

  const resolved = await resolveClientId(clientId);
  if (!resolved) {
    return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: doc, error } = await supabase
    .from('client_documents')
    .select('drive_file_id, name, file_type, client_id, client_visible')
    .eq('id', id)
    .single();

  if (error || !doc) {
    return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
  }

  // Access control: must belong to this client and be client-visible
  if (doc.client_id !== resolved.id || !doc.client_visible) {
    return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
  }

  if (!doc.drive_file_id) {
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
    console.error('Client download error:', err);
    return NextResponse.json({ success: false, error: 'Download failed' }, { status: 500 });
  }
}

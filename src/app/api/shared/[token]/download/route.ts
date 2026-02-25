/**
 * Public Share Token Download
 * GET — download a document via share token (validates token + expiry)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { downloadFile } from '@/lib/google-drive';

export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    // Look up the share link
    const { data: link, error: linkError } = await supabaseAdmin
      .from('share_links')
      .select('*')
      .eq('token', token)
      .single();

    if (linkError || !link) {
      return NextResponse.json({ success: false, error: 'Share link not found' }, { status: 404 });
    }

    // Check expiry
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'This share link has expired' }, { status: 410 });
    }

    // Must be a document share link
    if (link.resource_type !== 'document') {
      return NextResponse.json({ success: false, error: 'Not a document share link' }, { status: 400 });
    }

    // Get the document
    const { data: doc, error: docError } = await supabaseAdmin
      .from('client_documents')
      .select('drive_file_id, name, is_public')
      .eq('id', link.resource_id)
      .single();

    if (docError || !doc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    if (!doc.drive_file_id) {
      return NextResponse.json({ success: false, error: 'No file available for download' }, { status: 404 });
    }

    const { stream, mimeType, fileName } = await downloadFile(doc.drive_file_id);

    return new NextResponse(stream, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(doc.name || fileName)}"`,
        'Cache-Control': 'private, max-age=300',
      },
    });
  } catch (error) {
    console.error('Shared download error:', error);
    return NextResponse.json({ success: false, error: 'Download failed' }, { status: 500 });
  }
}

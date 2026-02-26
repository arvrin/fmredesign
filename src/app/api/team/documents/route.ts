/**
 * Team Member Documents API
 * Upload and delete documents for team members.
 * Files stored in Supabase Storage (team-documents bucket).
 * Metadata stored in team_members.documents JSONB column.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const BUCKET = 'team-documents';

// POST /api/team/documents — upload a document
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const memberId = formData.get('memberId') as string | null;
    const docType = (formData.get('type') as string) || 'other';
    const docName = formData.get('name') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }
    if (!memberId) {
      return NextResponse.json({ success: false, error: 'Member ID is required' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Allowed: PDF, images, Word, Excel, text files' },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop() || 'pdf';
    const storagePath = `${memberId}/${Date.now()}.${ext}`;

    const supabase = getSupabaseAdmin();
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

    // Build document entry
    const newDoc = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type: docType,
      name: docName || file.name,
      url: urlData.publicUrl,
      storagePath,
      uploadedAt: new Date().toISOString(),
    };

    // Read current documents array from team member
    const { data: member, error: fetchError } = await supabase
      .from('team_members')
      .select('documents')
      .eq('id', memberId)
      .single();

    if (fetchError) {
      console.error('Fetch member error:', fetchError);
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    const docs = Array.isArray(member.documents) ? [...member.documents, newDoc] : [newDoc];

    // Update member
    const { error: updateError } = await supabase
      .from('team_members')
      .update({ documents: docs })
      .eq('id', memberId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
  } catch (error) {
    console.error('Error uploading team document:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload document' }, { status: 500 });
  }
}

// DELETE /api/team/documents?memberId=xxx&docId=xxx
export async function DELETE(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = request.nextUrl;
    const memberId = searchParams.get('memberId');
    const docId = searchParams.get('docId');

    if (!memberId || !docId) {
      return NextResponse.json({ success: false, error: 'memberId and docId are required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Read current documents
    const { data: member, error: fetchError } = await supabase
      .from('team_members')
      .select('documents')
      .eq('id', memberId)
      .single();

    if (fetchError || !member) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
    }

    const docs: any[] = Array.isArray(member.documents) ? member.documents : [];
    const docToRemove = docs.find((d: any) => d.id === docId);

    if (!docToRemove) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    // Remove from storage (best-effort)
    if (docToRemove.storagePath) {
      await supabase.storage.from(BUCKET).remove([docToRemove.storagePath]);
    }

    // Remove from array and update member
    const updatedDocs = docs.filter((d: any) => d.id !== docId);
    const { error: updateError } = await supabase
      .from('team_members')
      .update({ documents: updatedDocs })
      .eq('id', memberId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team document:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete document' }, { status: 500 });
  }
}

/**
 * Client Portal Documents API
 * Provides client-specific document listing from Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { resolveClientId } from '@/lib/client-portal/resolve-client';
import { requireClientAuth } from '@/lib/client-session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
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

    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');

    let query = supabaseAdmin
      .from('client_documents')
      .select('*')
      .eq('client_id', resolved.id)
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: documents, error } = await query;

    if (error) {
      console.error('Supabase documents query error:', error);
      return NextResponse.json({ success: true, data: [], total: 0 });
    }

    const transformed = (documents || []).map((doc) => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || '',
      fileUrl: doc.file_url,
      fileType: doc.file_type || 'document',
      fileSize: doc.file_size || 0,
      category: doc.category || 'general',
      uploadedBy: doc.uploaded_by || 'admin',
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: transformed,
      total: transformed.length,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch documents' }, { status: 500 });
  }
}

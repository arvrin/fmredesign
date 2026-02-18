import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit') || 50), 200);
  const resourceType = searchParams.get('resource_type');
  const action = searchParams.get('action');

  try {
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('admin_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (resourceType) query = query.eq('resource_type', resourceType);
    if (action) query = query.eq('action', action);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ entries: data || [] });
  } catch (error) {
    console.error('Audit log fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 });
  }
}

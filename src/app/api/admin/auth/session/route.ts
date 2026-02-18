/**
 * Session Validation API Endpoint
 * Validates the admin session cookie and returns session info.
 * Used by the client-side auth to verify authentication status.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  // Cookie is valid — check if there's a mobile user token for richer user info
  const mobileToken = request.headers.get('x-mobile-token');
  if (mobileToken) {
    try {
      const supabase = getSupabaseAdmin();
      const { data: user } = await supabase
        .from('authorized_users')
        .select('id, name, email, role, permissions, mobile_number, status')
        .eq('id', mobileToken)
        .eq('status', 'active')
        .single();

      if (user) {
        return NextResponse.json({
          authenticated: true,
          user: {
            type: 'mobile_user',
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions ? user.permissions.split(',').map((p: string) => p.trim()) : [],
          },
        });
      }
    } catch {
      // Fall through to admin response
    }
  }

  // Default: admin (password) session
  return NextResponse.json({
    authenticated: true,
    user: {
      type: 'admin',
      role: 'super_admin',
      permissions: ['full_access'],
    },
  });
}

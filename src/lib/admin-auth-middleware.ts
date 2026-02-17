/**
 * Server-side admin authentication middleware.
 * Validates admin session token from cookies before allowing access to admin API routes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

const ADMIN_SESSION_COOKIE = 'fm-admin-session';

/**
 * Validate that the request has a valid admin session.
 * Returns null if valid, or a 401 NextResponse if invalid.
 */
export async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
    || request.headers.get('x-admin-token');

  if (!sessionToken) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Validate against ADMIN_PASSWORD (simple token = base64 of password + timestamp check)
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD not configured');
    return NextResponse.json(
      { success: false, error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    // Token format: base64(password:timestamp)
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const [password, timestampStr] = decoded.split(':');

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Check token age (24 hours max)
    const timestamp = parseInt(timestampStr, 10);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (isNaN(timestamp) || Date.now() - timestamp > maxAge) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      );
    }

    return null; // Auth passed
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid session token' },
      { status: 401 }
    );
  }
}

/**
 * Check if a request is from an authorized mobile user.
 * Falls back to admin auth if no mobile user session.
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  // First check admin session
  const adminResult = await requireAdminAuth(request);
  if (!adminResult) return null; // Admin auth passed

  // Check mobile user session
  const mobileToken = request.headers.get('x-mobile-token');
  if (!mobileToken) {
    return adminResult; // Return original admin auth error
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: user, error } = await supabase
      .from('authorized_users')
      .select('id, status')
      .eq('id', mobileToken)
      .eq('status', 'active')
      .single();

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid mobile session' },
        { status: 401 }
      );
    }

    return null; // Mobile auth passed
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

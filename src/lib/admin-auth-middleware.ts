/**
 * Server-side admin authentication middleware.
 * Validates admin session token from cookies before allowing access to admin API routes.
 * Token format: timestamp.hmac_signature (password never stored in token)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase';

const ADMIN_SESSION_COOKIE = 'fm-admin-session';
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

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

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD not configured');
    return NextResponse.json(
      { success: false, error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    // Support both new HMAC format (timestamp.signature) and legacy base64 format
    if (sessionToken.includes('.')) {
      // New HMAC-based token: timestamp.signature
      const [timestampStr, signature] = sessionToken.split('.');

      if (!timestampStr || !signature) {
        return NextResponse.json(
          { success: false, error: 'Invalid session token' },
          { status: 401 }
        );
      }

      // Verify HMAC signature
      const expectedSignature = createHmac('sha256', adminPassword)
        .update(timestampStr)
        .digest('hex');

      // Constant-time comparison
      const sigBuffer = Buffer.from(signature, 'hex');
      const expectedBuffer = Buffer.from(expectedSignature, 'hex');
      if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
        return NextResponse.json(
          { success: false, error: 'Invalid session' },
          { status: 401 }
        );
      }

      // Check token age
      const timestamp = parseInt(timestampStr, 10);
      if (isNaN(timestamp) || Date.now() - timestamp > MAX_SESSION_AGE_MS) {
        return NextResponse.json(
          { success: false, error: 'Session expired' },
          { status: 401 }
        );
      }
    } else {
      // Legacy base64 token: base64(password:timestamp) — support during migration
      const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
      const colonIndex = decoded.lastIndexOf(':');
      if (colonIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Invalid session token' },
          { status: 401 }
        );
      }

      const password = decoded.substring(0, colonIndex);
      const timestampStr = decoded.substring(colonIndex + 1);

      if (password !== adminPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid session' },
          { status: 401 }
        );
      }

      const timestamp = parseInt(timestampStr, 10);
      if (isNaN(timestamp) || Date.now() - timestamp > MAX_SESSION_AGE_MS) {
        return NextResponse.json(
          { success: false, error: 'Session expired' },
          { status: 401 }
        );
      }
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
  if (!adminResult) return null;

  // Check mobile user session
  const mobileToken = request.headers.get('x-mobile-token');
  if (!mobileToken) {
    return adminResult;
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

    return null;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

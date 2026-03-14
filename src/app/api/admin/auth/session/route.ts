/**
 * Session Validation API Endpoint
 * Validates the admin session cookie and returns session info.
 * Used by the client-side auth to verify authentication status.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
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

  const adminPassword = process.env.ADMIN_PASSWORD || '';

  // Check fm-admin-user cookie (set during mobile login) for user identity
  const userCookie = request.cookies.get('fm-admin-user')?.value;
  if (userCookie && adminPassword) {
    const dotIndex = userCookie.lastIndexOf('.');
    if (dotIndex !== -1) {
      const payload = userCookie.slice(0, dotIndex);
      const signature = userCookie.slice(dotIndex + 1);

      try {
        const expectedSignature = createHmac('sha256', adminPassword)
          .update(payload)
          .digest('hex');

        const sigBuffer = Buffer.from(signature, 'hex');
        const expectedBuffer = Buffer.from(expectedSignature, 'hex');

        if (sigBuffer.length === expectedBuffer.length && timingSafeEqual(sigBuffer, expectedBuffer)) {
          const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));

          if (decoded.userId && decoded.userId !== 'system-admin') {
            // Look up current user from DB (permissions may have changed)
            const supabase = getSupabaseAdmin();
            const { data: user } = await supabase
              .from('authorized_users')
              .select('id, name, email, role, permissions, mobile_number, status')
              .eq('id', decoded.userId)
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
          }
        }
      } catch {
        // Fall through to default admin response
      }
    }
  }

  // Default: password-based login (no fm-admin-user cookie) — full access
  return NextResponse.json({
    authenticated: true,
    user: {
      type: 'admin',
      role: 'super_admin',
      permissions: ['full_access'],
    },
  });
}

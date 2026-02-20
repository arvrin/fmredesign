import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per minute per IP
  const clientIp = getClientIp(request);
  if (!rateLimit(clientIp, 5, 60_000)) {
    return NextResponse.json(
      { success: false, error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Constant-time comparison (prevent timing attacks)
    const passwordBuffer = Buffer.from(password);
    const adminBuffer = Buffer.from(adminPassword);
    if (passwordBuffer.length !== adminBuffer.length || !timingSafeEqual(passwordBuffer, adminBuffer)) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create HMAC-signed session token (password is the key, never stored in the token)
    const timestamp = Date.now().toString();
    const signature = createHmac('sha256', adminPassword)
      .update(timestamp)
      .digest('hex');
    const token = `${timestamp}.${signature}`;

    const response = NextResponse.json({ success: true });
    response.cookies.set('fm-admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60,
    });

    // Set signed user identity cookie for RBAC enforcement (system-admin = super_admin)
    const userPayload = Buffer.from(
      JSON.stringify({ userId: 'system-admin', role: 'super_admin', name: 'System Admin' })
    ).toString('base64');
    const userSignature = createHmac('sha256', adminPassword)
      .update(userPayload)
      .digest('hex');
    response.cookies.set('fm-admin-user', `${userPayload}.${userSignature}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Password authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

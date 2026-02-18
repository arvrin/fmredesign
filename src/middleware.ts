/**
 * Next.js Middleware
 * Protects /admin/* routes server-side by checking the session cookie.
 * Redirects unauthenticated users to the login page.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const ADMIN_SESSION_COOKIE = 'fm-admin-session';
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

function isValidSession(token: string, adminPassword: string): boolean {
  if (!token.includes('.')) return false;

  const [timestampStr, signature] = token.split('.');
  if (!timestampStr || !signature) return false;

  try {
    const expectedSignature = createHmac('sha256', adminPassword)
      .update(timestampStr)
      .digest('hex');

    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) return false;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return false;

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp) || Date.now() - timestamp > MAX_SESSION_AGE_MS) return false;

    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes (excluding auth pages and API routes)
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow auth pages (login)
  if (pathname.startsWith('/admin/auth')) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!sessionToken || !adminPassword || !isValidSession(sessionToken, adminPassword)) {
    const loginUrl = new URL('/admin/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

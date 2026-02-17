import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEV_ONLY_PATHS = ['/diagnostic', '/wehave', '/showcase'];
const COOKIE_NAME = 'fm_client_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block dev-only pages in production
  if (process.env.NODE_ENV === 'production') {
    const isDevPage = DEV_ONLY_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path + '/')
    );

    if (isDevPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Allow auth pages through (login, etc.)
    if (pathname.startsWith('/admin/auth')) {
      return NextResponse.next();
    }

    // The admin uses localStorage-based auth (client-side check in admin layout).
    // Middleware can't check localStorage, so we let requests through
    // and rely on the admin layout's client-side auth guard.
    return NextResponse.next();
  }

  // Client portal route protection
  if (pathname.startsWith('/client')) {
    // Allow login page through
    if (pathname === '/client/login') {
      return NextResponse.next();
    }

    // Check for session cookie
    const cookie = request.cookies.get(COOKIE_NAME);
    if (!cookie?.value) {
      return NextResponse.redirect(new URL('/client/login', request.url));
    }

    // Decode cookie and validate locally (no DB call in middleware)
    try {
      const sessionData = JSON.parse(
        Buffer.from(cookie.value, 'base64').toString('utf-8')
      );

      // Check expiry
      if (Date.now() > sessionData.expires) {
        const response = NextResponse.redirect(
          new URL('/client/login?error=session_expired', request.url)
        );
        response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
        return response;
      }

      // Extract slug from URL: /client/[slug]/...
      const urlParts = pathname.split('/');
      const urlSlug = urlParts[2]; // /client/[slug]

      if (urlSlug && urlSlug !== sessionData.slug && urlSlug !== sessionData.clientId) {
        // Client trying to access another client's portal — redirect to their own
        return NextResponse.redirect(
          new URL(`/client/${sessionData.slug}`, request.url)
        );
      }

      return NextResponse.next();
    } catch {
      // Invalid cookie data — clear and redirect to login
      const response = NextResponse.redirect(
        new URL('/client/login', request.url)
      );
      response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/diagnostic/:path*',
    '/wehave/:path*',
    '/showcase/:path*',
    '/client/:path*',
    '/admin/:path*',
  ],
};

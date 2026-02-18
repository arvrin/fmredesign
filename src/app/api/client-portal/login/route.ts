import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSession, setSessionCookie, type SessionData } from '@/lib/client-session';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';
import bcrypt from 'bcryptjs';

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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Look up client by email and portal_password
    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .select('id, name, email, slug, portal_password')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error || !client) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password (supports both bcrypt hashed and legacy plaintext)
    if (!client.portal_password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isBcryptHash = client.portal_password.startsWith('$2a$') || client.portal_password.startsWith('$2b$');
    const passwordMatch = isBcryptHash
      ? await bcrypt.compare(password, client.portal_password)
      : client.portal_password === password;

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // If password was plaintext, upgrade to bcrypt hash
    if (!isBcryptHash) {
      const hashed = await bcrypt.hash(password, 12);
      await supabaseAdmin
        .from('clients')
        .update({ portal_password: hashed })
        .eq('id', client.id);
    }

    // Create session
    const sessionId = await createSession(client.id, client.email, client.name);

    const sessionData: SessionData = {
      sessionId,
      clientId: client.id,
      slug: client.slug,
      email: client.email,
      clientName: client.name,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    const response = NextResponse.json({
      success: true,
      data: {
        clientId: client.id,
        slug: client.slug,
        name: client.name,
        redirectUrl: `/client/${client.slug}`,
      },
    });

    setSessionCookie(response, sessionId, sessionData);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

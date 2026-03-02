/**
 * Talent portal session management.
 * Modeled on client-session.ts — HMAC-signed cookies, DB-backed sessions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { getSupabaseAdmin } from './supabase';

export const TALENT_COOKIE_NAME = 'fm_talent_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Secret for HMAC signing talent session cookies */
function getSigningSecret(): string {
  const secret = process.env.TALENT_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error('TALENT_SESSION_SECRET or ADMIN_PASSWORD must be set');
  return secret;
}

/** Create HMAC signature for cookie payload */
function signPayload(payload: string): string {
  return createHmac('sha256', getSigningSecret()).update(payload).digest('hex');
}

export interface TalentSessionData {
  sessionId: string;
  talentId: string;
  slug: string;
  expires: number; // unix ms
}

/**
 * Create a session in the Supabase talent_sessions table.
 */
export async function createTalentSession(talentId: string, email: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('talent_sessions').insert({
    id: sessionId,
    talent_id: talentId,
    email,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error(`Failed to create talent session: ${error.message}`);
  }

  return sessionId;
}

/**
 * Validate a session by checking the talent_sessions table.
 */
export async function validateTalentSession(sessionId: string): Promise<TalentSessionData | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('talent_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error || !data) return null;

  const expiresAt = new Date(data.expires_at).getTime();
  if (Date.now() > expiresAt) {
    await supabase.from('talent_sessions').delete().eq('id', sessionId);
    return null;
  }

  // Resolve slug from talent_profiles
  let slug = data.talent_id;
  const { data: profile } = await supabase
    .from('talent_profiles')
    .select('profile_slug')
    .eq('id', data.talent_id)
    .single();
  if (profile?.profile_slug) {
    slug = profile.profile_slug;
  }

  return {
    sessionId: data.id,
    talentId: data.talent_id,
    slug,
    expires: expiresAt,
  };
}

/**
 * Set the talent session cookie on a NextResponse.
 */
export function setTalentSessionCookie(
  response: NextResponse,
  sessionId: string,
  sessionData: TalentSessionData
): NextResponse {
  const cookiePayload = Buffer.from(JSON.stringify(sessionData)).toString('base64');
  const signature = signPayload(cookiePayload);
  const signedCookie = `${cookiePayload}.${signature}`;

  response.cookies.set(TALENT_COOKIE_NAME, signedCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });

  return response;
}

/**
 * Read talent session data from cookie (no DB call).
 */
export function getTalentSessionFromCookie(request: NextRequest): TalentSessionData | null {
  const cookie = request.cookies.get(TALENT_COOKIE_NAME);
  if (!cookie?.value) return null;

  try {
    const dotIndex = cookie.value.lastIndexOf('.');
    if (dotIndex === -1) return null;

    const payload = cookie.value.substring(0, dotIndex);
    const signature = cookie.value.substring(dotIndex + 1);

    const expectedSignature = signPayload(payload);
    if (signature.length !== expectedSignature.length) return null;

    let mismatch = 0;
    for (let i = 0; i < signature.length; i++) {
      mismatch |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    if (mismatch !== 0) return null;

    const data: TalentSessionData = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    if (Date.now() > data.expires) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Validate that the request has a valid talent session for the given slug.
 * Returns null if valid, or a 401/403 NextResponse if invalid.
 */
export async function requireTalentAuth(
  request: NextRequest,
  routeSlug: string
): Promise<NextResponse | null> {
  const session = getTalentSessionFromCookie(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Resolve slug to talent_profiles.id
  const supabase = getSupabaseAdmin();
  const { data: profile } = await supabase
    .from('talent_profiles')
    .select('id, profile_slug')
    .eq('profile_slug', routeSlug)
    .single();

  if (!profile) {
    return NextResponse.json(
      { success: false, error: 'Profile not found' },
      { status: 404 }
    );
  }

  // Ensure the session belongs to this talent
  if (session.talentId !== profile.id) {
    return NextResponse.json(
      { success: false, error: 'Access denied' },
      { status: 403 }
    );
  }

  return null; // Auth passed
}

/**
 * Clear the talent session cookie.
 */
export function clearTalentSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(TALENT_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}

/**
 * Delete a session from the talent_sessions table.
 */
export async function deleteTalentSession(sessionId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase.from('talent_sessions').delete().eq('id', sessionId);
}

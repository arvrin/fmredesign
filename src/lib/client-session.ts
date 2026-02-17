import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from './supabase';

export const COOKIE_NAME = 'fm_client_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionData {
  sessionId: string;
  clientId: string;
  slug: string;
  email: string;
  clientName: string;
  expires: number; // unix ms
}

/**
 * Create a session in the Supabase client_sessions table
 */
export async function createSession(clientId: string, email: string, clientName: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const { error } = await supabaseAdmin.from('client_sessions').insert({
    id: sessionId,
    client_id: clientId,
    email,
    client_name: clientName,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  return sessionId;
}

/**
 * Validate a session by checking the client_sessions table
 */
export async function validateSession(sessionId: string): Promise<SessionData | null> {
  const { data, error } = await supabaseAdmin
    .from('client_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error || !data) return null;

  const expiresAt = new Date(data.expires_at).getTime();
  if (Date.now() > expiresAt) {
    // Session expired — clean it up
    await supabaseAdmin.from('client_sessions').delete().eq('id', sessionId);
    return null;
  }

  return {
    sessionId: data.id,
    clientId: data.client_id,
    email: data.email,
    clientName: data.client_name,
    expires: expiresAt,
  };
}

/**
 * Delete a session from the client_sessions table
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await supabaseAdmin.from('client_sessions').delete().eq('id', sessionId);
}

/**
 * Set the session cookie on a NextResponse.
 * Cookie stores signed base64 JSON so middleware can read it without a DB call.
 */
export function setSessionCookie(response: NextResponse, sessionId: string, sessionData: SessionData): NextResponse {
  const cookiePayload = Buffer.from(JSON.stringify(sessionData)).toString('base64');

  response.cookies.set(COOKIE_NAME, cookiePayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000, // seconds
  });

  return response;
}

/**
 * Read session data from cookie (for middleware — no DB call).
 * Returns null if cookie is missing/invalid/expired.
 */
export function getSessionFromCookie(request: NextRequest): SessionData | null {
  const cookie = request.cookies.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  try {
    const data: SessionData = JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf-8'));
    if (Date.now() > data.expires) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Clear the session cookie
 */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}

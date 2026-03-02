/**
 * Talent Logout API
 * POST — clear talent session
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getTalentSessionFromCookie,
  deleteTalentSession,
  clearTalentSessionCookie,
} from '@/lib/talent-session';

export async function POST(request: NextRequest) {
  try {
    const session = getTalentSessionFromCookie(request);

    if (session?.sessionId) {
      await deleteTalentSession(session.sessionId);
    }

    const response = NextResponse.json({ success: true });
    clearTalentSessionCookie(response);

    return response;
  } catch (error) {
    console.error('Talent logout error:', error);
    const response = NextResponse.json({ success: true });
    clearTalentSessionCookie(response);
    return response;
  }
}

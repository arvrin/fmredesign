import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie, deleteSession, clearSessionCookie } from '@/lib/client-session';

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromCookie(request);

    if (session) {
      await deleteSession(session.sessionId);
    }

    const response = NextResponse.json({ success: true });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Clear cookie even if DB delete fails
    const response = NextResponse.json({ success: true });
    clearSessionCookie(response);
    return response;
  }
}

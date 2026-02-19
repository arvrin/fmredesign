import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

// Mock dependencies before importing the module
vi.mock('../supabase', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

vi.mock('../client-portal/resolve-client', () => ({
  resolveClientId: vi.fn(),
}));

// Set env before import
process.env.ADMIN_PASSWORD = 'test-secret-key';

import {
  COOKIE_NAME,
  setSessionCookie,
  getSessionFromCookie,
  clearSessionCookie,
  type SessionData,
} from '../client-session';

describe('COOKIE_NAME', () => {
  it('is fm_client_session', () => {
    expect(COOKIE_NAME).toBe('fm_client_session');
  });
});

describe('setSessionCookie', () => {
  it('sets a signed cookie on the response', () => {
    const response = NextResponse.json({ ok: true });
    const sessionData: SessionData = {
      sessionId: 'sess-123',
      clientId: 'client-456',
      slug: 'acme',
      email: 'test@acme.com',
      clientName: 'Acme Corp',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    const result = setSessionCookie(response, 'sess-123', sessionData);
    const cookie = result.cookies.get(COOKIE_NAME);
    expect(cookie).toBeDefined();
    expect(cookie!.value).toContain('.'); // payload.signature format
  });

  it('cookie value has exactly two parts (payload.signature)', () => {
    const response = NextResponse.json({ ok: true });
    const sessionData: SessionData = {
      sessionId: 'sess-123',
      clientId: 'client-456',
      slug: 'acme',
      email: 'test@acme.com',
      clientName: 'Acme Corp',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    setSessionCookie(response, 'sess-123', sessionData);
    const cookie = response.cookies.get(COOKIE_NAME);
    const parts = cookie!.value.split('.');
    expect(parts.length).toBe(2);
    expect(parts[0].length).toBeGreaterThan(0); // base64 payload
    expect(parts[1].length).toBe(64); // hex HMAC-SHA256
  });
});

describe('getSessionFromCookie', () => {
  function makeSignedRequest(sessionData: SessionData): NextRequest {
    // Create a signed cookie the same way setSessionCookie does
    const response = NextResponse.json({});
    setSessionCookie(response, sessionData.sessionId, sessionData);
    const cookieValue = response.cookies.get(COOKIE_NAME)!.value;

    return new NextRequest('http://localhost', {
      headers: {
        cookie: `${COOKIE_NAME}=${cookieValue}`,
      },
    });
  }

  it('returns session data from a valid signed cookie', () => {
    const sessionData: SessionData = {
      sessionId: 'sess-123',
      clientId: 'client-456',
      slug: 'acme',
      email: 'test@acme.com',
      clientName: 'Acme Corp',
      expires: Date.now() + 1000 * 60 * 60, // 1 hour from now
    };

    const request = makeSignedRequest(sessionData);
    const result = getSessionFromCookie(request);

    expect(result).not.toBeNull();
    expect(result!.sessionId).toBe('sess-123');
    expect(result!.clientId).toBe('client-456');
    expect(result!.slug).toBe('acme');
    expect(result!.email).toBe('test@acme.com');
  });

  it('returns null when cookie is missing', () => {
    const request = new NextRequest('http://localhost');
    expect(getSessionFromCookie(request)).toBeNull();
  });

  it('returns null for expired session', () => {
    const sessionData: SessionData = {
      sessionId: 'sess-expired',
      clientId: 'client-456',
      slug: 'acme',
      email: 'test@acme.com',
      clientName: 'Acme Corp',
      expires: Date.now() - 1000, // already expired
    };

    const request = makeSignedRequest(sessionData);
    expect(getSessionFromCookie(request)).toBeNull();
  });

  it('returns null for tampered signature', () => {
    const sessionData: SessionData = {
      sessionId: 'sess-tamper',
      clientId: 'client-456',
      slug: 'acme',
      email: 'test@acme.com',
      clientName: 'Acme Corp',
      expires: Date.now() + 1000 * 60 * 60,
    };

    const response = NextResponse.json({});
    setSessionCookie(response, sessionData.sessionId, sessionData);
    const cookieValue = response.cookies.get(COOKIE_NAME)!.value;
    // Tamper with the signature
    const [payload] = cookieValue.split('.');
    const tamperedCookie = `${payload}.${'a'.repeat(64)}`;

    const request = new NextRequest('http://localhost', {
      headers: { cookie: `${COOKIE_NAME}=${tamperedCookie}` },
    });

    expect(getSessionFromCookie(request)).toBeNull();
  });

  it('returns null for malformed cookie value', () => {
    const request = new NextRequest('http://localhost', {
      headers: { cookie: `${COOKIE_NAME}=not-valid-format` },
    });
    expect(getSessionFromCookie(request)).toBeNull();
  });

  it('returns null for cookie with no dot separator', () => {
    const request = new NextRequest('http://localhost', {
      headers: { cookie: `${COOKIE_NAME}=singlesegment` },
    });
    expect(getSessionFromCookie(request)).toBeNull();
  });
});

describe('clearSessionCookie', () => {
  it('sets cookie maxAge to 0', () => {
    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    const cookie = response.cookies.get(COOKIE_NAME);
    expect(cookie).toBeDefined();
    expect(cookie!.value).toBe('');
  });
});

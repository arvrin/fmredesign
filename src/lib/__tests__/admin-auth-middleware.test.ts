import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { createHmac } from 'crypto';

// Mock Supabase before import
vi.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      })),
    })),
  })),
}));

const TEST_ADMIN_PASSWORD = 'test-admin-password-123';

function createValidToken(password: string): string {
  const timestamp = Date.now().toString();
  const signature = createHmac('sha256', password).update(timestamp).digest('hex');
  return `${timestamp}.${signature}`;
}

function createExpiredToken(password: string): string {
  const timestamp = (Date.now() - 25 * 60 * 60 * 1000).toString(); // 25 hours ago
  const signature = createHmac('sha256', password).update(timestamp).digest('hex');
  return `${timestamp}.${signature}`;
}

describe('requireAdminAuth', () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = TEST_ADMIN_PASSWORD;
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it('returns null (auth passed) for valid token in cookie', async () => {
    const { requireAdminAuth } = await import('../admin-auth-middleware');
    const token = createValidToken(TEST_ADMIN_PASSWORD);
    const request = new NextRequest('http://localhost/api/admin/test', {
      headers: {
        cookie: `fm-admin-session=${token}`,
      },
    });

    const result = await requireAdminAuth(request);
    expect(result).toBeNull();
  });

  it('returns null for valid token in x-admin-token header', async () => {
    const { requireAdminAuth } = await import('../admin-auth-middleware');
    const token = createValidToken(TEST_ADMIN_PASSWORD);
    const request = new NextRequest('http://localhost/api/admin/test', {
      headers: {
        'x-admin-token': token,
      },
    });

    const result = await requireAdminAuth(request);
    expect(result).toBeNull();
  });

  it('returns 401 when no token is provided', async () => {
    const { requireAdminAuth } = await import('../admin-auth-middleware');
    const request = new NextRequest('http://localhost/api/admin/test');

    const result = await requireAdminAuth(request);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);

    const body = await result!.json();
    expect(body.error).toBe('Authentication required');
  });

  it('returns 401 for invalid signature', async () => {
    const { requireAdminAuth } = await import('../admin-auth-middleware');
    const timestamp = Date.now().toString();
    const badToken = `${timestamp}.${'a'.repeat(64)}`;

    const request = new NextRequest('http://localhost/api/admin/test', {
      headers: { cookie: `fm-admin-session=${badToken}` },
    });

    const result = await requireAdminAuth(request);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it('returns 401 for expired token (>24h)', async () => {
    const { requireAdminAuth } = await import('../admin-auth-middleware');
    const token = createExpiredToken(TEST_ADMIN_PASSWORD);

    const request = new NextRequest('http://localhost/api/admin/test', {
      headers: { cookie: `fm-admin-session=${token}` },
    });

    const result = await requireAdminAuth(request);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);

    const body = await result!.json();
    expect(body.error).toBe('Session expired');
  });

  it('returns 401 for malformed token (no dot)', async () => {
    const { requireAdminAuth } = await import('../admin-auth-middleware');
    const request = new NextRequest('http://localhost/api/admin/test', {
      headers: { cookie: `fm-admin-session=notavalidtoken` },
    });

    const result = await requireAdminAuth(request);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it('returns 500 when ADMIN_PASSWORD is not configured', async () => {
    delete process.env.ADMIN_PASSWORD;

    // Need fresh import to pick up env change
    vi.resetModules();
    vi.mock('@/lib/supabase', () => ({
      getSupabaseAdmin: vi.fn(() => ({})),
    }));
    const { requireAdminAuth } = await import('../admin-auth-middleware');

    const token = createValidToken('any-password');
    const request = new NextRequest('http://localhost/api/admin/test', {
      headers: { cookie: `fm-admin-session=${token}` },
    });

    const result = await requireAdminAuth(request);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(500);
  });

  it('returns 401 for token signed with wrong password', async () => {
    const { requireAdminAuth } = await import('../admin-auth-middleware');
    const wrongToken = createValidToken('wrong-password');

    const request = new NextRequest('http://localhost/api/admin/test', {
      headers: { cookie: `fm-admin-session=${wrongToken}` },
    });

    const result = await requireAdminAuth(request);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });
});

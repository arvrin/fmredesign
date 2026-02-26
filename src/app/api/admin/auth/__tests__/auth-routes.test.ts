/**
 * Admin Auth API Route Tests
 * Tests password login, mobile login, and session validation endpoints.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { createHmac } from 'crypto';

// ── Supabase mock ──
const mockSingle = vi.fn((): Promise<{ data: unknown; error: unknown }> =>
  Promise.resolve({ data: null, error: null })
);
const mockUpdate = vi.fn(() => ({
  eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
}));
const mockEqChain = vi.fn(() => ({
  eq: vi.fn(() => ({
    single: mockSingle,
  })),
}));
const mockSelect = vi.fn(() => ({
  eq: mockEqChain,
}));

vi.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: vi.fn(() => ({
    from: vi.fn(() => ({
      select: mockSelect,
      update: mockUpdate,
    })),
  })),
}));

// ── Rate limiter mock — always allow ──
vi.mock('@/lib/rate-limiter', () => ({
  rateLimit: vi.fn(() => true),
  getClientIp: vi.fn(() => '127.0.0.1'),
}));

// ── Admin auth middleware mock ──
vi.mock('@/lib/admin-auth-middleware', () => ({
  requireAdminAuth: vi.fn(() => Promise.resolve(null)),
}));

const TEST_PASSWORD = 'test-password-123';

describe('POST /api/admin/auth/password', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.ADMIN_PASSWORD = TEST_PASSWORD;
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it('returns success for correct password', async () => {
    const { POST } = await import('../password/route');
    const req = new NextRequest('http://localhost/api/admin/auth/password', {
      method: 'POST',
      body: JSON.stringify({ password: TEST_PASSWORD }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it('sets fm-admin-session cookie on success', async () => {
    const { POST } = await import('../password/route');
    const req = new NextRequest('http://localhost/api/admin/auth/password', {
      method: 'POST',
      body: JSON.stringify({ password: TEST_PASSWORD }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const cookies = res.cookies.getAll();
    const sessionCookie = cookies.find((c) => c.name === 'fm-admin-session');

    expect(sessionCookie).toBeDefined();
    expect(sessionCookie!.value).toMatch(/^\d+\.[a-f0-9]+$/);
  });

  it('sets fm-admin-user cookie with super_admin role', async () => {
    const { POST } = await import('../password/route');
    const req = new NextRequest('http://localhost/api/admin/auth/password', {
      method: 'POST',
      body: JSON.stringify({ password: TEST_PASSWORD }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const cookies = res.cookies.getAll();
    const userCookie = cookies.find((c) => c.name === 'fm-admin-user');

    expect(userCookie).toBeDefined();
    const [payload] = userCookie!.value.split('.');
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    expect(decoded.role).toBe('super_admin');
    expect(decoded.userId).toBe('system-admin');
  });

  it('returns 401 for wrong password', async () => {
    const { POST } = await import('../password/route');
    const req = new NextRequest('http://localhost/api/admin/auth/password', {
      method: 'POST',
      body: JSON.stringify({ password: 'wrong-password' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Invalid password');
  });

  it('returns 400 when password is missing', async () => {
    const { POST } = await import('../password/route');
    const req = new NextRequest('http://localhost/api/admin/auth/password', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Password is required');
  });

  it('returns 500 when ADMIN_PASSWORD env is not set', async () => {
    delete process.env.ADMIN_PASSWORD;

    const { POST } = await import('../password/route');
    const req = new NextRequest('http://localhost/api/admin/auth/password', {
      method: 'POST',
      body: JSON.stringify({ password: 'anything' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Server configuration error');
  });

  it('returns 429 when rate limited', async () => {
    const { rateLimit } = await import('@/lib/rate-limiter');
    (rateLimit as ReturnType<typeof vi.fn>).mockReturnValueOnce(false);

    const { POST } = await import('../password/route');
    const req = new NextRequest('http://localhost/api/admin/auth/password', {
      method: 'POST',
      body: JSON.stringify({ password: TEST_PASSWORD }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
  });
});

describe('POST /api/admin/auth/mobile', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.ADMIN_PASSWORD = TEST_PASSWORD;
    mockSingle.mockReset();
    mockUpdate.mockReset();
    mockUpdate.mockReturnValue({
      eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
    });
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it('returns 400 when mobile number is missing', async () => {
    const { POST } = await import('../mobile/route');
    const req = new NextRequest('http://localhost/api/admin/auth/mobile', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Mobile number is required');
  });

  it('returns 400 for invalid mobile format', async () => {
    const { POST } = await import('../mobile/route');
    const req = new NextRequest('http://localhost/api/admin/auth/mobile', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber: '12345' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toContain('valid Indian mobile number');
  });

  it('returns 401 when mobile number is not authorized', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'not found' } });

    const { POST } = await import('../mobile/route');
    const req = new NextRequest('http://localhost/api/admin/auth/mobile', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber: '+919876543210' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toContain('not authorized');
  });

  it('returns success for authorized mobile number', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'user-1',
        mobile_number: '+919876543210',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        permissions: 'content.read,content.write',
        status: 'active',
        created_by: 'admin',
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
        last_login: null,
        notes: '',
      },
      error: null,
    });

    const { POST } = await import('../mobile/route');
    const req = new NextRequest('http://localhost/api/admin/auth/mobile', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber: '+919876543210' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.user.name).toBe('Test User');
    expect(body.user.role).toBe('admin');
    expect(body.user.permissions).toEqual(['content.read', 'content.write']);
  });
});

describe('GET /api/admin/auth/session', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.ADMIN_PASSWORD = TEST_PASSWORD;
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it('returns authenticated=true for valid admin session', async () => {
    const { requireAdminAuth } = await import('@/lib/admin-auth-middleware');
    (requireAdminAuth as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

    const { GET } = await import('../session/route');
    const token = createValidToken(TEST_PASSWORD);
    const req = new NextRequest('http://localhost/api/admin/auth/session', {
      headers: { cookie: `fm-admin-session=${token}` },
    });

    const res = await GET(req);
    const body = await res.json();

    expect(body.authenticated).toBe(true);
    expect(body.user.type).toBe('admin');
    expect(body.user.role).toBe('super_admin');
  });

  it('returns authenticated=false when auth fails', async () => {
    const { requireAdminAuth } = await import('@/lib/admin-auth-middleware');
    const { NextResponse } = await import('next/server');
    (requireAdminAuth as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    );

    const { GET } = await import('../session/route');
    const req = new NextRequest('http://localhost/api/admin/auth/session');

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.authenticated).toBe(false);
  });
});

// Helper
function createValidToken(password: string): string {
  const timestamp = Date.now().toString();
  const signature = createHmac('sha256', password).update(timestamp).digest('hex');
  return `${timestamp}.${signature}`;
}

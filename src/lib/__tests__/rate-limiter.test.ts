import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit, getClientIp } from '../rate-limiter';

// The rateLimit function uses an in-module Map, so we need to reset module
// state between tests. Use dynamic import after resetModules.

describe('rateLimit', () => {
  beforeEach(() => {
    // Clear internal state by calling with a fresh identifier each time
    // For reliable isolation, we use unique identifiers per test
  });

  it('allows requests under the limit', () => {
    const id = `test-allow-${Date.now()}`;
    expect(rateLimit(id, 5, 60_000)).toBe(true);
    expect(rateLimit(id, 5, 60_000)).toBe(true);
    expect(rateLimit(id, 5, 60_000)).toBe(true);
  });

  it('blocks requests at the limit', () => {
    const id = `test-block-${Date.now()}`;
    // Use limit of 3
    expect(rateLimit(id, 3, 60_000)).toBe(true);
    expect(rateLimit(id, 3, 60_000)).toBe(true);
    expect(rateLimit(id, 3, 60_000)).toBe(true);
    expect(rateLimit(id, 3, 60_000)).toBe(false); // 4th request blocked
  });

  it('uses default limit of 5', () => {
    const id = `test-default-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(id)).toBe(true);
    }
    expect(rateLimit(id)).toBe(false);
  });

  it('allows different identifiers independently', () => {
    const id1 = `user-a-${Date.now()}`;
    const id2 = `user-b-${Date.now()}`;
    // Fill up id1
    for (let i = 0; i < 3; i++) {
      rateLimit(id1, 3, 60_000);
    }
    expect(rateLimit(id1, 3, 60_000)).toBe(false);
    // id2 should still be allowed
    expect(rateLimit(id2, 3, 60_000)).toBe(true);
  });

  it('allows requests after window expires', () => {
    const id = `test-expire-${Date.now()}`;
    vi.useFakeTimers();
    const now = Date.now();
    vi.setSystemTime(now);

    // Fill up the limit
    for (let i = 0; i < 3; i++) {
      rateLimit(id, 3, 1000);
    }
    expect(rateLimit(id, 3, 1000)).toBe(false);

    // Advance past the window
    vi.setSystemTime(now + 1001);
    expect(rateLimit(id, 3, 1000)).toBe(true);

    vi.useRealTimers();
  });
});

describe('getClientIp', () => {
  it('returns x-forwarded-for when present', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    });
    expect(getClientIp(request)).toBe('1.2.3.4');
  });

  it('returns x-real-ip when x-forwarded-for is absent', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-real-ip': '10.0.0.1' },
    });
    expect(getClientIp(request)).toBe('10.0.0.1');
  });

  it('returns "unknown" when no IP headers are present', () => {
    const request = new Request('http://localhost');
    expect(getClientIp(request)).toBe('unknown');
  });

  it('trims whitespace from x-forwarded-for', () => {
    const request = new Request('http://localhost', {
      headers: { 'x-forwarded-for': ' 1.2.3.4 , 5.6.7.8' },
    });
    expect(getClientIp(request)).toBe('1.2.3.4');
  });

  it('prefers x-forwarded-for over x-real-ip', () => {
    const request = new Request('http://localhost', {
      headers: {
        'x-forwarded-for': '1.1.1.1',
        'x-real-ip': '2.2.2.2',
      },
    });
    expect(getClientIp(request)).toBe('1.1.1.1');
  });
});

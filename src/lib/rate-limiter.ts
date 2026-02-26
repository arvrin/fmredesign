/**
 * Rate limiter for API routes.
 * Uses in-memory sliding window with awareness of serverless limitations.
 * On serverless (Vercel), each cold start resets the map — this provides
 * basic protection within a single instance lifetime. For stronger
 * rate limiting, use Vercel KV or Supabase-based counters.
 */

const requestMap = new Map<string, number[]>();

/**
 * Check if a request should be rate-limited.
 * @param identifier - Unique identifier (e.g., IP address)
 * @param limit - Max requests per window (default: 5)
 * @param windowMs - Window duration in ms (default: 60000 = 1 minute)
 * @returns true if the request is allowed, false if rate-limited
 */
export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const timestamps = requestMap.get(identifier) ?? [];

  // Filter to only timestamps within the current window
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    return false; // Rate limited
  }

  recent.push(now);
  requestMap.set(identifier, recent);

  // Lazy cleanup: if map grows too large, prune old entries
  if (requestMap.size > 10000) {
    for (const [key, ts] of requestMap.entries()) {
      const valid = ts.filter((t) => now - t < windowMs);
      if (valid.length === 0) {
        requestMap.delete(key);
      }
    }
  }

  return true; // Allowed
}

/**
 * Per-API-key rate limiting.
 * Separate sliding window keyed by API key ID.
 * @returns { allowed: true } or { allowed: false, retryAfter: seconds }
 */
export function rateLimitByKey(
  keyId: string,
  limit: number = 60,
  windowMs: number = 60_000
): { allowed: true } | { allowed: false; retryAfter: number } {
  const identifier = `apikey:${keyId}`;
  const allowed = rateLimit(identifier, limit, windowMs);

  if (allowed) return { allowed: true };

  // Calculate retry-after from the oldest request in the window
  const timestamps = requestMap.get(identifier) ?? [];
  const now = Date.now();
  const oldest = timestamps.find((t) => now - t < windowMs);
  const retryAfter = oldest ? Math.ceil((oldest + windowMs - now) / 1000) : 1;

  return { allowed: false, retryAfter };
}

/**
 * Get the client IP from a NextRequest.
 */
export function getClientIp(request: Request): string {
  const forwarded = (request.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip');
  return forwarded || realIp || 'unknown';
}

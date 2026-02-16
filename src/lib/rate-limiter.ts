/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach.
 */

const requestMap = new Map<string, number[]>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of requestMap.entries()) {
    const valid = timestamps.filter((t) => now - t < 60_000);
    if (valid.length === 0) {
      requestMap.delete(key);
    } else {
      requestMap.set(key, valid);
    }
  }
}, 5 * 60_000);

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
  return true; // Allowed
}

/**
 * Get the client IP from a NextRequest.
 */
export function getClientIp(request: Request): string {
  const forwarded = (request.headers.get('x-forwarded-for') ?? '').split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip');
  return forwarded || realIp || 'unknown';
}

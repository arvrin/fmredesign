/**
 * Web Vitals API endpoint
 * Receives Core Web Vitals metrics from the client-side reporter.
 *
 * AUTH: Intentionally public — this receives browser-sent performance data
 * via navigator.sendBeacon(). No sensitive data is accepted or returned.
 * Rate-limited to prevent abuse.
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';

const VALID_METRIC_NAMES = new Set(['CLS', 'INP', 'LCP', 'FCP', 'TTFB', 'FID']);
const VALID_RATINGS = new Set(['good', 'needs-improvement', 'poor']);

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 30 requests per minute per IP (5 metrics × ~6 page loads)
    const ip = getClientIp(request);
    if (!rateLimit(`vitals:${ip}`, 30, 60_000)) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    const body = await request.json();
    const { name, value, rating, page } = body;

    // Validate required fields and types
    if (
      typeof name !== 'string' ||
      !VALID_METRIC_NAMES.has(name) ||
      typeof value !== 'number' ||
      !isFinite(value) ||
      value < 0 ||
      (rating && !VALID_RATINGS.has(rating)) ||
      (page && typeof page !== 'string')
    ) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Metrics are ingested silently — picked up by hosting platform log aggregation
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Web vitals ingestion error:', error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

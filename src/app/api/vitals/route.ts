/**
 * Web Vitals API endpoint
 * Receives Core Web Vitals metrics from the client-side reporter.
 * Logs metrics server-side for monitoring.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value, rating, page } = body;

    if (!name || typeof value !== 'number') {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Log to server stdout (picked up by hosting platform logs)
    console.log(
      `[WebVital] ${name}=${value.toFixed(2)} rating=${rating} page=${page}`
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

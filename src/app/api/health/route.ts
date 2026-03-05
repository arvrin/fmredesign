/**
 * Health check endpoint.
 * Returns DB connection status and basic system info.
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const start = Date.now();
  let dbOk = false;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('admin_settings').select('id').limit(1);
    dbOk = !error;
  } catch {
    dbOk = false;
  }

  const latency = Date.now() - start;

  const status = dbOk ? 200 : 503;

  return NextResponse.json(
    {
      status: dbOk ? 'healthy' : 'degraded',
      db: dbOk ? 'connected' : 'unreachable',
      latency: `${latency}ms`,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

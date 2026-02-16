import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-initialized Supabase client (avoids build-time crash when env vars are missing)
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('Supabase environment variables are not configured');
    }
    _supabaseAdmin = createClient(url, key);
  }
  return _supabaseAdmin;
}

// Keep backward-compatible export as a getter
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

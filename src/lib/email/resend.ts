import { Resend } from 'resend';

// Lazy-initialized Resend client (matches src/lib/supabase.ts pattern)
let _resend: Resend | null = null;

export function getResend(): Resend | null {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn('RESEND_API_KEY not set — emails will be skipped');
      return null;
    }
    _resend = new Resend(key);
  }
  return _resend;
}

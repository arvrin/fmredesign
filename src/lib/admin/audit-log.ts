import { getSupabaseAdmin } from '@/lib/supabase';

export type AuditAction =
  | 'create' | 'update' | 'delete'
  | 'login' | 'logout'
  | 'export' | 'import'
  | 'approve' | 'reject';

export interface AuditEntry {
  id?: string;
  user_id: string;
  user_name: string;
  action: AuditAction;
  resource_type: string; // 'client', 'project', 'content', 'invoice', etc.
  resource_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at?: string;
}

/**
 * Log an admin action to the audit trail.
 * Fires and forgets — never blocks the main response.
 */
export async function logAuditEvent(entry: Omit<AuditEntry, 'id' | 'created_at'>): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from('admin_audit_log').insert({
      user_id: entry.user_id,
      user_name: entry.user_name,
      action: entry.action,
      resource_type: entry.resource_type,
      resource_id: entry.resource_id || null,
      details: entry.details || null,
      ip_address: entry.ip_address || null,
    });
  } catch (error) {
    // Never let audit logging break the main flow
    console.error('Audit log error:', error);
  }
}

/**
 * Helper to extract user info from request headers (set by middleware)
 */
export function getAuditUser(request: Request): { user_id: string; user_name: string } {
  return {
    user_id: request.headers.get('x-admin-user-id') || 'admin',
    user_name: request.headers.get('x-admin-user-name') || 'Super Admin',
  };
}

/**
 * Helper to get IP from request
 */
export function getClientIP(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

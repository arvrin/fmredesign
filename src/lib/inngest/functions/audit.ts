/**
 * Inngest Function: Audit Log
 * Durably inserts audit entries into admin_audit_log.
 * Higher retry count (5) for compliance requirements.
 */

import { inngest } from '../client';
import { getSupabaseAdmin } from '@/lib/supabase';

export const logAuditEventFn = inngest.createFunction(
  { id: 'log-audit-event', retries: 5 },
  { event: 'audit/log' },
  async ({ event, step }) => {
    const { user_id, user_name, action, resource_type, resource_id, details, ip_address } =
      event.data;

    await step.run('insert-audit-log', async () => {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from('admin_audit_log').insert({
        user_id,
        user_name,
        action,
        resource_type,
        resource_id: resource_id || null,
        details: details || null,
        ip_address: ip_address || null,
      });
      if (error) {
        throw new Error(`Audit log insert failed: ${error.message}`);
      }
    });

    return { success: true };
  }
);

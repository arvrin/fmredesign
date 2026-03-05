/**
 * Inngest Functions: Notifications
 * Durably inserts in-app notifications into the notifications table.
 */

import { inngest } from '../client';
import { getSupabaseAdmin } from '@/lib/supabase';

export const sendNotificationFn = inngest.createFunction(
  { id: 'send-notification', retries: 3 },
  { event: 'notification/send' },
  async ({ event, step }) => {
    const { recipientType, recipientId, clientId, type, title, message, priority, actionUrl, metadata } =
      event.data;

    await step.run('insert-notification', async () => {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from('notifications').insert({
        recipient_type: recipientType,
        recipient_id: recipientId || null,
        client_id: clientId || null,
        type,
        title,
        message: message || '',
        priority: priority || 'normal',
        action_url: actionUrl || null,
        metadata: metadata || {},
      });
      if (error) {
        throw new Error(`Notification insert failed: ${error.message}`);
      }
    });

    return { success: true };
  }
);

export const sendNotificationBulkFn = inngest.createFunction(
  { id: 'send-notification-bulk', retries: 3 },
  { event: 'notification/send-bulk' },
  async ({ event, step }) => {
    const { notifications } = event.data;

    // Process in batches of 10
    const batchSize = 10;
    for (let i = 0; i < notifications.length; i += batchSize) {
      const batch = notifications.slice(i, i + batchSize);
      await step.run(`insert-batch-${i}`, async () => {
        const supabase = getSupabaseAdmin();
        const records = batch.map((n) => ({
          recipient_type: n.recipientType,
          recipient_id: n.recipientId || null,
          client_id: n.clientId || null,
          type: n.type,
          title: n.title,
          message: n.message || '',
          priority: n.priority || 'normal',
          action_url: n.actionUrl || null,
          metadata: n.metadata || {},
        }));
        const { error } = await supabase.from('notifications').insert(records);
        if (error) {
          throw new Error(`Bulk notification insert failed: ${error.message}`);
        }
      });
    }

    return { success: true, count: notifications.length };
  }
);

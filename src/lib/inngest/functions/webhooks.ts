/**
 * Inngest Function: Webhook Delivery
 * Durably delivers events to subscribed outgoing webhooks.
 * Each webhook delivery is an independent retryable step.
 */

import { createHmac } from 'crypto';
import { inngest } from '../client';
import { getSupabaseAdmin } from '@/lib/supabase';

interface OutgoingWebhook {
  id: string;
  url: string;
  secret: string | null;
  events: string[];
  is_active: boolean;
}

export const deliverWebhooksFn = inngest.createFunction(
  { id: 'deliver-webhooks', retries: 2 },
  { event: 'webhook/deliver' },
  async ({ event, step }) => {
    const { eventType, payload } = event.data;

    // Step 1: Find matching webhooks
    const webhooks = await step.run('find-matching-webhooks', async () => {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('outgoing_webhooks')
        .select('id, url, secret, events, is_active')
        .eq('is_active', true);

      if (error || !data) return [];

      return (data as OutgoingWebhook[]).filter(
        (wh) => wh.events.includes(eventType) || wh.events.includes('*')
      );
    });

    if (webhooks.length === 0) return { success: true, delivered: 0 };

    // Step 2: Deliver to each webhook independently
    let delivered = 0;
    for (const webhook of webhooks) {
      await step.run(`deliver-${webhook.id}`, async () => {
        const body = JSON.stringify({
          event: eventType,
          timestamp: payload.timestamp,
          data: {
            entityId: payload.entityId,
            actor: payload.actor,
            ...payload.data,
          },
        });

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'User-Agent': 'FreakingMinds-Webhook/1.0',
          'X-FM-Event': eventType,
        };

        if (webhook.secret) {
          const signature = createHmac('sha256', webhook.secret).update(body).digest('hex');
          headers['X-FM-Signature'] = `sha256=${signature}`;
        }

        const supabase = getSupabaseAdmin();

        try {
          const response = await fetch(webhook.url, {
            method: 'POST',
            headers,
            body,
            signal: AbortSignal.timeout(10000),
          });

          const responseBody = await response.text().catch(() => '');

          await supabase.from('outgoing_webhook_deliveries').insert({
            webhook_id: webhook.id,
            event_type: eventType,
            payload: JSON.parse(body),
            response_status: response.status,
            response_body: responseBody.slice(0, 1000),
            attempt: 1,
            delivered_at: response.ok ? new Date().toISOString() : null,
            error: response.ok ? null : `HTTP ${response.status}`,
          });

          if (!response.ok) {
            throw new Error(`Webhook delivery failed: HTTP ${response.status}`);
          }

          delivered++;
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Unknown error';

          await supabase.from('outgoing_webhook_deliveries').insert({
            webhook_id: webhook.id,
            event_type: eventType,
            payload: JSON.parse(body),
            attempt: 1,
            error,
          });

          throw err;
        }
      });
    }

    return { success: true, delivered };
  }
);

/**
 * Outgoing webhook delivery system.
 * Delivers events to registered webhook URLs with HMAC signing and retry logic.
 */

import { createHmac } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { EventPayload } from '@/lib/events/emitter';

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 5000, 25000]; // Exponential backoff

interface OutgoingWebhook {
  id: string;
  url: string;
  secret: string | null;
  events: string[];
  is_active: boolean;
}

/**
 * Deliver an event to all subscribed outgoing webhooks.
 * Called by the event bus webhook subscriber.
 */
export async function deliverToSubscribers(
  eventType: string,
  payload: EventPayload
): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { data: webhooks, error } = await supabase
    .from('outgoing_webhooks')
    .select('id, url, secret, events, is_active')
    .eq('is_active', true);

  if (error || !webhooks) return;

  const matching = (webhooks as OutgoingWebhook[]).filter(
    (wh) => wh.events.includes(eventType) || wh.events.includes('*')
  );

  // Fire-and-forget for each matching webhook
  for (const webhook of matching) {
    deliverWebhook(webhook, eventType, payload).catch((err) => {
      console.error(`Webhook delivery failed (${webhook.id}):`, err);
    });
  }
}

/**
 * Deliver a single webhook with retry logic.
 */
async function deliverWebhook(
  webhook: OutgoingWebhook,
  eventType: string,
  payload: EventPayload
): Promise<void> {
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

  // Sign with HMAC if secret is configured
  if (webhook.secret) {
    const signature = createHmac('sha256', webhook.secret).update(body).digest('hex');
    headers['X-FM-Signature'] = `sha256=${signature}`;
  }

  const supabase = getSupabaseAdmin();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body,
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      const responseBody = await response.text().catch(() => '');

      // Log the delivery attempt
      await supabase.from('outgoing_webhook_deliveries').insert({
        webhook_id: webhook.id,
        event_type: eventType,
        payload: JSON.parse(body),
        response_status: response.status,
        response_body: responseBody.slice(0, 1000),
        attempt,
        delivered_at: response.ok ? new Date().toISOString() : null,
        error: response.ok ? null : `HTTP ${response.status}`,
      });

      if (response.ok) return; // Success — done

      // Non-retryable status codes
      if (response.status >= 400 && response.status < 500 && response.status !== 429) return;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';

      await supabase.from('outgoing_webhook_deliveries').insert({
        webhook_id: webhook.id,
        event_type: eventType,
        payload: JSON.parse(body),
        attempt,
        error,
      });
    }

    // Wait before retry (unless last attempt)
    if (attempt < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt - 1]));
    }
  }
}

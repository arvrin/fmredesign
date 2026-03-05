/**
 * Outgoing webhook delivery system.
 * Now routes through Inngest for durable delivery with managed retries.
 * The deliverToSubscribers function is kept for backward compatibility
 * (used by event bus subscriber fallback).
 */

import { createHmac } from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { EventPayload } from '@/lib/events/types';

interface OutgoingWebhook {
  id: string;
  url: string;
  secret: string | null;
  events: string[];
  is_active: boolean;
}

/**
 * Deliver an event to all subscribed outgoing webhooks.
 * Routes through Inngest for durable delivery.
 * Falls back to direct delivery if Inngest is unreachable.
 */
export async function deliverToSubscribers(
  eventType: string,
  payload: EventPayload
): Promise<void> {
  try {
    const { inngest } = await import('@/lib/inngest/client');
    await inngest.send({
      name: 'webhook/deliver',
      data: {
        eventType,
        payload: {
          entityId: payload.entityId,
          actor: payload.actor,
          timestamp: payload.timestamp,
          data: payload.data,
        },
      },
    });
  } catch {
    // Fallback: direct delivery (best-effort, no retry)
    await deliverToSubscribersDirect(eventType, payload);
  }
}

/**
 * Direct delivery fallback (used when Inngest is unreachable).
 */
async function deliverToSubscribersDirect(
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

  for (const webhook of matching) {
    deliverWebhookDirect(webhook, eventType, payload).catch((err) => {
      console.error(`Webhook delivery failed (${webhook.id}):`, err);
    });
  }
}

/**
 * Direct single webhook delivery (fallback only).
 */
async function deliverWebhookDirect(
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
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';

    await supabase.from('outgoing_webhook_deliveries').insert({
      webhook_id: webhook.id,
      event_type: eventType,
      payload: JSON.parse(body),
      attempt: 1,
      error,
    });
  }
}

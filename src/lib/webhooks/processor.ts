/**
 * Webhook event processor.
 * Routes incoming webhook events to handler functions and logs results.
 */

import { getSupabaseAdmin } from '@/lib/supabase';

type WebhookHandler = (eventType: string, payload: Record<string, unknown>) => Promise<void>;

const handlers: Record<string, WebhookHandler> = {
  stripe: handleStripeEvent,
  github: handleGitHubEvent,
  generic: handleGenericEvent,
};

/**
 * Process a webhook event. Logs to webhook_logs table.
 */
export async function processWebhook(
  provider: string,
  eventType: string | null,
  payload: Record<string, unknown>,
  headers: Record<string, string>,
  signatureValid: boolean
): Promise<void> {
  const supabase = getSupabaseAdmin();
  let error: string | null = null;
  let processed = false;

  try {
    const handler = handlers[provider];
    if (handler && signatureValid) {
      await handler(eventType || 'unknown', payload);
      processed = true;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown processing error';
  }

  // Log the webhook
  await supabase.from('webhook_logs').insert({
    provider,
    event_type: eventType,
    payload,
    headers,
    signature_valid: signatureValid,
    processed,
    error,
  });
}

// ---------------------------------------------------------------------------
// Provider-specific handlers
// ---------------------------------------------------------------------------

async function handleStripeEvent(eventType: string, payload: Record<string, unknown>): Promise<void> {
  const supabase = getSupabaseAdmin();

  switch (eventType) {
    case 'invoice.paid': {
      const invoiceId = (payload.data as Record<string, unknown>)?.object as Record<string, unknown> | undefined;
      const metadata = invoiceId?.metadata as Record<string, string> | undefined;
      const fmInvoiceId = metadata?.fm_invoice_id;
      if (fmInvoiceId) {
        await supabase
          .from('invoices')
          .update({ status: 'paid', paid_date: new Date().toISOString() })
          .eq('id', fmInvoiceId);
      }
      break;
    }
    case 'invoice.payment_failed': {
      const obj = (payload.data as Record<string, unknown>)?.object as Record<string, unknown> | undefined;
      const meta = obj?.metadata as Record<string, string> | undefined;
      const id = meta?.fm_invoice_id;
      if (id) {
        await supabase
          .from('invoices')
          .update({ status: 'overdue' })
          .eq('id', id);
      }
      break;
    }
    default:
      // Log but don't process unhandled Stripe events
      break;
  }
}

async function handleGitHubEvent(_eventType: string, _payload: Record<string, unknown>): Promise<void> {
  // Placeholder for GitHub webhook handling (e.g., deployment notifications)
}

async function handleGenericEvent(_eventType: string, _payload: Record<string, unknown>): Promise<void> {
  // Generic webhooks are logged but not processed further
}

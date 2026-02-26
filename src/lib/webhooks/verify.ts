/**
 * Webhook signature verification.
 * Supports Stripe, GitHub, and generic HMAC providers.
 */

import { createHmac, timingSafeEqual } from 'crypto';

type Provider = 'stripe' | 'github' | 'generic';

/**
 * Verify webhook signature based on provider.
 * Returns true if signature is valid.
 */
export function verifyWebhookSignature(
  provider: Provider,
  rawBody: string,
  headers: Record<string, string>
): boolean {
  switch (provider) {
    case 'stripe':
      return verifyStripe(rawBody, headers);
    case 'github':
      return verifyGitHub(rawBody, headers);
    case 'generic':
      return verifyGenericHmac(rawBody, headers);
    default:
      return false;
  }
}

function verifyStripe(rawBody: string, headers: Record<string, string>): boolean {
  const secret = process.env.WEBHOOK_SECRET_STRIPE;
  if (!secret) return false;

  const sigHeader = headers['stripe-signature'];
  if (!sigHeader) return false;

  // Parse Stripe signature header: t=timestamp,v1=signature
  const parts = sigHeader.split(',').reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) acc[key] = value;
    return acc;
  }, {});

  const timestamp = parts['t'];
  const sig = parts['v1'];
  if (!timestamp || !sig) return false;

  const payload = `${timestamp}.${rawBody}`;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');

  return safeCompare(sig, expected);
}

function verifyGitHub(rawBody: string, headers: Record<string, string>): boolean {
  const secret = process.env.WEBHOOK_SECRET_GITHUB;
  if (!secret) return false;

  const sigHeader = headers['x-hub-signature-256'];
  if (!sigHeader) return false;

  const sig = sigHeader.replace('sha256=', '');
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');

  return safeCompare(sig, expected);
}

function verifyGenericHmac(rawBody: string, headers: Record<string, string>): boolean {
  const secret = process.env.WEBHOOK_SECRET_GENERIC;
  if (!secret) return false;

  const sigHeader = headers['x-webhook-signature'] || headers['x-signature'];
  if (!sigHeader) return false;

  const sig = sigHeader.replace('sha256=', '');
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');

  return safeCompare(sig, expected);
}

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

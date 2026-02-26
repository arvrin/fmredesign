import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/webhooks/verify';
import { processWebhook } from '@/lib/webhooks/processor';

type Provider = 'stripe' | 'github' | 'generic';
const VALID_PROVIDERS = new Set<Provider>(['stripe', 'github', 'generic']);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  if (!VALID_PROVIDERS.has(provider as Provider)) {
    return NextResponse.json(
      { error: `Unknown provider: ${provider}` },
      { status: 400 }
    );
  }

  try {
    const rawBody = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Verify signature
    const signatureValid = verifyWebhookSignature(
      provider as Provider,
      rawBody,
      headers
    );

    // Parse the payload
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Extract event type (provider-specific)
    let eventType: string | null = null;
    if (provider === 'stripe') {
      eventType = (payload.type as string) || null;
    } else if (provider === 'github') {
      eventType = headers['x-github-event'] || null;
    } else {
      eventType = (payload.event as string) || (payload.type as string) || null;
    }

    // Process (fire-and-forget for non-critical, but we await for logging)
    await processWebhook(provider, eventType, payload, headers, signatureValid);

    if (!signatureValid) {
      return NextResponse.json(
        { received: true, warning: 'Signature verification failed' },
        { status: 200 }
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Webhook error (${provider}):`, err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

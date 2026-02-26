import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-key-auth';
import { rateLimitByKey } from '@/lib/rate-limiter';
import { handleMCPRequest } from '@/lib/mcp/handler';

export async function POST(request: NextRequest) {
  // Authenticate via API key
  const apiKey = await validateApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { jsonrpc: '2.0', error: { code: -32000, message: 'Authentication required. Use Authorization: Bearer fmk_...' } },
      { status: 401 }
    );
  }

  // Rate limit
  const rl = rateLimitByKey(apiKey.keyId, apiKey.rateLimit);
  if (!rl.allowed) {
    return NextResponse.json(
      { jsonrpc: '2.0', error: { code: -32000, message: 'Rate limit exceeded' } },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    );
  }

  try {
    const body = await request.json();

    // Basic JSON-RPC validation
    if (body.jsonrpc !== '2.0' || !body.method) {
      return NextResponse.json(
        { jsonrpc: '2.0', error: { code: -32600, message: 'Invalid JSON-RPC request' } },
        { status: 400 }
      );
    }

    const result = await handleMCPRequest(body, apiKey);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' } },
      { status: 400 }
    );
  }
}

/**
 * AI Content Generation API
 * Triggers n8n workflows to generate draft content via Gemini AI.
 * Returns 202 immediately — content appears in 1-2 minutes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getClientIP } from '@/lib/admin/audit-log';

const WEBHOOK_URLS: Record<string, string | undefined> = {
  monthly_calendar: process.env.N8N_WEBHOOK_MONTHLY_CONTENT,
  holiday_event: process.env.N8N_WEBHOOK_HOLIDAY_CONTENT,
};

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { workflow_type, client_id } = body as {
      workflow_type?: string;
      client_id?: string;
    };

    if (!workflow_type || !WEBHOOK_URLS[workflow_type]) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid workflow_type. Must be one of: ${Object.keys(WEBHOOK_URLS).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const webhookUrl = WEBHOOK_URLS[workflow_type];
    if (!webhookUrl) {
      return NextResponse.json(
        {
          success: false,
          error: `n8n webhook URL not configured for ${workflow_type}. Set the environment variable.`,
        },
        { status: 503 }
      );
    }

    // Fire-and-forget: trigger n8n webhook with 5s timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: client_id || null }),
        signal: controller.signal,
      });
    } catch {
      // Timeout or network error is expected for fire-and-forget
      // n8n will still process the webhook
    } finally {
      clearTimeout(timeout);
    }

    // Log to audit
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from('admin_audit_log').insert({
        user_id: 'system-admin',
        user_name: 'System Admin',
        action: 'ai_generate',
        resource_type: 'content',
        resource_id: workflow_type,
        details: { workflow_type, client_id: client_id || 'all' },
        ip_address: getClientIP(request),
      });
    } catch {
      // Non-critical — don't fail the request
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Content generation started. Drafts will appear in 1-2 minutes.',
        workflow_type,
        client_id: client_id || 'all',
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('Error triggering content generation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to trigger content generation' },
      { status: 500 }
    );
  }
}

/**
 * AI Content Refinement API
 * Refines/rewrites an existing content item based on user instructions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth-middleware';
import { getSupabaseAdmin } from '@/lib/supabase';
import { logAuditEvent, getClientIP } from '@/lib/admin/audit-log';
import { refineContent } from '@/lib/ai/generators/refine';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'content.write');
  if ('error' in auth) return auth.error;

  try {
    const body = await request.json();
    const { clientId, contentId, instruction } = body as {
      clientId?: string;
      contentId?: string;
      instruction?: string;
    };

    if (!clientId || !contentId || !instruction) {
      return NextResponse.json(
        { success: false, error: 'clientId, contentId, and instruction are required' },
        { status: 400 }
      );
    }

    // Fetch existing content
    const supabase = getSupabaseAdmin();
    const { data: existing, error: fetchError } = await supabase
      .from('content_calendar')
      .select('title, content, platform, type')
      .eq('id', contentId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: 'Content item not found' },
        { status: 404 }
      );
    }

    // Generate refined content
    const refined = await refineContent(clientId, existing, instruction);

    // Update the content item in place
    const { error: updateError } = await supabase
      .from('content_calendar')
      .update({
        title: refined.title,
        content: refined.content,
        description: refined.visualDirection || existing.content,
        hashtags: refined.hashtags || [],
        mentions: refined.mentions || [],
      })
      .eq('id', contentId);

    if (updateError) throw updateError;

    // Audit log
    logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'ai_refine',
      resource_type: 'content',
      resource_id: contentId,
      details: { instruction, clientId },
      ip_address: getClientIP(request),
    });

    return NextResponse.json({
      success: true,
      data: refined,
      message: 'Content refined successfully',
    });
  } catch (error) {
    console.error('Error refining content:', error);
    const message = error instanceof Error ? error.message : 'Failed to refine content';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

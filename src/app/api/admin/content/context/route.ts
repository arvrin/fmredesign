/**
 * Content Context Preview API
 * Returns the assembled client context that the AI will use for generation.
 * Useful for admins to see what data is available and identify gaps.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { assembleClientContext } from '@/lib/ai/context/assemble';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const clientId = request.nextUrl.searchParams.get('clientId');
    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'clientId query parameter is required' },
        { status: 400 }
      );
    }

    const context = await assembleClientContext(clientId);

    // Identify missing data that would improve generation quality
    const warnings: string[] = [];
    if (!context.contentPillars?.length) warnings.push('No content pillars defined — AI will use generic topic distribution');
    if (!context.contentPreferences) warnings.push('No content preferences set — AI will use defaults (5 posts/week, Instagram)');
    if (!context.brandVoice) warnings.push('No brand voice data — AI will use neutral professional tone');
    if (!context.targetAudience) warnings.push('No target audience data — AI will use generic audience assumptions');
    if (!context.recentContent?.length) warnings.push('No content history — AI cannot ensure continuity or avoid repetition');
    if (!context.socialAccounts?.length) warnings.push('No social accounts connected');

    return NextResponse.json({
      success: true,
      data: context,
      warnings,
    });
  } catch (error) {
    console.error('Error assembling context:', error);
    const message = error instanceof Error ? error.message : 'Failed to assemble context';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

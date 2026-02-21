/**
 * Verify Token API
 * Validates a Meta Page Access Token and returns page info.
 *
 * POST /api/admin/social/verify-token
 * Body: { accessToken: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth-middleware';
import { verifyPageToken } from '@/lib/social/meta-api';

export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'content.publish');
  if ('error' in auth) return auth.error;

  try {
    const { accessToken } = await request.json();

    if (!accessToken || typeof accessToken !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Access token is required' },
        { status: 400 }
      );
    }

    const pageInfo = await verifyPageToken(accessToken.trim());

    return NextResponse.json({
      success: true,
      data: {
        pageId: pageInfo.id,
        pageName: pageInfo.name,
        instagramAccountId: pageInfo.instagram_business_account?.id || null,
        hasInstagram: !!pageInfo.instagram_business_account,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token verification failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

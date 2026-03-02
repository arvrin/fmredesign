/**
 * Talent Profile API (portal-scoped, auth-protected)
 * GET  — fetch full talent profile for portal display
 * PUT  — update profile fields
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireTalentAuth } from '@/lib/talent-session';

const ALLOWED_UPDATE_KEYS: Record<string, string> = {
  personalInfo: 'personal_info',
  portfolioLinks: 'portfolio_links',
  socialMedia: 'social_media',
  availability: 'availability',
  preferences: 'preferences',
  pricing: 'pricing',
};

function transformProfile(row: Record<string, unknown>) {
  return {
    id: row.id,
    applicationId: row.application_id,
    profileSlug: row.profile_slug,
    email: row.email,
    personalInfo: row.personal_info || {},
    professionalDetails: row.professional_details || {},
    portfolioLinks: row.portfolio_links || {},
    socialMedia: row.social_media || {},
    availability: row.availability || {},
    preferences: row.preferences || {},
    pricing: row.pricing || {},
    ratings: row.ratings || { overallRating: 0, totalReviews: 0 },
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const authError = await requireTalentAuth(request, slug);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('talent_profiles')
      .select('*')
      .eq('profile_slug', slug)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: transformProfile(data),
    });
  } catch (error) {
    console.error('Error fetching talent profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const authError = await requireTalentAuth(request, slug);
  if (authError) return authError;

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from('talent_profiles')
      .select('id')
      .eq('profile_slug', slug)
      .single();

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    const dbUpdates: Record<string, unknown> = {};
    for (const [camelKey, snakeKey] of Object.entries(ALLOWED_UPDATE_KEYS)) {
      if (body[camelKey] !== undefined) {
        dbUpdates[snakeKey] = body[camelKey];
      }
    }

    if (Object.keys(dbUpdates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Sync email if provided in personalInfo
    if (
      body.personalInfo?.email &&
      typeof body.personalInfo.email === 'string'
    ) {
      dbUpdates.email = body.personalInfo.email.trim();
      dbUpdates.portal_email = body.personalInfo.email.trim().toLowerCase();
    }

    dbUpdates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('talent_profiles')
      .update(dbUpdates)
      .eq('id', existing.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating talent profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

/**
 * CreativeMinds Talent API
 * Handles talent applications and admin management (Supabase JSONB)
 *
 * POST  - Public: submit a talent application (rate-limited, no auth)
 * GET   - Admin: list/search talent applications with stats
 * PUT   - Admin: update application status (approve/reject) with profile creation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a URL-safe slug from a name.
 * Handles empty names, special characters, accented letters, and extra whitespace.
 * Appends 4 random alphanumeric characters for uniqueness.
 *
 * Examples:
 *   "Rahul Sharma"     -> "rahul-sharma-x3k9"
 *   "José García-López" -> "jose-garcia-lopez-a2b7"
 *   ""                  -> "talent-f4g8"
 *   "   "               -> "talent-m1n2"
 */
function generateProfileSlug(name: string): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const suffix = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  if (!name || !name.trim()) {
    return `talent-${suffix}`;
  }

  const slug = name
    .normalize('NFD')                    // decompose accented characters
    .replace(/[\u0300-\u036f]/g, '')     // strip diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')        // remove non-alphanumeric (keep spaces & hyphens)
    .replace(/[\s-]+/g, '-')             // collapse whitespace/hyphens into single hyphen
    .replace(/^-+|-+$/g, '');            // trim leading/trailing hyphens

  if (!slug) {
    return `talent-${suffix}`;
  }

  return `${slug}-${suffix}`;
}

/** Transform a Supabase talent_applications row to the API response shape. */
function transformApplication(row: Record<string, any>) {
  return {
    id: row.id,
    applicationDate: row.application_date || row.created_at,
    status: row.status,
    reviewNotes: row.review_notes,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    personalInfo: row.personal_info || {},
    professionalDetails: row.professional_details || {},
    portfolioLinks: row.portfolio_links || {},
    socialMedia: row.social_media || {},
    availability: row.availability || {},
    preferences: row.preferences || {},
    pricing: row.pricing || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------------------------------------------------------------------------
// POST  /api/talent  (public - no auth required)
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 requests per minute per IP
    const clientIp = getClientIp(request);
    if (!rateLimit(clientIp, 3)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, application } = body;

    if (action !== 'submit_application') {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application data is required' },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------------
    // Validate required personal info fields
    // ------------------------------------------------------------------
    const personalInfo = application.personalInfo;
    if (!personalInfo?.fullName || !personalInfo?.email || !personalInfo?.phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: fullName, email, and phone are required in personalInfo',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(personalInfo.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------------
    // Insert into talent_applications
    // ------------------------------------------------------------------
    const applicationId = crypto.randomUUID();

    const record = {
      id: applicationId,
      status: 'submitted',
      personal_info: application.personalInfo || {},
      professional_details: application.professionalDetails || {},
      portfolio_links: application.portfolioLinks || {},
      social_media: application.socialMedia || {},
      availability: application.availability || {},
      preferences: application.preferences || {},
      pricing: application.pricing || {},
    };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('talent_applications').insert(record);

    if (error) throw error;

    return NextResponse.json(
      { success: true, id: applicationId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting talent application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET  /api/talent  (admin-protected)
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const supabase = getSupabaseAdmin();

    // ------------------------------------------------------------------
    // Build the filtered query
    // ------------------------------------------------------------------
    let query = supabase
      .from('talent_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    // Search across JSONB personal_info fields (fullName, email)
    // Supabase supports ->> for text extraction from JSONB columns
    if (search) {
      query = query.or(
        `personal_info->>fullName.ilike.%${search}%,personal_info->>email.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    const applications = (data || []).map(transformApplication);

    // ------------------------------------------------------------------
    // Compute stats across ALL applications (unfiltered)
    // ------------------------------------------------------------------
    const { data: allApps, error: statsError } = await supabase
      .from('talent_applications')
      .select('status');

    if (statsError) throw statsError;

    const stats = {
      total: (allApps || []).length,
      submitted: 0,
      under_review: 0,
      approved: 0,
      rejected: 0,
    };

    for (const app of allApps || []) {
      const s = app.status as string;
      if (s === 'submitted') stats.submitted++;
      else if (s === 'under_review') stats.under_review++;
      else if (s === 'approved') stats.approved++;
      else if (s === 'rejected') stats.rejected++;
    }

    return NextResponse.json({
      success: true,
      data: applications,
      stats,
    });
  } catch (error) {
    console.error('Error fetching talent applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch talent applications' },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PUT  /api/talent  (admin-protected)
// ---------------------------------------------------------------------------

export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, status, reviewNotes, reviewedBy } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['submitted', 'under_review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // ------------------------------------------------------------------
    // Update the application
    // ------------------------------------------------------------------
    const updatePayload: Record<string, any> = {
      status,
      reviewed_at: new Date().toISOString(),
    };

    if (reviewNotes !== undefined) updatePayload.review_notes = reviewNotes;
    if (reviewedBy !== undefined) updatePayload.reviewed_by = reviewedBy;

    const { data: updatedApp, error: updateError } = await supabase
      .from('talent_applications')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    if (!updatedApp) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------------
    // If approved -> create talent_profiles record
    // ------------------------------------------------------------------
    let profileSlug: string | undefined;

    if (status === 'approved') {
      const personalInfo = updatedApp.personal_info as Record<string, any> || {};
      const fullName = (personalInfo.fullName as string) || '';
      profileSlug = generateProfileSlug(fullName);

      const profileRecord = {
        id: crypto.randomUUID(),
        application_id: id,
        profile_slug: profileSlug,
        email: personalInfo.email || null,
        personal_info: updatedApp.personal_info,
        professional_details: updatedApp.professional_details,
        portfolio_links: updatedApp.portfolio_links,
        social_media: updatedApp.social_media,
        availability: updatedApp.availability,
        preferences: updatedApp.preferences,
        pricing: updatedApp.pricing,
        status: 'approved',
      };

      const { error: profileError } = await supabase
        .from('talent_profiles')
        .insert(profileRecord);

      if (profileError) throw profileError;
    }

    return NextResponse.json({
      success: true,
      ...(profileSlug ? { profileSlug } : {}),
    });
  } catch (error) {
    console.error('Error updating talent application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

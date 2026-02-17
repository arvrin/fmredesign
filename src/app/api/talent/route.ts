/**
 * CreativeMinds Talent API
 * Handles talent applications and management (Supabase JSONB)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const supabase = getSupabaseAdmin();

    if (type === 'applications') {
      let query = supabase.from('talent_applications').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: (data || []).map(transformApplication),
      });
    }

    if (type === 'talents') {
      let query = supabase.from('talent_profiles').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) throw error;

      let talents = (data || []).map(transformProfile);

      if (category) {
        talents = talents.filter((t: any) => t.professionalDetails?.category === category);
      }

      if (id) {
        const talent = talents.find((t: any) => t.id === id);
        return NextResponse.json({ success: true, data: talent || null });
      }

      return NextResponse.json({ success: true, data: talents });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching talent data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch talent data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    if (!rateLimit(clientIp, 5)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, application, applicationId } = body;

    if (action === 'submit_application' && application?.personalInfo?.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(application.personalInfo.email)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    const supabase = getSupabaseAdmin();

    if (action === 'submit_application') {
      const appId = `app-${Date.now()}`;
      const record = {
        id: appId,
        status: 'submitted',
        personal_info: application.personalInfo || {},
        professional_details: application.professionalDetails || {},
        portfolio_links: application.portfolioLinks || {},
        social_media: application.socialMedia || {},
        availability: application.availability || {},
        preferences: application.preferences || {},
        pricing: application.pricing || {},
      };

      const { error } = await supabase.from('talent_applications').insert(record);
      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: {
          ...application,
          id: appId,
          applicationDate: new Date().toISOString(),
          status: 'submitted',
        },
      });
    }

    if (action === 'approve_application') {
      // Update application status
      const { error: updateError } = await supabase
        .from('talent_applications')
        .update({
          status: 'approved',
          reviewed_by: 'admin',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // Read application data
      const { data: appData, error: readError } = await supabase
        .from('talent_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (readError || !appData) {
        return NextResponse.json(
          { success: false, error: 'Application not found' },
          { status: 404 }
        );
      }

      // Create talent profile from application
      const talentId = `talent-${Date.now()}`;
      const talentRecord = {
        id: talentId,
        application_id: applicationId,
        personal_info: appData.personal_info,
        professional_details: appData.professional_details,
        portfolio_links: appData.portfolio_links,
        social_media: appData.social_media,
        availability: appData.availability,
        preferences: appData.preferences,
        pricing: appData.pricing,
        status: 'approved',
        ratings: {
          overallRating: 0,
          totalReviews: 0,
          qualityOfWork: 0,
          communication: 0,
          timeliness: 0,
          professionalism: 0,
        },
      };

      const { error: profileError } = await supabase.from('talent_profiles').insert(talentRecord);
      if (profileError) throw profileError;

      return NextResponse.json({
        success: true,
        data: transformProfile({ ...talentRecord, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing talent request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { type, id, updates } = body;

    const supabase = getSupabaseAdmin();

    if (type === 'application') {
      const dbUpdates: Record<string, any> = {};
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.reviewNotes !== undefined) dbUpdates.review_notes = updates.reviewNotes;
      if (updates.reviewedBy !== undefined) dbUpdates.reviewed_by = updates.reviewedBy;
      if (updates.reviewedAt !== undefined) dbUpdates.reviewed_at = updates.reviewedAt;
      if (updates.personalInfo !== undefined) dbUpdates.personal_info = updates.personalInfo;
      if (updates.professionalDetails !== undefined) dbUpdates.professional_details = updates.professionalDetails;
      if (updates.portfolioLinks !== undefined) dbUpdates.portfolio_links = updates.portfolioLinks;
      if (updates.socialMedia !== undefined) dbUpdates.social_media = updates.socialMedia;
      if (updates.availability !== undefined) dbUpdates.availability = updates.availability;
      if (updates.preferences !== undefined) dbUpdates.preferences = updates.preferences;
      if (updates.pricing !== undefined) dbUpdates.pricing = updates.pricing;

      const { data, error } = await supabase
        .from('talent_applications')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return NextResponse.json(
          { success: false, error: 'Application not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: transformApplication(data),
      });
    }

    if (type === 'talent') {
      const dbUpdates: Record<string, any> = {};
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.personalInfo !== undefined) dbUpdates.personal_info = updates.personalInfo;
      if (updates.professionalDetails !== undefined) dbUpdates.professional_details = updates.professionalDetails;
      if (updates.portfolioLinks !== undefined) dbUpdates.portfolio_links = updates.portfolioLinks;
      if (updates.socialMedia !== undefined) dbUpdates.social_media = updates.socialMedia;
      if (updates.availability !== undefined) dbUpdates.availability = updates.availability;
      if (updates.preferences !== undefined) dbUpdates.preferences = updates.preferences;
      if (updates.pricing !== undefined) dbUpdates.pricing = updates.pricing;
      if (updates.ratings !== undefined) dbUpdates.ratings = updates.ratings;

      const { data, error } = await supabase
        .from('talent_profiles')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return NextResponse.json(
          { success: false, error: 'Talent not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: transformProfile(data),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating talent data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update talent data' },
      { status: 500 }
    );
  }
}

/** Transform Supabase application row to API response */
function transformApplication(row: any) {
  return {
    id: row.id,
    applicationDate: row.application_date || row.created_at,
    status: row.status,
    reviewNotes: row.review_notes,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    personalInfo: row.personal_info || {},
    professionalDetails: row.professional_details || {},
    portfolio: [],
    portfolioLinks: row.portfolio_links || {},
    socialMedia: row.social_media || {},
    availability: row.availability || {},
    preferences: row.preferences || {},
    pricing: row.pricing || {},
  };
}

/** Transform Supabase profile row to API response */
function transformProfile(row: any) {
  return {
    ...transformApplication(row),
    id: row.id,
    applicationId: row.application_id,
    ratings: row.ratings || {
      overallRating: 0,
      totalReviews: 0,
      qualityOfWork: 0,
      communication: 0,
      timeliness: 0,
      professionalism: 0,
    },
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

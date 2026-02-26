/**
 * Admin Settings API
 * Persists admin panel settings to Supabase (admin_settings table)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';

const SETTINGS_ID = 'global';
const VALID_SECTIONS = ['profile', 'general', 'notifications', 'security', 'privacy', 'appearance', 'integrations'] as const;

// GET /api/admin/settings — fetch all settings
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('id', SETTINGS_ID)
      .single();

    if (error || !data) {
      // Return defaults if no row exists
      return NextResponse.json({
        success: true,
        data: {
          profile: { name: 'Admin', email: 'admin@freakingminds.in', phone: '', role: 'Super Admin' },
          general: { timezone: 'Asia/Kolkata', dateFormat: 'DD/MM/YYYY', timeFormat: '12h', language: 'en', currency: 'INR' },
          notifications: {},
          security: {},
          privacy: {},
          appearance: {},
          integrations: {},
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: data.profile || {},
        general: data.general || {},
        notifications: data.notifications || {},
        security: data.security || {},
        privacy: data.privacy || {},
        appearance: data.appearance || {},
        integrations: data.integrations || {},
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/admin/settings — update a single section
export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { section, data } = body;

    if (!section || !VALID_SECTIONS.includes(section)) {
      return NextResponse.json(
        { success: false, error: `Invalid section. Must be one of: ${VALID_SECTIONS.join(', ')}` },
        { status: 400 }
      );
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Data must be a non-null object' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Read current row to merge
    const { data: current } = await supabase
      .from('admin_settings')
      .select(section)
      .eq('id', SETTINGS_ID)
      .single();

    const existing = current?.[section as keyof typeof current];
    const merged = { ...(typeof existing === 'object' && existing !== null ? existing : {}), ...data };

    const { error } = await supabase
      .from('admin_settings')
      .upsert({
        id: SETTINGS_ID,
        [section]: merged,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) throw error;

    return NextResponse.json({ success: true, data: merged });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
  }
}

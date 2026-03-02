/**
 * Talent Login API
 * POST — authenticate a talent user with email + password
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';
import {
  createTalentSession,
  setTalentSessionCookie,
  type TalentSessionData,
} from '@/lib/talent-session';

export async function POST(request: NextRequest) {
  // Rate limit: 5/min per IP
  const clientIp = getClientIp(request);
  if (!rateLimit(clientIp, 5, 60_000)) {
    return NextResponse.json(
      { success: false, error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Lookup by portal_email
    const { data: profile, error } = await supabase
      .from('talent_profiles')
      .select('id, profile_slug, portal_password, portal_email, personal_info, status')
      .eq('portal_email', email.trim().toLowerCase())
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (profile.status === 'suspended') {
      return NextResponse.json(
        { success: false, error: 'Your account has been suspended. Please contact support.' },
        { status: 403 }
      );
    }

    if (!profile.portal_password) {
      return NextResponse.json(
        { success: false, error: 'Portal access not configured. Please contact the admin.' },
        { status: 401 }
      );
    }

    // Compare password (bcrypt)
    const passwordMatch = await bcrypt.compare(password, profile.portal_password);

    // Fallback: legacy plaintext auto-upgrade
    if (!passwordMatch) {
      if (profile.portal_password === password) {
        // Auto-upgrade to bcrypt
        const hashed = await bcrypt.hash(password, 12);
        await supabase
          .from('talent_profiles')
          .update({ portal_password: hashed })
          .eq('id', profile.id);
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // Create session
    const sessionId = await createTalentSession(profile.id, email);
    const personalInfo = (profile.personal_info || {}) as Record<string, unknown>;
    const fullName = (personalInfo.fullName as string) || 'Talent';

    const sessionData: TalentSessionData = {
      sessionId,
      talentId: profile.id,
      slug: profile.profile_slug,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    const response = NextResponse.json({
      success: true,
      slug: profile.profile_slug,
      name: fullName,
      redirectUrl: `/creativeminds/portal/${profile.profile_slug}`,
    });

    setTalentSessionCookie(response, sessionId, sessionData);

    return response;
  } catch (error) {
    console.error('Talent login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

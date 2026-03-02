/**
 * Talent Password Change API
 * PUT — change portal password (requires auth)
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireTalentAuth } from '@/lib/talent-session';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const authError = await requireTalentAuth(request, slug);
  if (authError) return authError;

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current and new passwords are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: profile, error } = await supabase
      .from('talent_profiles')
      .select('id, portal_password')
      .eq('profile_slug', slug)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    if (!profile.portal_password) {
      return NextResponse.json(
        { success: false, error: 'No password set. Contact admin.' },
        { status: 400 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, profile.portal_password);
    if (!isValid) {
      // Fallback: plaintext check
      if (profile.portal_password !== currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 401 }
        );
      }
    }

    // Hash and save new password
    const hashed = await bcrypt.hash(newPassword, 12);
    const { error: updateError } = await supabase
      .from('talent_profiles')
      .update({ portal_password: hashed })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing talent password:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    );
  }
}

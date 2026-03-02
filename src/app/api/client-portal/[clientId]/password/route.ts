/**
 * Client Password Change API
 * PUT — Change password (requires current password + new password)
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireClientAuth } from '@/lib/client-session';
import { getSupabaseAdmin } from '@/lib/supabase';
import { resolveClientId } from '@/lib/client-portal/resolve-client';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;

  const authError = await requireClientAuth(request, clientId);
  if (authError) return authError;

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const resolved = await resolveClientId(clientId);
    if (!resolved) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: client, error } = await supabase
      .from('clients')
      .select('id, portal_password')
      .eq('id', resolved.id)
      .single();

    if (error || !client || !client.portal_password) {
      return NextResponse.json(
        { success: false, error: 'Unable to verify current password' },
        { status: 400 }
      );
    }

    // Verify current password
    const isBcryptHash = client.portal_password.startsWith('$2a$') || client.portal_password.startsWith('$2b$');
    const passwordMatch = isBcryptHash
      ? await bcrypt.compare(currentPassword, client.portal_password)
      : client.portal_password === currentPassword;

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const { error: updateError } = await supabase
      .from('clients')
      .update({ portal_password: hashedPassword })
      .eq('id', resolved.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    console.error('Password change error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    );
  }
}

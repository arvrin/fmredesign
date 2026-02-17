/**
 * Mobile Authentication API Endpoint
 * Handles mobile number authentication for authorized users (Supabase)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeMobileNumber } from '@/lib/supabase-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobileNumber } = body;

    if (!mobileNumber) {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // Validate mobile number format
    const normalizedMobile = normalizeMobileNumber(mobileNumber);
    const indianMobileRegex = /^\+91[6-9]\d{9}$/;

    if (!indianMobileRegex.test(normalizedMobile)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid Indian mobile number (e.g., +91 98765 43210)',
        },
        { status: 400 }
      );
    }

    // Find user by mobile number
    const supabase = getSupabaseAdmin();
    const { data: userRow, error } = await supabase
      .from('authorized_users')
      .select('*')
      .eq('mobile_number', normalizedMobile)
      .eq('status', 'active')
      .single();

    if (error || !userRow) {
      return NextResponse.json(
        {
          success: false,
          error: 'This mobile number is not authorized. Please contact your administrator.',
        },
        { status: 401 }
      );
    }

    // Parse permissions
    const parsePermissions = (permissionsStr: string): string[] => {
      if (!permissionsStr) return [];
      if (permissionsStr === 'full_access') {
        return ['read', 'write', 'delete', 'admin', 'users', 'clients', 'projects', 'invoices', 'settings'];
      }
      return permissionsStr.split(',').map((p) => p.trim()).filter((p) => p.length > 0);
    };

    const user = {
      id: userRow.id,
      mobileNumber: userRow.mobile_number,
      name: userRow.name,
      email: userRow.email,
      role: userRow.role,
      permissions: parsePermissions(userRow.permissions),
      status: userRow.status,
      createdBy: userRow.created_by,
      createdAt: userRow.created_at,
      updatedAt: userRow.updated_at,
      lastLogin: userRow.last_login,
      notes: userRow.notes,
    };

    // Update last login
    await supabase
      .from('authorized_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Set admin session cookie so API calls pass requireAdminAuth middleware
    const adminPassword = process.env.ADMIN_PASSWORD;
    const response = NextResponse.json({
      success: true,
      user,
    });
    if (adminPassword) {
      const token = Buffer.from(`${adminPassword}:${Date.now()}`).toString('base64');
      response.cookies.set('fm-admin-session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60,
      });
    }
    return response;
  } catch (error) {
    console.error('Mobile authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}

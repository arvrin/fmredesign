/**
 * User Management API Endpoints
 * Handles CRUD operations for authorized users (Supabase)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { normalizeMobileNumber, getRolePermissions } from '@/lib/supabase-utils';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';

// GET - List all authorized users
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();
    const { data: users, error } = await supabase
      .from('authorized_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedUsers = (users || []).map((u) => ({
      id: u.id,
      mobileNumber: u.mobile_number,
      name: u.name,
      email: u.email,
      role: u.role,
      permissions: u.permissions,
      status: u.status,
      createdBy: u.created_by,
      createdAt: u.created_at,
      updatedAt: u.updated_at,
      lastLogin: u.last_login,
      notes: u.notes,
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new authorized user
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, email, mobileNumber, role, notes } = body;

    if (!name || !email || !mobileNumber || !role) {
      return NextResponse.json(
        { success: false, error: 'Name, email, mobile number, and role are required' },
        { status: 400 }
      );
    }

    const newUser = {
      id: `user-${Date.now()}`,
      mobile_number: normalizeMobileNumber(mobileNumber),
      name,
      email,
      role,
      permissions: getRolePermissions(role).join(','),
      status: 'active',
      created_by: 'admin',
      notes: notes || '',
    };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('authorized_users').insert(newUser);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      user: {
        ...newUser,
        mobileNumber: newUser.mobile_number,
        createdBy: newUser.created_by,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT - Update authorized user
export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, name, email, mobileNumber, role, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (mobileNumber) updates.mobile_number = normalizeMobileNumber(mobileNumber);
    if (role) {
      updates.role = role;
      updates.permissions = getRolePermissions(role).join(',');
    }
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('authorized_users')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Remove authorized user
export async function DELETE(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('authorized_users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

/**
 * User Management API Endpoints
 * Handles CRUD operations for authorized users
 */

import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

// GET - List all authorized users
export async function GET(request: NextRequest) {
  try {
    const users = await googleSheetsService.getAuthorizedUsers();
    
    const formattedUsers = users.map(user => ({
      id: user.id as string,
      mobileNumber: user.mobileNumber as string,
      name: user.name as string,
      email: user.email as string,
      role: user.role as string,
      permissions: user.permissions as string,
      status: user.status as string,
      createdBy: user.createdBy as string,
      createdAt: user.createdAt as string,
      updatedAt: user.updatedAt as string,
      lastLogin: user.lastLogin as string | null,
      notes: user.notes as string
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers
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
  try {
    const body = await request.json();
    const { name, email, mobileNumber, role, notes } = body;

    // Validate required fields
    if (!name || !email || !mobileNumber || !role) {
      return NextResponse.json(
        { success: false, error: 'Name, email, mobile number, and role are required' },
        { status: 400 }
      );
    }

    // Normalize mobile number
    const normalizeMobileNumber = (mobile: string): string => {
      if (!mobile) return '';
      
      let normalized = mobile.replace(/[^\d+]/g, '');
      
      if (normalized.startsWith('+91')) {
        return normalized;
      }
      
      if (normalized.startsWith('91') && normalized.length === 12) {
        return `+${normalized}`;
      }
      
      if (normalized.length === 10 && !normalized.startsWith('0')) {
        return `+91${normalized}`;
      }
      
      return normalized;
    };

    // Get role permissions
    const getRolePermissions = (roleKey: string): string[] => {
      const rolePermissions = {
        admin: ['read', 'write', 'delete', 'admin', 'users', 'clients', 'projects', 'invoices', 'settings'],
        manager: ['read', 'write', 'clients', 'projects', 'invoices'],
        editor: ['read', 'write', 'clients', 'projects'],
        viewer: ['read']
      };
      
      return rolePermissions[roleKey as keyof typeof rolePermissions] || [];
    };

    const newUser = {
      id: `user-${Date.now()}`,
      mobileNumber: normalizeMobileNumber(mobileNumber),
      name,
      email,
      role,
      permissions: getRolePermissions(role).join(','),
      status: 'active',
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
      notes: notes || ''
    };

    const success = await googleSheetsService.addAuthorizedUser(newUser);
    
    if (success) {
      return NextResponse.json({
        success: true,
        user: newUser
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }

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
  try {
    const body = await request.json();
    const { id, name, email, mobileNumber, role, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Normalize mobile number if provided
    const normalizeMobileNumber = (mobile: string): string => {
      if (!mobile) return '';
      
      let normalized = mobile.replace(/[^\d+]/g, '');
      
      if (normalized.startsWith('+91')) {
        return normalized;
      }
      
      if (normalized.startsWith('91') && normalized.length === 12) {
        return `+${normalized}`;
      }
      
      if (normalized.length === 10 && !normalized.startsWith('0')) {
        return `+91${normalized}`;
      }
      
      return normalized;
    };

    // Get role permissions
    const getRolePermissions = (roleKey: string): string[] => {
      const rolePermissions = {
        admin: ['read', 'write', 'delete', 'admin', 'users', 'clients', 'projects', 'invoices', 'settings'],
        manager: ['read', 'write', 'clients', 'projects', 'invoices'],
        editor: ['read', 'write', 'clients', 'projects'],
        viewer: ['read']
      };
      
      return rolePermissions[roleKey as keyof typeof rolePermissions] || [];
    };

    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (mobileNumber) updates.mobileNumber = normalizeMobileNumber(mobileNumber);
    if (role) {
      updates.role = role;
      updates.permissions = getRolePermissions(role).join(',');
    }
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const success = await googleSheetsService.updateAuthorizedUser(id, updates);
    
    if (success) {
      return NextResponse.json({
        success: true
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      );
    }

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
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const success = await googleSheetsService.deleteAuthorizedUser(userId);
    
    if (success) {
      return NextResponse.json({
        success: true
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to delete user' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
/**
 * Mobile Authentication API Endpoint
 * Handles mobile number authentication for authorized users
 */

import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

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

    // Normalize mobile number
    const normalizeMobileNumber = (mobile: string): string => {
      if (!mobile) return '';
      
      // Remove all non-digit characters except +
      let normalized = mobile.replace(/[^\d+]/g, '');
      
      // If starts with +91, keep it
      if (normalized.startsWith('+91')) {
        return normalized;
      }
      
      // If starts with 91 but no +, add +
      if (normalized.startsWith('91') && normalized.length === 12) {
        return `+${normalized}`;
      }
      
      // If 10 digits, add +91 prefix
      if (normalized.length === 10 && !normalized.startsWith('0')) {
        return `+91${normalized}`;
      }
      
      return normalized;
    };

    // Validate mobile number format
    const validateMobileNumber = (mobile: string): { isValid: boolean; error?: string } => {
      if (!mobile) {
        return { isValid: false, error: 'Mobile number is required' };
      }

      const normalized = normalizeMobileNumber(mobile);
      
      // Check if it's a valid Indian mobile number format
      const indianMobileRegex = /^\+91[6-9]\d{9}$/;
      
      if (!indianMobileRegex.test(normalized)) {
        return { 
          isValid: false, 
          error: 'Please enter a valid Indian mobile number (e.g., +91 98765 43210)' 
        };
      }

      return { isValid: true };
    };

    // Validate mobile number format
    const validation = validateMobileNumber(mobileNumber);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const normalizedMobile = normalizeMobileNumber(mobileNumber);
    
    // Find user by mobile number
    const userSheet = await googleSheetsService.findUserByMobile(normalizedMobile);
    
    if (!userSheet) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'This mobile number is not authorized. Please contact your administrator.' 
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (userSheet.status !== 'active') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Your account is inactive. Please contact your administrator.' 
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
      
      return permissionsStr.split(',').map(p => p.trim()).filter(p => p.length > 0);
    };

    // Convert to user object
    const user = {
      id: userSheet.id as string,
      mobileNumber: userSheet.mobileNumber as string,
      name: userSheet.name as string,
      email: userSheet.email as string,
      role: userSheet.role as string,
      permissions: parsePermissions(userSheet.permissions as string),
      status: userSheet.status as string,
      createdBy: userSheet.createdBy as string,
      createdAt: userSheet.createdAt as string,
      updatedAt: userSheet.updatedAt as string,
      lastLogin: userSheet.lastLogin as string | null,
      notes: userSheet.notes as string
    };

    // Update last login
    await googleSheetsService.updateAuthorizedUser(user.id, {
      lastLogin: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Mobile authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}
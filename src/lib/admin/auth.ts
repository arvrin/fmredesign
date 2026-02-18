/**
 * Admin Authentication Utilities
 * Session is managed via HTTP-only cookies set by the server.
 * Client-side code validates by calling the session API endpoint.
 */

import { useState, useEffect, useCallback } from 'react';

export interface MobileUser {
  id: string;
  mobileNumber: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor' | 'viewer';
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  notes?: string;
}

export interface SessionUser {
  type: 'admin' | 'mobile_user';
  id?: string;
  name?: string;
  email?: string;
  role: string;
  permissions: string[];
}

export class AdminAuth {
  /**
   * Authenticate admin with password (Super Admin)
   * Server sets HTTP-only cookie on success.
   */
  static async authenticate(password: string): Promise<boolean> {
    try {
      const response = await fetch('/api/admin/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Password authentication error:', error);
      return false;
    }
  }

  /**
   * Authenticate admin with mobile number
   * Server sets HTTP-only cookie on success.
   */
  static async authenticateWithMobile(mobileNumber: string): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
    try {
      const response = await fetch('/api/admin/auth/mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });

      const result = await response.json();

      if (result.success && result.user) {
        return {
          success: true,
          user: {
            type: 'mobile_user',
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            permissions: result.user.permissions || [],
          },
        };
      }

      return { success: false, error: result.error || 'Authentication failed' };
    } catch (error) {
      console.error('Mobile authentication error:', error);
      return { success: false, error: 'Authentication failed. Please try again.' };
    }
  }

  /**
   * Validate session by calling the server-side session endpoint.
   * The server checks the HTTP-only cookie.
   */
  static async validateSession(): Promise<{ authenticated: boolean; user?: SessionUser }> {
    try {
      const response = await fetch('/api/admin/auth/session', {
        credentials: 'same-origin',
      });

      if (!response.ok) {
        return { authenticated: false };
      }

      const data = await response.json();
      return {
        authenticated: data.authenticated === true,
        user: data.user,
      };
    } catch {
      return { authenticated: false };
    }
  }

  /**
   * Logout admin — clears session cookie server-side.
   */
  static async logout(): Promise<void> {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(user: SessionUser | null, permission: string): boolean {
    if (!user) return false;

    if (user.type === 'admin' || user.role === 'super_admin') return true;
    if (user.permissions.includes('full_access')) return true;
    if (user.permissions.includes(permission)) return true;

    const category = permission.split('.')[0];
    if (user.permissions.includes(`${category}.*`)) return true;

    return false;
  }

  /**
   * Check if user is super admin
   */
  static isSuperAdmin(user: SessionUser | null): boolean {
    return user?.type === 'admin' || user?.role === 'super_admin' || false;
  }
}

/**
 * React hook for admin authentication
 */
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);

  const checkSession = useCallback(async () => {
    const result = await AdminAuth.validateSession();
    setIsAuthenticated(result.authenticated);
    setCurrentUser(result.user || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkSession();
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [checkSession]);

  const login = async (password: string): Promise<boolean> => {
    const success = await AdminAuth.authenticate(password);
    if (success) {
      await checkSession();
    }
    return success;
  };

  const loginWithMobile = async (mobileNumber: string): Promise<{ success: boolean; error?: string }> => {
    const result = await AdminAuth.authenticateWithMobile(mobileNumber);
    if (result.success) {
      await checkSession();
    }
    return result;
  };

  const logout = async () => {
    await AdminAuth.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    return AdminAuth.hasPermission(currentUser, permission);
  };

  const isSuperAdmin = (): boolean => {
    return AdminAuth.isSuperAdmin(currentUser);
  };

  const getUserRole = (): string => {
    if (!currentUser) return 'none';
    return currentUser.role || 'viewer';
  };

  return {
    isAuthenticated,
    loading,
    currentUser,
    login,
    loginWithMobile,
    logout,
    checkSession,
    hasPermission,
    isSuperAdmin,
    getUserRole,
  };
}

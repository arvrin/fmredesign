/**
 * Admin Authentication Utilities
 * Multi-level authentication for admin dashboard (Password + Mobile)
 */

import { useState, useEffect } from 'react';

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

export interface AdminSession {
  isAuthenticated: boolean;
  timestamp: number;
  expiresAt: number;
  authMethod: 'password' | 'mobile';
  user?: {
    type: 'admin' | 'mobile_user';
    data: MobileUser | null;
  };
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "FreakingMinds2024!";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_KEY = "fm_admin_session";

export class AdminAuth {
  /**
   * Authenticate admin with password (Super Admin)
   */
  static authenticate(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      const session: AdminSession = {
        isAuthenticated: true,
        timestamp: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION,
        authMethod: 'password',
        user: {
          type: 'admin',
          data: null
        }
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
      
      return true;
    }
    return false;
  }

  /**
   * Authenticate admin with mobile number
   */
  static async authenticateWithMobile(mobileNumber: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/admin/auth/mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber }),
      });

      const result = await response.json();
      
      if (result.success && result.user) {
        const session: AdminSession = {
          isAuthenticated: true,
          timestamp: Date.now(),
          expiresAt: Date.now() + SESSION_DURATION,
          authMethod: 'mobile',
          user: {
            type: 'mobile_user',
            data: result.user
          }
        };
        
        if (typeof window !== 'undefined') {
          localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
        
        return { success: true };
      }
      
      return { success: false, error: result.error || 'Authentication failed' };
    } catch (error) {
      console.error('Mobile authentication error:', error);
      return { success: false, error: 'Authentication failed. Please try again.' };
    }
  }

  /**
   * Check if current session is valid
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return false;
      
      const session: AdminSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.logout();
        return false;
      }
      
      return session.isAuthenticated;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get current session data
   */
  static getSession(): AdminSession | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return null;
      
      const session: AdminSession = JSON.parse(sessionData);
      
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Logout admin and clear session
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  /**
   * Extend current session
   */
  static extendSession(): boolean {
    const session = this.getSession();
    if (!session) return false;
    
    const updatedSession: AdminSession = {
      ...session,
      expiresAt: Date.now() + SESSION_DURATION,
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
    }
    
    return true;
  }

  /**
   * Get current user information
   */
  static getCurrentUser(): { 
    authMethod: 'password' | 'mobile'; 
    isAdmin: boolean; 
    user: MobileUser | null;
    permissions: string[];
  } | null {
    const session = this.getSession();
    if (!session) return null;

    if (session.authMethod === 'password') {
      return {
        authMethod: 'password',
        isAdmin: true,
        user: null,
        permissions: ['full_access']
      };
    } else if (session.authMethod === 'mobile' && session.user?.data) {
      return {
        authMethod: 'mobile',
        isAdmin: session.user.data.role === 'admin',
        user: session.user.data,
        permissions: session.user.data.permissions
      };
    }

    return null;
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(permission: string): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    // Super admin (password auth) has all permissions
    if (currentUser.authMethod === 'password') {
      return true;
    }

    // Mobile users check permissions
    if (currentUser.user) {
      const userPermissions = currentUser.user.permissions;
      
      // Super admin access via mobile
      if (currentUser.user.role === 'admin' || userPermissions.includes('full_access')) {
        return true;
      }
      
      // Direct permission check
      if (userPermissions.includes(permission)) {
        return true;
      }
      
      // Category-level permissions (e.g., content.* for all content permissions)
      const permissionCategory = permission.split('.')[0];
      if (userPermissions.includes(`${permissionCategory}.*`)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if user is super admin
   */
  static isSuperAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.authMethod === 'password' || false;
  }

  /**
   * Get user role
   */
  static getUserRole(): string {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return 'none';

    if (currentUser.authMethod === 'password') {
      return 'super_admin';
    }

    return currentUser.user?.role || 'viewer';
  }
}

/**
 * React hook for admin authentication
 */
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    authMethod: 'password' | 'mobile';
    isAdmin: boolean;
    user: MobileUser | null;
    permissions: string[];
  } | null>(null);

  useEffect(() => {
    const authenticated = AdminAuth.isAuthenticated();
    const user = AdminAuth.getCurrentUser();
    setIsAuthenticated(authenticated);
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = (password: string): boolean => {
    const success = AdminAuth.authenticate(password);
    if (success) {
      const user = AdminAuth.getCurrentUser();
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
    return success;
  };

  const loginWithMobile = async (mobileNumber: string): Promise<{ success: boolean; error?: string }> => {
    const result = await AdminAuth.authenticateWithMobile(mobileNumber);
    if (result.success) {
      const user = AdminAuth.getCurrentUser();
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
    return result;
  };

  const logout = () => {
    AdminAuth.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const extendSession = () => {
    return AdminAuth.extendSession();
  };

  const hasPermission = (permission: string): boolean => {
    return AdminAuth.hasPermission(permission);
  };

  const isSuperAdmin = (): boolean => {
    return AdminAuth.isSuperAdmin();
  };

  const getUserRole = (): string => {
    return AdminAuth.getUserRole();
  };

  return {
    isAuthenticated,
    loading,
    currentUser,
    login,
    loginWithMobile,
    logout,
    extendSession,
    hasPermission,
    isSuperAdmin,
    getUserRole,
  };
}


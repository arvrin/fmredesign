/**
 * Admin Authentication Utilities
 * Simple password-based authentication for admin dashboard
 */

import { useState, useEffect } from 'react';

export interface AdminSession {
  isAuthenticated: boolean;
  timestamp: number;
  expiresAt: number;
}

const ADMIN_PASSWORD = "freakingminds2025";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_KEY = "fm_admin_session";

export class AdminAuth {
  /**
   * Authenticate admin with password
   */
  static authenticate(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      const session: AdminSession = {
        isAuthenticated: true,
        timestamp: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION,
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
      
      return true;
    }
    return false;
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
}

/**
 * React hook for admin authentication
 */
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(AdminAuth.isAuthenticated());
    setLoading(false);
  }, []);

  const login = (password: string): boolean => {
    const success = AdminAuth.authenticate(password);
    if (success) {
      setIsAuthenticated(true);
    }
    return success;
  };

  const logout = () => {
    AdminAuth.logout();
    setIsAuthenticated(false);
  };

  const extendSession = () => {
    return AdminAuth.extendSession();
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    extendSession,
  };
}


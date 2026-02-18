import { describe, it, expect } from 'vitest';
import { AdminAuth, type SessionUser } from '../auth';

describe('AdminAuth.hasPermission', () => {
  const superAdmin: SessionUser = {
    type: 'admin',
    role: 'super_admin',
    permissions: ['full_access'],
  };

  const manager: SessionUser = {
    type: 'mobile_user',
    id: 'user-1',
    name: 'Manager',
    role: 'manager',
    permissions: ['clients.*', 'projects.view', 'projects.edit'],
  };

  const viewer: SessionUser = {
    type: 'mobile_user',
    id: 'user-2',
    name: 'Viewer',
    role: 'viewer',
    permissions: ['clients.view'],
  };

  it('returns false for null user', () => {
    expect(AdminAuth.hasPermission(null, 'clients.view')).toBe(false);
  });

  it('grants all permissions to admin type', () => {
    expect(AdminAuth.hasPermission(superAdmin, 'clients.view')).toBe(true);
    expect(AdminAuth.hasPermission(superAdmin, 'anything.delete')).toBe(true);
  });

  it('grants all permissions to super_admin role', () => {
    const user: SessionUser = {
      type: 'mobile_user',
      role: 'super_admin',
      permissions: [],
    };
    expect(AdminAuth.hasPermission(user, 'anything')).toBe(true);
  });

  it('grants all permissions to full_access permission', () => {
    const user: SessionUser = {
      type: 'mobile_user',
      role: 'editor',
      permissions: ['full_access'],
    };
    expect(AdminAuth.hasPermission(user, 'anything')).toBe(true);
  });

  it('checks exact permission match', () => {
    expect(AdminAuth.hasPermission(viewer, 'clients.view')).toBe(true);
    expect(AdminAuth.hasPermission(viewer, 'clients.edit')).toBe(false);
  });

  it('supports wildcard category permissions', () => {
    expect(AdminAuth.hasPermission(manager, 'clients.view')).toBe(true);
    expect(AdminAuth.hasPermission(manager, 'clients.edit')).toBe(true);
    expect(AdminAuth.hasPermission(manager, 'clients.delete')).toBe(true);
  });

  it('checks specific permissions without wildcard', () => {
    expect(AdminAuth.hasPermission(manager, 'projects.view')).toBe(true);
    expect(AdminAuth.hasPermission(manager, 'projects.edit')).toBe(true);
    expect(AdminAuth.hasPermission(manager, 'projects.delete')).toBe(false);
  });
});

describe('AdminAuth.isSuperAdmin', () => {
  it('returns false for null user', () => {
    expect(AdminAuth.isSuperAdmin(null)).toBe(false);
  });

  it('returns true for admin type', () => {
    expect(AdminAuth.isSuperAdmin({
      type: 'admin',
      role: 'super_admin',
      permissions: [],
    })).toBe(true);
  });

  it('returns true for super_admin role', () => {
    expect(AdminAuth.isSuperAdmin({
      type: 'mobile_user',
      role: 'super_admin',
      permissions: [],
    })).toBe(true);
  });

  it('returns false for regular roles', () => {
    expect(AdminAuth.isSuperAdmin({
      type: 'mobile_user',
      role: 'manager',
      permissions: ['full_access'],
    })).toBe(false);
  });
});

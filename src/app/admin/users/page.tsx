'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAdminAuth } from '@/lib/admin/auth';
import { ROLES } from '@/lib/admin/permissions';
import {
  DashboardButton,
  DashboardCard,
  CardContent,
} from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import {
  Plus,
  Edit3,
  Trash2,
  Shield,
  Phone,
  Mail,
  User,
  AlertTriangle,
  Check,
  X,
  Search,
} from 'lucide-react';
import { adminToast } from '@/lib/admin/toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

// Lazy-load modal — only shown on button click
const UserFormModal = dynamic(
  () => import('@/components/admin/UserFormModal').then(m => ({ default: m.UserFormModal })),
  { ssr: false }
);

interface AuthorizedUser {
  id: string;
  mobileNumber: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  notes?: string;
}

export default function UsersManagementPage() {
  const { isAuthenticated, hasPermission, isSuperAdmin, currentUser } = useAdminAuth();
  const [users, setUsers] = useState<AuthorizedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthorizedUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Check permissions
  const canManageUsers = hasPermission('users.write') || isSuperAdmin();
  const canDeleteUsers = hasPermission('users.delete') || isSuperAdmin();
  const canManagePermissions = hasPermission('users.permissions') || isSuperAdmin();

  useEffect(() => {
    if (isAuthenticated && hasPermission('users.read')) {
      loadUsers();
    }
  }, [isAuthenticated]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const result = await response.json();

      if (result.success) {
        const formattedUsers: AuthorizedUser[] = result.users.map((user: any) => ({
          id: user.id,
          mobileNumber: user.mobileNumber,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions ? user.permissions.split(',').map((p: string) => p.trim()).filter((p: string) => p.length > 0) : [],
          status: user.status as AuthorizedUser['status'],
          createdBy: user.createdBy,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLogin: user.lastLogin,
          notes: user.notes
        }));

        setUsers(formattedUsers);
      } else {
        console.error('Failed to load users:', result.error);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!canDeleteUsers) return;

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await loadUsers();
      } else {
        adminToast.error('Failed to delete user. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      adminToast.error('Error deleting user. Please try again.');
    }
  };

  const handleStatusChange = async (userId: string, newStatus: AuthorizedUser['status']) => {
    if (!canManageUsers) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          status: newStatus
        }),
      });

      const result = await response.json();

      if (result.success) {
        await loadUsers();
      } else {
        adminToast.error('Failed to update user status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      adminToast.error('Error updating user status. Please try again.');
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.mobileNumber.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Check permissions first
  if (!isAuthenticated || !hasPermission('users.read')) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <DashboardCard>
          <CardContent className="p-4 sm:p-6">
            <EmptyState
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Access Denied"
              description="You don't have permission to view user management."
            />
          </CardContent>
        </DashboardCard>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-16 rounded-xl" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <PageHeader
        title="User Management"
        icon={<Shield className="w-6 h-6" />}
        description="Manage authorized users and their permissions"
        actions={
          canManageUsers ? (
            <DashboardButton
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add User
            </DashboardButton>
          ) : undefined
        }
      />

      {/* Filters */}
      <DashboardCard>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fm-neutral-400" />
              <Input
                type="text"
                placeholder="Search by name, email, or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </Select>

            {/* Role Filter */}
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              {ROLES.map(role => (
                <option key={role.key} value={role.key}>{role.name}</option>
              ))}
            </Select>
          </div>
        </CardContent>
      </DashboardCard>

      {/* Users List */}
      <DashboardCard className="overflow-hidden">
        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={<User className="w-6 h-6" />}
            title="No users found"
            description={
              users.length === 0
                ? 'No authorized users have been added yet.'
                : 'No users match your current filters.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-fm-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-fm-neutral-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-fm-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-fm-magenta-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-fm-magenta-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-fm-neutral-900">{user.name}</div>
                          <div className="text-sm text-fm-neutral-500 flex flex-wrap items-center gap-2 sm:gap-4">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {user.mobileNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-fm-neutral-400" />
                        <span className="text-sm text-fm-neutral-900 capitalize">
                          {ROLES.find(r => r.key === user.role)?.name || user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <UserStatusBadge
                        status={user.status}
                        onChange={canManageUsers ? (status) => handleStatusChange(user.id, status) : undefined}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-fm-neutral-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {canManageUsers && (
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-1.5 text-fm-neutral-400 hover:text-fm-magenta-600 hover:bg-fm-magenta-50 rounded"
                            title="Edit user"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        {canDeleteUsers && (
                          <button
                            onClick={() => setDeleteConfirm(user.id)}
                            className="p-1.5 text-fm-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>

      {/* Modals */}
      {showAddModal && (
        <UserFormModal
          mode="create"
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadUsers();
          }}
          currentUserRole={currentUser?.role || 'super_admin'}
          canManagePermissions={canManagePermissions}
        />
      )}

      {editingUser && (
        <UserFormModal
          mode="edit"
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            loadUsers();
          }}
          currentUserRole={currentUser?.role || 'super_admin'}
          canManagePermissions={canManagePermissions}
        />
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteConfirm) handleDeleteUser(deleteConfirm);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}

// User Status Badge Component — this one has a special "onChange" dropdown behavior
// that StatusBadge from the shared component doesn't support, so we keep it local.
function UserStatusBadge({
  status,
  onChange
}: {
  status: AuthorizedUser['status'];
  onChange?: (status: AuthorizedUser['status']) => void;
}) {
  const statusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-800', icon: Check },
    inactive: { bg: 'bg-fm-neutral-100', text: 'text-fm-neutral-800', icon: X },
    suspended: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle }
  };

  const config = statusConfig[status];

  if (onChange) {
    return (
      <Select
        value={status}
        onChange={(e) => onChange(e.target.value as AuthorizedUser['status'])}
        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${config.bg} ${config.text} cursor-pointer`}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="suspended">Suspended</option>
      </Select>
    );
  }

  return (
    <StatusBadge status={status} />
  );
}

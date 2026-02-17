'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth, MobileUser } from '@/lib/admin/auth';
import { ROLES, Role } from '@/lib/admin/permissions';
import { Button } from '@/design-system/components/primitives/Button';
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
  Filter
} from 'lucide-react';
import { adminToast } from '@/lib/admin/toast';

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
    
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

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
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
          <p className="text-red-600">You don't have permission to view user management.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-fm-neutral-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-fm-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fm-neutral-900">User Management</h1>
          <p className="text-fm-neutral-600 mt-1">Manage authorized users and their permissions</p>
        </div>
        
        {canManageUsers && (
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fm-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
          >
            <option value="all">All Roles</option>
            {ROLES.map(role => (
              <option key={role.key} value={role.key}>{role.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-12 h-12 text-fm-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-fm-neutral-900 mb-2">No users found</h3>
            <p className="text-fm-neutral-500">
              {users.length === 0 
                ? 'No authorized users have been added yet.'
                : 'No users match your current filters.'}
            </p>
          </div>
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
                          <div className="text-sm text-fm-neutral-500 flex items-center gap-4">
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
                      <StatusBadge 
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
                            onClick={() => handleDeleteUser(user.id)}
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
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadUsers();
          }}
          currentUserRole={currentUser?.user?.data?.role || 'super_admin'}
          canManagePermissions={canManagePermissions}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            loadUsers();
          }}
          currentUserRole={currentUser?.user?.data?.role || 'super_admin'}
          canManagePermissions={canManagePermissions}
        />
      )}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ 
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
  const Icon = config.icon;

  if (onChange) {
    return (
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as AuthorizedUser['status'])}
        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${config.bg} ${config.text} cursor-pointer`}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="suspended">Suspended</option>
      </select>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Add User Modal Component
function AddUserModal({
  onClose,
  onSuccess,
  currentUserRole,
  canManagePermissions
}: {
  onClose: () => void;
  onSuccess: () => void;
  currentUserRole: string;
  canManagePermissions: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    role: 'viewer',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get assignable roles based on current user role
  const getAssignableRoles = (currentRole: string): Role[] => {
    const currentRoleObj = ROLES.find(r => r.key === currentRole);
    if (!currentRoleObj) return [];

    // Super admin can assign all roles  
    if (currentRole === 'super_admin') {
      return ROLES;
    }

    // Can only assign roles with lower hierarchy
    return ROLES.filter(role => role.hierarchy < currentRoleObj.hierarchy);
  };

  const availableRoles = getAssignableRoles(currentUserRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          role: formData.role,
          notes: formData.notes
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Failed to add user. Please try again.');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Error adding user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Add New User</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-fm-neutral-400 hover:text-fm-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
            />
          </div>

          {canManagePermissions && (
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
                Role *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
              >
                {availableRoles.map(role => (
                  <option key={role.key} value={role.key}>
                    {role.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-fm-neutral-500 mt-1">
                {ROLES.find(r => r.key === formData.role)?.description}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Adding...' : 'Add User'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit User Modal (similar to Add User Modal but for editing)
function EditUserModal({
  user,
  onClose,
  onSuccess,
  currentUserRole,
  canManagePermissions
}: {
  user: AuthorizedUser;
  onClose: () => void;
  onSuccess: () => void;
  currentUserRole: string;
  canManagePermissions: boolean;
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: user.role,
    notes: user.notes || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get assignable roles based on current user role
  const getAssignableRoles = (currentRole: string): Role[] => {
    const currentRoleObj = ROLES.find(r => r.key === currentRole);
    if (!currentRoleObj) return [];

    // Super admin can assign all roles  
    if (currentRole === 'super_admin') {
      return ROLES;
    }

    // Can only assign roles with lower hierarchy
    return ROLES.filter(role => role.hierarchy < currentRoleObj.hierarchy);
  };

  const availableRoles = getAssignableRoles(currentUserRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          role: formData.role,
          notes: formData.notes
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || 'Failed to update user. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error updating user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit User</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-fm-neutral-400 hover:text-fm-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              required
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
            />
          </div>

          {canManagePermissions && (
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
                Role *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
              >
                {availableRoles.map(role => (
                  <option key={role.key} value={role.key}>
                    {role.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-fm-neutral-500 mt-1">
                {ROLES.find(r => r.key === formData.role)?.description}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Updating...' : 'Update User'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
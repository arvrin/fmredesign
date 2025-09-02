/**
 * Admin & Permissions System Component
 * Comprehensive role-based access control and system administration
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Users,
  Shield,
  Settings,
  Key,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Database,
  Server,
  Zap,
  Mail,
  Bell,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  HardDrive,
  Cpu,
  BarChart3,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Minus,
  Crown,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'editor' | 'viewer';
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  avatar?: string;
  department: string;
  clientAccess: string[]; // client IDs they can access
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface SystemMetric {
  id: string;
  name: string;
  value: string | number;
  status: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
  trend?: 'up' | 'down' | 'stable';
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failed';
}

export function AdminSystem() {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'system' | 'audit'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load sample admin users
    const sampleUsers: AdminUser[] = [
      {
        id: 'user-001',
        name: 'Aaryavar Sharma',
        email: 'aaryavar@freakingminds.in',
        role: 'super_admin',
        permissions: ['all'],
        status: 'active',
        lastLogin: '2024-08-22T09:30:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        department: 'Leadership',
        clientAccess: ['all']
      },
      {
        id: 'user-002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@freakingminds.in',
        role: 'admin',
        permissions: ['user_management', 'client_management', 'analytics_view', 'system_settings'],
        status: 'active',
        lastLogin: '2024-08-22T08:15:00Z',
        createdAt: '2024-02-20T14:30:00Z',
        department: 'Operations',
        clientAccess: ['client-001', 'client-002', 'client-003']
      },
      {
        id: 'user-003',
        name: 'Mike Chen',
        email: 'mike.chen@freakingminds.in',
        role: 'manager',
        permissions: ['client_management', 'campaign_management', 'analytics_view'],
        status: 'active',
        lastLogin: '2024-08-21T16:45:00Z',
        createdAt: '2024-03-10T11:20:00Z',
        department: 'Account Management',
        clientAccess: ['client-001', 'client-004']
      },
      {
        id: 'user-004',
        name: 'Emma Wilson',
        email: 'emma.wilson@freakingminds.in',
        role: 'editor',
        permissions: ['content_management', 'campaign_edit'],
        status: 'active',
        lastLogin: '2024-08-22T07:20:00Z',
        createdAt: '2024-04-05T09:15:00Z',
        department: 'Creative',
        clientAccess: ['client-002', 'client-005']
      },
      {
        id: 'user-005',
        name: 'David Rodriguez',
        email: 'david.rodriguez@freakingminds.in',
        role: 'viewer',
        permissions: ['analytics_view', 'reports_view'],
        status: 'inactive',
        lastLogin: '2024-08-15T13:30:00Z',
        createdAt: '2024-05-12T15:45:00Z',
        department: 'Analytics',
        clientAccess: ['client-003']
      }
    ];

    // Load sample permissions
    const samplePermissions: Permission[] = [
      {
        id: 'perm-001',
        name: 'user_management',
        description: 'Create, edit, and delete user accounts',
        category: 'User Management',
        riskLevel: 'high'
      },
      {
        id: 'perm-002',
        name: 'client_management',
        description: 'Full access to client data and profiles',
        category: 'Client Management',
        riskLevel: 'medium'
      },
      {
        id: 'perm-003',
        name: 'campaign_management',
        description: 'Create and manage marketing campaigns',
        category: 'Campaign Management',
        riskLevel: 'medium'
      },
      {
        id: 'perm-004',
        name: 'analytics_view',
        description: 'View analytics and performance data',
        category: 'Analytics',
        riskLevel: 'low'
      },
      {
        id: 'perm-005',
        name: 'system_settings',
        description: 'Modify system configuration and settings',
        category: 'System Administration',
        riskLevel: 'high'
      },
      {
        id: 'perm-006',
        name: 'financial_data',
        description: 'Access to financial reports and billing data',
        category: 'Financial',
        riskLevel: 'high'
      }
    ];

    // Load sample system metrics
    const sampleSystemMetrics: SystemMetric[] = [
      {
        id: 'metric-001',
        name: 'Server Status',
        value: 'Online',
        status: 'healthy',
        lastUpdated: '2024-08-22T09:45:00Z',
        trend: 'stable'
      },
      {
        id: 'metric-002',
        name: 'Database Connection',
        value: 'Connected',
        status: 'healthy',
        lastUpdated: '2024-08-22T09:45:00Z',
        trend: 'stable'
      },
      {
        id: 'metric-003',
        name: 'Active Users',
        value: 24,
        status: 'healthy',
        lastUpdated: '2024-08-22T09:45:00Z',
        trend: 'up'
      },
      {
        id: 'metric-004',
        name: 'Memory Usage',
        value: '67%',
        status: 'warning',
        lastUpdated: '2024-08-22T09:45:00Z',
        trend: 'up'
      },
      {
        id: 'metric-005',
        name: 'API Response Time',
        value: '245ms',
        status: 'healthy',
        lastUpdated: '2024-08-22T09:45:00Z',
        trend: 'stable'
      },
      {
        id: 'metric-006',
        name: 'Storage Usage',
        value: '89%',
        status: 'critical',
        lastUpdated: '2024-08-22T09:45:00Z',
        trend: 'up'
      }
    ];

    // Load sample audit logs
    const sampleAuditLogs: AuditLog[] = [
      {
        id: 'audit-001',
        userId: 'user-002',
        userName: 'Sarah Johnson',
        action: 'User Login',
        resource: 'Authentication System',
        timestamp: '2024-08-22T08:15:00Z',
        ipAddress: '192.168.1.101',
        userAgent: 'Chrome 91.0',
        result: 'success'
      },
      {
        id: 'audit-002',
        userId: 'user-003',
        userName: 'Mike Chen',
        action: 'Client Data Access',
        resource: 'Client Profile: TechStart Inc',
        timestamp: '2024-08-22T08:30:00Z',
        ipAddress: '192.168.1.102',
        userAgent: 'Firefox 89.0',
        result: 'success'
      },
      {
        id: 'audit-003',
        userId: 'user-004',
        userName: 'Emma Wilson',
        action: 'Campaign Update',
        resource: 'Social Media Campaign #SMC-001',
        timestamp: '2024-08-22T09:15:00Z',
        ipAddress: '192.168.1.103',
        userAgent: 'Safari 14.1',
        result: 'success'
      },
      {
        id: 'audit-004',
        userId: 'user-005',
        userName: 'David Rodriguez',
        action: 'Permission Denied',
        resource: 'Financial Reports',
        timestamp: '2024-08-22T09:20:00Z',
        ipAddress: '192.168.1.104',
        userAgent: 'Chrome 91.0',
        result: 'failed'
      }
    ];

    setUsers(sampleUsers);
    setPermissions(samplePermissions);
    setSystemMetrics(sampleSystemMetrics);
    setAuditLogs(sampleAuditLogs);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4 text-purple-600" />;
      case 'admin': return <ShieldCheck className="h-4 w-4 text-blue-600" />;
      case 'manager': return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'editor': return <Edit className="h-4 w-4 text-orange-600" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-600" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      manager: 'bg-green-100 text-green-800',
      editor: 'bg-orange-100 text-orange-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role as keyof typeof colors]}`}>
        {role.replace('_', ' ')}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    );
  };

  const getMetricStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const renderUsersTab = () => (
    <div className="space-y-6">
      {/* Users Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-fm-neutral-900">User Management</h3>
          <p className="text-fm-neutral-600 mt-1">Manage team members and their access levels</p>
        </div>
        <Button size="sm" icon={<UserPlus className="h-4 w-4" />} onClick={() => setShowUserModal(true)}>
          Add User
        </Button>
      </div>

      {/* Users Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 border border-fm-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-fm-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-fm-neutral-200">
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
                  Department
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-fm-magenta-100 rounded-full flex items-center justify-center">
                        <span className="text-fm-magenta-700 font-medium">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-fm-neutral-900">{user.name}</div>
                        <div className="text-sm text-fm-neutral-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      {getRoleBadge(user.role)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-fm-neutral-900">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-fm-neutral-500">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.role !== 'super_admin' && (
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-fm-neutral-900">System Status</h3>
        <p className="text-fm-neutral-600 mt-1">Monitor system health and performance metrics</p>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemMetrics.map((metric) => (
          <div key={metric.id} className="bg-white rounded-lg border border-fm-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-fm-neutral-900">{metric.name}</h4>
              {getMetricStatusIcon(metric.status)}
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-fm-neutral-900">
                {metric.value}
              </div>
              <div className="text-sm text-fm-neutral-500">
                Updated {new Date(metric.lastUpdated).toLocaleTimeString()}
              </div>
              {metric.trend && (
                <div className="flex items-center space-x-1">
                  {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                  {metric.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />}
                  {metric.trend === 'stable' && <Activity className="h-4 w-4 text-gray-600" />}
                  <span className={`text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* System Actions */}
      <div className="bg-white rounded-lg border border-fm-neutral-200 p-6">
        <h4 className="font-semibold text-fm-neutral-900 mb-4">System Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="justify-start">
            <RefreshCw className="h-4 w-4 mr-2" />
            Restart Services
          </Button>
          <Button variant="outline" className="justify-start">
            <Database className="h-4 w-4 mr-2" />
            Backup Database
          </Button>
          <Button variant="outline" className="justify-start">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline" className="justify-start">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAuditTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-fm-neutral-900">Audit Logs</h3>
        <p className="text-fm-neutral-600 mt-1">Track user activities and system events</p>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg border border-fm-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-fm-neutral-200">
            <thead className="bg-fm-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-fm-neutral-200">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-fm-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-fm-neutral-900">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-fm-neutral-900">
                    {log.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-fm-neutral-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-fm-neutral-500">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-fm-neutral-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">Admin & Permissions System</h2>
            <p className="text-fm-neutral-600 mt-1">Comprehensive system administration and access control</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button size="sm" variant="outline" icon={<Download className="h-4 w-4" />}>
              Export Report
            </Button>
            <Button size="sm" icon={<Settings className="h-4 w-4" />}>
              System Settings
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-8 mt-6 border-b border-fm-neutral-200">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'permissions', label: 'Permissions', icon: Shield },
            { id: 'system', label: 'System', icon: Server },
            { id: 'audit', label: 'Audit Logs', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-fm-magenta-500 text-fm-magenta-600'
                    : 'border-transparent text-fm-neutral-600 hover:text-fm-neutral-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'system' && renderSystemTab()}
        {activeTab === 'audit' && renderAuditTab()}
        {activeTab === 'permissions' && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-fm-neutral-400 mx-auto mb-4" />
            <h4 className="font-semibold text-fm-neutral-900 mb-2">Permissions Management</h4>
            <p className="text-fm-neutral-600">
              Advanced role-based permissions system coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
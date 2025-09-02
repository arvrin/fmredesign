'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon,
  User, 
  Mail, 
  Phone, 
  Globe,
  Bell, 
  Shield, 
  Eye,
  Palette,
  Key,
  Building,
  CreditCard,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Camera,
  Upload,
  Smartphone,
  Clock,
  FileText,
  Users,
  Database,
  Monitor,
  Lock
} from 'lucide-react';
import { 
  DashboardButton, 
  DashboardCard, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/design-system';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface AdminSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar_url?: string;
  };
  general: {
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    language: string;
    currency: string;
  };
  notifications: {
    email_notifications: boolean;
    browser_notifications: boolean;
    mobile_notifications: boolean;
    security_alerts: boolean;
    lead_updates: boolean;
    client_updates: boolean;
    system_updates: boolean;
    marketing_emails: boolean;
  };
  security: {
    two_factor_enabled: boolean;
    session_timeout: number;
    password_expiry: number;
    login_alerts: boolean;
    audit_logs: boolean;
  };
  privacy: {
    data_retention: number;
    analytics_tracking: boolean;
    data_sharing: boolean;
    cookie_consent: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    sidebar_collapsed: boolean;
    compact_mode: boolean;
    animations_enabled: boolean;
  };
  integrations: {
    google_sheets: boolean;
    google_analytics: boolean;
    email_service: boolean;
    payment_gateway: boolean;
    crm_integration: boolean;
  };
  billing: {
    plan: string;
    usage: {
      leads: number;
      clients: number;
      storage: number;
    };
    limits: {
      max_leads: number;
      max_clients: number;
      max_storage: number;
    };
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'general' | 'notifications' | 'security' | 'privacy' | 'appearance' | 'integrations' | 'billing'>('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', content: string } | null>(null);

  const [settings, setSettings] = useState<AdminSettings>({
    profile: {
      name: 'Admin User',
      email: 'admin@freakingminds.in',
      phone: '+91 98765 43210',
      role: 'Super Admin',
      avatar_url: ''
    },
    general: {
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      language: 'en',
      currency: 'INR'
    },
    notifications: {
      email_notifications: true,
      browser_notifications: true,
      mobile_notifications: true,
      security_alerts: true,
      lead_updates: true,
      client_updates: true,
      system_updates: true,
      marketing_emails: false
    },
    security: {
      two_factor_enabled: false,
      session_timeout: 8,
      password_expiry: 90,
      login_alerts: true,
      audit_logs: true
    },
    privacy: {
      data_retention: 365,
      analytics_tracking: true,
      data_sharing: false,
      cookie_consent: true
    },
    appearance: {
      theme: 'light',
      sidebar_collapsed: false,
      compact_mode: false,
      animations_enabled: true
    },
    integrations: {
      google_sheets: true,
      google_analytics: true,
      email_service: true,
      payment_gateway: false,
      crm_integration: false
    },
    billing: {
      plan: 'Professional',
      usage: {
        leads: 142,
        clients: 28,
        storage: 2.4
      },
      limits: {
        max_leads: 1000,
        max_clients: 50,
        max_storage: 10
      }
    }
  });

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('freaking-minds-admin-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
      }
    }
  }, []);

  const saveSettings = async (section: keyof AdminSettings, data: any) => {
    setSaving(true);
    setMessage(null);

    try {
      const newSettings = {
        ...settings,
        [section]: { ...settings[section], ...data }
      };

      setSettings(newSettings);
      localStorage.setItem('freaking-minds-admin-settings', JSON.stringify(newSettings));

      setMessage({
        type: 'success',
        content: 'Settings saved successfully!'
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        content: 'Failed to save settings'
      });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'billing', label: 'Billing & Usage', icon: CreditCard }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 bg-clip-text text-transparent">Settings</h1>
          <p className="text-gray-600 font-medium mt-2">
            Manage your admin panel preferences and account settings
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <DashboardButton 
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </DashboardButton>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={cn(
          "p-4 rounded-lg border flex items-center gap-2",
          message.type === 'success' && "bg-green-50 border-green-200 text-green-800",
          message.type === 'error' && "bg-red-50 border-red-200 text-red-800",
          message.type === 'info' && "bg-blue-50 border-blue-200 text-blue-800"
        )}>
          {message.type === 'success' && <CheckCircle className="h-4 w-4" />}
          {message.type === 'error' && <AlertTriangle className="h-4 w-4" />}
          {message.type === 'info' && <Info className="h-4 w-4" />}
          {message.content}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <DashboardCard variant="admin">
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all",
                      activeTab === tab.id
                        ? "bg-fm-magenta-700 text-white"
                        : "text-fm-neutral-600 hover:text-fm-neutral-900 hover:bg-fm-neutral-100"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </DashboardCard>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <DashboardCard variant="admin">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 bg-fm-magenta-700 rounded-full flex items-center justify-center">
                    {settings.profile.avatar_url ? (
                      <img 
                        src={settings.profile.avatar_url} 
                        alt="Avatar" 
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-fm-neutral-900">Profile Photo</h3>
                    <div className="flex gap-2">
                      <DashboardButton size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </DashboardButton>
                      <DashboardButton size="sm" variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </DashboardButton>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={settings.profile.name}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      profile: { ...prev.profile, name: e.target.value }
                    }))}
                    leftIcon={<User className="h-4 w-4" />}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      profile: { ...prev.profile, email: e.target.value }
                    }))}
                    leftIcon={<Mail className="h-4 w-4" />}
                    required
                  />

                  <Input
                    label="Phone Number"
                    value={settings.profile.phone}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      profile: { ...prev.profile, phone: e.target.value }
                    }))}
                    leftIcon={<Phone className="h-4 w-4" />}
                    placeholder="+91 98765 43210"
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-fm-neutral-900">Role</label>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-fm-neutral-500" />
                      <Badge variant="secondary">{settings.profile.role}</Badge>
                    </div>
                  </div>
                </div>

                <DashboardButton 
                  variant="admin" 
                  onClick={() => saveSettings('profile', settings.profile)} 
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </DashboardButton>
              </CardContent>
            </DashboardCard>
          )}

          {activeTab === 'general' && (
            <DashboardCard variant="admin">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your general preferences and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-fm-neutral-900">Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => saveSettings('general', { timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="Asia/Mumbai">Asia/Mumbai (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-fm-neutral-900">Date Format</label>
                    <select
                      value={settings.general.dateFormat}
                      onChange={(e) => saveSettings('general', { dateFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-fm-neutral-900">Time Format</label>
                    <select
                      value={settings.general.timeFormat}
                      onChange={(e) => saveSettings('general', { timeFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
                    >
                      <option value="12h">12 Hour (AM/PM)</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-fm-neutral-900">Currency</label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => saveSettings('general', { currency: e.target.value })}
                      className="w-full px-3 py-2 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </DashboardCard>
          )}

          {activeTab === 'notifications' && (
            <DashboardCard variant="admin">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Choose how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <Toggle
                    key={key}
                    checked={value}
                    onChange={(checked) => saveSettings('notifications', { [key]: checked })}
                    label={key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    description={
                      key === 'email_notifications' ? 'Receive notifications via email' :
                      key === 'browser_notifications' ? 'Show browser push notifications' :
                      key === 'mobile_notifications' ? 'Send notifications to mobile app' :
                      key === 'security_alerts' ? 'Important security notifications' :
                      key === 'lead_updates' ? 'Updates about new leads and inquiries' :
                      key === 'client_updates' ? 'Client-related notifications' :
                      key === 'system_updates' ? 'System maintenance and updates' :
                      key === 'marketing_emails' ? 'Marketing emails and newsletters' : ''
                    }
                  />
                ))}
              </CardContent>
            </DashboardCard>
          )}

          {activeTab === 'security' && (
            <DashboardCard variant="admin">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password Section */}
                <div className="p-4 bg-fm-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-fm-neutral-600" />
                      <div>
                        <p className="font-medium text-fm-neutral-900">Password</p>
                        <p className="text-sm text-fm-neutral-600">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <DashboardButton variant="outline" size="sm">
                      Change Password
                    </DashboardButton>
                  </div>
                </div>

                {/* Security Toggles */}
                <div className="space-y-4">
                  <Toggle
                    checked={settings.security.two_factor_enabled}
                    onChange={(checked) => saveSettings('security', { two_factor_enabled: checked })}
                    label="Two-Factor Authentication"
                    description="Add an extra layer of security to your account"
                  />

                  <Toggle
                    checked={settings.security.login_alerts}
                    onChange={(checked) => saveSettings('security', { login_alerts: checked })}
                    label="Login Alerts"
                    description="Get notified of new login attempts"
                  />

                  <Toggle
                    checked={settings.security.audit_logs}
                    onChange={(checked) => saveSettings('security', { audit_logs: checked })}
                    label="Audit Logs"
                    description="Keep detailed logs of admin actions"
                  />
                </div>

                {/* Session Timeout */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-fm-neutral-900">
                    Session Timeout (hours)
                  </label>
                  <select
                    value={settings.security.session_timeout}
                    onChange={(e) => saveSettings('security', { session_timeout: parseInt(e.target.value) })}
                    className="w-full max-w-xs px-3 py-2 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
                  >
                    <option value="1">1 hour</option>
                    <option value="4">4 hours</option>
                    <option value="8">8 hours</option>
                    <option value="24">24 hours</option>
                    <option value="168">1 week</option>
                  </select>
                </div>
              </CardContent>
            </DashboardCard>
          )}

          {activeTab === 'appearance' && (
            <DashboardCard variant="admin">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-fm-neutral-900">Theme</label>
                  <select
                    value={settings.appearance.theme}
                    onChange={(e) => saveSettings('appearance', { theme: e.target.value })}
                    className="w-full max-w-xs px-3 py-2 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <Toggle
                    checked={settings.appearance.sidebar_collapsed}
                    onChange={(checked) => saveSettings('appearance', { sidebar_collapsed: checked })}
                    label="Collapsed Sidebar"
                    description="Keep sidebar collapsed by default"
                  />

                  <Toggle
                    checked={settings.appearance.compact_mode}
                    onChange={(checked) => saveSettings('appearance', { compact_mode: checked })}
                    label="Compact Mode"
                    description="Use more compact spacing"
                  />

                  <Toggle
                    checked={settings.appearance.animations_enabled}
                    onChange={(checked) => saveSettings('appearance', { animations_enabled: checked })}
                    label="Animations"
                    description="Enable smooth animations and transitions"
                  />
                </div>
              </CardContent>
            </DashboardCard>
          )}

          {activeTab === 'integrations' && (
            <DashboardCard variant="admin">
              <CardHeader>
                <CardTitle>Platform Integrations</CardTitle>
                <CardDescription>
                  Manage your third-party service connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.integrations).map(([key, connected]) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-fm-neutral-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        key === 'google_sheets' && "bg-green-100 text-green-600",
                        key === 'google_analytics' && "bg-orange-100 text-orange-600",
                        key === 'email_service' && "bg-blue-100 text-blue-600",
                        key === 'payment_gateway' && "bg-purple-100 text-purple-600",
                        key === 'crm_integration' && "bg-indigo-100 text-indigo-600"
                      )}>
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-fm-neutral-900 capitalize">
                          {key.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-fm-neutral-600">
                          {connected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <DashboardButton 
                      variant={connected ? "outline" : "admin"}
                      size="sm"
                      onClick={() => saveSettings('integrations', { [key]: !connected })}
                    >
                      {connected ? 'Disconnect' : 'Connect'}
                    </DashboardButton>
                  </div>
                ))}
              </CardContent>
            </DashboardCard>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <DashboardCard variant="admin">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    Your subscription and usage information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-gradient-to-r from-fm-magenta-700 to-fm-orange-600 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{settings.billing.plan} Plan</h3>
                        <p className="text-white/80">Full access to all admin features</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">₹4,999</p>
                        <p className="text-white/80">per month</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </DashboardCard>

              <DashboardCard variant="admin">
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>
                    Current usage vs plan limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-fm-neutral-200 rounded-lg">
                      <p className="text-2xl font-bold text-fm-magenta-700">
                        {settings.billing.usage.leads}
                      </p>
                      <p className="text-sm text-fm-neutral-600">
                        Leads ({settings.billing.limits.max_leads} limit)
                      </p>
                    </div>
                    <div className="text-center p-4 border border-fm-neutral-200 rounded-lg">
                      <p className="text-2xl font-bold text-fm-magenta-700">
                        {settings.billing.usage.clients}
                      </p>
                      <p className="text-sm text-fm-neutral-600">
                        Clients ({settings.billing.limits.max_clients} limit)
                      </p>
                    </div>
                    <div className="text-center p-4 border border-fm-neutral-200 rounded-lg">
                      <p className="text-2xl font-bold text-fm-magenta-700">
                        {settings.billing.usage.storage} GB
                      </p>
                      <p className="text-sm text-fm-neutral-600">
                        Storage ({settings.billing.limits.max_storage} GB limit)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <DashboardButton variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Invoice
                    </DashboardButton>
                    <DashboardButton variant="outline" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Update Payment Method
                    </DashboardButton>
                  </div>
                </CardContent>
              </DashboardCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
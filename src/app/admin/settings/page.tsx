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
  Lock,
  Share2
} from 'lucide-react';
import {
  DashboardButton,
  DashboardCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SocialAccountsPanel } from '@/components/admin/social/SocialAccountsPanel';
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', content: string } | null>(null);

  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');

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
    fetch('/api/clients')
      .then(r => r.json())
      .then(result => {
        if (result.success && Array.isArray(result.data)) {
          setClients(result.data.map((c: any) => ({ id: c.id, name: c.name })));
        }
      })
      .catch(() => {});
  }, []);

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

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your admin panel preferences and account settings"
        actions={
          <DashboardButton
            variant="secondary"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </DashboardButton>
        }
      />

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

      <Tabs defaultValue="profile" orientation="vertical">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardCard variant="admin">
              <CardContent className="p-4">
                <TabsList variant="line" className="flex-col w-full items-stretch">
                  <TabsTrigger value="profile" className="justify-start gap-3">
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="general" className="justify-start gap-3">
                    <SettingsIcon className="h-4 w-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start gap-3">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start gap-3">
                    <Shield className="h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="justify-start gap-3">
                    <Eye className="h-4 w-4" />
                    Privacy
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="justify-start gap-3">
                    <Palette className="h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="integrations" className="justify-start gap-3">
                    <Zap className="h-4 w-4" />
                    Integrations
                  </TabsTrigger>
                  <TabsTrigger value="social" className="justify-start gap-3">
                    <Share2 className="h-4 w-4" />
                    Social Media
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="justify-start gap-3">
                    <CreditCard className="h-4 w-4" />
                    Billing & Usage
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </DashboardCard>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <TabsContent value="profile">
              <DashboardCard variant="admin">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-4">
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
                        <DashboardButton size="sm" variant="secondary">
                          <Upload className="h-4 w-4" />
                          Upload
                        </DashboardButton>
                        <DashboardButton size="sm" variant="secondary">
                          <Camera className="h-4 w-4" />
                          Take Photo
                        </DashboardButton>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    variant="primary"
                    onClick={() => saveSettings('profile', settings.profile)}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </DashboardButton>
                </CardContent>
              </DashboardCard>
            </TabsContent>

            <TabsContent value="general">
              <DashboardCard variant="admin">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure your general preferences and regional settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Timezone"
                      value={settings.general.timezone}
                      onChange={(e) => saveSettings('general', { timezone: e.target.value })}
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="Asia/Mumbai">Asia/Mumbai (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </Select>

                    <Select
                      label="Date Format"
                      value={settings.general.dateFormat}
                      onChange={(e) => saveSettings('general', { dateFormat: e.target.value })}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </Select>

                    <Select
                      label="Time Format"
                      value={settings.general.timeFormat}
                      onChange={(e) => saveSettings('general', { timeFormat: e.target.value })}
                    >
                      <option value="12h">12 Hour (AM/PM)</option>
                      <option value="24h">24 Hour</option>
                    </Select>

                    <Select
                      label="Currency"
                      value={settings.general.currency}
                      onChange={(e) => saveSettings('general', { currency: e.target.value })}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </Select>
                  </div>
                </CardContent>
              </DashboardCard>
            </TabsContent>

            <TabsContent value="notifications">
              <DashboardCard variant="admin">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Choose how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Active email notification toggles */}
                  {(['email_notifications', 'security_alerts', 'lead_updates', 'client_updates', 'system_updates', 'marketing_emails'] as const).map((key) => (
                    <Toggle
                      key={key}
                      checked={settings.notifications[key]}
                      onChange={(checked) => saveSettings('notifications', { [key]: checked })}
                      label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      description={
                        key === 'email_notifications' ? 'Receive notifications via email (leads, invoices, contracts, support tickets)' :
                        key === 'security_alerts' ? 'Important security notifications' :
                        key === 'lead_updates' ? 'Updates about new leads and inquiries' :
                        key === 'client_updates' ? 'Client-related notifications (contracts, support)' :
                        key === 'system_updates' ? 'System maintenance and updates' :
                        key === 'marketing_emails' ? 'Marketing emails and newsletters' : ''
                      }
                    />
                  ))}

                  {/* Coming soon — not yet implemented */}
                  <div className="pt-4 border-t border-fm-neutral-200">
                    <p className="text-xs font-medium uppercase tracking-wider text-fm-neutral-400 mb-3">Coming Soon</p>
                    <div className="space-y-4 opacity-50">
                      <Toggle
                        checked={false}
                        onChange={() => {}}
                        label="Browser Notifications"
                        description="Real-time push notifications in your browser"
                      />
                      <Toggle
                        checked={false}
                        onChange={() => {}}
                        label="Mobile Notifications"
                        description="Push notifications on mobile devices"
                      />
                    </div>
                  </div>
                </CardContent>
              </DashboardCard>
            </TabsContent>

            <TabsContent value="security">
              <DashboardCard variant="admin">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Password Section */}
                  <div className="p-3 sm:p-4 bg-fm-neutral-50 rounded-lg">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Key className="h-5 w-5 text-fm-neutral-600" />
                        <div>
                          <p className="font-medium text-fm-neutral-900">Password</p>
                          <p className="text-sm text-fm-neutral-600">Last changed 30 days ago</p>
                        </div>
                      </div>
                      <DashboardButton variant="secondary" size="sm">
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
                  <Select
                    label="Session Timeout (hours)"
                    value={settings.security.session_timeout.toString()}
                    onChange={(e) => saveSettings('security', { session_timeout: parseInt(e.target.value) })}
                    className="max-w-xs"
                  >
                    <option value="1">1 hour</option>
                    <option value="4">4 hours</option>
                    <option value="8">8 hours</option>
                    <option value="24">24 hours</option>
                    <option value="168">1 week</option>
                  </Select>
                </CardContent>
              </DashboardCard>
            </TabsContent>

            <TabsContent value="privacy">
              <DashboardCard variant="admin">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Manage data privacy and retention policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Toggle
                    checked={settings.privacy.analytics_tracking}
                    onChange={(checked) => saveSettings('privacy', { analytics_tracking: checked })}
                    label="Analytics Tracking"
                    description="Allow usage analytics to improve the product"
                  />
                  <Toggle
                    checked={settings.privacy.data_sharing}
                    onChange={(checked) => saveSettings('privacy', { data_sharing: checked })}
                    label="Data Sharing"
                    description="Share anonymized usage data"
                  />
                  <Toggle
                    checked={settings.privacy.cookie_consent}
                    onChange={(checked) => saveSettings('privacy', { cookie_consent: checked })}
                    label="Cookie Consent"
                    description="Show cookie consent banner to visitors"
                  />
                </CardContent>
              </DashboardCard>
            </TabsContent>

            <TabsContent value="appearance">
              <DashboardCard variant="admin">
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your admin dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <Select
                    label="Theme"
                    value={settings.appearance.theme}
                    onChange={(e) => saveSettings('appearance', { theme: e.target.value })}
                    className="max-w-xs"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </Select>

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
            </TabsContent>

            <TabsContent value="integrations">
              <DashboardCard variant="admin">
                <CardHeader>
                  <CardTitle>Platform Integrations</CardTitle>
                  <CardDescription>
                    Manage your third-party service connections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.integrations).map(([key, connected]) => (
                    <div key={key} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-fm-neutral-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          key === 'google_sheets' && "bg-green-100 text-green-600",
                          key === 'google_analytics' && "bg-orange-100 text-orange-600",
                          key === 'email_service' && "bg-blue-100 text-blue-600",
                          key === 'payment_gateway' && "bg-purple-100 text-purple-600",
                          key === 'crm_integration' && "bg-fm-magenta-100 text-fm-magenta-700"
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
                        variant={connected ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => saveSettings('integrations', { [key]: !connected })}
                      >
                        {connected ? 'Disconnect' : 'Connect'}
                      </DashboardButton>
                    </div>
                  ))}
                </CardContent>
              </DashboardCard>
            </TabsContent>

            <TabsContent value="social">
              <DashboardCard variant="admin">
                <CardHeader>
                  <CardTitle>Social Media Accounts</CardTitle>
                  <CardDescription>
                    Connect client Facebook and Instagram accounts for direct publishing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    label="Select Client"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>

                  {selectedClientId ? (
                    <SocialAccountsPanel
                      clientId={selectedClientId}
                      clientName={clients.find(c => c.id === selectedClientId)?.name || ''}
                    />
                  ) : (
                    <p className="text-sm text-fm-neutral-500 py-4" style={{ textAlign: 'center' }}>
                      Select a client above to manage their social media accounts.
                    </p>
                  )}
                </CardContent>
              </DashboardCard>
            </TabsContent>

            <TabsContent value="billing">
              <div className="space-y-4 sm:space-y-6">
                <DashboardCard variant="admin">
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>
                      Your subscription and usage information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-fm-magenta-700 to-fm-magenta-500 rounded-lg text-white">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{settings.billing.plan} Plan</h3>
                          <p className="text-white/80">Full access to all admin features</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl sm:text-2xl font-bold">₹4,999</p>
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="text-center p-3 sm:p-4 border border-fm-neutral-200 rounded-lg">
                        <p className="text-xl sm:text-2xl font-bold text-fm-magenta-700">
                          {settings.billing.usage.leads}
                        </p>
                        <p className="text-sm text-fm-neutral-600">
                          Leads ({settings.billing.limits.max_leads} limit)
                        </p>
                      </div>
                      <div className="text-center p-3 sm:p-4 border border-fm-neutral-200 rounded-lg">
                        <p className="text-xl sm:text-2xl font-bold text-fm-magenta-700">
                          {settings.billing.usage.clients}
                        </p>
                        <p className="text-sm text-fm-neutral-600">
                          Clients ({settings.billing.limits.max_clients} limit)
                        </p>
                      </div>
                      <div className="text-center p-3 sm:p-4 border border-fm-neutral-200 rounded-lg">
                        <p className="text-xl sm:text-2xl font-bold text-fm-magenta-700">
                          {settings.billing.usage.storage} GB
                        </p>
                        <p className="text-sm text-fm-neutral-600">
                          Storage ({settings.billing.limits.max_storage} GB limit)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mt-6">
                      <DashboardButton variant="secondary" className="w-full">
                        <FileText className="h-4 w-4" />
                        Download Invoice
                      </DashboardButton>
                      <DashboardButton variant="secondary" className="w-full">
                        <CreditCard className="h-4 w-4" />
                        Update Payment Method
                      </DashboardButton>
                    </div>
                  </CardContent>
                </DashboardCard>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

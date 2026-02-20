'use client';

import { useState } from 'react';
import {
  DashboardCard as Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DashboardButton as Button,
  IconBox,
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Image,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';

export default function ClientSettingsPage() {
  const { profile, clientId, refreshProfile } = useClientPortal();

  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state initialised from profile
  const [form, setForm] = useState({
    name: profile.name || '',
    website: profile.primaryContact ? (profile as any).website || '' : '',
    description: (profile as any).description || '',
    email: profile.primaryContact?.email || '',
    phone: (profile as any).primaryContact?.phone || '',
    logo: profile.logo || '',
    address: (profile as any).headquarters?.street || '',
    city: (profile as any).headquarters?.city || '',
    state: (profile as any).headquarters?.state || '',
    zip_code: (profile as any).headquarters?.zipCode || '',
    country: (profile as any).headquarters?.country || '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setAlert(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setAlert(null);

      const res = await fetch(`/api/client-portal/${clientId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to save');
      }

      setAlert({ type: 'success', message: 'Settings saved successfully.' });
      refreshProfile?.();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-fm-neutral-900">
          Account <span className="v2-accent">Settings</span>
        </h1>
        <p className="text-fm-neutral-600 mt-1 font-medium">
          Update your company information and contact details
        </p>
      </div>

      {/* Alert */}
      {alert && (
        <div
          className={`flex items-center space-x-3 p-4 rounded-lg mb-6 ${
            alert.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{alert.message}</span>
        </div>
      )}

      <div className="space-y-8">
        {/* Company Info */}
        <Card variant="client" hover glow>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <IconBox>
                <Building2 className="w-5 h-5" />
              </IconBox>
              <div>
                <CardTitle className="text-xl">Company Information</CardTitle>
                <CardDescription>Basic details about your company</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                leftIcon={<Building2 className="w-4 h-4" />}
              />
              <Input
                label="Website"
                value={form.website}
                onChange={(e) => handleChange('website', e.target.value)}
                leftIcon={<Globe className="w-4 h-4" />}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-fm-neutral-900 block mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-fm-neutral-300 bg-fm-neutral-50 px-3 py-2 text-base ring-offset-fm-neutral-50 placeholder:text-fm-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fm-magenta-700 focus-visible:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                placeholder="Brief description of your company..."
              />
            </div>
            <div>
              <span className="text-sm font-medium text-fm-neutral-900">Industry</span>
              <div className="mt-1">
                <Badge variant="secondary" className="bg-fm-magenta-50 text-fm-magenta-700 border-fm-magenta-200 capitalize">
                  {profile.industry}
                </Badge>
                <span className="text-xs text-fm-neutral-500 ml-2">Managed by admin</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card variant="client" hover glow>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <IconBox>
                <Mail className="w-5 h-5" />
              </IconBox>
              <div>
                <CardTitle className="text-xl">Contact Details</CardTitle>
                <CardDescription>How we can reach you</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Street Address"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                leftIcon={<MapPin className="w-4 h-4" />}
              />
              <Input
                label="City"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="State"
                value={form.state}
                onChange={(e) => handleChange('state', e.target.value)}
              />
              <Input
                label="ZIP Code"
                value={form.zip_code}
                onChange={(e) => handleChange('zip_code', e.target.value)}
              />
              <Input
                label="Country"
                value={form.country}
                onChange={(e) => handleChange('country', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo */}
        <Card variant="client" hover glow>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <IconBox>
                <Image className="w-5 h-5" />
              </IconBox>
              <div>
                <CardTitle className="text-xl">Company Logo</CardTitle>
                <CardDescription>Your logo displayed across the portal</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              {form.logo ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-fm-magenta-100 shadow-lg flex-shrink-0">
                  <img src={form.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-fm-neutral-100 flex items-center justify-center flex-shrink-0">
                  <Image className="w-8 h-8 text-fm-neutral-400" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  label="Logo URL"
                  value={form.logo}
                  onChange={(e) => handleChange('logo', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  hint="Paste a direct URL to your company logo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="client" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </>
  );
}

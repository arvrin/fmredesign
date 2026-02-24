'use client';

import { useState, useRef } from 'react';
import {
  Palette,
  Upload,
  Plus,
  Trash2,
  X,
  ExternalLink,
  Edit,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';
import { adminToast } from '@/lib/admin/toast';

interface BrandIdentitySectionProps {
  clientId: string;
  clientData: {
    logoUrl?: string;
    brandColors?: string[];
    brandFonts?: string[];
    tagline?: string;
    brandGuidelinesUrl?: string;
    name: string;
  };
  onUpdate: () => void;
}

export function BrandIdentitySection({
  clientId,
  clientData,
  onUpdate,
}: BrandIdentitySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    clientData.logoUrl || null
  );
  const [logoUrl, setLogoUrl] = useState(clientData.logoUrl || '');
  const [brandColors, setBrandColors] = useState<string[]>(
    clientData.brandColors?.length ? clientData.brandColors : []
  );
  const [brandFonts, setBrandFonts] = useState(
    (clientData.brandFonts || []).join(', ')
  );
  const [tagline, setTagline] = useState(clientData.tagline || '');
  const [brandGuidelinesUrl, setBrandGuidelinesUrl] = useState(
    clientData.brandGuidelinesUrl || ''
  );
  const [logoUploading, setLogoUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const hasBrandData =
    clientData.logoUrl ||
    (clientData.brandColors && clientData.brandColors.length > 0) ||
    clientData.tagline ||
    (clientData.brandFonts && clientData.brandFonts.length > 0) ||
    clientData.brandGuidelinesUrl;

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: clientId,
          logoUrl: logoUrl || undefined,
          brandColors: brandColors.filter((c) => /^#[0-9a-fA-F]{6}$/.test(c)),
          brandFonts: brandFonts
            ? brandFonts
                .split(',')
                .map((f: string) => f.trim())
                .filter(Boolean)
            : [],
          tagline: tagline || undefined,
          brandGuidelinesUrl: brandGuidelinesUrl || undefined,
        }),
      });

      if (response.ok) {
        adminToast.success('Brand identity updated');
        setIsEditing(false);
        onUpdate();
      } else {
        adminToast.error('Failed to update brand identity');
      }
    } catch {
      adminToast.error('Failed to update brand identity');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLogoPreview(clientData.logoUrl || null);
    setLogoUrl(clientData.logoUrl || '');
    setBrandColors(clientData.brandColors?.length ? clientData.brandColors : []);
    setBrandFonts((clientData.brandFonts || []).join(', '));
    setTagline(clientData.tagline || '');
    setBrandGuidelinesUrl(clientData.brandGuidelinesUrl || '');
  };

  const handleLogoUpload = async (file: File) => {
    setLogoUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('clientId', clientId);
      const res = await fetch('/api/admin/upload-logo', {
        method: 'POST',
        body: fd,
      });
      const result = await res.json();
      if (result.success) {
        setLogoUrl(result.url);
        setLogoPreview(result.url);
      } else {
        adminToast.error(result.error || 'Failed to upload logo');
      }
    } catch {
      adminToast.error('Failed to upload logo');
    } finally {
      setLogoUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-fm-neutral-50/50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="h-4 w-4" />
          Brand Identity
          {!hasBrandData && (
            <span className="text-xs font-normal text-fm-neutral-400 normal-case ml-2">
              (not configured)
            </span>
          )}
        </h3>
        <ChevronDown
          className={`h-5 w-5 text-fm-neutral-400 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Collapsible content */}
      {expanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-fm-neutral-100 pt-4">
          {!isEditing ? (
            /* Display mode */
            <div className="space-y-4">
              {hasBrandData ? (
                <>
                  {clientData.logoUrl && (
                    <div>
                      <p className="text-sm text-fm-neutral-600 mb-2">Logo</p>
                      <div className="w-20 h-20 rounded-lg border border-fm-neutral-200 overflow-hidden bg-fm-neutral-50 flex items-center justify-center">
                        <img
                          src={clientData.logoUrl}
                          alt={`${clientData.name} logo`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {clientData.brandColors &&
                    clientData.brandColors.length > 0 && (
                      <div>
                        <p className="text-sm text-fm-neutral-600 mb-2">
                          Colors
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {clientData.brandColors.map(
                            (color: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-1.5"
                              >
                                <div
                                  className="w-8 h-8 rounded-md border border-fm-neutral-200"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-xs text-fm-neutral-600 font-mono">
                                  {color}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  {clientData.tagline && (
                    <div>
                      <p className="text-sm text-fm-neutral-600">Tagline</p>
                      <p className="font-medium text-fm-neutral-900 italic">
                        &ldquo;{clientData.tagline}&rdquo;
                      </p>
                    </div>
                  )}
                  {clientData.brandFonts &&
                    clientData.brandFonts.length > 0 && (
                      <div>
                        <p className="text-sm text-fm-neutral-600">Fonts</p>
                        <p className="font-medium text-fm-neutral-900">
                          {clientData.brandFonts.join(', ')}
                        </p>
                      </div>
                    )}
                  {clientData.brandGuidelinesUrl && (
                    <a
                      href={clientData.brandGuidelinesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-fm-magenta-700 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Brand Guidelines
                    </a>
                  )}
                </>
              ) : (
                <p className="text-sm text-fm-neutral-500">
                  No brand identity configured yet. Click Edit to add logo,
                  colors, and brand details.
                </p>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Brand Identity
              </Button>
            </div>
          ) : (
            /* Edit mode */
            <div className="space-y-4">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                  Brand Logo
                </label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative w-16 h-16 rounded-lg border border-fm-neutral-200 overflow-hidden bg-fm-neutral-50 flex items-center justify-center">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null);
                          setLogoUrl('');
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => logoInputRef.current?.click()}
                      className="w-16 h-16 rounded-lg border-2 border-dashed border-fm-neutral-300 flex items-center justify-center cursor-pointer hover:border-fm-magenta-400 transition-colors"
                    >
                      <Upload className="h-5 w-5 text-fm-neutral-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={logoUploading}
                      className="text-sm text-fm-magenta-700 hover:text-fm-magenta-800 font-medium"
                    >
                      {logoUploading ? 'Uploading...' : 'Upload logo'}
                    </button>
                    <p className="text-xs text-fm-neutral-500 mt-0.5">
                      PNG, JPEG, SVG, or WebP. Max 2MB.
                    </p>
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                  />
                </div>
              </div>

              {/* Brand Colors */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                  Brand Colors
                </label>
                <div className="space-y-2">
                  {brandColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const updated = [...brandColors];
                          updated[index] = e.target.value;
                          setBrandColors(updated);
                        }}
                        className="w-10 h-10 rounded cursor-pointer border border-fm-neutral-200"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => {
                          const updated = [...brandColors];
                          updated[index] = e.target.value;
                          setBrandColors(updated);
                        }}
                        className="w-28 h-10 px-2 text-sm bg-fm-neutral-50 border border-fm-neutral-300 rounded-md font-mono"
                      />
                      <span className="text-xs text-fm-neutral-500">
                        {index === 0
                          ? 'Primary'
                          : index === 1
                          ? 'Secondary'
                          : 'Accent'}
                      </span>
                      {brandColors.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setBrandColors(
                              brandColors.filter((_, i) => i !== index)
                            )
                          }
                          className="p-1 text-fm-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {brandColors.length < 5 && (
                    <button
                      type="button"
                      onClick={() =>
                        setBrandColors([...brandColors, '#000000'])
                      }
                      className="flex items-center gap-1 text-sm text-fm-magenta-700 hover:text-fm-magenta-800"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add color
                    </button>
                  )}
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                  Tagline / Slogan
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Your brand's catchphrase"
                  className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                />
              </div>

              {/* Brand Fonts */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                  Brand Fonts
                </label>
                <input
                  type="text"
                  value={brandFonts}
                  onChange={(e) => setBrandFonts(e.target.value)}
                  placeholder="Poppins, Montserrat"
                  className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                />
                <p className="text-xs text-fm-neutral-500 mt-1">
                  Comma-separated font names
                </p>
              </div>

              {/* Brand Guidelines URL */}
              <div>
                <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                  Brand Guidelines URL
                </label>
                <input
                  type="url"
                  value={brandGuidelinesUrl}
                  onChange={(e) => setBrandGuidelinesUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                />
              </div>

              {/* Save/Cancel */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Brand Identity'}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

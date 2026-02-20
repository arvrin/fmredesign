/**
 * Technical Requirements Form - Section 8
 */
'use client';
import { useState } from 'react';
import { DiscoverySession } from '@/lib/admin/discovery-types';
import { Settings } from 'lucide-react';

interface TechnicalRequirementsFormProps {
  session: DiscoverySession;
  onUpdate: (data: Partial<DiscoverySession>) => void;
}

export function TechnicalRequirementsForm({ session, onUpdate }: TechnicalRequirementsFormProps) {
  const [formData, setFormData] = useState(session.technicalRequirements);

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    const updated = { ...formData, [field]: items };
    setFormData(updated);
    onUpdate({ technicalRequirements: updated });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-fm-magenta-50 rounded-lg">
            <Settings className="h-6 w-6 text-fm-magenta-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">Technical Requirements</h2>
            <p className="text-fm-neutral-600">Technical specifications and constraints</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
              Platform Preferences <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.platformPreferences.join(', ')}
              onChange={(e) => handleArrayChange('platformPreferences', e.target.value)}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="e.g., WordPress, Shopify, Custom Development"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
              Security Requirements <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
            </label>
            <textarea
              value={formData.securityRequirements.join(', ')}
              onChange={(e) => handleArrayChange('securityRequirements', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="SSL, Two-factor authentication, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
              Device Support <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.deviceSupport.join(', ')}
              onChange={(e) => handleArrayChange('deviceSupport', e.target.value)}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="Desktop, Mobile, Tablet"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
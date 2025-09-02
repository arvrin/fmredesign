/**
 * Content Creative Form - Section 9
 */
'use client';
import { useState } from 'react';
import { DiscoverySession } from '@/lib/admin/discovery-types';
import { Palette } from 'lucide-react';

interface ContentCreativeFormProps {
  session: DiscoverySession;
  onUpdate: (data: Partial<DiscoverySession>) => void;
}

export function ContentCreativeForm({ session, onUpdate }: ContentCreativeFormProps) {
  const [formData, setFormData] = useState(session.contentCreative);

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    const updated = { ...formData, [field]: items };
    setFormData(updated);
    onUpdate({ contentCreative: updated });
  };

  const handleToneChange = (field: string, value: any) => {
    const updated = {
      ...formData,
      toneOfVoice: {
        ...formData.toneOfVoice,
        [field]: value
      }
    };
    setFormData(updated);
    onUpdate({ contentCreative: updated });
  };

  const handleVisualChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    const updated = {
      ...formData,
      visualStyle: {
        ...formData.visualStyle,
        [field]: items
      }
    };
    setFormData(updated);
    onUpdate({ contentCreative: updated });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-fm-magenta-50 rounded-lg">
            <Palette className="h-6 w-6 text-fm-magenta-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">Content & Creative</h2>
            <p className="text-fm-neutral-600">Brand voice, visual style, and content strategy</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-6">Brand Personality</h3>
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Brand Personality Traits <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.brandPersonality.join(', ')}
              onChange={(e) => handleArrayChange('brandPersonality', e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="e.g., Professional, Friendly, Innovative, Trustworthy"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-6">Tone of Voice</h3>
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Primary Tone
            </label>
            <input
              type="text"
              value={formData.toneOfVoice.primary}
              onChange={(e) => handleToneChange('primary', e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="e.g., Conversational, Professional, Enthusiastic"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-6">Visual Style</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Color Preferences <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={formData.visualStyle.colorPreferences.join(', ')}
                onChange={(e) => handleVisualChange('colorPreferences', e.target.value)}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="e.g., Blue, White, Modern, Minimalist"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Design Inspiration <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={formData.visualStyle.designInspiration.join(', ')}
                onChange={(e) => handleVisualChange('designInspiration', e.target.value)}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="Inspiration sources or reference websites"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
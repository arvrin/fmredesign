/**
 * Current State Form
 * Section 4 of Discovery Wizard
 */

'use client';

import { useState } from 'react';
import { DiscoverySession } from '@/lib/admin/discovery-types';
import { BarChart3 } from 'lucide-react';

interface CurrentStateFormProps {
  session: DiscoverySession;
  onUpdate: (data: Partial<DiscoverySession>) => void;
}

export function CurrentStateForm({ session, onUpdate }: CurrentStateFormProps) {
  const [formData, setFormData] = useState(session.currentState);

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    const updated = { ...formData, [field]: items };
    setFormData(updated);
    onUpdate({ currentState: updated });
  };

  const handleBrandingChange = (field: string, value: any) => {
    const updated = {
      ...formData,
      existingBranding: {
        ...formData.existingBranding,
        [field]: value
      }
    };
    setFormData(updated);
    onUpdate({ currentState: updated });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-fm-magenta-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-fm-magenta-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">Current State Analysis</h2>
            <p className="text-fm-neutral-600">Assess your current situation and assets</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-6">Existing Brand Assets</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.existingBranding.hasLogo}
                  onChange={(e) => handleBrandingChange('hasLogo', e.target.checked)}
                  className="mr-2"
                />
                We have an existing logo
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.existingBranding.hasBrandGuidelines}
                  onChange={(e) => handleBrandingChange('hasBrandGuidelines', e.target.checked)}
                  className="mr-2"
                />
                We have brand guidelines
              </label>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                Brand Perception
              </label>
              <textarea
                value={formData.existingBranding.brandPerception}
                onChange={(e) => handleBrandingChange('brandPerception', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                placeholder="How do customers currently perceive your brand?"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-6">Current Challenges</h3>
          <textarea
            value={(formData.currentChallenges || []).join(', ')}
            onChange={(e) => handleArrayChange('currentChallenges', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
            placeholder="What challenges are you currently facing? (comma-separated)"
          />
        </div>

        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-6">What's Working vs Not Working</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                What's Working Well <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
              </label>
              <textarea
                value={(formData.whatIsWorking || []).join(', ')}
                onChange={(e) => handleArrayChange('whatIsWorking', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                placeholder="What's currently working well for your business?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                What's Not Working <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
              </label>
              <textarea
                value={(formData.whatIsNotWorking || []).join(', ')}
                onChange={(e) => handleArrayChange('whatIsNotWorking', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                placeholder="What needs improvement?"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
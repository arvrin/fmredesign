/**
 * Target Audience Form
 * Section 3 of Discovery Wizard
 */

'use client';

import { useState } from 'react';
import { DiscoverySession } from '@/lib/admin/discovery-types';
import { Users } from 'lucide-react';

interface TargetAudienceFormProps {
  session: DiscoverySession;
  onUpdate: (data: Partial<DiscoverySession>) => void;
}

export function TargetAudienceForm({ session, onUpdate }: TargetAudienceFormProps) {
  const [formData, setFormData] = useState(session.targetAudience);

  const handleDemographicsChange = (field: string, value: string) => {
    const updated = {
      ...formData,
      primaryAudience: {
        ...formData.primaryAudience,
        demographics: {
          ...formData.primaryAudience.demographics,
          [field]: value
        }
      }
    };
    setFormData(updated);
    onUpdate({ targetAudience: updated });
  };

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    const updated = { ...formData, [field]: items };
    setFormData(updated);
    onUpdate({ targetAudience: updated });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-fm-magenta-50 rounded-lg">
            <Users className="h-6 w-6 text-fm-magenta-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">Target Audience</h2>
            <p className="text-fm-neutral-600">Define who your ideal customers are</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-fm-neutral-900 mb-6">Primary Audience Demographics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Age Range</label>
            <input
              type="text"
              value={formData.primaryAudience.demographics.ageRange}
              onChange={(e) => handleDemographicsChange('ageRange', e.target.value)}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="e.g., 25-45 years"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Gender</label>
            <select
              value={formData.primaryAudience.demographics.gender}
              onChange={(e) => handleDemographicsChange('gender', e.target.value)}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none"
            >
              <option value="">Select gender</option>
              <option value="all">All genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non_binary">Non-binary</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Income Level</label>
            <input
              type="text"
              value={formData.primaryAudience.demographics.income}
              onChange={(e) => handleDemographicsChange('income', e.target.value)}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="e.g., Middle class, ₹5-15 LPA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Education Level</label>
            <input
              type="text"
              value={formData.primaryAudience.demographics.education}
              onChange={(e) => handleDemographicsChange('education', e.target.value)}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="e.g., College graduate, MBA"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Occupation</label>
            <input
              type="text"
              value={formData.primaryAudience.demographics.occupation}
              onChange={(e) => handleDemographicsChange('occupation', e.target.value)}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="e.g., IT professionals, Business owners"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
              Geographic Targets <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.geographicTarget.join(', ')}
              onChange={(e) => handleArrayChange('geographicTarget', e.target.value)}
              className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="e.g., Mumbai, Delhi, Bangalore"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
              Pain Points <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
            </label>
            <textarea
              value={formData.painPoints.join(', ')}
              onChange={(e) => handleArrayChange('painPoints', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="What problems does your audience face?"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
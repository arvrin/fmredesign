/**
 * Goals & KPIs Form
 * Section 5 of Discovery Wizard
 */

'use client';

import { useState } from 'react';
import { DiscoverySession } from '@/lib/admin/discovery-types';
import { TrendingUp } from 'lucide-react';

interface GoalsKPIsFormProps {
  session: DiscoverySession;
  onUpdate: (data: Partial<DiscoverySession>) => void;
}

export function GoalsKPIsForm({ session, onUpdate }: GoalsKPIsFormProps) {
  const [formData, setFormData] = useState(session.goalsKPIs);

  const handleInputChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate({ goalsKPIs: updated });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-fm-magenta-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-fm-magenta-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">Goals & KPIs</h2>
            <p className="text-fm-neutral-600">Define what success looks like</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Success Definition *
            </label>
            <textarea
              value={formData.successDefinition}
              onChange={(e) => handleInputChange('successDefinition', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="How do you define success for this project?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Timeframe
            </label>
            <input
              type="text"
              value={formData.timeframe}
              onChange={(e) => handleInputChange('timeframe', e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="e.g., 6 months, 1 year"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Priority Level
            </label>
            <select
              value={formData.priorityLevel}
              onChange={(e) => handleInputChange('priorityLevel', e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
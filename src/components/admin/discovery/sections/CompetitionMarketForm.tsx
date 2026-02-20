/**
 * Competition Market Form - Section 6
 */
'use client';
import { useState } from 'react';
import { DiscoverySession } from '@/lib/admin/discovery-types';
import { Target } from 'lucide-react';

interface CompetitionMarketFormProps {
  session: DiscoverySession;
  onUpdate: (data: Partial<DiscoverySession>) => void;
}

export function CompetitionMarketForm({ session, onUpdate }: CompetitionMarketFormProps) {
  const [formData, setFormData] = useState(session.competitionMarket);

  const handleInputChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate({ competitionMarket: updated });
  };

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    const updated = { ...formData, [field]: items };
    setFormData(updated);
    onUpdate({ competitionMarket: updated });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-fm-magenta-50 rounded-lg">
            <Target className="h-6 w-6 text-fm-magenta-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">Competition & Market</h2>
            <p className="text-fm-neutral-600">Analyze your competitive landscape</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
              Market Position
            </label>
            <textarea
              value={formData.marketPosition}
              onChange={(e) => handleInputChange('marketPosition', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="Where do you position yourself in the market?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
              Key Differentiators <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
            </label>
            <textarea
              value={formData.differentiators.join(', ')}
              onChange={(e) => handleArrayChange('differentiators', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="What sets you apart from competitors?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
              Market Trends <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
            </label>
            <textarea
              value={formData.marketTrends.join(', ')}
              onChange={(e) => handleArrayChange('marketTrends', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="Current trends in your industry"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
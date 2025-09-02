/**
 * Budget Resources Form - Section 7
 */
'use client';
import { useState } from 'react';
import { DiscoverySession } from '@/lib/admin/discovery-types';
import { DollarSign } from 'lucide-react';

interface BudgetResourcesFormProps {
  session: DiscoverySession;
  onUpdate: (data: Partial<DiscoverySession>) => void;
}

export function BudgetResourcesForm({ session, onUpdate }: BudgetResourcesFormProps) {
  const [formData, setFormData] = useState(session.budgetResources);

  const handleBudgetChange = (field: string, value: any) => {
    const updated = {
      ...formData,
      totalBudget: {
        ...formData.totalBudget,
        [field]: value
      }
    };
    setFormData(updated);
    onUpdate({ budgetResources: updated });
  };

  const handleInputChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate({ budgetResources: updated });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-fm-magenta-50 rounded-lg">
            <DollarSign className="h-6 w-6 text-fm-magenta-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">Budget & Resources</h2>
            <p className="text-fm-neutral-600">Financial planning and resource allocation</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Total Budget Amount *
            </label>
            <input
              type="number"
              value={formData.totalBudget.amount}
              onChange={(e) => handleBudgetChange('amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="₹ 100000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Currency
            </label>
            <select
              value={formData.totalBudget.currency}
              onChange={(e) => handleBudgetChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              Budget Flexibility
            </label>
            <select
              value={formData.totalBudget.flexibility}
              onChange={(e) => handleBudgetChange('flexibility', e.target.value)}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
            >
              <option value="fixed">Fixed - Cannot exceed</option>
              <option value="flexible">Flexible - Some room</option>
              <option value="expandable">Expandable - Can increase</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
              ROI Expectations
            </label>
            <textarea
              value={formData.roiExpectations}
              onChange={(e) => handleInputChange('roiExpectations', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              placeholder="What return on investment do you expect?"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
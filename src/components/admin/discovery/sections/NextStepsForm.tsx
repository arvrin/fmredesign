/**
 * Next Steps Form - Section 10
 */
'use client';
import { useState } from 'react';
import { DiscoverySession } from '@/lib/admin/discovery-types';
import { CheckCircle } from 'lucide-react';

interface NextStepsFormProps {
  session: DiscoverySession;
  onUpdate: (data: Partial<DiscoverySession>) => void;
}

export function NextStepsForm({ session, onUpdate }: NextStepsFormProps) {
  const [formData, setFormData] = useState(session.nextSteps);

  const handleInputChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate({ nextSteps: updated });
  };

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    const updated = { ...formData, [field]: items };
    setFormData(updated);
    onUpdate({ nextSteps: updated });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-fm-magenta-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-fm-magenta-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-fm-neutral-900">Next Steps</h2>
            <p className="text-fm-neutral-600">Planning forward and defining action items</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-6">Project Planning</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                Decision Makers <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={(formData.decisionMakers || []).join(', ')}
                onChange={(e) => handleArrayChange('decisionMakers', e.target.value)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                placeholder="Who will make final decisions?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                Follow-up Date
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                className="w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
              Approval Process
            </label>
            <textarea
              value={formData.approvalProcess}
              onChange={(e) => handleInputChange('approvalProcess', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
              placeholder="Describe the approval process for this project"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-fm-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-6">Risk Assessment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                Risk Factors <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
              </label>
              <textarea
                value={(formData.riskFactors || []).join(', ')}
                onChange={(e) => handleArrayChange('riskFactors', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                placeholder="What could potentially go wrong?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                Success Factors <span className="text-xs text-fm-neutral-500">(comma-separated)</span>
              </label>
              <textarea
                value={(formData.successFactors || []).join(', ')}
                onChange={(e) => handleArrayChange('successFactors', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400"
                placeholder="What will ensure project success?"
              />
            </div>
          </div>
        </div>

        {/* Discovery Complete Notice */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Ready to Complete Discovery</h3>
          </div>
          <p className="text-green-700 mb-4">
            You've reached the final section! Review all sections and complete the discovery process to generate a comprehensive report.
          </p>
          <div className="text-sm text-green-600">
            <strong>What happens next:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>PDF report will be generated</li>
              <li>Talent requirements will be analyzed</li>
              <li>Project recommendations will be provided</li>
              <li>Follow-up actions will be scheduled</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
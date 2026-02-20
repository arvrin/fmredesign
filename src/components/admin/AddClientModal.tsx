/**
 * Add Client Modal Component
 * Form modal for creating new clients (react-hook-form + Zod validation)
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';
import { adminToast } from '@/lib/admin/toast';
import { createClientSchema } from '@/lib/validations/schemas';

type ClientFormData = z.infer<typeof createClientSchema>;

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

const INDUSTRIES = [
  'technology', 'healthcare', 'finance', 'ecommerce', 'education',
  'real_estate', 'hospitality', 'manufacturing', 'retail', 'automotive',
  'food_beverage', 'consulting', 'non_profit', 'other',
];

const INDUSTRY_LABELS: Record<string, string> = {
  'technology': 'Technology', 'healthcare': 'Healthcare',
  'finance': 'Finance & Banking', 'ecommerce': 'E-commerce',
  'education': 'Education', 'real_estate': 'Real Estate',
  'hospitality': 'Hospitality & Travel', 'manufacturing': 'Manufacturing',
  'retail': 'Retail', 'automotive': 'Automotive',
  'food_beverage': 'Food & Beverage', 'consulting': 'Consulting',
  'non_profit': 'Non-Profit', 'other': 'Other',
};

const inputClass = 'w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400';
const selectClass = 'w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none';
const errorClass = 'text-xs text-red-600 mt-1.5';

export function AddClientModal({ isOpen, onClose, onClientAdded }: AddClientModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      industry: 'technology',
      website: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: '',
      status: 'active',
      health: 'good',
      totalValue: '0',
      gstNumber: '',
      portalPassword: '',
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        reset();
        onClientAdded();
        onClose();
      } else {
        adminToast.error(result.error || 'Failed to create client');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      adminToast.error('Failed to create client. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl max-w-2xl w-full sm:mx-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-fm-neutral-200 shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-fm-neutral-900">Add New Client</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-fm-neutral-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Basic Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                Client Name *
              </label>
              <input {...register('name')} className={inputClass} placeholder="Enter client name" />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                Email *
              </label>
              <input {...register('email')} type="email" className={inputClass} placeholder="Enter email address" />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Phone</label>
              <input {...register('phone')} type="tel" className={inputClass} placeholder="Enter phone number" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
                Industry
              </label>
              <select {...register('industry')} className={selectClass}>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>{INDUSTRY_LABELS[industry]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Website</label>
              <input {...register('website')} type="url" className={inputClass} placeholder="https://example.com" />
            </div>

            {/* Address Information */}
            <div className="md:col-span-2 mt-2">
              <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Address Information</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Address</label>
              <input {...register('address')} className={inputClass} placeholder="Street address" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">City</label>
              <input {...register('city')} className={inputClass} placeholder="City" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">State</label>
              <input {...register('state')} className={inputClass} placeholder="State" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Country</label>
              <input {...register('country')} className={inputClass} placeholder="Country" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">ZIP Code</label>
              <input {...register('zipCode')} className={inputClass} placeholder="ZIP Code" />
            </div>

            {/* Business Information */}
            <div className="md:col-span-2 mt-2">
              <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider pb-2 border-b border-fm-neutral-100">Business Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Total Value (₹)</label>
              <input {...register('totalValue')} type="number" min="0" className={inputClass} placeholder="0" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">GST Number</label>
              <input {...register('gstNumber')} className={inputClass} placeholder="22AAAAA0000A1Z5" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Portal Password</label>
              <input {...register('portalPassword')} type="text" className={inputClass} placeholder="Password for client portal login" />
              <p className="text-xs text-fm-neutral-500 mt-1">Client will use this password to log into their portal</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">Health Status</label>
              <select {...register('health')} className={selectClass}>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="at-risk">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6 pt-6 border-t border-fm-neutral-200">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting} fullWidth className="sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              fullWidth
              className="sm:w-auto"
            >
              {isSubmitting ? 'Creating...' : 'Create Client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

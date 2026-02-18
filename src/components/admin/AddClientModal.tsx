/**
 * Add Client Modal Component
 * Form modal for creating new clients (react-hook-form + Zod validation)
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader } from 'lucide-react';
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

const inputClass = 'w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500';
const errorClass = 'text-xs text-red-600 mt-1';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-fm-neutral-200">
          <h2 className="text-xl font-semibold text-fm-neutral-900">Add New Client</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-fm-neutral-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-fm-neutral-900 mb-4">Basic Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Client Name *
              </label>
              <input {...register('name')} className={inputClass} placeholder="Enter client name" />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Email *
              </label>
              <input {...register('email')} type="email" className={inputClass} placeholder="Enter email address" />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Phone</label>
              <input {...register('phone')} type="tel" className={inputClass} placeholder="Enter phone number" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Industry
              </label>
              <select {...register('industry')} className={inputClass}>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>{INDUSTRY_LABELS[industry]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Website</label>
              <input {...register('website')} type="url" className={inputClass} placeholder="https://example.com" />
            </div>

            {/* Address Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-fm-neutral-900 mb-4">Address Information</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Address</label>
              <input {...register('address')} className={inputClass} placeholder="Street address" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">City</label>
              <input {...register('city')} className={inputClass} placeholder="City" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">State</label>
              <input {...register('state')} className={inputClass} placeholder="State" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Country</label>
              <input {...register('country')} className={inputClass} placeholder="Country" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">ZIP Code</label>
              <input {...register('zipCode')} className={inputClass} placeholder="ZIP Code" />
            </div>

            {/* Business Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-fm-neutral-900 mb-4">Business Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Total Value (₹)</label>
              <input {...register('totalValue')} type="number" min="0" className={inputClass} placeholder="0" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">GST Number</label>
              <input {...register('gstNumber')} className={inputClass} placeholder="22AAAAA0000A1Z5" />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Portal Password</label>
              <input {...register('portalPassword')} type="text" className={inputClass} placeholder="Password for client portal login" />
              <p className="text-xs text-fm-neutral-500 mt-1">Client will use this password to log into their portal</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">Health Status</label>
              <select {...register('health')} className={inputClass}>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="at-risk">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-fm-neutral-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              icon={isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : undefined}
            >
              {isSubmitting ? 'Creating...' : 'Create Client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

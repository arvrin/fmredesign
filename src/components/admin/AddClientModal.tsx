/**
 * Add Client Modal Component
 * Form modal for creating new clients
 */

'use client';

import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

const INDUSTRIES = [
  'technology',
  'healthcare', 
  'finance',
  'ecommerce',
  'education',
  'real_estate',
  'hospitality',
  'manufacturing',
  'retail',
  'automotive',
  'food_beverage',
  'consulting',
  'non_profit',
  'other'
];

const INDUSTRY_LABELS: Record<string, string> = {
  'technology': 'Technology',
  'healthcare': 'Healthcare',
  'finance': 'Finance & Banking',
  'ecommerce': 'E-commerce',
  'education': 'Education',
  'real_estate': 'Real Estate',
  'hospitality': 'Hospitality & Travel',
  'manufacturing': 'Manufacturing',
  'retail': 'Retail',
  'automotive': 'Automotive',
  'food_beverage': 'Food & Beverage',
  'consulting': 'Consulting',
  'non_profit': 'Non-Profit',
  'other': 'Other'
};

export function AddClientModal({ isOpen, onClose, onClientAdded }: AddClientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
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
    portalPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Save the properly structured client data to localStorage as well
        try {
          const existingClients = JSON.parse(localStorage.getItem('fm_admin_clients') || '[]');
          existingClients.push(result.data);
          localStorage.setItem('fm_admin_clients', JSON.stringify(existingClients));
        } catch (storageError) {
          console.warn('Failed to save to localStorage:', storageError);
        }
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
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
          portalPassword: ''
        });
        
        onClientAdded();
        onClose();
      } else {
        alert(`Error: ${result.error || 'Failed to create client'}`);
      }
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Failed to create client. Please try again.');
    } finally {
      setIsSubmitting(false);
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-fm-neutral-900 mb-4">Basic Information</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="Enter client name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Industry
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              >
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {INDUSTRY_LABELS[industry]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="https://example.com"
              />
            </div>

            {/* Address Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-fm-neutral-900 mb-4">Address Information</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="ZIP Code"
              />
            </div>

            {/* Business Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-fm-neutral-900 mb-4">Business Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Total Value (₹)
              </label>
              <input
                type="number"
                name="totalValue"
                value={formData.totalValue}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                GST Number
              </label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                placeholder="22AAAAA0000A1Z5"
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Portal Password
              </label>
              <input
                type="text"
                name="portalPassword"
                value={formData.portalPassword}
                onChange={handleInputChange}
                placeholder="Password for client portal login"
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              />
              <p className="text-xs text-fm-neutral-500 mt-1">
                Client will use this password to log into their portal
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-fm-neutral-700 mb-2">
                Health Status
              </label>
              <select
                name="health"
                value={formData.health}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-fm-neutral-300 rounded-lg focus:ring-2 focus:ring-fm-magenta-500 focus:border-fm-magenta-500"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-fm-neutral-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
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
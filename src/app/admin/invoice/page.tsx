/**
 * Invoice Generator Page
 * Main page for creating and managing invoices
 */

'use client';

import { InvoiceForm } from '@/components/admin/InvoiceForm';
import { AdminHeader } from '@/components/admin/Header';

export default function InvoicePage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-fm-neutral-900">Invoice Generator</h1>
            <p className="text-sm text-fm-neutral-500 mt-1">
              Create professional invoices that match your brand
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Form */}
      <InvoiceForm />
    </div>
  );
}
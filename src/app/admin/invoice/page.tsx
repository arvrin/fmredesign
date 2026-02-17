/**
 * Invoice Generator Page
 */

'use client';

import { InvoiceFormNew as InvoiceForm } from '@/components/admin/InvoiceFormNew';
import { PageHeader } from '@/components/ui/page-header';

export default function InvoicePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Invoice Generator"
        description="Create professional invoices that match your brand."
      />
      <InvoiceForm />
    </div>
  );
}

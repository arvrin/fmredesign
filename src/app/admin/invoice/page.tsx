/**
 * Invoice Generator Page
 */

'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { InvoiceFormNew as InvoiceForm } from '@/components/admin/InvoiceFormNew';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';

function InvoicePageContent() {
  const searchParams = useSearchParams();
  const isEdit = !!searchParams.get('edit');

  return (
    <div className="space-y-8">
      <PageHeader
        title={isEdit ? 'Edit Invoice' : 'Invoice Generator'}
        description={isEdit ? 'Update invoice details and save changes.' : 'Create professional invoices that match your brand.'}
      />
      <InvoiceForm />
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <InvoicePageContent />
    </Suspense>
  );
}

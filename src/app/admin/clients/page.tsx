/**
 * Admin Clients Page
 * Main client management interface — navigates to /admin/clients/[id] for detail
 */

'use client';

import { useRouter } from 'next/navigation';
import { ClientDashboard } from '@/components/admin/ClientDashboard';

export default function ClientsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <ClientDashboard
        onClientSelect={(client) => router.push(`/admin/clients/${client.id}`)}
      />
    </div>
  );
}

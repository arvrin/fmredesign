/**
 * Admin Clients Page
 * Main client management interface
 */

'use client';

import { useState } from 'react';
import { ClientDashboard } from '@/components/admin/ClientDashboard';
import { ClientProfile } from '@/components/admin/ClientProfile';
export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<{ id: string } | null>(null);

  const handleClientSelect = (client: { id: string }) => {
    setSelectedClient(client);
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
  };

  return (
    <div className="space-y-6">
      {selectedClient ? (
        <ClientProfile
          clientId={selectedClient.id}
          onBack={handleBackToClients}
        />
      ) : (
        <ClientDashboard onClientSelect={handleClientSelect} />
      )}
    </div>
  );
}
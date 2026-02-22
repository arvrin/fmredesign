'use client';

import { useState, useEffect } from 'react';
import {
  MetricCard,
  DashboardCard as Card,
  CardContent,
} from '@/design-system';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import { formatContractCurrency, type Contract } from '@/lib/admin/contract-types';
import { ContractReader } from '@/components/client-portal/ContractReader';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';

/* ═══════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════ */
export default function ClientContractsPage() {
  const { clientId } = useClientPortal();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;

    const fetchContracts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/client-portal/${clientId}/contracts`);
        if (res.ok) {
          const json = await res.json();
          setContracts(json.data || []);
        }
      } catch (err) {
        console.error('Error fetching contracts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [clientId]);

  const handleAction = async (
    contractId: string,
    action: 'accept' | 'reject' | 'request_edit'
  ) => {
    try {
      setActioningId(contractId);

      const res = await fetch(`/api/client-portal/${clientId}/contracts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId, action }),
      });

      if (res.ok) {
        const json = await res.json();
        const newStatus = json.data.status;

        setContracts((prev) =>
          prev.map((c) =>
            c.id === contractId
              ? {
                  ...c,
                  status: newStatus,
                  ...(action === 'accept' ? { acceptedAt: new Date().toISOString() } : {}),
                  ...(action === 'reject' ? { rejectedAt: new Date().toISOString() } : {}),
                }
              : c
          )
        );
        // Update the viewing contract too
        setViewingContract((prev) =>
          prev && prev.id === contractId
            ? { ...prev, status: newStatus, ...(action === 'accept' ? { acceptedAt: new Date().toISOString() } : {}), ...(action === 'reject' ? { rejectedAt: new Date().toISOString() } : {}) }
            : prev
        );
      }
    } catch (err) {
      console.error('Error performing contract action:', err);
    } finally {
      setActioningId(null);
    }
  };

  /* ── Metrics ── */
  const pendingCount = contracts.filter((c) => c.status === 'sent').length;
  const acceptedCount = contracts.filter((c) => c.status === 'accepted').length;
  const primaryCurrency = contracts[0]?.currency || 'INR';
  const totalContractValue = contracts
    .filter((c) => c.status === 'accepted')
    .reduce((sum, c) => sum + c.totalValue, 0);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Document reader overlay */}
      {viewingContract && (
        <ContractReader
          contract={viewingContract}
          onClose={() => setViewingContract(null)}
          onAction={handleAction}
          actioningId={actioningId}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-fm-neutral-900">
          Service <span className="v2-accent">Contracts</span>
        </h1>
        <p className="text-fm-neutral-600 mt-1 font-medium">
          Review and manage your service agreements
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <MetricCard
          title="Pending Review"
          value={pendingCount}
          subtitle="Awaiting your response"
          icon={<Clock className="w-6 h-6" />}
          variant="client"
        />
        <MetricCard
          title="Active Contracts"
          value={acceptedCount}
          subtitle="Accepted agreements"
          icon={<CheckCircle2 className="w-6 h-6" />}
          variant="client"
        />
        <MetricCard
          title="Total Value"
          value={formatContractCurrency(totalContractValue, primaryCurrency)}
          subtitle="Active contract value"
          icon={<Briefcase className="w-6 h-6" />}
          variant="client"
        />
      </div>

      {/* Contract Cards — Compact summary list */}
      {contracts.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="No contracts yet"
          description="Your service contracts will appear here once they're sent for review."
        />
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => (
            <Card
              key={contract.id}
              variant="client"
              hover
              className="cursor-pointer transition-all duration-150 hover:shadow-md"
              onClick={() => setViewingContract(contract)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                    contract.status === 'sent' ? 'bg-blue-50 text-blue-600' :
                    contract.status === 'accepted' ? 'bg-green-50 text-green-600' :
                    contract.status === 'rejected' ? 'bg-red-50 text-red-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="text-sm sm:text-base font-semibold text-fm-neutral-900 truncate">
                        {contract.title}
                      </h3>
                      <StatusBadge status={contract.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-fm-neutral-500 flex-wrap">
                      <span className="font-medium text-fm-neutral-700">
                        {formatContractCurrency(contract.totalValue, contract.currency)}
                      </span>
                      {contract.contractNumber && (
                        <span>#{contract.contractNumber}</span>
                      )}
                      {contract.startDate && (
                        <span className="hidden sm:inline">
                          {new Date(contract.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      {contract.services.length > 0 && (
                        <span className="hidden md:inline text-fm-neutral-400">
                          {contract.services.length} service{contract.services.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action hint */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {contract.status === 'sent' && (
                      <span className="hidden sm:inline text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                        Review
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-fm-neutral-400" />
                  </div>
                </div>

                {/* Client feedback callout */}
                {contract.clientFeedback && contract.status === 'edit_requested' && (
                  <div className="mt-3 p-2.5 bg-orange-50 border border-orange-200 rounded-md text-sm text-orange-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{contract.clientFeedback}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

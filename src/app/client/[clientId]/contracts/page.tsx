'use client';

import { useState, useEffect } from 'react';
import {
  MetricCard,
  DashboardCard as Card,
  CardContent,
  CardHeader,
  DashboardButton as Button,
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  XCircle,
  Edit3,
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import type { Contract } from '@/lib/admin/contract-types';

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
});

const statusColor = (status: string) => {
  switch (status) {
    case 'sent':           return 'bg-blue-100 text-blue-700';
    case 'accepted':       return 'bg-green-100 text-green-700';
    case 'rejected':       return 'bg-red-100 text-red-700';
    case 'edit_requested': return 'bg-orange-100 text-orange-700';
    default:               return 'bg-gray-100 text-gray-700';
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'sent':           return 'Pending Review';
    case 'accepted':       return 'Accepted';
    case 'rejected':       return 'Rejected';
    case 'edit_requested': return 'Edit Requested';
    default:               return status;
  }
};

export default function ClientContractsPage() {
  const { clientId } = useClientPortal();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
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
      const feedback = feedbackMap[contractId] || '';

      const res = await fetch(`/api/client-portal/${clientId}/contracts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId, action, feedback: feedback || undefined }),
      });

      if (res.ok) {
        const json = await res.json();
        const newStatus = json.data.status;

        // Optimistic update
        setContracts((prev) =>
          prev.map((c) =>
            c.id === contractId
              ? {
                  ...c,
                  status: newStatus,
                  clientFeedback: feedback || c.clientFeedback,
                  ...(action === 'accept' ? { acceptedAt: new Date().toISOString() } : {}),
                  ...(action === 'reject' ? { rejectedAt: new Date().toISOString() } : {}),
                }
              : c
          )
        );
        setExpandedId(null);
        setFeedbackMap((prev) => {
          const next = { ...prev };
          delete next[contractId];
          return next;
        });
      }
    } catch (err) {
      console.error('Error performing contract action:', err);
    } finally {
      setActioningId(null);
    }
  };

  const pendingCount = contracts.filter((c) => c.status === 'sent').length;
  const acceptedCount = contracts.filter((c) => c.status === 'accepted').length;
  const totalContractValue = contracts
    .filter((c) => c.status === 'accepted')
    .reduce((sum, c) => sum + c.totalValue, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fm-magenta-600" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-fm-neutral-900">
          Service <span className="v2-accent">Contracts</span>
        </h1>
        <p className="text-fm-neutral-600 mt-1 font-medium">
          Review and manage your service agreements
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          value={INR.format(totalContractValue)}
          subtitle="Active contract value"
          icon={<DollarSign className="w-6 h-6" />}
          variant="client"
        />
      </div>

      {/* Contract Cards */}
      {contracts.length === 0 ? (
        <Card variant="client" className="p-12" style={{ textAlign: 'center' as const }}>
          <FileText className="w-16 h-16 text-fm-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">
            No contracts yet
          </h3>
          <p className="text-fm-neutral-600">
            Your service contracts will appear here once they&apos;re sent for review.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {contracts.map((contract) => (
            <Card key={contract.id} variant="client" hover glow>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-fm-neutral-900 text-lg">
                      {contract.title}
                    </h3>
                    {contract.contractNumber && (
                      <span className="text-xs text-fm-neutral-500">
                        #{contract.contractNumber}
                      </span>
                    )}
                  </div>
                  <Badge className={statusColor(contract.status)} variant="secondary">
                    {statusLabel(contract.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Services List */}
                <div>
                  <h4 className="text-sm font-medium text-fm-neutral-700 mb-2">Services</h4>
                  <div className="space-y-2">
                    {contract.services.map((svc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 px-3 bg-fm-neutral-50 rounded-lg"
                      >
                        <div>
                          <span className="text-sm font-medium text-fm-neutral-900">
                            {svc.name}
                          </span>
                          {svc.description && (
                            <p className="text-xs text-fm-neutral-500">{svc.description}</p>
                          )}
                        </div>
                        <div className="text-sm text-fm-neutral-700">
                          {svc.quantity > 1 && (
                            <span className="text-fm-neutral-500 mr-1">
                              {svc.quantity} x {INR.format(svc.unitPrice)}
                            </span>
                          )}
                          <span className="font-medium">{INR.format(svc.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-sm text-fm-neutral-600 mr-2">Total:</span>
                    <span className="text-lg font-bold text-fm-neutral-900">
                      {INR.format(contract.totalValue)}
                    </span>
                  </div>
                </div>

                {/* Contract Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {contract.startDate && (
                    <div>
                      <span className="text-fm-neutral-500 block">Start Date</span>
                      <span className="text-fm-neutral-900 font-medium">
                        {new Date(contract.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {contract.endDate && (
                    <div>
                      <span className="text-fm-neutral-500 block">End Date</span>
                      <span className="text-fm-neutral-900 font-medium">
                        {new Date(contract.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {contract.billingCycle && (
                    <div>
                      <span className="text-fm-neutral-500 block">Billing</span>
                      <span className="text-fm-neutral-900 font-medium capitalize">
                        {contract.billingCycle}
                      </span>
                    </div>
                  )}
                  {contract.paymentTerms && (
                    <div>
                      <span className="text-fm-neutral-500 block">Payment Terms</span>
                      <span className="text-fm-neutral-900 font-medium">
                        {contract.paymentTerms}
                      </span>
                    </div>
                  )}
                </div>

                {/* Terms & Conditions */}
                {contract.termsAndConditions && (
                  <div className="pt-3 border-t border-fm-neutral-100">
                    <h4 className="text-sm font-medium text-fm-neutral-700 mb-1">
                      Terms & Conditions
                    </h4>
                    <p className="text-sm text-fm-neutral-600 whitespace-pre-line">
                      {contract.termsAndConditions}
                    </p>
                  </div>
                )}

                {/* Previous feedback */}
                {contract.clientFeedback && contract.status !== 'sent' && (
                  <div className="pt-2 border-t border-fm-neutral-100">
                    <p className="text-xs text-fm-neutral-500 mb-1">Your Feedback</p>
                    <p className="text-sm text-fm-neutral-700 bg-fm-neutral-50 rounded-md p-2">
                      {contract.clientFeedback}
                    </p>
                  </div>
                )}

                {/* Action Buttons — only for "sent" status */}
                {contract.status === 'sent' && (
                  <div className="pt-3 border-t border-fm-neutral-100 space-y-2">
                    {expandedId === contract.id ? (
                      <>
                        <textarea
                          value={feedbackMap[contract.id] || ''}
                          onChange={(e) =>
                            setFeedbackMap((prev) => ({
                              ...prev,
                              [contract.id]: e.target.value,
                            }))
                          }
                          placeholder="Add feedback or comments (optional)..."
                          rows={3}
                          className="w-full rounded-md border border-fm-neutral-300 bg-fm-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-500"
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            variant="client"
                            size="sm"
                            disabled={actioningId === contract.id}
                            onClick={() => handleAction(contract.id, 'accept')}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Accept Contract
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            disabled={actioningId === contract.id}
                            onClick={() => handleAction(contract.id, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:bg-orange-50"
                            disabled={actioningId === contract.id}
                            onClick={() => handleAction(contract.id, 'request_edit')}
                          >
                            <Edit3 className="w-4 h-4 mr-1" />
                            Request Edits
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="client"
                          size="sm"
                          onClick={() => setExpandedId(contract.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Accept Contract
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => setExpandedId(contract.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-orange-600 hover:bg-orange-50"
                          onClick={() => setExpandedId(contract.id)}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Request Edits
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Status-specific info */}
                {contract.status === 'accepted' && contract.acceptedAt && (
                  <div className="pt-2 border-t border-fm-neutral-100 flex items-center text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Accepted on {new Date(contract.acceptedAt).toLocaleDateString()}
                  </div>
                )}
                {contract.status === 'rejected' && contract.rejectedAt && (
                  <div className="pt-2 border-t border-fm-neutral-100 flex items-center text-sm text-red-700">
                    <XCircle className="w-4 h-4 mr-1" />
                    Rejected on {new Date(contract.rejectedAt).toLocaleDateString()}
                  </div>
                )}
                {contract.status === 'edit_requested' && (
                  <div className="pt-2 border-t border-fm-neutral-100 flex items-center text-sm text-orange-700">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Edit requested — waiting for updated contract
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

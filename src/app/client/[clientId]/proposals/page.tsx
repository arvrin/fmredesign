'use client';

import { useState, useEffect } from 'react';
import {
  MetricCard,
  DashboardCard as Card,
  CardContent,
} from '@/design-system';
import {
  FileText,
  Clock,
  CheckCircle2,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';

interface Proposal {
  id: string;
  proposalNumber: string;
  title: string;
  proposalType: string;
  status: string;
  validUntil: string;
  investment: { total?: number; currency?: string; breakdown?: Array<{ item: string; amount: number }> };
  servicePackages: Array<{ name: string; description?: string; price?: number }>;
  customServices: Array<{ name: string; description?: string; price?: number }>;
  timeline: { duration?: string; startDate?: string; phases?: Array<{ name: string; duration: string }> };
  executiveSummary: string | null;
  proposedSolution: string | null;
  nextSteps: string | null;
  sentAt: string | null;
  viewedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
}

export default function ClientProposalsPage() {
  const { clientId } = useClientPortal();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;

    const fetchProposals = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/client-portal/${clientId}/proposals`);
        if (res.ok) {
          const json = await res.json();
          setProposals(json.data || []);
        }
      } catch (err) {
        console.error('Error fetching proposals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [clientId]);

  const pendingCount = proposals.filter((p) => p.status === 'sent' || p.status === 'viewed').length;
  const approvedCount = proposals.filter((p) => p.status === 'approved' || p.status === 'converted').length;
  const totalValue = proposals
    .filter((p) => p.status === 'approved' || p.status === 'converted')
    .reduce((sum, p) => sum + (p.investment?.total || 0), 0);
  const proposalCurrency = proposals.find(p => p.investment?.currency)?.investment?.currency || 'INR';

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-fm-neutral-900">
          Service <span className="v2-accent">Proposals</span>
        </h1>
        <p className="text-fm-neutral-600 mt-1 font-medium">
          Review proposals and service recommendations
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <MetricCard
          title="Pending Review"
          value={pendingCount}
          subtitle="Awaiting your review"
          icon={<Clock className="w-6 h-6" />}
          variant="client"
        />
        <MetricCard
          title="Approved"
          value={approvedCount}
          subtitle="Approved proposals"
          icon={<CheckCircle2 className="w-6 h-6" />}
          variant="client"
        />
        <MetricCard
          title="Total Value"
          value={totalValue > 0 ? (proposalCurrency === 'INR' ? `₹${totalValue.toLocaleString()}` : `${proposalCurrency} ${totalValue.toLocaleString()}`) : '—'}
          subtitle="Approved proposal value"
          icon={<DollarSign className="w-6 h-6" />}
          variant="client"
        />
      </div>

      {/* Proposal Cards */}
      {proposals.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="No proposals yet"
          description="Your service proposals will appear here once they're sent for review."
        />
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal) => {
            const isExpanded = expandedId === proposal.id;
            return (
              <Card key={proposal.id} variant="client" hover>
                <CardContent className="p-4 sm:p-5">
                  {/* Summary row */}
                  <div
                    className="flex items-center gap-3 sm:gap-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : proposal.id)}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                      proposal.status === 'approved' || proposal.status === 'converted'
                        ? 'bg-green-50 text-green-600'
                        : proposal.status === 'declined' || proposal.status === 'expired'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="text-sm sm:text-base font-semibold text-fm-neutral-900 truncate">
                          {proposal.title}
                        </h3>
                        <StatusBadge status={proposal.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-fm-neutral-500 flex-wrap">
                        {proposal.proposalNumber && (
                          <span>#{proposal.proposalNumber}</span>
                        )}
                        <span className="capitalize">{proposal.proposalType}</span>
                        {proposal.investment?.total && (
                          <span className="font-medium text-fm-neutral-700">
                            {(proposal.investment?.currency === 'INR' || !proposal.investment?.currency) ? '₹' : proposal.investment.currency + ' '}{proposal.investment.total.toLocaleString()}
                          </span>
                        )}
                        {proposal.validUntil && (
                          <span className="hidden sm:inline">
                            Valid until {new Date(proposal.validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-fm-neutral-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-fm-neutral-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-fm-neutral-100 space-y-4">
                      {proposal.executiveSummary && (
                        <div>
                          <h4 className="text-sm font-semibold text-fm-neutral-800 mb-1">Executive Summary</h4>
                          <p className="text-sm text-fm-neutral-600 leading-relaxed">{proposal.executiveSummary}</p>
                        </div>
                      )}

                      {proposal.proposedSolution && (
                        <div>
                          <h4 className="text-sm font-semibold text-fm-neutral-800 mb-1">Proposed Solution</h4>
                          <p className="text-sm text-fm-neutral-600 leading-relaxed">{proposal.proposedSolution}</p>
                        </div>
                      )}

                      {/* Services */}
                      {(proposal.servicePackages.length > 0 || proposal.customServices.length > 0) && (
                        <div>
                          <h4 className="text-sm font-semibold text-fm-neutral-800 mb-2">Services Included</h4>
                          <div className="space-y-2">
                            {proposal.servicePackages.map((pkg, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-fm-neutral-50 rounded-lg text-sm">
                                <div>
                                  <span className="font-medium text-fm-neutral-900">{pkg.name}</span>
                                  {pkg.description && (
                                    <p className="text-xs text-fm-neutral-500 mt-0.5">{pkg.description}</p>
                                  )}
                                </div>
                                {pkg.price && (
                                  <span className="text-fm-neutral-700 font-medium">{(proposal.investment?.currency === 'INR' || !proposal.investment?.currency) ? '₹' : proposal.investment?.currency + ' '}{pkg.price.toLocaleString()}</span>
                                )}
                              </div>
                            ))}
                            {proposal.customServices.map((svc, idx) => (
                              <div key={`custom-${idx}`} className="flex items-center justify-between p-2 bg-fm-neutral-50 rounded-lg text-sm">
                                <div>
                                  <span className="font-medium text-fm-neutral-900">{svc.name}</span>
                                  {svc.description && (
                                    <p className="text-xs text-fm-neutral-500 mt-0.5">{svc.description}</p>
                                  )}
                                </div>
                                {svc.price && (
                                  <span className="text-fm-neutral-700 font-medium">{(proposal.investment?.currency === 'INR' || !proposal.investment?.currency) ? '₹' : proposal.investment?.currency + ' '}{svc.price.toLocaleString()}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timeline */}
                      {proposal.timeline?.duration && (
                        <div className="flex items-center gap-2 text-sm text-fm-neutral-600">
                          <Calendar className="w-4 h-4" />
                          <span>Estimated timeline: {proposal.timeline.duration}</span>
                        </div>
                      )}

                      {/* Next Steps */}
                      {proposal.nextSteps && (
                        <div>
                          <h4 className="text-sm font-semibold text-fm-neutral-800 mb-1">Next Steps</h4>
                          <p className="text-sm text-fm-neutral-600 leading-relaxed">{proposal.nextSteps}</p>
                        </div>
                      )}

                      {/* Dates */}
                      <div className="flex items-center gap-4 text-xs text-fm-neutral-500 pt-2 border-t border-fm-neutral-100">
                        {proposal.sentAt && (
                          <span>Sent: {new Date(proposal.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        )}
                        {proposal.viewedAt && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Viewed: {new Date(proposal.viewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                        {proposal.approvedAt && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved: {new Date(proposal.approvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

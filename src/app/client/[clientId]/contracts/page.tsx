'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MetricCard,
  DashboardCard as Card,
  CardContent,
  DashboardButton as Button,
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Edit3,
  Download,
  Send,
  FileCheck,
  Briefcase,
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import { formatContractCurrency, type Contract } from '@/lib/admin/contract-types';
import { getBankInfoForCurrency, type BankAccountInfo } from '@/lib/admin/types';

/* ───────── Status helpers ───────── */
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

/* ───────── Status timeline steps ───────── */
const TIMELINE_STEPS = [
  { key: 'sent', label: 'Sent', icon: Send },
  { key: 'reviewed', label: 'Reviewed', icon: FileCheck },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle2 },
];

function ContractTimeline({ contract }: { contract: Contract }) {
  const getStep = () => {
    if (contract.status === 'accepted') return 3;
    if (contract.status === 'rejected' || contract.status === 'edit_requested') return 2;
    return 1; // sent
  };
  const currentStep = getStep();

  return (
    <div className="flex items-center gap-1 w-full">
      {TIMELINE_STEPS.map((step, idx) => {
        const StepIcon = step.icon;
        const isComplete = idx < currentStep;
        const isCurrent = idx === currentStep - 1;
        const isRejected = isCurrent && (contract.status === 'rejected' || contract.status === 'edit_requested');

        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isRejected
                    ? 'bg-orange-100 text-orange-600'
                    : isComplete
                    ? 'bg-green-100 text-green-600'
                    : 'bg-fm-neutral-100 text-fm-neutral-400'
                }`}
              >
                <StepIcon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isRejected
                    ? 'text-orange-600'
                    : isComplete
                    ? 'text-green-600'
                    : 'text-fm-neutral-400'
                }`}
              >
                {isRejected ? (contract.status === 'rejected' ? 'Rejected' : 'Edits') : step.label}
              </span>
            </div>
            {idx < TIMELINE_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mt-[-14px] ${
                  idx < currentStep - 1 ? 'bg-green-300' : 'bg-fm-neutral-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ───────── Numbered T&C renderer ───────── */
function NumberedTerms({ text }: { text: string }) {
  const lines = text.split('\n').filter((l) => l.trim());
  let clauseNum = 0;

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        // Detect section headers (lines ending with :) vs bullet points
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
        const isHeader = trimmed.endsWith(':') && !isBullet;

        if (isHeader) {
          clauseNum++;
          return (
            <div key={idx} className="mt-3 first:mt-0">
              <span className="text-sm font-semibold text-fm-neutral-800">
                {clauseNum}. {trimmed}
              </span>
            </div>
          );
        }

        return (
          <p
            key={idx}
            className={`text-sm text-fm-neutral-600 ${isBullet ? 'pl-6' : 'pl-4'}`}
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

/* ───────── PDF download ───────── */
async function downloadContractPDF(contract: Contract) {
  const { default: jsPDF } = await import('jspdf');

  const doc = new jsPDF('portrait', 'mm', 'a4');
  const W = doc.internal.pageSize.getWidth();
  const M = 20; // margin
  const fmt = (n: number) => formatContractCurrency(n, contract.currency);
  let y = 0;

  // ── Brand bar
  doc.setFillColor(199, 50, 118);
  doc.rect(0, 0, W, 5, 'F');

  // ── Company header
  y = 16;
  doc.setFillColor(199, 50, 118);
  doc.rect(M, 10, 22, 22, 'F');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('FM', M + 6.5, 23);

  doc.setFontSize(24);
  doc.setTextColor(26, 26, 26);
  doc.text('FREAKING MINDS', M + 27, y + 3);
  doc.setFontSize(10);
  doc.setTextColor(199, 50, 118);
  doc.text('CREATIVE DIGITAL AGENCY', M + 27, y + 10);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('www.freakingminds.in  |  hello@freakingminds.in', M + 27, y + 16);

  // ── Separator
  y = 42;
  doc.setDrawColor(199, 50, 118);
  doc.setLineWidth(1.5);
  doc.line(M, y, W - M, y);

  // ── Contract title (full width, above the badge)
  y = 50;
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 26);
  const titleLines = doc.splitTextToSize(contract.title, W - 2 * M);
  titleLines.forEach((line: string, i: number) => {
    doc.text(line, M, y + (i * 6));
  });
  y += titleLines.length * 6 + 4;

  // ── CONTRACT badge box (right-aligned, below title)
  const badgeW = 65;
  const badgeH = 20;
  doc.setFillColor(26, 26, 26);
  doc.rect(W - M - badgeW, y, badgeW, badgeH, 'F');
  doc.setDrawColor(199, 50, 118);
  doc.setLineWidth(1);
  doc.rect(W - M - badgeW, y, badgeW, badgeH);
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('SERVICE CONTRACT', W - M - badgeW / 2, y + 9, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(199, 50, 118);
  doc.text(contract.contractNumber ? `#${contract.contractNumber}` : '', W - M - badgeW / 2, y + 16, {
    align: 'center',
  });
  y += badgeH + 6;

  // ── Contract meta
  doc.setFillColor(249, 250, 251);
  doc.rect(M, y, W - 2 * M, 20, 'F');
  doc.setDrawColor(229, 229, 229);
  doc.setLineWidth(0.5);
  doc.rect(M, y, W - 2 * M, 20);

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Start Date', M + 4, y + 6);
  doc.text('End Date', M + 44, y + 6);
  doc.text('Billing Cycle', M + 84, y + 6);
  doc.text('Payment Terms', M + 124, y + 6);

  doc.setFontSize(10);
  doc.setTextColor(26, 26, 26);
  doc.text(
    contract.startDate ? new Date(contract.startDate).toLocaleDateString('en-GB') : '—',
    M + 4,
    y + 14
  );
  doc.text(
    contract.endDate ? new Date(contract.endDate).toLocaleDateString('en-GB') : 'Ongoing',
    M + 44,
    y + 14
  );
  doc.text(contract.billingCycle || '—', M + 84, y + 14);
  doc.text(contract.paymentTerms || '—', M + 124, y + 14);

  // ── Services table
  y += 28;
  doc.setFontSize(12);
  doc.setTextColor(26, 26, 26);
  doc.text('Scope of Services', M, y);
  y += 6;

  // Table header
  doc.setFillColor(26, 26, 26);
  doc.rect(M, y, W - 2 * M, 8, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('Service', M + 3, y + 5.5);
  doc.text('Qty', M + 100, y + 5.5);
  doc.text('Unit Price', M + 115, y + 5.5);
  doc.text('Total', W - M - 3, y + 5.5, { align: 'right' });
  y += 8;

  // Table rows
  contract.services.forEach((svc, idx) => {
    const rowH = svc.description ? 14 : 8;
    if (idx % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(M, y, W - 2 * M, rowH, 'F');
    }
    doc.setFontSize(9);
    doc.setTextColor(26, 26, 26);
    doc.text(svc.name, M + 3, y + 5.5);
    doc.text(String(svc.quantity), M + 100, y + 5.5);
    doc.text(fmt(svc.unitPrice), M + 115, y + 5.5);
    doc.text(fmt(svc.total), W - M - 3, y + 5.5, { align: 'right' });

    if (svc.description) {
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      const descLines = doc.splitTextToSize(svc.description, 90);
      doc.text(descLines[0] || '', M + 3, y + 11);
    }
    y += rowH;
  });

  // Total row
  doc.setDrawColor(199, 50, 118);
  doc.setLineWidth(1);
  doc.line(M + 100, y, W - M, y);
  y += 6;
  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.text('Total Contract Value', M + 100, y);
  doc.setTextColor(199, 50, 118);
  doc.text(fmt(contract.totalValue), W - M - 3, y, { align: 'right' });

  // ── Terms & Conditions
  if (contract.termsAndConditions) {
    y += 14;
    doc.setFontSize(12);
    doc.setTextColor(26, 26, 26);
    doc.text('Terms & Conditions', M, y);
    y += 6;
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const termLines = doc.splitTextToSize(contract.termsAndConditions, W - 2 * M);
    termLines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, M, y);
      y += 4;
    });
  }

  // ── Bank Details
  const bankInfo = getBankInfoForCurrency(contract.currency || 'INR');
  y += 10;
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(12);
  doc.setTextColor(26, 26, 26);
  doc.text('Bank Details for Payment', M, y);
  y += 6;

  const bankBoxH = bankInfo.swiftCode ? 28 : 22;
  doc.setFillColor(249, 250, 251);
  doc.rect(M, y, W - 2 * M, bankBoxH, 'F');
  doc.setDrawColor(229, 229, 229);
  doc.setLineWidth(0.5);
  doc.rect(M, y, W - 2 * M, bankBoxH);

  doc.setFontSize(9);
  doc.setTextColor(26, 26, 26);
  doc.text(`Account Name: ${bankInfo.accountName}`, M + 4, y + 6);
  doc.text(`Account Number: ${bankInfo.accountNumber}`, M + 4, y + 11);
  doc.text(`Bank: ${bankInfo.bankName}`, M + 90, y + 6);
  doc.text(`IFSC: ${bankInfo.ifscCode}`, M + 90, y + 11);
  if (bankInfo.swiftCode) {
    doc.text(`SWIFT Code: ${bankInfo.swiftCode}`, M + 4, y + 16);
    doc.text(`Branch: ${bankInfo.branch || ''}`, M + 90, y + 16);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('For international transfers, we recommend using Wise for lower fees.', M + 4, y + 23);
  } else {
    if (bankInfo.branch) {
      doc.text(`Branch: ${bankInfo.branch}`, M + 4, y + 16);
    }
  }
  y += bankBoxH;

  // ── Acceptance record
  if (contract.status === 'accepted' && contract.acceptedAt) {
    y += 10;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(240, 253, 244);
    doc.rect(M, y, W - 2 * M, 20, 'F');
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.8);
    doc.rect(M, y, W - 2 * M, 20);
    doc.setFontSize(10);
    doc.setTextColor(22, 101, 52);
    doc.text('DIGITALLY ACCEPTED', M + 4, y + 8);
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `Accepted on ${new Date(contract.acceptedAt).toLocaleDateString('en-GB')} at ${new Date(contract.acceptedAt).toLocaleTimeString('en-GB')}`,
      M + 4,
      y + 14
    );
    if (contract.clientFeedback) {
      doc.text(`Client notes: ${contract.clientFeedback}`, M + 4, y + 18);
    }
  }

  // ── Footer
  const footY = doc.internal.pageSize.getHeight() - 10;
  doc.setDrawColor(229, 229, 229);
  doc.setLineWidth(0.3);
  doc.line(M, footY - 4, W - M, footY - 4);
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text('Freaking Minds Digital Agency  |  www.freakingminds.in', W / 2, footY, {
    align: 'center',
  });

  doc.save(`Contract-${contract.contractNumber || contract.id}.pdf`);
}

/* ═══════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════ */
export default function ClientContractsPage() {
  const { clientId } = useClientPortal();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedAction, setExpandedAction] = useState<'accept' | 'reject' | 'request_edit' | null>(null);
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
        setExpandedAction(null);
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

  /* ── Metrics ── */
  const pendingCount = contracts.filter((c) => c.status === 'sent').length;
  const acceptedCount = contracts.filter((c) => c.status === 'accepted').length;
  // For total value display, use first contract's currency or default
  const primaryCurrency = contracts[0]?.currency || 'INR';
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
          value={formatContractCurrency(totalContractValue, primaryCurrency)}
          subtitle="Active contract value"
          icon={<Briefcase className="w-6 h-6" />}
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
        <div className="space-y-8">
          {contracts.map((contract) => {
            const fmt = (n: number) => formatContractCurrency(n, contract.currency);

            return (
              <Card key={contract.id} variant="client" hover glow className="overflow-hidden">
                {/* ── Branded header bar ── */}
                <div className="bg-gradient-to-r from-fm-neutral-900 to-fm-neutral-800 px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src="/logo-white.png"
                          alt="Freaking Minds"
                          className="h-5 w-auto object-contain"
                        />
                        <span className="text-fm-neutral-400 text-xs tracking-wide uppercase">
                          Freaking Minds
                        </span>
                      </div>
                      <h3 className="font-semibold text-white text-lg">
                        {contract.title}
                      </h3>
                      {contract.contractNumber && (
                        <span className="text-fm-neutral-400 text-xs">
                          Contract #{contract.contractNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColor(contract.status)} variant="secondary">
                        {statusLabel(contract.status)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-fm-neutral-400 hover:text-white hover:bg-white/10"
                        onClick={() => downloadContractPDF(contract)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-5">
                  {/* ── Status timeline ── */}
                  <div className="px-4">
                    <ContractTimeline contract={contract} />
                  </div>

                  {/* ── Scope of services table ── */}
                  <div>
                    <h4 className="text-sm font-semibold text-fm-neutral-800 mb-3 uppercase tracking-wide">
                      Scope of Services
                    </h4>
                    <div className="border border-fm-neutral-200 rounded-lg overflow-hidden">
                      {/* Table header */}
                      <div className="grid grid-cols-12 gap-2 bg-fm-neutral-100 px-4 py-2 text-xs font-semibold text-fm-neutral-600 uppercase tracking-wide">
                        <div className="col-span-6">Service</div>
                        <div className="col-span-1" style={{ textAlign: 'center' }}>Qty</div>
                        <div className="col-span-2" style={{ textAlign: 'right' }}>Unit Price</div>
                        <div className="col-span-3" style={{ textAlign: 'right' }}>Total</div>
                      </div>
                      {/* Table rows */}
                      {contract.services.map((svc, idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-12 gap-2 px-4 py-3 items-start ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-fm-neutral-50'
                          } ${idx < contract.services.length - 1 ? 'border-b border-fm-neutral-100' : ''}`}
                        >
                          <div className="col-span-6">
                            <span className="text-sm font-medium text-fm-neutral-900">
                              {svc.name}
                            </span>
                            {svc.description && (
                              <p className="text-xs text-fm-neutral-500 mt-0.5 line-clamp-2">
                                {svc.description}
                              </p>
                            )}
                          </div>
                          <div className="col-span-1 text-sm text-fm-neutral-700" style={{ textAlign: 'center' }}>
                            {svc.quantity}
                          </div>
                          <div className="col-span-2 text-sm text-fm-neutral-700" style={{ textAlign: 'right' }}>
                            {fmt(svc.unitPrice)}
                          </div>
                          <div className="col-span-3 text-sm font-medium text-fm-neutral-900" style={{ textAlign: 'right' }}>
                            {fmt(svc.total)}
                          </div>
                        </div>
                      ))}
                      {/* Total row */}
                      <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-fm-neutral-900">
                        <div className="col-span-9 text-sm font-semibold text-white">
                          Total Contract Value
                        </div>
                        <div className="col-span-3 text-lg font-bold text-fm-magenta-400" style={{ textAlign: 'right' }}>
                          {fmt(contract.totalValue)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Contract details grid ── */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {contract.startDate && (
                      <div className="bg-fm-neutral-50 rounded-lg p-3">
                        <span className="text-xs text-fm-neutral-500 block mb-1">Start Date</span>
                        <span className="text-sm text-fm-neutral-900 font-medium">
                          {new Date(contract.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                    {contract.endDate && (
                      <div className="bg-fm-neutral-50 rounded-lg p-3">
                        <span className="text-xs text-fm-neutral-500 block mb-1">End Date</span>
                        <span className="text-sm text-fm-neutral-900 font-medium">
                          {new Date(contract.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                    {contract.billingCycle && (
                      <div className="bg-fm-neutral-50 rounded-lg p-3">
                        <span className="text-xs text-fm-neutral-500 block mb-1">Billing Cycle</span>
                        <span className="text-sm text-fm-neutral-900 font-medium capitalize">
                          {contract.billingCycle}
                        </span>
                      </div>
                    )}
                    {contract.paymentTerms && (
                      <div className="bg-fm-neutral-50 rounded-lg p-3">
                        <span className="text-xs text-fm-neutral-500 block mb-1">Payment Terms</span>
                        <span className="text-sm text-fm-neutral-900 font-medium">
                          {contract.paymentTerms}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── Bank Details ── */}
                  {(() => {
                    const bank = getBankInfoForCurrency(contract.currency || 'INR');
                    return (
                      <div className="pt-4 border-t border-fm-neutral-100">
                        <h4 className="text-sm font-semibold text-fm-neutral-800 mb-3 uppercase tracking-wide">
                          Bank Details for Payment
                        </h4>
                        <div className="bg-fm-neutral-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-fm-neutral-500 text-xs block">Account Name</span>
                              <span className="text-fm-neutral-900 font-medium">{bank.accountName}</span>
                            </div>
                            <div>
                              <span className="text-fm-neutral-500 text-xs block">Bank</span>
                              <span className="text-fm-neutral-900 font-medium">{bank.bankName}</span>
                            </div>
                            <div>
                              <span className="text-fm-neutral-500 text-xs block">Account Number</span>
                              <span className="text-fm-neutral-900 font-medium">{bank.accountNumber}</span>
                            </div>
                            <div>
                              <span className="text-fm-neutral-500 text-xs block">IFSC Code</span>
                              <span className="text-fm-neutral-900 font-medium">{bank.ifscCode}</span>
                            </div>
                            {bank.swiftCode && (
                              <div>
                                <span className="text-fm-neutral-500 text-xs block">SWIFT Code</span>
                                <span className="text-fm-neutral-900 font-medium">{bank.swiftCode}</span>
                              </div>
                            )}
                            {bank.branch && (
                              <div>
                                <span className="text-fm-neutral-500 text-xs block">Branch</span>
                                <span className="text-fm-neutral-900 font-medium">{bank.branch}</span>
                              </div>
                            )}
                          </div>
                          {bank.swiftCode && (
                            <p className="text-xs text-fm-neutral-500 mt-3 pt-2 border-t border-fm-neutral-200">
                              For international transfers, we recommend using Wise for lower fees.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* ── Terms & Conditions (numbered) ── */}
                  {contract.termsAndConditions && (
                    <div className="pt-4 border-t border-fm-neutral-100">
                      <h4 className="text-sm font-semibold text-fm-neutral-800 mb-3 uppercase tracking-wide">
                        Terms & Conditions
                      </h4>
                      <div className="bg-fm-neutral-50 rounded-lg p-4">
                        <NumberedTerms text={contract.termsAndConditions} />
                      </div>
                    </div>
                  )}

                  {/* ── Previous feedback ── */}
                  {contract.clientFeedback && contract.status !== 'sent' && (
                    <div className="pt-3 border-t border-fm-neutral-100">
                      <p className="text-xs text-fm-neutral-500 mb-1">Your Feedback</p>
                      <p className="text-sm text-fm-neutral-700 bg-fm-neutral-50 rounded-md p-3">
                        {contract.clientFeedback}
                      </p>
                    </div>
                  )}

                  {/* ── Action Buttons — only for "sent" status ── */}
                  {contract.status === 'sent' && (
                    <div className="pt-4 border-t border-fm-neutral-100 space-y-3">
                      {expandedId === contract.id && expandedAction ? (
                        <>
                          {/* Contextual header */}
                          <div className={`text-sm font-medium px-3 py-2 rounded-md ${
                            expandedAction === 'accept'
                              ? 'bg-green-50 text-green-700'
                              : expandedAction === 'reject'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-orange-50 text-orange-700'
                          }`}>
                            {expandedAction === 'accept' && 'You are accepting this contract'}
                            {expandedAction === 'reject' && 'You are rejecting this contract'}
                            {expandedAction === 'request_edit' && 'Describe the changes you need'}
                          </div>
                          <textarea
                            value={feedbackMap[contract.id] || ''}
                            onChange={(e) =>
                              setFeedbackMap((prev) => ({
                                ...prev,
                                [contract.id]: e.target.value,
                              }))
                            }
                            placeholder={
                              expandedAction === 'request_edit'
                                ? 'Describe the changes you would like us to make...'
                                : 'Add any comments or notes (optional)...'
                            }
                            rows={3}
                            className="w-full rounded-md border border-fm-neutral-300 bg-fm-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-500"
                          />
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <Button
                              variant={expandedAction === 'accept' ? 'client' : 'ghost'}
                              size="sm"
                              className={
                                expandedAction === 'reject'
                                  ? 'text-red-600 hover:bg-red-50 border border-red-200'
                                  : expandedAction === 'request_edit'
                                  ? 'text-orange-600 hover:bg-orange-50 border border-orange-200'
                                  : ''
                              }
                              disabled={
                                actioningId === contract.id ||
                                (expandedAction === 'request_edit' && !(feedbackMap[contract.id] || '').trim())
                              }
                              onClick={() => handleAction(contract.id, expandedAction)}
                            >
                              {expandedAction === 'accept' && <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                              {expandedAction === 'reject' && <XCircle className="w-4 h-4 mr-1.5" />}
                              {expandedAction === 'request_edit' && <Send className="w-4 h-4 mr-1.5" />}
                              {actioningId === contract.id
                                ? 'Sending...'
                                : expandedAction === 'accept'
                                ? 'Confirm & Accept'
                                : expandedAction === 'reject'
                                ? 'Confirm Rejection'
                                : 'Send Edit Request'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setExpandedId(null); setExpandedAction(null); }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <Button
                            variant="client"
                            size="sm"
                            onClick={() => { setExpandedId(contract.id); setExpandedAction('accept'); }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Accept Contract
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:bg-orange-50 border border-orange-200"
                            onClick={() => { setExpandedId(contract.id); setExpandedAction('request_edit'); }}
                          >
                            <Edit3 className="w-4 h-4 mr-1.5" />
                            Request Edits
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => { setExpandedId(contract.id); setExpandedAction('reject'); }}
                          >
                            <XCircle className="w-4 h-4 mr-1.5" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Digital acceptance record ── */}
                  {contract.status === 'accepted' && contract.acceptedAt && (
                    <div className="pt-4 border-t border-fm-neutral-100">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">
                            Digitally Accepted
                          </span>
                        </div>
                        <p className="text-sm text-green-700">
                          Accepted on{' '}
                          {new Date(contract.acceptedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}{' '}
                          at {new Date(contract.acceptedAt).toLocaleTimeString('en-GB')}
                        </p>
                        {contract.clientFeedback && (
                          <p className="text-xs text-green-600 mt-1">
                            Notes: {contract.clientFeedback}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {contract.status === 'rejected' && contract.rejectedAt && (
                    <div className="pt-3 border-t border-fm-neutral-100">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-sm text-red-700">
                        <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        Rejected on {new Date(contract.rejectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  )}

                  {contract.status === 'edit_requested' && (
                    <div className="pt-3 border-t border-fm-neutral-100">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center text-sm text-orange-700">
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        Edit requested — waiting for updated contract from Freaking Minds
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

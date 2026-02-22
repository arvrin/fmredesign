'use client';

import { useState, useEffect, useRef } from 'react';
import {
  DashboardButton as Button,
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit3,
  Download,
  Send,
  FileCheck,
  ZoomIn,
  ZoomOut,
  X,
  ArrowLeft,
} from 'lucide-react';
import { formatContractCurrency, type Contract } from '@/lib/admin/contract-types';
import { getBankInfoForCurrency } from '@/lib/admin/types';
import { downloadContractPDF } from '@/lib/client-portal/contract-pdf';

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

export function ContractTimeline({ contract }: { contract: Contract }) {
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
export function NumberedTerms({ text }: { text: string }) {
  const lines = text.split('\n').filter((l) => l.trim());
  let clauseNum = 0;

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        // Detect section headers (short title-like lines ending with :) vs bullet points
        // Exclude sentence-like lines that happen to end with : (e.g. "The Client agrees to provide:")
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
        const isHeader =
          trimmed.endsWith(':') &&
          !isBullet &&
          trimmed.length <= 45 &&
          !/^(The|Both|All|Any|Each|This|These|It|Either|Neither|Agency|Upon) /i.test(trimmed);

        if (isHeader) {
          clauseNum++;
          return (
            <div key={idx} className="mt-4 first:mt-0">
              <span className="text-sm font-semibold text-fm-neutral-800">
                {clauseNum}. {trimmed}
              </span>
            </div>
          );
        }

        return (
          <p
            key={idx}
            className={`text-sm leading-relaxed text-fm-neutral-600 ${isBullet ? 'pl-6' : 'pl-4'}`}
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ContractReader Props
   ═══════════════════════════════════════════════════ */
export interface ContractReaderProps {
  contract: Contract;
  onClose: () => void;
  onAction: (contractId: string, action: 'accept' | 'reject' | 'request_edit') => void;
  actioningId: string | null;
}

/* ═══════════════════════════════════════════════════
   Document Reader Overlay
   ═══════════════════════════════════════════════════ */
export function ContractReader({
  contract,
  onClose,
  onAction,
  actioningId,
}: ContractReaderProps) {
  const [zoom, setZoom] = useState(100);
  const [expandedAction, setExpandedAction] = useState<'accept' | 'reject' | 'request_edit' | null>(null);
  const [feedback, setFeedback] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const fmt = (n: number) => formatContractCurrency(n, contract.currency);
  const bank = getBankInfoForCurrency(contract.currency || 'INR');

  const zoomIn = () => setZoom((z) => Math.min(z + 15, 160));
  const zoomOut = () => setZoom((z) => Math.max(z - 15, 55));
  const zoomReset = () => setZoom(100);

  // Lock body scroll when reader is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); }
      if (e.key === '-') { e.preventDefault(); zoomOut(); }
      if (e.key === '0') { e.preventDefault(); zoomReset(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmitAction = () => {
    if (!expandedAction) return;
    onAction(contract.id, expandedAction);
  };

  return (
    <div
      className="fixed inset-0 bg-fm-neutral-900/80 backdrop-blur-sm flex flex-col"
      style={{ zIndex: 9999 }}
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 bg-fm-neutral-900 border-b border-fm-neutral-700 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-fm-neutral-300 hover:text-white transition-colors text-sm flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-fm-neutral-700 hidden sm:block" />
          <div className="min-w-0">
            <h2 className="text-white text-sm font-medium truncate">{contract.title}</h2>
            <div className="flex items-center gap-2">
              <Badge className={statusColor(contract.status)} variant="secondary">
                {statusLabel(contract.status)}
              </Badge>
              {contract.contractNumber && (
                <span className="text-fm-neutral-500 text-xs">#{contract.contractNumber}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={zoomOut}
            className="p-1.5 sm:p-2 text-fm-neutral-400 hover:text-white hover:bg-fm-neutral-800 rounded-md transition-colors"
            title="Zoom out (−)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={zoomReset}
            className="px-2 py-1 text-xs text-fm-neutral-300 hover:text-white hover:bg-fm-neutral-800 rounded-md transition-colors font-mono min-w-[3rem]"
            style={{ textAlign: 'center' }}
            title="Reset zoom (0)"
          >
            {zoom}%
          </button>
          <button
            onClick={zoomIn}
            className="p-1.5 sm:p-2 text-fm-neutral-400 hover:text-white hover:bg-fm-neutral-800 rounded-md transition-colors"
            title="Zoom in (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-fm-neutral-700 mx-1 hidden sm:block" />
          <button
            onClick={() => downloadContractPDF(contract)}
            className="p-1.5 sm:p-2 text-fm-neutral-400 hover:text-white hover:bg-fm-neutral-800 rounded-md transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-fm-neutral-400 hover:text-white hover:bg-fm-neutral-800 rounded-md transition-colors"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Document area ── */}
      <div className="flex-1 overflow-auto bg-fm-neutral-200" ref={contentRef}>
        <div className="flex justify-center py-6 sm:py-10 px-3 sm:px-8">
          <div
            className="bg-white shadow-2xl rounded-sm origin-top transition-transform duration-200"
            style={{
              width: '210mm',
              maxWidth: '100%',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {/* ── Document Content ── */}
            <div className="px-6 sm:px-12 py-8 sm:py-10 space-y-8">
              {/* Letterhead */}
              <div>
                <div className="h-1.5 bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 rounded-full mb-6" />
                <div className="flex items-center gap-4 mb-2">
                  <img
                    src="/logo.png"
                    alt="Freaking Minds"
                    className="h-10 w-10 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-fm-neutral-900 tracking-tight">
                      FREAKING MINDS
                    </h1>
                    <p className="text-xs text-fm-magenta-600 uppercase tracking-widest font-semibold">
                      Creative Digital Agency
                    </p>
                  </div>
                </div>
                <p className="text-xs text-fm-neutral-400 mt-1">
                  www.freakingminds.in &nbsp;|&nbsp; hello@freakingminds.in
                </p>
              </div>

              {/* Document title */}
              <div className="border-t-2 border-fm-neutral-900 pt-6">
                <h2 className="text-lg sm:text-xl font-bold text-fm-neutral-900 mb-2">
                  {contract.title}
                </h2>
                <div className="inline-block bg-fm-neutral-900 text-white px-4 py-1.5 rounded-sm">
                  <span className="text-sm font-semibold tracking-wide">SERVICE CONTRACT</span>
                  {contract.contractNumber && (
                    <span className="text-fm-magenta-400 ml-2 text-xs">#{contract.contractNumber}</span>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="py-2">
                <ContractTimeline contract={contract} />
              </div>

              {/* Contract meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {contract.startDate && (
                  <div>
                    <span className="text-xs text-fm-neutral-500 block uppercase tracking-wide">Start Date</span>
                    <span className="text-sm text-fm-neutral-900 font-medium">
                      {new Date(contract.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
                {contract.endDate && (
                  <div>
                    <span className="text-xs text-fm-neutral-500 block uppercase tracking-wide">End Date</span>
                    <span className="text-sm text-fm-neutral-900 font-medium">
                      {new Date(contract.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
                {contract.billingCycle && (
                  <div>
                    <span className="text-xs text-fm-neutral-500 block uppercase tracking-wide">Billing</span>
                    <span className="text-sm text-fm-neutral-900 font-medium capitalize">{contract.billingCycle}</span>
                  </div>
                )}
                {contract.paymentTerms && (
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-xs text-fm-neutral-500 block uppercase tracking-wide">Payment Terms</span>
                    <span className="text-sm text-fm-neutral-900 font-medium">{contract.paymentTerms}</span>
                  </div>
                )}
              </div>

              {/* ── Scope of Services ── */}
              <div>
                <h3 className="text-sm font-bold text-fm-neutral-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-fm-neutral-200" />
                  Scope of Services
                  <div className="h-px flex-1 bg-fm-neutral-200" />
                </h3>
                <div className="border border-fm-neutral-200 rounded overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 bg-fm-neutral-100 px-4 py-2 text-[11px] font-semibold text-fm-neutral-600 uppercase tracking-wide">
                    <div className="col-span-6">Service</div>
                    <div className="col-span-1 hidden sm:block" style={{ textAlign: 'center' }}>Qty</div>
                    <div className="col-span-2 hidden sm:block" style={{ textAlign: 'right' }}>Unit Price</div>
                    <div className="col-span-6 sm:col-span-3" style={{ textAlign: 'right' }}>Total</div>
                  </div>
                  {contract.services.map((svc, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-12 gap-2 px-4 py-3 items-start ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-fm-neutral-50/50'
                      } ${idx < contract.services.length - 1 ? 'border-b border-fm-neutral-100' : ''}`}
                    >
                      <div className="col-span-6">
                        <span className="text-sm font-medium text-fm-neutral-900">{svc.name}</span>
                        {svc.description && (
                          <p className="text-xs text-fm-neutral-500 mt-0.5 leading-relaxed">{svc.description}</p>
                        )}
                      </div>
                      <div className="col-span-1 text-sm text-fm-neutral-700 hidden sm:block" style={{ textAlign: 'center' }}>
                        {svc.quantity}
                      </div>
                      <div className="col-span-2 text-sm text-fm-neutral-700 hidden sm:block" style={{ textAlign: 'right' }}>
                        {fmt(svc.unitPrice)}
                      </div>
                      <div className="col-span-6 sm:col-span-3 text-sm font-medium text-fm-neutral-900" style={{ textAlign: 'right' }}>
                        {fmt(svc.total)}
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-fm-neutral-900">
                    <div className="col-span-6 sm:col-span-9 text-sm font-semibold text-white">
                      Total Contract Value
                    </div>
                    <div className="col-span-6 sm:col-span-3 text-base sm:text-lg font-bold text-fm-magenta-400" style={{ textAlign: 'right' }}>
                      {fmt(contract.totalValue)}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Bank Details ── */}
              <div>
                <h3 className="text-sm font-bold text-fm-neutral-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-fm-neutral-200" />
                  Bank Details for Payment
                  <div className="h-px flex-1 bg-fm-neutral-200" />
                </h3>
                <div className="bg-fm-neutral-50 rounded p-4">
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

              {/* ── Terms & Conditions ── */}
              {contract.termsAndConditions && (
                <div>
                  <h3 className="text-sm font-bold text-fm-neutral-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-fm-neutral-200" />
                    Terms & Conditions
                    <div className="h-px flex-1 bg-fm-neutral-200" />
                  </h3>
                  <div className="bg-fm-neutral-50 rounded p-4 sm:p-6">
                    <NumberedTerms text={contract.termsAndConditions} />
                  </div>
                </div>
              )}

              {/* ── Previous feedback ── */}
              {contract.clientFeedback && contract.status !== 'sent' && (
                <div className="border-t border-fm-neutral-200 pt-4">
                  <p className="text-xs text-fm-neutral-500 mb-1 uppercase tracking-wide">Your Feedback</p>
                  <p className="text-sm text-fm-neutral-700 bg-fm-neutral-50 rounded p-3">
                    {contract.clientFeedback}
                  </p>
                </div>
              )}

              {/* ── Acceptance record ── */}
              {contract.status === 'accepted' && contract.acceptedAt && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">Digitally Accepted</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Accepted on{' '}
                    {new Date(contract.acceptedAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}{' '}
                    at {new Date(contract.acceptedAt).toLocaleTimeString('en-GB')}
                  </p>
                  {contract.clientFeedback && (
                    <p className="text-xs text-green-600 mt-1">Notes: {contract.clientFeedback}</p>
                  )}
                </div>
              )}

              {contract.status === 'rejected' && contract.rejectedAt && (
                <div className="bg-red-50 border border-red-200 rounded p-4 flex items-center text-sm text-red-700">
                  <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  Rejected on {new Date(contract.rejectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}

              {contract.status === 'edit_requested' && (
                <div className="bg-orange-50 border border-orange-200 rounded p-4 flex items-center text-sm text-orange-700">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  Edit requested — waiting for updated contract from Freaking Minds
                </div>
              )}

              {/* ── Footer line ── */}
              <div className="h-1 bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 rounded-full mt-8" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Action footer (only for contracts awaiting review) ── */}
      {contract.status === 'sent' && (
        <div className="flex-shrink-0 bg-white border-t border-fm-neutral-200 px-4 sm:px-6 py-3">
          {expandedAction ? (
            <div className="max-w-2xl mx-auto space-y-3">
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
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={
                  expandedAction === 'request_edit'
                    ? 'Describe the changes you would like us to make...'
                    : 'Add any comments or notes (optional)...'
                }
                rows={2}
                className="w-full rounded-md border border-fm-neutral-300 bg-fm-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fm-magenta-500"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button
                  variant={
                    expandedAction === 'accept'
                      ? 'client'
                      : expandedAction === 'reject'
                      ? 'danger-ghost'
                      : expandedAction === 'request_edit'
                      ? 'warning-ghost'
                      : 'ghost'
                  }
                  size="sm"
                  disabled={
                    actioningId === contract.id ||
                    (expandedAction === 'request_edit' && !feedback.trim())
                  }
                  onClick={handleSubmitAction}
                >
                  {expandedAction === 'accept' && <CheckCircle2 className="w-4 h-4" />}
                  {expandedAction === 'reject' && <XCircle className="w-4 h-4" />}
                  {expandedAction === 'request_edit' && <Send className="w-4 h-4" />}
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
                  onClick={() => { setExpandedAction(null); setFeedback(''); }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 max-w-xl mx-auto">
              <Button
                variant="client"
                size="sm"
                onClick={() => setExpandedAction('accept')}
              >
                <CheckCircle2 className="w-4 h-4" />
                Accept Contract
              </Button>
              <Button
                variant="warning-ghost"
                size="sm"
                onClick={() => setExpandedAction('request_edit')}
              >
                <Edit3 className="w-4 h-4" />
                Request Edits
              </Button>
              <Button
                variant="danger-ghost"
                size="sm"
                onClick={() => setExpandedAction('reject')}
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

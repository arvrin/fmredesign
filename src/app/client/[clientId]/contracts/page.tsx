'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  ZoomIn,
  ZoomOut,
  X,
  Eye,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useClientPortal } from '@/lib/client-portal/context';
import { formatContractCurrency, type Contract } from '@/lib/admin/contract-types';
import { getBankInfoForCurrency } from '@/lib/admin/types';

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

/* ───────── Logo loader (cached) ───────── */
let _logoCache: string | null = null;
async function loadLogoBase64(): Promise<string | null> {
  if (_logoCache) return _logoCache;
  try {
    const res = await fetch('/logo.png');
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        _logoCache = reader.result as string;
        resolve(_logoCache);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/* ───────── PDF download ───────── */
async function downloadContractPDF(contract: Contract) {
  const [{ default: jsPDF }, logoBase64] = await Promise.all([
    import('jspdf'),
    loadLogoBase64(),
  ]);

  const doc = new jsPDF('portrait', 'mm', 'a4');
  const W = doc.internal.pageSize.getWidth();
  const M = 20; // margin
  const fmt = (n: number) => formatContractCurrency(n, contract.currency);
  let y = 0;

  // ── Brand bar
  doc.setFillColor(199, 50, 118);
  doc.rect(0, 0, W, 5, 'F');

  // ── Company header with logo
  y = 16;
  const logoX = M;
  const logoSize = 22;
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', logoX, 10, logoSize, logoSize);
  } else {
    doc.setFillColor(199, 50, 118);
    doc.rect(logoX, 10, logoSize, logoSize, 'F');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('FM', logoX + 6.5, 23);
  }

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

  // ── Contract title
  y = 50;
  doc.setFontSize(14);
  doc.setTextColor(26, 26, 26);
  const titleLines = doc.splitTextToSize(contract.title, W - 2 * M);
  titleLines.forEach((line: string, i: number) => {
    doc.text(line, M, y + (i * 6));
  });
  y += titleLines.length * 6 + 4;

  // ── CONTRACT badge box
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

  // ── Contract details
  y += badgeH + 12;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const details = [
    contract.startDate ? `Start: ${new Date(contract.startDate).toLocaleDateString('en-GB')}` : '',
    contract.endDate ? `End: ${new Date(contract.endDate).toLocaleDateString('en-GB')}` : '',
    contract.billingCycle ? `Billing: ${contract.billingCycle}` : '',
    contract.paymentTerms ? `Terms: ${contract.paymentTerms}` : '',
  ].filter(Boolean);
  doc.text(details.join('  |  '), M, y);
  y += 10;

  // ── Services table header
  doc.setFillColor(245, 245, 245);
  doc.rect(M, y, W - 2 * M, 8, 'F');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('SERVICE', M + 2, y + 5.5);
  doc.text('QTY', M + 100, y + 5.5, { align: 'center' });
  doc.text('UNIT PRICE', M + 125, y + 5.5, { align: 'center' });
  doc.text('TOTAL', W - M - 2, y + 5.5, { align: 'right' });
  y += 10;

  // ── Service rows
  doc.setFontSize(9);
  contract.services.forEach((svc) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setTextColor(26, 26, 26);
    doc.setFont('helvetica', 'bold');
    doc.text(svc.name, M + 2, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    if (svc.description) {
      const descLines = doc.splitTextToSize(svc.description, 90);
      descLines.forEach((dl: string, di: number) => {
        doc.text(dl, M + 2, y + 8 + di * 3.5);
      });
    }
    doc.setTextColor(26, 26, 26);
    doc.text(String(svc.quantity), M + 100, y + 4, { align: 'center' });
    doc.text(fmt(svc.unitPrice), M + 125, y + 4, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(fmt(svc.total), W - M - 2, y + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    const rowH = svc.description ? 12 + Math.max(0, doc.splitTextToSize(svc.description, 90).length - 1) * 3.5 : 8;
    doc.setDrawColor(230, 230, 230);
    doc.line(M, y + rowH, W - M, y + rowH);
    y += rowH + 2;
  });

  // ── Total row
  doc.setFillColor(26, 26, 26);
  doc.rect(M, y, W - 2 * M, 10, 'F');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Total Contract Value', M + 4, y + 7);
  doc.setTextColor(199, 50, 118);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(fmt(contract.totalValue), W - M - 4, y + 7, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  y += 16;

  // ── Bank Details
  const bank = getBankInfoForCurrency(contract.currency || 'INR');
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFontSize(11);
  doc.setTextColor(26, 26, 26);
  doc.setFont('helvetica', 'bold');
  doc.text('Bank Details for Payment', M, y);
  doc.setFont('helvetica', 'normal');
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const bankLines = [
    `Account Name: ${bank.accountName}`,
    `Bank: ${bank.bankName}`,
    `Account Number: ${bank.accountNumber}`,
    `IFSC Code: ${bank.ifscCode}`,
    ...(bank.swiftCode ? [`SWIFT Code: ${bank.swiftCode}`] : []),
  ];
  bankLines.forEach((bl) => {
    doc.text(bl, M + 2, y);
    y += 5;
  });
  if (bank.swiftCode) {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('For international transfers, we recommend using Wise for lower fees.', M + 2, y);
    y += 4;
  }
  y += 4;

  // ── T&C
  if (contract.termsAndConditions) {
    if (y > 200) { doc.addPage(); y = 20; }
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions', M, y);
    doc.setFont('helvetica', 'normal');
    y += 7;

    const tcLines = contract.termsAndConditions.split('\n');
    doc.setFontSize(8);
    tcLines.forEach((line) => {
      if (y > 275) { doc.addPage(); y = 20; }
      const trimmed = line.trim();
      if (!trimmed) { y += 2; return; }

      const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-');
      const isHeader =
        trimmed.endsWith(':') &&
        !isBullet &&
        trimmed.length <= 45 &&
        !/^(The|Both|All|Any|Each|This|These|It|Either|Neither|Agency|Upon) /i.test(trimmed);

      if (isHeader) {
        y += 3;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(26, 26, 26);
        doc.text(trimmed, M + 2, y);
        doc.setFont('helvetica', 'normal');
      } else {
        doc.setTextColor(80, 80, 80);
        const wrapped = doc.splitTextToSize(trimmed, W - 2 * M - (isBullet ? 8 : 4));
        wrapped.forEach((wl: string) => {
          if (y > 275) { doc.addPage(); y = 20; }
          doc.text(wl, M + (isBullet ? 8 : 4), y);
          y += 3.5;
        });
        return;
      }
      y += 4;
    });
  }

  // ── Acceptance record
  if (contract.status === 'accepted' && contract.acceptedAt) {
    if (y > 250) { doc.addPage(); y = 20; }
    y += 6;
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.rect(M, y, W - 2 * M, 22);
    doc.setFillColor(240, 253, 244);
    doc.rect(M, y, W - 2 * M, 22, 'F');
    doc.setFontSize(10);
    doc.setTextColor(22, 163, 74);
    doc.setFont('helvetica', 'bold');
    doc.text('✓  Digitally Accepted', M + 4, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(
      `Accepted on ${new Date(contract.acceptedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at ${new Date(contract.acceptedAt).toLocaleTimeString('en-GB')}`,
      M + 4, y + 14
    );
    if (contract.clientFeedback) {
      doc.text(`Notes: ${contract.clientFeedback}`, M + 4, y + 19);
    }
  }

  // ── Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(199, 50, 118);
    doc.rect(0, doc.internal.pageSize.getHeight() - 3, W, 3, 'F');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, W / 2, doc.internal.pageSize.getHeight() - 6, { align: 'center' });
  }

  doc.save(`${contract.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/* ═══════════════════════════════════════════════════
   Document Reader Overlay
   ═══════════════════════════════════════════════════ */
function ContractReader({
  contract,
  onClose,
  onAction,
  actioningId,
}: {
  contract: Contract;
  onClose: () => void;
  onAction: (contractId: string, action: 'accept' | 'reject' | 'request_edit') => void;
  actioningId: string | null;
}) {
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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fm-magenta-600" />
      </div>
    );
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
        <Card variant="client" className="p-12" style={{ textAlign: 'center' as const }}>
          <FileText className="w-16 h-16 text-fm-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">No contracts yet</h3>
          <p className="text-fm-neutral-600">
            Your service contracts will appear here once they&apos;re sent for review.
          </p>
        </Card>
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
                      <Badge className={statusColor(contract.status)} variant="secondary">
                        {statusLabel(contract.status)}
                      </Badge>
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

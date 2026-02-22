import { formatContractCurrency, type Contract } from '@/lib/admin/contract-types';
import { getBankInfoForCurrency } from '@/lib/admin/types';

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
export async function downloadContractPDF(contract: Contract) {
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

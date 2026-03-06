/**
 * Proposal PDF Generator — V2 Brand Design
 *
 * Matches the invoice PDF design language from pdf-simple.ts:
 * Two-tone header (deep purple + magenta accent), branded tables,
 * magenta total ribbon, multi-currency, proper client data.
 *
 * jsPDF constraints: no CSS gradients — achieved via colour fills,
 * lines, typography hierarchy, and spatial composition.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Proposal, ServicePackage } from './proposal-types';
import type { InvoiceClient } from './types';
import {
  DEFAULT_COMPANY_INFO,
  CURRENCY_OPTIONS,
  InvoiceUtils,
  type InvoiceCurrency,
} from './types';

// ---------------------------------------------------------------------------
// Brand constants (same as pdf-simple.ts)
// ---------------------------------------------------------------------------

const PURPLE: [number, number, number] = [74, 25, 66];
const MAGENTA: [number, number, number] = [201, 50, 93];
const DARK: [number, number, number] = [15, 15, 15];
const GREY: [number, number, number] = [100, 100, 100];
const LIGHT_GREY: [number, number, number] = [229, 229, 229];
const MAGENTA_TINT: [number, number, number] = [252, 245, 248];
const WHITE: [number, number, number] = [255, 255, 255];

const BLUE: [number, number, number] = [30, 64, 175];
const GREEN: [number, number, number] = [5, 150, 105];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_L = 20;
const MARGIN_R = 20;
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

export class ProposalPDFGenerator {
  private doc!: jsPDF;
  private currentY = 0;
  private logoDataUri: string | null = null;

  constructor() {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    this.loadLogo();
  }

  private async loadLogo(): Promise<void> {
    try {
      const response = await fetch('/logo.png');
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        this.logoDataUri = reader.result as string;
      };
      reader.readAsDataURL(blob);
    } catch {
      this.logoDataUri = null;
    }
  }

  // ---- Currency helpers ---------------------------------------------------

  private getCurrency(proposal: Proposal): InvoiceCurrency {
    return proposal.investment?.currency || 'INR';
  }

  private getCurrencySymbol(proposal: Proposal): string {
    const currency = this.getCurrency(proposal);
    if (currency === 'INR') return 'Rs.';
    return InvoiceUtils.getCurrencySymbol(currency);
  }

  private formatAmount(amount: number, proposal: Proposal): string {
    const currency = this.getCurrency(proposal);
    const sym =
      currency === 'INR'
        ? 'Rs.'
        : (CURRENCY_OPTIONS.find((c) => c.value === currency) || CURRENCY_OPTIONS[0]).symbol;
    const locale = (CURRENCY_OPTIONS.find((c) => c.value === currency) || CURRENCY_OPTIONS[0])
      .locale;
    return `${sym}${amount.toLocaleString(locale)}`;
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  // ---- Page break helper --------------------------------------------------

  private checkPageBreak(needed: number = 20): void {
    if (this.currentY + needed > PAGE_H - 30) {
      this.doc.addPage();
      this.currentY = 20;
    }
  }

  // ---- Public API ---------------------------------------------------------

  async generateProposal(
    proposal: Proposal,
    clients?: InvoiceClient[],
  ): Promise<string> {
    this.doc = new jsPDF('portrait', 'mm', 'a4');

    if (!this.logoDataUri) {
      await this.loadLogo();
      await new Promise((r) => setTimeout(r, 150));
    }

    this.addCoverHeader(proposal);
    this.addClientInfo(proposal, clients);
    this.addExecutiveSummary(proposal);
    this.addProblemStatement(proposal);
    this.addProposedSolution(proposal);
    this.addServiceTable(proposal);
    this.addInvestmentSummary(proposal);
    this.addTimeline(proposal);
    this.addWhyFreakingMinds(proposal);
    this.addNextSteps(proposal);
    this.addTerms(proposal);
    this.addFooterAllPages(proposal);

    return this.doc.output('datauristring');
  }

  async downloadProposal(
    proposal: Proposal,
    clients?: InvoiceClient[],
  ): Promise<void> {
    await this.generateProposal(proposal, clients);

    const clientName =
      proposal.client.prospectInfo?.company ||
      proposal.client.prospectInfo?.name ||
      'Client';
    const num = proposal.proposalNumber.replace(/[/\\]/g, '-');
    const brand = clientName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
    this.doc.save(`${num}-${brand}.pdf`);
  }

  // ---- 1. Cover Page Header -----------------------------------------------

  private addCoverHeader(proposal: Proposal): void {
    // Deep purple band
    this.doc.setFillColor(...PURPLE);
    this.doc.rect(0, 0, PAGE_W, 12, 'F');

    // Thin magenta accent
    this.doc.setFillColor(...MAGENTA);
    this.doc.rect(0, 12, PAGE_W, 2, 'F');

    // Logo
    const logoX = MARGIN_L;
    const logoY = 20;
    const logoW = 28;
    const logoH = 17;

    if (this.logoDataUri) {
      try {
        this.doc.setFillColor(...WHITE);
        this.doc.roundedRect(logoX - 1, logoY - 1, logoW + 2, logoH + 2, 2, 2, 'F');
        this.doc.addImage(this.logoDataUri, 'PNG', logoX, logoY, logoW, logoH, undefined, 'FAST');
      } catch {
        this.addFallbackLogo(logoX, logoY, logoW, logoH);
      }
    } else {
      this.addFallbackLogo(logoX, logoY, logoW, logoH);
    }

    // Company name
    const textX = logoX + logoW + 6;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(22);
    this.doc.setTextColor(...DARK);
    this.doc.text('FREAKING MINDS', textX, 28);

    // Tagline
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...MAGENTA);
    this.doc.text('C R E A T I V E   M A R K E T I N G   A G E N C Y', textX, 34);

    // Right side: proposal number + date
    const rightX = PAGE_W - MARGIN_R;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(20);
    this.doc.setTextColor(...DARK);
    this.doc.text('PROPOSAL', rightX, 24, { align: 'right' });

    this.doc.setFontSize(14);
    this.doc.setTextColor(...MAGENTA);
    this.doc.text(`#${proposal.proposalNumber}`, rightX, 31, { align: 'right' });

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...GREY);
    this.doc.text(this.formatDate(proposal.createdAt || new Date().toISOString()), rightX, 37, {
      align: 'right',
    });

    // Decorative line
    this.doc.setDrawColor(...MAGENTA);
    this.doc.setLineWidth(0.4);
    this.doc.line(MARGIN_L, 44, PAGE_W - MARGIN_R, 44);

    this.currentY = 52;
  }

  private addFallbackLogo(x: number, y: number, w: number, h: number): void {
    this.doc.setFillColor(...PURPLE);
    this.doc.roundedRect(x, y, w, h, 2, 2, 'F');
    this.doc.setTextColor(...WHITE);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('FM', x + w / 2, y + h / 2 + 2, { align: 'center' });
  }

  // ---- 2. Client Info -----------------------------------------------------

  private addClientInfo(proposal: Proposal, clients?: InvoiceClient[]): void {
    // "PREPARED FOR" label
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...MAGENTA);
    this.doc.text('P R E P A R E D   F O R', MARGIN_L, this.currentY);

    this.doc.setDrawColor(...MAGENTA);
    this.doc.setLineWidth(0.5);
    this.doc.line(MARGIN_L, this.currentY + 1.5, MARGIN_L + 35, this.currentY + 1.5);

    this.currentY += 7;

    let clientName = '';
    let clientEmail = '';
    let clientCompany = '';
    let clientIndustry = '';

    if (proposal.client.isExisting && proposal.client.clientId && clients) {
      const client = clients.find((c) => c.id === proposal.client.clientId);
      if (client) {
        clientCompany = client.name;
        clientName = client.name;
        clientEmail = client.email || '';
      }
    }

    if (!clientCompany && proposal.client.prospectInfo) {
      const info = proposal.client.prospectInfo;
      clientCompany = info.company;
      clientName = info.name;
      clientEmail = info.email;
      clientIndustry = info.industry;
    }

    // Company name
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(...DARK);
    this.doc.text(clientCompany || 'Client', MARGIN_L, this.currentY);
    this.currentY += 5;

    // Contact details
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...GREY);
    if (clientName && clientName !== clientCompany) {
      this.doc.text(clientName, MARGIN_L, this.currentY);
      this.currentY += 4;
    }
    if (clientEmail) {
      this.doc.text(clientEmail, MARGIN_L, this.currentY);
      this.currentY += 4;
    }
    if (clientIndustry) {
      this.doc.text(`Industry: ${clientIndustry}`, MARGIN_L, this.currentY);
      this.currentY += 4;
    }

    // Right side: validity
    const rightX = PAGE_W - MARGIN_R;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...MAGENTA);
    this.doc.text('V A L I D   U N T I L', rightX - 50, this.currentY - 12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    this.doc.setTextColor(...DARK);
    this.doc.text(this.formatDate(proposal.validUntil), rightX - 50, this.currentY - 7);

    // Separator
    this.currentY += 4;
    this.doc.setDrawColor(...LIGHT_GREY);
    this.doc.setLineWidth(0.3);
    this.doc.line(MARGIN_L, this.currentY, PAGE_W - MARGIN_R, this.currentY);

    this.currentY += 8;
  }

  // ---- 3. Executive Summary -----------------------------------------------

  private addExecutiveSummary(proposal: Proposal): void {
    if (!proposal.executiveSummary) return;
    this.addSectionHeader('Executive Summary');
    this.addBodyText(proposal.executiveSummary);
  }

  // ---- 4. Problem Statement -----------------------------------------------

  private addProblemStatement(proposal: Proposal): void {
    if (!proposal.problemStatement) return;
    this.addSectionHeader('Current Challenges & Opportunities');

    const points = proposal.problemStatement.split('\n').filter((l) => l.trim());
    points.forEach((point) => {
      this.checkPageBreak(8);
      // Magenta bullet circle
      this.doc.setFillColor(...MAGENTA);
      this.doc.circle(MARGIN_L + 3, this.currentY - 1.2, 1.5, 'F');

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9.5);
      this.doc.setTextColor(...DARK);
      const lines = this.doc.splitTextToSize(point.replace(/^[•\-\*]\s*/, ''), CONTENT_W - 12);
      this.doc.text(lines, MARGIN_L + 8, this.currentY);
      this.currentY += lines.length * 4.5 + 2;
    });

    this.currentY += 4;
  }

  // ---- 5. Proposed Solution -----------------------------------------------

  private addProposedSolution(proposal: Proposal): void {
    if (!proposal.proposedSolution) return;
    this.addSectionHeader('Our Strategic Solution');
    this.addBodyText(proposal.proposedSolution);
  }

  // ---- 6. Service Packages Table ------------------------------------------

  private addServiceTable(proposal: Proposal): void {
    const packages = proposal.servicePackages;
    if (!packages || packages.length === 0) return;

    this.checkPageBreak(30);
    this.addSectionHeader('Service Packages');

    const sym = this.getCurrencySymbol(proposal);

    const headers = ['#', 'Service', 'Duration', `Price (${sym})`];

    const data = packages.map((pkg: ServicePackage, idx: number) => {
      const pkgInvestment = proposal.investment?.packages?.find(
        (p) => p.packageId === pkg.id,
      );
      const price = pkgInvestment?.price ?? pkg.basePrice;
      const duration = pkg.duration
        ? `${pkg.duration} ${pkg.billingType === 'monthly' ? 'months' : 'hours'}`
        : pkg.billingType === 'project'
          ? 'One-time'
          : 'Ongoing';

      return [
        (idx + 1).toString(),
        `${pkg.name}\n${pkg.description}`,
        duration,
        this.formatAmount(price, proposal),
      ];
    });

    // Custom services
    if (proposal.customServices && proposal.customServices.length > 0) {
      proposal.customServices.forEach((svc, idx) => {
        data.push([
          (packages.length + idx + 1).toString(),
          `${svc.name}\n${svc.description}`,
          svc.timeline || 'As agreed',
          this.formatAmount(svc.price, proposal),
        ]);
      });
    }

    autoTable(this.doc, {
      head: [headers],
      body: data,
      startY: this.currentY,
      margin: { left: MARGIN_L, right: MARGIN_R },
      styles: {
        fontSize: 9,
        cellPadding: 3.5,
        textColor: DARK,
        lineColor: LIGHT_GREY,
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: PURPLE,
        textColor: WHITE,
        fontStyle: 'bold',
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 100 },
        2: { cellWidth: 28, halign: 'center' },
        3: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
      },
      alternateRowStyles: {
        fillColor: MAGENTA_TINT,
      },
      // Magenta left accent border
      didDrawCell: (cellData) => {
        if (cellData.section === 'body' && cellData.column.index === 0) {
          this.doc.setFillColor(...MAGENTA);
          this.doc.rect(cellData.cell.x, cellData.cell.y, 0.8, cellData.cell.height, 'F');
        }
      },
      didDrawPage: (pageData) => {
        this.currentY = pageData.cursor?.y || this.currentY + 40;
      },
    });

    this.currentY += 6;
  }

  // ---- 7. Investment Summary ----------------------------------------------

  private addInvestmentSummary(proposal: Proposal): void {
    if (!proposal.investment) return;

    this.checkPageBreak(40);

    const rightEdge = PAGE_W - MARGIN_R;
    const labelX = 130;

    // Subtotal
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(...GREY);
    this.doc.text('Subtotal', labelX, this.currentY);
    this.doc.setTextColor(...DARK);
    this.doc.text(
      this.formatAmount(proposal.investment.subtotal, proposal),
      rightEdge,
      this.currentY,
      { align: 'right' },
    );
    this.currentY += 6;

    // Discount
    if (proposal.investment.discount > 0) {
      this.doc.setTextColor(...GREEN);
      const reason = proposal.investment.discountReason
        ? ` (${proposal.investment.discountReason})`
        : '';
      this.doc.text(`Discount${reason}`, labelX, this.currentY);
      this.doc.text(
        `-${this.formatAmount(proposal.investment.discount, proposal)}`,
        rightEdge,
        this.currentY,
        { align: 'right' },
      );
      this.currentY += 6;
    }

    // Divider
    this.doc.setDrawColor(...LIGHT_GREY);
    this.doc.setLineWidth(0.3);
    this.doc.line(labelX, this.currentY, rightEdge, this.currentY);

    // Magenta total ribbon
    const ribbonY = this.currentY + 3;
    const ribbonH = 10;
    this.doc.setFillColor(...MAGENTA);
    this.doc.rect(MARGIN_L, ribbonY, CONTENT_W, ribbonH, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(13);
    this.doc.setTextColor(...WHITE);
    this.doc.text('TOTAL INVESTMENT', MARGIN_L + 4, ribbonY + 7);
    this.doc.text(
      this.formatAmount(proposal.investment.total, proposal),
      rightEdge - 4,
      ribbonY + 7,
      { align: 'right' },
    );

    this.currentY = ribbonY + ribbonH + 5;

    // Payment terms
    if (proposal.investment.paymentTerms) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...GREY);
      const termsLabel: Record<string, string> = {
        monthly: 'Monthly billing',
        quarterly: 'Quarterly billing',
        '50-50': '50% advance, 50% on completion',
        'milestone-based': 'Milestone-based payments',
        upfront: 'Full payment upfront',
      };
      this.doc.text(
        `Payment Terms: ${termsLabel[proposal.investment.paymentTerms] || proposal.investment.paymentTerms}`,
        MARGIN_L,
        this.currentY,
      );
      this.currentY += 6;
    }

    this.currentY += 4;
  }

  // ---- 8. Timeline --------------------------------------------------------

  private addTimeline(proposal: Proposal): void {
    if (
      !proposal.timeline ||
      (!proposal.timeline.kickoff && proposal.timeline.milestones.length === 0)
    )
      return;

    this.checkPageBreak(30);
    this.addSectionHeader('Project Timeline');

    // Kickoff
    if (proposal.timeline.kickoff) {
      this.checkPageBreak(8);
      this.doc.setFillColor(...BLUE);
      this.doc.circle(MARGIN_L + 3, this.currentY - 1, 2, 'F');
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(9.5);
      this.doc.setTextColor(...DARK);
      this.doc.text('Kickoff', MARGIN_L + 8, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(...GREY);
      this.doc.text(this.formatDate(proposal.timeline.kickoff), MARGIN_L + 50, this.currentY);
      this.currentY += 7;
    }

    // Milestones
    proposal.timeline.milestones.forEach((m) => {
      this.checkPageBreak(10);
      this.doc.setFillColor(...MAGENTA);
      this.doc.circle(MARGIN_L + 3, this.currentY - 1, 2, 'F');
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(9.5);
      this.doc.setTextColor(...DARK);
      this.doc.text(m.name, MARGIN_L + 8, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(...GREY);
      this.doc.text(this.formatDate(m.deadline), MARGIN_L + 80, this.currentY);
      this.currentY += 4;

      if (m.deliverables.length > 0) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(...GREY);
        this.doc.text(m.deliverables.join(', '), MARGIN_L + 8, this.currentY);
        this.currentY += 4;
      }
      this.currentY += 2;
    });

    // Completion
    if (proposal.timeline.completion) {
      this.checkPageBreak(8);
      this.doc.setFillColor(...GREEN);
      this.doc.circle(MARGIN_L + 3, this.currentY - 1, 2, 'F');
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(9.5);
      this.doc.setTextColor(...DARK);
      this.doc.text('Completion', MARGIN_L + 8, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(...GREY);
      this.doc.text(this.formatDate(proposal.timeline.completion), MARGIN_L + 50, this.currentY);
      this.currentY += 7;
    }

    this.currentY += 4;
  }

  // ---- 9. Why Freaking Minds ----------------------------------------------

  private addWhyFreakingMinds(proposal: Proposal): void {
    if (!proposal.whyFreakingMinds) return;
    this.addSectionHeader('Why Choose Freaking Minds?');
    this.addBodyText(proposal.whyFreakingMinds);
  }

  // ---- 10. Next Steps -----------------------------------------------------

  private addNextSteps(proposal: Proposal): void {
    if (!proposal.nextSteps) return;
    this.addSectionHeader('Next Steps');
    this.addBodyText(proposal.nextSteps);
  }

  // ---- 11. Terms & Conditions ---------------------------------------------

  private addTerms(proposal: Proposal): void {
    if (!proposal.termsAndConditions) return;
    this.addSectionHeader('Terms & Conditions');
    this.addBodyText(proposal.termsAndConditions);
  }

  // ---- Footer (all pages) -------------------------------------------------

  private addFooterAllPages(proposal: Proposal): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageCount = (this.doc as any).internal.getNumberOfPages() as number;

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);

      // Thin grey separator
      this.doc.setDrawColor(...LIGHT_GREY);
      this.doc.setLineWidth(0.3);
      this.doc.line(MARGIN_L, PAGE_H - 28, PAGE_W - MARGIN_R, PAGE_H - 28);

      // Left: Registration info
      this.doc.setFontSize(7);
      this.doc.setTextColor(...GREY);
      this.doc.setFont('helvetica', 'normal');
      if (DEFAULT_COMPANY_INFO.taxId) {
        this.doc.text(`GSTIN: ${DEFAULT_COMPANY_INFO.taxId}`, MARGIN_L, PAGE_H - 24);
      }
      if (DEFAULT_COMPANY_INFO.taxId) {
        this.doc.text(
          `PAN: ${DEFAULT_COMPANY_INFO.taxId.substring(2, 12)}`,
          MARGIN_L,
          PAGE_H - 20.5,
        );
      }
      if (DEFAULT_COMPANY_INFO.msmeUdyamNumber) {
        this.doc.text(`MSME: ${DEFAULT_COMPANY_INFO.msmeUdyamNumber}`, MARGIN_L, PAGE_H - 17);
      }

      // Center: Thank you
      this.doc.setFont('helvetica', 'italic');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...DARK);
      this.doc.text(
        'Thank you for considering Freaking Minds!',
        PAGE_W / 2,
        PAGE_H - 17,
        { align: 'center' },
      );

      // Right: Website
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(...GREY);
      this.doc.text(
        DEFAULT_COMPANY_INFO.website || 'www.freakingminds.in',
        PAGE_W - MARGIN_R,
        PAGE_H - 24,
        { align: 'right' },
      );

      // Page numbers: i . count
      this.doc.setFontSize(8);
      this.doc.setTextColor(...GREY);
      this.doc.text(`${i}`, PAGE_W / 2 - 3, PAGE_H - 12, { align: 'right' });
      this.doc.setFillColor(...MAGENTA);
      this.doc.circle(PAGE_W / 2, PAGE_H - 12.8, 0.6, 'F');
      this.doc.setTextColor(...GREY);
      this.doc.text(`${pageCount}`, PAGE_W / 2 + 3, PAGE_H - 12, { align: 'left' });

      // Bottom bars (mirror header)
      this.doc.setFillColor(...MAGENTA);
      this.doc.rect(0, PAGE_H - 7, PAGE_W, 2, 'F');
      this.doc.setFillColor(...PURPLE);
      this.doc.rect(0, PAGE_H - 5, PAGE_W, 5, 'F');
    }
  }

  // ---- Shared helpers -----------------------------------------------------

  private addSectionHeader(title: string): void {
    this.checkPageBreak(14);

    // Magenta background band
    this.doc.setFillColor(...MAGENTA);
    this.doc.rect(MARGIN_L, this.currentY - 4.5, CONTENT_W, 8, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(...WHITE);
    this.doc.text(title.toUpperCase(), MARGIN_L + 3, this.currentY + 0.5);

    this.currentY += 10;
  }

  private addBodyText(text: string): void {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...DARK);

    const lines = this.doc.splitTextToSize(text, CONTENT_W);
    lines.forEach((line: string) => {
      this.checkPageBreak(5);
      this.doc.text(line, MARGIN_L, this.currentY);
      this.currentY += 4.5;
    });

    this.currentY += 4;
  }
}

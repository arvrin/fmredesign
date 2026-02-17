/**
 * FreakingMinds Invoice PDF Generator — V2 Brand Design
 *
 * Two-tone header (deep purple + magenta accent), editorial layout,
 * branded table, magenta total ribbon, improved footer.
 *
 * jsPDF constraints: no CSS gradients or glass-morphism — achieved via
 * colour fills, lines, typography hierarchy, and spatial composition.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ---------------------------------------------------------------------------
// Brand constants
// ---------------------------------------------------------------------------

/** Deep purple — header band, table headers */
const PURPLE: [number, number, number] = [74, 25, 66]; // #4a1942
/** Primary magenta — accent lines, highlights, totals */
const MAGENTA: [number, number, number] = [201, 50, 93]; // #c9325d
/** Near-black for body text */
const DARK: [number, number, number] = [15, 15, 15]; // #0f0f0f
/** Medium grey for secondary text */
const GREY: [number, number, number] = [100, 100, 100];
/** Light grey for subtle backgrounds & lines */
const LIGHT_GREY: [number, number, number] = [229, 229, 229];
/** Very light magenta tint for alternating table rows */
const MAGENTA_TINT: [number, number, number] = [252, 245, 248];
/** White */
const WHITE: [number, number, number] = [255, 255, 255];

/** Page dimensions (A4 portrait, mm) */
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_L = 20;
const MARGIN_R = 20;
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    gstNumber?: string;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  terms: string;
}

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

export class SimplePDFGenerator {
  private doc!: jsPDF;
  private tableEndY = 0;
  private logoDataUri: string | null = null;

  constructor() {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    this.loadLogo();
  }

  // ---- Logo loading -------------------------------------------------------

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

  // ---- Public API ---------------------------------------------------------

  async generateInvoice(invoice: Invoice): Promise<string> {
    this.doc = new jsPDF('portrait', 'mm', 'a4');

    if (!this.logoDataUri) {
      await this.loadLogo();
      await new Promise(r => setTimeout(r, 150));
    }

    this.addHeader();
    this.addInvoiceMeta(invoice);
    this.addClientAndDates(invoice);
    this.addItemsTable(invoice);
    this.addTotals(invoice);
    this.addNotesTermsBank(invoice);
    this.addFooter();

    return this.doc.output('datauristring');
  }

  async downloadPDF(invoice: Invoice): Promise<void> {
    await this.generateInvoice(invoice);
    this.doc.save(`FreakingMinds-Invoice-${invoice.invoiceNumber}.pdf`);
  }

  // ---- Header -------------------------------------------------------------

  private addHeader(): void {
    // Deep purple band across top
    this.doc.setFillColor(...PURPLE);
    this.doc.rect(0, 0, PAGE_W, 12, 'F');

    // Thin magenta accent line beneath
    this.doc.setFillColor(...MAGENTA);
    this.doc.rect(0, 12, PAGE_W, 2, 'F');

    // Logo
    const logoX = MARGIN_L;
    const logoY = 20;
    const logoW = 28;
    const logoH = 17;

    if (this.logoDataUri) {
      try {
        // White background behind logo for visibility
        this.doc.setFillColor(...WHITE);
        this.doc.roundedRect(logoX - 1, logoY - 1, logoW + 2, logoH + 2, 2, 2, 'F');
        this.doc.addImage(this.logoDataUri, 'PNG', logoX, logoY, logoW, logoH, undefined, 'FAST');
      } catch {
        this.addFallbackLogo(logoX, logoY, logoW, logoH);
      }
    } else {
      this.addFallbackLogo(logoX, logoY, logoW, logoH);
    }

    // Company name — large, bold
    const textX = logoX + logoW + 6;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(22);
    this.doc.setTextColor(...DARK);
    this.doc.text('FREAKING MINDS', textX, 28);

    // Tagline — tracked-out small caps feel
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...MAGENTA);
    this.doc.text('C R E A T I V E   M A R K E T I N G   A G E N C Y', textX, 34);

    // Contact info — right-aligned with magenta bullet dots
    const contactX = PAGE_W - MARGIN_R;
    const contactItems = [
      'freakingmindsdigital@gmail.com',
      '+91 98332 57659',
      'www.freakingminds.in',
      'Bhopal, India',
    ];

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...GREY);

    contactItems.forEach((text, i) => {
      const y = 21 + i * 4.5;
      // Small magenta dot before each line
      this.doc.setFillColor(...MAGENTA);
      this.doc.circle(contactX - this.doc.getTextWidth(text) - 3, y - 0.8, 0.7, 'F');
      this.doc.text(text, contactX, y, { align: 'right' });
    });
  }

  private addFallbackLogo(x: number, y: number, w: number, h: number): void {
    this.doc.setFillColor(...PURPLE);
    this.doc.roundedRect(x, y, w, h, 2, 2, 'F');
    this.doc.setTextColor(...WHITE);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('FM', x + w / 2, y + h / 2 + 2, { align: 'center' });
  }

  // ---- Invoice meta line --------------------------------------------------

  private addInvoiceMeta(invoice: Invoice): void {
    const y = 46;

    // Thin magenta decorative line
    this.doc.setDrawColor(...MAGENTA);
    this.doc.setLineWidth(0.4);
    this.doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);

    // "INVOICE" — large, left-aligned
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(20);
    this.doc.setTextColor(...DARK);
    this.doc.text('INVOICE', MARGIN_L, y + 10);

    // Invoice number — right-aligned, magenta
    this.doc.setFontSize(14);
    this.doc.setTextColor(...MAGENTA);
    this.doc.text(`#${invoice.invoiceNumber}`, PAGE_W - MARGIN_R, y + 10, { align: 'right' });

    // Another thin line below
    this.doc.setDrawColor(...LIGHT_GREY);
    this.doc.setLineWidth(0.3);
    this.doc.line(MARGIN_L, y + 14, PAGE_W - MARGIN_R, y + 14);
  }

  // ---- Client info & dates ------------------------------------------------

  private addClientAndDates(invoice: Invoice): void {
    const startY = 66;

    // ---- Left column: Bill To ----
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...MAGENTA);
    this.doc.text('B I L L   T O', MARGIN_L, startY);

    // Magenta underline under label
    this.doc.setDrawColor(...MAGENTA);
    this.doc.setLineWidth(0.5);
    this.doc.line(MARGIN_L, startY + 1.5, MARGIN_L + 22, startY + 1.5);

    let yPos = startY + 7;

    // Client name — bold, dark
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(...DARK);
    this.doc.text(invoice.client.name, MARGIN_L, yPos);
    yPos += 5;

    // Client details — normal
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...GREY);

    if (invoice.client.email) {
      this.doc.text(invoice.client.email, MARGIN_L, yPos);
      yPos += 4;
    }
    if (invoice.client.phone) {
      this.doc.text(invoice.client.phone, MARGIN_L, yPos);
      yPos += 4;
    }
    if (invoice.client.address?.trim()) {
      this.doc.text(invoice.client.address, MARGIN_L, yPos);
      yPos += 4;
    }

    const addressParts: string[] = [];
    if (invoice.client.city) addressParts.push(invoice.client.city);
    if (invoice.client.state) addressParts.push(invoice.client.state);
    if (invoice.client.country && invoice.client.country !== 'India') {
      addressParts.push(invoice.client.country);
    }
    if (addressParts.length > 0) {
      this.doc.text(addressParts.join(', '), MARGIN_L, yPos);
      yPos += 4;
    }

    if (invoice.client.gstNumber) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...DARK);
      this.doc.text(`GST: ${invoice.client.gstNumber}`, MARGIN_L, yPos);
    }

    // ---- Right column: Dates ----
    const dateBlockX = 130;

    // Invoice Date
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...MAGENTA);
    this.doc.text('I N V O I C E   D A T E', dateBlockX, startY);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    this.doc.setTextColor(...DARK);
    this.doc.text(this.formatDate(invoice.date), dateBlockX, startY + 6);

    // Due Date
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...MAGENTA);
    this.doc.text('D U E   D A T E', dateBlockX, startY + 14);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    this.doc.setTextColor(...DARK);
    this.doc.text(this.formatDate(invoice.dueDate), dateBlockX, startY + 20);
  }

  // ---- Items table --------------------------------------------------------

  private addItemsTable(invoice: Invoice): void {
    const startY = 100;

    const headers = ['Description', 'Qty', 'Rate (Rs)', 'Amount (Rs)'];
    const data = invoice.lineItems.map(item => [
      item.description,
      item.quantity.toString(),
      `Rs ${item.rate.toLocaleString('en-IN')}`,
      `Rs ${item.amount.toLocaleString('en-IN')}`,
    ]);

    autoTable(this.doc, {
      head: [headers],
      body: data,
      startY,
      margin: { left: MARGIN_L, right: MARGIN_R },
      styles: {
        fontSize: 9,
        cellPadding: 4,
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
        0: { cellWidth: 80 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right', fontStyle: 'bold' },
      },
      alternateRowStyles: {
        fillColor: MAGENTA_TINT,
      },
      // Left magenta accent border on every row
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 0) {
          this.doc.setFillColor(...MAGENTA);
          this.doc.rect(data.cell.x, data.cell.y, 0.8, data.cell.height, 'F');
        }
      },
      didDrawPage: (data) => {
        this.tableEndY = data.cursor?.y || startY + 50;
      },
    });
  }

  // ---- Totals -------------------------------------------------------------

  private addTotals(invoice: Invoice): void {
    if (this.tableEndY > PAGE_H - 100) {
      this.doc.addPage();
      this.tableEndY = 20;
    }

    const y = this.tableEndY + 8;
    const rightEdge = PAGE_W - MARGIN_R;
    const labelX = 130;

    // Subtotal
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(...GREY);
    this.doc.text('Subtotal', labelX, y);
    this.doc.setTextColor(...DARK);
    this.doc.text(`Rs ${invoice.subtotal.toLocaleString('en-IN')}`, rightEdge, y, { align: 'right' });

    // Tax
    this.doc.setTextColor(...GREY);
    this.doc.text(`GST (${invoice.taxRate}%)`, labelX, y + 6);
    this.doc.setTextColor(...DARK);
    this.doc.text(`Rs ${invoice.taxAmount.toLocaleString('en-IN')}`, rightEdge, y + 6, { align: 'right' });

    // Divider
    this.doc.setDrawColor(...LIGHT_GREY);
    this.doc.setLineWidth(0.3);
    this.doc.line(labelX, y + 10, rightEdge, y + 10);

    // ---- Total ribbon: full-width magenta band ----
    const ribbonY = y + 13;
    const ribbonH = 10;
    this.doc.setFillColor(...MAGENTA);
    this.doc.rect(MARGIN_L, ribbonY, CONTENT_W, ribbonH, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(13);
    this.doc.setTextColor(...WHITE);
    this.doc.text('TOTAL', MARGIN_L + 4, ribbonY + 7);
    this.doc.text(`Rs ${invoice.total.toLocaleString('en-IN')}`, rightEdge - 4, ribbonY + 7, { align: 'right' });

    // Amount in words below ribbon
    const wordsY = ribbonY + ribbonH + 5;
    this.doc.setFont('helvetica', 'italic');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...GREY);
    const amountWords = this.numberToWords(invoice.total);
    if (amountWords) {
      this.doc.text(amountWords, MARGIN_L, wordsY);
    }

    this.tableEndY = wordsY + 4;
  }

  // ---- Notes, terms, bank details -----------------------------------------

  private addNotesTermsBank(invoice: Invoice): void {
    let currentY = this.tableEndY + 8;

    if (currentY > PAGE_H - 70) {
      this.doc.addPage();
      currentY = 20;
    }

    // Notes
    if (invoice.notes) {
      currentY = this.addLabelledSection('N O T E S', invoice.notes, currentY);
    }

    // Terms
    if (invoice.terms) {
      currentY = this.addLabelledSection('P A Y M E N T   T E R M S', invoice.terms, currentY);
    }

    // Bank details — two-column layout
    this.addBankDetails(currentY);
  }

  private addLabelledSection(label: string, text: string, startY: number): number {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...MAGENTA);
    this.doc.text(label, MARGIN_L, startY);

    // Small magenta underline
    this.doc.setDrawColor(...MAGENTA);
    this.doc.setLineWidth(0.4);
    const labelWidth = this.doc.getTextWidth(label);
    this.doc.line(MARGIN_L, startY + 1.5, MARGIN_L + labelWidth, startY + 1.5);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...GREY);
    const lines = this.doc.splitTextToSize(text, CONTENT_W);
    this.doc.text(lines, MARGIN_L, startY + 6);

    return startY + 6 + lines.length * 4 + 6;
  }

  private addBankDetails(startY: number): void {
    if (startY > PAGE_H - 50) {
      this.doc.addPage();
      startY = 20;
    }

    // Section label
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...MAGENTA);
    this.doc.text('B A N K   D E T A I L S', MARGIN_L, startY);

    this.doc.setDrawColor(...MAGENTA);
    this.doc.setLineWidth(0.4);
    this.doc.line(MARGIN_L, startY + 1.5, MARGIN_L + 38, startY + 1.5);

    // Light background box for bank details
    const boxY = startY + 4;
    this.doc.setFillColor(248, 248, 250);
    this.doc.roundedRect(MARGIN_L, boxY, CONTENT_W, 18, 1.5, 1.5, 'F');

    // Two-column bank details inside box
    const col1X = MARGIN_L + 4;
    const col2X = MARGIN_L + CONTENT_W / 2 + 4;
    const rowY = boxY + 6;

    this.doc.setFontSize(8);

    // Left column
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...DARK);
    this.doc.text('Bank:', col1X, rowY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...GREY);
    this.doc.text('HDFC Bank', col1X + 14, rowY);

    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...DARK);
    this.doc.text('A/C:', col1X, rowY + 5);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...GREY);
    this.doc.text('50200046586390', col1X + 14, rowY + 5);

    // Right column
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...DARK);
    this.doc.text('IFSC:', col2X, rowY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...GREY);
    this.doc.text('HDFC0000062', col2X + 14, rowY);

    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...DARK);
    this.doc.text('Branch:', col2X, rowY + 5);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...GREY);
    this.doc.text('Arera Colony', col2X + 14, rowY + 5);
  }

  // ---- Footer (all pages) -------------------------------------------------

  private addFooter(): void {
    const pageCount = (this.doc as any).internal.getNumberOfPages() as number;

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);

      // Thin grey separator
      this.doc.setDrawColor(...LIGHT_GREY);
      this.doc.setLineWidth(0.3);
      this.doc.line(MARGIN_L, PAGE_H - 28, PAGE_W - MARGIN_R, PAGE_H - 28);

      // Left: Registration details
      this.doc.setFontSize(7);
      this.doc.setTextColor(...GREY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('GST: 23BQNPM3447F1ZT', MARGIN_L, PAGE_H - 23);
      this.doc.text('MSME: UDYAM-MP-10-0032670', MARGIN_L, PAGE_H - 19);

      // Center: Thank you
      this.doc.setFont('helvetica', 'italic');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...DARK);
      this.doc.text('Thank you for your business!', PAGE_W / 2, PAGE_H - 21, { align: 'center' });

      // Right: Website
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(...GREY);
      this.doc.text('www.freakingminds.in', PAGE_W - MARGIN_R, PAGE_H - 23, { align: 'right' });

      // Page number with magenta dot separator
      this.doc.setFontSize(8);
      this.doc.setTextColor(...GREY);
      this.doc.text(`${i}`, PAGE_W / 2 - 3, PAGE_H - 14, { align: 'right' });
      // Magenta dot
      this.doc.setFillColor(...MAGENTA);
      this.doc.circle(PAGE_W / 2, PAGE_H - 14.8, 0.6, 'F');
      this.doc.setTextColor(...GREY);
      this.doc.text(`${pageCount}`, PAGE_W / 2 + 3, PAGE_H - 14, { align: 'left' });

      // Bottom bars: thin magenta + deep purple (mirror header)
      this.doc.setFillColor(...MAGENTA);
      this.doc.rect(0, PAGE_H - 7, PAGE_W, 2, 'F');
      this.doc.setFillColor(...PURPLE);
      this.doc.rect(0, PAGE_H - 5, PAGE_W, 5, 'F');
    }
  }

  // ---- Helpers ------------------------------------------------------------

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private numberToWords(amount: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    /** Convert 0–999 to words */
    function convertHundreds(num: number): string {
      let result = '';
      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }
      if (num >= 20) {
        result += tens[Math.floor(num / 10)];
        if (num % 10 !== 0) result += ' ' + ones[num % 10];
      } else if (num >= 10) {
        result += teens[num - 10];
      } else if (num > 0) {
        result += ones[num];
      }
      return result.trim();
    }

    /**
     * Convert any positive integer to Indian-style words.
     * Indian numbering: Crore (10^7), Lakh (10^5), Thousand (10^3), Hundred…
     */
    function convertIndian(num: number): string {
      if (num === 0) return '';
      let result = '';

      // Crores (≥ 1,00,00,000)
      if (num >= 10000000) {
        result += convertHundreds(Math.floor(num / 10000000)) + ' Crore ';
        num %= 10000000;
      }
      // Lakhs (≥ 1,00,000)
      if (num >= 100000) {
        result += convertHundreds(Math.floor(num / 100000)) + ' Lakh ';
        num %= 100000;
      }
      // Thousands (≥ 1,000)
      if (num >= 1000) {
        result += convertHundreds(Math.floor(num / 1000)) + ' Thousand ';
        num %= 1000;
      }
      // Hundreds and below
      if (num > 0) {
        result += convertHundreds(num) + ' ';
      }

      return result.trim();
    }

    if (amount === 0) return 'Zero Rupees Only';

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    let result = convertIndian(rupees) + ' Rupees';

    if (paise > 0) {
      result += ' and ' + convertHundreds(paise) + ' Paise';
    }

    return result.trim() + ' Only';
  }
}

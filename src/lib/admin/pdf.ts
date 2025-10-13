/**
 * PDF Generation for Invoices
 * Uses jsPDF to generate professional invoice PDFs matching the Numbers template style
 */

import jsPDF from 'jspdf';
import { Invoice, CompanyInfo, BankAccountInfo, DEFAULT_COMPANY_INFO, DEFAULT_BANK_INFO, InvoiceUtils } from './types';

export class InvoicePDF {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;

  constructor() {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
  }

  /**
   * Generate PDF for invoice
   */
  generateInvoice(invoice: Invoice, companyInfo: CompanyInfo = DEFAULT_COMPANY_INFO, bankInfo: BankAccountInfo = DEFAULT_BANK_INFO): string {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    
    // Professional Agency Header with Branding
    this.addAgencyHeader(companyInfo);
    
    // Invoice Title and Number (Right Aligned)
    this.addInvoiceTitle(invoice);
    
    // Client Information Section
    this.addClientInfo(invoice);
    
    // Invoice Details Section
    this.addInvoiceDetails(invoice);
    
    // Professional Line Items Table
    this.addProfessionalTable(invoice);
    
    // Amount in Words Section
    this.addAmountInWords(invoice);
    
    // Totals Section
    this.addProfessionalTotals(invoice);
    
    // Bank Account Details
    this.addBankDetails(bankInfo);
    
    // Terms and Professional Footer
    this.addProfessionalFooter(companyInfo, invoice);

    return this.doc.output('datauristring');
  }

  /**
   * Download PDF
   */
  downloadPDF(invoice: Invoice, companyInfo: CompanyInfo = DEFAULT_COMPANY_INFO, bankInfo: BankAccountInfo = DEFAULT_BANK_INFO): void {
    this.generateInvoice(invoice, companyInfo, bankInfo);
    this.doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
  }

  private addAgencyHeader(companyInfo: CompanyInfo): void {
    // Professional Agency Letterhead with Brand Colors
    // Top brand accent bar
    this.doc.setFillColor(199, 50, 118); // FM Magenta
    this.doc.rect(0, 0, this.pageWidth, 4, 'F');
    
    // Company logo placeholder (will be implemented with actual logo loading)
    // For now, create a professional logo placeholder
    this.doc.setFillColor(199, 50, 118);
    this.doc.rect(this.margin, 10, 25, 25, 'F');
    
    // Logo text placeholder
    this.doc.setFontSize(14);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('FM', this.margin + 8, 25);
    
    // Company Name - positioned next to logo
    this.doc.setFontSize(32);
    this.doc.setTextColor(26, 26, 26); // Dark text for professionalism
    this.doc.text(companyInfo.name.toUpperCase(), this.margin + 30, 20);
    
    // Professional tagline with emphasis
    this.doc.setFontSize(11);
    this.doc.setTextColor(199, 50, 118); // Brand color
    this.doc.text('CREATIVE DIGITAL AGENCY', this.margin + 30, 28);
    
    // Company credentials/certifications (if any)
    this.doc.setFontSize(9);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('"We Don\'t Just Market, We Create Movements"', this.margin + 30, 35);
    
    // Right side - Clean company info layout
    const rightX = this.pageWidth - this.margin - 70;
    let rightY = 15;
    
    this.doc.setFontSize(9);
    this.doc.setTextColor(64, 64, 64);
    
    // Company address - formatted professionally
    const addressLines = this.doc.splitTextToSize(companyInfo.address, 65);
    addressLines.forEach((line: string) => {
      this.doc.text(line, rightX, rightY);
      rightY += 4;
    });
    
    this.doc.text(`${companyInfo.city}, ${companyInfo.state} - ${companyInfo.zipCode}`, rightX, rightY);
    rightY += 5;
    this.doc.text(`📞 ${companyInfo.phone}`, rightX, rightY);
    rightY += 4;
    this.doc.text(`✉️  ${companyInfo.email}`, rightX, rightY);
    
    if (companyInfo.website) {
      rightY += 4;
      this.doc.setTextColor(199, 50, 118);
      this.doc.text(`🌐 ${companyInfo.website}`, rightX, rightY);
    }
    
    // Professional separator with brand accent
    this.doc.setDrawColor(199, 50, 118);
    this.doc.setLineWidth(2);
    this.doc.line(this.margin, 45, this.pageWidth - this.margin, 45);
    
    // Subtle shadow line
    this.doc.setDrawColor(240, 240, 240);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, 47, this.pageWidth - this.margin, 47);
  }

  private addInvoiceTitle(invoice: Invoice): void {
    // Professional INVOICE box with brand styling
    const titleBox = {
      x: this.pageWidth - this.margin - 80,
      y: 55,
      width: 75,
      height: 25
    };
    
    // Gradient-style background for invoice title
    this.doc.setFillColor(26, 26, 26); // Dark professional background
    this.doc.rect(titleBox.x, titleBox.y, titleBox.width, titleBox.height, 'F');
    
    // Accent border
    this.doc.setDrawColor(199, 50, 118);
    this.doc.setLineWidth(1.5);
    this.doc.rect(titleBox.x, titleBox.y, titleBox.width, titleBox.height);
    
    // INVOICE title - white text on dark background
    this.doc.setFontSize(18);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('INVOICE', titleBox.x + (titleBox.width / 2), titleBox.y + 12, { align: 'center' });
    
    // Invoice number with brand accent
    this.doc.setFontSize(14);
    this.doc.setTextColor(199, 50, 118); // Brand magenta
    const numberText = `#${invoice.invoiceNumber}`;
    this.doc.text(numberText, titleBox.x + (titleBox.width / 2), titleBox.y + 21, { align: 'center' });
  }

  private addClientInfo(invoice: Invoice): void {
    const yStart = 90;
    
    // Professional client section with background
    this.doc.setFillColor(249, 250, 251);
    this.doc.rect(this.margin, yStart, this.pageWidth - (2 * this.margin), 35, 'F');
    
    // Border for client section
    this.doc.setDrawColor(229, 229, 229);
    this.doc.setLineWidth(0.8);
    this.doc.rect(this.margin, yStart, this.pageWidth - (2 * this.margin), 35);
    
    // "BILL TO" header with professional styling
    this.doc.setFontSize(12);
    this.doc.setTextColor(26, 26, 26);
    this.doc.text('BILL TO:', this.margin + 10, yStart + 12);
    
    // Client name with emphasis
    this.doc.setFontSize(16);
    this.doc.setTextColor(199, 50, 118); // Brand color
    this.doc.text(invoice.client.name, this.margin + 10, yStart + 22);
    
    // Client details
    let detailsY = yStart + 28;
    this.doc.setFontSize(9);
    this.doc.setTextColor(64, 64, 64);
    
    if (invoice.client.address) {
      this.doc.text(invoice.client.address, this.margin + 10, detailsY);
      detailsY += 4;
    }
    
    const cityState = [invoice.client.city, invoice.client.state].filter(Boolean).join(', ');
    if (cityState) {
      this.doc.text(cityState, this.margin + 10, detailsY);
    }
    
    // Contact info on right side of client section
    if (invoice.client.phone || invoice.client.email) {
      const contactX = this.pageWidth - this.margin - 80;
      let contactY = yStart + 15;
      
      if (invoice.client.phone) {
        this.doc.text(`📞 ${invoice.client.phone}`, contactX, contactY);
        contactY += 5;
      }
      
      if (invoice.client.email) {
        this.doc.text(`✉️  ${invoice.client.email}`, contactX, contactY);
      }
    }
  }

  private addInvoiceDetails(invoice: Invoice): void {
    const yPos = 140;
    
    // Professional invoice details grid
    const detailBoxes = [
      { label: 'INVOICE DATE', value: InvoiceUtils.formatDate(invoice.date), x: this.margin },
      { label: 'DUE DATE', value: InvoiceUtils.formatDate(invoice.dueDate), x: this.margin + 60 },
      { label: 'INVOICE NO.', value: invoice.invoiceNumber, x: this.margin + 120 }
    ];
    
    detailBoxes.forEach((box, index) => {
      // Background for each detail box
      this.doc.setFillColor(26, 26, 26);
      this.doc.rect(box.x, yPos, 55, 8, 'F');
      
      // Label
      this.doc.setFontSize(9);
      this.doc.setTextColor(255, 255, 255);
      this.doc.text(box.label, box.x + 2, yPos + 6);
      
      // Value box
      this.doc.setFillColor(255, 255, 255);
      this.doc.rect(box.x, yPos + 8, 55, 10, 'F');
      this.doc.setDrawColor(229, 229, 229);
      this.doc.rect(box.x, yPos + 8, 55, 10);
      
      // Value text
      this.doc.setFontSize(10);
      this.doc.setTextColor(26, 26, 26);
      this.doc.text(box.value, box.x + 2, yPos + 15);
    });
    
    // Status badge on the far right
    const statusX = this.pageWidth - this.margin - 50;
    const statusColor = invoice.status === 'paid' ? [34, 197, 94] : 
                       invoice.status === 'overdue' ? [239, 68, 68] : [251, 191, 36];
    
    this.doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    this.doc.rect(statusX, yPos + 4, 45, 10, 'F');
    
    this.doc.setFontSize(10);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(invoice.status.toUpperCase(), statusX + 22.5, yPos + 10, { align: 'center' });
  }

  private addProfessionalTable(invoice: Invoice): void {
    const startY = 170;
    let currentY = startY;
    
    // Professional table with clean design
    const tableWidth = this.pageWidth - (2 * this.margin);
    const colWidths = {
      description: tableWidth * 0.5,
      qty: tableWidth * 0.15,
      rate: tableWidth * 0.175,
      amount: tableWidth * 0.175
    };
    
    // Table header with brand accent
    this.doc.setFillColor(26, 26, 26);
    this.doc.rect(this.margin, currentY, tableWidth, 12, 'F');
    
    // Header text
    this.doc.setFontSize(11);
    this.doc.setTextColor(255, 255, 255);
    currentY += 8;
    
    this.doc.text('DESCRIPTION OF SERVICES', this.margin + 5, currentY);
    this.doc.text('QTY', this.margin + colWidths.description + 10, currentY, { align: 'center' });
    this.doc.text('RATE (₹)', this.margin + colWidths.description + colWidths.qty + 15, currentY, { align: 'center' });
    this.doc.text('AMOUNT (₹)', this.pageWidth - this.margin - 25, currentY, { align: 'center' });
    
    currentY += 10;
    
    // Line items with alternating backgrounds
    invoice.lineItems.forEach((item, index) => {
      const rowHeight = 16;
      
      // Alternating row colors
      if (index % 2 === 0) {
        this.doc.setFillColor(249, 250, 251);
        this.doc.rect(this.margin, currentY - 4, tableWidth, rowHeight, 'F');
      }
      
      // Row borders
      this.doc.setDrawColor(229, 229, 229);
      this.doc.setLineWidth(0.3);
      this.doc.line(this.margin, currentY - 4, this.pageWidth - this.margin, currentY - 4);
      this.doc.line(this.margin, currentY + 12, this.pageWidth - this.margin, currentY + 12);
      
      // Vertical borders
      this.doc.line(this.margin + colWidths.description, currentY - 4, this.margin + colWidths.description, currentY + 12);
      this.doc.line(this.margin + colWidths.description + colWidths.qty, currentY - 4, this.margin + colWidths.description + colWidths.qty, currentY + 12);
      this.doc.line(this.margin + colWidths.description + colWidths.qty + colWidths.rate, currentY - 4, this.margin + colWidths.description + colWidths.qty + colWidths.rate, currentY + 12);
      
      // Content
      this.doc.setFontSize(10);
      this.doc.setTextColor(26, 26, 26);
      
      // Description (with text wrapping)
      const descLines = this.doc.splitTextToSize(item.description, colWidths.description - 10);
      this.doc.text(descLines[0], this.margin + 5, currentY + 3);
      if (descLines[1]) {
        this.doc.setFontSize(9);
        this.doc.text(descLines[1], this.margin + 5, currentY + 8);
        this.doc.setFontSize(10);
      }
      
      // Quantity (centered)
      this.doc.text(item.quantity.toString(), this.margin + colWidths.description + (colWidths.qty / 2), currentY + 5, { align: 'center' });
      
      // Rate (right aligned)
      const rateText = InvoiceUtils.formatCurrency(item.rate).replace('₹', '');
      this.doc.text(rateText, this.margin + colWidths.description + colWidths.qty + colWidths.rate - 5, currentY + 5, { align: 'right' });
      
      // Amount (right aligned)
      const amountText = InvoiceUtils.formatCurrency(item.amount).replace('₹', '');
      this.doc.text(amountText, this.pageWidth - this.margin - 5, currentY + 5, { align: 'right' });
      
      currentY += rowHeight;
    });
    
    // Bottom table border
    this.doc.setDrawColor(26, 26, 26);
    this.doc.setLineWidth(1.5);
    this.doc.line(this.margin, currentY - 4, this.pageWidth - this.margin, currentY - 4);
  }

  private addAmountInWords(invoice: Invoice): void {
    const yPos = 170 + (invoice.lineItems.length * 16) + 20;
    
    // Amount in words section with background
    this.doc.setFillColor(249, 250, 251);
    this.doc.rect(this.margin, yPos, this.pageWidth - (2 * this.margin), 20, 'F');
    
    // Border
    this.doc.setDrawColor(229, 229, 229);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, yPos, this.pageWidth - (2 * this.margin), 20);
    
    // Title
    this.doc.setFontSize(10);
    this.doc.setTextColor(64, 64, 64);
    this.doc.text('AMOUNT IN WORDS:', this.margin + 5, yPos + 8);
    
    // Amount in words
    this.doc.setFontSize(11);
    this.doc.setTextColor(26, 26, 26);
    const amountInWords = InvoiceUtils.numberToWords(invoice.total);
    const wordsLines = this.doc.splitTextToSize(amountInWords, this.pageWidth - (2 * this.margin) - 10);
    this.doc.text(wordsLines, this.margin + 5, yPos + 15);
  }

  private addProfessionalTotals(invoice: Invoice): void {
    const yPos = 170 + (invoice.lineItems.length * 16) + 50;
    
    const totalsX = this.pageWidth - 100;
    const totalsWidth = 95;
    
    // Professional totals section with clean design
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(totalsX - 5, yPos - 5, totalsWidth, invoice.taxRate > 0 ? 45 : 30, 'F');
    
    // Border
    this.doc.setDrawColor(199, 50, 118);
    this.doc.setLineWidth(1);
    this.doc.rect(totalsX - 5, yPos - 5, totalsWidth, invoice.taxRate > 0 ? 45 : 30);
    
    let currentY = yPos;
    
    // Subtotal
    this.doc.setFontSize(10);
    this.doc.setTextColor(64, 64, 64);
    this.doc.text('Subtotal:', totalsX, currentY);
    
    const subtotalText = InvoiceUtils.formatCurrency(invoice.subtotal);
    this.doc.setTextColor(26, 26, 26);
    this.doc.text(subtotalText, this.pageWidth - this.margin - 8, currentY, { align: 'right' });
    
    currentY += 10;
    
    // Tax (if applicable)
    if (invoice.taxRate > 0) {
      this.doc.setTextColor(64, 64, 64);
      this.doc.text(`GST (${invoice.taxRate}%):`, totalsX, currentY);
      
      const taxText = InvoiceUtils.formatCurrency(invoice.taxAmount);
      this.doc.setTextColor(26, 26, 26);
      this.doc.text(taxText, this.pageWidth - this.margin - 8, currentY, { align: 'right' });
      
      currentY += 10;
    }
    
    // Separator line
    this.doc.setDrawColor(199, 50, 118);
    this.doc.setLineWidth(1.5);
    this.doc.line(totalsX, currentY, this.pageWidth - this.margin - 8, currentY);
    
    currentY += 10;
    
    // Total with emphasis
    this.doc.setFillColor(26, 26, 26);
    this.doc.rect(totalsX - 5, currentY - 8, totalsWidth, 15, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('TOTAL AMOUNT:', totalsX, currentY);
    
    const totalText = InvoiceUtils.formatCurrency(invoice.total);
    this.doc.setFontSize(14);
    this.doc.text(totalText, this.pageWidth - this.margin - 8, currentY, { align: 'right' });
  }

  private addBankDetails(bankInfo: BankAccountInfo): void {
    const yPos = this.pageHeight - 110;
    
    // Bank details section with professional styling
    this.doc.setFillColor(26, 26, 26);
    this.doc.rect(this.margin, yPos, this.pageWidth - (2 * this.margin), 8, 'F');
    
    this.doc.setFontSize(11);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('BANK ACCOUNT DETAILS', this.margin + 5, yPos + 6);
    
    // Bank details content
    this.doc.setFillColor(249, 250, 251);
    this.doc.rect(this.margin, yPos + 8, this.pageWidth - (2 * this.margin), 25, 'F');
    
    this.doc.setDrawColor(229, 229, 229);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, yPos + 8, this.pageWidth - (2 * this.margin), 25);
    
    let detailY = yPos + 15;
    this.doc.setFontSize(9);
    this.doc.setTextColor(64, 64, 64);
    
    // Left column
    this.doc.text('Bank Name:', this.margin + 5, detailY);
    this.doc.setTextColor(26, 26, 26);
    this.doc.text(bankInfo.bankName, this.margin + 25, detailY);
    
    detailY += 6;
    this.doc.setTextColor(64, 64, 64);
    this.doc.text('Account Name:', this.margin + 5, detailY);
    this.doc.setTextColor(26, 26, 26);
    this.doc.text(bankInfo.accountName, this.margin + 30, detailY);
    
    detailY += 6;
    this.doc.setTextColor(64, 64, 64);
    this.doc.text('Account Number:', this.margin + 5, detailY);
    this.doc.setTextColor(199, 50, 118); // Highlight account number
    this.doc.text(bankInfo.accountNumber, this.margin + 35, detailY);
    
    // Right column
    const rightX = this.pageWidth / 2 + 20;
    detailY = yPos + 15;
    
    this.doc.setTextColor(64, 64, 64);
    this.doc.text('IFSC Code:', rightX, detailY);
    this.doc.setTextColor(199, 50, 118); // Highlight IFSC
    this.doc.text(bankInfo.ifscCode, rightX + 20, detailY);
    
    if (bankInfo.branch) {
      detailY += 6;
      this.doc.setTextColor(64, 64, 64);
      this.doc.text('Branch:', rightX, detailY);
      this.doc.setTextColor(26, 26, 26);
      this.doc.text(bankInfo.branch, rightX + 15, detailY);
    }
    
    if (bankInfo.accountType) {
      detailY += 6;
      this.doc.setTextColor(64, 64, 64);
      this.doc.text('Account Type:', rightX, detailY);
      this.doc.setTextColor(26, 26, 26);
      this.doc.text(bankInfo.accountType, rightX + 25, detailY);
    }
  }

  private addProfessionalFooter(companyInfo: CompanyInfo, invoice: Invoice): void {
    const footerY = this.pageHeight - 65;
    
    // Terms and conditions section
    const terms = invoice.terms || "Payment is due within 30 days from invoice date. Late payments may incur additional charges. Please make payments to the bank account details provided above.";
    
    this.doc.setFillColor(249, 250, 251);
    this.doc.rect(this.margin, footerY, this.pageWidth - (2 * this.margin), 25, 'F');
    
    this.doc.setDrawColor(229, 229, 229);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, footerY, this.pageWidth - (2 * this.margin), 25);
    
    this.doc.setFontSize(10);
    this.doc.setTextColor(26, 26, 26);
    this.doc.text('TERMS & CONDITIONS', this.margin + 5, footerY + 8);
    
    this.doc.setFontSize(8);
    this.doc.setTextColor(64, 64, 64);
    const termsLines = this.doc.splitTextToSize(terms, this.pageWidth - (2 * this.margin) - 10);
    this.doc.text(termsLines, this.margin + 5, footerY + 15);
    
    // Professional footer with brand accent
    const bottomFooterY = this.pageHeight - 35;
    
    this.doc.setDrawColor(199, 50, 118);
    this.doc.setLineWidth(2);
    this.doc.line(this.margin, bottomFooterY, this.pageWidth - this.margin, bottomFooterY);
    
    // Thank you message and contact
    this.doc.setFontSize(11);
    this.doc.setTextColor(199, 50, 118);
    this.doc.text('Thank you for your business!', this.margin, bottomFooterY + 8);
    
    this.doc.setFontSize(9);
    this.doc.setTextColor(64, 64, 64);
    this.doc.text('For any queries, please contact us at:', this.margin, bottomFooterY + 15);
    this.doc.setTextColor(26, 26, 26);
    this.doc.text(`${companyInfo.email} | ${companyInfo.phone}`, this.margin + 65, bottomFooterY + 15);
    
    // Right side - Company info and registrations
    let rightYOffset = 8;

    if (companyInfo.website) {
      this.doc.setFontSize(9);
      this.doc.setTextColor(199, 50, 118);
      this.doc.text(companyInfo.website, this.pageWidth - this.margin, bottomFooterY + rightYOffset, { align: 'right' });
      rightYOffset += 5;
    }

    if (companyInfo.taxId) {
      this.doc.setFontSize(8);
      this.doc.setTextColor(64, 64, 64);
      this.doc.text(`GST No: ${companyInfo.taxId}`, this.pageWidth - this.margin, bottomFooterY + rightYOffset, { align: 'right' });
      rightYOffset += 4;
    }

    if (companyInfo.msmeUdyamNumber) {
      this.doc.setFontSize(8);
      this.doc.setTextColor(64, 64, 64);
      this.doc.text(`MSME Udyam: ${companyInfo.msmeUdyamNumber}`, this.pageWidth - this.margin, bottomFooterY + rightYOffset, { align: 'right' });
    }
    
    // Signature section
    this.doc.setFontSize(9);
    this.doc.setTextColor(64, 64, 64);
    this.doc.text('Authorized Signatory', this.pageWidth - this.margin - 30, bottomFooterY + 22);
    
    // Page info
    this.doc.setFontSize(7);
    this.doc.setTextColor(153, 153, 153);
    this.doc.text('Generated by Freaking Minds Invoice System', this.margin, this.pageHeight - 8);
    this.doc.text(`Page 1 of 1 | Invoice: ${invoice.invoiceNumber}`, this.pageWidth - this.margin, this.pageHeight - 8, { align: 'right' });
    
    // Bottom brand accent
    this.doc.setFillColor(199, 50, 118);
    this.doc.rect(0, this.pageHeight - 4, this.pageWidth, 4, 'F');
  }
}
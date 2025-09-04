/**
 * Simplified PDF Generation for Invoices
 * Clean, professional PDF generation with better formatting
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export class SimplePDFGenerator {
  private doc: jsPDF;
  private tableEndY: number = 0;
  private logoDataUri: string | null = null;
  
  constructor() {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    this.loadLogo();
  }

  private async loadLogo(): Promise<void> {
    try {
      // Convert logo to base64 for PDF embedding
      const response = await fetch('/logo.png');
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onload = () => {
        this.logoDataUri = reader.result as string;
      };
      
      reader.readAsDataURL(blob);
    } catch (error) {
      console.warn('Could not load logo for PDF:', error);
      this.logoDataUri = null;
    }
  }

  async generateInvoice(invoice: Invoice): Promise<string> {
    try {
      // Reset document
      this.doc = new jsPDF('portrait', 'mm', 'a4');
      
      // Ensure logo is loaded before generating PDF
      if (!this.logoDataUri) {
        await this.loadLogo();
        // Give a small delay for the logo to load
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Company header
      this.addCompanyHeader();
      
      // Invoice title and number
      this.addInvoiceTitle(invoice);
      
      // Client information
      this.addClientInfo(invoice);
      
      // Invoice details (dates)
      this.addInvoiceDetails(invoice);
      
      // Line items table
      this.addItemsTable(invoice);
      
      // Totals
      this.addTotals(invoice);
      
      // Notes and terms
      this.addNotesAndTerms(invoice);
      
      // Footer
      this.addFooter();
      
      return this.doc.output('datauristring');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  async downloadPDF(invoice: Invoice): Promise<void> {
    try {
      await this.generateInvoice(invoice);
      this.doc.save(`FreakingMinds-Invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw new Error('Failed to download PDF');
    }
  }

  private addCompanyHeader(): void {
    // Brand color bar at top
    this.doc.setFillColor(179, 41, 104); // FM Magenta
    this.doc.rect(0, 0, 210, 8, 'F');
    
    // Logo area - white background for better logo visibility
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(20, 15, 30, 20, 'F');
    this.doc.setDrawColor(179, 41, 104);
    this.doc.setLineWidth(0.5);
    this.doc.rect(20, 15, 30, 20);
    
    // Add actual logo if available
    if (this.logoDataUri) {
      try {
        // Add logo image - centered in the logo area
        this.doc.addImage(this.logoDataUri, 'PNG', 22, 17, 26, 16, undefined, 'FAST');
      } catch (error) {
        console.warn('Error adding logo to PDF, using fallback:', error);
        this.addFallbackLogo();
      }
    } else {
      this.addFallbackLogo();
    }
    
    // Company name
    this.doc.setTextColor(51, 51, 51);
    this.doc.setFontSize(22);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('FREAKING MINDS', 55, 24);
    
    // Tagline
    this.doc.setFontSize(9);
    this.doc.setTextColor(179, 41, 104);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Creative Digital Marketing Agency', 55, 30);
    
    // Contact info (right aligned) with better spacing
    this.doc.setFontSize(8);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('freakingmindsdigital@gmail.com', 190, 18, { align: 'right' });
    this.doc.text('+91 98332 57659', 190, 23, { align: 'right' });
    this.doc.text('www.freakingminds.in', 190, 28, { align: 'right' });
    this.doc.text('Bhopal, Madhya Pradesh', 190, 33, { align: 'right' });
  }

  private addFallbackLogo(): void {
    // Fallback logo - stylized "FM" with better design
    this.doc.setFillColor(179, 41, 104);
    this.doc.rect(22, 17, 26, 16, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('FM', 35, 27, { align: 'center' });
  }

  private addInvoiceTitle(invoice: Invoice): void {
    // Invoice title box
    this.doc.setFillColor(51, 51, 51);
    this.doc.rect(140, 45, 50, 20, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('INVOICE', 165, 55, { align: 'center' });
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(179, 41, 104);
    this.doc.text(`#${invoice.invoiceNumber}`, 165, 60, { align: 'center' });
  }

  private addClientInfo(invoice: Invoice): void {
    const startY = 75;
    
    // Section background
    this.doc.setFillColor(248, 249, 250);
    this.doc.rect(20, startY, 170, 30, 'F');
    this.doc.setDrawColor(229, 229, 229);
    this.doc.rect(20, startY, 170, 30);
    
    // Bill To label
    this.doc.setFontSize(12);
    this.doc.setTextColor(51, 51, 51);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('BILL TO:', 25, startY + 8);
    
    // Client details
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(51, 51, 51);
    
    let yPos = startY + 15;
    this.doc.text(invoice.client.name, 25, yPos);
    
    yPos += 6;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    
    if (invoice.client.address && invoice.client.address.trim()) {
      this.doc.text(invoice.client.address, 25, yPos);
      yPos += 4;
    }
    
    // Build address line
    const addressParts = [];
    if (invoice.client.city) addressParts.push(invoice.client.city);
    if (invoice.client.state) addressParts.push(invoice.client.state);
    if (invoice.client.country && invoice.client.country !== 'India') addressParts.push(invoice.client.country);
    
    if (addressParts.length > 0) {
      this.doc.text(addressParts.join(', '), 25, yPos);
      yPos += 4;
    }
    
    // Contact info on right side
    if (invoice.client.email || invoice.client.phone || invoice.client.gstNumber) {
      let contactY = startY + 15;
      this.doc.setFontSize(10);
      this.doc.setTextColor(102, 102, 102);
      
      if (invoice.client.email) {
        this.doc.text(invoice.client.email, 140, contactY);
        contactY += 4;
      }
      if (invoice.client.phone) {
        this.doc.text(invoice.client.phone, 140, contactY);
        contactY += 4;
      }
      if (invoice.client.gstNumber) {
        this.doc.text(`GST: ${invoice.client.gstNumber}`, 140, contactY);
      }
    }
  }

  private addInvoiceDetails(invoice: Invoice): void {
    const startY = 115;
    
    // Date boxes
    const boxes = [
      { label: 'INVOICE DATE', value: this.formatDate(invoice.date), x: 20 },
      { label: 'DUE DATE', value: this.formatDate(invoice.dueDate), x: 100 },
    ];
    
    boxes.forEach(box => {
      // Label background
      this.doc.setFillColor(51, 51, 51);
      this.doc.rect(box.x, startY, 70, 8, 'F');
      
      // Label text
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(box.label, box.x + 2, startY + 5);
      
      // Value background
      this.doc.setFillColor(255, 255, 255);
      this.doc.rect(box.x, startY + 8, 70, 8, 'F');
      this.doc.setDrawColor(229, 229, 229);
      this.doc.rect(box.x, startY + 8, 70, 8);
      
      // Value text
      this.doc.setTextColor(51, 51, 51);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(box.value, box.x + 2, startY + 13);
    });
  }

  private addItemsTable(invoice: Invoice): void {
    const startY = 140;
    
    // Prepare table data with proper currency formatting
    const headers = ['Description', 'Qty', 'Rate (Rs)', 'Amount (Rs)'];
    const data = invoice.lineItems.map(item => [
      item.description,
      item.quantity.toString(),
      `Rs ${item.rate.toLocaleString('en-IN')}`,
      `Rs ${item.amount.toLocaleString('en-IN')}`
    ]);

    // Use jsPDF autoTable plugin for better table formatting
    autoTable(this.doc, {
      head: [headers],
      body: data,
      startY: startY,
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 9,
        cellPadding: 4,
        textColor: [51, 51, 51],
        lineColor: [229, 229, 229],
        lineWidth: 0.5
      },
      headStyles: {
        fillColor: [51, 51, 51],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      didDrawPage: (data) => {
        this.tableEndY = data.cursor?.y || startY + 50;
      }
    });
  }

  private addTotals(invoice: Invoice): void {
    // Calculate position after table
    const finalY = this.tableEndY + 10;
    
    // Totals box
    const boxX = 130;
    const boxWidth = 60;
    
    // Subtotal
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(51, 51, 51);
    this.doc.text('Subtotal:', boxX, finalY);
    this.doc.text(`Rs ${invoice.subtotal.toLocaleString('en-IN')}`, boxX + boxWidth, finalY, { align: 'right' });
    
    // Tax
    this.doc.text(`GST (${invoice.taxRate}%):`, boxX, finalY + 6);
    this.doc.text(`Rs ${invoice.taxAmount.toLocaleString('en-IN')}`, boxX + boxWidth, finalY + 6, { align: 'right' });
    
    // Total line
    this.doc.setDrawColor(51, 51, 51);
    this.doc.line(boxX, finalY + 10, boxX + boxWidth, finalY + 10);
    
    // Total amount
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(179, 41, 104);
    this.doc.text('TOTAL:', boxX, finalY + 18);
    this.doc.text(`Rs ${invoice.total.toLocaleString('en-IN')}`, boxX + boxWidth, finalY + 18, { align: 'right' });
  }

  private addNotesAndTerms(invoice: Invoice): void {
    const startY = this.tableEndY + 45;
    
    if (invoice.notes) {
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(51, 51, 51);
      this.doc.text('NOTES:', 20, startY);
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      const notesLines = this.doc.splitTextToSize(invoice.notes, 170);
      this.doc.text(notesLines, 20, startY + 6);
    }
    
    if (invoice.terms) {
      const termsY = startY + (invoice.notes ? 20 : 0);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('PAYMENT TERMS:', 20, termsY);
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      const termsLines = this.doc.splitTextToSize(invoice.terms, 170);
      this.doc.text(termsLines, 20, termsY + 6);
    }
  }

  private addFooter(): void {
    const pageHeight = this.doc.internal.pageSize.getHeight();
    
    // Footer line
    this.doc.setDrawColor(229, 229, 229);
    this.doc.line(20, pageHeight - 20, 190, pageHeight - 20);
    
    // Footer text
    this.doc.setFontSize(8);
    this.doc.setTextColor(102, 102, 102);
    this.doc.text('Thank you for your business!', 105, pageHeight - 15, { align: 'center' });
    this.doc.text('Generated by Freaking Minds Invoice System', 105, pageHeight - 10, { align: 'center' });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
/**
 * Proposal PDF Generator - FreakingMinds Brand Aligned
 * Professional proposal templates with dynamic content and branding
 */

import jsPDF from 'jspdf';
import { Proposal, ServicePackage } from './proposal-types';

export class ProposalPDFGenerator {
  private doc: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private currentY: number;
  private leftMargin: number;
  private rightMargin: number;
  private brandColors: any;

  constructor() {
    this.doc = new jsPDF('p', 'pt', 'a4');
    this.pageHeight = this.doc.internal.pageSize.height;
    this.pageWidth = this.doc.internal.pageSize.width;
    this.currentY = 60;
    this.leftMargin = 60;
    this.rightMargin = 60;
    
    // FreakingMinds Brand Colors (matching your website)
    this.brandColors = {
      primary: '#B3296A', // fm-magenta-600
      secondary: '#FF855D', // fm-orange-400
      accent: '#1E40AF', // fm-blue-700
      dark: '#1F2937', // fm-neutral-800
      light: '#F9FAFB', // fm-neutral-50
      success: '#059669', // Green
      text: '#374151', // fm-neutral-700
      textLight: '#6B7280' // fm-neutral-500
    };
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private setColor(color: string): void {
    const rgb = this.hexToRgb(color);
    this.doc.setTextColor(rgb.r, rgb.g, rgb.b);
  }

  private setFillColor(color: string): void {
    const rgb = this.hexToRgb(color);
    this.doc.setFillColor(rgb.r, rgb.g, rgb.b);
  }

  private checkPageBreak(additionalHeight: number = 50): void {
    if (this.currentY + additionalHeight > this.pageHeight - 80) {
      this.doc.addPage();
      this.currentY = 60;
      this.addPageNumber();
    }
  }

  private addPageNumber(): void {
    const pageNum = this.doc.getCurrentPageInfo().pageNumber;
    if (pageNum > 1) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      this.setColor(this.brandColors.textLight);
      this.doc.text(
        `Page ${pageNum}`,
        this.pageWidth - 80,
        this.pageHeight - 30
      );
    }
  }

  private addBrandHeader(proposal: Proposal): void {
    // Background gradient effect
    this.setFillColor(this.brandColors.light);
    this.doc.rect(0, 0, this.pageWidth, 120, 'F');
    
    // FreakingMinds Logo Area
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(28);
    this.setColor(this.brandColors.primary);
    this.doc.text('FREAKING MINDS', this.leftMargin, 50);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(12);
    this.setColor(this.brandColors.textLight);
    this.doc.text('Creative Digital Marketing Agency', this.leftMargin, 70);
    
    // Proposal Title and Number
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(24);
    this.setColor(this.brandColors.dark);
    this.doc.text('DIGITAL MARKETING PROPOSAL', this.pageWidth - 300, 45, { align: 'right' });
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(14);
    this.setColor(this.brandColors.text);
    this.doc.text(`Proposal #${proposal.proposalNumber}`, this.pageWidth - 300, 65, { align: 'right' });
    this.doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, this.pageWidth - 300, 85, { align: 'right' });

    // Decorative line
    this.setFillColor(this.brandColors.primary);
    this.doc.rect(this.leftMargin, 100, this.pageWidth - 120, 3, 'F');
    
    this.currentY = 140;
  }

  private addClientInfo(proposal: Proposal): void {
    this.checkPageBreak(120);
    
    // Section Header
    this.addSectionHeader('Prepared For');
    
    let clientName = '';
    let clientEmail = '';
    let clientCompany = '';
    
    if (proposal.client.isExisting && proposal.client.clientId) {
      // Would need to fetch client data here
      clientName = 'Existing Client';
      clientEmail = 'client@example.com';
      clientCompany = 'Client Company';
    } else if (proposal.client.prospectInfo) {
      clientName = proposal.client.prospectInfo.name;
      clientEmail = proposal.client.prospectInfo.email;
      clientCompany = proposal.client.prospectInfo.company;
    }

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.setColor(this.brandColors.dark);
    this.doc.text(clientCompany, this.leftMargin, this.currentY);
    this.currentY += 25;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(12);
    this.setColor(this.brandColors.text);
    this.doc.text(clientName, this.leftMargin, this.currentY);
    this.currentY += 20;
    this.doc.text(clientEmail, this.leftMargin, this.currentY);
    this.currentY += 35;
  }

  private addSectionHeader(title: string): void {
    this.checkPageBreak(60);
    
    // Background for section header
    this.setFillColor(this.brandColors.primary);
    this.doc.rect(this.leftMargin - 10, this.currentY - 25, this.pageWidth - 100, 35, 'F');
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.doc.setTextColor(255, 255, 255); // White text
    this.doc.text(title, this.leftMargin, this.currentY - 5);
    
    this.currentY += 25;
  }

  private addExecutiveSummary(proposal: Proposal): void {
    if (!proposal.executiveSummary) return;
    
    this.addSectionHeader('Executive Summary');
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    this.setColor(this.brandColors.text);
    
    const lines = this.doc.splitTextToSize(
      proposal.executiveSummary,
      this.pageWidth - 120
    );
    
    lines.forEach((line: string) => {
      this.checkPageBreak();
      this.doc.text(line, this.leftMargin, this.currentY);
      this.currentY += 15;
    });
    
    this.currentY += 20;
  }

  private addProblemStatement(proposal: Proposal): void {
    if (!proposal.problemStatement) return;
    
    this.addSectionHeader('Current Challenges & Opportunities');
    
    // Add icon-like bullet points
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    this.setColor(this.brandColors.text);
    
    const lines = this.doc.splitTextToSize(
      proposal.problemStatement,
      this.pageWidth - 140
    );
    
    lines.forEach((line: string) => {
      this.checkPageBreak();
      
      // Add bullet point
      this.setFillColor(this.brandColors.primary);
      this.doc.circle(this.leftMargin + 5, this.currentY - 5, 3, 'F');
      
      this.doc.text(line, this.leftMargin + 20, this.currentY);
      this.currentY += 15;
    });
    
    this.currentY += 20;
  }

  private addProposedSolution(proposal: Proposal): void {
    this.addSectionHeader('Our Strategic Solution');
    
    if (proposal.proposedSolution) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(11);
      this.setColor(this.brandColors.text);
      
      const lines = this.doc.splitTextToSize(
        proposal.proposedSolution,
        this.pageWidth - 120
      );
      
      lines.forEach((line: string) => {
        this.checkPageBreak();
        this.doc.text(line, this.leftMargin, this.currentY);
        this.currentY += 15;
      });
      
      this.currentY += 20;
    }

    // Add service packages with enhanced formatting
    proposal.servicePackages.forEach((pkg, index) => {
      this.addServicePackage(pkg, index + 1);
    });
  }

  private addServicePackage(pkg: ServicePackage, index: number): void {
    this.checkPageBreak(120);
    
    // Package header with colored background
    this.setFillColor(this.brandColors.light);
    this.doc.rect(this.leftMargin - 10, this.currentY - 20, this.pageWidth - 100, 40, 'F');
    
    // Package number badge
    this.setFillColor(this.brandColors.primary);
    this.doc.circle(this.leftMargin + 15, this.currentY - 5, 12, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(index.toString(), this.leftMargin + 12, this.currentY - 1);
    
    // Package name
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.setColor(this.brandColors.dark);
    this.doc.text(pkg.name, this.leftMargin + 35, this.currentY - 5);
    
    // Package price
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.setColor(this.brandColors.primary);
    const priceText = `₹${pkg.basePrice.toLocaleString('en-IN')}${pkg.billingType === 'monthly' ? '/month' : ''}`;
    this.doc.text(priceText, this.pageWidth - 120, this.currentY - 5, { align: 'right' });
    
    this.currentY += 25;
    
    // Package description
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.setColor(this.brandColors.text);
    const descLines = this.doc.splitTextToSize(pkg.description, this.pageWidth - 120);
    descLines.forEach((line: string) => {
      this.checkPageBreak();
      this.doc.text(line, this.leftMargin, this.currentY);
      this.currentY += 12;
    });
    
    this.currentY += 10;
    
    // Deliverables
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(10);
    this.setColor(this.brandColors.dark);
    this.doc.text('Key Deliverables:', this.leftMargin, this.currentY);
    this.currentY += 15;
    
    pkg.deliverables.forEach(deliverable => {
      this.checkPageBreak();
      
      // Check mark
      this.setColor(this.brandColors.success);
      this.doc.text('✓', this.leftMargin + 10, this.currentY);
      
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      this.setColor(this.brandColors.text);
      this.doc.text(deliverable, this.leftMargin + 25, this.currentY);
      this.currentY += 12;
    });
    
    this.currentY += 20;
  }

  private addInvestmentSummary(proposal: Proposal): void {
    this.addSectionHeader('Investment Summary');
    
    // Investment table background
    this.setFillColor(this.brandColors.light);
    this.doc.rect(this.leftMargin - 10, this.currentY - 10, this.pageWidth - 100, 120, 'F');
    
    this.currentY += 10;
    
    // Table headers
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.setColor(this.brandColors.dark);
    this.doc.text('Service Package', this.leftMargin, this.currentY);
    this.doc.text('Investment', this.pageWidth - 150, this.currentY, { align: 'right' });
    
    this.currentY += 20;
    
    // Line under headers
    this.setFillColor(this.brandColors.primary);
    this.doc.rect(this.leftMargin - 5, this.currentY - 10, this.pageWidth - 110, 1, 'F');
    
    // Package prices
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    
    proposal.investment.packages.forEach(pkg => {
      this.checkPageBreak();
      const packageInfo = proposal.servicePackages.find(p => p.id === pkg.packageId);
      if (packageInfo) {
        this.setColor(this.brandColors.text);
        this.doc.text(packageInfo.name, this.leftMargin, this.currentY);
        this.doc.text(`₹${pkg.price.toLocaleString('en-IN')}`, this.pageWidth - 150, this.currentY, { align: 'right' });
        this.currentY += 15;
      }
    });
    
    // Subtotal
    this.setFillColor(this.brandColors.textLight);
    this.doc.rect(this.leftMargin - 5, this.currentY, this.pageWidth - 110, 0.5, 'F');
    this.currentY += 15;
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    this.setColor(this.brandColors.text);
    this.doc.text('Subtotal:', this.leftMargin, this.currentY);
    this.doc.text(`₹${proposal.investment.subtotal.toLocaleString('en-IN')}`, this.pageWidth - 150, this.currentY, { align: 'right' });
    this.currentY += 15;
    
    // Discount (if any)
    if (proposal.investment.discount > 0) {
      this.setColor(this.brandColors.success);
      this.doc.text(`Discount (${proposal.investment.discountReason}):`, this.leftMargin, this.currentY);
      this.doc.text(`-₹${proposal.investment.discount.toLocaleString('en-IN')}`, this.pageWidth - 150, this.currentY, { align: 'right' });
      this.currentY += 15;
    }
    
    // Total
    this.setFillColor(this.brandColors.primary);
    this.doc.rect(this.leftMargin - 5, this.currentY, this.pageWidth - 110, 1, 'F');
    this.currentY += 20;
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.setColor(this.brandColors.primary);
    this.doc.text('Total Investment:', this.leftMargin, this.currentY);
    this.doc.text(`₹${proposal.investment.total.toLocaleString('en-IN')}`, this.pageWidth - 150, this.currentY, { align: 'right' });
    
    this.currentY += 40;
  }

  private addTimeline(proposal: Proposal): void {
    this.addSectionHeader('Project Timeline');
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    this.setColor(this.brandColors.text);
    
    // Kickoff
    this.checkPageBreak();
    this.setFillColor(this.brandColors.accent);
    this.doc.circle(this.leftMargin + 8, this.currentY - 5, 4, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Project Kickoff:', this.leftMargin + 20, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(new Date(proposal.timeline.kickoff).toLocaleDateString('en-IN'), this.leftMargin + 120, this.currentY);
    this.currentY += 20;
    
    // Milestones
    proposal.timeline.milestones.forEach(milestone => {
      this.checkPageBreak();
      this.setFillColor(this.brandColors.secondary);
      this.doc.circle(this.leftMargin + 8, this.currentY - 5, 4, 'F');
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(milestone.name + ':', this.leftMargin + 20, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(new Date(milestone.deadline).toLocaleDateString('en-IN'), this.leftMargin + 200, this.currentY);
      this.currentY += 20;
    });
    
    // Completion
    this.checkPageBreak();
    this.setFillColor(this.brandColors.success);
    this.doc.circle(this.leftMargin + 8, this.currentY - 5, 4, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Project Completion:', this.leftMargin + 20, this.currentY);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(new Date(proposal.timeline.completion).toLocaleDateString('en-IN'), this.leftMargin + 140, this.currentY);
    
    this.currentY += 40;
  }

  private addWhyFreakingMinds(proposal: Proposal): void {
    if (!proposal.whyFreakingMinds) return;
    
    this.addSectionHeader('Why Choose Freaking Minds?');
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    this.setColor(this.brandColors.text);
    
    const lines = this.doc.splitTextToSize(
      proposal.whyFreakingMinds,
      this.pageWidth - 120
    );
    
    lines.forEach((line: string) => {
      this.checkPageBreak();
      this.doc.text(line, this.leftMargin, this.currentY);
      this.currentY += 15;
    });
    
    this.currentY += 20;
  }

  private addNextSteps(proposal: Proposal): void {
    if (!proposal.nextSteps) return;
    
    this.addSectionHeader('Next Steps');
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(11);
    this.setColor(this.brandColors.text);
    
    const lines = this.doc.splitTextToSize(
      proposal.nextSteps,
      this.pageWidth - 120
    );
    
    lines.forEach((line: string) => {
      this.checkPageBreak();
      this.doc.text(line, this.leftMargin, this.currentY);
      this.currentY += 15;
    });
    
    this.currentY += 20;
  }

  private addFooter(proposal: Proposal): void {
    // Contact information footer
    this.currentY = this.pageHeight - 150;
    
    this.setFillColor(this.brandColors.dark);
    this.doc.rect(0, this.currentY - 20, this.pageWidth, 100, 'F');
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('FREAKING MINDS', this.leftMargin, this.currentY + 10);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(200, 200, 200);
    this.doc.text('Digital Marketing Agency • Bhopal, Madhya Pradesh', this.leftMargin, this.currentY + 30);
    this.doc.text('Email: hello@freakingminds.in • Phone: +91 98765 43210', this.leftMargin, this.currentY + 45);
    this.doc.text('Website: www.freakingminds.in', this.leftMargin, this.currentY + 60);
    
    // Valid until notice
    this.doc.setFont('helvetica', 'italic');
    this.doc.setFontSize(9);
    this.doc.text(
      `This proposal is valid until ${new Date(proposal.validUntil).toLocaleDateString('en-IN')}`,
      this.pageWidth - 200,
      this.currentY + 45,
      { align: 'right' }
    );
  }

  public async generateProposal(proposal: Proposal, template: 'professional' | 'creative' | 'technical' | 'startup' = 'professional'): Promise<string> {
    try {
      // Reset document
      this.doc = new jsPDF('p', 'pt', 'a4');
      this.currentY = 60;
      
      // Add content based on template
      this.addBrandHeader(proposal);
      this.addClientInfo(proposal);
      
      if (proposal.executiveSummary) {
        this.addExecutiveSummary(proposal);
      }
      
      if (proposal.problemStatement) {
        this.addProblemStatement(proposal);
      }
      
      this.addProposedSolution(proposal);
      this.addInvestmentSummary(proposal);
      
      if (proposal.timeline.milestones.length > 0) {
        this.addTimeline(proposal);
      }
      
      this.addWhyFreakingMinds(proposal);
      this.addNextSteps(proposal);
      
      // Add page numbers to all pages except first
      const totalPages = this.doc.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) {
        this.doc.setPage(i);
        this.addPageNumber();
      }
      
      // Add footer to last page
      this.doc.setPage(totalPages);
      this.addFooter(proposal);
      
      // Return as data URI
      return this.doc.output('datauristring');
      
    } catch (error) {
      console.error('Error generating proposal PDF:', error);
      throw new Error('Failed to generate proposal PDF');
    }
  }

  public async downloadProposal(proposal: Proposal, template: 'professional' | 'creative' | 'technical' | 'startup' = 'professional'): Promise<void> {
    try {
      await this.generateProposal(proposal, template);
      
      const clientName = proposal.client.prospectInfo?.company || 
                        proposal.client.prospectInfo?.name || 
                        'Client';
      const filename = `FreakingMinds_Proposal_${proposal.proposalNumber}_${clientName.replace(/\s+/g, '_')}.pdf`;
      
      this.doc.save(filename);
    } catch (error) {
      console.error('Error downloading proposal PDF:', error);
      throw new Error('Failed to download proposal PDF');
    }
  }
}
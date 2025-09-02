/**
 * Proposal Storage Utilities
 * Handles proposal data persistence and management
 */

import { Proposal } from './proposal-types';

const PROPOSALS_KEY = 'fm_admin_proposals';

export class ProposalStorage {
  /**
   * Save proposal
   */
  static saveProposal(proposal: Proposal): void {
    if (typeof window === 'undefined') return;

    try {
      const proposals = this.getProposals();
      const existingIndex = proposals.findIndex(prop => prop.id === proposal.id);
      
      const updatedProposal = {
        ...proposal,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        proposals[existingIndex] = updatedProposal;
      } else {
        proposals.push({
          ...updatedProposal,
          createdAt: new Date().toISOString(),
        });
      }

      localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals));
    } catch (error) {
      console.error('Error saving proposal:', error);
    }
  }

  /**
   * Get all proposals
   */
  static getProposals(): Proposal[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(PROPOSALS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading proposals:', error);
      return [];
    }
  }

  /**
   * Get proposal by ID
   */
  static getProposal(id: string): Proposal | null {
    const proposals = this.getProposals();
    return proposals.find(prop => prop.id === id) || null;
  }

  /**
   * Delete proposal
   */
  static deleteProposal(id: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const proposals = this.getProposals();
      const filteredProposals = proposals.filter(prop => prop.id !== id);
      localStorage.setItem(PROPOSALS_KEY, JSON.stringify(filteredProposals));
      return true;
    } catch (error) {
      console.error('Error deleting proposal:', error);
      return false;
    }
  }

  /**
   * Get proposals by status
   */
  static getProposalsByStatus(status: Proposal['status']): Proposal[] {
    const proposals = this.getProposals();
    return proposals.filter(prop => prop.status === status);
  }

  /**
   * Get proposals by client
   */
  static getProposalsByClient(clientId: string): Proposal[] {
    const proposals = this.getProposals();
    return proposals.filter(prop => prop.client.clientId === clientId);
  }

  /**
   * Update proposal status
   */
  static updateProposalStatus(id: string, status: Proposal['status']): boolean {
    try {
      const proposals = this.getProposals();
      const proposalIndex = proposals.findIndex(prop => prop.id === id);
      
      if (proposalIndex >= 0) {
        proposals[proposalIndex].status = status;
        proposals[proposalIndex].updatedAt = new Date().toISOString();
        
        // Set tracking timestamps
        if (status === 'sent' && !proposals[proposalIndex].sentAt) {
          proposals[proposalIndex].sentAt = new Date().toISOString();
        } else if (status === 'viewed' && !proposals[proposalIndex].viewedAt) {
          proposals[proposalIndex].viewedAt = new Date().toISOString();
        } else if (status === 'approved' && !proposals[proposalIndex].approvedAt) {
          proposals[proposalIndex].approvedAt = new Date().toISOString();
        }
        
        localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating proposal status:', error);
      return false;
    }
  }

  /**
   * Get proposal statistics
   */
  static getProposalStats(): {
    total: number;
    draft: number;
    sent: number;
    viewed: number;
    approved: number;
    declined: number;
    expired: number;
    converted: number;
    approvalRate: number;
    conversionRate: number;
  } {
    const proposals = this.getProposals();
    const stats = {
      total: proposals.length,
      draft: 0,
      sent: 0,
      viewed: 0,
      approved: 0,
      declined: 0,
      expired: 0,
      converted: 0,
      approvalRate: 0,
      conversionRate: 0
    };

    proposals.forEach(proposal => {
      stats[proposal.status]++;
    });

    // Calculate rates
    const sentProposals = stats.sent + stats.viewed + stats.approved + stats.declined + stats.expired + stats.converted;
    if (sentProposals > 0) {
      stats.approvalRate = ((stats.approved + stats.converted) / sentProposals) * 100;
      stats.conversionRate = (stats.converted / sentProposals) * 100;
    }

    return stats;
  }

  /**
   * Duplicate proposal
   */
  static duplicateProposal(id: string, newTitle?: string): Proposal | null {
    try {
      const originalProposal = this.getProposal(id);
      if (!originalProposal) return null;

      const duplicatedProposal: Proposal = {
        ...originalProposal,
        id: `prop-${Date.now()}`,
        title: newTitle || `Copy of ${originalProposal.title}`,
        proposalNumber: '', // Will be generated when saved
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sentAt: undefined,
        viewedAt: undefined,
        approvedAt: undefined
      };

      return duplicatedProposal;
    } catch (error) {
      console.error('Error duplicating proposal:', error);
      return null;
    }
  }

  /**
   * Export all proposals
   */
  static exportProposals(): Proposal[] {
    return this.getProposals();
  }

  /**
   * Import proposals
   */
  static importProposals(proposals: Proposal[]): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals));
      return true;
    } catch (error) {
      console.error('Error importing proposals:', error);
      return false;
    }
  }

  /**
   * Clear all proposals
   */
  static clearAllProposals(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(PROPOSALS_KEY);
    } catch (error) {
      console.error('Error clearing proposals:', error);
    }
  }

  /**
   * Calculate total proposal value
   */
  static getTotalProposalValue(status?: Proposal['status']): number {
    const proposals = status 
      ? this.getProposalsByStatus(status)
      : this.getProposals();
    
    return proposals.reduce((total, proposal) => total + proposal.investment.total, 0);
  }

  /**
   * Get recent proposals
   */
  static getRecentProposals(limit: number = 5): Proposal[] {
    const proposals = this.getProposals();
    return proposals
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }
}
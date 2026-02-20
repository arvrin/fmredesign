/**
 * Admin Proposals Page - FreakingMinds
 * Comprehensive proposal management system
 */

'use client';

import { useState } from 'react';
import { Proposal } from '@/lib/admin/proposal-types';
import { ProposalDashboard } from '@/components/admin/ProposalDashboard';
import { ProposalFormNew } from '@/components/admin/ProposalFormNew';
import { ArrowLeft } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';

export default function AdminProposalsPage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'edit'>('dashboard');
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);

  const handleCreateNew = () => {
    setEditingProposal(null);
    setCurrentView('create');
  };

  const handleEditProposal = (proposal: Proposal) => {
    setEditingProposal(proposal);
    setCurrentView('edit');
  };

  const handleBackToDashboard = () => {
    setEditingProposal(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      {currentView !== 'dashboard' && (
        <DashboardButton
          variant="ghost"
          size="sm"
          onClick={handleBackToDashboard}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </DashboardButton>
      )}

      {/* Main Content */}
      {currentView === 'dashboard' && (
        <ProposalDashboard
          onCreateNew={handleCreateNew}
          onEditProposal={handleEditProposal}
        />
      )}

      {(currentView === 'create' || currentView === 'edit') && (
        <div>
          <PageHeader
            title={currentView === 'create' ? 'Create New Proposal' : 'Edit Proposal'}
            description={
              currentView === 'create'
                ? 'Create a professional digital marketing proposal for your client'
                : `Editing proposal: ${editingProposal?.proposalNumber}`
            }
          />
          <ProposalFormNew
            initialProposal={editingProposal}
            onSaveSuccess={handleBackToDashboard}
          />
        </div>
      )}
    </div>
  );
}

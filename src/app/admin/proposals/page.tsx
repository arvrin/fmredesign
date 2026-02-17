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
import { DashboardButton as Button } from '@/design-system';

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
    <div className="min-h-screen bg-fm-neutral-50">
      {/* Navigation */}
      {currentView !== 'dashboard' && (
        <div className="bg-white border-b border-fm-neutral-200 px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <ProposalDashboard
            onCreateNew={handleCreateNew}
            onEditProposal={handleEditProposal}
          />
        )}

        {(currentView === 'create' || currentView === 'edit') && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-fm-neutral-900">
                {currentView === 'create' ? 'Create New Proposal' : 'Edit Proposal'}
              </h1>
              <p className="text-fm-neutral-600">
                {currentView === 'create' 
                  ? 'Create a professional digital marketing proposal for your client'
                  : `Editing proposal: ${editingProposal?.proposalNumber}`
                }
              </p>
            </div>
            <ProposalFormNew 
              initialProposal={editingProposal}
              onSaveSuccess={handleBackToDashboard}
            />
          </div>
        )}
      </div>
    </div>
  );
}
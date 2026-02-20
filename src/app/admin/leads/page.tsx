/**
 * Lead Management Dashboard
 * Comprehensive lead tracking and conversion system for admin users.
 *
 * Thin composition layer — data fetching and state live in useLeads(),
 * UI sections are split into LeadAnalytics, LeadFilters, and LeadTable.
 */

'use client';

import { Download, Plus } from 'lucide-react';
import { DashboardButton, MetricCardSkeleton } from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionErrorBoundary } from '@/components/admin/SectionErrorBoundary';
import { AddLeadModal } from '@/components/admin/AddLeadModal';
import { LeadAnalytics, LeadFilters, LeadTable } from '@/components/admin/leads';
import { useLeads } from '@/hooks/admin/useLeads';

export default function LeadDashboard() {
  const {
    leads,
    dashboardStats,
    loading,
    selectedLeads,
    setSelectedLeads,
    selectedLead,
    setSelectedLead,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    filters,
    searchQuery,
    setSearchQuery,
    showAddLead,
    setShowAddLead,
    loadDashboardData,
    updateLeadStatus,
    convertToClient,
    exportLeads,
    formatStatus,
    formatPriority,
  } = useLeads();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Lead Management"
        description="Track, qualify, and convert your leads"
        actions={
          <div className="flex items-center gap-3">
            <DashboardButton variant="secondary" size="sm" onClick={exportLeads}>
              <Download className="w-4 h-4" />
              Export
            </DashboardButton>
            <DashboardButton variant="primary" size="sm" onClick={() => setShowAddLead(true)}>
              <Plus className="w-4 h-4" />
              Add Lead
            </DashboardButton>
          </div>
        }
      />

      {/* Stats Cards */}
      {dashboardStats && (
        <SectionErrorBoundary section="Lead Analytics">
          <LeadAnalytics dashboardStats={dashboardStats} />
        </SectionErrorBoundary>
      )}

      {/* Filters and Search */}
      <SectionErrorBoundary section="Lead Filters">
        <LeadFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={(field, direction) => {
            setSortBy(field);
            setSortDirection(direction);
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </SectionErrorBoundary>

      {/* Leads Table / Cards + Detail Drawer + Empty State */}
      <SectionErrorBoundary section="Lead List">
        <LeadTable
          leads={leads}
          loading={loading}
          viewMode={viewMode}
          selectedLeads={selectedLeads}
          onSelectedLeadsChange={setSelectedLeads}
          selectedLead={selectedLead}
          onSelectLead={setSelectedLead}
          onUpdateStatus={updateLeadStatus}
          onConvertToClient={convertToClient}
          onAddLead={() => setShowAddLead(true)}
          searchQuery={searchQuery}
          filters={filters}
          formatStatus={formatStatus}
          formatPriority={formatPriority}
        />
      </SectionErrorBoundary>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={showAddLead}
        onClose={() => setShowAddLead(false)}
        onLeadAdded={() => {
          loadDashboardData();
        }}
      />
    </div>
  );
}

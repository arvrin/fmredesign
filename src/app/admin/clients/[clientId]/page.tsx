'use client';

import { useParams, useRouter } from 'next/navigation';
import { DashboardButton } from '@/design-system';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import ClientPortalLink from '@/components/admin/ClientPortalLink';
import ContractsTab from '@/components/admin/ContractsTab';
import { SectionErrorBoundary } from '@/components/admin/SectionErrorBoundary';
import { useClientDetail } from '@/hooks/admin/useClientDetail';
import {
  OverviewTab,
  ProjectsTab,
  TeamTab,
  CommunicationTab,
} from '@/components/admin/client-detail';
import { ArrowLeft, AlertCircle } from 'lucide-react';

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function getHealthColor(health: string): string {
  switch (health.toLowerCase()) {
    case 'excellent':
      return 'text-green-600';
    case 'good':
      return 'text-fm-magenta-600';
    case 'warning':
      return 'text-yellow-600';
    case 'critical':
      return 'text-red-600';
    default:
      return 'text-fm-neutral-600';
  }
}

// ────────────────────────────────────────────────────────────
// Page component
// ────────────────────────────────────────────────────────────

export default function AdminClientDetail() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;

  const {
    clientProfile,
    loading,
    error,
    assignedTeamMembers,
    availableTeamMembers,
    showAddTeamForm,
    setShowAddTeamForm,
    newTeamAssignment,
    setNewTeamAssignment,
    handleAddTeamMember,
    handleRemoveTeamMember,
    clientProjects,
    projectsLoading,
    fetchClientProjects,
    activityFeed,
    activityLoading,
  } = useClientDetail(clientId);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  // ── Error / not found state ──
  if (error || !clientProfile) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<AlertCircle className="h-6 w-6" />}
          title={error || 'Client not found'}
          action={
            <DashboardButton onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </DashboardButton>
          }
        />
      </div>
    );
  }

  const additionalEmails = clientProfile.additionalContacts.map((c) => c.email);

  return (
    <div className="space-y-6">
      <PageHeader
        title={clientProfile.name}
        description={`${clientProfile.industry} • Managed by ${clientProfile.accountManager}`}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <DashboardButton onClick={() => router.back()} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back
            </DashboardButton>
            <StatusBadge status={clientProfile.status} />
            <div className={`flex items-center ${getHealthColor(clientProfile.health)}`}>
              <div className="h-2 w-2 rounded-full bg-current mr-2"></div>
              <span className="text-sm font-medium capitalize">{clientProfile.health}</span>
            </div>
          </div>
        }
      />

      <div>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portal">Client Portal</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SectionErrorBoundary section="Overview">
              <OverviewTab clientProfile={clientProfile} />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="portal" className="space-y-6">
            <SectionErrorBoundary section="Client Portal">
              <ClientPortalLink
                clientId={clientProfile.id}
                clientName={clientProfile.name}
                primaryEmail={clientProfile.primaryContact.email}
                additionalEmails={additionalEmails}
              />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent
            value="projects"
            className="space-y-6"
            onFocusCapture={() => {
              if (clientProjects.length === 0 && !projectsLoading) fetchClientProjects();
            }}
          >
            <SectionErrorBoundary section="Projects">
              <ProjectsTab
                projects={clientProjects}
                loading={projectsLoading}
                onFetchProjects={fetchClientProjects}
              />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            <SectionErrorBoundary section="Contracts">
              <ContractsTab clientId={clientId} clientName={clientProfile?.name} />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <SectionErrorBoundary section="Team">
              <TeamTab
                assignedTeamMembers={assignedTeamMembers}
                availableTeamMembers={availableTeamMembers}
                showAddTeamForm={showAddTeamForm}
                setShowAddTeamForm={setShowAddTeamForm}
                newTeamAssignment={newTeamAssignment}
                setNewTeamAssignment={setNewTeamAssignment}
                onAddTeamMember={handleAddTeamMember}
                onRemoveTeamMember={handleRemoveTeamMember}
              />
            </SectionErrorBoundary>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <SectionErrorBoundary section="Communication">
              <CommunicationTab activityFeed={activityFeed} loading={activityLoading} />
            </SectionErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/**
 * CreativeMinds Admin Dashboard
 * Talent management and application review
 *
 * Thin composition layer — data logic lives in useCreativeMinds,
 * UI sections live under @/components/admin/creativeminds.
 */

'use client';

import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SectionErrorBoundary } from '@/components/admin/SectionErrorBoundary';
import { useCreativeMinds, type CreativeMindsTab } from '@/hooks/admin/useCreativeMinds';
import { TalentFilters, ApplicationsList } from '@/components/admin/creativeminds';

// Lazy-load non-default tabs
const TalentsList = dynamic(() => import('@/components/admin/creativeminds/TalentGrid').then(m => ({ default: m.TalentsList })));
const AnalyticsView = dynamic(() => import('@/components/admin/creativeminds/AnalyticsView').then(m => ({ default: m.AnalyticsView })));

export default function CreativeMindsAdminPage() {
  const {
    activeTab,
    setActiveTab,
    applications,
    talents,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    filteredApplications,
    filteredTalents,
    handleApplicationAction,
  } = useCreativeMinds();

  return (
    <div className="space-y-6">
      <PageHeader
        title="CreativeMinds Network"
        description="Manage talent applications and network members"
        actions={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{talents.length} Active Talents</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>{applications.filter((a) => a.status === 'submitted').length} Pending Reviews</span>
            </div>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CreativeMindsTab)}>
        <TabsList variant="line">
          <TabsTrigger value="applications">
            Applications ({applications.filter((a) => a.status === 'submitted').length})
          </TabsTrigger>
          <TabsTrigger value="talents">
            Network ({talents.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* --- Applications tab --- */}
        <TabsContent value="applications">
          <TalentFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showStatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
          <SectionErrorBoundary section="Applications">
            <ApplicationsList
              applications={filteredApplications}
              isLoading={isLoading}
              onAction={handleApplicationAction}
            />
          </SectionErrorBoundary>
        </TabsContent>

        {/* --- Talents tab --- */}
        <TabsContent value="talents">
          <TalentFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <SectionErrorBoundary section="Talent Network">
            <TalentsList talents={filteredTalents} isLoading={isLoading} />
          </SectionErrorBoundary>
        </TabsContent>

        {/* --- Analytics tab --- */}
        <TabsContent value="analytics">
          <SectionErrorBoundary section="Analytics">
            <AnalyticsView applications={applications} talents={talents} />
          </SectionErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}

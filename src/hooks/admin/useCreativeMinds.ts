/**
 * useCreativeMinds — data fetching, filtering, and status management
 * for the CreativeMinds admin page.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { TalentApplication, TalentProfile } from '@/lib/admin/talent-types';
import { adminToast } from '@/lib/admin/toast';

export type CreativeMindsTab = 'applications' | 'talents' | 'analytics';

export interface UseCreativeMindsReturn {
  /** Active tab */
  activeTab: CreativeMindsTab;
  setActiveTab: (tab: CreativeMindsTab) => void;

  /** Raw data */
  applications: TalentApplication[];
  talents: TalentProfile[];
  isLoading: boolean;

  /** Filter state */
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;

  /** Filtered data */
  filteredApplications: TalentApplication[];
  filteredTalents: TalentProfile[];

  /** Actions */
  handleApplicationAction: (applicationId: string, action: 'approve' | 'reject') => Promise<void>;
  loadData: () => Promise<void>;
}

export function useCreativeMinds(): UseCreativeMindsReturn {
  const [activeTab, setActiveTab] = useState<CreativeMindsTab>('applications');
  const [applications, setApplications] = useState<TalentApplication[]>([]);
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'applications') {
        const response = await fetch('/api/talent?type=applications');
        const result = await response.json();
        if (result.success) {
          setApplications(result.data);
        }
      } else if (activeTab === 'talents') {
        const response = await fetch('/api/talent?type=talents&status=approved');
        const result = await response.json();
        if (result.success) {
          setTalents(result.data);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      adminToast.error('Failed to load talent data');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApplicationAction = useCallback(
    async (applicationId: string, action: 'approve' | 'reject') => {
      try {
        if (action === 'approve') {
          const response = await fetch('/api/talent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'approve_application',
              applicationId,
            }),
          });

          const result = await response.json();
          if (result.success) {
            loadData();
            adminToast.success('Application approved and talent added to network!');
          } else {
            adminToast.error('Failed to approve application');
          }
        } else {
          const response = await fetch('/api/talent', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'application',
              id: applicationId,
              updates: {
                status: 'rejected',
                reviewedAt: new Date().toISOString(),
                reviewedBy: 'admin',
              },
            }),
          });

          const result = await response.json();
          if (result.success) {
            loadData();
            adminToast.success('Application rejected.');
          } else {
            adminToast.error('Failed to reject application');
          }
        }
      } catch (error) {
        console.error('Error updating application:', error);
        adminToast.error('Failed to update application');
      }
    },
    [loadData]
  );

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      app.personalInfo.fullName.toLowerCase().includes(lowerQuery) ||
      app.personalInfo.email.toLowerCase().includes(lowerQuery);
    return matchesStatus && matchesSearch;
  });

  const filteredTalents = talents.filter((talent) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      talent.personalInfo.fullName.toLowerCase().includes(lowerQuery) ||
      talent.personalInfo.email.toLowerCase().includes(lowerQuery);
    return matchesSearch;
  });

  return {
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
    loadData,
  };
}

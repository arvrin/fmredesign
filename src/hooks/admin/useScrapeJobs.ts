/**
 * useScrapeJobs Hook
 * State management for the scrape jobs dashboard:
 * jobs, runs, rotation configs, source configs, and suggestions.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { adminToast } from '@/lib/admin/toast';
import type {
  ScrapeJob,
  ScrapeJobRun,
  ScrapeJobStats,
  ScrapeRotationConfig,
  ScrapeSourceConfig,
  ScrapeRotationSuggestion,
  ScrapeSourcePlatform,
  ScrapeScheduleType,
} from '@/lib/admin/scrape-job-types';

export type ScrapeJobTab = 'jobs' | 'runs' | 'rotation' | 'settings';

export interface UseScrapeJobsReturn {
  // Data
  jobs: ScrapeJob[];
  runs: ScrapeJobRun[];
  stats: ScrapeJobStats | null;
  rotationConfigs: ScrapeRotationConfig[];
  sourceConfigs: ScrapeSourceConfig[];
  suggestions: ScrapeRotationSuggestion[];
  loading: boolean;

  // UI state
  activeTab: ScrapeJobTab;
  setActiveTab: (tab: ScrapeJobTab) => void;
  selectedJob: ScrapeJob | null;
  setSelectedJob: (job: ScrapeJob | null) => void;
  showCreateJob: boolean;
  setShowCreateJob: (show: boolean) => void;

  // Actions
  loadJobs: () => Promise<void>;
  loadRuns: (jobId?: string) => Promise<void>;
  loadConfig: () => Promise<void>;
  loadSuggestions: () => Promise<void>;
  createJob: (data: {
    name: string;
    sourcePlatform: ScrapeSourcePlatform;
    params: Record<string, unknown>;
    scheduleType: ScrapeScheduleType;
    rotationGroupId?: string;
  }) => Promise<void>;
  updateJob: (id: string, data: Record<string, unknown>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  triggerJob: (id: string) => Promise<void>;
  updateSourceConfig: (id: string, config: Record<string, unknown>) => Promise<void>;
  cancelRun: (runId: string) => Promise<void>;
  updateRotationConfig: (id: string | null, data: Record<string, unknown>) => Promise<void>;
  deleteRotationConfig: (id: string) => Promise<void>;
}

export function useScrapeJobs(): UseScrapeJobsReturn {
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [runs, setRuns] = useState<ScrapeJobRun[]>([]);
  const [stats, setStats] = useState<ScrapeJobStats | null>(null);
  const [rotationConfigs, setRotationConfigs] = useState<ScrapeRotationConfig[]>([]);
  const [sourceConfigs, setSourceConfigs] = useState<ScrapeSourceConfig[]>([]);
  const [suggestions, setSuggestions] = useState<ScrapeRotationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ScrapeJobTab>('jobs');
  const [selectedJob, setSelectedJob] = useState<ScrapeJob | null>(null);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const loadJobs = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/scrape-jobs');
      const json = await response.json();
      if (json.success) {
        setJobs(json.data);
        setStats(json.stats);
      }
    } catch (error) {
      console.error('Error loading scrape jobs:', error);
      adminToast.error('Failed to load scrape jobs');
    }
  }, []);

  const loadRuns = useCallback(async (jobId?: string) => {
    try {
      const params = new URLSearchParams();
      if (jobId) params.set('jobId', jobId);
      params.set('limit', '50');

      const response = await fetch(`/api/admin/scrape-jobs/runs?${params}`);
      const json = await response.json();
      if (json.success) {
        setRuns(json.data);
      }
    } catch (error) {
      console.error('Error loading runs:', error);
      adminToast.error('Failed to load run history');
    }
  }, []);

  const loadConfig = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/scrape-jobs/config');
      const json = await response.json();
      if (json.success) {
        setSourceConfigs(json.data.sourceConfigs);
        setRotationConfigs(json.data.rotationConfigs);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }, []);

  const loadSuggestions = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/scrape-jobs/config?type=suggestions');
      const json = await response.json();
      if (json.success) {
        setSuggestions(json.data);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([loadJobs(), loadRuns(), loadConfig()]);
      setLoading(false);
    };
    load();
  }, [loadJobs, loadRuns, loadConfig]);

  // Load suggestions when rotation tab is selected
  useEffect(() => {
    if (activeTab === 'rotation') {
      loadSuggestions();
    }
  }, [activeTab, loadSuggestions]);

  const createJob = useCallback(async (data: {
    name: string;
    sourcePlatform: ScrapeSourcePlatform;
    params: Record<string, unknown>;
    scheduleType: ScrapeScheduleType;
    rotationGroupId?: string;
  }) => {
    try {
      const response = await fetch('/api/admin/scrape-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (json.success) {
        adminToast.success('Job created');
        setShowCreateJob(false);
        await loadJobs();
      } else {
        adminToast.error(json.error || 'Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      adminToast.error('Failed to create job');
    }
  }, [loadJobs]);

  const updateJob = useCallback(async (id: string, data: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/admin/scrape-jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      const json = await response.json();
      if (json.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, ...json.data } : j))
        );
      }
    } catch (error) {
      console.error('Error updating job:', error);
      adminToast.error('Failed to update job');
    }
  }, []);

  const deleteJob = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/scrape-jobs?id=${id}`, {
        method: 'DELETE',
      });
      const json = await response.json();
      if (json.success) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
        adminToast.success('Job deleted');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      adminToast.error('Failed to delete job');
    }
  }, []);

  const cancelRun = useCallback(async (runId: string) => {
    try {
      const res = await fetch('/api/admin/scrape-jobs/runs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runId, action: 'cancel' }),
      });
      const json = await res.json();
      if (json.success) {
        adminToast.success('Run cancelled');
        await loadRuns();
      } else {
        adminToast.error(json.error || 'Failed to cancel run');
      }
    } catch {
      adminToast.error('Failed to cancel run');
    }
  }, [loadRuns]);

  const triggerJob = useCallback(async (id: string) => {
    try {
      // Pre-validation: check for existing pending/running runs
      const hasPending = runs.some(
        (r) => r.jobId === id && (r.status === 'pending' || r.status === 'running')
      );
      if (hasPending) {
        adminToast.error('This job already has a pending or running run. Cancel it first.');
        return;
      }

      // Pre-validation: check API key for google_maps
      const job = jobs.find((j) => j.id === id);
      if (job?.sourcePlatform === 'google_maps') {
        const gmConfig = sourceConfigs.find((sc) => sc.sourcePlatform === 'google_maps');
        if (!gmConfig || !gmConfig.isValid) {
          adminToast.error('Google Maps API key not configured. Go to Settings tab.');
          return;
        }
      }

      // Step 1: Create pending run
      const response = await fetch('/api/admin/scrape-jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'trigger' }),
      });
      const json = await response.json();
      if (!json.success) {
        adminToast.error(json.error || 'Failed to trigger run');
        return;
      }

      // Step 2: Start orchestrator to process it
      adminToast.success('Run triggered — starting scraper...');
      await loadRuns();

      const execRes = await fetch('/api/admin/scrape-jobs/execute', { method: 'POST' });
      const execJson = await execRes.json();
      if (execJson.success) {
        adminToast.success('Scraper is running in the background');
      } else {
        adminToast.error(execJson.error || 'Failed to start scraper');
      }

      // Auto-refresh: poll every 5s for 2 minutes
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        await loadRuns();
        await loadJobs();
      }, 5000);
      setTimeout(() => {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
      }, 120000);
    } catch (error) {
      console.error('Error triggering job:', error);
      adminToast.error('Failed to trigger run');
    }
  }, [loadRuns, loadJobs, runs, jobs, sourceConfigs]);

  const updateSourceConfig = useCallback(async (id: string, config: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/admin/scrape-jobs/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'source', id, config }),
      });
      const json = await response.json();
      if (json.success) {
        setSourceConfigs((prev) =>
          prev.map((sc) => (sc.id === id ? json.data : sc))
        );
        adminToast.success('Source config updated');
      }
    } catch (error) {
      console.error('Error updating source config:', error);
      adminToast.error('Failed to update source config');
    }
  }, []);

  const updateRotationConfig = useCallback(async (id: string | null, data: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/admin/scrape-jobs/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'rotation', id, ...data }),
      });
      const json = await response.json();
      if (json.success) {
        if (id) {
          setRotationConfigs((prev) =>
            prev.map((rc) => (rc.id === id ? json.data : rc))
          );
        } else {
          setRotationConfigs((prev) => [json.data, ...prev]);
        }
        adminToast.success(id ? 'Rotation updated' : 'Rotation created');
      }
    } catch (error) {
      console.error('Error updating rotation config:', error);
      adminToast.error('Failed to update rotation config');
    }
  }, []);

  const deleteRotationConfig = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/scrape-jobs/config?id=${id}`, {
        method: 'DELETE',
      });
      const json = await response.json();
      if (json.success) {
        setRotationConfigs((prev) => prev.filter((rc) => rc.id !== id));
        adminToast.success('Rotation deleted');
      }
    } catch (error) {
      console.error('Error deleting rotation config:', error);
      adminToast.error('Failed to delete rotation config');
    }
  }, []);

  return {
    jobs,
    runs,
    stats,
    rotationConfigs,
    sourceConfigs,
    suggestions,
    loading,
    activeTab,
    setActiveTab,
    selectedJob,
    setSelectedJob,
    showCreateJob,
    setShowCreateJob,
    loadJobs,
    loadRuns,
    loadConfig,
    loadSuggestions,
    createJob,
    updateJob,
    deleteJob,
    triggerJob,
    cancelRun,
    updateSourceConfig,
    updateRotationConfig,
    deleteRotationConfig,
  };
}

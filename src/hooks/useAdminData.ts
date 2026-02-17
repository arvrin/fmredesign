'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { adminToast } from '@/lib/admin/toast';

interface UseAdminDataOptions<T> {
  enabled?: boolean;
  refetchInterval?: number;
  transform?: (data: any[]) => T[];
  onError?: (error: string) => void;
}

interface UseAdminDataReturn<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (optimisticData: T[]) => void;
}

export function useAdminData<T = any>(
  endpoint: string,
  options?: UseAdminDataOptions<T>
): UseAdminDataReturn<T> {
  const { enabled = true, refetchInterval, transform, onError } = options ?? {};
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      const res = await fetch(endpoint);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || json.message || 'Failed to fetch data');
      }

      const rawData = json.data ?? [];
      const result = transform ? transform(rawData) : rawData;
      setData(result);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(msg);
      if (onError) {
        onError(msg);
      } else {
        adminToast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, enabled, transform, onError]);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(fetchData, refetchInterval);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [refetchInterval, enabled, fetchData]);

  const mutate = useCallback((optimisticData: T[]) => {
    setData(optimisticData);
  }, []);

  return { data, isLoading, error, refetch: fetchData, mutate };
}

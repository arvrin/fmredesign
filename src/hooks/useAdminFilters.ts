'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface UseAdminFiltersConfig {
  search?: boolean;
  status?: string[];
  sort?: { field: string; direction: 'asc' | 'desc' };
  tab?: string;
  page?: number;
}

export function useAdminFilters(config?: UseAdminFiltersConfig) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const search = useMemo(() => searchParams?.get('q') ?? '', [searchParams]);
  const status = useMemo(() => searchParams?.get('status') ?? '', [searchParams]);
  const sortField = useMemo(() => searchParams?.get('sort') ?? config?.sort?.field ?? '', [searchParams, config]);
  const sortDir = useMemo(
    () => (searchParams?.get('dir') as 'asc' | 'desc') ?? config?.sort?.direction ?? 'asc',
    [searchParams, config]
  );
  const tab = useMemo(() => searchParams?.get('tab') ?? config?.tab ?? '', [searchParams, config]);
  const page = useMemo(() => parseInt(searchParams?.get('page') ?? '1', 10), [searchParams]);

  return {
    search,
    setSearch: (value: string) => updateParams({ q: value || null, page: null }),
    status,
    setStatus: (value: string) => updateParams({ status: value || null, page: null }),
    sortField,
    sortDir,
    setSort: (field: string, dir: 'asc' | 'desc') => updateParams({ sort: field, dir }),
    tab,
    setTab: (value: string) => updateParams({ tab: value || null }),
    page,
    setPage: (value: number) => updateParams({ page: value > 1 ? String(value) : null }),
    updateParams,
  };
}

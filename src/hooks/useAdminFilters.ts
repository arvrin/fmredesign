'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseAdminFiltersConfig {
  search?: boolean;
  status?: string[];
  sort?: { field: string; direction: 'asc' | 'desc' };
  tab?: string;
  page?: number;
}

export interface SavedView {
  id: string;
  name: string;
  pathname: string;
  params: Record<string, string>;
  createdAt: string;
}

const SAVED_VIEWS_KEY = 'fm-admin-saved-views';

function getFilterStorageKey(pathname: string) {
  return `fm-admin-filters:${pathname}`;
}

export function useAdminFilters(config?: UseAdminFiltersConfig) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Restore filters from localStorage on init (only if URL has no params)
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    // If URL already has search params, don't restore from localStorage
    if (searchParams && searchParams.toString()) return;

    try {
      const stored = localStorage.getItem(getFilterStorageKey(pathname ?? ''));
      if (stored) {
        const params = JSON.parse(stored) as Record<string, string>;
        const qs = new URLSearchParams(params).toString();
        if (qs) {
          router.replace(`${pathname}?${qs}`, { scroll: false });
        }
      }
    } catch {
      /* localStorage unavailable */
    }
  }, [initialized, searchParams, pathname, router]);

  // Persist filters to localStorage whenever URL params change
  useEffect(() => {
    if (!initialized || !pathname) return;
    try {
      const paramsStr = searchParams?.toString() ?? '';
      if (paramsStr) {
        const obj: Record<string, string> = {};
        searchParams?.forEach((value, key) => {
          obj[key] = value;
        });
        localStorage.setItem(getFilterStorageKey(pathname), JSON.stringify(obj));
      } else {
        localStorage.removeItem(getFilterStorageKey(pathname));
      }
    } catch {
      /* localStorage unavailable */
    }
  }, [searchParams, pathname, initialized]);

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

  // Saved views
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);

  // Load saved views on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_VIEWS_KEY);
      if (stored) {
        setSavedViews(JSON.parse(stored));
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  const saveView = useCallback(
    (name: string) => {
      const params: Record<string, string> = {};
      searchParams?.forEach((value, key) => {
        params[key] = value;
      });
      const newView: SavedView = {
        id: `sv_${Date.now()}`,
        name,
        pathname: pathname ?? '',
        params,
        createdAt: new Date().toISOString(),
      };
      const updated = [...savedViews, newView];
      setSavedViews(updated);
      try {
        localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(updated));
      } catch {}
      return newView;
    },
    [searchParams, pathname, savedViews]
  );

  const loadView = useCallback(
    (id: string) => {
      const view = savedViews.find((v) => v.id === id);
      if (!view) return;
      const qs = new URLSearchParams(view.params).toString();
      router.replace(`${view.pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [savedViews, router]
  );

  const deleteView = useCallback(
    (id: string) => {
      const updated = savedViews.filter((v) => v.id !== id);
      setSavedViews(updated);
      try {
        localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(updated));
      } catch {}
    },
    [savedViews]
  );

  // Filter saved views for current page
  const pageViews = useMemo(
    () => savedViews.filter((v) => v.pathname === pathname),
    [savedViews, pathname]
  );

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
    // Saved views
    savedViews: pageViews,
    saveView,
    loadView,
    deleteView,
  };
}

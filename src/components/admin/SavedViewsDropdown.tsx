'use client';

import { useState, useRef, useEffect } from 'react';
import { Bookmark, ChevronDown, Trash2, Plus } from 'lucide-react';
import type { SavedView } from '@/hooks/useAdminFilters';

interface SavedViewsDropdownProps {
  views: SavedView[];
  hasActiveFilters: boolean;
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SavedViewsDropdown({
  views,
  hasActiveFilters,
  onSave,
  onLoad,
  onDelete,
}: SavedViewsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewName, setViewName] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSaving(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (saving && inputRef.current) {
      inputRef.current.focus();
    }
  }, [saving]);

  const handleSave = () => {
    if (!viewName.trim()) return;
    onSave(viewName.trim());
    setViewName('');
    setSaving(false);
  };

  if (!hasActiveFilters && views.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-fm-neutral-200 bg-white text-fm-neutral-600 hover:text-fm-neutral-900 hover:border-fm-neutral-300 transition-colors"
      >
        <Bookmark className="w-3.5 h-3.5" />
        Views
        {views.length > 0 && (
          <span className="text-[10px] font-bold bg-fm-magenta-100 text-fm-magenta-700 rounded-full px-1.5">
            {views.length}
          </span>
        )}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-fm-neutral-200 overflow-hidden"
          style={{ zIndex: 50 }}
        >
          {/* Saved views list */}
          {views.length > 0 && (
            <div className="max-h-48 overflow-y-auto divide-y divide-fm-neutral-100">
              {views.map((view) => (
                <div key={view.id} className="flex items-center gap-2 px-3 py-2 hover:bg-fm-neutral-50 transition-colors">
                  <button
                    className="flex-1 text-left text-sm text-fm-neutral-700 hover:text-fm-neutral-900 truncate"
                    onClick={() => {
                      onLoad(view.id);
                      setOpen(false);
                    }}
                  >
                    {view.name}
                  </button>
                  <button
                    onClick={() => onDelete(view.id)}
                    className="p-1 rounded text-fm-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    aria-label={`Delete ${view.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Save current filters */}
          {hasActiveFilters && (
            <div className="border-t border-fm-neutral-100 p-2">
              {saving ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={viewName}
                    onChange={(e) => setViewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave();
                      if (e.key === 'Escape') setSaving(false);
                    }}
                    placeholder="View name..."
                    className="flex-1 text-sm px-2 py-1.5 rounded-lg border border-fm-neutral-200 focus:border-fm-magenta-300 focus:outline-none"
                  />
                  <button
                    onClick={handleSave}
                    disabled={!viewName.trim()}
                    className="px-2 py-1.5 text-xs font-medium rounded-lg bg-fm-magenta-600 text-white hover:bg-fm-magenta-700 disabled:opacity-50 transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSaving(true)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-fm-magenta-600 hover:text-fm-magenta-700 hover:bg-fm-magenta-50 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Save current filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import type { ContentItem, ContentStatus } from '@/lib/admin/project-types';
import { KanbanColumn } from './KanbanColumn';
import { adminToast } from '@/lib/admin/toast';

interface KanbanBoardProps {
  items: ContentItem[];
  onStatusChange: (id: string, newStatus: ContentStatus) => void;
}

const COLUMNS: { status: ContentStatus; label: string; color: string }[] = [
  { status: 'draft', label: 'Draft', color: 'bg-fm-neutral-400' },
  { status: 'review', label: 'Review', color: 'bg-amber-500' },
  { status: 'approved', label: 'Approved', color: 'bg-blue-500' },
  { status: 'scheduled', label: 'Scheduled', color: 'bg-purple-500' },
  { status: 'published', label: 'Published', color: 'bg-emerald-500' },
];

export function KanbanBoard({ items, onStatusChange }: KanbanBoardProps) {
  const grouped = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    for (const col of COLUMNS) {
      map[col.status] = [];
    }
    for (const item of items) {
      if (map[item.status]) {
        map[item.status].push(item);
      } else {
        // Put unknown statuses in draft
        map['draft'].push(item);
      }
    }
    return map;
  }, [items]);

  const handleDrop = async (itemId: string, newStatus: ContentStatus) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || item.status === newStatus) return;

    // Optimistic update
    onStatusChange(itemId, newStatus);

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, status: newStatus }),
      });
      if (!res.ok) {
        adminToast.error('Failed to update status');
        // Revert
        onStatusChange(itemId, item.status);
      }
    } catch {
      adminToast.error('Failed to update status');
      onStatusChange(itemId, item.status);
    }
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.status}
          status={col.status}
          label={col.label}
          items={grouped[col.status]}
          color={col.color}
          onDrop={handleDrop}
          onStatusChange={(id, newStatus) => handleDrop(id, newStatus)}
        />
      ))}
    </div>
  );
}

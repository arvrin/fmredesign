'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ContentItem, ContentStatus } from '@/lib/admin/project-types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: ContentStatus;
  label: string;
  items: ContentItem[];
  color: string;
  onDrop: (itemId: string, newStatus: ContentStatus) => void;
  onStatusChange: (id: string, newStatus: ContentStatus) => void;
}

export function KanbanColumn({ status, label, items, color, onDrop, onStatusChange }: KanbanColumnProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId) {
      onDrop(itemId, status);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col min-w-[260px] w-[260px] rounded-xl border border-fm-neutral-200 bg-fm-neutral-50',
        dragOver && 'ring-2 ring-fm-magenta-400 bg-fm-magenta-50/30'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-fm-neutral-200">
        <div className={cn('w-2 h-2 rounded-full', color)} />
        <span className="text-sm font-semibold text-fm-neutral-900">{label}</span>
        <span className="text-xs text-fm-neutral-500 ml-auto bg-fm-neutral-200 px-1.5 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ maxHeight: 'calc(100vh - 400px)', minHeight: '200px' }}>
        {items.map((item) => (
          <KanbanCard key={item.id} item={item} onStatusChange={onStatusChange} />
        ))}
        {items.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-fm-neutral-400">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
}

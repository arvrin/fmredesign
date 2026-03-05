'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getPlatformColor } from '@/lib/admin/format-helpers';
import type { ContentItem, ContentStatus } from '@/lib/admin/project-types';

interface KanbanCardProps {
  item: ContentItem;
  onStatusChange: (id: string, newStatus: ContentStatus) => void;
}

const statusOptions: ContentStatus[] = ['draft', 'review', 'approved', 'scheduled', 'published'];

export function KanbanCard({ item, onStatusChange }: KanbanCardProps) {
  const router = useRouter();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => router.push(`/admin/content/${item.id}`)}
      className="bg-white rounded-lg border border-fm-neutral-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <p className="text-sm font-medium text-fm-neutral-900 line-clamp-2 mb-2">{item.title}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn('px-1.5 py-0.5 text-[10px] font-medium rounded-full', getPlatformColor(item.platform))}>
          {item.platform}
        </span>
        <span className="text-[10px] text-fm-neutral-500 capitalize">{item.type}</span>
        {item.scheduledDate && (
          <span className="text-[10px] text-fm-neutral-400 ml-auto" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {new Date(item.scheduledDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Mobile fallback: move-to select */}
      <div className="mt-2 md:hidden">
        <select
          value={item.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            onStatusChange(item.id, e.target.value as ContentStatus);
          }}
          className="w-full text-xs px-2 py-1 rounded border border-fm-neutral-200 bg-fm-neutral-50 text-fm-neutral-600"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { StatusBadge } from '@/components/ui/status-badge';

interface ContentItem {
  id: string;
  title: string;
  status: string;
  platform: string;
  type: string;
  scheduledDate: string;
  clientId: string;
}

interface TodayContentProps {
  items: ContentItem[];
}

export function TodayContent({ items }: TodayContentProps) {
  if (items.length === 0) return null;

  return (
    <div className="divide-y divide-fm-neutral-100">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/admin/content/${item.id}`}
          className="flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-fm-neutral-50/50 transition-colors"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-fm-neutral-900 truncate">{item.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusBadge status={item.status} />
              <span className="text-xs text-fm-neutral-500 capitalize">{item.platform} &middot; {item.type}</span>
            </div>
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="text-xs font-medium text-fm-neutral-700" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {new Date(item.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

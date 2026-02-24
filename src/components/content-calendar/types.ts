import type { ContentStatus, ContentType, Platform } from '@/lib/admin/project-types';

export interface CalendarContentItem {
  id: string;
  title: string;
  scheduledDate: string;
  status: ContentStatus;
  type: ContentType;
  platform: Platform | string;
  clientId?: string;
  description?: string;
}

export type CalendarViewMode = 'month' | 'week';

export interface ContentCalendarProps {
  items: CalendarContentItem[];
  loading?: boolean;
  variant: 'admin' | 'client';
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onItemClick?: (itemId: string) => void;
  getClientName?: (clientId: string) => string;
}

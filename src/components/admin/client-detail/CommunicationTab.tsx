'use client';

import { DashboardCard as Card, CardContent, CardHeader, CardTitle } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { ActivityItem } from '@/hooks/admin/useClientDetail';
import { Clock, AlertCircle, Calendar } from 'lucide-react';

interface CommunicationTabProps {
  activityFeed: ActivityItem[];
  loading: boolean;
}

export function CommunicationTab({ activityFeed, loading }: CommunicationTabProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    );
  }

  if (activityFeed.length === 0) {
    return (
      <EmptyState
        icon={<Clock className="h-6 w-6" />}
        title="No Activity Yet"
        description="Support tickets and content items will appear here."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityFeed.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-start gap-4 p-3 rounded-lg border border-fm-neutral-200 hover:bg-fm-neutral-50 transition-colors"
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  item.type === 'ticket'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {item.type === 'ticket' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-fm-neutral-900 truncate">
                    {item.title}
                  </span>
                  <Badge
                    className={`text-xs ${
                      item.type === 'ticket'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {item.type === 'ticket' ? 'Support Ticket' : 'Content'}
                  </Badge>
                  {item.status && (
                    <Badge variant="outline" className="text-xs">
                      {item.status.replace(/_/g, ' ')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-fm-neutral-500">
                  {item.date && <span>{new Date(item.date).toLocaleDateString()}</span>}
                  {item.platform && <span className="capitalize">{item.platform}</span>}
                  {item.priority && <span className="capitalize">{item.priority}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

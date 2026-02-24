'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LifeBuoy, Clock, User } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { StatusBadge } from '@/components/ui/status-badge';

interface TicketItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category?: string;
  assignedTo?: string;
  createdAt: string;
}

interface SupportTabProps {
  clientId: string;
}

export function SupportTab({ clientId }: SupportTabProps) {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/support?clientId=${clientId}`);
        if (res.ok) {
          const data = await res.json();
          setTickets(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching support tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [clientId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-fm-neutral-200 rounded w-1/3" />
          <div className="h-16 bg-fm-neutral-200 rounded" />
          <div className="h-16 bg-fm-neutral-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-fm-neutral-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-sm font-semibold text-fm-neutral-500 uppercase tracking-wider">
          Support Tickets
        </h3>
        <DashboardButton
          variant="secondary"
          size="sm"
          onClick={() => router.push(`/admin/support?client=${clientId}`)}
        >
          View in Support
        </DashboardButton>
      </div>

      {tickets.length > 0 ? (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border border-fm-neutral-200 rounded-lg p-3 sm:p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-medium text-fm-neutral-900 text-sm sm:text-base">
                      {ticket.title}
                    </h4>
                    <StatusBadge status={ticket.status} />
                    <StatusBadge status={ticket.priority} />
                  </div>
                  {ticket.description && (
                    <p className="text-sm text-fm-neutral-600 line-clamp-2 mb-1">
                      {ticket.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-fm-neutral-500">
                    {ticket.category && (
                      <span className="capitalize">{ticket.category}</span>
                    )}
                    {ticket.assignedTo && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {ticket.assignedTo}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <LifeBuoy className="h-10 w-10 sm:h-12 sm:w-12 text-fm-neutral-400 mx-auto mb-4" />
          <h4 className="font-semibold text-fm-neutral-900 mb-2">
            No support tickets
          </h4>
          <p className="text-sm sm:text-base text-fm-neutral-600">
            Support tickets from this client will appear here
          </p>
        </div>
      )}
    </div>
  );
}

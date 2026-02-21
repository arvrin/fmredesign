/**
 * Admin Support Tickets Management
 * View and manage support tickets from all clients
 */

'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  DashboardButton,
  DashboardCard,
  CardContent,
  CardHeader,
  CardTitle,
  MetricCard,
} from '@/design-system';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';
import { adminToast } from '@/lib/admin/toast';
import { useTeamMembers } from '@/hooks/admin/useTeamMembers';
import { TEAM_ROLES } from '@/lib/admin/types';

interface AdminTicket {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = ['open', 'in-progress', 'resolved', 'closed'] as const;

export default function AdminSupportPage() {
  const { teamMembers } = useTeamMembers();
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/support?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      adminToast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateTicket = async (
    ticketId: string,
    updates: { status?: string; assignedTo?: string }
  ) => {
    try {
      setUpdatingId(ticketId);
      const res = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, ...updates }),
      });

      if (res.ok) {
        setTickets((prev) =>
          prev.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  ...(updates.status ? { status: updates.status as AdminTicket['status'] } : {}),
                  ...(updates.assignedTo ? { assignedTo: updates.assignedTo } : {}),
                  updatedAt: new Date().toISOString(),
                }
              : t
          )
        );
      }
    } catch (err) {
      console.error('Error updating ticket:', err);
      adminToast.error('Failed to update ticket');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.clientName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter(
    (t) => t.status === 'in-progress'
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;
  const urgentCount = tickets.filter(
    (t) => t.priority === 'urgent' || t.priority === 'high'
  ).length;

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-16 rounded-xl" />
        <div className="space-y-3 sm:space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <PageHeader
        title="Support Tickets"
        icon={<MessageSquare className="w-6 h-6" />}
        description="Manage support requests from all clients"
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        <MetricCard
          title="Open Tickets"
          value={openCount}
          subtitle="Awaiting response"
          icon={<MessageSquare className="w-6 h-6" />}
          variant="admin"
        />
        <MetricCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Being worked on"
          icon={<Clock className="w-6 h-6" />}
          variant="admin"
        />
        <MetricCard
          title="Resolved"
          value={resolvedCount}
          subtitle="Successfully resolved"
          icon={<CheckCircle className="w-6 h-6" />}
          variant="admin"
        />
        <MetricCard
          title="High Priority"
          value={urgentCount}
          subtitle="Urgent + High"
          icon={<AlertCircle className="w-6 h-6" />}
          variant="admin"
        />
      </div>

      {/* Filters */}
      <DashboardCard className="mb-4 sm:mb-6">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
              <Input
                type="text"
                placeholder="Search tickets, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-fm-neutral-500" />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </DashboardCard>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <DashboardCard>
          <EmptyState
            icon={<MessageSquare className="w-6 h-6" />}
            title="No tickets found"
            description={
              statusFilter !== 'all'
                ? `No ${statusFilter} tickets at the moment`
                : 'No support tickets have been submitted yet'
            }
          />
        </DashboardCard>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredTickets.map((ticket) => {
            const isExpanded = expandedTicket === ticket.id;
            return (
              <DashboardCard key={ticket.id}>
                <CardContent className="p-3 sm:p-4">
                  {/* Summary row */}
                  <div
                    className="flex items-start sm:items-center justify-between cursor-pointer gap-2"
                    onClick={() =>
                      setExpandedTicket(isExpanded ? null : ticket.id)
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-fm-neutral-900 truncate">
                          {ticket.title}
                        </h3>
                        <StatusBadge status={ticket.priority} />
                        <StatusBadge status={ticket.status} />
                      </div>
                      <div className="flex items-center gap-x-4 gap-y-1 text-sm text-fm-neutral-500 flex-wrap">
                        <span className="font-medium text-fm-neutral-700">
                          {ticket.clientName}
                        </span>
                        <span className="capitalize">{ticket.category}</span>
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {ticket.assignedTo}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-fm-neutral-400 ml-3 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-fm-neutral-400 ml-3 flex-shrink-0" />
                    )}
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-fm-neutral-100">
                      <p className="text-sm text-fm-neutral-700 mb-3 sm:mb-4">
                        {ticket.description}
                      </p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <label className="text-sm text-fm-neutral-600">
                          Status:
                        </label>
                        <Select
                          value={ticket.status}
                          onChange={(e) =>
                            updateTicket(ticket.id, {
                              status: e.target.value,
                            })
                          }
                          disabled={updatingId === ticket.id}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>

                        <label className="text-sm text-fm-neutral-600">
                          Assigned to:
                        </label>
                        <Select
                          value={ticket.assignedTo || ''}
                          onChange={(e) =>
                            updateTicket(ticket.id, {
                              assignedTo: e.target.value,
                            })
                          }
                          disabled={updatingId === ticket.id}
                        >
                          <option value="">Unassigned</option>
                          <option value="Support Team">Support Team</option>
                          {teamMembers.map((member) => (
                            <option key={member.id} value={member.name}>
                              {member.name} — {TEAM_ROLES[member.role]}
                            </option>
                          ))}
                        </Select>

                        {updatingId === ticket.id && (
                          <span className="text-xs text-fm-neutral-500">
                            Saving...
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </DashboardCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

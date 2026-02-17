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
import { Badge } from '@/components/ui/Badge';

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

function getStatusColor(status: string) {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export default function AdminSupportPage() {
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-fm-neutral-900">
          Support Tickets
        </h1>
        <p className="text-fm-neutral-600 mt-1">
          Manage support requests from all clients
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Open Tickets"
          value={openCount}
          subtitle="Awaiting response"
          icon={<MessageSquare className="w-6 h-6" />}
        />
        <MetricCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Being worked on"
          icon={<Clock className="w-6 h-6" />}
        />
        <MetricCard
          title="Resolved"
          value={resolvedCount}
          subtitle="Successfully resolved"
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <MetricCard
          title="High Priority"
          value={urgentCount}
          subtitle="Urgent + High"
          icon={<AlertCircle className="w-6 h-6" />}
        />
      </div>

      {/* Filters */}
      <DashboardCard className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
              <input
                type="text"
                placeholder="Search tickets, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-fm-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fm-magenta-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-fm-neutral-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-fm-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fm-magenta-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </DashboardCard>

      {/* Tickets List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fm-magenta-600" />
        </div>
      ) : filteredTickets.length === 0 ? (
        <DashboardCard className="p-12 text-center">
          <MessageSquare className="w-12 h-12 text-fm-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">
            No tickets found
          </h3>
          <p className="text-fm-neutral-600">
            {statusFilter !== 'all'
              ? `No ${statusFilter} tickets at the moment`
              : 'No support tickets have been submitted yet'}
          </p>
        </DashboardCard>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => {
            const isExpanded = expandedTicket === ticket.id;
            return (
              <DashboardCard key={ticket.id}>
                <CardContent className="p-4">
                  {/* Summary row */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() =>
                      setExpandedTicket(isExpanded ? null : ticket.id)
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-fm-neutral-900 truncate">
                          {ticket.title}
                        </h3>
                        <Badge
                          className={getPriorityColor(ticket.priority)}
                          variant="secondary"
                        >
                          {ticket.priority}
                        </Badge>
                        <Badge
                          className={getStatusColor(ticket.status)}
                          variant="secondary"
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-fm-neutral-500">
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
                    <div className="mt-4 pt-4 border-t border-fm-neutral-100">
                      <p className="text-sm text-fm-neutral-700 mb-4">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <label className="text-sm text-fm-neutral-600">
                          Status:
                        </label>
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            updateTicket(ticket.id, {
                              status: e.target.value,
                            })
                          }
                          disabled={updatingId === ticket.id}
                          className="text-sm border border-fm-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-fm-magenta-500"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        <label className="text-sm text-fm-neutral-600 ml-4">
                          Assigned to:
                        </label>
                        <input
                          type="text"
                          defaultValue={ticket.assignedTo}
                          onBlur={(e) => {
                            if (e.target.value !== ticket.assignedTo) {
                              updateTicket(ticket.id, {
                                assignedTo: e.target.value,
                              });
                            }
                          }}
                          disabled={updatingId === ticket.id}
                          className="text-sm border border-fm-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-fm-magenta-500 w-48"
                        />

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

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollText,
  Filter,
  RefreshCw,
  User,
  Clock,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Globe,
  Search,
} from 'lucide-react';
import { Button } from '@/design-system/components/primitives/Button';
import {
  DashboardCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import type { AuditAction, AuditEntry } from '@/lib/admin/audit-log';

const ACTION_ICONS: Record<AuditAction, React.ReactNode> = {
  create: <Plus className="w-3.5 h-3.5" />,
  update: <Pencil className="w-3.5 h-3.5" />,
  delete: <Trash2 className="w-3.5 h-3.5" />,
  login: <LogIn className="w-3.5 h-3.5" />,
  logout: <LogOut className="w-3.5 h-3.5" />,
  export: <Download className="w-3.5 h-3.5" />,
  import: <Upload className="w-3.5 h-3.5" />,
  approve: <CheckCircle className="w-3.5 h-3.5" />,
  reject: <XCircle className="w-3.5 h-3.5" />,
};

const ACTION_COLORS: Record<AuditAction, string> = {
  create: 'bg-green-100 text-green-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
  login: 'bg-emerald-100 text-emerald-700',
  logout: 'bg-gray-100 text-gray-700',
  export: 'bg-purple-100 text-purple-700',
  import: 'bg-indigo-100 text-indigo-700',
  approve: 'bg-green-100 text-green-700',
  reject: 'bg-red-100 text-red-700',
};

const RESOURCE_TYPES = ['all', 'client', 'project', 'content', 'user', 'invoice', 'proposal'] as const;
const ACTIONS: ('all' | AuditAction)[] = ['all', 'create', 'update', 'delete', 'login', 'logout', 'approve', 'reject'];

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDetails(details: Record<string, unknown> | null | undefined): string {
  if (!details) return '';
  const parts: string[] = [];
  if (details.name) parts.push(String(details.name));
  if (details.updatedFields) {
    const fields = details.updatedFields as string[];
    parts.push(`fields: ${fields.join(', ')}`);
  }
  if (details.email) parts.push(String(details.email));
  if (details.role) parts.push(`role: ${String(details.role)}`);
  return parts.join(' · ');
}

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(50);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit) });
      if (resourceFilter !== 'all') params.set('resource_type', resourceFilter);
      if (actionFilter !== 'all') params.set('action', actionFilter);

      const res = await fetch(`/api/admin/audit?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (err) {
      console.error('Failed to load audit log:', err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [resourceFilter, actionFilter, limit]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const filteredEntries = searchQuery
    ? entries.filter(
        (e) =>
          e.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.resource_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.resource_id && e.resource_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (e.details && JSON.stringify(e.details).toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : entries;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-fm-neutral-900 flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-fm-magenta-600" />
            Audit Log
          </h1>
          <p className="text-fm-neutral-600 mt-1">
            Track all admin actions — who changed what and when.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchEntries} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <DashboardCard variant="admin">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fm-neutral-400" />
              <Input
                placeholder="Search by user, resource, or details..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Resource Type Filter */}
            <div className="relative">
              <select
                value={resourceFilter}
                onChange={(e) => setResourceFilter(e.target.value)}
                className="appearance-none bg-white border border-fm-neutral-200 rounded-lg px-3 py-2 pr-8 text-sm text-fm-neutral-700 focus:outline-none focus:ring-2 focus:ring-fm-magenta-500 focus:border-transparent cursor-pointer"
              >
                {RESOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Resources' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-fm-neutral-400 pointer-events-none" />
            </div>

            {/* Action Filter */}
            <div className="relative">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="appearance-none bg-white border border-fm-neutral-200 rounded-lg px-3 py-2 pr-8 text-sm text-fm-neutral-700 focus:outline-none focus:ring-2 focus:ring-fm-magenta-500 focus:border-transparent cursor-pointer"
              >
                {ACTIONS.map((action) => (
                  <option key={action} value={action}>
                    {action === 'all' ? 'All Actions' : action.charAt(0).toUpperCase() + action.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-fm-neutral-400 pointer-events-none" />
            </div>
          </div>
        </CardContent>
      </DashboardCard>

      {/* Results */}
      <DashboardCard variant="admin">
        <CardHeader>
          <CardTitle className="text-lg">
            Recent Activity
            {!loading && (
              <span className="ml-2 text-sm font-normal text-fm-neutral-500">
                ({filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'})
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Showing the most recent admin actions across all resources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 py-3">
                  <div className="w-8 h-8 bg-fm-neutral-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-fm-neutral-100 rounded w-3/4" />
                    <div className="h-3 bg-fm-neutral-100 rounded w-1/2" />
                  </div>
                  <div className="h-3 bg-fm-neutral-100 rounded w-16" />
                </div>
              ))}
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <ScrollText className="w-12 h-12 text-fm-neutral-300 mx-auto mb-3" />
              <p className="text-fm-neutral-600 font-medium">No audit entries found</p>
              <p className="text-sm text-fm-neutral-500 mt-1">
                {searchQuery || resourceFilter !== 'all' || actionFilter !== 'all'
                  ? 'Try adjusting your filters.'
                  : 'Actions will appear here once admin operations are performed.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-fm-neutral-100">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 py-3 hover:bg-fm-neutral-50/50 -mx-2 px-2 rounded-lg transition-colors">
                  {/* Action icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${ACTION_COLORS[entry.action as AuditAction] || 'bg-gray-100 text-gray-600'}`}>
                    {ACTION_ICONS[entry.action as AuditAction] || <Globe className="w-3.5 h-3.5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-fm-neutral-900">
                        {entry.user_name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {entry.action}
                      </Badge>
                      <span className="text-sm text-fm-neutral-600">
                        {entry.resource_type}
                        {entry.resource_id && (
                          <span className="text-fm-neutral-400 ml-1 font-mono text-xs">
                            #{entry.resource_id.slice(0, 8)}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Details */}
                    {entry.details && formatDetails(entry.details as Record<string, unknown>) && (
                      <p className="text-xs text-fm-neutral-500 mt-0.5 truncate">
                        {formatDetails(entry.details as Record<string, unknown>)}
                      </p>
                    )}
                  </div>

                  {/* Timestamp & IP */}
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1 text-xs text-fm-neutral-500">
                      <Clock className="w-3 h-3" />
                      {entry.created_at ? timeAgo(entry.created_at) : '—'}
                    </div>
                    {entry.ip_address && entry.ip_address !== 'unknown' && (
                      <div className="text-xs text-fm-neutral-400 mt-0.5 font-mono">
                        {entry.ip_address}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load more */}
          {!loading && filteredEntries.length >= limit && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLimit((prev) => prev + 50)}
              >
                Load more
              </Button>
            </div>
          )}
        </CardContent>
      </DashboardCard>
    </div>
  );
}

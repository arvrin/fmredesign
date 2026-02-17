/**
 * Shared status/priority/health color utilities for client portal pages.
 * Consolidates duplicated definitions from overview, projects, content,
 * reports, and support pages.
 */

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'planning':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'review':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'published':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'revision_needed':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'draft':
      return 'bg-fm-neutral-100 text-fm-neutral-800 border-fm-neutral-200';
    case 'open':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'closed':
      return 'bg-fm-neutral-100 text-fm-neutral-800 border-fm-neutral-200';
    default:
      return 'bg-fm-neutral-100 text-fm-neutral-800 border-fm-neutral-200';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'bg-red-500';
    case 'urgent':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-fm-neutral-500';
  }
}

export function getHealthColor(health: string): string {
  switch (health.toLowerCase()) {
    case 'excellent':
      return 'text-green-600';
    case 'good':
      return 'text-blue-600';
    case 'warning':
      return 'text-yellow-600';
    case 'critical':
      return 'text-red-600';
    default:
      return 'text-fm-neutral-600';
  }
}

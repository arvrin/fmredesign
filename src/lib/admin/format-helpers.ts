/**
 * Shared formatting and color helper functions for admin pages.
 * Extracted from inline duplicates across projects, content, team, and discovery pages.
 */

// ---------------------------------------------------------------------------
// Workload / Utilization Color
// ---------------------------------------------------------------------------

export function getWorkloadColor(workload: number): string {
  if (workload >= 100) return 'text-red-600';
  if (workload >= 80) return 'text-orange-600';
  if (workload >= 60) return 'text-yellow-600';
  return 'text-green-600';
}

// ---------------------------------------------------------------------------
// Location Emoji
// ---------------------------------------------------------------------------

export function getLocationEmoji(location: string): string {
  switch (location) {
    case 'office': return '\u{1F3E2}';
    case 'remote': return '\u{1F3E0}';
    case 'hybrid': return '\u{1F504}';
    default: return '\u{1F4CD}';
  }
}

// ---------------------------------------------------------------------------
// Platform Colors (content calendar)
// ---------------------------------------------------------------------------

const platformColors: Record<string, string> = {
  instagram: 'bg-pink-100 text-pink-800 border-pink-200',
  facebook: 'bg-blue-100 text-blue-800 border-blue-200',
  linkedin: 'bg-blue-100 text-blue-800 border-blue-200',
  twitter: 'bg-sky-100 text-sky-800 border-sky-200',
  youtube: 'bg-red-100 text-red-800 border-red-200',
  tiktok: 'bg-neutral-900 text-white border-neutral-700',
  website: 'bg-green-100 text-green-800 border-green-200',
  email: 'bg-purple-100 text-purple-800 border-purple-200',
  pinterest: 'bg-rose-100 text-rose-800 border-rose-200',
  blog: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export function getPlatformColor(platform: string): string {
  return platformColors[platform.toLowerCase()] ?? 'bg-fm-neutral-100 text-fm-neutral-800 border-fm-neutral-200';
}

// ---------------------------------------------------------------------------
// Date Formatting
// ---------------------------------------------------------------------------

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Currency Formatting
// ---------------------------------------------------------------------------

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

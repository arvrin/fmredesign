/**
 * TalentFilters — search + status filter controls for the CreativeMinds page.
 * Used in both the Applications and Talents tabs.
 */

'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';

interface TalentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  /** When true the status dropdown is rendered. */
  showStatusFilter?: boolean;
  selectedStatus?: string;
  onStatusChange?: (value: string) => void;
}

export function TalentFilters({
  searchQuery,
  onSearchChange,
  showStatusFilter = false,
  selectedStatus,
  onStatusChange,
}: TalentFiltersProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fm-neutral-400" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="pl-10"
        />
      </div>

      {showStatusFilter && onStatusChange && (
        <Select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>
      )}
    </div>
  );
}

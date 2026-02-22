'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { DashboardCard as Card, CardContent } from '@/design-system';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select-native';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
}

interface AdminFilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  actions?: React.ReactNode;
  className?: string;
}

export function AdminFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  actions,
  className,
}: AdminFilterBarProps) {
  return (
    <Card variant="admin" className={className}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {onSearchChange !== undefined && (
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fm-neutral-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          ))}
          {actions}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useTeamMembers } from '@/hooks/admin/useTeamMembers';
import { TEAM_ROLES } from '@/lib/admin/types';
import type { TeamRole } from '@/lib/admin/types';

interface TeamMemberSelectProps {
  value: string;
  onChange: (name: string) => void;
  filterRoles?: TeamRole[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const selectClass =
  'w-full h-12 px-3 py-2 text-base bg-fm-neutral-50 border border-fm-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2 transition-all duration-200 hover:border-fm-magenta-400 appearance-none';

export function TeamMemberSelect({
  value,
  onChange,
  filterRoles,
  label,
  placeholder = 'Select team member',
  required,
  disabled,
  className,
}: TeamMemberSelectProps) {
  const { teamMembers, loading, getByRoles } = useTeamMembers();

  const options = filterRoles ? getByRoles(filterRoles) : teamMembers;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-fm-neutral-900 mb-1.5">
          {label}
          {required && ' *'}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className={className || selectClass}
      >
        <option value="">{loading ? 'Loading...' : placeholder}</option>
        {options.map((member) => (
          <option key={member.id} value={member.name}>
            {member.name} — {TEAM_ROLES[member.role]}
          </option>
        ))}
      </select>
    </div>
  );
}

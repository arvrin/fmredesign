'use client';

import { COMMON_SKILLS } from '@/lib/admin/types';

interface SkillSelectorProps {
  value: string[];
  onChange: (skills: string[]) => void;
  className?: string;
}

export function SkillSelector({ value, onChange, className }: SkillSelectorProps) {
  const toggleSkill = (skill: string) => {
    const current = value || [];
    if (current.includes(skill)) {
      onChange(current.filter((s) => s !== skill));
    } else {
      onChange([...current, skill]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className || ''}`}>
      {COMMON_SKILLS.map((skill) => {
        const selected = (value || []).includes(skill);
        return (
          <button
            key={skill}
            type="button"
            onClick={() => toggleSkill(skill)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              selected
                ? 'bg-fm-magenta-100 text-fm-magenta-700 border-fm-magenta-300'
                : 'bg-white text-fm-neutral-700 border-fm-neutral-300 hover:border-fm-magenta-300'
            }`}
          >
            {skill}
          </button>
        );
      })}
    </div>
  );
}

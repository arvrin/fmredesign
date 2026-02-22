'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder = 'tag1, tag2, tag3',
  label,
  className,
}: TagInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onChange(tags);
  };

  return (
    <Input
      label={label}
      value={(value || []).join(', ')}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

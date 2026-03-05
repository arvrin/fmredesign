'use client';

import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  label: string;
}

export function FloatingActionButton({ onClick, label }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 bottom-20 md:right-6 md:bottom-6 w-14 h-14 rounded-full bg-fm-magenta-600 text-white shadow-lg hover:bg-fm-magenta-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center active:scale-95"
      style={{ zIndex: 30 }}
      aria-label={label}
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}

'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SwipeAction {
  label: string;
  onClick: () => void;
  color: string; // Tailwind bg class like 'bg-blue-500'
  icon?: React.ReactNode;
}

interface SwipeableRowProps {
  children: React.ReactNode;
  actions: SwipeAction[];
  className?: string;
}

const EDGE_ZONE = 24;
const REVEAL_THRESHOLD = 60;
const ACTION_WIDTH = 72;

export function SwipeableRow({ children, actions, className }: SwipeableRowProps) {
  const [revealed, setRevealed] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX < EDGE_ZONE) return;
    startRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!startRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startRef.current.x;
    const deltaY = Math.abs(touch.clientY - startRef.current.y);
    startRef.current = null;

    if (deltaY > Math.abs(deltaX)) return;

    if (deltaX < -REVEAL_THRESHOLD && !revealed) {
      setRevealed(true);
    } else if (deltaX > REVEAL_THRESHOLD && revealed) {
      setRevealed(false);
    }
  }, [revealed]);

  const totalWidth = actions.length * ACTION_WIDTH;

  return (
    <div className={cn('relative overflow-hidden md:overflow-visible', className)} ref={rowRef}>
      {/* Action buttons behind */}
      <div
        className="absolute right-0 top-0 bottom-0 flex md:hidden"
        style={{ width: totalWidth }}
      >
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => {
              action.onClick();
              setRevealed(false);
            }}
            className={cn(
              'flex flex-col items-center justify-center text-white text-xs font-medium',
              action.color
            )}
            style={{ width: ACTION_WIDTH }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      {/* Content row that slides */}
      <div
        className="relative bg-white transition-transform duration-200 ease-out"
        style={{
          transform: revealed ? `translateX(-${totalWidth}px)` : 'translateX(0)',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

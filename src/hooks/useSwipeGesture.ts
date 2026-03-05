'use client';

import { useRef, useCallback } from 'react';

interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Minimum horizontal distance to trigger (default: 60) */
  threshold?: number;
  /** Auto-trigger primary action at this distance (default: 120) */
  autoTriggerThreshold?: number;
}

const EDGE_ZONE = 24; // Avoid conflict with sidebar swipe

export function useSwipeGesture(config: SwipeGestureConfig) {
  const threshold = config.threshold ?? 60;
  const startRef = useRef<{ x: number; y: number; claimed: boolean } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    // Ignore touches in the sidebar edge zone
    if (touch.clientX < EDGE_ZONE) return;
    startRef.current = { x: touch.clientX, y: touch.clientY, claimed: false };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!startRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startRef.current.x;
    const deltaY = Math.abs(touch.clientY - startRef.current.y);

    // If vertical, release gesture
    if (deltaY > Math.abs(deltaX) * 1.5) {
      startRef.current = null;
      return;
    }

    // Claim gesture once past small threshold
    if (Math.abs(deltaX) > 20 && !startRef.current.claimed) {
      startRef.current.claimed = true;
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!startRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startRef.current.x;
    const deltaY = Math.abs(touch.clientY - startRef.current.y);
    startRef.current = null;

    // Ignore vertical swipes
    if (deltaY > Math.abs(deltaX)) return;

    if (deltaX < -threshold) {
      config.onSwipeLeft?.();
    } else if (deltaX > threshold) {
      config.onSwipeRight?.();
    }
  }, [threshold, config]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}

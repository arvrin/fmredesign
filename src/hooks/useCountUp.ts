'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for animating a number count up effect
 * @param target - The target number to count up to
 * @param duration - Duration of the animation in milliseconds
 * @param startWhenVisible - Whether to start only when element is visible
 * @param isVisible - Whether the element is currently visible
 * @returns The current count value
 */
export function useCountUp(
  target: number,
  duration: number = 2000,
  startWhenVisible: boolean = false,
  isVisible: boolean = true
): number {
  const [count, setCount] = useState(0);
  const hasStartedRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // If we need visibility check and it's not visible yet, don't start
    if (startWhenVisible && !isVisible) {
      return;
    }

    // Prevent re-running if already started
    if (hasStartedRef.current) {
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(target);
      hasStartedRef.current = true;
      return;
    }

    hasStartedRef.current = true;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(easeOutCubic * target);
      setCount(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration, startWhenVisible, isVisible]);

  return count;
}

/**
 * Parse a metric string and extract the number and suffix
 * @param text - The metric text (e.g., "300% avg traffic growth")
 * @returns Object with number, suffix, and remaining text, or null if no match
 */
export function parseMetric(text: string): { number: number; suffix: string; rest: string } | null {
  const match = text.match(/^(\d+)(%)?\s*(.*)/);
  if (match) {
    return {
      number: parseInt(match[1], 10),
      suffix: match[2] || '',
      rest: match[3] || '',
    };
  }
  return null;
}

'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

interface MagneticOptions {
  strength?: number;
  ease?: number;
  maxDistance?: number;
}

/**
 * Hook for magnetic cursor effect on elements
 */
export function useMagneticEffect(options: MagneticOptions = {}) {
  const { strength = 0.3, ease = 0.15, maxDistance = 100 } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const animate = useCallback(() => {
    if (!elementRef.current || prefersReducedMotion) return;

    // Lerp to target position
    positionRef.current.x += (targetRef.current.x - positionRef.current.x) * ease;
    positionRef.current.y += (targetRef.current.y - positionRef.current.y) * ease;

    elementRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;

    rafRef.current = requestAnimationFrame(animate);
  }, [ease, prefersReducedMotion]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!elementRef.current || prefersReducedMotion) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < maxDistance) {
        targetRef.current.x = distanceX * strength;
        targetRef.current.y = distanceY * strength;
      }
    },
    [strength, maxDistance, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    targetRef.current.x = 0;
    targetRef.current.y = 0;
  }, []);

  const bind = useCallback(
    (element: HTMLElement | null) => {
      if (!element || prefersReducedMotion) return;

      elementRef.current = element;

      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);

      // Start animation loop
      rafRef.current = requestAnimationFrame(animate);

      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    },
    [handleMouseMove, handleMouseLeave, animate, prefersReducedMotion]
  );

  return { bind, ref: elementRef };
}

/**
 * Hook for cursor spotlight effect
 */
export function useCursorSpotlight(intensity: number = 0.15) {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;

      spotlightRef.current.style.setProperty('--spotlight-x', `${e.clientX}px`);
      spotlightRef.current.style.setProperty('--spotlight-y', `${e.clientY}px`);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const spotlightStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 9999,
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease',
    background: `radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(255, 255, 255, ${intensity}), transparent 40%)`,
  };

  return { spotlightRef, spotlightStyle, isVisible };
}

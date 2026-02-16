'use client';

import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Custom hook for GSAP animations with automatic cleanup
 */
export function useGSAPAnimation(
  callback: (gsap: typeof import('gsap').gsap, context: gsap.Context) => void,
  dependencies: unknown[] = []
) {
  const contextRef = useRef<gsap.Context | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Create a GSAP context for easy cleanup
    const ctx = gsap.context(() => {
      callback(gsap, ctx);
    });

    contextRef.current = ctx;

    return () => {
      ctx.revert(); // Cleanup all animations
    };
  }, dependencies);

  return contextRef;
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollTrigger(
  selector: string,
  animation: gsap.TweenVars,
  triggerOptions?: ScrollTrigger.Vars
) {
  useIsomorphicLayoutEffect(() => {
    const elements = document.querySelectorAll(selector);

    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
      elements.forEach((el) => {
        gsap.from(el, {
          ...animation,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse',
            ...triggerOptions,
          },
        });
      });
    });

    return () => ctx.revert();
  }, [selector]);
}

/**
 * Hook for staggered scroll animations
 */
export function useStaggeredReveal(
  containerSelector: string,
  itemSelector: string,
  staggerTime: number = 0.1
) {
  useIsomorphicLayoutEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const ctx = gsap.context(() => {
      gsap.from(itemSelector, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: staggerTime,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, container);

    return () => ctx.revert();
  }, [containerSelector, itemSelector, staggerTime]);
}

/**
 * Hook for parallax effects
 */
export function useParallax(
  selector: string,
  speed: number = 0.5,
  direction: 'vertical' | 'horizontal' = 'vertical'
) {
  useIsomorphicLayoutEffect(() => {
    const elements = document.querySelectorAll(selector);

    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
      elements.forEach((el) => {
        const movement = speed * 100;

        gsap.to(el, {
          [direction === 'vertical' ? 'y' : 'x']: -movement,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    });

    return () => ctx.revert();
  }, [selector, speed, direction]);
}

/**
 * Split text into spans for animation
 */
export function splitTextIntoSpans(text: string, type: 'chars' | 'words' = 'words'): string[] {
  if (type === 'chars') {
    return text.split('');
  }
  return text.split(' ');
}

export { gsap, ScrollTrigger };

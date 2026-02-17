'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  scrub?: number | boolean;
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
  scrub = 1,
}: ParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !layerRef.current) return;

    const movement = speed * 200;
    const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
    const value = direction === 'up' || direction === 'left' ? -movement : movement;

    const ctx = gsap.context(() => {
      gsap.to(layerRef.current, {
        [axis]: value,
        ease: 'none',
        scrollTrigger: {
          trigger: layerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub,
        },
      });
    }, layerRef);

    return () => ctx.revert();
  }, [speed, direction, scrub]);

  return (
    <div ref={layerRef} className={`parallax-layer ${className}`}>
      {children}
    </div>
  );
}

/**
 * Floating animation component with CSS-based motion (GPU accelerated)
 */
interface FloatingElementProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FloatingElement({
  children,
  amplitude = 20,
  duration = 6,
  delay = 0,
  className = '',
}: FloatingElementProps) {
  // Use CSS custom properties and animations for GPU-accelerated floating
  return (
    <div
      className={`floating-element ${className}`}
      style={{
        animation: `floating-y ${duration}s ease-in-out infinite alternate`,
        animationDelay: `${delay}s`,
        '--float-amplitude': `${amplitude}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Scale on scroll effect
 */
interface ScaleOnScrollProps {
  children: React.ReactNode;
  scaleFrom?: number;
  scaleTo?: number;
  className?: string;
}

export function ScaleOnScroll({
  children,
  scaleFrom = 0.8,
  scaleTo = 1,
  className = '',
}: ScaleOnScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !elementRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elementRef.current,
        { scale: scaleFrom, opacity: 0.5 },
        {
          scale: scaleTo,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: elementRef.current,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      );
    }, elementRef);

    return () => ctx.revert();
  }, [scaleFrom, scaleTo]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Gradient orb component with CSS-based drift animation (GPU accelerated)
 */
interface GradientOrbProps {
  color?: string;
  size?: number;
  blur?: number;
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  drift?: number;
  className?: string;
}

export function GradientOrb({
  color = 'rgba(201, 50, 93, 0.25)',
  size = 400,
  blur = 25, // Capped default blur — high values force expensive repaint
  position = { top: '20%', left: '10%' },
  drift = 20,
  className = '',
}: GradientOrbProps) {
  // Derive a deterministic duration from size to avoid hydration mismatch
  // Different sizes will have slightly different animation speeds
  const duration = 15 + (size % 10);

  return (
    <div
      className={`gradient-orb absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        contain: 'layout style paint',
        animation: `orb-drift ${duration}s ease-in-out infinite alternate`,
        ...position,
      }}
      aria-hidden="true"
    />
  );
}

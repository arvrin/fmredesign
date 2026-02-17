'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glareEnabled?: boolean;
  glareOpacity?: number;
  scale?: number;
  perspective?: number;
}

export function Card3D({
  children,
  className = '',
  intensity = 10,
  glareEnabled = true,
  glareOpacity = 0.2,
  scale = 1.02,
  perspective = 1000,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [transform, setTransform] = useState('');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => {
      mediaQuery.removeEventListener('change', handler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || prefersReducedMotion) return;

      // Throttle with RAF for 60fps max
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotateX = (y - 0.5) * intensity * -1;
        const rotateY = (x - 0.5) * intensity;

        setTransform(
          `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
        );
        setGlarePos({ x: x * 100, y: y * 100 });
        rafRef.current = null;
      });
    },
    [intensity, perspective, scale, prefersReducedMotion]
  );

  const handleMouseEnter = () => {
    if (!prefersReducedMotion) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('');
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`card-3d relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered ? transform : 'none',
        transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
        willChange: isHovered ? 'transform' : 'auto',
      }}
    >
      {children}

      {/* Glare effect */}
      {glareEnabled && isHovered && !prefersReducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glareOpacity}), transparent 50%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/**
 * Simple button wrapper (magnetic effect removed for performance)
 */
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: 'button' | 'a' | 'div';
  href?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className = '',
  as: Component = 'button',
  href,
  onClick,
}: MagneticButtonProps) {
  if (Component === 'a') {
    return (
      <a className={className} href={href} onClick={onClick}>
        {children}
      </a>
    );
  }

  if (Component === 'div') {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

/**
 * Hover reveal effect for images
 */
interface HoverRevealProps {
  children: React.ReactNode;
  revealContent: React.ReactNode;
  className?: string;
}

export function HoverReveal({ children, revealContent, className = '' }: HoverRevealProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`hover-reveal relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {children}
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {revealContent}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Star type for TypeScript
interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  brightness: number;
}

// Mid-ground shape type
interface MidGroundShape {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  blur: number;
  color: string;
}

// Foreground particle type
interface ForegroundParticle {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  driftDuration: number;
  driftDelay: number;
}

// Generate random stars - only called on client side
const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 3 + 2,
    brightness: Math.random() * 0.5 + 0.3,
  }));
};

// Perf note: Star count reduced from 60 → 25, accent stars removed (animated filter),
// mid-ground shapes 4 → 2, particles 6 → 3 for better scroll performance.

// Generate mid-ground shapes (2 large blurred ellipses — reduced from 4 for GPU perf)
const generateMidGroundShapes = (): MidGroundShape[] => {
  const colors = [
    'rgba(180, 40, 80, 0.10)',
    'rgba(200, 60, 90, 0.08)',
  ];
  return Array.from({ length: 2 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 70,
    top: 10 + (i * 40) + Math.random() * 15,
    width: 250 + Math.random() * 200,
    height: 180 + Math.random() * 150,
    rotation: Math.random() * 40 - 20,
    opacity: 1,
    blur: 20 + Math.random() * 10,
    color: colors[i],
  }));
};

// Generate foreground particles (3 small bokeh circles — reduced from 6 for GPU perf)
const generateForegroundParticles = (): ForegroundParticle[] => {
  return Array.from({ length: 3 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 4 + Math.random() * 6,
    opacity: 0.04 + Math.random() * 0.04,
    driftDuration: 8 + Math.random() * 4,
    driftDelay: Math.random() * 6,
  }));
};

interface V2PageWrapperProps {
  children: ReactNode;
  starCount?: number;
  showAccentStars?: boolean;
}

export function V2PageWrapper({
  children,
  starCount = 25,
  showAccentStars = false
}: V2PageWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const midGroundRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);

  // Generate elements only on the client side to avoid hydration mismatch
  const [stars, setStars] = useState<Star[]>([]);
  const [midShapes, setMidShapes] = useState<MidGroundShape[]>([]);
  const [particles, setParticles] = useState<ForegroundParticle[]>([]);

  useEffect(() => {
    setStars(generateStars(starCount));
    setMidShapes(generateMidGroundShapes());
    setParticles(generateForegroundParticles());
  }, [starCount]);

  // Debounced ScrollTrigger.refresh() on resize (for section-level ScrollTriggers)
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative min-h-screen overflow-x-hidden">
      {/* Layer 0: Base Gradient — fixed, deepest */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -10,
          background: `
            linear-gradient(135deg,
              #fef7f9 0%,
              #fceef3 10%,
              #fae4ec 20%,
              #f7dbe5 30%,
              #f5d4e0 40%,
              #f5e0e8 50%,
              #f5d4e0 60%,
              #f7dbe5 70%,
              #fae4ec 80%,
              #fceef3 90%,
              #fef7f9 100%
            )
          `,
        }}
      />

      {/* Layer 1: Atmospheric Blooms — fixed, static (animation removed for scroll perf) */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -10,
          background: `
            radial-gradient(ellipse 100% 80% at 20% 10%, rgba(120, 20, 60, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 85% 30%, rgba(90, 15, 50, 0.12) 0%, transparent 45%),
            radial-gradient(ellipse 90% 70% at 50% 90%, rgba(100, 10, 55, 0.16) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 10% 70%, rgba(130, 25, 65, 0.10) 0%, transparent 40%)
          `,
        }}
      />

      {/* Layer 2: Vignette — fixed */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -10,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, rgba(100, 15, 50, 0.10) 100%)',
        }}
      />

      {/* Layer 2: Stars — fixed */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -10 }}>
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `radial-gradient(circle, rgba(140,20,65,${star.brightness}) 0%, rgba(140,20,65,${star.brightness * 0.6}) 50%, transparent 100%)`,
              animation: `v2StarTwinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        {/* Larger accent stars with glow */}
        {showAccentStars && [
          { left: 15, top: 20, size: 4 },
          { left: 85, top: 35, size: 3 },
          { left: 25, top: 60, size: 3.5 },
          { left: 70, top: 15, size: 4 },
          { left: 90, top: 70, size: 3 },
          { left: 5, top: 45, size: 3.5 },
          { left: 50, top: 85, size: 4 },
          { left: 35, top: 10, size: 3 },
        ].map((star, i) => (
          <div
            key={`accent-${i}`}
            className="absolute"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `v2StarPulse ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            {/* Star shape with 4 points */}
            <div
              className="absolute inset-0"
              style={{
                background: 'rgba(140,20,65,0.75)',
                clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
                filter: 'blur(0.5px)',
                boxShadow: '0 0 12px rgba(140,20,65,0.6), 0 0 24px rgba(140,20,65,0.35)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Layer 3: Mid-Ground Shapes — absolute, parallax slower (deeper) */}
      <div
        ref={midGroundRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: -5 }}
      >
        {midShapes.map((shape) => (
          <div
            key={`mid-${shape.id}`}
            className="absolute rounded-full"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              width: `${shape.width}px`,
              height: `${shape.height}px`,
              background: `radial-gradient(ellipse, ${shape.color} 0%, transparent 70%)`,
              filter: `blur(${shape.blur}px)`,
              transform: `rotate(${shape.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Layer 5: Content (children) — relative, normal scroll */}
      <div id="main" className="relative" style={{ zIndex: 10 }}>
        {children}
      </div>

      {/* Layer 6: Foreground Particles — absolute, parallax faster (closer) */}
      <div
        ref={foregroundRef}
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ zIndex: 5 }}
      >
        {particles.map((p) => (
          <div
            key={`particle-${p.id}`}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `radial-gradient(circle, rgba(180, 50, 90, ${p.opacity}) 0%, transparent 70%)`,
              animation: `v2ParticleDrift ${p.driftDuration}s ease-in-out infinite`,
              animationDelay: `${p.driftDelay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

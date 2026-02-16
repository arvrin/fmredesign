'use client';

import { useState, useEffect, ReactNode } from 'react';

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

interface V2PageWrapperProps {
  children: ReactNode;
  starCount?: number;
  showAccentStars?: boolean;
}

export function V2PageWrapper({
  children,
  starCount = 80,
  showAccentStars = true
}: V2PageWrapperProps) {
  // Generate stars only on the client side to avoid hydration mismatch
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(generateStars(starCount));
  }, [starCount]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* UNIFIED BACKGROUND - Light magenta-infused gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -10,
          background: `
            linear-gradient(135deg,
              #fef5f8 0%,
              #fce8ef 10%,
              #f9dce6 20%,
              #f5d0de 30%,
              #f2c6d7 40%,
              #f0bfd2 50%,
              #f2c6d7 60%,
              #f5d0de 70%,
              #f9dce6 80%,
              #fce8ef 90%,
              #fef5f8 100%
            )
          `,
        }}
      />

      {/* Atmospheric Layer - Soft magenta blooms */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -10,
          background: `
            radial-gradient(ellipse 100% 80% at 20% 10%, rgba(201, 50, 93, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 85% 30%, rgba(180, 40, 80, 0.06) 0%, transparent 45%),
            radial-gradient(ellipse 90% 70% at 50% 90%, rgba(160, 30, 70, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 10% 70%, rgba(201, 50, 93, 0.05) 0%, transparent 40%)
          `,
        }}
      />

      {/* Vignette - Soft edge warmth */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -10,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, rgba(201, 50, 93, 0.06) 100%)',
        }}
      />

      {/* BLINKING STARS - Magical night sky effect */}
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
              background: `radial-gradient(circle, rgba(201,50,93,${star.brightness * 0.5}) 0%, rgba(201,50,93,${star.brightness * 0.25}) 50%, transparent 100%)`,
              boxShadow: `0 0 ${star.size * 2}px rgba(201,50,93,${star.brightness * 0.3})`,
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
                background: 'rgba(201,50,93,0.35)',
                clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
                filter: 'blur(0.5px)',
                boxShadow: '0 0 10px rgba(201,50,93,0.3), 0 0 20px rgba(201,50,93,0.15)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}

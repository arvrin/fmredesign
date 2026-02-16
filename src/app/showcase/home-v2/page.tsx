'use client';

import { useMemo } from 'react';
import { HeroSectionV2 } from "@/components/sections/HeroSectionV2";
import { ServicesSectionV2 } from "@/components/sections/ServicesSectionV2";
import { FeaturesSectionV2 } from "@/components/sections/FeaturesSectionV2";
import { ClientsSectionV2 } from "@/components/sections/ClientsSectionV2";
import { CaseStudiesSectionV2 } from "@/components/sections/CaseStudiesSectionV2";
import { ContactSectionV2 } from "@/components/sections/ContactSectionV2";

// Generate random stars once on component mount
const generateStars = (count: number) => {
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

export default function HomeV2Page() {
  const stars = useMemo(() => generateStars(80), []);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          UNIFIED BACKGROUND - Brand-aligned magenta gradient
          Uses CSS variables from design system for consistency
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            linear-gradient(180deg,
              var(--color-fm-purple-700) 0%,
              var(--color-fm-magenta-900) 15%,
              var(--color-fm-magenta-800) 30%,
              var(--color-fm-magenta-700) 45%,
              var(--color-fm-magenta-800) 60%,
              var(--color-fm-magenta-900) 75%,
              var(--color-fm-purple-700) 90%,
              var(--color-fm-purple-800) 100%
            )
          `,
        }}
      />

      {/* Static Atmospheric Layer - Subtle depth */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 20%, rgba(201, 50, 93, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(160, 30, 70, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 50% 80%, rgba(124, 29, 62, 0.15) 0%, transparent 40%)
          `,
        }}
      />

      {/* ✨ BLINKING STARS - Magical night sky effect */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: `radial-gradient(circle, rgba(255,255,255,${star.brightness}) 0%, rgba(255,220,240,${star.brightness * 0.5}) 50%, transparent 100%)`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,${star.brightness * 0.5})`,
              animation: `v2StarTwinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        {/* Larger accent stars with glow */}
        {[
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
                background: 'white',
                clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
                filter: 'blur(0.5px)',
                boxShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(236,117,160,0.4)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Star animations now centralized in globals.css as v2StarTwinkle and v2StarPulse */}

      {/* ═══════════════════════════════════════════════════════════════════
          CONTENT SECTIONS - All with transparent backgrounds
          Content floats on cards or sits directly on the dark background
          ═══════════════════════════════════════════════════════════════════ */}

      {/* Hero - Floating white card on dark background */}
      <HeroSectionV2 />

      {/* Services - White cards on dark background */}
      <ServicesSectionV2 />

      {/* Features - Discord-style alternating layout with mascots */}
      <FeaturesSectionV2 />

      {/* Clients - Content directly on dark background */}
      <ClientsSectionV2 />

      {/* Case Studies - White cards on dark background */}
      <CaseStudiesSectionV2 />

      {/* Contact CTA - Content on dark background */}
      <ContactSectionV2 />
    </main>
  );
}

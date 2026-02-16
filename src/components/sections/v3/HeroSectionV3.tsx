'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const clientLogos = [
  { name: 'TechStart', width: 100 },
  { name: 'GrowthCo', width: 90 },
  { name: 'BrandX', width: 85 },
  { name: 'FreshBite', width: 95 },
  { name: 'HealthPlus', width: 105 },
];

export function HeroSectionV3() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Subtle mouse tracking for gradient blob
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-fm-cream"
    >
      {/* Large decorative background text */}
      <div
        className={`
          absolute top-1/2 -translate-y-1/2 right-0 select-none pointer-events-none
          text-[20vw] lg:text-[25vw] font-bold leading-none tracking-tighter
          text-fm-neutral-100 opacity-60
          transition-all duration-1000
          ${isLoaded ? 'translate-x-0 opacity-60' : 'translate-x-20 opacity-0'}
        `}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        FM
      </div>

      {/* Animated gradient blob following mouse */}
      <div
        className="absolute w-[800px] h-[800px] opacity-[0.07] pointer-events-none blur-3xl transition-all duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, #8c1d4a 0%, transparent 70%)',
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-20">
        {/* Eyebrow with accent line */}
        <div
          className={`
            flex items-center gap-4 mb-8
            transition-all duration-700
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ transitionDelay: '200ms' }}
        >
          <div
            className={`
              h-px bg-fm-magenta-600 transition-all duration-700
              ${isLoaded ? 'w-12' : 'w-0'}
            `}
            style={{ transitionDelay: '400ms' }}
          />
          <p
            className={`
              text-fm-magenta-600 text-sm font-semibold tracking-[0.2em] uppercase
              transform transition-transform duration-700
              ${isLoaded ? 'translate-x-0' : '-translate-x-4'}
            `}
            style={{ transitionDelay: '300ms' }}
          >
            Digital Marketing Agency
          </p>
        </div>

        {/* Main Headline - Character stagger effect */}
        <div className="mb-10">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold leading-[1.05] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {/* Line 1 */}
            <span className="block overflow-hidden">
              <span
                className={`
                  block text-fm-ink
                  transform transition-transform duration-1000 ease-out
                  ${isLoaded ? 'translate-y-0' : 'translate-y-full'}
                `}
                style={{ transitionDelay: '400ms' }}
              >
                Ideas that
              </span>
            </span>
            {/* Line 2 with gradient */}
            <span className="block overflow-hidden">
              <span
                className={`
                  block bg-gradient-to-r from-fm-magenta-600 via-fm-magenta-500 to-fm-magenta-600 bg-clip-text text-transparent
                  transform transition-transform duration-1000 ease-out
                `}
                style={{
                  transitionDelay: '550ms',
                  transform: isLoaded ? 'translateY(0)' : 'translateY(100%)'
                }}
              >
                move markets.
              </span>
            </span>
          </h1>
        </div>

        {/* Subheadline - Better contrast */}
        <div
          className={`
            max-w-xl mb-14
            transition-all duration-700
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: '750ms' }}
        >
          <p className="text-lg md:text-xl text-fm-neutral-700 leading-relaxed">
            Strategic creativity that transforms ambitious brands into market leaders.
            <span className="text-fm-ink font-medium"> Data-informed. Design-led. Results-driven.</span>
          </p>
        </div>

        {/* CTAs */}
        <div
          className={`
            flex flex-col sm:flex-row items-start gap-4 mb-24
            transition-all duration-700
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: '900ms' }}
        >
          {/* Primary CTA - Magnetic effect on hover */}
          <Link
            href="/get-started"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-fm-ink text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-fm-ink/20 hover:-translate-y-0.5"
          >
            <span className="relative z-10">Start a Project</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            {/* Hover fill */}
            <div className="absolute inset-0 bg-fm-magenta-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/work"
            className="group inline-flex items-center gap-3 px-8 py-4 text-fm-ink font-semibold rounded-full border-2 border-fm-neutral-300 hover:border-fm-ink hover:bg-fm-ink hover:text-white transition-all duration-300"
          >
            View Our Work
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Social Proof - Client Logos with marquee effect */}
        <div
          className={`
            transition-all duration-700
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: '1100ms' }}
        >
          <p className="text-sm text-fm-neutral-500 mb-8 tracking-wide uppercase font-medium">
            Trusted by industry leaders
          </p>

          {/* Logo marquee container */}
          <div className="relative overflow-hidden">
            <div className="flex items-center gap-12 animate-marquee">
              {[...clientLogos, ...clientLogos].map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className="flex-shrink-0 opacity-50 hover:opacity-80 transition-opacity duration-300 grayscale hover:grayscale-0"
                  style={{ width: client.width }}
                >
                  <div className="h-10 bg-fm-neutral-400 rounded-lg flex items-center justify-center px-4">
                    <span className="text-sm text-white font-semibold tracking-wide">{client.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative line with animated reveal */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fm-neutral-300 to-transparent
          transform origin-center transition-transform duration-1500 ease-out
          ${isLoaded ? 'scale-x-100' : 'scale-x-0'}
        `}
        style={{ transitionDelay: '1400ms' }}
      />

      {/* Scroll indicator */}
      <div
        className={`
          absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
          transition-all duration-700
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ transitionDelay: '1600ms' }}
      >
        <span className="text-xs text-fm-neutral-400 uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-fm-neutral-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

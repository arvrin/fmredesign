'use client';

import React, { useEffect, useRef } from 'react';
import { Star, ArrowRight, Handshake, BarChart3, Lightbulb } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from '@/components/animations/Card3D';
import { GradientOrb } from '@/components/animations/ParallaxLayer';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Client logos from the migrated assets
const clientLogos = [
  'Asset-5.png', 'Asset-6.png', 'Asset-7.png', 'Asset-8.png', 'Asset-9.png',
  'Asset-10.png', 'Asset-11.png', 'Asset-12.png', 'Asset-13.png', 'Asset-14.png',
  'Asset-15.png', 'Asset-16.png', 'Asset-17.png', 'Asset-18.png', 'Asset-19.png',
  'Asset-20.png', 'Asset-21.png', 'Asset-22.png', 'Asset-23.png', 'Asset-24.png',
  'Asset-25.png', 'Asset-26.png', 'Asset-27.png', 'Asset-28.png', 'Asset-29.png',
  'Asset-30.png', 'Asset-31.png', 'Asset-32.png', 'Asset-33.png', 'Asset-34.png',
  'Asset-35.png', 'Asset-36.png', 'Asset-37.png', 'Asset-38.png', 'Asset-39.png',
  'Asset-40.png',
];

const stats = [
  { icon: Handshake, label: 'Trusted Partnerships' },
  { icon: Star, label: 'Top-Rated Service' },
  { icon: BarChart3, label: 'Measurable Growth' },
  { icon: Lightbulb, label: 'Strategic Approach' },
];

export function ClientsSectionV2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header animation with split text feel
      if (headerRef.current) {
        const badge = headerRef.current.querySelector('.clients-badge');
        const heading = headerRef.current.querySelector('h2');
        const subtitle = headerRef.current.querySelector('p');

        gsap.from([badge, heading, subtitle], {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Stats cards with 3D stagger
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll('.stat-card');

        gsap.from(statCards, {
          y: 60,
          opacity: 0,
          scale: 0.9,
          rotationX: 15,
          duration: 0.7,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        // Animate stat numbers with counting effect
        const statNumbers = statsRef.current.querySelectorAll('.stat-number');
        statNumbers.forEach((num) => {
          gsap.from(num, {
            textContent: '0',
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        });
      }

      // Marquee entrance
      if (marqueeRef.current) {
        gsap.from(marqueeRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Mascot floating entrance
      if (mascotRef.current) {
        gsap.from(mascotRef.current, {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotation: -10,
          duration: 1.2,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'bottom 70%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-visible z-20"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Ambient Gradient Orbs */}
      <GradientOrb
        color="rgba(201, 50, 93, 0.2)"
        size={600}
        blur={80}
        position={{ top: '-200px', right: '-200px' }}
        drift={20}
      />
      <GradientOrb
        color="rgba(160, 30, 70, 0.15)"
        size={500}
        blur={60}
        position={{ bottom: '-100px', left: '-150px' }}
        drift={15}
      />

      {/* Decorative Brain */}
      <div
        className="absolute w-[300px] h-[300px] opacity-20 pointer-events-none hidden lg:block"
        style={{
          top: '15%',
          right: '5%',
          filter: 'blur(35px)',
        }}
      >
        <img
          src="/3dasset/brain-teaching.png"
          alt=""
          className="w-full h-full object-contain"
          style={{ opacity: 0.5 }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 v2-section"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="v2-container">
          {/* Section Header */}
          <div ref={headerRef} className="max-w-3xl mx-auto mb-16" style={{ textAlign: 'center' }}>
            <div className="clients-badge v2-badge v2-badge-glass mb-6">
              <Star className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">
                Trusted by Industry Leaders
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold v2-text-primary mb-6 leading-tight">
              Trusted by 100+ Brands{' '}
              <span className="v2-accent">Worldwide</span>
            </h2>

            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed">
              From ambitious startups to global enterprises, we help brands
              achieve extraordinary results.
            </p>
          </div>

          {/* Stats Row */}
          <div ref={statsRef} className="mb-16 max-w-3xl mx-auto">
            <div className="rounded-2xl p-4 md:p-5" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(201, 50, 93, 0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex flex-col items-center gap-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(201,50,93,0.15)' }}>
                        <Icon className="w-4 h-4 text-fm-magenta-400" />
                      </div>
                      <span className="v2-text-secondary text-xs font-medium">{stat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Logo Marquee */}
          <div ref={marqueeRef} className="mb-20">
            {/* First row - scrolls left */}
            <div className="logo-marquee-container mb-4">
              <div className="logo-marquee-track">
                {[...clientLogos, ...clientLogos].map((logo, index) => (
                  <div
                    key={`row1-${index}`}
                    className="logo-marquee-item"
                  >
                    <img
                      src={`/clients/${logo}`}
                      alt="Client"
                      width={140}
                      height={80}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      className="hover:opacity-100 transition-all duration-300 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Second row - scrolls right (reverse) */}
            <div className="logo-marquee-container">
              <div className="logo-marquee-track-reverse">
                {[...clientLogos.slice().reverse(), ...clientLogos.slice().reverse()].map((logo, index) => (
                  <div
                    key={`row2-${index}`}
                    className="logo-marquee-item"
                  >
                    <img
                      src={`/clients/${logo}`}
                      alt="Client"
                      width={140}
                      height={80}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      className="hover:opacity-100 transition-all duration-300 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="mt-16" style={{ textAlign: 'center' }}>
            <MagneticButton
              as="a"
              href="/work"
              strength={0.3}
              className="v2-btn v2-btn-primary group"
            >
              View Our Work
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Bridging Character */}
      <div
        ref={mascotRef}
        className="absolute left-[10%] z-30 hidden lg:block"
        style={{ bottom: '-120px' }}
      >
        <img
          src="/3dasset/brain-creative.png"
          alt="Creative Energy"
          className="animate-v2-clients-float"
          style={{
            width: 'min(288px, 45vw)',
            height: 'auto',
            filter: 'drop-shadow(0 30px 60px rgba(140,25,60,0.25))',
          }}
        />
      </div>
    </section>
  );
}

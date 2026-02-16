'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const stats = [
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 50, suffix: '+', label: 'Team Members' },
  { value: 250, suffix: '+', label: 'Projects Delivered' },
  { value: 95, suffix: '%', label: 'Client Retention' },
];

function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [hasStarted, value, duration]);

  return (
    <span ref={counterRef}>
      {count}{suffix}
    </span>
  );
}

export function StatsSectionV3() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-fm-ink overflow-hidden"
    >
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Accent gradient */}
      <div
        className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 100%, #c9325d 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section header */}
        <div
          className={`
            flex items-center gap-4 mb-16
            transition-all duration-700
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div
            className={`
              h-px bg-fm-magenta-500 transition-all duration-700
              ${isVisible ? 'w-12' : 'w-0'}
            `}
            style={{ transitionDelay: '200ms' }}
          />
          <p className="text-fm-magenta-400 text-sm font-semibold tracking-[0.2em] uppercase">
            By The Numbers
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          {/* Stats Grid */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`
                    text-center lg:text-left
                    transition-all duration-700
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <span
                    className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white block mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2000 + index * 200} />
                  </span>
                  <span className="text-sm text-white/60 uppercase tracking-wider font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className={`
              lg:col-span-3 lg:text-right
              transition-all duration-700 delay-700
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 px-8 py-4 text-white font-semibold border-2 border-white/20 rounded-full hover:bg-white hover:text-fm-ink transition-all duration-300"
            >
              <span>Meet the Team</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

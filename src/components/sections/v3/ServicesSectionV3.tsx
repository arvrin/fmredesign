'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, Users, Target, Palette, Globe, FileText } from 'lucide-react';

const services = [
  {
    title: "Search Engine Optimization",
    shortTitle: "SEO",
    description: "Dominate search results with data-driven strategies that put you where customers are looking.",
    metric: "150%",
    metricLabel: "avg traffic growth",
    icon: TrendingUp,
    accentColor: "#f59e0b",
  },
  {
    title: "Social Media Marketing",
    shortTitle: "Social",
    description: "Build engaged communities with content that turns followers into customers.",
    metric: "200%",
    metricLabel: "engagement boost",
    icon: Users,
    accentColor: "#ec4899",
  },
  {
    title: "Performance Marketing",
    shortTitle: "PPC",
    description: "Laser-focused campaigns that deliver qualified leads while maximizing ROI.",
    metric: "300%",
    metricLabel: "ROAS achieved",
    icon: Target,
    accentColor: "#3b82f6",
  },
  {
    title: "Brand Identity",
    shortTitle: "Branding",
    description: "Visual identities that capture attention, build trust, and make competitors jealous.",
    metric: "180%",
    metricLabel: "brand recall",
    icon: Palette,
    accentColor: "#8b5cf6",
  },
  {
    title: "Website Development",
    shortTitle: "Web",
    description: "Lightning-fast websites that don't just look good—they close deals 24/7.",
    metric: "120%",
    metricLabel: "conversion lift",
    icon: Globe,
    accentColor: "#10b981",
  },
  {
    title: "Content Production",
    shortTitle: "Content",
    description: "From scroll-stopping videos to blogs that rank, content that drives action.",
    metric: "250%",
    metricLabel: "lead generation",
    icon: FileText,
    accentColor: "#ef4444",
  },
];

export function ServicesSectionV3() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 lg:py-36 bg-white overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20" style={{ zIndex: 2 }}>
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <div
              className={`
                flex items-center gap-4 mb-6
                transition-all duration-700
                ${isVisible ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <div
                className={`
                  h-px bg-fm-magenta-600 transition-all duration-700
                  ${isVisible ? 'w-12' : 'w-0'}
                `}
                style={{ transitionDelay: '200ms' }}
              />
              <p className="text-fm-magenta-600 text-sm font-semibold tracking-[0.2em] uppercase">
                What We Do
              </p>
            </div>
            <h2
              className={`
                text-4xl md:text-5xl lg:text-6xl font-bold text-fm-ink leading-[1.1]
                transition-all duration-700 delay-100
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Services that<br />
              <span className="text-fm-neutral-400">actually deliver</span>
            </h2>
          </div>

          <Link
            href="/services"
            className={`
              group inline-flex items-center gap-2 text-fm-ink font-semibold
              transition-all duration-700 delay-200
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <span className="border-b-2 border-transparent group-hover:border-fm-ink transition-colors duration-300">
              View all services
            </span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Services Grid with numbering */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredIndex === index;

            return (
              <Link
                href="/services"
                key={service.title}
                className={`
                  group relative bg-fm-neutral-50 rounded-3xl p-8 lg:p-10
                  transition-all duration-500 cursor-pointer
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                  ${isHovered ? 'bg-fm-ink -translate-y-2 shadow-2xl shadow-fm-ink/10' : 'hover:bg-fm-neutral-100'}
                `}
                style={{ transitionDelay: `${300 + index * 80}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Number index */}
                <div
                  className={`
                    absolute top-6 right-6 text-sm font-mono font-bold
                    transition-colors duration-300
                    ${isHovered ? 'text-white/30' : 'text-fm-neutral-300'}
                  `}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Accent bar */}
                <div
                  className={`
                    absolute top-0 left-8 right-8 h-1 rounded-full
                    transform origin-left transition-transform duration-500
                    ${isHovered ? 'scale-x-100' : 'scale-x-0'}
                  `}
                  style={{ backgroundColor: service.accentColor }}
                />

                {/* Icon */}
                <div
                  className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center mb-6
                    transition-all duration-300
                    ${isHovered ? 'bg-white/10' : 'bg-fm-neutral-100'}
                  `}
                >
                  <Icon
                    className={`
                      w-6 h-6 transition-colors duration-300
                      ${isHovered ? 'text-white' : 'text-fm-neutral-600'}
                    `}
                    style={{ color: isHovered ? service.accentColor : undefined }}
                  />
                </div>

                {/* Metric */}
                <div className="mb-6">
                  <span
                    className={`
                      text-5xl lg:text-6xl font-bold transition-colors duration-300 block
                    `}
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: isHovered ? service.accentColor : '#1a1a1a',
                    }}
                  >
                    {service.metric}
                  </span>
                  <span
                    className={`
                      text-sm mt-1 block font-medium transition-colors duration-300
                      ${isHovered ? 'text-white/60' : 'text-fm-neutral-500'}
                    `}
                  >
                    {service.metricLabel}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`
                    text-xl font-bold mb-3 transition-colors duration-300
                    ${isHovered ? 'text-white' : 'text-fm-ink'}
                  `}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className={`
                    text-sm leading-relaxed transition-all duration-300
                    ${isHovered ? 'text-white/80' : 'text-fm-neutral-600'}
                  `}
                >
                  {service.description}
                </p>

                {/* Arrow indicator */}
                <div
                  className={`
                    absolute bottom-8 right-8
                    transform transition-all duration-300
                    ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                  `}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${service.accentColor}20` }}
                  >
                    <ArrowUpRight
                      className="w-5 h-5"
                      style={{ color: service.accentColor }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

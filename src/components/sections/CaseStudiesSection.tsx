'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp, Users, ShoppingCart } from 'lucide-react';

const caseStudies = [
  {
    id: 1,
    client: 'TechStart Inc.',
    category: 'Performance Marketing',
    title: 'Transforming lead generation through precision targeting',
    metric: '+300%',
    metricLabel: 'Lead Generation',
    year: '2024',
    icon: TrendingUp,
  },
  {
    id: 2,
    client: 'Fashion Forward',
    category: 'Brand Campaign',
    title: 'A viral social movement that redefined brand awareness',
    metric: '2M+',
    metricLabel: 'Impressions',
    year: '2024',
    icon: Users,
  },
  {
    id: 3,
    client: 'Local Restaurant Chain',
    category: 'Local SEO & Ads',
    title: 'Doubling online orders through strategic local presence',
    metric: '+100%',
    metricLabel: 'Online Orders',
    year: '2023',
    icon: ShoppingCart,
  },
];

export function CaseStudiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            if (index === 'header') {
              setHeaderVisible(true);
            } else {
              setVisibleItems((prev) => [...new Set([...prev, parseInt(index || '0')])]);
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '-50px' }
    );

    const items = sectionRef.current?.querySelectorAll('[data-index]');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-br from-fm-neutral-900 via-fm-magenta-900 to-fm-neutral-900 py-24 lg:py-32 overflow-hidden">
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="caseStudiesPattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5"/>
              <circle cx="40" cy="40" r="2" fill="white" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#caseStudiesPattern)" />
        </svg>
      </div>

      {/* Floating gradient orbs */}
      <div className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full bg-fm-magenta-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-[300px] h-[300px] rounded-full bg-fm-magenta-400/15 blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">

        {/* Section header */}
        <div
          data-index="header"
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-20 transition-all duration-1000 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-fm-magenta-300 mb-4">
              <span className="w-8 h-[2px] bg-fm-magenta-300" />
              Selected Work
            </span>

            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Results that{' '}
              <span className="text-fm-magenta-300">speak</span> for themselves.
            </h2>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 flex items-end">
            <p className="text-lg text-white/80 leading-relaxed">
              Each project represents a strategic partnership. We don't just deliver campaigns—we build lasting growth engines for ambitious brands.
            </p>
          </div>
        </div>

        {/* Case Studies Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {caseStudies.map((study, index) => {
            const IconComponent = study.icon;
            return (
              <div
                key={study.id}
                data-index={index}
                className={`group relative transition-all duration-700 ease-out ${
                  visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Link href="/work" className="block">
                  <div className="relative bg-white rounded-2xl p-8 lg:p-10 h-full min-h-[380px] flex flex-col shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2">
                    {/* Accent bar at top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fm-magenta-500 to-fm-magenta-300" />

                    {/* Content */}
                    <div className="flex flex-col h-full">
                      {/* Year & Category */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-medium text-fm-neutral-500">{study.year}</span>
                        <span className="text-xs font-semibold text-fm-magenta-600 bg-fm-magenta-50 px-3 py-1.5 rounded-full">
                          {study.category}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      {/* Client Name */}
                      <h3
                        className="text-2xl font-bold text-fm-neutral-900 mb-3"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {study.client}
                      </h3>

                      {/* Description */}
                      <p className="text-fm-neutral-600 leading-relaxed mb-auto">
                        {study.title}
                      </p>

                      {/* Metric & Arrow */}
                      <div className="flex items-end justify-between mt-6 pt-6 border-t border-fm-neutral-100">
                        <div>
                          <div
                            className="text-4xl font-bold text-fm-magenta-600"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {study.metric}
                          </div>
                          <span className="text-xs font-medium text-fm-neutral-500 uppercase tracking-wider">
                            {study.metricLabel}
                          </span>
                        </div>

                        <div className="w-12 h-12 rounded-full bg-fm-neutral-100 flex items-center justify-center group-hover:bg-fm-magenta-600 transition-all duration-300">
                          <ArrowUpRight className="w-5 h-5 text-fm-neutral-400 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div
          className={`mt-16 text-center transition-all duration-700 ${
            visibleItems.length >= caseStudies.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <Link
            href="/work"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-fm-magenta-700 text-sm font-semibold rounded-full hover:shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
          >
            <span>View All Case Studies</span>
            <ArrowUpRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

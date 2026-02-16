'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, TrendingUp, Target } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card3D, MagneticButton } from '@/components/animations/Card3D';
import { Reveal } from '@/components/animations/SplitText';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const caseStudies = [
  {
    title: "TechStart India",
    category: "E-commerce",
    tagline: "From Zero to Hero",
    description: "Complete digital transformation including brand identity, website redesign, and full-funnel marketing strategy.",
    metrics: [
      { value: "300%", label: "Traffic" },
      { value: "5x", label: "Leads" },
      { value: "₹2Cr", label: "Revenue" }
    ],
    tags: ["SEO", "PPC", "Branding"],
    gradientClass: "v2-gradient-brand",
    featured: true
  },
  {
    title: "GrowthCo",
    category: "SaaS",
    tagline: "Scaling to Success",
    description: "B2B lead generation and conversion optimization that tripled their sales pipeline.",
    metrics: [
      { value: "250%", label: "MQLs" },
      { value: "40%", label: "CAC ↓" }
    ],
    tags: ["Performance", "CRO"],
    gradientClass: "v2-gradient-performance",
    featured: false
  },
  {
    title: "FreshBite",
    category: "Food & Beverage",
    tagline: "Taste Goes Viral",
    description: "Social media strategy that turned a local brand into a city-wide sensation.",
    metrics: [
      { value: "500K+", label: "Followers" },
      { value: "10x", label: "Engagement" }
    ],
    tags: ["Social", "Content"],
    gradientClass: "v2-gradient-content",
    featured: false
  },
  {
    title: "HealthPlus",
    category: "Healthcare",
    tagline: "Caring Connections",
    description: "Brand repositioning and digital marketing for a healthcare provider chain.",
    metrics: [
      { value: "180%", label: "Brand Recall" },
      { value: "3x", label: "Appointments" }
    ],
    tags: ["Branding", "Strategy"],
    gradientClass: "v2-gradient-deep",
    featured: false
  }
];

export function CaseStudiesSectionV2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const featuredStudy = caseStudies.find(s => s.featured);
  const otherStudies = caseStudies.filter(s => !s.featured);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        const badge = headerRef.current.querySelector('.case-badge');
        const heading = headerRef.current.querySelector('h2');
        const subtitle = headerRef.current.querySelector('p');

        gsap.from([badge, heading, subtitle], {
          y: 60,
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

      // Featured case study with cinematic reveal
      if (featuredRef.current) {
        const card = featuredRef.current.querySelector('.featured-card');
        const visual = featuredRef.current.querySelector('.featured-visual');
        const content = featuredRef.current.querySelector('.featured-content');
        const metrics = featuredRef.current.querySelectorAll('.metric-item');
        const decorativeCircles = featuredRef.current.querySelectorAll('.decorative-circle');

        // Card entrance
        gsap.from(card, {
          y: 100,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        // Decorative circles with rotation
        gsap.from(decorativeCircles, {
          scale: 0,
          rotation: -180,
          opacity: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });

        // Metrics counter animation
        gsap.from(metrics, {
          y: 40,
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Grid cards with staggered 3D entrance
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.case-card');

        gsap.from(cards, {
          y: 80,
          opacity: 0,
          rotationX: 20,
          scale: 0.9,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          y: 40,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 90%',
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
      className="relative z-10 overflow-hidden pt-40"
    >
      {/* Section Header */}
      <div ref={headerRef} className="relative z-10 v2-container pb-16">
        <div className="max-w-3xl mx-auto" style={{ textAlign: 'center' }}>
          <div className="case-badge v2-badge v2-badge-glass mb-6">
            <Target className="w-4 h-4 v2-text-primary" />
            <span className="v2-text-primary">
              Real Results, Real Impact
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold v2-text-primary mb-6 leading-tight">
            Work That{' '}
            <span className="v2-accent">
              Speaks For Itself
            </span>
          </h2>

          <p className="text-lg md:text-xl v2-text-secondary leading-relaxed">
            Every project is a story of transformation. Here's how we've helped
            brands achieve extraordinary results.
          </p>
        </div>
      </div>

      {/* Featured Case Study */}
      {featuredStudy && (
        <div ref={featuredRef} className="relative z-10 v2-container pb-12">
          <Card3D intensity={5} glareEnabled={true} glareOpacity={0.1} scale={1.01}>
            <div className="featured-card group relative v2-paper-lg rounded-3xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
                {/* Visual Side */}
                <div className={`featured-visual relative ${featuredStudy.gradientClass} p-8 lg:p-12 min-h-[300px] lg:min-h-[400px] flex items-center justify-center`}>
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="decorative-circle absolute top-8 left-8 w-40 h-40 border border-white/30 rounded-full" />
                    <div className="decorative-circle absolute bottom-8 right-8 w-28 h-28 border border-white/20 rounded-full" />
                    <div className="decorative-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full" />
                  </div>

                  {/* Large Metric Display */}
                  <div className="relative text-center">
                    <div className="metric-item font-display text-8xl lg:text-9xl font-bold text-white mb-2">
                      {featuredStudy.metrics[0].value}
                    </div>
                    <div className="text-white/85 text-lg font-medium uppercase tracking-wide">
                      {featuredStudy.metrics[0].label} Growth
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="text-white text-sm font-semibold">{featuredStudy.category}</span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="featured-content p-8 lg:p-12 flex flex-col justify-center">
                  <p className="text-fm-magenta-600 font-semibold text-sm tracking-wide uppercase mb-2">
                    {featuredStudy.tagline}
                  </p>

                  <h3 className="font-display text-3xl lg:text-4xl font-bold text-fm-neutral-900 mb-4">
                    {featuredStudy.title}
                  </h3>

                  <p className="text-lg text-fm-neutral-600 mb-8 leading-relaxed">
                    {featuredStudy.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {featuredStudy.metrics.map((metric) => (
                      <div key={metric.label} className="metric-item text-center p-4 bg-fm-neutral-50 rounded-xl transition-transform duration-300 hover:scale-105">
                        <div className="text-2xl lg:text-3xl font-bold text-fm-magenta-600 flex items-center justify-center gap-1">
                          <TrendingUp className="w-5 h-5" />
                          {metric.value}
                        </div>
                        <div className="text-xs text-fm-neutral-500 mt-1">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tags + CTA */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {featuredStudy.tags.map((tag) => (
                        <span
                          key={tag}
                          className="v2-tag v2-tag-magenta"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <MagneticButton
                      as="a"
                      href="/work"
                      strength={0.3}
                      className="group/link inline-flex items-center gap-2 text-fm-magenta-600 font-semibold hover:text-fm-magenta-700 transition-colors"
                    >
                      View Case Study
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          </Card3D>
        </div>
      )}

      {/* Other Case Studies Grid */}
      <div ref={gridRef} className="relative z-10 v2-container pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {otherStudies.map((study, index) => (
            <Card3D
              key={study.title}
              intensity={12}
              glareEnabled={true}
              glareOpacity={0.15}
              scale={1.03}
              className="case-card"
            >
              <div
                className="group relative v2-paper rounded-2xl overflow-hidden h-full"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Visual Header */}
                <div
                  className={`relative ${study.gradientClass} p-6 h-40 flex items-center justify-center`}
                  style={{ transform: 'translateZ(10px)' }}
                >
                  {/* Metric Display */}
                  <div className="text-center">
                    <div className="font-display text-5xl font-bold text-white mb-1">
                      {study.metrics[0].value}
                    </div>
                    <div className="text-white/85 text-sm font-medium">{study.metrics[0].label}</div>
                  </div>

                  {/* Category */}
                  <div className="absolute top-4 left-4 v2-tag v2-tag-overlay">
                    {study.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6" style={{ transform: 'translateZ(5px)' }}>
                  <p className="text-fm-magenta-600 font-semibold text-xs tracking-wide uppercase mb-2">
                    {study.tagline}
                  </p>

                  <h3 className="font-display text-xl font-bold text-fm-neutral-900 mb-3">
                    {study.title}
                  </h3>

                  <p className="text-sm text-fm-neutral-600 mb-4 line-clamp-2">
                    {study.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="v2-tag v2-tag-neutral"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Overlay with magnetic effect */}
                <div className="absolute inset-0 bg-fm-magenta-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <MagneticButton
                    as="a"
                    href="/work"
                    strength={0.4}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-fm-magenta-700 font-semibold rounded-full shadow-lg"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>

      {/* View All CTA */}
      <div ref={ctaRef} className="relative z-10 text-center pb-24">
        <MagneticButton
          as="a"
          href="/work"
          strength={0.3}
          className="v2-btn v2-btn-primary group"
        >
          Explore All Projects
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </MagneticButton>
      </div>
    </section>
  );
}

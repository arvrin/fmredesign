'use client';

import React, { useState } from 'react';
import { LinkButton } from '@/design-system';
import { ArrowRight, ExternalLink, TrendingUp, Star } from 'lucide-react';

import { cn } from '@/lib/utils';

const caseStudies = [
  {
    id: 1,
    client: 'TechStart Inc.',
    title: 'Increased Lead Generation by 300%',
    description: 'Complete digital transformation that resulted in exponential growth through strategic SEO and performance marketing.',
    image: '/placeholder-case1.jpg', // We'll create placeholder images
    tags: ['SEO', 'PPC', 'Content Marketing'],
    metrics: {
      primary: '+300%',
      primaryLabel: 'Lead Generation',
      secondary: '6 months',
      secondaryLabel: 'Timeframe',
    },
    backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    featured: true,
  },
  {
    id: 2,
    client: 'Fashion Forward',
    title: 'Viral Social Campaign: 2M+ Impressions',
    description: 'Creative social media strategy that amplified brand awareness and drove significant engagement across platforms.',
    image: '/placeholder-case2.jpg',
    tags: ['Social Media', 'Content Creation', 'Influencer Marketing'],
    metrics: {
      primary: '2M+',
      primaryLabel: 'Impressions',
      secondary: '45%',
      secondaryLabel: 'Engagement Rate',
    },
    backgroundColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
    featured: false,
  },
  {
    id: 3,
    client: 'Local Restaurant Chain',
    title: 'Doubled Online Orders in 90 Days',
    description: 'Local SEO optimization and targeted advertising campaign that significantly boosted online food ordering.',
    image: '/placeholder-case3.jpg',
    tags: ['Local SEO', 'Google Ads', 'Conversion Optimization'],
    metrics: {
      primary: '+100%',
      primaryLabel: 'Online Orders',
      secondary: '90 days',
      secondaryLabel: 'Timeline',
    },
    backgroundColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    featured: false,
  },
];

export function CaseStudiesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-0 bg-gradient-to-b from-fm-neutral-50 to-fm-neutral-100 overflow-visible">
      {/* Ambient Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 casestudies-gradient-bg"
          style={{
            background: `radial-gradient(ellipse at 40% 30%, rgba(179,41,104,0.12) 0%, transparent 50%),
                        radial-gradient(ellipse at 60% 70%, rgba(255,107,53,0.08) 0%, transparent 50%)`
          }}
        />
        <div className="noise-overlay" />
      </div>

      <div className="relative z-10 px-4 md:px-8 lg:px-16" style={{ paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '1440px', margin: '0 auto' }}>
        {/* Section Header with Perfect Alignment */}
        <div className="text-center mx-auto overflow-visible" style={{ marginBottom: '5rem', maxWidth: '800px' }}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-fm-magenta-50/80 backdrop-blur-sm border border-fm-magenta-200 rounded-full text-fm-magenta-700 text-sm font-medium casestudies-animate-fade-in badge-glow">
              <Star className="w-4 h-4 mr-2 animate-pulse-slow" />
              Success Stories
            </div>
          </div>
          
          <h2 className="font-bold text-fm-neutral-900 casestudies-animate-fade-in-up text-center" 
              style={{ 
                marginBottom: '2rem', 
                lineHeight: '1.1',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                maxWidth: '100%',
                margin: '0 auto 2rem auto'
              }}>
            Real{' '}
            <span className="text-fm-magenta-700 relative inline-block">
              Results
              <svg
                className="absolute -bottom-2 left-0 w-full h-4 text-fm-magenta-700"
                viewBox="0 0 200 12"
                fill="currentColor"
              >
                <path d="M2 8c40-6 80-6 120 0s80 6 120 0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>, Real{' '}
            <span className="text-fm-magenta-700 relative inline-block">
              Impact
              <svg
                className="absolute -bottom-2 left-0 w-full h-4 text-fm-magenta-700"
                viewBox="0 0 200 12"
                fill="currentColor"
              >
                <path d="M2 8c40-6 80-6 120 0s80 6 120 0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h2>
          
          <div className="flex justify-center">
            <p className="text-lg text-fm-neutral-600 leading-relaxed casestudies-animate-fade-in-up text-center" 
               style={{ maxWidth: '600px', animationDelay: '200ms' }}>
              Discover how we&apos;ve helped brands across industries achieve remarkable growth 
              through strategic digital marketing initiatives.
            </p>
          </div>
        </div>

        {/* Featured Case Study with Premium Glass Design */}
        <div style={{ marginBottom: '6rem' }}>
          {caseStudies
            .filter(study => study.featured)
            .map((study) => (
              <div key={study.id} className="featured-card-glass rounded-3xl overflow-hidden casestudies-animate-scale-in" style={{ animationDelay: '300ms' }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                  {/* Content Side */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 text-white rounded-full text-sm font-semibold mb-6 w-fit shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Featured Case Study
                    </div>
                    
                    <div className="text-fm-magenta-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                      {study.client}
                    </div>
                    
                    <h3 className="font-bold text-fm-neutral-900 mb-6" 
                        style={{ 
                          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                          lineHeight: '1.2'
                        }}>
                      {study.title}
                    </h3>
                    
                    <p className="text-lg text-fm-neutral-600 leading-relaxed" style={{ marginBottom: '2rem' }}>
                      {study.description}
                    </p>

                    {/* Enhanced Metrics with Glass Containers */}
                    <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
                      <div className="metrics-glass rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-fm-magenta-700 mb-2">
                          {study.metrics.primary}
                        </div>
                        <div className="text-sm text-fm-neutral-600 font-medium">
                          {study.metrics.primaryLabel}
                        </div>
                      </div>
                      <div className="metrics-glass rounded-2xl p-6 text-center">
                        <div className="text-3xl font-bold text-fm-magenta-700 mb-2">
                          {study.metrics.secondary}
                        </div>
                        <div className="text-sm text-fm-neutral-600 font-medium">
                          {study.metrics.secondaryLabel}
                        </div>
                      </div>
                    </div>

                    {/* Brand Tags */}
                    <div className="flex flex-wrap gap-3" style={{ marginBottom: '2.5rem' }}>
                      {study.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="tag-brand-gradient px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <LinkButton href="/work" variant="primary" size="lg" className="w-fit group shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105">
                      <span className="mr-2">View Full Case Study</span>
                      <ArrowRight className="w-5 h-5 inline-block transform transition-transform duration-300 group-hover:translate-x-1" />
                    </LinkButton>
                  </div>

                  {/* Premium Visual Side */}
                  <div className="visual-premium p-8 lg:p-12 flex items-center justify-center relative">
                    <div className="w-full h-64 lg:h-full rounded-2xl flex items-center justify-center relative overflow-hidden" 
                         style={{
                           background: `linear-gradient(135deg, 
                             rgba(179,41,104,0.15) 0%, 
                             rgba(255,107,53,0.1) 50%, 
                             rgba(110,24,69,0.15) 100%)`
                         }}>
                      <div className="text-center text-fm-magenta-700 relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
                          <TrendingUp className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-sm font-semibold">Premium Case Study</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Premium Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ marginBottom: '6rem' }}>
          {caseStudies
            .filter(study => !study.featured)
            .map((study, index) => (
              <div 
                key={study.id} 
                className={cn(
                  "casestudies-card-premium group rounded-2xl overflow-hidden casestudies-animate-fade-in-up",
                  "transform transition-all duration-500",
                  hoveredCard === study.id ? "z-20" : "z-10"
                )}
                style={{ animationDelay: `${(index + 1) * 150 + 400}ms` }}
                onMouseEnter={() => setHoveredCard(study.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Premium Visual */}
                <div className="visual-premium h-48 flex items-center justify-center relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-700 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="p-8">
                  <div className="text-fm-magenta-700 font-semibold text-sm mb-3 uppercase tracking-wide">
                    {study.client}
                  </div>
                  
                  <h3 className="text-xl font-bold text-fm-neutral-900 mb-4 group-hover:text-fm-magenta-700 transition-colors duration-300">
                    {study.title}
                  </h3>
                  
                  <p className="text-fm-neutral-600 text-sm leading-relaxed mb-6">
                    {study.description}
                  </p>

                  {/* Enhanced Metrics */}
                  <div className="metrics-glass flex justify-between items-center mb-6 p-4 rounded-xl">
                    <div className="text-center">
                      <div className="text-xl font-bold text-fm-magenta-700">
                        {study.metrics.primary}
                      </div>
                      <div className="text-xs text-fm-neutral-600 font-medium">
                        {study.metrics.primaryLabel}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-fm-magenta-200" />
                    <div className="text-center">
                      <div className="text-xl font-bold text-fm-magenta-700">
                        {study.metrics.secondary}
                      </div>
                      <div className="text-xs text-fm-neutral-600 font-medium">
                        {study.metrics.secondaryLabel}
                      </div>
                    </div>
                  </div>

                  {/* Brand Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {study.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="tag-brand-gradient px-3 py-1.5 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <LinkButton 
                    href="/work"
                    variant="ghost" 
                    size="sm" 
                    className="group/btn w-full justify-between text-fm-magenta-700 hover:bg-fm-magenta-50 hover:text-fm-magenta-800 border border-fm-magenta-200 hover:border-fm-magenta-300 transition-all duration-300"
                  >
                    <span className="font-medium">Read Case Study</span>
                    <ExternalLink className="w-4 h-4 transform transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </LinkButton>
                </div>
              </div>
            ))}
        </div>

        {/* Enhanced CTA Section - Matching Our Proven Process Style */}
        <div className="relative casestudies-animate-fade-in-up" style={{ marginTop: '4rem', animationDelay: '600ms' }}>
          {/* Subtle Magenta Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-fm-magenta-400/20 via-fm-magenta-300/10 to-fm-magenta-400/20 rounded-3xl blur-2xl opacity-60" />
          <div className="absolute -inset-2 bg-fm-magenta-500/10 rounded-3xl blur-xl" />
          
          {/* Glass Container with Enhanced Styling */}
          <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40" 
               style={{ padding: '4rem 2rem' }}>
            <div className="flex flex-col items-center justify-center text-center" 
                 style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h3 className="font-bold text-fm-neutral-900 text-center" 
                  style={{ 
                    marginBottom: '2rem',
                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                    lineHeight: '1.2',
                    maxWidth: '100%',
                    margin: '0 auto 2rem auto'
                  }}>
                Ready to Write Your Success Story?
              </h3>
              <div className="flex justify-center" style={{ marginBottom: '2.5rem' }}>
                <p className="text-lg text-fm-neutral-600 leading-relaxed text-center" 
                   style={{ maxWidth: '600px' }}>
                  Join the brands that trust Freaking Minds to deliver exceptional results. 
                  Let&apos;s discuss how we can accelerate your growth.
                </p>
              </div>
              <div className="flex justify-center">
                <LinkButton 
                  href="/contact"
                  variant="primary" 
                  size="lg" 
                  className="group shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                >
                  <span className="mr-2">Start Your Project</span>
                  <ArrowRight className="w-5 h-5 inline-block transform transition-transform duration-300 group-hover:translate-x-1" />
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
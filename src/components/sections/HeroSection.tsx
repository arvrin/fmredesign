'use client';

import React from 'react';
import { LinkButton } from '@/design-system';
import { ArrowRight, Play, Sparkles, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import './hero-animations.css';

const floatingIcons = [
  { Icon: Sparkles, position: 'top-20 left-20', delay: '0s' },
  { Icon: TrendingUp, position: 'top-32 right-32', delay: '1s' },
  { Icon: Users, position: 'bottom-32 left-32', delay: '2s' },
];

export function HeroSection() {

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-fm-neutral-50 to-fm-neutral-100 py-0"
    >
      {/* Premium Background Pattern with Smooth Continuous Flowing Gradient */}
      <div className="absolute inset-0 opacity-70 overflow-hidden">
        {/* Primary gradient - continuous smooth flow */}
        <div 
          className="absolute inset-0 gradient-flow-primary"
          style={{
            background: `radial-gradient(600px circle at 50% 50%, 
              rgba(179,41,104,0.5) 0%, 
              rgba(179,41,104,0.3) 25%,
              rgba(110,24,69,0.2) 50%,
              transparent 70%)`
          }}
        />
        
        {/* Secondary gradient - flows in different pattern for depth */}
        <div 
          className="absolute inset-0 opacity-60 gradient-flow-secondary"
          style={{
            background: `radial-gradient(800px circle at 50% 50%, 
              rgba(255,133,93,0.2) 0%,
              rgba(255,107,53,0.1) 40%,
              transparent 70%)`
          }}
        />
        
        {/* Tertiary gradient - subtle outer glow with its own flow */}
        <div 
          className="absolute inset-0 opacity-40 gradient-flow-tertiary"
          style={{
            background: `radial-gradient(1000px circle at 50% 50%, 
              rgba(179,41,104,0.3) 0%,
              transparent 60%)`
          }}
        />
        
        {/* Premium mesh gradient overlay */}
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(179,41,104,0.25),transparent_50%)]" />
        
        {/* Subtle noise texture for luxury feel */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Diagonal lines pattern - more subtle */}
        <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-[linear-gradient(45deg,transparent_48%,rgba(179,41,104,0.08)_49%,rgba(179,41,104,0.08)_51%,transparent_52%)] bg-[length:30px_30px]" />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, position, delay }, index) => (
        <div
          key={index}
          className={cn(
            'absolute w-16 h-16 text-fm-magenta-300 animate-pulse-slow hidden lg:block',
            position
          )}
          style={{ animationDelay: delay }}
        >
          <Icon className="w-full h-full opacity-30" />
        </div>
      ))}

      <div className="fm-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-fm-magenta-50 border border-fm-magenta-200 rounded-full text-fm-magenta-700 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2" />
            Leading Digital Marketing Agency in Bhopal
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-fm-neutral-900 animate-fade-in-up text-center max-w-4xl mx-auto" style={{ marginBottom: '3rem', lineHeight: '1.1' }}>
            We Don&apos;t Just Market,{' '}
            <span className="text-fm-magenta-700 relative inline-block">
              We Create
              <svg
                className="absolute -bottom-2 left-0 w-full h-4 text-fm-magenta-700"
                viewBox="0 0 200 12"
                fill="currentColor"
              >
                <path d="M2 8c40-6 80-6 120 0s80 6 120 0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>{' '}
            Movements
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-fm-neutral-600 max-w-4xl mx-auto animate-fade-in-up text-center" style={{ marginBottom: '3.5rem', lineHeight: '1.8' }}>
            Data-driven creative solutions that transform ambitious brands into market leaders. 
            We combine strategic thinking with creative excellence to deliver measurable results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ marginBottom: '5rem' }}>
            <LinkButton href="/contact" variant="primary" size="lg" className="group">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </LinkButton>
            <LinkButton href="/about" variant="ghost" size="lg" className="group">
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Watch Our Story
            </LinkButton>
          </div>

          {/* Social Proof */}
          <div className="animate-fade-in">
            <p className="text-sm text-fm-neutral-500 mb-8 text-center">
              Trusted by 250+ brands across India
            </p>
            
            {/* Stats Container */}
            <div className="bg-fm-magenta-50/80 backdrop-blur-sm border border-fm-magenta-200/60 rounded-xl shadow-fm-lg p-6 md:p-8 max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">
                    10+
                  </div>
                  <div className="text-sm text-fm-neutral-700 font-medium">
                    Years Experience
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">
                    250+
                  </div>
                  <div className="text-sm text-fm-neutral-700 font-medium">
                    Campaigns
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">
                    95%
                  </div>
                  <div className="text-sm text-fm-neutral-700 font-medium">
                    Client Satisfaction
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-fm-magenta-700 mb-1">
                    300%
                  </div>
                  <div className="text-sm text-fm-neutral-700 font-medium">
                    Avg. ROI Increase
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-fm-magenta-700 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-fm-magenta-700 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
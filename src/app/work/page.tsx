'use client';

import { ArrowRight, Award, Target } from "lucide-react";
import Link from "next/link";
import { V2PageWrapper } from "@/components/layouts/V2PageWrapper";

// Portfolio Sections
import { PortfolioGridSection } from "@/components/sections/PortfolioGridSection";
import { VideoPortfolioSection } from "@/components/sections/VideoPortfolioSection";

export default function WorkPage() {
  return (
    <V2PageWrapper>
      {/* Hero Section */}
      <section className="relative z-10 v2-section pt-32 lg:pt-40">
        <div className="v2-container v2-container-wide">
          <div className="max-w-4xl mx-auto" style={{ textAlign: 'center' }}>
            {/* Badge */}
            <div className="v2-badge v2-badge-glass mb-8">
              <Award className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">Real Results, Real Success Stories</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold v2-text-primary mb-8 leading-tight">
              Our Work Speaks{' '}
              <span className="v2-accent">Louder Than Words</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed" style={{ marginBottom: '48px' }}>
              Discover how we've transformed businesses across industries through innovative digital marketing strategies. Each case study represents real growth, real results, and real partnerships that drive success.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/get-started" className="v2-btn v2-btn-primary">
                Start Your Success Story
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="v2-btn v2-btn-secondary">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>

        {/* 3D Brain Decoration */}
        <div className="absolute right-8 lg:right-20 top-1/3 hidden lg:block z-10">
          <img
            src="/3dasset/brain-celebrating.png"
            alt="Celebrating Success"
            className="w-28 lg:w-36 h-auto animate-v2-hero-float drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
          />
        </div>
      </section>

      {/* Portfolio Grid - Real Work Samples */}
      <PortfolioGridSection />

      {/* Video Portfolio */}
      <VideoPortfolioSection />

      {/* CTA Section */}
      <section className="relative z-10 v2-section pb-32">
        <div className="v2-container v2-container-narrow">
          <div className="v2-paper rounded-3xl p-10 lg:p-14" style={{ textAlign: 'center' }}>
            <div className="v2-badge v2-badge-light mb-6">
              <Target className="w-4 h-4" />
              <span>Ready to Get Started?</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-fm-neutral-900 mb-6 leading-tight">
              Ready to Be Our Next <span className="text-fm-magenta-600">Success Story</span>?
            </h2>
            <p className="text-fm-neutral-600 mb-8 max-w-xl mx-auto">
              Join the growing list of businesses that have transformed their digital presence with our proven strategies.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/get-started" className="v2-btn v2-btn-magenta">
                Start Your Project
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="v2-btn v2-btn-outline">
                Schedule Discovery Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </V2PageWrapper>
  );
}

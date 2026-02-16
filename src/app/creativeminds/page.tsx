'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TalentApplication } from '@/lib/admin/talent-types';
import { TalentApplicationForm } from '@/components/public/TalentApplicationForm';
import { V2PageWrapper } from "@/components/layouts/V2PageWrapper";

import {
  Users,
  Star,
  Zap,
  Globe,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target
} from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: "Premium Projects",
    description: "Work with top brands and startups. Average project value: ₹25,000+",
    gradient: "v2-gradient-brand"
  },
  {
    icon: Zap,
    title: "Fast Payments",
    description: "Get paid within 7 days of project completion. No payment delays.",
    gradient: "v2-gradient-performance"
  },
  {
    icon: Users,
    title: "Curated Network",
    description: "Join an exclusive community of verified professionals. Quality over quantity.",
    gradient: "v2-gradient-social"
  },
  {
    icon: Globe,
    title: "Global Exposure",
    description: "Work with international clients and expand your portfolio globally.",
    gradient: "v2-gradient-content"
  },
  {
    icon: Award,
    title: "Skill Development",
    description: "Access to workshops, courses, and mentorship from industry experts.",
    gradient: "v2-gradient-seo"
  },
  {
    icon: Star,
    title: "Recognition",
    description: "Build your reputation with verified reviews and showcase your work.",
    gradient: "v2-gradient-deep"
  }
];

export default function CreativeMindsPage() {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleApplicationSubmit = async (application: TalentApplication) => {
    const response = await fetch('/api/talent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submit_application',
        application
      })
    });

    const result = await response.json();

    if (result.success) {
      setSubmitted(true);
      setShowApplicationForm(false);
    } else {
      throw new Error('Failed to submit application. Please try again.');
    }
  };

  if (showApplicationForm) {
    return (
      <TalentApplicationForm
        onSubmit={handleApplicationSubmit}
        onCancel={() => setShowApplicationForm(false)}
      />
    );
  }

  if (submitted) {
    return (
      <V2PageWrapper>
        <section className="relative z-10 min-h-screen flex items-center justify-center v2-section">
          <div className="v2-container">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-fm-neutral-900 mb-4">
                Application Submitted Successfully!
              </h1>

              <p className="text-lg text-fm-neutral-600 mb-8">
                Thank you for joining the CreativeMinds network. Our team will review your application
                and get back to you within 48 hours.
              </p>

              <div className="bg-fm-magenta-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 text-fm-neutral-900">What happens next?</h3>
                <div className="space-y-3 text-left">
                  {[
                    { step: 1, text: "Application review (24-48 hours)" },
                    { step: 2, text: "Portfolio verification" },
                    { step: 3, text: "Welcome to the network & first project opportunities" }
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-fm-magenta-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-fm-magenta-600">{item.step}</span>
                      </div>
                      <span className="text-sm text-fm-neutral-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/"
                className="v2-btn v2-btn-magenta"
              >
                Visit Freaking Minds
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </V2PageWrapper>
    );
  }

  return (
    <V2PageWrapper>
      {/* Hero Section */}
      <section className="relative z-10 v2-section pt-32 lg:pt-40">
        <div className="v2-container v2-container-wide">
          <div className="max-w-4xl mx-auto" style={{ textAlign: 'center' }}>
            {/* Badge */}
            <div className="v2-badge v2-badge-glass mb-8">
              <Sparkles className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">Join the Premium Creative Talent Network</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold v2-text-primary mb-8 leading-tight">
              The{' '}
              <span className="v2-accent">CreativeMinds</span>{' '}Network
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed" style={{ marginBottom: '48px' }}>
              Connect with premium brands, earn consistently, and grow your career with a trusted creative talent network serving clients worldwide. Join a curated community of verified professionals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowApplicationForm(true)}
                className="group v2-btn v2-btn-primary"
              >
                Apply to Join Network
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link href="#benefits" className="v2-btn v2-btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Brain Decoration */}
        <div className="absolute left-8 lg:left-24 top-1/3 hidden lg:block" style={{ zIndex: 10 }}>
          <img
            src="/3dasset/brain-celebrating.png"
            alt="Success"
            className="h-auto animate-v2-hero-float"
            style={{
              width: 'min(180px, 30vw)',
              filter: 'drop-shadow(0 20px 40px rgba(140,25,60,0.2))',
            }}
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 v2-section v2-texture-dots">
        <div className="v2-container">
          <div className="max-w-3xl mx-auto" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="v2-badge v2-badge-glass mb-6">
              <Target className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">Why Join Us</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold v2-text-primary mb-8 leading-tight">
              Why Join <span className="v2-accent">CreativeMinds</span>?
            </h2>
            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed">
              We're not just another freelance platform. We're a premium network
              that values quality over quantity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="v2-paper rounded-2xl p-8 hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-14 h-14 ${benefit.gradient} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-fm-neutral-900 mb-3">{benefit.title}</h3>
                  <p className="text-fm-neutral-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 v2-section pb-32">
        <div className="v2-container v2-container-narrow">
          <div className="v2-paper rounded-3xl p-10 lg:p-14" style={{ textAlign: 'center' }}>
            <div className="v2-badge v2-badge-light mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Transform Your Career</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-fm-neutral-900 mb-6 leading-tight">
              Ready to Transform Your <span className="text-fm-magenta-600">Career</span>?
            </h2>
            <p className="text-fm-neutral-600 mb-8 max-w-xl mx-auto">
              Join CreativeMinds today and connect with premium brands looking for
              talented professionals like you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowApplicationForm(true)}
                className="group v2-btn v2-btn-magenta"
              >
                Start Your Application
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link href="/" className="v2-btn v2-btn-outline">
                Learn More About FM
              </Link>
            </div>
            <p className="text-fm-neutral-400 text-sm mt-8">
              Application review time: 24-48 hours • No application fee • Premium network
            </p>
          </div>
        </div>
      </section>
    </V2PageWrapper>
  );
}

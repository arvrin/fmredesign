'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin, Sparkles, Zap, Heart } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from '@/components/animations/Card3D';
import { GradientOrb, FloatingElement } from '@/components/animations/ParallaxLayer';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const quickFacts = [
  { icon: Zap, text: "Response within 24 hours" },
  { icon: Heart, text: "Clients love working with us" },
  { icon: Sparkles, text: "No obligations, just ideas" },
];

export function ContactSectionV2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const contactBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Content slide-in animation
      if (contentRef.current) {
        const badge = contentRef.current.querySelector('.contact-badge');
        const heading = contentRef.current.querySelector('h2');
        const subtitle = contentRef.current.querySelector('.subtitle');
        const ctaButtons = contentRef.current.querySelectorAll('.cta-btn');
        const quickFactItems = contentRef.current.querySelectorAll('.quick-fact');

        // Create a timeline for sequenced animations
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.from(badge, {
          x: -60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
        .from(heading, {
          x: -80,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        }, '-=0.5')
        .from(subtitle, {
          x: -60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        }, '-=0.5')
        .from(ctaButtons, {
          y: 40,
          opacity: 0,
          scale: 0.9,
          duration: 0.7,
          stagger: 0.15,
          ease: 'back.out(1.5)',
        }, '-=0.4')
        .from(quickFactItems, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }, '-=0.3');
      }

      // Mascot with 3D entrance
      if (mascotRef.current) {
        gsap.from(mascotRef.current, {
          x: 100,
          opacity: 0,
          scale: 0.8,
          rotation: 10,
          duration: 1.2,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: mascotRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        // Continuous floating animation
        gsap.to(mascotRef.current, {
          y: -20,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Contact bar with staggered icons
      if (contactBarRef.current) {
        const contactItems = contactBarRef.current.querySelectorAll('.contact-item');
        const icons = contactBarRef.current.querySelectorAll('.contact-icon');

        gsap.from(contactBarRef.current, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contactBarRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });

        // Icons with bounce
        gsap.from(icons, {
          scale: 0,
          rotation: -180,
          duration: 0.7,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: contactBarRef.current,
            start: 'top 85%',
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
      className="relative overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Ambient Gradient Orbs */}
      <GradientOrb
        color="rgba(201, 50, 93, 0.2)"
        size={700}
        blur={100}
        position={{ top: '-300px', right: '-200px' }}
        drift={30}
      />
      <GradientOrb
        color="rgba(160, 30, 70, 0.15)"
        size={500}
        blur={80}
        position={{ bottom: '-150px', left: '-100px' }}
        drift={20}
      />

      {/* Content */}
      <div
        className="relative z-10 v2-section"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="v2-container">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left: Content */}
            <div ref={contentRef}>
              {/* Badge */}
              <div className="contact-badge v2-badge v2-badge-glass mb-8">
                <Sparkles className="w-4 h-4 v2-text-primary" />
                <span className="v2-text-primary">
                  Ready to Transform Your Brand?
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold v2-text-primary mb-6 leading-tight">
                Let's Create{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">Magic</span>
                  <span className="absolute inset-0 bg-white/20 -skew-y-2 rounded-lg -z-0" />
                </span>{' '}
                Together
              </h2>

              <p className="subtitle text-lg md:text-xl v2-text-secondary mb-10 leading-relaxed">
                Whether you're launching a startup or scaling an enterprise,
                we're here to make your brand unforgettable. No pressure, just possibilities.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <MagneticButton
                  as="a"
                  href="/get-started"
                  strength={0.3}
                  className="cta-btn v2-btn v2-btn-primary group"
                >
                  Start Your Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href="tel:+919833257659"
                  strength={0.25}
                  className="cta-btn v2-btn v2-btn-secondary"
                >
                  <Phone className="w-5 h-5" />
                  Call Us Now
                </MagneticButton>
              </div>

              {/* Quick Facts */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6">
                {quickFacts.map((fact) => {
                  const Icon = fact.icon;
                  return (
                    <div key={fact.text} className="quick-fact flex items-center gap-2 v2-text-secondary">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{fact.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Large Mascot */}
            <div
              ref={mascotRef}
              className="relative flex items-center justify-center"
            >
              {/* Glow Effect Behind Mascot */}
              <div
                className="absolute w-[400px] h-[400px] rounded-full opacity-40"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              {/* Main Mascot */}
              <FloatingElement amplitude={15} duration={4}>
                <img
                  src="/3dasset/brain-support.png"
                  alt="We're Here to Help"
                  loading="lazy"
                  className="relative w-48 sm:w-64 md:w-80 lg:w-[420px] max-w-full drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.4))',
                  }}
                />
              </FloatingElement>
            </div>
          </div>

          {/* Contact Info Bar */}
          <div
            ref={contactBarRef}
            className="mt-20 v2-paper rounded-2xl p-6"
          >
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-center sm:text-left">
              {/* Email */}
              <div className="contact-item flex items-center justify-center md:justify-start gap-3 group">
                <div className="contact-icon w-10 h-10 rounded-full bg-fm-magenta-50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-fm-magenta-100">
                  <Mail className="w-5 h-5 text-fm-magenta-600" />
                </div>
                <div>
                  <div className="text-fm-neutral-400 text-xs uppercase tracking-wide">Email</div>
                  <a href="mailto:hello@freakingminds.in" className="text-fm-neutral-900 font-medium hover:text-fm-magenta-600 transition-colors">
                    hello@freakingminds.in
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="contact-item flex items-center justify-center md:justify-start gap-3 group">
                <div className="contact-icon w-10 h-10 rounded-full bg-fm-magenta-50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-fm-magenta-100">
                  <Phone className="w-5 h-5 text-fm-magenta-600" />
                </div>
                <div>
                  <div className="text-fm-neutral-400 text-xs uppercase tracking-wide">Phone</div>
                  <a href="tel:+919833257659" className="text-fm-neutral-900 font-medium hover:text-fm-magenta-600 transition-colors">
                    +91 98332 57659
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="contact-item flex items-center justify-center md:justify-start gap-3 group">
                <div className="contact-icon w-10 h-10 rounded-full bg-fm-magenta-50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-fm-magenta-100">
                  <MapPin className="w-5 h-5 text-fm-magenta-600" />
                </div>
                <div>
                  <div className="text-fm-neutral-400 text-xs uppercase tracking-wide">Location</div>
                  <span className="text-fm-neutral-900 font-medium">Bhopal, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

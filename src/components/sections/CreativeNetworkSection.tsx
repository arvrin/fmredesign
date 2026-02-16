'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, Star, CheckCircle, Sparkles, Palette, Camera, Video, PenTool, Megaphone } from 'lucide-react';

const capabilities = [
  { name: 'UI/UX Design', icon: Palette },
  { name: 'Video Production', icon: Video },
  { name: 'Content Strategy', icon: PenTool },
  { name: 'Motion Graphics', icon: Sparkles },
  { name: 'Photography', icon: Camera },
  { name: 'Social Media', icon: Megaphone },
];

export function CreativeNetworkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    <section ref={sectionRef} className="relative bg-white py-24 lg:py-32 overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle at bottom left, #a82548 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Geometric pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="networkPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="#a82548" />
              <path d="M 0 30 H 60 M 30 0 V 60" fill="none" stroke="#a82548" strokeWidth="0.5" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#networkPattern)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left column - Visual illustration */}
          <div
            className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            {/* Main illustration card */}
            <div className="relative bg-gradient-to-br from-fm-magenta-500 to-fm-magenta-700 rounded-3xl p-8 lg:p-12">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10 rounded-3xl overflow-hidden">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="networkDotsPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                      <circle cx="15" cy="15" r="2" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#networkDotsPattern)" />
                </svg>
              </div>

              {/* Network illustration */}
              <div className="relative">
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  {/* Connection lines */}
                  <line x1="200" y1="150" x2="80" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="200" y1="150" x2="320" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="200" y1="150" x2="80" y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="200" y1="150" x2="320" y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="200" y1="150" x2="200" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="200" y1="150" x2="200" y2="260" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="5,5" />

                  {/* Center node */}
                  <circle cx="200" cy="150" r="40" fill="white" />
                  <text x="200" y="155" textAnchor="middle" fill="#a82548" fontSize="14" fontWeight="600">FM</text>

                  {/* Outer nodes */}
                  <circle cx="80" cy="80" r="25" fill="rgba(255,255,255,0.9)" />
                  <circle cx="320" cy="80" r="25" fill="rgba(255,255,255,0.9)" />
                  <circle cx="80" cy="220" r="25" fill="rgba(255,255,255,0.9)" />
                  <circle cx="320" cy="220" r="25" fill="rgba(255,255,255,0.9)" />
                  <circle cx="200" cy="40" r="20" fill="rgba(255,255,255,0.8)" />
                  <circle cx="200" cy="260" r="20" fill="rgba(255,255,255,0.8)" />
                </svg>
              </div>

              {/* Stats badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fm-magenta-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-fm-magenta-600" />
                  </div>
                  <div>
                    <div className="text-xs text-fm-neutral-500">Network</div>
                    <div className="text-lg font-bold text-fm-neutral-900">150+</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fm-magenta-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-fm-magenta-600" />
                  </div>
                  <div>
                    <div className="text-xs text-fm-neutral-500">Satisfaction</div>
                    <div className="text-lg font-bold text-fm-neutral-900">95%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Content */}
          <div>
            <span
              className={`inline-flex items-center gap-2 text-sm font-semibold text-fm-magenta-600 mb-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="w-8 h-[2px] bg-fm-magenta-600" />
              CreativeMinds Network
            </span>

            <h2
              className={`text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-fm-neutral-900 mb-6 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ fontFamily: 'var(--font-display)', transitionDelay: '100ms' }}
            >
              Access India's{' '}
              <span className="text-fm-magenta-600">finest</span> creative talent.
            </h2>

            <p
              className={`text-lg text-fm-neutral-600 leading-relaxed mb-8 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              Our curated network of 150+ vetted professionals brings specialized expertise to every project. From strategy to execution, we connect you with the right talent at the right time.
            </p>

            {/* Capabilities grid */}
            <div
              className={`grid grid-cols-2 gap-4 mb-8 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              {capabilities.map((cap, index) => {
                const IconComponent = cap.icon;
                return (
                  <div
                    key={cap.name}
                    className="flex items-center gap-3 bg-fm-neutral-50 rounded-xl p-4 border border-fm-neutral-100 hover:border-fm-magenta-200 hover:bg-fm-magenta-50/50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-fm-magenta-100 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-fm-magenta-600" />
                    </div>
                    <span className="text-sm font-medium text-fm-neutral-700">{cap.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Benefits */}
            <div
              className={`space-y-3 mb-8 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              {['Vetted professionals', 'Flexible engagement', 'Quality guaranteed'].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-fm-magenta-600" />
                  <span className="text-fm-neutral-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className={`flex flex-wrap items-center gap-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <Link
                href="/creativeminds"
                className="v2-btn v2-btn-magenta group"
              >
                <span>Explore Network</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/creativeminds#apply"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-fm-magenta-600 hover:text-fm-magenta-700 transition-colors duration-300"
              >
                <span>Join as Creator</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div
          className={`mt-20 bg-fm-neutral-50 rounded-2xl p-8 lg:p-12 border border-fm-neutral-100 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 text-fm-magenta-500 fill-fm-magenta-500" />
              ))}
            </div>
            <blockquote
              className="text-xl lg:text-2xl text-fm-neutral-800 leading-relaxed mb-6"
              style={{ fontFamily: 'var(--font-accent)' }}
            >
              "The quality of talent and seamless collaboration transformed our brand's creative output. FreakingMinds delivered beyond expectations."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-fm-magenta-200 flex items-center justify-center">
                <span className="text-fm-magenta-700 font-bold">SK</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-fm-neutral-900">Sanjay Kumar</div>
                <div className="text-sm text-fm-neutral-500">Creative Director, TechStart Inc.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

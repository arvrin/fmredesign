'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

export function ContactSectionV3() {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

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

  // Magnetic button effect
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setButtonPosition({ x: x * 0.2, y: y * 0.2 });
  };

  const handleMouseLeave = () => {
    setButtonPosition({ x: 0, y: 0 });
    setIsHovering(false);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-44 bg-fm-cream overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large decorative text */}
        <div
          className={`
            absolute -bottom-20 -left-10 select-none
            text-[25vw] font-bold leading-none tracking-tighter
            text-fm-neutral-100 opacity-50
            transition-all duration-1000
            ${isVisible ? 'translate-y-0 opacity-50' : 'translate-y-20 opacity-0'}
          `}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          HELLO
        </div>

        {/* Accent gradient */}
        <div
          className="absolute top-1/2 right-0 w-1/2 h-full -translate-y-1/2 opacity-[0.04]"
          style={{
            background: 'radial-gradient(ellipse at 80% 50%, #c9325d 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div
              className={`
                flex items-center gap-4 mb-8
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
                Let's Work Together
              </p>
            </div>

            {/* Main Headline */}
            <h2
              className={`
                text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-fm-ink leading-[1.1] mb-8
                transition-all duration-700 delay-100
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ready to grow?<br />
              <span className="text-fm-neutral-400">Let's talk.</span>
            </h2>

            {/* Subtext */}
            <p
              className={`
                text-lg md:text-xl text-fm-neutral-600 max-w-xl mb-12 leading-relaxed
                transition-all duration-700 delay-200
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              Whether you're launching a startup or scaling an enterprise,
              we're here to make your brand unforgettable.
            </p>

            {/* CTA - Magnetic Button */}
            <div
              className={`
                mb-16
                transition-all duration-700 delay-300
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              <Link
                ref={buttonRef}
                href="/get-started"
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-fm-magenta-600 text-white font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-fm-magenta-600/30"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
                }}
              >
                <span className="relative z-10">Start a Project</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                {/* Hover fill effect */}
                <div
                  className={`
                    absolute inset-0 bg-fm-ink
                    transition-transform duration-500 ease-out origin-left
                    ${isHovering ? 'scale-x-100' : 'scale-x-0'}
                  `}
                />
              </Link>
            </div>
          </div>

          {/* Right: Contact Info Card */}
          <div
            className={`
              lg:col-span-5
              transition-all duration-700 delay-400
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-fm-neutral-200/50 border border-fm-neutral-100">
              <h3 className="text-xl font-bold text-fm-ink mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                Get in Touch
              </h3>

              <div className="space-y-6">
                <a
                  href="mailto:hello@freakingminds.in"
                  className="group flex items-start gap-4 p-4 -m-4 rounded-xl hover:bg-fm-neutral-50 transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-fm-magenta-50 flex items-center justify-center flex-shrink-0 group-hover:bg-fm-magenta-100 transition-colors">
                    <Mail className="w-5 h-5 text-fm-magenta-600" />
                  </div>
                  <div>
                    <p className="text-sm text-fm-neutral-500 mb-1">Email us</p>
                    <p className="text-fm-ink font-semibold group-hover:text-fm-magenta-600 transition-colors">
                      hello@freakingminds.in
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+919833257659"
                  className="group flex items-start gap-4 p-4 -m-4 rounded-xl hover:bg-fm-neutral-50 transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-fm-magenta-50 flex items-center justify-center flex-shrink-0 group-hover:bg-fm-magenta-100 transition-colors">
                    <Phone className="w-5 h-5 text-fm-magenta-600" />
                  </div>
                  <div>
                    <p className="text-sm text-fm-neutral-500 mb-1">Call us</p>
                    <p className="text-fm-ink font-semibold group-hover:text-fm-magenta-600 transition-colors">
                      +91 98332 57659
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 -m-4">
                  <div className="w-12 h-12 rounded-xl bg-fm-neutral-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-fm-neutral-400" />
                  </div>
                  <div>
                    <p className="text-sm text-fm-neutral-500 mb-1">Visit us</p>
                    <p className="text-fm-neutral-700 font-medium">
                      Bhopal, Madhya Pradesh, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="mt-10 pt-8 border-t border-fm-neutral-100">
                <p className="text-sm text-fm-neutral-500 mb-4">Response time</p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['RS', 'PP', 'AV'].map((initials, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-fm-magenta-400 to-fm-magenta-600 flex items-center justify-center border-2 border-white"
                      >
                        <span className="text-white text-xs font-bold">{initials}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-fm-ink font-semibold">Within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

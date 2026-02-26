'use client';

import React, { useEffect, useRef, useState } from 'react';

// Client logos from the migrated assets
const clientLogos = [
  'Asset-5.png', 'Asset-6.png', 'Asset-7.png', 'Asset-8.png', 'Asset-9.png',
  'Asset-10.png', 'Asset-11.png', 'Asset-12.png', 'Asset-13.png', 'Asset-14.png',
  'Asset-15.png', 'Asset-16.png', 'Asset-17.png', 'Asset-18.png', 'Asset-19.png',
  'Asset-20.png', 'Asset-21.png', 'Asset-22.png', 'Asset-23.png', 'Asset-24.png',
  'Asset-25.png', 'Asset-26.png', 'Asset-27.png', 'Asset-28.png', 'Asset-29.png',
  'Asset-30.png', 'Asset-31.png', 'Asset-32.png', 'Asset-33.png', 'Asset-34.png',
  'Asset-35.png', 'Asset-36.png', 'Asset-37.png', 'Asset-38.png', 'Asset-39.png',
  'Asset-40.png',
];

export function ClientsSection() {
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

  // Double the logos for seamless loop
  const doubledLogos = [...clientLogos, ...clientLogos];
  const reversedDoubledLogos = [...clientLogos.slice().reverse(), ...clientLogos.slice().reverse()];

  return (
    <section ref={sectionRef} className="relative bg-fm-neutral-50 py-20 lg:py-28 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="clientsPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#a82548" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#clientsPattern)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Section header */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-fm-magenta-600 mb-4">
            <span className="w-8 h-[2px] bg-fm-magenta-600" />
            Trusted Partners
            <span className="w-8 h-[2px] bg-fm-magenta-600" />
          </span>

          <h2
            className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.2] tracking-[-0.02em] text-fm-neutral-900"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            250+ Brands Trust Us
          </h2>
        </div>
      </div>

      {/* Infinite Marquee - Full width, outside container */}
      <div
        className={`relative transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        {/* First row */}
        <div className="marquee-container mb-8">
          <div className="marquee-track">
            {doubledLogos.map((logo, index) => (
              <div
                key={`row1-${index}`}
                className="marquee-item"
              >
                <img
                  src={`/clients/${logo}`}
                  alt="Client logo"
                  role="presentation"
                  className="max-w-full max-h-full object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Second row - reverse direction */}
        <div className="marquee-container">
          <div className="marquee-track-reverse">
            {reversedDoubledLogos.map((logo, index) => (
              <div
                key={`row2-${index}`}
                className="marquee-item"
              >
                <img
                  src={`/clients/${logo}`}
                  alt="Client logo"
                  role="presentation"
                  className="max-w-full max-h-full object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div
          className={`text-center mt-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <p className="text-fm-neutral-500 text-sm">
            From startups to established enterprises, we've helped brands across industries achieve their digital goals.
          </p>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: scroll-left 160s linear infinite;
        }

        .marquee-track-reverse {
          display: flex;
          width: max-content;
          animation: scroll-right 160s linear infinite;
        }

        .marquee-item {
          flex-shrink: 0;
          width: 120px;
          height: 70px;
          margin-right: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        @media (min-width: 768px) {
          .marquee-item {
            width: 140px;
            height: 80px;
            margin-right: 32px;
          }
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .marquee-container:hover .marquee-track,
        .marquee-container:hover .marquee-track-reverse {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

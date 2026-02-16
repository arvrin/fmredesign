'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Search, Megaphone, Palette, BarChart3, ArrowRight, ChevronDown, Check } from 'lucide-react';
import { useCountUp, parseMetric } from '@/hooks/useCountUp';
import { MagneticButton } from '@/components/animations/Card3D';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Extended content for expandable details
const extendedContent: Record<number, string[]> = {
  0: ['Technical SEO audits', 'Content optimization', 'Link building strategies', 'Local SEO targeting'],
  1: ['Platform-specific strategies', 'Content calendars', 'Analytics dashboards', 'Influencer outreach'],
  2: ['A/B testing', 'Conversion tracking', 'Budget optimization', 'Remarketing campaigns'],
  3: ['Logo design', 'Brand guidelines', 'Marketing collateral', 'Digital asset creation'],
};

// Feature-specific shadow colors
const shadowColors: Record<string, string> = {
  'v2-gradient-seo': 'rgba(255, 127, 80, 0.3)',
  'v2-gradient-social': 'rgba(201, 50, 93, 0.3)',
  'v2-gradient-performance': 'rgba(168, 37, 72, 0.3)',
  'v2-gradient-brand': 'rgba(201, 50, 93, 0.3)',
};

const features = [
  {
    icon: Search,
    title: 'Get Found Where It Matters',
    tagline: 'SEO That Actually Works',
    description:
      "Dominate search results with data-driven SEO strategies. We don't just chase rankings—we build sustainable organic growth that puts you in front of customers actively looking for you.",
    highlights: ['First-page rankings', '300% avg traffic growth', 'Quality lead generation'],
    mascot: '/3dasset/brain-strategy.png',
    mascotAlt: 'Brain mascot character analyzing strategy charts',
    gradientClass: 'v2-gradient-seo',
    accentClass: 'text-fm-orange-400',
    ctaLink: '/services#seo',
    bgColor: '#1a0f24',
  },
  {
    icon: Megaphone,
    title: 'Stop Posting. Start Connecting.',
    tagline: 'Social Media That Converts',
    description:
      "Build engaged communities with thumb-stopping content that turns followers into customers. We create social strategies that don't just get likes—they get results.",
    highlights: ['Community building', '200% engagement boost', 'Influencer partnerships'],
    mascot: '/3dasset/brain-creative.png',
    mascotAlt: 'Creative brain mascot with artistic tools',
    gradientClass: 'v2-gradient-social',
    accentClass: 'text-fm-magenta-400',
    ctaLink: '/services#social',
    bgColor: '#2d1a3d',
  },
  {
    icon: BarChart3,
    title: 'Every Rupee. Maximum Impact.',
    tagline: 'Performance Marketing',
    description:
      'Laser-focused PPC campaigns that deliver qualified leads while maximizing your ROI. We obsess over your metrics so you can obsess over your business.',
    highlights: ['300% ROAS achieved', 'Cost optimization', 'Real-time analytics'],
    mascot: '/3dasset/brain-teaching.png',
    mascotAlt: 'Brain mascot presenting performance data',
    gradientClass: 'v2-gradient-performance',
    accentClass: 'text-fm-magenta-400',
    ctaLink: '/services#performance',
    bgColor: '#3d2249',
  },
  {
    icon: Palette,
    title: 'Look Unforgettable',
    tagline: 'Brand Identity Design',
    description:
      "Visual identities that capture attention, build trust, and make competitors jealous. Your brand deserves to be remembered—let's make that happen.",
    highlights: ['180% brand recall', 'Complete visual systems', 'Lasting impressions'],
    mascot: '/3dasset/brain-celebrating.png',
    mascotAlt: 'Celebrating brain mascot with design elements',
    gradientClass: 'v2-gradient-brand',
    accentClass: 'text-fm-magenta-400',
    ctaLink: '/services#branding',
    bgColor: '#2a1735',
  },
];

// Check if highlight contains a metric (number)
const isMetricHighlight = (text: string): boolean => {
  return /\d+%|\d+x/i.test(text);
};

// Animated metric component
function AnimatedMetric({ text, isVisible }: { text: string; isVisible: boolean; index: number }) {
  const parsed = parseMetric(text);
  const count = useCountUp(parsed?.number || 0, 2000, true, isVisible);

  if (!parsed) return <span>{text}</span>;

  return (
    <span className="font-bold bg-gradient-to-r from-fm-orange-300 via-fm-orange-400 to-fm-magenta-400 bg-clip-text text-transparent">
      {count}{parsed.suffix} {parsed.rest}
    </span>
  );
}

export function FeaturesSectionV2() {
  const [activeCard, setActiveCard] = useState(0);
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([0]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [clickedMascot, setClickedMascot] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [cardOffsets, setCardOffsets] = useState<number[]>(features.map((_, i) => i === 0 ? 0 : 100));

  const containerRef = useRef<HTMLDivElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Position state: 'before' | 'during' | 'after'
  const [sectionState, setSectionState] = useState<'before' | 'during' | 'after'>('before');

  // Main scroll handler for stacking effect
  useEffect(() => {
    if (isMobile || prefersReducedMotion || !containerRef.current) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerHeight = container.offsetHeight;

      // Calculate scroll progress through the section
      // scrollProgress = 0 when top of container hits top of viewport
      // scrollProgress = containerHeight - windowHeight when bottom of container hits bottom of viewport
      const scrollProgress = -rect.top;
      const maxScroll = containerHeight - windowHeight;

      // Determine section state
      if (scrollProgress < 0) {
        // Haven't reached the section yet
        setSectionState('before');
        setCardOffsets(features.map((_, i) => i === 0 ? 0 : 100));
        return;
      } else if (scrollProgress > maxScroll) {
        // Scrolled past the section
        setSectionState('after');
        setCardOffsets(features.map(() => 0)); // All cards visible
        return;
      }

      // We're IN the section
      setSectionState('during');

      // Divide scroll distance among cards (excluding first card which is always visible)
      const scrollPerCard = maxScroll / (features.length - 1);

      // Calculate card offsets
      const newOffsets = features.map((_, index) => {
        if (index === 0) return 0; // First card always at 0

        const cardScrollStart = (index - 1) * scrollPerCard;
        const cardScrollEnd = index * scrollPerCard;

        if (scrollProgress <= cardScrollStart) {
          return 100; // Card is below viewport
        } else if (scrollProgress >= cardScrollEnd) {
          return 0; // Card is fully in view
        } else {
          // Card is animating
          const progress = (scrollProgress - cardScrollStart) / scrollPerCard;
          return Math.round((1 - progress) * 100);
        }
      });

      setCardOffsets(newOffsets);

      // Track visible features for animations
      const currentCard = Math.min(features.length - 1, Math.floor(scrollProgress / scrollPerCard) + 1);
      setActiveCard(currentCard);
      if (!visibleFeatures.includes(currentCard)) {
        setVisibleFeatures(prev => [...prev, currentCard]);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, prefersReducedMotion, visibleFeatures]);

  // Handle mascot click animation
  const handleMascotClick = useCallback((index: number) => {
    if (prefersReducedMotion) return;
    setClickedMascot(index);
    setTimeout(() => setClickedMascot(null), 500);
  }, [prefersReducedMotion]);

  // Handle image load
  const handleImageLoad = useCallback((index: number) => {
    setImagesLoaded(prev => new Set(prev).add(index));
  }, []);

  // GSAP entrance animation for mobile cards
  useEffect(() => {
    if (!isMobile || prefersReducedMotion || !mobileSectionRef.current) return;

    const section = mobileSectionRef.current;
    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll('.feature-card-mobile'), {
        x: 40, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: {
          trigger: section.querySelector('.mobile-scroll-track'),
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion]);

  // Mobile Layout - Horizontal scroll cards
  if (isMobile || prefersReducedMotion) {
    return (
      <section ref={mobileSectionRef} className="relative z-10 py-16 md:py-24" aria-labelledby="features-heading">
        <div className="v2-container mb-10">
          <div className="max-w-3xl mx-auto" style={{ textAlign: 'center' }}>
            <h2 id="features-heading" className="font-display text-3xl md:text-4xl font-bold v2-text-primary mb-4 leading-tight">
              How We <span className="v2-accent">Make It Happen</span>
            </h2>
            <p className="text-base v2-text-secondary leading-relaxed">
              Every service is designed to deliver real, measurable impact for your business.
            </p>
          </div>
        </div>

        <div className="pb-20 mobile-scroll-track">
          <div
            className="flex gap-5 overflow-x-auto hide-scrollbar pb-4"
            style={{
              paddingLeft: 'max(1rem, calc((100vw - 1280px) / 2 + 1.5rem))',
              paddingRight: '1.5rem',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const shadowColor = shadowColors[feature.gradientClass] || 'rgba(0,0,0,0.4)';

              return (
                <article
                  key={feature.title}
                  className="feature-card-mobile flex-shrink-0 relative rounded-2xl border border-white/10 overflow-hidden flex flex-col"
                  style={{
                    width: 'min(320px, 85vw)',
                    scrollSnapAlign: 'start',
                    backgroundColor: feature.bgColor,
                  }}
                >
                  {/* Brain mascot */}
                  <div className="relative flex justify-center pt-6 pb-2">
                    <div
                      className={`absolute w-36 h-36 rounded-full opacity-40 ${feature.gradientClass}`}
                      style={{ filter: 'blur(40px)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    />
                    <Image
                      src={feature.mascot}
                      alt={feature.mascotAlt}
                      width={200}
                      height={200}
                      className="relative w-44"
                      style={{
                        filter: `drop-shadow(0 20px 40px ${shadowColor})`,
                        animation: prefersReducedMotion ? 'none' : 'featureFloat 6s ease-in-out infinite',
                        animationDelay: `${index * 0.5}s`,
                      }}
                      loading="lazy"
                    />
                  </div>

                  {/* Card content */}
                  <div className="px-5 pb-6 flex flex-col flex-1">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/15 self-start" style={{ marginBottom: '10px' }}>
                      <div className={`w-5 h-5 rounded ${feature.gradientClass} flex items-center justify-center`}>
                        <Icon className={`w-3 h-3 ${feature.accentClass}`} />
                      </div>
                      <span className="v2-text-secondary text-xs font-medium">{feature.tagline}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl font-bold v2-text-primary leading-tight" style={{ marginBottom: '8px' }}>
                      {feature.title}
                    </h3>

                    {/* Description - 3 line clamp */}
                    <p className="text-sm v2-text-tertiary leading-relaxed line-clamp-3" style={{ marginBottom: '12px' }}>
                      {feature.description}
                    </p>

                    {/* Highlight pills */}
                    <div className="flex flex-wrap gap-2" style={{ marginBottom: '16px' }}>
                      {feature.highlights.map((highlight) => (
                        <div key={highlight} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium v2-text-primary">
                          {highlight}
                        </div>
                      ))}
                    </div>

                    {/* CTA button - pushed to bottom */}
                    <div className="mt-auto">
                      <MagneticButton
                        as="a"
                        href={feature.ctaLink}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-fm-neutral-900 font-semibold rounded-full hover:bg-white/90 transition-colors group text-sm"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </MagneticButton>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Desktop Layout - Stacking Cards with JS-controlled transforms
  return (
    <section className="relative z-10" aria-labelledby="features-heading">
      {/* Section Header */}
      <div className="v2-container py-20 lg:py-28">
        <div className="max-w-3xl mx-auto" style={{ textAlign: 'center' }}>
          <h2 id="features-heading" className="font-display text-4xl md:text-5xl lg:text-6xl font-bold v2-text-primary mb-6 leading-tight">
            How We <span className="v2-accent">Make It Happen</span>
          </h2>
          <p className="text-lg md:text-xl v2-text-secondary leading-relaxed">
            Every service is designed to deliver real, measurable impact for your business.
          </p>
        </div>
      </div>

      {/* Stacking Cards Container */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${features.length * 100}vh` }}
      >
        {/* Cards viewport - fixed during scroll, absolute at start/end */}
        <div
          className="w-full h-screen overflow-hidden"
          style={{
            position: sectionState === 'during' ? 'fixed' : 'absolute',
            top: sectionState === 'after' ? 'auto' : 0,
            bottom: sectionState === 'after' ? 0 : 'auto',
            left: 0,
            right: 0,
            zIndex: 20,
          }}
        >
          {features.map((feature, index) => {
            const isVisible = visibleFeatures.includes(index);
            const isEven = index % 2 === 0;
            const Icon = feature.icon;
            const shadowColor = shadowColors[feature.gradientClass] || 'rgba(0,0,0,0.4)';
            const offset = cardOffsets[index];

            return (
              <div
                key={feature.title}
                className="absolute inset-x-4 md:inset-x-8 lg:inset-x-16 top-8 bottom-8 rounded-3xl lg:rounded-[2.5rem] overflow-hidden"
                style={{
                  backgroundColor: feature.bgColor,
                  zIndex: index + 1,
                  transform: `translateY(${offset}%)`,
                  transition: 'transform 0.05s linear',
                  boxShadow: '0 25px 80px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.3), 0 0 0 1.5px rgba(201, 50, 93, 0.35)',
                  border: '1px solid rgba(201, 50, 93, 0.25)',
                }}
              >
                {/* Dot pattern */}
                <div
                  className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-3xl lg:rounded-[2.5rem]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* Card content */}
                <div className="w-full h-full flex items-center overflow-hidden">
                  <div className="v2-container w-full max-w-6xl py-12 lg:py-16 relative z-10">
                    {/* Feature number */}
                    <div className="absolute top-4 right-4 lg:top-8 lg:right-8 flex items-center gap-2">
                      <span className="text-sm font-medium text-white/40">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-sm text-white/30">/</span>
                      <span className="text-sm text-white/30">{String(features.length).padStart(2, '0')}</span>
                    </div>

                    <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                      {/* Mascot Side */}
                      <div className={`order-1 lg:order-none relative flex items-center justify-center py-4 lg:py-0 ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                        <div
                          className={`absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] lg:w-[350px] lg:h-[350px] rounded-full opacity-40 ${feature.gradientClass}`}
                          style={{ filter: 'blur(60px)' }}
                        />
                        <div
                          className="mascot-wrapper relative cursor-pointer"
                          onClick={() => handleMascotClick(index)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Click to interact with ${feature.mascotAlt}`}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleMascotClick(index); }}
                        >
                          <Image
                            src={feature.mascot}
                            alt={feature.mascotAlt}
                            width={320}
                            height={320}
                            className={`w-48 sm:w-56 md:w-64 lg:w-80 transition-all duration-300 ${imagesLoaded.has(index) ? 'opacity-100' : 'opacity-0'} ${clickedMascot === index ? 'scale-110' : ''}`}
                            style={{
                              filter: `drop-shadow(0 20px 40px ${shadowColor})`,
                              animation: 'featureFloat 6s ease-in-out infinite',
                              animationDelay: `${index * 0.5}s`,
                            }}
                            onLoad={() => handleImageLoad(index)}
                            loading="eager"
                            priority={index < 2}
                          />
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className={`order-2 lg:order-none text-center lg:text-left ${isEven ? '' : 'lg:col-start-2'}`}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
                          <div className={`w-6 h-6 rounded-lg ${feature.gradientClass} flex items-center justify-center`}>
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-white/70 text-sm font-medium tracking-wide">{feature.tagline}</span>
                        </div>

                        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                          {feature.title}
                        </h3>

                        <p className="text-sm lg:text-base text-white/70 mb-5 leading-relaxed max-w-xl">
                          {feature.description}
                        </p>

                        <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-5">
                          {feature.highlights.map((highlight, hIdx) => (
                            <div key={highlight} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
                              <span className="text-xs font-medium text-white">
                                {isMetricHighlight(highlight) ? <AnimatedMetric text={highlight} isVisible={isVisible} index={hIdx} /> : highlight}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mb-5">
                          <button
                            onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
                            className="text-sm text-white/50 hover:text-white/70 flex items-center gap-2 mx-auto lg:mx-0 transition-colors p-2 -m-2"
                            aria-expanded={expandedFeature === index}
                          >
                            {expandedFeature === index ? 'Show less' : "See what's included"}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedFeature === index ? 'rotate-180' : ''}`} />
                          </button>

                          {expandedFeature === index && (
                            <ul className="mt-3 space-y-1.5">
                              {extendedContent[index]?.map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-white/60 text-sm justify-center lg:justify-start">
                                  <Check className="w-4 h-4 text-fm-orange-400 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <MagneticButton
                          as="a"
                          href={feature.ctaLink}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-fm-neutral-900 font-semibold rounded-full hover:bg-white/90 transition-colors group text-sm"
                        >
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </MagneticButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

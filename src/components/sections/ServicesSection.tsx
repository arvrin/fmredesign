'use client';

import React, { useState } from 'react';
import { LinkButton } from '@/design-system';
import { 
  Search, 
  MessageSquare, 
  PenTool, 
  BarChart3, 
  Smartphone, 
  Globe,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react';
import './services-animations.css';
import { cn } from '@/lib/utils';

const services = [
  {
    icon: Search,
    title: 'SEO & Search Marketing',
    description: 'Dominate search results with strategic SEO optimization and targeted campaigns that drive qualified traffic.',
    features: ['Keyword Research', 'On-page SEO', 'Link Building', 'Local SEO'],
    popular: true,
  },
  {
    icon: MessageSquare,
    title: 'Social Media Management',
    description: 'Build authentic connections that convert followers into customers through strategic social media presence.',
    features: ['Content Strategy', 'Community Management', 'Paid Social', 'Analytics'],
    popular: false,
  },
  {
    icon: PenTool,
    title: 'Creative Design',
    description: 'Stand out with compelling visuals and brand experiences that capture attention and drive engagement.',
    features: ['Brand Identity', 'Web Design', 'Print Design', 'Video Production'],
    popular: false,
  },
  {
    icon: BarChart3,
    title: 'Performance Marketing',
    description: 'Maximize ROI with data-driven paid advertising campaigns across Google, Facebook, and beyond.',
    features: ['Google Ads', 'Facebook Ads', 'Conversion Tracking', 'A/B Testing'],
    popular: true,
  },
  {
    icon: Smartphone,
    title: 'Mobile Marketing',
    description: 'Reach customers where they are with mobile-first strategies that drive app installs and engagement.',
    features: ['App Store Optimization', 'In-app Advertising', 'Push Notifications', 'Mobile Analytics'],
    popular: false,
  },
  {
    icon: Globe,
    title: 'Digital Strategy',
    description: 'Comprehensive digital transformation roadmaps that align with your business goals and market opportunities.',
    features: ['Market Research', 'Competitor Analysis', 'Growth Hacking', 'Consulting'],
    popular: false,
  },
];

const processSteps = [
  { number: '01', title: 'Discovery', description: 'Understanding your goals' },
  { number: '02', title: 'Strategy', description: 'Crafting the perfect plan' },
  { number: '03', title: 'Execution', description: 'Bringing ideas to life' },
  { number: '04', title: 'Optimization', description: 'Continuous improvement' },
];

export function ServicesSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-0 bg-gradient-to-b from-fm-neutral-50 to-fm-neutral-100 overflow-visible">
      {/* Ambient Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 services-gradient-bg"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, rgba(179,41,104,0.15) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 80%, rgba(255,107,53,0.1) 0%, transparent 50%)`
          }}
        />
        <div className="noise-overlay" />
      </div>

      <div className="relative z-10 px-4 md:px-8 lg:px-16" style={{ paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '1440px', margin: '0 auto' }}>
        {/* Section Header with Perfect Alignment */}
        <div className="text-center mx-auto overflow-visible" style={{ marginBottom: '5rem', maxWidth: '800px' }}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-fm-magenta-50/80 backdrop-blur-sm border border-fm-magenta-200 rounded-full text-fm-magenta-700 text-sm font-medium animate-fade-in">
              <Star className="w-4 h-4 mr-2 animate-pulse-slow" />
              Our Services
            </div>
          </div>
          
          <h2 className="font-bold text-fm-neutral-900 animate-fade-in-up text-center" 
              style={{ 
                marginBottom: '2rem', 
                lineHeight: '1.1',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                maxWidth: '100%',
                margin: '0 auto 2rem auto'
              }}>
            Comprehensive{' '}
            <span className="text-fm-magenta-700 relative inline-block">
              Digital
              <svg
                className="absolute -bottom-2 left-0 w-full h-4 text-fm-magenta-700"
                viewBox="0 0 200 12"
                fill="currentColor"
              >
                <path d="M2 8c40-6 80-6 120 0s80 6 120 0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>{' '}
            Solutions
          </h2>
          
          <div className="flex justify-center">
            <p className="text-lg text-fm-neutral-600 leading-relaxed animate-fade-in-up text-center" 
               style={{ maxWidth: '600px' }}>
              From strategic planning to creative execution, we provide end-to-end digital marketing 
              services that drive growth and deliver measurable results.
            </p>
          </div>
        </div>

        {/* Services Grid with Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ marginBottom: '6rem' }}>
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <div
                key={service.title}
                className={cn(
                  "service-card-premium service-card-enter rounded-2xl p-8 relative",
                  "transform transition-all duration-500",
                  hoveredCard === index ? "z-20" : "z-10"
                )}
                style={{ animationDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Brand Magenta Popular Badge - Safe Position */}
                {service.popular && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg z-30 popular-badge-pulse">
                    <Star className="w-3 h-3 inline mr-1" />
                    Popular
                  </div>
                )}

                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fm-magenta-700 via-fm-purple-700 to-fm-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

                {/* Icon with Brand Magenta Styling */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-700 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content with Better Typography */}
                <h3 className="text-xl font-bold text-fm-neutral-900 mb-4">
                  {service.title}
                </h3>

                <p className="text-fm-neutral-600 leading-relaxed mb-6 text-sm">
                  {service.description}
                </p>

                {/* Enhanced Features List with Brand Colors */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li 
                      key={feature} 
                      className="flex items-center text-sm text-fm-neutral-700 transform transition-all duration-300"
                      style={{ 
                        transitionDelay: `${featureIndex * 50}ms`,
                        transform: hoveredCard === index ? 'translateX(4px)' : 'translateX(0)'
                      }}
                    >
                      <CheckCircle className="w-4 h-4 text-fm-magenta-700 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Brand CTA Button */}
                <LinkButton 
                  href="/services"
                  variant="ghost" 
                  size="sm" 
                  className="group/btn w-full justify-between text-fm-magenta-700 hover:bg-fm-magenta-50 hover:text-fm-magenta-800 border border-fm-magenta-200 hover:border-fm-magenta-300 transition-all duration-300"
                >
                  <span className="font-medium">Learn More</span>
                  <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover/btn:translate-x-2" />
                </LinkButton>
              </div>
            );
          })}
        </div>

        {/* Enhanced Process Overview with Subtle Magenta Glow */}
        <div className="relative" style={{ marginTop: '4rem' }}>
          {/* Subtle Magenta Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-fm-magenta-400/20 via-fm-magenta-300/10 to-fm-magenta-400/20 rounded-3xl blur-2xl opacity-60" />
          <div className="absolute -inset-2 bg-fm-magenta-500/10 rounded-3xl blur-xl" />
          
          {/* Glass Container with Enhanced Styling */}
          <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40" 
               style={{ padding: '4rem 2rem' }}>
            <h3 className="font-bold text-fm-neutral-900 text-center animate-fade-in" 
                style={{ 
                  marginBottom: '3rem',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  lineHeight: '1.2'
                }}>
              Our Proven Process
            </h3>
            
            <div className="relative">
              {/* Fixed Connecting Line SVG */}
              <svg className="absolute top-6 left-0 w-full h-2 hidden md:block" style={{ zIndex: 1 }}>
                <line 
                  x1="12.5%" y1="1" x2="87.5%" y2="1" 
                  stroke="url(#processGradientFixed)" 
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  className="animate-pulse-slow"
                />
                <defs>
                  <linearGradient id="processGradientFixed" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(179,41,104,0.4)" />
                    <stop offset="50%" stopColor="rgba(179,41,104,0.6)" />
                    <stop offset="100%" stopColor="rgba(179,41,104,0.3)" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
                {processSteps.map((step, index) => (
                  <div 
                    key={step.number}
                    className="text-center animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="relative inline-block mb-6">
                      {/* Brand Magenta Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-fm-magenta-400 to-fm-magenta-600 rounded-full blur-xl opacity-30 process-step-glow" />
                      
                      {/* Step Number - Brand Magenta */}
                      <div className="relative w-14 h-14 bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-700 text-fm-neutral-50 rounded-full flex items-center justify-center font-bold text-lg shadow-lg mx-auto transform transition-transform duration-300 hover:scale-110">
                        {step.number}
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-fm-neutral-900 mb-2 text-lg">
                      {step.title}
                    </h4>
                    <p className="text-sm text-fm-neutral-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand CTA */}
            <div className="mt-12 text-center">
              <LinkButton 
                href="/contact"
                variant="primary" 
                size="lg" 
                className="group shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
              >
                <span className="mr-2">Discuss Your Project</span>
                <ArrowRight className="w-5 h-5 inline-block transform transition-transform duration-300 group-hover:translate-x-1" />
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
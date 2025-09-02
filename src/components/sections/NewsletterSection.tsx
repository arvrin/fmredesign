/**
 * Newsletter Section - Standalone Component
 * Strategic newsletter signup component for key pages
 */

import React from 'react';
import { LinkButton } from '@/design-system';
import { ArrowRight, Star } from 'lucide-react';

export interface NewsletterSectionProps {
  title?: string;
  description?: string;
  subscriberCount?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'feature';
}

export function NewsletterSection({
  title = "Stay Ahead of the Curve",
  description = "Get the latest digital marketing insights, trends, and strategies delivered straight to your inbox. No spam, just valuable content.",
  subscriberCount = "2,500+ marketers",
  className = "",
  variant = 'default'
}: NewsletterSectionProps) {
  const isCompact = variant === 'compact';
  const isFeature = variant === 'feature';

  return (
    <section className={`relative py-0 bg-gradient-to-b from-fm-neutral-50 to-fm-neutral-100 overflow-visible border-b border-fm-neutral-200/50 ${className}`}>
      {/* Ambient Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, rgba(179,41,104,0.08) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 80%, rgba(255,107,53,0.05) 0%, transparent 50%)`
          }}
        />
      </div>
      
      <div className={`relative z-10 px-4 md:px-8 lg:px-16 ${isCompact ? 'py-12' : 'py-20'}`} style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Enhanced Newsletter Container */}
        <div className="relative">
          {/* Signature Magenta Glow Effects */}
          <div className="absolute -inset-4 bg-gradient-to-r from-fm-magenta-400/20 via-fm-magenta-300/10 to-fm-magenta-400/20 rounded-3xl blur-2xl opacity-60" />
          <div className="absolute -inset-2 bg-fm-magenta-500/10 rounded-3xl blur-xl" />
          
          {/* Glass Container */}
          <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/40 p-8 md:p-12">
            <div className={`${isFeature ? 'max-w-4xl' : 'max-w-2xl'} mx-auto text-center`}>
              {/* Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-fm-magenta-50/80 backdrop-blur-sm border border-fm-magenta-200 rounded-full text-fm-magenta-700 text-sm font-medium">
                  <Star className="w-4 h-4 mr-2 animate-pulse-slow" />
                  Newsletter
                </div>
              </div>
            
              <h2 className="font-bold text-fm-neutral-900 mb-8" 
                  style={{ 
                    fontSize: isCompact ? '2rem' : 'clamp(2rem, 4vw, 2.75rem)',
                    lineHeight: '1.15'
                  }}>
                {title.split(' ').map((word, index) => {
                  if (word.toLowerCase() === 'ahead') {
                    return (
                      <span key={index} className="text-fm-magenta-700 relative inline-block">
                        {word}
                        <svg
                          className="absolute -bottom-2 left-0 w-full h-3 text-fm-magenta-700"
                          viewBox="0 0 200 12"
                          fill="currentColor"
                        >
                          <path d="M2 8c40-6 80-6 120 0s80 6 120 0" stroke="currentColor" strokeWidth="3" fill="none" />
                        </svg>
                      </span>
                    );
                  }
                  return <span key={index}>{word} </span>;
                })}
              </h2>
            
              <div className="flex justify-center mb-10">
                <p className="text-lg text-fm-neutral-600 leading-relaxed text-center" 
                   style={{ maxWidth: '520px', lineHeight: '1.6' }}>
                  {description}
                </p>
              </div>
            
              <div>
                <div className={`flex ${isCompact ? 'flex-col gap-3' : 'flex-col sm:flex-row'} items-stretch justify-center gap-4 ${isFeature ? 'max-w-2xl' : 'max-w-xl'} mx-auto mb-8`}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-fm-neutral-100/80 border border-fm-neutral-300 px-6 py-4 rounded-xl text-fm-neutral-900 placeholder-fm-neutral-500 focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700 focus:bg-white transition-all duration-300 shadow-lg text-base"
                    style={{ minHeight: '56px' }}
                  />
                  <LinkButton 
                    href="#" 
                    variant="primary" 
                    size="lg" 
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                    className="sm:flex-shrink-0 shadow-lg hover:shadow-xl"
                    style={{ minHeight: '56px', paddingLeft: '2rem', paddingRight: '2rem' }}
                  >
                    Subscribe
                  </LinkButton>
                </div>
                
                <p className="text-sm text-fm-neutral-600 font-medium">
                  Join {subscriberCount} getting weekly insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
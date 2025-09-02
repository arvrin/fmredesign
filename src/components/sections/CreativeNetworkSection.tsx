'use client';

import React from 'react';
import { LinkButton, StatCard, TeamCard } from '@/design-system';
import { Users, Award, TrendingUp, ArrowRight, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';


export function CreativeNetworkSection() {
  const networkStats = [
    {
      icon: <Users className="w-6 h-6 text-fm-magenta-600" />,
      value: '150+',
      label: 'Creative Professionals',
      description: 'Verified talent across all creative disciplines'
    },
    {
      icon: <Award className="w-6 h-6 text-fm-magenta-600" />,
      value: '95%',
      label: 'Client Satisfaction',
      description: 'Consistently high-quality deliverables'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-fm-magenta-600" />,
      value: '300+',
      label: 'Projects Completed',
      description: 'Successful collaborations and partnerships'
    }
  ];

  const featuredTalent = [
    {
      name: 'Priya Sharma',
      role: 'UI/UX Designer',
      speciality: 'Mobile App Design',
      rating: 4.9,
      projects: 45,
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Arjun Kumar',
      role: 'Content Creator',
      speciality: 'Video Production',
      rating: 4.8,
      projects: 67,
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Sneha Patel',
      role: 'Social Media Manager',
      speciality: 'Brand Strategy',
      rating: 4.9,
      projects: 78,
      image: '/api/placeholder/150/150'
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-fm-neutral-50 to-fm-magenta-50/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-fm-magenta-200 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-fm-orange-200 rounded-full blur-2xl animate-float-reverse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-fm-magenta-100 to-fm-orange-100 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="fm-container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-fm-magenta-50 border border-fm-magenta-200 rounded-full text-fm-magenta-700 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2" />
            Join Our Creative Network
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-fm-neutral-900 mb-6 animate-fade-in-up">
            Connect with India&apos;s Top
            <span className="text-fm-magenta-700 relative inline-block ml-2">
              Creative Minds
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-fm-magenta-700"
                viewBox="0 0 200 12"
                fill="currentColor"
              >
                <path d="M2 8c40-6 80-6 120 0s80 6 120 0" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h2>
          
          <p className="text-lg text-fm-neutral-600 mb-8 animate-fade-in-up">
            Whether you&apos;re a creative professional looking for opportunities or a business seeking top talent, 
            our curated network connects you with the perfect creative partnerships.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up">
            <LinkButton 
              href="/creativeminds" 
              variant="primary" 
              size="lg" 
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Explore Network
            </LinkButton>
            <LinkButton 
              href="/creativeminds#apply" 
              variant="outline" 
              size="lg" 
              icon={<Users className="w-5 h-5" />}
              iconPosition="left"
            >
              Join as Creator
            </LinkButton>
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {networkStats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              className="animate-fade-in-up bg-white/80 backdrop-blur-sm border-fm-neutral-200/60 hover:shadow-fm-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>

        {/* Featured Talent Preview */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-fm-neutral-200/60 p-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-fm-neutral-900 mb-3">Featured Talent</h3>
            <p className="text-fm-neutral-600">Meet some of our top-rated creative professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTalent.map((talent, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl border border-fm-neutral-200 p-6 text-center hover:shadow-fm-md transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${0.8 + index * 0.2}s` }}
              >
                <div className="w-20 h-20 bg-fm-magenta-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-fm-magenta-700">
                  {talent.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <h4 className="font-semibold text-fm-neutral-900 mb-1">{talent.name}</h4>
                <p className="text-fm-magenta-600 font-medium mb-2">{talent.role}</p>
                <p className="text-sm text-fm-neutral-600 mb-3">{talent.speciality}</p>
                
                <div className="flex items-center justify-center gap-4 text-sm text-fm-neutral-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{talent.rating}</span>
                  </div>
                  <div>{talent.projects} projects</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <LinkButton 
              href="/creativeminds" 
              variant="ghost" 
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              View All Talent
            </LinkButton>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-fm-magenta-700 to-fm-orange-600 rounded-2xl p-8 text-white animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-fm-magenta-100 mb-6">
              Join thousands of businesses and creatives who trust FreakingMinds for their projects
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <LinkButton 
                href="/get-started" 
                variant="secondary" 
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                Start a Project
              </LinkButton>
              <LinkButton 
                href="/creativeminds" 
                variant="ghost" 
                size="lg"
                className="text-white border-white/30 hover:bg-white/10"
                icon={<Users className="w-5 h-5" />}
                iconPosition="left"
              >
                Browse Talent
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
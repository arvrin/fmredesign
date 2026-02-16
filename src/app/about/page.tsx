'use client';

import { ArrowRight, Users, Target, Award, Heart, Lightbulb, Star } from "lucide-react";
import Link from "next/link";
import { V2PageWrapper } from "@/components/layouts/V2PageWrapper";

const values = [
  {
    icon: <Lightbulb className="w-7 h-7 text-white" />,
    title: "Innovation",
    description: "We constantly push boundaries and explore new creative territories to deliver cutting-edge solutions that set our clients apart."
  },
  {
    icon: <Heart className="w-7 h-7 text-white" />,
    title: "Authenticity",
    description: "We believe in genuine brand stories and authentic connections. Every strategy we create reflects the true essence of your brand."
  },
  {
    icon: <Target className="w-7 h-7 text-white" />,
    title: "Results",
    description: "Data-driven approach ensures every campaign delivers measurable ROI. We don't just create beautiful campaigns, we create business growth."
  },
  {
    icon: <Users className="w-7 h-7 text-white" />,
    title: "Collaboration",
    description: "Your success is our success. We work as an extension of your team, bringing expertise while respecting your vision and goals."
  }
];

const teamMembers = [
  {
    name: "Arushi Maheshwari",
    role: "Founder & CEO",
    experience: "10+ years",
    expertise: "Brand Strategy, Business Development",
    description: "Visionary leader with a passion for transforming brands through innovative marketing strategies.",
    image: "/team/Arushimaheshwari.png"
  },
  {
    name: "Abhishek Ray",
    role: "Sales Head",
    experience: "6+ years",
    expertise: "Sales Strategy, Client Acquisition",
    description: "Dynamic sales professional driving business growth through strategic partnerships and client relationships.",
    image: "/team/Abhishek.png"
  }
];

export default function AboutPage() {
  return (
    <V2PageWrapper>
      {/* Hero Section */}
      <section className="relative z-10 v2-section pt-32 lg:pt-40">
        <div className="v2-container v2-container-wide">
          <div className="max-w-4xl mx-auto" style={{ textAlign: 'center' }}>
            {/* Badge */}
            <div className="v2-badge v2-badge-glass mb-8">
              <Users className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">Meet the Minds Behind the Magic</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold v2-text-primary mb-8 leading-tight">
              We're Not Just a Team, We're Your{' '}
              <span className="v2-accent">Partners in Growth</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed" style={{ marginBottom: '48px' }}>
              Founded in the heart of Bhopal, Freaking Minds has been revolutionizing digital marketing for over a decade. We combine strategic thinking with creative excellence to deliver campaigns that don't just look good—they drive real business results.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/get-started" className="v2-btn v2-btn-primary">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/work" className="v2-btn v2-btn-secondary">
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 v2-section">
        <div className="v2-container">
          {/* Floating Brain Decoration */}
          <div className="absolute left-4 lg:left-16 top-8 hidden lg:block z-10">
            <img
              src="/3dasset/brain-strategy.png"
              alt="Strategic Innovation"
              className="w-28 lg:w-36 h-auto animate-v2-hero-float drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
            />
          </div>

          <div className="max-w-3xl mx-auto" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="v2-badge v2-badge-glass mb-6">
              <Award className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">Our Core Values</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold v2-text-primary mb-8 leading-tight">
              What Drives Our{' '}
              <span className="v2-accent">Excellence</span>
            </h2>
            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed">
              These fundamental principles guide every decision we make and every campaign we create.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="v2-paper rounded-2xl p-8 text-center">
                <div className="w-14 h-14 v2-gradient-brand rounded-xl flex items-center justify-center mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-fm-neutral-900 mb-3">{value.title}</h3>
                <p className="text-fm-neutral-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 v2-section">
        <div className="v2-container">
          <div className="max-w-3xl mx-auto" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="v2-badge v2-badge-glass mb-6">
              <Star className="w-4 h-4 v2-text-primary" />
              <span className="v2-text-primary">Meet Our Team</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold v2-text-primary mb-8 leading-tight">
              The <span className="v2-accent">Creative Minds</span> Behind Your Success
            </h2>
            <p className="text-lg md:text-xl v2-text-secondary leading-relaxed">
              Our diverse team brings together decades of experience in digital marketing, creative design, and strategic consulting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member.name} className="v2-paper rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-fm-magenta-100"
                />
                <h3 className="font-display text-xl font-bold text-fm-neutral-900 mb-1">{member.name}</h3>
                <p className="text-fm-magenta-600 font-semibold text-sm mb-2">{member.role}</p>
                <p className="text-fm-neutral-500 text-xs mb-4">{member.experience} | {member.expertise}</p>
                <p className="text-fm-neutral-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 v2-section pb-32">
        <div className="v2-container v2-container-narrow">
          <div className="v2-paper rounded-3xl p-6 sm:p-8 md:p-10 lg:p-14" style={{ textAlign: 'center' }}>
            <div className="v2-badge v2-badge-light mb-6">
              <Target className="w-4 h-4" />
              <span>Ready to Get Started?</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-fm-neutral-900 mb-6 leading-tight">
              Let's Create Something <span className="text-fm-magenta-600">Amazing</span> Together
            </h2>
            <p className="text-fm-neutral-600 mb-8 max-w-xl mx-auto">
              Join the growing list of successful brands that trust Freaking Minds with their digital marketing success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/get-started" className="v2-btn v2-btn-magenta">
                Let's Create Magic Together
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="v2-btn v2-btn-outline">
                Schedule a Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </V2PageWrapper>
  );
}
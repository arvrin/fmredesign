'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const navigation = {
  services: [
    { name: 'Brand Strategy', href: '/services#brand-strategy' },
    { name: 'Performance Marketing', href: '/services#performance-marketing' },
    { name: 'Creative & Content', href: '/services#creative-content' },
    { name: 'Digital Experience', href: '/services#digital-experience' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Work', href: '/work' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/Freakingmindsdigital' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/freakingminds' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/freaking-minds' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/freakingminds' },
];

export function FooterV2() {
  return (
    <footer className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(201, 50, 93, 0.1)' }}>
      {/* Seamless with V2 dark background - no separate bg needed */}

      {/* Decorative gradient blob */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at bottom right, rgba(201, 50, 93, 0.06) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & CTA Section */}
          <div className="col-span-2 lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="mb-5 group">
              <img
                src="/logo.png"
                alt="Freaking Minds"
                width={150}
                height={56}
                className="w-auto group-hover:scale-105 transition-transform duration-300"
                style={{ height: '3.5rem' }}
              />
            </Link>

            <p className="v2-text-tertiary leading-relaxed mb-6 text-[13px] font-normal max-w-[260px]">
              We partner with ambitious brands to build digital experiences that drive measurable growth.
            </p>

            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#1a0a12',
                backgroundColor: 'rgba(201, 50, 93, 0.08)',
                border: '1px solid rgba(201, 50, 93, 0.15)',
                borderRadius: '9999px',
                textDecoration: 'none',
                whiteSpace: 'nowrap' as const,
                width: 'fit-content',
                transition: 'all 0.3s ease',
              }}
            >
              Start a Project
              <ArrowUpRight style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>

          {/* Navigation */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider v2-text-primary mb-6">
              Services
            </h4>
            <ul className="space-y-1">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="v2-text-tertiary hover:text-fm-magenta-600 transition-colors text-[15px] block py-1.5"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider v2-text-primary mb-6">
              Company
            </h4>
            <ul className="space-y-1">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="v2-text-tertiary hover:text-fm-magenta-600 transition-colors text-[15px] block py-1.5"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider v2-text-primary mb-6">
              Get in Touch
            </h4>

            <div className="space-y-4 mb-10">
              <a
                href="mailto:hello@freakingminds.in"
                className="flex items-center gap-4 v2-text-tertiary hover:text-fm-magenta-600 transition-colors text-[15px] group"
              >
                <div className="w-11 h-11 rounded-xl bg-fm-magenta-600/10 flex items-center justify-center group-hover:bg-fm-magenta-600/20 transition-colors">
                  <Mail className="w-[18px] h-[18px]" />
                </div>
                <span>hello@freakingminds.in</span>
              </a>
              <a
                href="tel:+919833257659"
                className="flex items-center gap-4 v2-text-tertiary hover:text-fm-magenta-600 transition-colors text-[15px] group"
              >
                <div className="w-11 h-11 rounded-xl bg-fm-magenta-600/10 flex items-center justify-center group-hover:bg-fm-magenta-600/20 transition-colors">
                  <Phone className="w-[18px] h-[18px]" />
                </div>
                <span>+91 98332 57659</span>
              </a>
              <div className="flex items-center gap-4 v2-text-tertiary text-[15px]">
                <div className="w-11 h-11 rounded-xl bg-fm-magenta-600/10 flex items-center justify-center">
                  <MapPin className="w-[18px] h-[18px]" />
                </div>
                <span>Bhopal, Madhya Pradesh, India</span>
              </div>
            </div>

            <h4 className="text-xs font-semibold uppercase tracking-wider v2-text-primary mb-5">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-xl bg-fm-magenta-600/10 flex items-center justify-center hover:bg-fm-magenta-600 transition-all duration-300"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <IconComponent className="w-[18px] h-[18px] v2-text-tertiary group-hover:text-white transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(201, 50, 93, 0.1)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <p className="v2-text-muted text-[13px]">
              © {new Date().getFullYear()} Freaking Minds. All rights reserved.
            </p>

            <div className="flex items-center gap-4 sm:gap-8">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="v2-text-muted hover:text-fm-magenta-600 transition-colors text-[13px]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

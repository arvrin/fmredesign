'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

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
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative" style={{ borderTop: '3px solid #8c1d4a' }}>
      {/* Giant brand name */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2
            className="font-display font-black leading-[0.85] tracking-tighter"
            style={{
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              color: 'rgba(201, 50, 93, 0.06)',
              WebkitTextStroke: '1.5px rgba(201, 50, 93, 0.2)',
            }}
          >
            FREAKING
            <br />
            MINDS
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 self-start md:self-end mb-2 group"
          >
            <span
              className="font-display font-bold text-lg uppercase tracking-wider"
              style={{ color: '#8c1d4a' }}
            >
              Start a Project
            </span>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300"
              style={{ background: '#8c1d4a' }}
            >
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </Link>
        </div>
      </div>

      {/* Grid with visible borders */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{ border: '1px solid rgba(201, 50, 93, 0.15)', overflow: 'hidden' }}
        >
          {/* Contact Block */}
          <div
            className="p-6 lg:p-8 overflow-hidden"
            style={{
              borderRight: '1px solid rgba(201, 50, 93, 0.15)',
              borderBottom: '1px solid rgba(201, 50, 93, 0.15)',
              background: 'rgba(201, 50, 93, 0.04)',
              minWidth: 0,
            }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-6"
              style={{ color: '#8c1d4a' }}
            >
              Contact
            </span>
            <a href="mailto:freakingmindsdigital@gmail.com" className="block v2-text-primary font-semibold text-sm lg:text-base mb-2 hover:underline truncate">
              freakingmindsdigital@gmail.com
            </a>
            <a href="tel:+919833257659" className="block v2-text-primary font-semibold text-sm lg:text-base mb-4 hover:underline">
              +91 98332 57659
            </a>
            <p className="v2-text-tertiary text-sm uppercase tracking-wide">
              Central India
            </p>
          </div>

          {/* Services Block */}
          <div
            className="p-6 lg:p-8"
            style={{
              borderRight: '1px solid rgba(201, 50, 93, 0.15)',
              borderBottom: '1px solid rgba(201, 50, 93, 0.15)',
              minWidth: 0,
            }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-6"
              style={{ color: '#8c1d4a' }}
            >
              Services
            </span>
            <ul className="space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="v2-text-primary font-bold uppercase text-sm tracking-wider hover:pl-2 transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Block */}
          <div
            className="p-6 lg:p-8"
            style={{
              borderRight: '1px solid rgba(201, 50, 93, 0.15)',
              borderBottom: '1px solid rgba(201, 50, 93, 0.15)',
              minWidth: 0,
            }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-6"
              style={{ color: '#8c1d4a' }}
            >
              Company
            </span>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="v2-text-primary font-bold uppercase text-sm tracking-wider hover:pl-2 transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Block */}
          <div
            className="p-6 lg:p-8"
            style={{
              borderBottom: '1px solid rgba(201, 50, 93, 0.15)',
              background: 'rgba(201, 50, 93, 0.04)',
              minWidth: 0,
            }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-6"
              style={{ color: '#8c1d4a' }}
            >
              Social
            </span>
            <div className="space-y-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 v2-text-primary font-bold uppercase text-sm tracking-wider hover:pl-2 transition-all duration-200 group"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <Icon className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                    {social.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] uppercase tracking-[0.2em] v2-text-muted font-bold">
            &copy; {currentYear} Freaking Minds. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            {navigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[11px] uppercase tracking-[0.2em] v2-text-muted font-bold transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

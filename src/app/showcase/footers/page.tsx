'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, Facebook, Instagram, Linkedin, Twitter,
  Mail, Phone, MapPin, Sparkles, Send, ChevronRight, Minus,
} from 'lucide-react';

// ─── Shared Data ─────────────────────────────────────────────────────────────

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
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
];

const currentYear = new Date().getFullYear();


// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER 1: EDITORIAL SERIF
// Magazine-like elegance, large Playfair Display headline, generous whitespace
// ═══════════════════════════════════════════════════════════════════════════════

function FooterEditorialSerif() {
  return (
    <footer className="relative" style={{ borderTop: '1px solid rgba(201, 50, 93, 0.12)' }}>
      {/* Hero Statement */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-24 pb-16" style={{ textAlign: 'center' }}>
        <p
          className="font-body text-xs uppercase mb-8"
          style={{ color: '#8c1d4a', letterSpacing: '0.35em' }}
        >
          What&apos;s next?
        </p>
        <h2
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 v2-text-primary"
        >
          Let&apos;s Create Something
          <br />
          <span
            className="font-accent italic font-normal"
            style={{
              background: 'linear-gradient(135deg, #8c1d4a, #ff7f50)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Extraordinary
          </span>
        </h2>
        <p className="v2-text-tertiary text-lg max-w-md mx-auto mb-10 leading-relaxed">
          We partner with ambitious brands to build digital experiences that drive measurable growth.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 font-medium text-sm tracking-wide transition-all duration-300 hover:gap-4"
          style={{
            color: 'white',
            background: 'linear-gradient(135deg, #8c1d4a, #e04d7d)',
            borderRadius: '9999px',
          }}
        >
          Start a Conversation
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Thin divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div style={{ height: '1px', background: 'rgba(201, 50, 93, 0.1)' }} />
      </div>

      {/* Navigation row */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-10">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {[...navigation.services, ...navigation.company].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="v2-text-tertiary text-[13px] tracking-wide transition-colors duration-300"
              style={{ textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '')}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Thin divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div style={{ height: '1px', background: 'rgba(201, 50, 93, 0.1)' }} />
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <img
              src="/logo.png"
              alt="Freaking Minds"
              className="w-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
              style={{ height: '2rem' }}
            />
            <span className="v2-text-muted text-[12px]">
              &copy; {currentYear} Freaking Minds
            </span>
          </div>

          <div className="flex items-center gap-5">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  className="v2-text-muted transition-colors duration-300"
                  style={{ textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  aria-label={social.name}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
            <span className="v2-text-muted text-[11px]">|</span>
            {navigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="v2-text-muted text-[12px] transition-colors duration-300"
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


// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER 2: BRUTALIST BOLD
// Oversized typography, geometric grid, high-contrast magenta blocks, raw energy
// ═══════════════════════════════════════════════════════════════════════════════

function FooterBrutalistBold() {
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
          style={{ border: '1px solid rgba(201, 50, 93, 0.15)' }}
        >
          {/* Contact Block */}
          <div
            className="p-8 lg:p-10"
            style={{
              borderRight: '1px solid rgba(201, 50, 93, 0.15)',
              borderBottom: '1px solid rgba(201, 50, 93, 0.15)',
              background: 'rgba(201, 50, 93, 0.04)',
            }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-6"
              style={{ color: '#8c1d4a' }}
            >
              Contact
            </span>
            <a href="mailto:hello@freakingminds.in" className="block v2-text-primary font-semibold text-lg mb-2 hover:underline">
              hello@freakingminds.in
            </a>
            <a href="tel:+919833257659" className="block v2-text-primary font-semibold text-lg mb-4 hover:underline">
              +91 98332 57659
            </a>
            <p className="v2-text-tertiary text-sm uppercase tracking-wide">
              Bhopal, MP, India
            </p>
          </div>

          {/* Services Block */}
          <div
            className="p-8 lg:p-10"
            style={{
              borderRight: '1px solid rgba(201, 50, 93, 0.15)',
              borderBottom: '1px solid rgba(201, 50, 93, 0.15)',
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
            className="p-8 lg:p-10"
            style={{
              borderRight: '1px solid rgba(201, 50, 93, 0.15)',
              borderBottom: '1px solid rgba(201, 50, 93, 0.15)',
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
            className="p-8 lg:p-10"
            style={{
              borderBottom: '1px solid rgba(201, 50, 93, 0.15)',
              background: 'rgba(201, 50, 93, 0.04)',
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
                    className="flex items-center gap-3 v2-text-primary font-bold uppercase text-sm tracking-wider hover:pl-2 transition-all duration-200 group"
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


// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER 3: GLASSMORPHIC CARDS
// Frosted white glass cards on light background, magenta glow on hover
// ═══════════════════════════════════════════════════════════════════════════════

function FooterGlassmorphicCards() {
  const glassStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.55)',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: '20px',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 4px 24px rgba(201, 50, 93, 0.04)',
    transition: 'all 0.4s ease',
  };

  return (
    <footer className="relative py-16" style={{ borderTop: '1px solid rgba(201, 50, 93, 0.1)' }}>
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(201, 50, 93, 0.06) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Brand Card */}
          <div
            className="group"
            style={glassStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,50,93,0.25)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(201, 50, 93, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(201, 50, 93, 0.04)';
            }}
          >
            <div className="p-7">
              <img
                src="/logo.png"
                alt="Freaking Minds"
                className="w-auto mb-5 opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ height: '2.5rem' }}
              />
              <p className="v2-text-tertiary text-[13px] leading-relaxed mb-6">
                We partner with ambitious brands to build digital experiences that drive measurable growth.
              </p>
              <div className="flex gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-9 h-9 rounded-xl flex items-center justify-center v2-text-tertiary transition-all duration-300"
                      style={{
                        background: 'rgba(201, 50, 93, 0.06)',
                        border: '1px solid rgba(201, 50, 93, 0.08)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#8c1d4a';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 50, 93, 0.06)';
                        e.currentTarget.style.color = '';
                      }}
                      aria-label={social.name}
                    >
                      <Icon className="w-[14px] h-[14px]" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Services Card */}
          <div
            className="group"
            style={glassStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,50,93,0.25)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(201, 50, 93, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(201, 50, 93, 0.04)';
            }}
          >
            <div className="p-7">
              <h4
                className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-6"
                style={{ color: '#8c1d4a' }}
              >
                Services
              </h4>
              <ul className="space-y-2.5">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="v2-text-secondary text-[14px] flex items-center gap-2 transition-all duration-300 hover:gap-3"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                    >
                      <ChevronRight className="w-3 h-3 opacity-30" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Company Card */}
          <div
            className="group"
            style={glassStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,50,93,0.25)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(201, 50, 93, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(201, 50, 93, 0.04)';
            }}
          >
            <div className="p-7">
              <h4
                className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-6"
                style={{ color: '#8c1d4a' }}
              >
                Company
              </h4>
              <ul className="space-y-2.5">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="v2-text-secondary text-[14px] flex items-center gap-2 transition-all duration-300 hover:gap-3"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                    >
                      <ChevronRight className="w-3 h-3 opacity-30" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Card */}
          <div
            className="group"
            style={glassStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(201,50,93,0.25)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(201, 50, 93, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(201, 50, 93, 0.04)';
            }}
          >
            <div className="p-7">
              <h4
                className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-6"
                style={{ color: '#8c1d4a' }}
              >
                Get in Touch
              </h4>
              <div className="space-y-4">
                <a
                  href="mailto:hello@freakingminds.in"
                  className="flex items-center gap-3 v2-text-secondary text-[13px] transition-colors duration-300"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(201, 50, 93, 0.08)' }}
                  >
                    <Mail className="w-3.5 h-3.5" style={{ color: '#8c1d4a' }} />
                  </div>
                  hello@freakingminds.in
                </a>
                <a
                  href="tel:+919833257659"
                  className="flex items-center gap-3 v2-text-secondary text-[13px] transition-colors duration-300"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(201, 50, 93, 0.08)' }}
                  >
                    <Phone className="w-3.5 h-3.5" style={{ color: '#8c1d4a' }} />
                  </div>
                  +91 98332 57659
                </a>
                <div className="flex items-center gap-3 v2-text-secondary text-[13px]">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(201, 50, 93, 0.08)' }}
                  >
                    <MapPin className="w-3.5 h-3.5" style={{ color: '#8c1d4a' }} />
                  </div>
                  Bhopal, MP, India
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(201, 50, 93, 0.08)' }}
        >
          <p className="v2-text-muted text-[12px]">
            &copy; {currentYear} Freaking Minds. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {navigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="v2-text-muted text-[12px] transition-colors duration-300"
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


// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER 4: MINIMAL ZEN
// Ultra-clean, centered, maximum whitespace, hairline dividers, refined type
// ═══════════════════════════════════════════════════════════════════════════════

function FooterMinimalZen() {
  return (
    <footer className="relative" style={{ borderTop: '1px solid rgba(201, 50, 93, 0.08)' }}>
      <div className="max-w-[900px] mx-auto px-6 py-20" style={{ textAlign: 'center' }}>
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Freaking Minds"
          className="w-auto mx-auto mb-12 opacity-80"
          style={{ height: '2.5rem' }}
        />

        {/* Nav links — single centered row */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mb-10">
          {[...navigation.services, ...navigation.company].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="v2-text-tertiary text-[13px] transition-colors duration-300"
              onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '')}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Hairline */}
        <div
          className="max-w-[120px] mx-auto mb-10"
          style={{ height: '1px', background: 'rgba(201, 50, 93, 0.12)' }}
        />

        {/* Contact */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10 v2-text-tertiary text-[13px]">
          <a
            href="mailto:hello@freakingminds.in"
            className="transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
          >
            hello@freakingminds.in
          </a>
          <span style={{ color: 'rgba(201, 50, 93, 0.2)' }}>
            <Minus className="w-3 h-3" />
          </span>
          <a
            href="tel:+919833257659"
            className="transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
          >
            +91 98332 57659
          </a>
          <span style={{ color: 'rgba(201, 50, 93, 0.2)' }}>
            <Minus className="w-3 h-3" />
          </span>
          <span>Bhopal, India</span>
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                className="v2-text-muted transition-colors duration-300"
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                aria-label={social.name}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        {/* Hairline */}
        <div
          className="max-w-[120px] mx-auto mb-8"
          style={{ height: '1px', background: 'rgba(201, 50, 93, 0.12)' }}
        />

        {/* Copyright + legal */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 v2-text-muted text-[11px]">
          <span>&copy; {currentYear} Freaking Minds</span>
          {navigation.legal.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors duration-300"
              onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '')}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER 5: SPLIT CTA + INFO
// Left: Big CTA with newsletter. Right: Compact nav + contact + social
// ═══════════════════════════════════════════════════════════════════════════════

function FooterSplitCTA() {
  const [email, setEmail] = useState('');

  return (
    <footer className="relative" style={{ borderTop: '1px solid rgba(201, 50, 93, 0.1)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
          {/* Left — CTA Side (7 cols) */}
          <div className="lg:col-span-7 lg:pr-16">
            {/* Warm gradient accent bar */}
            <div
              className="w-16 h-1 rounded-full mb-8"
              style={{ background: 'linear-gradient(90deg, #8c1d4a, #ff7f50)' }}
            />
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 v2-text-primary"
            >
              Ready to grow
              <span style={{ color: '#8c1d4a' }}>?</span>
            </h2>
            <p className="v2-text-secondary text-lg mb-8 max-w-lg leading-relaxed">
              Join 2,000+ brands getting weekly insights on digital marketing, branding, and growth strategies.
            </p>

            {/* Email input */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 v2-text-muted" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[14px] v2-text-primary outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(201, 50, 93, 0.12)',
                    color: '#1a0a12',
                  }}
                />
              </div>
              <button
                className="px-7 py-3.5 rounded-xl font-semibold text-[14px] text-white flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110 shrink-0"
                style={{ background: 'linear-gradient(135deg, #8c1d4a, #a82548)' }}
              >
                Subscribe
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="v2-text-muted text-[11px] mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>

          {/* Vertical divider (desktop) */}
          <div className="hidden lg:block lg:col-span-1 relative">
            <div
              className="absolute top-0 bottom-0 left-1/2"
              style={{ width: '1px', background: 'rgba(201, 50, 93, 0.1)' }}
            />
          </div>

          {/* Right — Info Side (4 cols) */}
          <div className="lg:col-span-4">
            <div className="space-y-8">
              {/* Services */}
              <div>
                <h4
                  className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-4"
                  style={{ color: '#8c1d4a' }}
                >
                  Services
                </h4>
                <ul className="space-y-2">
                  {navigation.services.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="v2-text-tertiary text-[13px] transition-colors"
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4
                  className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-4"
                  style={{ color: '#8c1d4a' }}
                >
                  Company
                </h4>
                <ul className="space-y-2">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="v2-text-tertiary text-[13px] transition-colors"
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4
                  className="text-[10px] font-semibold uppercase tracking-[0.25em] mb-4"
                  style={{ color: '#8c1d4a' }}
                >
                  Contact
                </h4>
                <div className="space-y-1.5 v2-text-secondary text-[13px]">
                  <a
                    href="mailto:hello@freakingminds.in"
                    className="block transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  >
                    hello@freakingminds.in
                  </a>
                  <a
                    href="tel:+919833257659"
                    className="block transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  >
                    +91 98332 57659
                  </a>
                  <p className="v2-text-tertiary">Bhopal, India</p>
                </div>
              </div>

              {/* Social */}
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-9 h-9 rounded-lg flex items-center justify-center v2-text-tertiary transition-all duration-300"
                      style={{
                        background: 'rgba(201, 50, 93, 0.06)',
                        border: '1px solid rgba(201, 50, 93, 0.08)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#8c1d4a';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 50, 93, 0.06)';
                        e.currentTarget.style.color = '';
                      }}
                      aria-label={social.name}
                    >
                      <Icon className="w-[14px] h-[14px]" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(201, 50, 93, 0.08)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Freaking Minds"
                className="w-auto opacity-60"
                style={{ height: '1.5rem' }}
              />
              <span className="v2-text-muted text-[12px]">&copy; {currentYear} All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="v2-text-muted text-[12px] transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '')}
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


// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER 6: MEGA STACKED ROWS
// Horizontal bands, each row a distinct section, progressive disclosure
// ═══════════════════════════════════════════════════════════════════════════════

function FooterMegaStacked() {
  const [email, setEmail] = useState('');

  return (
    <footer className="relative" style={{ borderTop: '1px solid rgba(201, 50, 93, 0.1)' }}>
      {/* Row 1 — Brand Statement + CTA */}
      <div style={{ background: 'rgba(255, 255, 255, 0.25)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4" style={{ color: '#8c1d4a' }} />
                <span className="text-[11px] uppercase tracking-[0.25em] font-semibold" style={{ color: '#8c1d4a' }}>
                  Let&apos;s work together
                </span>
              </div>
              <h2
                className="font-display text-3xl md:text-4xl font-bold leading-tight v2-text-primary"
              >
                We help brands grow through{' '}
                <span
                  className="font-accent italic font-normal"
                  style={{
                    background: 'linear-gradient(135deg, #8c1d4a, #ff7f50)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  strategy, creativity & performance
                </span>
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:brightness-110 shrink-0 group"
              style={{
                background: 'linear-gradient(135deg, #8c1d4a, #a82548)',
                color: 'white',
              }}
            >
              Start a Project
              <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2 — Navigation Columns */}
      <div style={{ borderTop: '1px solid rgba(201, 50, 93, 0.08)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Services */}
            <div>
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5"
                style={{ color: '#8c1d4a' }}
              >
                Services
              </h4>
              <ul className="space-y-2.5">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="v2-text-secondary text-[14px] transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5"
                style={{ color: '#8c1d4a' }}
              >
                Company
              </h4>
              <ul className="space-y-2.5">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="v2-text-secondary text-[14px] transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5"
                style={{ color: '#8c1d4a' }}
              >
                Resources
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/blog" className="v2-text-secondary text-[14px] transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}>Blog</Link>
                </li>
                <li>
                  <Link href="/get-started" className="v2-text-secondary text-[14px] transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}>Get Started</Link>
                </li>
                <li>
                  <Link href="/creativeminds" className="v2-text-secondary text-[14px] transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}>CreativeMinds</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5"
                style={{ color: '#8c1d4a' }}
              >
                Legal
              </h4>
              <ul className="space-y-2.5">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="v2-text-secondary text-[14px] transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 — Contact + Social + Newsletter */}
      <div style={{ borderTop: '1px solid rgba(201, 50, 93, 0.08)', background: 'rgba(255, 255, 255, 0.15)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Contact */}
            <div className="space-y-2 v2-text-secondary text-[13px]">
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4"
                style={{ color: '#8c1d4a' }}
              >
                Contact
              </h4>
              <a href="mailto:hello@freakingminds.in" className="block transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}>
                hello@freakingminds.in
              </a>
              <a href="tel:+919833257659" className="block transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}>
                +91 98332 57659
              </a>
              <p className="v2-text-tertiary">Bhopal, Madhya Pradesh, India</p>
            </div>

            {/* Social */}
            <div>
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4"
                style={{ color: '#8c1d4a' }}
              >
                Follow Us
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 rounded-xl flex items-center justify-center v2-text-secondary transition-all duration-300"
                      style={{
                        background: 'rgba(201, 50, 93, 0.06)',
                        border: '1px solid rgba(201, 50, 93, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#8c1d4a';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 50, 93, 0.06)';
                        e.currentTarget.style.color = '';
                      }}
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4"
                style={{ color: '#8c1d4a' }}
              >
                Newsletter
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-[13px] outline-none transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(201, 50, 93, 0.12)',
                    color: '#1a0a12',
                  }}
                />
                <button
                  className="px-4 py-2.5 rounded-lg text-white text-[13px] font-medium transition-all hover:brightness-110"
                  style={{ background: '#8c1d4a' }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 — Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(201, 50, 93, 0.08)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Freaking Minds"
                className="w-auto opacity-60"
                style={{ height: '1.5rem' }}
              />
              <span className="v2-text-muted text-[12px]">
                &copy; {currentYear} Freaking Minds. All rights reserved.
              </span>
            </div>
            <span className="v2-text-muted text-[11px]">
              Crafted with care in Bhopal, India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// SHOWCASE PAGE
// ═══════════════════════════════════════════════════════════════════════════════

const footerStyles = [
  {
    id: 'editorial-serif',
    name: 'Editorial Serif',
    desc: 'Magazine-like elegance with a large Playfair Display headline, Instrument Serif accents, generous whitespace, and minimal spread-out navigation. Think Vogue meets digital agency.',
    component: FooterEditorialSerif,
  },
  {
    id: 'brutalist-bold',
    name: 'Brutalist Bold',
    desc: 'Oversized "FREAKING MINDS" typography, visible geometric grid borders, uppercase everything, high-contrast magenta accent blocks. Raw, bold, unapologetic.',
    component: FooterBrutalistBold,
  },
  {
    id: 'glassmorphic-cards',
    name: 'Glassmorphic Cards',
    desc: 'Each section lives in its own frosted white glass card. Subtle magenta glow on hover. Depth and layering with soft translucency.',
    component: FooterGlassmorphicCards,
  },
  {
    id: 'minimal-zen',
    name: 'Minimal Zen',
    desc: 'Ultra-clean centered single-column layout. Logo, nav links, social icons, and copyright stacked vertically with hairline dividers and maximum breathing room.',
    component: FooterMinimalZen,
  },
  {
    id: 'split-cta',
    name: 'Split CTA + Info',
    desc: 'Left side dominates with a big "Ready to grow?" headline and newsletter signup. Right side compactly stacks navigation, contact info, and social links.',
    component: FooterSplitCTA,
  },
  {
    id: 'mega-stacked',
    name: 'Mega Stacked Rows',
    desc: 'Horizontal band layout — brand statement, navigation columns, contact + social + newsletter, and bottom bar. Each row has its own subtle background treatment.',
    component: FooterMegaStacked,
  },
];

export default function FooterShowcasePage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: `
          linear-gradient(135deg,
            #fef5f8 0%, #fce8ef 10%, #f9dce6 20%, #f5d0de 30%,
            #f2c6d7 40%, #f0bfd2 50%, #f2c6d7 60%, #f5d0de 70%,
            #f9dce6 80%, #fce8ef 90%, #fef5f8 100%
          )
        `,
      }}
    >
      {/* Page Header */}
      <div style={{ borderBottom: '1px solid rgba(201, 50, 93, 0.1)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm v2-text-muted mb-8 transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1d4a')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
          </Link>
          <h1
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-5 v2-text-primary"
          >
            Footer <span style={{ color: '#8c1d4a' }}>Showcase</span>
          </h1>
          <p className="v2-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed">
            6 distinct footer designs for FreakingMinds. Each uses the same content
            and brand system but takes a completely different layout and aesthetic approach.
          </p>
        </div>
      </div>

      {/* Footer Previews */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-12 space-y-20">
        {footerStyles.map((style, index) => (
          <div key={style.id}>
            {/* Label */}
            <div className="flex items-start gap-5 mb-6">
              <span
                className="text-[13px] font-mono font-bold shrink-0 mt-1"
                style={{ color: '#8c1d4a' }}
              >
                0{index + 1}
              </span>
              <div>
                <h2 className="text-xl font-bold v2-text-primary mb-1">{style.name}</h2>
                <p className="v2-text-tertiary text-sm max-w-xl leading-relaxed">{style.desc}</p>
              </div>
            </div>

            {/* Preview Container */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: '1px solid rgba(201, 50, 93, 0.1)',
                background: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 24px rgba(201, 50, 93, 0.04)',
              }}
            >
              <style.component />
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Section */}
      <div style={{ borderTop: '1px solid rgba(201, 50, 93, 0.1)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16">
          <h2 className="font-display text-2xl font-bold v2-text-primary mb-8">Pick Your Style</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(201,50,93,0.06), rgba(201,50,93,0.02))',
                border: '1px solid rgba(201,50,93,0.12)',
              }}
            >
              <h3 className="font-bold v2-text-primary text-lg mb-2">Premium & Elegant</h3>
              <p className="v2-text-tertiary text-sm leading-relaxed">
                <strong className="v2-text-primary">Editorial Serif</strong> or <strong className="v2-text-primary">Minimal Zen</strong> for
                a refined, high-end feel with generous whitespace.
              </p>
            </div>
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.35)',
                border: '1px solid rgba(201, 50, 93, 0.08)',
              }}
            >
              <h3 className="font-bold v2-text-primary text-lg mb-2">Bold & Distinctive</h3>
              <p className="v2-text-tertiary text-sm leading-relaxed">
                <strong className="v2-text-primary">Brutalist Bold</strong> or <strong className="v2-text-primary">Glassmorphic Cards</strong> for
                maximum visual impact and memorability.
              </p>
            </div>
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.35)',
                border: '1px solid rgba(201, 50, 93, 0.08)',
              }}
            >
              <h3 className="font-bold v2-text-primary text-lg mb-2">Functional & Complete</h3>
              <p className="v2-text-tertiary text-sm leading-relaxed">
                <strong className="v2-text-primary">Split CTA</strong> or <strong className="v2-text-primary">Mega Stacked</strong> for
                maximum content density with newsletter capture built in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

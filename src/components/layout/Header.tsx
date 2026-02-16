'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navigation = [
  { name: 'Work', href: '/work' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'CreativeMinds', href: '/creativeminds' },
  { name: 'Blog', href: '/blog' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Scroll handler
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  // Handle escape key for mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Check if link is active
  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-fm-magenta-600 text-white px-4 py-2 rounded-full z-[60] text-sm"
      >
        Skip to main content
      </a>

      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled || isMobileMenuOpen
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Brand Logo */}
            <Link
              href="/"
              className="relative z-10 group"
              aria-label="Freaking Minds - Home"
            >
              <img
                src="/logo.png"
                alt="Freaking Minds"
                width={140}
                height={32}
                className="h-8 w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-8 lg:gap-10"
              role="navigation"
              aria-label="Main navigation"
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative py-2"
                  aria-current={isLinkActive(item.href) ? 'page' : undefined}
                >
                  <span
                    className={cn(
                      'text-sm font-medium tracking-wide transition-colors duration-300',
                      isLinkActive(item.href)
                        ? 'text-fm-magenta-600'
                        : 'text-fm-neutral-600 group-hover:text-fm-neutral-900'
                    )}
                  >
                    {item.name}
                  </span>
                  {/* Animated underline */}
                  <span
                    className={cn(
                      'absolute -bottom-0 left-0 h-[2px] bg-fm-magenta-600 transition-all duration-300 ease-out',
                      isLinkActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Link
                href="/contact"
                className="v2-btn v2-btn-magenta v2-btn-sm group"
              >
                <span className="relative z-10">Get in Touch</span>
                <ArrowUpRight className="relative z-10 w-4 h-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative z-10 p-2 -mr-2 transition-colors duration-300 text-fm-neutral-900 focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden fixed inset-0 top-20 bg-white transition-all duration-500 ease-out',
            isMobileMenuOpen
              ? 'opacity-100 visible'
              : 'opacity-0 invisible'
          )}
        >
          <div className="max-w-[1400px] mx-auto px-6 py-12 h-full flex flex-col">
            <nav className="flex flex-col gap-2">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-3xl font-bold tracking-tight py-3 transition-all duration-500',
                    isLinkActive(item.href)
                      ? 'text-fm-magenta-600'
                      : 'text-fm-neutral-900 hover:text-fm-magenta-600',
                    isMobileMenuOpen
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  )}
                  style={{
                    fontFamily: 'var(--font-display)',
                    transitionDelay: isMobileMenuOpen ? `${index * 50 + 100}ms` : '0ms'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile CTA */}
            <div
              className={cn(
                'mt-auto pt-8 border-t border-fm-neutral-200 transition-all duration-500',
                isMobileMenuOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: isMobileMenuOpen ? '350ms' : '0ms' }}
            >
              <Link
                href="/contact"
                className="v2-btn v2-btn-magenta v2-btn-lg group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-5 h-5" />
              </Link>

              <div className="mt-8 text-sm text-fm-neutral-500">
                <a href="mailto:freakingmindsdigital@gmail.com" className="hover:text-fm-magenta-600 transition-colors">
                  freakingmindsdigital@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

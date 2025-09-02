'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LinkButton } from '@/design-system';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';

// Navigation configuration with potential dropdowns
const navigation = [
  { name: 'Home', href: '/' },
  { 
    name: 'Services', 
    href: '/services',
    dropdown: [
      { name: 'SEO & Search Marketing', href: '/services#seo' },
      { name: 'Social Media Management', href: '/services#social-media' },
      { name: 'Performance Marketing', href: '/services#performance' },
      { name: 'Creative Design', href: '/services#design' },
      { name: 'Digital Strategy', href: '/services#strategy' },
      { name: '──────────', href: '#', divider: true },
      { name: 'Partner Network', href: '/creativeminds' },
    ]
  },
  { name: 'Work', href: '/work' },
  { name: 'About', href: '/about' },
  { name: 'CreativeMinds', href: '/creativeminds' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

// Throttle function for scroll performance
function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return function (this: unknown, ...args: Parameters<T>) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const throttledFunction = throttle(() => {
      setIsScrolled(window.scrollY > 20);
    }, 100);
    return throttledFunction();
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
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Scroll listener with cleanup
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Check if link is active
  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Header background classes with improved visibility
  const headerClasses = cn(
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    isScrolled || isMobileMenuOpen
      ? 'bg-fm-neutral-50/95 backdrop-blur-md shadow-fm-md border-b border-fm-neutral-200'
      : 'bg-fm-neutral-50/80 backdrop-blur-sm'
  );

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-fm-magenta-700 text-white px-4 py-2 rounded-md z-[60]"
      >
        Skip to main content
      </a>

      <header 
        ref={headerRef}
        className={headerClasses}
        role="banner"
      >
        <div className="fm-container">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link 
              href="/" 
              className="flex-shrink-0 relative z-10 flex items-center"
              aria-label="Freaking Minds - Home"
            >
              <img 
                src="/logo.png" 
                alt="Freaking Minds" 
                className="h-14 md:h-16 w-auto transition-all duration-200 hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation with dropdowns */}
            <nav 
              className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8"
              role="navigation"
              aria-label="Main navigation"
            >
              {navigation.map((item) => (
                <div 
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'relative inline-flex items-center gap-1 px-2 py-3 text-base lg:text-lg font-medium transition-all duration-200',
                      isLinkActive(item.href)
                        ? 'text-fm-magenta-700'
                        : 'text-fm-neutral-900 hover:text-fm-magenta-700',
                    )}
                    aria-current={isLinkActive(item.href) ? 'page' : undefined}
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown className={cn(
                        'w-3 h-3 transition-transform duration-200',
                        activeDropdown === item.name && 'rotate-180'
                      )} />
                    )}
                    {/* Active indicator */}
                    {isLinkActive(item.href) && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-fm-magenta-700 rounded-full" />
                    )}
                  </Link>

                  {/* Dropdown menu */}
                  {item.dropdown && (
                    <div className={cn(
                      'absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-fm-lg border border-fm-neutral-200 opacity-0 invisible translate-y-2 transition-all duration-200',
                      activeDropdown === item.name && 'opacity-100 visible translate-y-0'
                    )}>
                      <div className="py-2">
                        {item.dropdown.map((subItem, index) => {
                          // Handle divider
                          if (subItem.divider) {
                            return (
                              <div key={`divider-${index}`} className="mx-4 my-2 border-t border-fm-neutral-200" />
                            );
                          }
                          
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2.5 text-sm text-fm-neutral-700 hover:bg-fm-magenta-50 hover:text-fm-magenta-700 transition-colors duration-150"
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center">
              <LinkButton href="/get-started" variant="primary" size="lg">
                Start Project
              </LinkButton>
            </div>

            {/* Mobile Menu Button with better touch target */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'md:hidden relative z-10 p-3 -mr-3 rounded-md transition-colors duration-200',
                'text-fm-neutral-900 hover:text-fm-magenta-700',
                'focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2'
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close' : 'Open'} navigation menu</span>
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu with better animations and accessibility */}
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className={cn(
            'md:hidden fixed inset-x-0 top-20 bg-fm-neutral-50 border-t border-fm-neutral-200 shadow-fm-xl transition-all duration-300 ease-in-out',
            isMobileMenuOpen 
              ? 'opacity-100 translate-y-0 visible max-h-[calc(100vh-5rem)]' 
              : 'opacity-0 -translate-y-4 invisible max-h-0'
          )}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="fm-container py-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <nav 
              className="flex flex-col space-y-1"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-4 py-4 rounded-lg text-lg font-medium transition-all duration-200',
                      isLinkActive(item.href)
                        ? 'bg-fm-magenta-50 text-fm-magenta-700'
                        : 'text-fm-neutral-900 hover:bg-fm-neutral-100 hover:text-fm-magenta-700'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isLinkActive(item.href) ? 'page' : undefined}
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Link>
                  
                  {/* Mobile dropdown items */}
                  {item.dropdown && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.dropdown.map((subItem, index) => {
                        // Handle divider
                        if (subItem.divider) {
                          return (
                            <div key={`mobile-divider-${index}`} className="mx-4 my-2 border-t border-fm-neutral-200" />
                          );
                        }
                        
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-fm-neutral-600 hover:text-fm-magenta-700 transition-colors duration-150"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile CTA */}
              <div className="pt-6 mt-6 border-t border-fm-neutral-200">
                <LinkButton href="/get-started" variant="primary" size="lg" fullWidth>
                  Start Project
                </LinkButton>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
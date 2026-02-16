'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import { serviceDeepDiveData } from '@/data/serviceDeepDiveData';
import { SlideNavigation } from './SlideNavigation';
import { HookSlide } from './slides/HookSlide';
import { WhatWeDoSlide } from './slides/WhatWeDoSlide';
import { WhoItsForSlide } from './slides/WhoItsForSlide';
import { HowItWorksSlide } from './slides/HowItWorksSlide';
import { ResultsCTASlide } from './slides/ResultsCTASlide';

const TOTAL_SLIDES = 5;
const SWIPE_THRESHOLD = 60;

interface ServiceDeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | null;
}

export function ServiceDeepDiveModal({ isOpen, onClose, serviceId }: ServiceDeepDiveModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef<number>(0);

  // Swipe tracking — track both axes to distinguish scroll from swipe
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchLockedRef = useRef<'horizontal' | 'vertical' | null>(null);

  const service = serviceId
    ? serviceDeepDiveData.find((s) => s.serviceId === serviceId)
    : null;

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Portal mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset slide when a new service opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen, serviceId]);

  // iOS-safe scroll lock + focus management
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    // iOS Safari: overflow:hidden on body doesn't prevent rubber-band scrolling.
    // Fix: pin the body with position:fixed and save/restore scroll position.
    scrollYRef.current = window.scrollY;
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.overflow = 'hidden';

    // Focus close button after enter animation
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, prefersReducedMotion ? 0 : 350);

    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.overflow = '';
      window.scrollTo(0, scrollYRef.current);
      clearTimeout(timer);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, prefersReducedMotion]);

  // GSAP enter animation
  useEffect(() => {
    if (!isOpen || !overlayRef.current || !panelRef.current) return;

    if (prefersReducedMotion) {
      gsap.set(overlayRef.current, { opacity: 1 });
      gsap.set(panelRef.current, { opacity: 1, scale: 1 });
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
    tl.fromTo(
      panelRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' },
      '-=0.15'
    );
  }, [isOpen, prefersReducedMotion]);

  // Animate close
  const animateClose = useCallback(() => {
    if (prefersReducedMotion || !overlayRef.current || !panelRef.current) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: onClose,
    });
    tl.to(panelRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.25,
      ease: 'power2.in',
    });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1');
  }, [onClose, prefersReducedMotion]);

  // Slide transition
  const animateSlideTransition = useCallback(
    (direction: 'left' | 'right') => {
      if (!slideRef.current || prefersReducedMotion) return;

      const xOut = direction === 'right' ? -40 : 40;
      const xIn = direction === 'right' ? 40 : -40;

      gsap.timeline()
        .to(slideRef.current, {
          opacity: 0,
          x: xOut,
          duration: 0.2,
          ease: 'power2.in',
        })
        .set(slideRef.current, { x: xIn })
        .to(slideRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.25,
          ease: 'power2.out',
        });
    },
    [prefersReducedMotion]
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentSlide || index < 0 || index >= TOTAL_SLIDES) return;
      const direction = index > currentSlide ? 'right' : 'left';
      animateSlideTransition(direction);
      setTimeout(
        () => setCurrentSlide(index),
        prefersReducedMotion ? 0 : 200
      );
    },
    [currentSlide, animateSlideTransition, prefersReducedMotion]
  );

  const goNext = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const goPrev = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        animateClose();
      } else if (e.key === 'ArrowRight') {
        goNext();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, animateClose, goNext, goPrev]);

  // Touch swipe — only trigger if horizontal intent is clear (not scrolling)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchLockedRef.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchLockedRef.current) return; // Already locked

    const dx = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStartRef.current.y);

    // Lock direction once user has moved enough
    if (dx > 10 || dy > 10) {
      touchLockedRef.current = dx > dy ? 'horizontal' : 'vertical';
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      // Only handle horizontal swipes — don't hijack scroll
      if (touchLockedRef.current !== 'horizontal') return;

      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      if (deltaX < -SWIPE_THRESHOLD) {
        goNext();
      } else if (deltaX > SWIPE_THRESHOLD) {
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  // Render slide content
  const renderSlide = () => {
    if (!service) return null;

    switch (currentSlide) {
      case 0:
        return (
          <HookSlide
            data={service.hook}
            icon={service.icon}
            colorClass={service.colorClass}
            accentColorRgb={service.accentColorRgb}
          />
        );
      case 1:
        return (
          <WhatWeDoSlide
            data={service.whatWeDo}
            accentColorRgb={service.accentColorRgb}
          />
        );
      case 2:
        return (
          <WhoItsForSlide
            data={service.whoItsFor}
            accentColorRgb={service.accentColorRgb}
          />
        );
      case 3:
        return (
          <HowItWorksSlide
            data={service.howItWorks}
            accentColorRgb={service.accentColorRgb}
          />
        );
      case 4:
        return (
          <ResultsCTASlide
            data={service.resultsCTA}
            accentColorRgb={service.accentColorRgb}
          />
        );
      default:
        return null;
    }
  };

  if (!mounted || !isOpen || !service) return null;

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${service.title} - Deep Dive`}
    >
      {/* Overlay — no backdrop-filter per MEMORY.md */}
      <div
        ref={overlayRef}
        className="fixed inset-0"
        style={{ zIndex: 9999, background: 'rgba(0, 0, 0, 0.6)' }}
        onClick={animateClose}
        aria-hidden="true"
      />

      {/* Panel wrapper — centers the modal, handles safe areas on mobile */}
      <div
        className="fixed inset-0 flex items-center justify-center p-0 md:p-6"
        style={{ zIndex: 10000, pointerEvents: 'none' }}
      >
        {/*
          Panel — uses bg-white + shadow instead of v2-paper to avoid
          the v2-paper :hover { transform: translateY(-2px) } effect
          which makes the modal panel bounce on hover.
          iOS safe areas: top padding for Dynamic Island/notch,
          bottom padding for home indicator — only on mobile full-screen.
        */}
        <div
          ref={panelRef}
          className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-3xl overflow-hidden flex flex-col"
          style={{
            pointerEvents: 'auto',
            background: 'var(--v2-paper-bg, #ffffff)',
            boxShadow: '0 25px 50px -12px rgba(140, 29, 74, 0.15), 0 0 0 1px rgba(140, 29, 74, 0.03)',
            paddingTop: 'env(safe-area-inset-top, 0px)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button — offset for safe area on notched phones */}
          <button
            ref={closeButtonRef}
            onClick={animateClose}
            className="absolute right-3 md:right-4 w-11 h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-fm-neutral-100 hover:bg-fm-neutral-200 transition-colors"
            style={{
              zIndex: 1,
              top: 'max(12px, env(safe-area-inset-top, 12px))',
            }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-fm-neutral-600" />
          </button>

          {/* Slide content — scrollable */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
          >
            <div ref={slideRef}>
              {renderSlide()}
            </div>
          </div>

          {/* Navigation — safe area bottom padding for iOS home indicator */}
          <div
            className="border-t border-fm-neutral-100 bg-white"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <SlideNavigation
              currentSlide={currentSlide}
              totalSlides={TOTAL_SLIDES}
              onPrev={goPrev}
              onNext={goNext}
              onGoTo={goToSlide}
              accentColorRgb={service.accentColorRgb}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

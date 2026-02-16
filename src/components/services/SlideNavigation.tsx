'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDE_LABELS = ['Overview', 'What We Do', 'Who It\'s For', 'How It Works', 'Results'];

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  accentColorRgb: string;
}

export function SlideNavigation({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onGoTo,
  accentColorRgb,
}: SlideNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 py-3 sm:py-4">
      {/* Previous button — 44px minimum touch target */}
      <button
        onClick={onPrev}
        disabled={currentSlide === 0}
        className="w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-fm-neutral-200 transition-colors hover:bg-fm-neutral-50 active:bg-fm-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 text-fm-neutral-600" />
      </button>

      {/* Dots — each has a 44px hit area even though the dot is visually small */}
      <div className="flex items-center gap-0">
        {Array.from({ length: totalSlides }, (_, i) => (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            className="relative flex items-center justify-center"
            style={{ width: '32px', height: '44px' }}
            aria-label={`Go to slide ${i + 1}: ${SLIDE_LABELS[i] ?? ''}`}
            aria-current={currentSlide === i ? 'step' : undefined}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: currentSlide === i ? '20px' : '8px',
                height: '8px',
                background:
                  currentSlide === i
                    ? `rgba(${accentColorRgb}, 1)`
                    : `rgba(${accentColorRgb}, 0.2)`,
              }}
            />
          </button>
        ))}
      </div>

      {/* Next button — 44px minimum touch target */}
      <button
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        className="w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-fm-neutral-200 transition-colors hover:bg-fm-neutral-50 active:bg-fm-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 text-fm-neutral-600" />
      </button>
    </div>
  );
}

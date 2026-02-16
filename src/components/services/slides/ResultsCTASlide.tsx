'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ResultsCTAData } from '@/data/serviceDeepDiveData';

interface ResultsCTASlideProps {
  data: ResultsCTAData;
  accentColorRgb: string;
}

export function ResultsCTASlide({ data, accentColorRgb }: ResultsCTASlideProps) {
  return (
    <div className="flex flex-col items-center px-4 sm:px-6 py-8 md:py-12">
      {/* Section title */}
      <h3
        className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-fm-neutral-900"
        style={{ textAlign: 'center', marginBottom: '8px' }}
      >
        Results You Can Expect
      </h3>
      <p
        className="text-fm-neutral-600 text-sm sm:text-base leading-relaxed"
        style={{ textAlign: 'center', marginBottom: '28px' }}
      >
        Real numbers from real client engagements.
      </p>

      {/* Metric cards — stack on very small screens, 3 cols on sm+ */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-xl"
        style={{ marginBottom: '36px' }}
      >
        {data.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl p-4 sm:p-5 md:p-6"
            style={{
              textAlign: 'center',
              background: `rgba(${accentColorRgb}, 0.06)`,
              border: `1px solid rgba(${accentColorRgb}, 0.12)`,
            }}
          >
            <div
              className="font-display text-2xl sm:text-2xl md:text-3xl font-bold"
              style={{ color: `rgba(${accentColorRgb}, 1)`, marginBottom: '4px' }}
            >
              {metric.value}
            </div>
            <p className="text-xs sm:text-sm text-fm-neutral-600">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <p
        className="text-fm-neutral-600 text-sm sm:text-base leading-relaxed max-w-md"
        style={{ textAlign: 'center', marginBottom: '20px' }}
      >
        {data.ctaDescription}
      </p>
      <Link href="/contact" className="v2-btn v2-btn-magenta">
        {data.ctaText}
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}

'use client';

import type { WhatWeDoData } from '@/data/serviceDeepDiveData';
import { CheckCircle2 } from 'lucide-react';

interface WhatWeDoSlideProps {
  data: WhatWeDoData;
  accentColorRgb: string;
}

export function WhatWeDoSlide({ data, accentColorRgb }: WhatWeDoSlideProps) {
  return (
    <div className="px-4 sm:px-6 py-8 md:py-12">
      {/* Section title */}
      <h3
        className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-fm-neutral-900"
        style={{ textAlign: 'center', marginBottom: '8px' }}
      >
        What We Do
      </h3>
      <p
        className="text-fm-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
        style={{ textAlign: 'center', marginBottom: '28px' }}
      >
        {data.intro}
      </p>

      {/* 3-pillar grid — stacks on mobile, 3 cols on md+ */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {data.pillars.map((pillar) => {
          const PillarIcon = pillar.icon;
          return (
            <div
              key={pillar.name}
              className="rounded-xl border border-fm-neutral-100 p-4 sm:p-5 md:p-6"
              style={{ background: `rgba(${accentColorRgb}, 0.04)` }}
            >
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: `rgba(${accentColorRgb}, 0.12)`,
                  marginBottom: '10px',
                }}
              >
                <PillarIcon
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: `rgba(${accentColorRgb}, 1)` }}
                />
              </div>
              <h4 className="font-display text-base sm:text-lg font-bold text-fm-neutral-900" style={{ marginBottom: '10px' }}>
                {pillar.name}
              </h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {pillar.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5"
                      style={{ color: `rgba(${accentColorRgb}, 0.7)` }}
                    />
                    <span className="text-xs sm:text-sm text-fm-neutral-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import type { HowItWorksData } from '@/data/serviceDeepDiveData';

interface HowItWorksSlideProps {
  data: HowItWorksData;
  accentColorRgb: string;
}

export function HowItWorksSlide({ data, accentColorRgb }: HowItWorksSlideProps) {
  return (
    <div className="px-4 sm:px-6 py-8 md:py-12">
      {/* Section title */}
      <h3
        className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-fm-neutral-900"
        style={{ textAlign: 'center', marginBottom: '8px' }}
      >
        How It Works
      </h3>
      <p
        className="text-fm-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
        style={{ textAlign: 'center', marginBottom: '28px' }}
      >
        {data.intro}
      </p>

      {/* Timeline */}
      <div className="max-w-2xl mx-auto space-y-0">
        {data.steps.map((step, index) => {
          const StepIcon = step.icon;
          return (
            <div key={step.title} className="flex gap-3 sm:gap-4">
              {/* Left: number + line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs sm:text-sm"
                  style={{ background: `rgba(${accentColorRgb}, 1)` }}
                >
                  {index + 1}
                </div>
                {index < data.steps.length - 1 && (
                  <div
                    className="w-0.5 flex-1"
                    style={{
                      background: `rgba(${accentColorRgb}, 0.15)`,
                      minHeight: '20px',
                    }}
                  />
                )}
              </div>

              {/* Right: content — title and badge wrap onto separate lines on small screens */}
              <div style={{ paddingBottom: index < data.steps.length - 1 ? '20px' : '0', minWidth: 0 }}>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" style={{ marginBottom: '4px' }}>
                  <StepIcon
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                    style={{ color: `rgba(${accentColorRgb}, 0.7)` }}
                  />
                  <h4 className="font-display text-sm sm:text-base font-bold text-fm-neutral-900">
                    {step.title}
                  </h4>
                  <span
                    className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      background: `rgba(${accentColorRgb}, 0.1)`,
                      color: `rgba(${accentColorRgb}, 0.8)`,
                    }}
                  >
                    {step.duration}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-fm-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

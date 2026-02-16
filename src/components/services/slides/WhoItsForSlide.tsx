'use client';

import type { WhoItsForData } from '@/data/serviceDeepDiveData';

interface WhoItsForSlideProps {
  data: WhoItsForData;
  accentColorRgb: string;
}

export function WhoItsForSlide({ data, accentColorRgb }: WhoItsForSlideProps) {
  return (
    <div className="px-4 sm:px-6 py-8 md:py-12">
      {/* Section title */}
      <h3
        className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-fm-neutral-900"
        style={{ textAlign: 'center', marginBottom: '8px' }}
      >
        Who It&apos;s For
      </h3>
      <p
        className="text-fm-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
        style={{ textAlign: 'center', marginBottom: '28px' }}
      >
        {data.intro}
      </p>

      {/* Persona grid — 1 col on mobile, 2×2 on sm+ */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
        {data.personas.map((persona) => {
          const PersonaIcon = persona.icon;
          return (
            <div
              key={persona.title}
              className="rounded-xl border border-fm-neutral-100 p-4 sm:p-5"
            >
              <div className="flex items-center gap-3" style={{ marginBottom: '8px' }}>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(${accentColorRgb}, 0.12)` }}
                >
                  <PersonaIcon
                    className="w-4 h-4"
                    style={{ color: `rgba(${accentColorRgb}, 1)` }}
                  />
                </div>
                <h4 className="font-display text-sm sm:text-base font-bold text-fm-neutral-900">
                  {persona.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-fm-neutral-600 leading-relaxed" style={{ marginBottom: '6px' }}>
                {persona.description}
              </p>
              <p
                className="text-xs font-medium italic"
                style={{ color: `rgba(${accentColorRgb}, 0.8)` }}
              >
                &ldquo;{persona.painPoint}&rdquo;
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

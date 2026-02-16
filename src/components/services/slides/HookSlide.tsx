'use client';

import type { HookData, LucideIcon } from '@/data/serviceDeepDiveData';

interface HookSlideProps {
  data: HookData;
  icon: LucideIcon;
  colorClass: string;
  accentColorRgb: string;
}

export function HookSlide({ data, icon: Icon, colorClass, accentColorRgb }: HookSlideProps) {
  return (
    <div className="flex flex-col items-center px-4 sm:px-6 py-8 md:py-12">
      {/* Service icon */}
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${colorClass} flex items-center justify-center shadow-lg`}
        style={{ marginBottom: '20px' }}
      >
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
      </div>

      {/* Headline */}
      <h2
        className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-fm-neutral-900 leading-tight"
        style={{ textAlign: 'center', marginBottom: '10px' }}
      >
        {data.headline}
      </h2>

      {/* Tagline */}
      <p
        className="text-fm-magenta-600 font-semibold text-xs sm:text-sm tracking-wide uppercase"
        style={{ marginBottom: '20px' }}
      >
        {data.tagline}
      </p>

      {/* Problem statement */}
      <p
        className="text-fm-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl"
        style={{ textAlign: 'center', marginBottom: '28px' }}
      >
        {data.problemStatement}
      </p>

      {/* Stat callout — plain div, no v2-paper hover */}
      <div
        className="rounded-2xl px-5 sm:px-8 py-5 sm:py-6 max-w-sm w-full"
        style={{
          textAlign: 'center',
          borderLeft: `4px solid rgba(${accentColorRgb}, 0.6)`,
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(140,29,74,0.06)',
        }}
      >
        <div
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold"
          style={{ color: `rgba(${accentColorRgb}, 1)`, marginBottom: '4px' }}
        >
          {data.stat}
        </div>
        <p className="text-fm-neutral-600 text-xs sm:text-sm">{data.statLabel}</p>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { ArrowRight, Sparkles, Star, Zap, Heart, Check } from 'lucide-react';

// Accent color options to test
const accentColors = [
  {
    name: 'Current (Magenta-Orange Gradient)',
    textClass: 'bg-gradient-to-r from-fm-magenta-300 via-fm-magenta-400 to-fm-orange-300 bg-clip-text text-transparent',
    bgClass: 'bg-gradient-to-r from-fm-magenta-400 to-fm-orange-400',
    hex: '#f4a9c4 → #ffc4a8',
  },
  {
    name: 'Warm Gold',
    textClass: 'text-amber-300',
    bgClass: 'bg-amber-400',
    hex: '#fcd34d',
  },
  {
    name: 'Soft Peach',
    textClass: 'text-orange-200',
    bgClass: 'bg-orange-300',
    hex: '#fed7aa',
  },
  {
    name: 'Coral Pink',
    textClass: 'text-rose-300',
    bgClass: 'bg-rose-400',
    hex: '#fda4af',
  },
  {
    name: 'Electric Cyan',
    textClass: 'text-cyan-300',
    bgClass: 'bg-cyan-400',
    hex: '#67e8f9',
  },
  {
    name: 'Mint Green',
    textClass: 'text-emerald-300',
    bgClass: 'bg-emerald-400',
    hex: '#6ee7b7',
  },
  {
    name: 'Lavender',
    textClass: 'text-violet-300',
    bgClass: 'bg-violet-400',
    hex: '#c4b5fd',
  },
  {
    name: 'Pure White',
    textClass: 'text-white',
    bgClass: 'bg-white',
    hex: '#ffffff',
  },
  {
    name: 'Cream',
    textClass: 'text-amber-50',
    bgClass: 'bg-amber-50',
    hex: '#fffbeb',
  },
  {
    name: 'Sky Blue',
    textClass: 'text-sky-300',
    bgClass: 'bg-sky-400',
    hex: '#7dd3fc',
  },
  {
    name: 'Lime',
    textClass: 'text-lime-300',
    bgClass: 'bg-lime-400',
    hex: '#bef264',
  },
  {
    name: 'Hot Pink',
    textClass: 'text-pink-300',
    bgClass: 'bg-pink-400',
    hex: '#f9a8d4',
  },
];

// Button style variations
const buttonStyles = [
  {
    name: 'White (Current Primary)',
    className: 'bg-white text-fm-magenta-700 hover:bg-fm-neutral-50',
  },
  {
    name: 'Gold Accent',
    className: 'bg-amber-400 text-amber-950 hover:bg-amber-300',
  },
  {
    name: 'Coral Accent',
    className: 'bg-rose-400 text-white hover:bg-rose-300',
  },
  {
    name: 'Cyan Accent',
    className: 'bg-cyan-400 text-cyan-950 hover:bg-cyan-300',
  },
  {
    name: 'Mint Accent',
    className: 'bg-emerald-400 text-emerald-950 hover:bg-emerald-300',
  },
  {
    name: 'Cream Accent',
    className: 'bg-amber-50 text-fm-magenta-700 hover:bg-white',
  },
];

// Badge style variations
const badgeStyles = [
  {
    name: 'Glass (Current)',
    className: 'bg-white/10 border border-white/20 text-white',
  },
  {
    name: 'Gold Glass',
    className: 'bg-amber-400/20 border border-amber-400/30 text-amber-200',
  },
  {
    name: 'Cyan Glass',
    className: 'bg-cyan-400/20 border border-cyan-400/30 text-cyan-200',
  },
  {
    name: 'Mint Glass',
    className: 'bg-emerald-400/20 border border-emerald-400/30 text-emerald-200',
  },
  {
    name: 'Solid White',
    className: 'bg-white text-fm-magenta-700',
  },
  {
    name: 'Solid Gold',
    className: 'bg-amber-400 text-amber-950',
  },
];

export default function AccentColorsShowcase() {
  return (
    <main className="min-h-screen relative">
      {/* V2 Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            linear-gradient(135deg,
              #0f0510 0%,
              #1f0e22 10%,
              #28122c 20%,
              #301535 30%,
              #38183d 40%,
              #401b44 50%,
              #38183d 60%,
              #301535 70%,
              #28122c 80%,
              #1f0e22 90%,
              #0f0510 100%
            )
          `,
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Accent Color Showcase
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Testing different accent colors on the V2 magenta background to find the best combinations.
          </p>
        </div>

        {/* Section 1: Text Accents */}
        <section style={{ marginBottom: '96px' }}>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Star className="w-6 h-6 text-amber-400" />
            Text Accent Colors
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accentColors.map((color) => (
              <div
                key={color.name}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="text-xs text-white/40 uppercase tracking-wider mb-2">
                  {color.name}
                </div>
                <div className="text-sm text-white/50 mb-4 font-mono">
                  {color.hex}
                </div>
                <h3 className={`font-display text-2xl font-bold mb-2 ${color.textClass}`}>
                  Highlighted Text
                </h3>
                <p className="text-white/70 text-sm">
                  Services That <span className={`font-semibold ${color.textClass}`}>Actually Deliver</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Headline Examples */}
        <section style={{ marginBottom: '96px' }}>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Headline Examples
          </h2>

          <div className="space-y-8">
            {accentColors.slice(0, 6).map((color) => (
              <div
                key={color.name}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <div className="text-xs text-white/40 uppercase tracking-wider mb-4">
                  {color.name}
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
                  Ready to Transform Your{' '}
                  <span className={color.textClass}>Digital Presence</span>?
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Button Variations */}
        <section style={{ marginBottom: '96px' }}>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400" />
            Button Variations
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buttonStyles.map((style) => (
              <div
                key={style.name}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="text-xs text-white/40 uppercase tracking-wider mb-4">
                  {style.name}
                </div>
                <button
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${style.className}`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Button pairs */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-white mb-6">Button Pairs (Primary + Secondary)</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* White + Glass */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-4">
                  White + Glass (Current)
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="v2-btn v2-btn-primary">
                    Primary CTA
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="v2-btn v2-btn-secondary">
                    Secondary
                  </button>
                </div>
              </div>

              {/* Gold + Glass */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-4">
                  Gold + Glass
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-amber-400 text-amber-950 hover:bg-amber-300 transition-all">
                    Primary CTA
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="v2-btn v2-btn-secondary">
                    Secondary
                  </button>
                </div>
              </div>

              {/* Cream + Glass */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-4">
                  Cream + Glass
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-amber-50 text-fm-magenta-700 hover:bg-white transition-all">
                    Primary CTA
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="v2-btn v2-btn-secondary">
                    Secondary
                  </button>
                </div>
              </div>

              {/* Cyan + Glass */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-4">
                  Cyan + Glass
                </div>
                <div className="flex flex-wrap gap-4">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-cyan-400 text-cyan-950 hover:bg-cyan-300 transition-all">
                    Primary CTA
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="v2-btn v2-btn-secondary">
                    Secondary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Badge Variations */}
        <section style={{ marginBottom: '96px' }}>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Heart className="w-6 h-6 text-amber-400" />
            Badge Variations
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgeStyles.map((style) => (
              <div
                key={style.name}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="text-xs text-white/40 uppercase tracking-wider mb-4">
                  {style.name}
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${style.className}`}>
                  <Sparkles className="w-4 h-4" />
                  What We Do Best
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Full CTA Card Examples */}
        <section style={{ marginBottom: '96px' }}>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Check className="w-6 h-6 text-amber-400" />
            Full CTA Card Examples
          </h2>

          <div className="space-y-8">
            {/* Current Style */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-4 px-4">
                Current Style (White Cards)
              </div>
              <div
                className="v2-paper rounded-3xl text-center relative overflow-hidden"
                style={{ padding: '64px 48px' }}
              >
                <h3 className="font-display text-2xl md:text-3xl font-bold text-fm-neutral-900 mb-6">
                  Ready to see what we can do for you?
                </h3>
                <p className="text-fm-neutral-600 text-lg mb-10 max-w-xl mx-auto">
                  Get a free strategy session and discover how we can transform your digital presence.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="v2-btn v2-btn-magenta">
                    Get Free Strategy Call
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="v2-btn v2-btn-outline">
                    See Our Results
                  </button>
                </div>
              </div>
            </div>

            {/* Gold Accent Alternative */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-4 px-4">
                Gold Accent (On Dark)
              </div>
              <div
                className="rounded-3xl text-center bg-white/5 border border-white/10"
                style={{ padding: '64px 48px' }}
              >
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-6">
                  Ready to see what we can do for{' '}
                  <span className="text-amber-300">you</span>?
                </h3>
                <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
                  Get a free strategy session and discover how we can transform your digital presence.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-amber-400 text-amber-950 hover:bg-amber-300 transition-all">
                    Get Free Strategy Call
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="v2-btn v2-btn-secondary">
                    See Our Results
                  </button>
                </div>
              </div>
            </div>

            {/* Cyan Accent Alternative */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-4 px-4">
                Cyan Accent (On Dark)
              </div>
              <div
                className="rounded-3xl text-center bg-white/5 border border-white/10"
                style={{ padding: '64px 48px' }}
              >
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-6">
                  Ready to see what we can do for{' '}
                  <span className="text-cyan-300">you</span>?
                </h3>
                <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
                  Get a free strategy session and discover how we can transform your digital presence.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-cyan-400 text-cyan-950 hover:bg-cyan-300 transition-all">
                    Get Free Strategy Call
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="v2-btn v2-btn-secondary">
                    See Our Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Color Swatches */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8">
            Color Swatches Reference
          </h2>

          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {[
              { name: 'White', bg: 'bg-white' },
              { name: 'Cream', bg: 'bg-amber-50' },
              { name: 'Gold 300', bg: 'bg-amber-300' },
              { name: 'Gold 400', bg: 'bg-amber-400' },
              { name: 'Orange 200', bg: 'bg-orange-200' },
              { name: 'Orange 300', bg: 'bg-orange-300' },
              { name: 'Rose 300', bg: 'bg-rose-300' },
              { name: 'Rose 400', bg: 'bg-rose-400' },
              { name: 'Pink 300', bg: 'bg-pink-300' },
              { name: 'Pink 400', bg: 'bg-pink-400' },
              { name: 'Cyan 300', bg: 'bg-cyan-300' },
              { name: 'Cyan 400', bg: 'bg-cyan-400' },
              { name: 'Emerald 300', bg: 'bg-emerald-300' },
              { name: 'Emerald 400', bg: 'bg-emerald-400' },
              { name: 'Violet 300', bg: 'bg-violet-300' },
              { name: 'Violet 400', bg: 'bg-violet-400' },
            ].map((swatch) => (
              <div key={swatch.name} className="text-center">
                <div className={`w-full aspect-square rounded-xl ${swatch.bg} mb-2`} />
                <div className="text-xs text-white/60">{swatch.name}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

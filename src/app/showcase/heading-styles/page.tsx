'use client';

import React from 'react';

const sampleText = 'FreakingMinds';
const samplePhrase = 'Creative Excellence';

export default function HeadingStylesShowcase() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f0510 0%, #1f0e22 25%, #401b44 50%, #1f0e22 75%, #0f0510 100%)',
        padding: '60px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '8px',
          }}
        >
          Heading Accent Styles Showcase
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '60px' }}>
          Different text-shadow, glow, and 3D treatments for v2-accent highlighted words
        </p>

        {/* ========== CATEGORY 1: STATIC STACKED SHADOWS ========== */}
        <SectionLabel label="A. Static Stacked Shadows (3D Depth)" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          {/* A1: Brand Magenta Stack */}
          <Card id="A1" title="Brand Magenta Stack">
            <span
              style={{
                color: '#ff6b9d',
                textShadow: '0 0.03em 0 #e8456d, 0 0.06em 0 #c9325d, 0 0.09em 0 #a82548, 0 0.12em 0 #7c1a3a',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* A2: Deep Magenta to Black */}
          <Card id="A2" title="Deep Magenta to Black">
            <span
              style={{
                color: '#ff6b9d',
                textShadow: '0 0.03em 0 #c9325d, 0 0.06em 0 #8c213d, 0 0.09em 0 #5c1530, 0 0.12em 0 #2a0a18',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* A3: White to Magenta Fade */}
          <Card id="A3" title="White to Magenta Fade">
            <span
              style={{
                color: '#ffffff',
                textShadow: '0 0.03em 0 rgba(255,107,157,0.8), 0 0.06em 0 rgba(201,50,93,0.6), 0 0.09em 0 rgba(140,33,61,0.4), 0 0.12em 0 rgba(92,21,48,0.2)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* A4: Warm Gradient Stack (Magenta → Orange) */}
          <Card id="A4" title="Warm Stack (Magenta to Orange)">
            <span
              style={{
                color: '#ff6b9d',
                textShadow: '0 0.03em 0 #e8456d, 0 0.06em 0 #d4553e, 0 0.09em 0 #e8734a, 0 0.12em 0 #c45a32',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* A5: Tight Stack (smaller offsets, more subtle) */}
          <Card id="A5" title="Tight Subtle Stack">
            <span
              style={{
                color: '#ff6b9d',
                textShadow: '0 0.015em 0 #e8456d, 0 0.03em 0 #c9325d, 0 0.045em 0 #a82548',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* A6: Wide Bold Stack (larger offsets) */}
          <Card id="A6" title="Wide Bold Stack">
            <span
              style={{
                color: '#ff6b9d',
                textShadow: '0 0.05em 0 #e8456d, 0 0.10em 0 #c9325d, 0 0.15em 0 #a82548, 0 0.20em 0 #7c1a3a',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* A7: Diagonal Stack */}
          <Card id="A7" title="Diagonal Stack (Bottom-Right)">
            <span
              style={{
                color: '#ff6b9d',
                textShadow: '0.02em 0.03em 0 #e8456d, 0.04em 0.06em 0 #c9325d, 0.06em 0.09em 0 #a82548, 0.08em 0.12em 0 #7c1a3a',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* A8: Retro/Comic Stack */}
          <Card id="A8" title="Retro Comic Stack">
            <span
              style={{
                color: '#ffffff',
                textShadow: '0.02em 0.03em 0 #ff6b9d, 0.04em 0.06em 0 #c9325d, 0.06em 0.09em 0 #1a0a10',
                WebkitTextStroke: '1px rgba(201,50,93,0.5)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>
        </div>

        {/* ========== CATEGORY 2: GLOW EFFECTS ========== */}
        <SectionLabel label="B. Glow Effects (Neon / Ambient)" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          {/* B1: Soft Magenta Glow */}
          <Card id="B1" title="Soft Magenta Glow">
            <span
              style={{
                color: '#ff6b9d',
                textShadow: '0 0 10px rgba(255,107,157,0.6), 0 0 30px rgba(201,50,93,0.3), 0 0 60px rgba(201,50,93,0.15)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* B2: Intense Neon Glow */}
          <Card id="B2" title="Intense Neon Glow">
            <span
              style={{
                color: '#ff8db5',
                textShadow: '0 0 7px #ff6b9d, 0 0 15px #ff6b9d, 0 0 30px #c9325d, 0 0 50px #c9325d, 0 0 80px rgba(201,50,93,0.4)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* B3: White Glow on Magenta Text */}
          <Card id="B3" title="White Core Glow">
            <span
              style={{
                color: '#ffffff',
                textShadow: '0 0 5px rgba(255,255,255,0.8), 0 0 15px rgba(255,107,157,0.6), 0 0 40px rgba(201,50,93,0.4), 0 0 80px rgba(168,37,72,0.2)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* B4: Dual-tone Glow (Magenta + Orange) */}
          <Card id="B4" title="Dual-tone Glow (Magenta + Warm)">
            <span
              style={{
                color: '#ff6b9d',
                textShadow: '0 0 10px rgba(255,107,157,0.5), 0 0 30px rgba(232,115,74,0.3), 0 0 60px rgba(201,50,93,0.2)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* B5: Pulsing glow (CSS animation) */}
          <Card id="B5" title="Pulsing Glow (Animated)">
            <span className="showcase-pulse-glow">
              {samplePhrase}
            </span>
          </Card>

          {/* B6: Flickering Neon */}
          <Card id="B6" title="Flickering Neon (Animated)">
            <span className="showcase-flicker-neon">
              {samplePhrase}
            </span>
          </Card>
        </div>

        {/* ========== CATEGORY 3: COMBINED (Shadow + Glow) ========== */}
        <SectionLabel label="C. Shadow + Glow Combos" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          {/* C1: Stack + Soft Glow */}
          <Card id="C1" title="Stack + Soft Ambient Glow">
            <span
              style={{
                color: '#ff6b9d',
                textShadow: '0 0.03em 0 #e8456d, 0 0.06em 0 #c9325d, 0 0.09em 0 #a82548, 0 0 20px rgba(255,107,157,0.3), 0 0 40px rgba(201,50,93,0.15)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* C2: Diagonal Stack + Neon Glow */}
          <Card id="C2" title="Diagonal Stack + Neon Glow">
            <span
              style={{
                color: '#ff8db5',
                textShadow: '0.02em 0.03em 0 #e8456d, 0.04em 0.06em 0 #c9325d, 0.06em 0.09em 0 #a82548, 0 0 15px rgba(255,107,157,0.5), 0 0 40px rgba(201,50,93,0.25)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* C3: White text + colored stack + glow */}
          <Card id="C3" title="White Text + Colored Stack + Glow">
            <span
              style={{
                color: '#ffffff',
                textShadow: '0 0.03em 0 #ff6b9d, 0 0.06em 0 #c9325d, 0 0.09em 0 #a82548, 0 0 15px rgba(255,107,157,0.4), 0 0 50px rgba(201,50,93,0.2)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* C4: Subtle stack + warm glow */}
          <Card id="C4" title="Subtle Stack + Warm Glow">
            <span
              style={{
                color: '#ff6b9d',
                textShadow: '0 0.02em 0 #e8456d, 0 0.04em 0 #c9325d, 0 0 12px rgba(232,115,74,0.4), 0 0 35px rgba(255,107,157,0.2)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>
        </div>

        {/* ========== CATEGORY 4: OUTLINE / STROKE STYLES ========== */}
        <SectionLabel label="D. Outline / Stroke Treatments" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          {/* D1: Thin stroke + glow */}
          <Card id="D1" title="Thin Magenta Stroke + Glow">
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.5px #ff6b9d',
                textShadow: '0 0 15px rgba(255,107,157,0.4), 0 0 40px rgba(201,50,93,0.2)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* D2: White stroke on transparent + stack */}
          <Card id="D2" title="White Stroke + Magenta Stack">
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.9)',
                textShadow: '0 0.03em 0 #ff6b9d, 0 0.06em 0 #c9325d, 0 0.09em 0 #a82548',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* D3: Double stroke effect */}
          <Card id="D3" title="Filled + Stroke Shadow">
            <span
              style={{
                color: '#ff6b9d',
                WebkitTextStroke: '0.5px rgba(255,255,255,0.3)',
                textShadow: '0 0 0 #c9325d, 0.03em 0.03em 0 rgba(168,37,72,0.6)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* D4: Hollow with heavy glow */}
          <Card id="D4" title="Hollow + Heavy Neon">
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px #ff6b9d',
                textShadow: '0 0 7px #ff6b9d, 0 0 20px #ff6b9d, 0 0 40px #c9325d, 0 0 80px rgba(201,50,93,0.4)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>
        </div>

        {/* ========== CATEGORY 5: ANIMATED STACKED SHADOWS ========== */}
        <SectionLabel label="E. Animated Stacked Shadows" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          {/* E1: Bouncing stack (current hero) */}
          <Card id="E1" title="Bounce Stack (Current Hero Animation)">
            <span className="showcase-bounce-stack">
              {samplePhrase}
            </span>
          </Card>

          {/* E2: Breathing stack */}
          <Card id="E2" title="Breathing Stack (Grow/Shrink)">
            <span className="showcase-breathe-stack">
              {samplePhrase}
            </span>
          </Card>

          {/* E3: Wave shadow */}
          <Card id="E3" title="Shadow Wave (Side to Side)">
            <span className="showcase-wave-stack">
              {samplePhrase}
            </span>
          </Card>

          {/* E4: Rotating shadow direction */}
          <Card id="E4" title="Orbiting Shadow">
            <span className="showcase-orbit-stack">
              {samplePhrase}
            </span>
          </Card>
        </div>

        {/* ========== CATEGORY 6: GRADIENT TEXT + SHADOW ========== */}
        <SectionLabel label="F. Gradient Text + Shadow" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '32px', marginBottom: '60px' }}>
          {/* F1: Current v2-accent (baseline) */}
          <Card id="F1" title="Current v2-accent (Baseline)">
            <span className="v2-accent">
              {samplePhrase}
            </span>
          </Card>

          {/* F2: v2-accent + stacked shadow via wrapper */}
          <Card id="F2" title="v2-accent + Shadow Wrapper">
            <span
              style={{
                textShadow: '0 0.03em 0 #e8456d, 0 0.06em 0 #c9325d, 0 0.09em 0 #a82548, 0 0.12em 0 #7c1a3a',
              }}
            >
              <span className="v2-accent" style={{ filter: 'none' }}>
                {samplePhrase}
              </span>
            </span>
          </Card>

          {/* F3: Simpler gradient (no brush strokes) + stack */}
          <Card id="F3" title="Clean Gradient + Stack">
            <span
              style={{
                background: 'linear-gradient(135deg, #ff6b9d 0%, #e8734a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0.03em 0 #c9325d) drop-shadow(0 0.06em 0 #a82548)',
              }}
            >
              {samplePhrase}
            </span>
          </Card>

          {/* F4: Gradient text + glow (no stack) */}
          <Card id="F4" title="Clean Gradient + Glow Only">
            <span
              style={{
                background: 'linear-gradient(135deg, #ff6b9d 0%, #e8734a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 15px rgba(255,107,157,0.5)) drop-shadow(0 0 40px rgba(201,50,93,0.25))',
              }}
            >
              {samplePhrase}
            </span>
          </Card>
        </div>

        {/* ========== IN CONTEXT: Full heading examples ========== */}
        <SectionLabel label="G. In Context (Section Heading Mockups)" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', marginBottom: '60px' }}>
          <ContextCard id="G1" title="Stack + Glow combo">
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
              Why Brands Choose{' '}
              <span style={{
                color: '#ff6b9d',
                textShadow: '0 0.03em 0 #e8456d, 0 0.06em 0 #c9325d, 0 0.09em 0 #a82548, 0 0 20px rgba(255,107,157,0.3)',
              }}>
                FreakingMinds
              </span>
            </h2>
          </ContextCard>

          <ContextCard id="G2" title="Soft glow only">
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
              Why Brands Choose{' '}
              <span style={{
                color: '#ff6b9d',
                textShadow: '0 0 10px rgba(255,107,157,0.6), 0 0 30px rgba(201,50,93,0.3), 0 0 60px rgba(201,50,93,0.15)',
              }}>
                FreakingMinds
              </span>
            </h2>
          </ContextCard>

          <ContextCard id="G3" title="White text + magenta stack">
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
              Why Brands Choose{' '}
              <span style={{
                color: '#ffffff',
                textShadow: '0 0.03em 0 #ff6b9d, 0 0.06em 0 #c9325d, 0 0.09em 0 #a82548, 0 0 15px rgba(255,107,157,0.4)',
              }}>
                FreakingMinds
              </span>
            </h2>
          </ContextCard>

          <ContextCard id="G4" title="Subtle tight stack">
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
              Why Brands Choose{' '}
              <span style={{
                color: '#ff6b9d',
                textShadow: '0 0.015em 0 #e8456d, 0 0.03em 0 #c9325d, 0 0.045em 0 #a82548',
              }}>
                FreakingMinds
              </span>
            </h2>
          </ContextCard>

          <ContextCard id="G5" title="Neon hollow outline">
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
              Why Brands Choose{' '}
              <span style={{
                color: 'transparent',
                WebkitTextStroke: '1.5px #ff6b9d',
                textShadow: '0 0 10px rgba(255,107,157,0.5), 0 0 30px rgba(201,50,93,0.25)',
              }}>
                FreakingMinds
              </span>
            </h2>
          </ContextCard>

          <ContextCard id="G6" title="Current v2-accent (baseline)">
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
              Why Brands Choose{' '}
              <span className="v2-accent">
                FreakingMinds
              </span>
            </h2>
          </ContextCard>

          <ContextCard id="G7" title="Diagonal retro stack">
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
              Why Brands Choose{' '}
              <span style={{
                color: '#ff6b9d',
                textShadow: '0.02em 0.03em 0 #e8456d, 0.04em 0.06em 0 #c9325d, 0.06em 0.09em 0 #a82548',
              }}>
                FreakingMinds
              </span>
            </h2>
          </ContextCard>

          <ContextCard id="G8" title="Clean gradient + drop shadow glow">
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
              Why Brands Choose{' '}
              <span style={{
                background: 'linear-gradient(135deg, #ff6b9d 0%, #e8734a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 15px rgba(255,107,157,0.5)) drop-shadow(0 0 40px rgba(201,50,93,0.25))',
              }}>
                FreakingMinds
              </span>
            </h2>
          </ContextCard>
        </div>
      </div>

      {/* Embedded styles for animated variants */}
      <style>{`
        .showcase-pulse-glow {
          color: #ff6b9d;
          animation: showcase-pulse 2.5s ease-in-out infinite;
        }
        @keyframes showcase-pulse {
          0%, 100% {
            text-shadow: 0 0 5px rgba(255,107,157,0.3), 0 0 15px rgba(201,50,93,0.15);
          }
          50% {
            text-shadow: 0 0 10px rgba(255,107,157,0.7), 0 0 30px rgba(255,107,157,0.4), 0 0 60px rgba(201,50,93,0.25), 0 0 100px rgba(201,50,93,0.1);
          }
        }

        .showcase-flicker-neon {
          color: #ff8db5;
          text-shadow: 0 0 7px #ff6b9d, 0 0 15px #ff6b9d, 0 0 30px #c9325d, 0 0 50px #c9325d;
          animation: showcase-flicker 3s linear infinite;
        }
        @keyframes showcase-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: 0 0 7px #ff6b9d, 0 0 15px #ff6b9d, 0 0 30px #c9325d, 0 0 50px #c9325d;
            opacity: 1;
          }
          20%, 24%, 55% {
            text-shadow: none;
            opacity: 0.7;
          }
        }

        .showcase-bounce-stack {
          color: #ffffff;
          display: inline-block;
          animation: showcase-bounce 2s ease-in-out infinite;
        }
        @keyframes showcase-bounce {
          0%, 100% {
            transform: translateY(0);
            text-shadow: 0 0 0 transparent, 0 0 0 transparent, 0 0 0 transparent, 0 0 0 transparent;
          }
          12% {
            transform: translateY(-0.04em);
            text-shadow: 0 0.04em 0 #ff6b9d, 0 0 0 transparent, 0 0 0 transparent, 0 0 0 transparent;
          }
          24% {
            transform: translateY(-0.08em);
            text-shadow: 0 0.04em 0 #ff6b9d, 0 0.08em 0 #e8456d, 0 0 0 transparent, 0 0 0 transparent;
          }
          36% {
            transform: translateY(-0.12em);
            text-shadow: 0 0.04em 0 #ff6b9d, 0 0.08em 0 #e8456d, 0 0.12em 0 #c9325d, 0 0 0 transparent;
          }
          48%, 55% {
            transform: translateY(-0.16em);
            text-shadow: 0 0.04em 0 #ff6b9d, 0 0.08em 0 #e8456d, 0 0.12em 0 #c9325d, 0 0.16em 0 #a82548;
          }
          68% {
            transform: translateY(-0.12em);
            text-shadow: 0 0.04em 0 #ff6b9d, 0 0.08em 0 #e8456d, 0 0.12em 0 #c9325d, 0 0 0 transparent;
          }
          80% {
            transform: translateY(-0.08em);
            text-shadow: 0 0.04em 0 #ff6b9d, 0 0.08em 0 #e8456d, 0 0 0 transparent, 0 0 0 transparent;
          }
          90% {
            transform: translateY(-0.04em);
            text-shadow: 0 0.04em 0 #ff6b9d, 0 0 0 transparent, 0 0 0 transparent, 0 0 0 transparent;
          }
        }

        .showcase-breathe-stack {
          color: #ff6b9d;
          display: inline-block;
          animation: showcase-breathe 3s ease-in-out infinite;
        }
        @keyframes showcase-breathe {
          0%, 100% {
            text-shadow: 0 0.01em 0 #e8456d, 0 0.02em 0 #c9325d;
          }
          50% {
            text-shadow: 0 0.04em 0 #e8456d, 0 0.08em 0 #c9325d, 0 0.12em 0 #a82548, 0 0.16em 0 #7c1a3a;
          }
        }

        .showcase-wave-stack {
          color: #ff6b9d;
          display: inline-block;
          animation: showcase-wave 2.5s ease-in-out infinite;
        }
        @keyframes showcase-wave {
          0%, 100% {
            text-shadow: -0.06em 0.03em 0 #e8456d, -0.1em 0.06em 0 #c9325d, -0.14em 0.09em 0 #a82548;
          }
          50% {
            text-shadow: 0.06em 0.03em 0 #e8456d, 0.1em 0.06em 0 #c9325d, 0.14em 0.09em 0 #a82548;
          }
        }

        .showcase-orbit-stack {
          color: #ff6b9d;
          display: inline-block;
          animation: showcase-orbit 4s linear infinite;
        }
        @keyframes showcase-orbit {
          0% {
            text-shadow: 0 0.06em 0 #e8456d, 0 0.1em 0 #c9325d, 0 0.14em 0 #a82548;
          }
          25% {
            text-shadow: 0.06em 0 0 #e8456d, 0.1em 0 0 #c9325d, 0.14em 0 0 #a82548;
          }
          50% {
            text-shadow: 0 -0.06em 0 #e8456d, 0 -0.1em 0 #c9325d, 0 -0.14em 0 #a82548;
          }
          75% {
            text-shadow: -0.06em 0 0 #e8456d, -0.1em 0 0 #c9325d, -0.14em 0 0 #a82548;
          }
          100% {
            text-shadow: 0 0.06em 0 #e8456d, 0 0.1em 0 #c9325d, 0 0.14em 0 #a82548;
          }
        }
      `}</style>
    </div>
  );
}

/* ---- Helper Components ---- */

function SectionLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,107,157,0.2)',
        paddingBottom: '8px',
        marginBottom: '24px',
      }}
    >
      <span
        style={{
          color: '#ff6b9d',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Card({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            background: 'rgba(255,107,157,0.15)',
            color: '#ff6b9d',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
          }}
        >
          {id}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{title}</span>
      </div>
      <div
        style={{
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ContextCard({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '20px',
        padding: '48px 40px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span
          style={{
            background: 'rgba(255,107,157,0.15)',
            color: '#ff6b9d',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
          }}
        >
          {id}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

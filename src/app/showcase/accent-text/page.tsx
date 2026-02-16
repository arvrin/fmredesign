export default function AccentTextShowcase() {
  const samplePhrases = ['move markets.', 'drive growth.', 'spark change.'];

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '80px 40px',
        background: `linear-gradient(135deg,
          #0f0510 0%, #1f0e22 10%, #28122c 20%, #301535 30%,
          #38183d 40%, #401b44 50%, #38183d 60%, #301535 70%,
          #28122c 80%, #1f0e22 90%, #0f0510 100%
        )`,
        fontFamily: 'var(--font-display)',
      }}
    >
      <h1
        style={{
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '16px',
          opacity: 0.7,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        Glitch — Extreme Contrast
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '64px', fontSize: '0.9rem' }}>
        Maximum punch. Electric neon on near-black. Pick your favourite.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '1200px' }}>

        <Variation label="1. White Core — Hot Pink + Electric Cyan" phrases={samplePhrases} className="g1" />
        <Variation label="2. Neon Green Core — Magenta + Black Split" phrases={samplePhrases} className="g2" />
        <Variation label="3. White Core — Electric Blue Neon Halo" phrases={samplePhrases} className="g3" />
        <Variation label="4. Hot Pink Core — Lime + Cyan Split" phrases={samplePhrases} className="g4" />
        <Variation label="5. White Core — RGB Tricolor (Red / Green / Blue)" phrases={samplePhrases} className="g5" />
        <Variation label="6. Electric Cyan Core — Magenta Glow + Yellow Edge" phrases={samplePhrases} className="g6" />
        <Variation label="7. White Core — Chromatic Aberration (Red / Cyan)" phrases={samplePhrases} className="g7" />
        <Variation label="8. White Core — Neon Magenta Stutter Burst" phrases={samplePhrases} className="g8" />
        <Variation label="9. Yellow Core — Flicker Jitter (Magenta / Cyan)" phrases={samplePhrases} className="g9" />
        <Variation label="10. White Core — Diagonal Lime + Hot Pink" phrases={samplePhrases} className="g10" />
        <Variation label="11. Hot Pink Core — VHS Scanline (Cyan / Black)" phrases={samplePhrases} className="g11" />
        <Variation label="12. White Core — Ultra Violet Neon + Black" phrases={samplePhrases} className="g12" />
        <Variation label="13. Electric Cyan Core — Double Vision Pink" phrases={samplePhrases} className="g13" />
        <Variation label="14. White Core — Vertical Yellow + Magenta" phrases={samplePhrases} className="g14" />
        <Variation label="15. Neon Outline — Cyan + Pink Glitch" phrases={samplePhrases} className="g15" />
        <Variation label="16. White Core — Static Neon Trio (No Anim)" phrases={samplePhrases} className="g16" />

        {/* Brand Magenta Core Variations */}
        <Variation label="17. Brand Magenta Core — Cyan + Black Split" phrases={samplePhrases} className="g17" />
        <Variation label="18. Brand Magenta Core — Neon White Halo" phrases={samplePhrases} className="g18" />
        <Variation label="19. Brand Magenta Core — Lime + Violet Split" phrases={samplePhrases} className="g19" />
        <Variation label="20. Brand Magenta Core — Cyan Neon Glow + Black Edge" phrases={samplePhrases} className="g20" />
        <Variation label="21. Brand Magenta Core — Yellow + Cyan Stutter Burst" phrases={samplePhrases} className="g21" />
        <Variation label="22. Brand Magenta Core — Double Vision White" phrases={samplePhrases} className="g22" />
        <Variation label="23. Brand Magenta Core — Diagonal Red + Blue" phrases={samplePhrases} className="g23" />
        <Variation label="24. Brand Magenta Core — Chromatic Aberration (White / Cyan)" phrases={samplePhrases} className="g24" />
        <Variation label="25. Brand Magenta Core — VHS Scanline (Yellow / Black)" phrases={samplePhrases} className="g25" />
        <Variation label="26. Brand Magenta Core — Ultra Violet Halo + Cyan Edge" phrases={samplePhrases} className="g26" />
        <Variation label="27. Brand Magenta Core — Flicker Jitter (White / Black)" phrases={samplePhrases} className="g27" />
        <Variation label="28. Brand Magenta Core — Static Tri-Glow (No Anim)" phrases={samplePhrases} className="g28" />

      </div>

      <style>{`
        /* 1. White core, hot pink left, electric cyan right */
        .g1 {
          color: #ffffff;
          text-shadow:
            -4px 0 rgba(255,20,147,0.9),
            4px 0 rgba(0,255,255,0.9),
            0 0 30px rgba(255,20,147,0.4),
            0 0 60px rgba(0,255,255,0.2);
          animation: a1 3s ease-in-out infinite;
        }
        @keyframes a1 {
          0%, 100% { text-shadow: -4px 0 rgba(255,20,147,0.9), 4px 0 rgba(0,255,255,0.9), 0 0 30px rgba(255,20,147,0.4), 0 0 60px rgba(0,255,255,0.2); }
          25% { text-shadow: -6px 2px rgba(255,20,147,1), 6px -2px rgba(0,255,255,1), 0 0 40px rgba(255,20,147,0.5), 0 0 80px rgba(0,255,255,0.3); }
          50% { text-shadow: -2px -1px rgba(255,20,147,0.7), 2px 1px rgba(0,255,255,0.7), 0 0 20px rgba(255,20,147,0.3), 0 0 40px rgba(0,255,255,0.15); }
          75% { text-shadow: -5px 0 rgba(255,20,147,0.95), 5px 0 rgba(0,255,255,0.95), 0 0 35px rgba(255,20,147,0.45), 0 0 70px rgba(0,255,255,0.25); }
        }

        /* 2. Neon green core, magenta left, black right */
        .g2 {
          color: #39ff14;
          text-shadow:
            -4px 0 rgba(255,0,100,0.9),
            4px 0 rgba(0,0,0,0.8),
            0 0 25px rgba(57,255,20,0.5),
            0 0 60px rgba(57,255,20,0.2);
          animation: a2 3s ease-in-out infinite;
        }
        @keyframes a2 {
          0%, 100% { text-shadow: -4px 0 rgba(255,0,100,0.9), 4px 0 rgba(0,0,0,0.8), 0 0 25px rgba(57,255,20,0.5), 0 0 60px rgba(57,255,20,0.2); }
          30% { text-shadow: -6px 1px rgba(255,0,100,1), 6px -1px rgba(0,0,0,0.9), 0 0 35px rgba(57,255,20,0.6), 0 0 80px rgba(57,255,20,0.3); }
          60% { text-shadow: -2px -1px rgba(255,0,100,0.7), 2px 1px rgba(0,0,0,0.6), 0 0 18px rgba(57,255,20,0.4), 0 0 45px rgba(57,255,20,0.15); }
        }

        /* 3. White core, electric blue neon halo */
        .g3 {
          color: #ffffff;
          text-shadow:
            0 0 10px rgba(0,120,255,0.9),
            0 0 30px rgba(0,120,255,0.7),
            0 0 60px rgba(0,120,255,0.4),
            0 0 100px rgba(0,120,255,0.2),
            0 0 150px rgba(100,0,255,0.1);
          animation: a3 3s ease-in-out infinite;
        }
        @keyframes a3 {
          0%, 100% { text-shadow: 0 0 10px rgba(0,120,255,0.9), 0 0 30px rgba(0,120,255,0.7), 0 0 60px rgba(0,120,255,0.4), 0 0 100px rgba(0,120,255,0.2), 0 0 150px rgba(100,0,255,0.1); }
          30% { text-shadow: 0 0 15px rgba(0,120,255,1), 0 0 45px rgba(0,120,255,0.8), 0 0 80px rgba(0,120,255,0.5), 0 0 130px rgba(0,120,255,0.25), 0 0 180px rgba(100,0,255,0.15); }
          60% { text-shadow: 0 0 7px rgba(0,120,255,0.7), 0 0 20px rgba(0,120,255,0.5), 0 0 45px rgba(0,120,255,0.3), 0 0 75px rgba(0,120,255,0.15), 0 0 110px rgba(100,0,255,0.07); }
        }

        /* 4. Hot pink core, lime left, cyan right */
        .g4 {
          color: #ff1493;
          text-shadow:
            -4px 0 rgba(0,255,65,0.85),
            4px 0 rgba(0,255,255,0.85),
            0 0 25px rgba(255,20,147,0.5);
          animation: a4 3s ease-in-out infinite;
        }
        @keyframes a4 {
          0%, 100% { text-shadow: -4px 0 rgba(0,255,65,0.85), 4px 0 rgba(0,255,255,0.85), 0 0 25px rgba(255,20,147,0.5); }
          30% { text-shadow: -6px 1px rgba(0,255,65,1), 6px -1px rgba(0,255,255,1), 0 0 40px rgba(255,20,147,0.6); }
          60% { text-shadow: -2px -1px rgba(0,255,65,0.6), 2px 1px rgba(0,255,255,0.6), 0 0 15px rgba(255,20,147,0.35); }
        }

        /* 5. White core, RGB tricolor: red left, green down, blue right */
        .g5 {
          color: #ffffff;
          text-shadow:
            -4px -1px rgba(255,0,50,0.9),
            4px -1px rgba(0,100,255,0.9),
            0 4px rgba(0,255,65,0.8),
            0 0 25px rgba(255,255,255,0.15);
          animation: a5 3.5s ease-in-out infinite;
        }
        @keyframes a5 {
          0%, 100% { text-shadow: -4px -1px rgba(255,0,50,0.9), 4px -1px rgba(0,100,255,0.9), 0 4px rgba(0,255,65,0.8), 0 0 25px rgba(255,255,255,0.15); }
          25% { text-shadow: -6px 0 rgba(255,0,50,1), 6px 0 rgba(0,100,255,1), 1px 6px rgba(0,255,65,0.9), 0 0 35px rgba(255,255,255,0.2); }
          50% { text-shadow: -2px 1px rgba(255,0,50,0.65), 2px -1px rgba(0,100,255,0.65), -1px 2px rgba(0,255,65,0.55), 0 0 15px rgba(255,255,255,0.1); }
          75% { text-shadow: -5px -1px rgba(255,0,50,0.95), 5px -1px rgba(0,100,255,0.95), 0 5px rgba(0,255,65,0.85), 0 0 28px rgba(255,255,255,0.17); }
        }

        /* 6. Electric cyan core, magenta glow + yellow edge */
        .g6 {
          color: #00ffff;
          text-shadow:
            -3px 0 rgba(255,255,0,0.8),
            0 0 12px rgba(255,0,150,0.8),
            0 0 35px rgba(255,0,150,0.5),
            0 0 70px rgba(0,255,255,0.25);
          animation: a6 3.5s ease-in-out infinite;
        }
        @keyframes a6 {
          0%, 100% { text-shadow: -3px 0 rgba(255,255,0,0.8), 0 0 12px rgba(255,0,150,0.8), 0 0 35px rgba(255,0,150,0.5), 0 0 70px rgba(0,255,255,0.25); }
          30% { text-shadow: -5px 1px rgba(255,255,0,0.95), 0 0 18px rgba(255,0,150,0.95), 0 0 50px rgba(255,0,150,0.6), 0 0 90px rgba(0,255,255,0.3); }
          60% { text-shadow: -2px -1px rgba(255,255,0,0.6), 0 0 8px rgba(255,0,150,0.6), 0 0 25px rgba(255,0,150,0.35), 0 0 50px rgba(0,255,255,0.17); }
        }

        /* 7. White core, chromatic aberration: red left, cyan right */
        .g7 {
          color: #ffffff;
          text-shadow:
            -5px 0 rgba(255,0,0,0.9),
            5px 0 rgba(0,255,255,0.9),
            0 0 20px rgba(255,255,255,0.15);
          animation: a7 2.5s ease-in-out infinite;
        }
        @keyframes a7 {
          0%, 100% { text-shadow: -5px 0 rgba(255,0,0,0.9), 5px 0 rgba(0,255,255,0.9), 0 0 20px rgba(255,255,255,0.15); }
          25% { text-shadow: -7px 2px rgba(255,0,0,1), 7px -2px rgba(0,255,255,1), 0 0 30px rgba(255,255,255,0.2); }
          50% { text-shadow: -3px -1px rgba(255,0,0,0.7), 3px 1px rgba(0,255,255,0.7), 0 0 12px rgba(255,255,255,0.1); }
          75% { text-shadow: -6px 0 rgba(255,0,0,0.95), 6px 0 rgba(0,255,255,0.95), 0 0 25px rgba(255,255,255,0.17); }
        }

        /* 8. White core, neon magenta stutter burst with cyan flash */
        .g8 {
          color: #ffffff;
          text-shadow:
            -3px 0 rgba(255,0,150,0.8),
            3px 0 rgba(0,255,255,0.7),
            0 0 20px rgba(255,0,150,0.3);
          animation: a8 4s ease-in-out infinite;
        }
        @keyframes a8 {
          0%, 84%, 100% { text-shadow: -3px 0 rgba(255,0,150,0.8), 3px 0 rgba(0,255,255,0.7), 0 0 20px rgba(255,0,150,0.3); transform: translate(0); }
          85% { text-shadow: -10px 3px rgba(255,0,150,1), 10px -3px rgba(0,255,255,1), 0 0 50px rgba(255,255,0,0.6); transform: translate(-4px, 2px); }
          87% { text-shadow: 8px -2px rgba(255,0,150,1), -8px 2px rgba(0,255,255,1), 0 0 40px rgba(255,255,0,0.5); transform: translate(4px, -2px); }
          89% { text-shadow: -6px 0 rgba(255,0,150,0.95), 6px 0 rgba(0,255,255,0.95), 0 0 35px rgba(255,255,0,0.4); transform: translate(-2px, 0); }
          91% { text-shadow: 4px 2px rgba(255,0,150,0.9), -4px -2px rgba(0,255,255,0.9), 0 0 30px rgba(255,255,0,0.35); transform: translate(3px, 1px); }
          93% { text-shadow: -3px 0 rgba(255,0,150,0.8), 3px 0 rgba(0,255,255,0.7), 0 0 20px rgba(255,0,150,0.3); transform: translate(0); }
        }

        /* 9. Yellow core, rapid flicker with magenta + cyan */
        .g9 {
          color: #ffff00;
          text-shadow:
            -3px 0 rgba(255,0,150,0.9),
            3px 0 rgba(0,255,255,0.9),
            0 0 25px rgba(255,255,0,0.4);
          animation: a9 0.8s steps(4) infinite;
        }
        @keyframes a9 {
          0% { text-shadow: -3px 0 rgba(255,0,150,1), 4px 0 rgba(0,255,255,0.9), 0 0 25px rgba(255,255,0,0.4); }
          25% { text-shadow: -6px 2px rgba(255,0,150,1), 2px -2px rgba(0,255,255,0.7), 0 0 30px rgba(255,255,0,0.5); }
          50% { text-shadow: -1px -1px rgba(255,0,150,0.7), 5px 1px rgba(0,255,255,1), 0 0 20px rgba(255,255,0,0.35); }
          75% { text-shadow: -4px 0 rgba(255,0,150,0.9), 3px 0 rgba(0,255,255,0.85), 0 0 25px rgba(255,255,0,0.4); }
        }

        /* 10. White core, diagonal lime + hot pink */
        .g10 {
          color: #ffffff;
          text-shadow:
            -4px -3px rgba(0,255,65,0.9),
            4px 3px rgba(255,20,147,0.9),
            0 0 25px rgba(255,255,255,0.12);
          animation: a10 3s ease-in-out infinite;
        }
        @keyframes a10 {
          0%, 100% { text-shadow: -4px -3px rgba(0,255,65,0.9), 4px 3px rgba(255,20,147,0.9), 0 0 25px rgba(255,255,255,0.12); }
          30% { text-shadow: -6px -4px rgba(0,255,65,1), 6px 4px rgba(255,20,147,1), 0 0 35px rgba(255,255,255,0.18); }
          50% { text-shadow: -2px -1px rgba(0,255,65,0.6), 2px 1px rgba(255,20,147,0.6), 0 0 15px rgba(255,255,255,0.08); }
          70% { text-shadow: -5px -3px rgba(0,255,65,0.95), 5px 3px rgba(255,20,147,0.95), 0 0 28px rgba(255,255,255,0.14); }
        }

        /* 11. Hot pink core, VHS scanlines with cyan + black */
        .g11 {
          color: #ff1493;
          background:
            repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px);
          -webkit-background-clip: text;
          background-clip: text;
          text-shadow:
            -4px 0 rgba(0,255,255,0.85),
            4px 0 rgba(0,0,0,0.6),
            0 0 30px rgba(255,20,147,0.4);
          animation: a11 4s ease-in-out infinite;
        }
        @keyframes a11 {
          0%, 100% { text-shadow: -4px 0 rgba(0,255,255,0.85), 4px 0 rgba(0,0,0,0.6), 0 0 30px rgba(255,20,147,0.4); transform: translateX(0); }
          15% { text-shadow: -6px 0 rgba(0,255,255,1), 6px 0 rgba(0,0,0,0.7), 0 0 40px rgba(255,20,147,0.5); transform: translateX(-2px); }
          30% { text-shadow: -2px 0 rgba(0,255,255,0.6), 2px 0 rgba(0,0,0,0.4), 0 0 20px rgba(255,20,147,0.3); transform: translateX(1px); }
          45% { text-shadow: -4px 0 rgba(0,255,255,0.85), 4px 0 rgba(0,0,0,0.6), 0 0 30px rgba(255,20,147,0.4); transform: translateX(0); }
        }

        /* 12. White core, ultra violet neon + black split */
        .g12 {
          color: #ffffff;
          text-shadow:
            -3px 0 rgba(0,0,0,0.7),
            3px 0 rgba(0,0,0,0.5),
            0 0 12px rgba(140,0,255,1),
            0 0 35px rgba(140,0,255,0.7),
            0 0 70px rgba(140,0,255,0.4),
            0 0 120px rgba(255,0,150,0.2);
          animation: a12 3s ease-in-out infinite;
        }
        @keyframes a12 {
          0%, 100% { text-shadow: -3px 0 rgba(0,0,0,0.7), 3px 0 rgba(0,0,0,0.5), 0 0 12px rgba(140,0,255,1), 0 0 35px rgba(140,0,255,0.7), 0 0 70px rgba(140,0,255,0.4), 0 0 120px rgba(255,0,150,0.2); }
          30% { text-shadow: -5px 1px rgba(0,0,0,0.8), 5px -1px rgba(0,0,0,0.6), 0 0 18px rgba(140,0,255,1), 0 0 50px rgba(140,0,255,0.8), 0 0 95px rgba(140,0,255,0.5), 0 0 150px rgba(255,0,150,0.25); }
          60% { text-shadow: -2px -1px rgba(0,0,0,0.55), 2px 1px rgba(0,0,0,0.4), 0 0 8px rgba(140,0,255,0.8), 0 0 25px rgba(140,0,255,0.5), 0 0 50px rgba(140,0,255,0.3), 0 0 80px rgba(255,0,150,0.12); }
        }

        /* 13. Electric cyan core, double vision hot pink */
        .g13 {
          color: #00ffff;
          text-shadow:
            5px 4px 5px rgba(255,20,147,0.7),
            -3px -3px 0 rgba(255,20,147,0.4),
            0 0 30px rgba(0,255,255,0.4);
        }

        /* 14. White core, vertical yellow + magenta */
        .g14 {
          color: #ffffff;
          text-shadow:
            0 -4px rgba(255,255,0,0.9),
            0 4px rgba(255,0,150,0.9),
            0 0 25px rgba(255,255,255,0.12);
          animation: a14 3s ease-in-out infinite;
        }
        @keyframes a14 {
          0%, 100% { text-shadow: 0 -4px rgba(255,255,0,0.9), 0 4px rgba(255,0,150,0.9), 0 0 25px rgba(255,255,255,0.12); }
          30% { text-shadow: 1px -6px rgba(255,255,0,1), -1px 6px rgba(255,0,150,1), 0 0 35px rgba(255,255,255,0.18); }
          60% { text-shadow: -1px -2px rgba(255,255,0,0.65), 1px 2px rgba(255,0,150,0.65), 0 0 15px rgba(255,255,255,0.08); }
        }

        /* 15. Neon outline (hollow), cyan + pink glitch shadows */
        .g15 {
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke: 2px #ff1493;
          text-shadow:
            -4px 0 rgba(0,255,255,0.85),
            4px 0 rgba(255,255,0,0.7),
            0 0 25px rgba(255,20,147,0.35);
          animation: a15 3s ease-in-out infinite;
        }
        @keyframes a15 {
          0%, 100% { text-shadow: -4px 0 rgba(0,255,255,0.85), 4px 0 rgba(255,255,0,0.7), 0 0 25px rgba(255,20,147,0.35); }
          30% { text-shadow: -6px 2px rgba(0,255,255,1), 6px -2px rgba(255,255,0,0.9), 0 0 40px rgba(255,20,147,0.45); }
          60% { text-shadow: -2px -1px rgba(0,255,255,0.6), 2px 1px rgba(255,255,0,0.5), 0 0 15px rgba(255,20,147,0.22); }
        }

        /* 16. White core, static neon trio — no animation */
        .g16 {
          color: #ffffff;
          text-shadow:
            -5px 0 rgba(255,0,150,0.9),
            5px 0 rgba(0,255,255,0.9),
            0 3px rgba(255,255,0,0.7),
            0 0 30px rgba(255,0,150,0.3),
            0 0 60px rgba(0,255,255,0.15);
        }
        /* ═══════════════════════════════════════════════════════
           BRAND MAGENTA CORE (#8c1d4a) VARIATIONS
           ═══════════════════════════════════════════════════════ */

        /* 17. Brand magenta core, cyan left, black right */
        .g17 {
          color: #8c1d4a;
          text-shadow:
            -4px 0 rgba(0,255,255,0.9),
            4px 0 rgba(0,0,0,0.8),
            0 0 25px rgba(201,50,93,0.6),
            0 0 60px rgba(201,50,93,0.25);
          animation: a17 3s ease-in-out infinite;
        }
        @keyframes a17 {
          0%, 100% { text-shadow: -4px 0 rgba(0,255,255,0.9), 4px 0 rgba(0,0,0,0.8), 0 0 25px rgba(201,50,93,0.6), 0 0 60px rgba(201,50,93,0.25); }
          30% { text-shadow: -6px 1px rgba(0,255,255,1), 6px -1px rgba(0,0,0,0.9), 0 0 35px rgba(201,50,93,0.7), 0 0 80px rgba(201,50,93,0.3); }
          60% { text-shadow: -2px -1px rgba(0,255,255,0.7), 2px 1px rgba(0,0,0,0.6), 0 0 18px rgba(201,50,93,0.45), 0 0 45px rgba(201,50,93,0.18); }
        }

        /* 18. Brand magenta core, neon white halo */
        .g18 {
          color: #8c1d4a;
          text-shadow:
            0 0 10px rgba(255,255,255,0.9),
            0 0 30px rgba(255,255,255,0.5),
            0 0 60px rgba(201,50,93,0.6),
            0 0 100px rgba(201,50,93,0.3);
          animation: a18 3s ease-in-out infinite;
        }
        @keyframes a18 {
          0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(201,50,93,0.6), 0 0 100px rgba(201,50,93,0.3); }
          30% { text-shadow: 0 0 15px rgba(255,255,255,1), 0 0 45px rgba(255,255,255,0.6), 0 0 80px rgba(201,50,93,0.7), 0 0 130px rgba(201,50,93,0.35); }
          60% { text-shadow: 0 0 7px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.35), 0 0 45px rgba(201,50,93,0.45), 0 0 75px rgba(201,50,93,0.2); }
        }

        /* 19. Brand magenta core, lime left, violet right */
        .g19 {
          color: #8c1d4a;
          text-shadow:
            -4px 0 rgba(0,255,65,0.9),
            4px 0 rgba(140,0,255,0.85),
            0 0 25px rgba(201,50,93,0.5);
          animation: a19 3s ease-in-out infinite;
        }
        @keyframes a19 {
          0%, 100% { text-shadow: -4px 0 rgba(0,255,65,0.9), 4px 0 rgba(140,0,255,0.85), 0 0 25px rgba(201,50,93,0.5); }
          30% { text-shadow: -6px 2px rgba(0,255,65,1), 6px -2px rgba(140,0,255,1), 0 0 40px rgba(201,50,93,0.6); }
          60% { text-shadow: -2px -1px rgba(0,255,65,0.6), 2px 1px rgba(140,0,255,0.6), 0 0 15px rgba(201,50,93,0.35); }
        }

        /* 20. Brand magenta core, cyan neon glow + black edge */
        .g20 {
          color: #8c1d4a;
          text-shadow:
            -3px 0 rgba(0,0,0,0.7),
            0 0 12px rgba(0,255,255,0.8),
            0 0 35px rgba(0,255,255,0.5),
            0 0 70px rgba(201,50,93,0.4),
            0 0 110px rgba(201,50,93,0.15);
          animation: a20 3.5s ease-in-out infinite;
        }
        @keyframes a20 {
          0%, 100% { text-shadow: -3px 0 rgba(0,0,0,0.7), 0 0 12px rgba(0,255,255,0.8), 0 0 35px rgba(0,255,255,0.5), 0 0 70px rgba(201,50,93,0.4), 0 0 110px rgba(201,50,93,0.15); }
          30% { text-shadow: -5px 1px rgba(0,0,0,0.8), 0 0 18px rgba(0,255,255,1), 0 0 50px rgba(0,255,255,0.6), 0 0 90px rgba(201,50,93,0.5), 0 0 140px rgba(201,50,93,0.2); }
          60% { text-shadow: -2px -1px rgba(0,0,0,0.55), 0 0 8px rgba(0,255,255,0.6), 0 0 25px rgba(0,255,255,0.35), 0 0 50px rgba(201,50,93,0.3), 0 0 80px rgba(201,50,93,0.1); }
        }

        /* 21. Brand magenta core, yellow + cyan stutter burst */
        .g21 {
          color: #8c1d4a;
          text-shadow:
            -3px 0 rgba(255,255,0,0.8),
            3px 0 rgba(0,255,255,0.7),
            0 0 20px rgba(201,50,93,0.4);
          animation: a21 4s ease-in-out infinite;
        }
        @keyframes a21 {
          0%, 84%, 100% { text-shadow: -3px 0 rgba(255,255,0,0.8), 3px 0 rgba(0,255,255,0.7), 0 0 20px rgba(201,50,93,0.4); transform: translate(0); }
          85% { text-shadow: -10px 3px rgba(255,255,0,1), 10px -3px rgba(0,255,255,1), 0 0 50px rgba(201,50,93,0.8); transform: translate(-4px, 2px); }
          87% { text-shadow: 8px -2px rgba(255,255,0,1), -8px 2px rgba(0,255,255,1), 0 0 40px rgba(201,50,93,0.7); transform: translate(4px, -2px); }
          89% { text-shadow: -6px 0 rgba(255,255,0,0.95), 6px 0 rgba(0,255,255,0.95), 0 0 35px rgba(201,50,93,0.6); transform: translate(-2px, 0); }
          91% { text-shadow: 4px 2px rgba(255,255,0,0.9), -4px -2px rgba(0,255,255,0.9), 0 0 30px rgba(201,50,93,0.5); transform: translate(3px, 1px); }
          93% { text-shadow: -3px 0 rgba(255,255,0,0.8), 3px 0 rgba(0,255,255,0.7), 0 0 20px rgba(201,50,93,0.4); transform: translate(0); }
        }

        /* 22. Brand magenta core, double vision white */
        .g22 {
          color: #8c1d4a;
          text-shadow:
            5px 4px 5px rgba(255,255,255,0.5),
            -3px -3px 0 rgba(255,255,255,0.3),
            0 0 30px rgba(201,50,93,0.5),
            0 0 70px rgba(201,50,93,0.2);
        }

        /* 23. Brand magenta core, diagonal red + blue */
        .g23 {
          color: #8c1d4a;
          text-shadow:
            -4px -3px rgba(255,0,0,0.85),
            4px 3px rgba(0,120,255,0.85),
            0 0 25px rgba(201,50,93,0.4);
          animation: a23 3s ease-in-out infinite;
        }
        @keyframes a23 {
          0%, 100% { text-shadow: -4px -3px rgba(255,0,0,0.85), 4px 3px rgba(0,120,255,0.85), 0 0 25px rgba(201,50,93,0.4); }
          30% { text-shadow: -6px -4px rgba(255,0,0,1), 6px 4px rgba(0,120,255,1), 0 0 40px rgba(201,50,93,0.5); }
          50% { text-shadow: -2px -1px rgba(255,0,0,0.55), 2px 1px rgba(0,120,255,0.55), 0 0 15px rgba(201,50,93,0.25); }
          70% { text-shadow: -5px -3px rgba(255,0,0,0.9), 5px 3px rgba(0,120,255,0.9), 0 0 30px rgba(201,50,93,0.45); }
        }

        /* 24. Brand magenta core, chromatic aberration: white left, cyan right */
        .g24 {
          color: #8c1d4a;
          text-shadow:
            -5px 0 rgba(255,255,255,0.8),
            5px 0 rgba(0,255,255,0.85),
            0 0 30px rgba(201,50,93,0.5);
          animation: a24 2.5s ease-in-out infinite;
        }
        @keyframes a24 {
          0%, 100% { text-shadow: -5px 0 rgba(255,255,255,0.8), 5px 0 rgba(0,255,255,0.85), 0 0 30px rgba(201,50,93,0.5); }
          25% { text-shadow: -7px 2px rgba(255,255,255,0.95), 7px -2px rgba(0,255,255,1), 0 0 45px rgba(201,50,93,0.6); }
          50% { text-shadow: -3px -1px rgba(255,255,255,0.6), 3px 1px rgba(0,255,255,0.6), 0 0 18px rgba(201,50,93,0.35); }
          75% { text-shadow: -6px 0 rgba(255,255,255,0.85), 6px 0 rgba(0,255,255,0.9), 0 0 35px rgba(201,50,93,0.55); }
        }

        /* 25. Brand magenta core, VHS scanlines with yellow + black */
        .g25 {
          color: #8c1d4a;
          background:
            repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px);
          -webkit-background-clip: text;
          background-clip: text;
          text-shadow:
            -4px 0 rgba(255,255,0,0.85),
            4px 0 rgba(0,0,0,0.6),
            0 0 30px rgba(201,50,93,0.5);
          animation: a25 4s ease-in-out infinite;
        }
        @keyframes a25 {
          0%, 100% { text-shadow: -4px 0 rgba(255,255,0,0.85), 4px 0 rgba(0,0,0,0.6), 0 0 30px rgba(201,50,93,0.5); transform: translateX(0); }
          15% { text-shadow: -6px 0 rgba(255,255,0,1), 6px 0 rgba(0,0,0,0.7), 0 0 40px rgba(201,50,93,0.6); transform: translateX(-2px); }
          30% { text-shadow: -2px 0 rgba(255,255,0,0.6), 2px 0 rgba(0,0,0,0.4), 0 0 20px rgba(201,50,93,0.35); transform: translateX(1px); }
          45% { text-shadow: -4px 0 rgba(255,255,0,0.85), 4px 0 rgba(0,0,0,0.6), 0 0 30px rgba(201,50,93,0.5); transform: translateX(0); }
        }

        /* 26. Brand magenta core, ultra violet halo + cyan edge */
        .g26 {
          color: #8c1d4a;
          text-shadow:
            -3px 0 rgba(0,255,255,0.7),
            0 0 12px rgba(140,0,255,0.9),
            0 0 35px rgba(140,0,255,0.6),
            0 0 70px rgba(201,50,93,0.4),
            0 0 120px rgba(201,50,93,0.15);
          animation: a26 3s ease-in-out infinite;
        }
        @keyframes a26 {
          0%, 100% { text-shadow: -3px 0 rgba(0,255,255,0.7), 0 0 12px rgba(140,0,255,0.9), 0 0 35px rgba(140,0,255,0.6), 0 0 70px rgba(201,50,93,0.4), 0 0 120px rgba(201,50,93,0.15); }
          30% { text-shadow: -5px 1px rgba(0,255,255,0.85), 0 0 18px rgba(140,0,255,1), 0 0 50px rgba(140,0,255,0.7), 0 0 95px rgba(201,50,93,0.5), 0 0 150px rgba(201,50,93,0.2); }
          60% { text-shadow: -2px -1px rgba(0,255,255,0.5), 0 0 8px rgba(140,0,255,0.7), 0 0 25px rgba(140,0,255,0.4), 0 0 50px rgba(201,50,93,0.3), 0 0 85px rgba(201,50,93,0.1); }
        }

        /* 27. Brand magenta core, rapid flicker white + black */
        .g27 {
          color: #8c1d4a;
          text-shadow:
            -3px 0 rgba(255,255,255,0.85),
            3px 0 rgba(0,0,0,0.8),
            0 0 25px rgba(201,50,93,0.5);
          animation: a27 0.8s steps(4) infinite;
        }
        @keyframes a27 {
          0% { text-shadow: -3px 0 rgba(255,255,255,0.95), 4px 0 rgba(0,0,0,0.8), 0 0 25px rgba(201,50,93,0.5); }
          25% { text-shadow: -6px 2px rgba(255,255,255,1), 2px -2px rgba(0,0,0,0.6), 0 0 35px rgba(201,50,93,0.6); }
          50% { text-shadow: -1px -1px rgba(255,255,255,0.7), 5px 1px rgba(0,0,0,0.9), 0 0 20px rgba(201,50,93,0.4); }
          75% { text-shadow: -4px 0 rgba(255,255,255,0.9), 3px 0 rgba(0,0,0,0.75), 0 0 25px rgba(201,50,93,0.5); }
        }

        /* 28. Brand magenta core, static tri-glow — no animation */
        .g28 {
          color: #8c1d4a;
          text-shadow:
            -5px 0 rgba(0,255,255,0.85),
            5px 0 rgba(255,255,0,0.8),
            0 3px rgba(0,255,65,0.6),
            0 0 30px rgba(201,50,93,0.5),
            0 0 70px rgba(201,50,93,0.2);
        }
      `}</style>
    </div>
  );
}

function Variation({
  label,
  phrases,
  textStyle,
  className,
}: {
  label: string;
  phrases: string[];
  textStyle?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '20px',
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <p
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.8rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}
      >
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span
          style={{
            color: 'white',
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          Ideas that
        </span>
        {phrases.map((phrase, i) => (
          <span
            key={i}
            className={className}
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 700,
              lineHeight: 1.3,
              ...textStyle,
            }}
          >
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}

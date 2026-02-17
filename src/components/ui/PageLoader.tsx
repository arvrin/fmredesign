'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function PageLoader() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Only show on first visit this session
    if (sessionStorage.getItem('fm-loaded')) return;
    sessionStorage.setItem('fm-loaded', '1');

    setVisible(true);
    const timer = setTimeout(() => setFadeOut(true), 1000);
    const removeTimer = setTimeout(() => setVisible(false), 1500);
    return () => { clearTimeout(timer); clearTimeout(removeTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '60px',
        background: `
          linear-gradient(135deg,
            #fef5f8 0%, #fce8ef 10%, #f9dce6 20%, #f5d0de 30%,
            #f2c6d7 40%, #f0bfd2 50%, #f2c6d7 60%, #f5d0de 70%,
            #f9dce6 80%, #fce8ef 90%, #fef5f8 100%
          )
        `,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.7s ease-out',
        pointerEvents: fadeOut ? 'none' as const : 'auto' as const,
      }}
    >
      {/* Atmospheric bloom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 100% 80% at 20% 10%, rgba(201,50,93,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 85% 30%, rgba(180,40,80,0.06) 0%, transparent 45%),
            radial-gradient(ellipse 90% 70% at 50% 90%, rgba(160,30,70,0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Logo on left */}
      <Image
        src="/logo.png"
        alt="Freaking Minds"
        width={320}
        height={120}
        priority
        style={{
          width: 'min(320px, 35vw)',
          height: 'auto',
          position: 'relative',
        }}
      />

      {/* 3D Brain mascot on right */}
      <Image
        src="/3dasset/brain-loading.png"
        alt="Loading..."
        width={300}
        height={300}
        priority
        style={{
          width: 'min(300px, 30vw)',
          height: 'auto',
          position: 'relative',
          animation: 'loaderFloat 2.5s ease-in-out infinite',
          filter: 'drop-shadow(0 20px 40px rgba(201,50,93,0.15))',
        }}
      />

      <style>{`
        @keyframes loaderFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

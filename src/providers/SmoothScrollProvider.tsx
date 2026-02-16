'use client';

import { ReactNode } from 'react';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

// Lenis smooth scroll disabled for native scrolling performance
// The GSAP ScrollTrigger animations still work with native scroll
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return <>{children}</>;
}

// Export hook for compatibility (returns null since Lenis is disabled)
export function useLenis() {
  return { current: null };
}

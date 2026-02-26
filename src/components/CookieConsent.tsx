'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'fm-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const dismiss = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'dismissed');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9998] p-4 md:p-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div
        className="max-w-4xl mx-auto rounded-2xl bg-fm-ink/95 backdrop-blur-sm border border-white/10 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl"
        style={{
          animation: 'slideUp 0.4s ease-out',
        }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-white/90 text-sm leading-relaxed">
            We use cookies for analytics and to improve your experience. By continuing to use this site, you agree to our{' '}
            <a href="/privacy" className="text-fm-magenta-400 hover:text-fm-magenta-300 underline underline-offset-2">
              Privacy Policy
            </a>.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2 rounded-lg bg-fm-magenta-600 hover:bg-fm-magenta-700 text-white text-sm font-medium transition-colors"
          >
            Accept
          </button>
          <button
            onClick={dismiss}
            className="p-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

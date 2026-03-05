'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

/**
 * AgentWorks chatbot widget — only visible on public-facing pages.
 * Hidden on /admin/* and /client/* routes.
 *
 * The script is loaded once (lazyOnload), then we toggle visibility
 * of the injected widget container based on the current route.
 */
export function ChatbotWidget() {
  const pathname = usePathname();
  const isPrivateRoute =
    pathname?.startsWith('/admin') || pathname?.startsWith('/client');

  // Toggle visibility of the widget container when route changes
  useEffect(() => {
    // The widget injects elements with a known structure — find and hide/show them
    const hide = () => {
      const els = document.querySelectorAll<HTMLElement>('[id^="aw-"], [class*="aw-widget"]');
      els.forEach((el) => {
        el.style.display = isPrivateRoute ? 'none' : '';
      });
      // Also try the shadow host if the widget uses one
      const bubble = document.querySelector<HTMLElement>('[data-agentworks-widget]');
      if (bubble) bubble.style.display = isPrivateRoute ? 'none' : '';
    };

    // Run immediately and after a short delay (widget may inject async)
    hide();
    const timer = setTimeout(hide, 1000);
    return () => clearTimeout(timer);
  }, [isPrivateRoute]);

  // Only load the script on first render (not conditional — we toggle visibility instead)
  return (
    <Script
      src="https://agentworks-production.up.railway.app/api/v1/widget/embed.js"
      data-widget-key="rwTAE7bSICAHEtgao2oHlHuR-5a_usXWAO9xR-P1Y9Q"
      data-api-url="https://agentworks-production.up.railway.app/api/v1"
      strategy="lazyOnload"
    />
  );
}

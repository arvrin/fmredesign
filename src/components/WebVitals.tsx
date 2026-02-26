'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: { name: string; value: number; id: string; rating: string }) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
  }

  // Send to GoodmanTech Observatory (existing analytics pixel)
  if (typeof navigator.sendBeacon === 'function') {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      rating: metric.rating,
      page: window.location.pathname,
    });
    navigator.sendBeacon('/api/vitals', body);
  }
}

export function WebVitals() {
  useEffect(() => {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null;
}

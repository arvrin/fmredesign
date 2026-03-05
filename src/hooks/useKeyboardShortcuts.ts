'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface ShortcutConfig {
  onHelp?: () => void;
  onNew?: () => void;
}

const SEQUENCE_TIMEOUT = 500;

const GO_SHORTCUTS: Record<string, string> = {
  d: '/admin',
  p: '/admin/projects',
  c: '/admin/content',
  l: '/admin/clients',
  i: '/admin/invoices',
};

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts(config?: ShortcutConfig) {
  const router = useRouter();
  const pathname = usePathname();
  const pendingKeyRef = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const clearPending = useCallback(() => {
    pendingKeyRef.current = null;
    setPendingKey(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs or when meta/ctrl is held
      if (isInputFocused()) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      // Handle second key in sequence
      if (pendingKeyRef.current === 'g') {
        clearPending();
        const href = GO_SHORTCUTS[key];
        if (href) {
          e.preventDefault();
          router.push(href);
        }
        return;
      }

      // Single-key shortcuts
      if (key === '?') {
        e.preventDefault();
        config?.onHelp?.();
        return;
      }

      if (key === 'n') {
        e.preventDefault();
        config?.onNew?.();
        return;
      }

      // Start sequence
      if (key === 'g') {
        e.preventDefault();
        pendingKeyRef.current = 'g';
        setPendingKey('g');
        timeoutRef.current = setTimeout(clearPending, SEQUENCE_TIMEOUT);
        return;
      }
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [router, config, clearPending]);

  return { pendingKey };
}

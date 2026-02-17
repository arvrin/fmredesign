'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'var(--admin-surface)',
          border: '1px solid var(--admin-border)',
          color: 'var(--admin-text-primary)',
          fontSize: '14px',
        },
        classNames: {
          success: 'border-l-4 !border-l-green-500',
          error: 'border-l-4 !border-l-red-500',
          warning: 'border-l-4 !border-l-amber-500',
          info: 'border-l-4 !border-l-blue-500',
        },
      }}
      closeButton
      richColors
      duration={4000}
    />
  );
}

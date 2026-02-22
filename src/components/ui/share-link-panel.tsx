'use client';

import React, { useState, useCallback } from 'react';
import { DashboardButton as Button } from '@/design-system';
import { Copy, Check, X } from 'lucide-react';

interface ShareLinkPanelProps {
  url: string;
  onDismiss: () => void;
  className?: string;
}

export function ShareLinkPanel({ url, onDismiss, className }: ShareLinkPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  return (
    <div className={`mt-4 p-4 bg-fm-neutral-50 border border-fm-neutral-200 rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${className || ''}`}>
      <input
        readOnly
        value={url}
        className="flex-1 text-sm bg-white border border-fm-neutral-300 rounded-md px-3 py-2 text-fm-neutral-700"
      />
      <div className="flex items-center gap-2">
        <Button variant="client" size="sm" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

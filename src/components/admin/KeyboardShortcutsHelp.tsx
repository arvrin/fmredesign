'use client';

import { X } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['g', 'd'], description: 'Go to Dashboard' },
  { keys: ['g', 'p'], description: 'Go to Projects' },
  { keys: ['g', 'c'], description: 'Go to Content' },
  { keys: ['g', 'l'], description: 'Go to Clients' },
  { keys: ['g', 'i'], description: 'Go to Invoices' },
  { keys: ['n'], description: 'New item (context-aware)' },
  { keys: ['?'], description: 'Show this help' },
  { keys: ['⌘', 'K'], description: 'Open command palette' },
  { keys: ['⌘', 'B'], description: 'Toggle sidebar' },
  { keys: ['Esc'], description: 'Close panels' },
];

export function KeyboardShortcutsHelp({ open, onClose }: KeyboardShortcutsHelpProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40"
        style={{ zIndex: 60 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-fm-neutral-200 overflow-hidden"
        style={{ zIndex: 61 }}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-fm-neutral-100">
          <h2 className="text-lg font-semibold text-fm-neutral-900">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-fm-neutral-400 hover:text-fm-neutral-700 hover:bg-fm-neutral-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-2.5">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-fm-neutral-600">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, ki) => (
                  <span key={ki}>
                    {ki > 0 && <span className="text-xs text-fm-neutral-400 mx-0.5">then</span>}
                    <kbd className="inline-block min-w-[24px] px-1.5 py-0.5 text-xs font-mono bg-fm-neutral-100 border border-fm-neutral-200 rounded text-fm-neutral-700" style={{ textAlign: 'center' }}>
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

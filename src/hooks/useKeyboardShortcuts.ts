'use client';

import { useEffect } from 'react';

interface ShortcutHandlers {
  /** Cmd+S / Ctrl+S — flush pending draft save. */
  onSave?: () => void;
}

/**
 * Global keyboard shortcuts. Listens at window-level and `preventDefault()`s
 * the browser's native handler when our handler is set.
 *
 * Cmd+P (print / export PDF) is intentionally NOT intercepted — the native
 * print flow already routes through our @media print CSS.
 */
export function useKeyboardShortcuts({ onSave }: ShortcutHandlers) {
  useEffect(() => {
    if (!onSave) return;

    const handler = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && (e.key === 's' || e.key === 'S') && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSave]);
}

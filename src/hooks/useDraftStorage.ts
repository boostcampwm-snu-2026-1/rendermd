'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const STORAGE_KEY = 'rendermd:draft';
const DEBOUNCE_MS = 500;

interface UseDraftStorageReturn {
  value: string;
  setValue: (next: string) => void;
  status: SaveStatus;
  /** Re-attempt a write that previously failed (e.g. after QuotaExceededError). */
  retry: () => void;
  /** Synchronously commit any pending debounced write (e.g. on Cmd/Ctrl+S). */
  flush: () => void;
}

function readStorage(): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStorage(value: string): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Persists the markdown draft to localStorage with a debounced write.
 *
 * Hardening on top of the basic debounce:
 *   - **pagehide / beforeunload**: flushes any pending write so a tab close
 *     during the 500ms debounce window doesn't drop the keystroke.
 *   - **storage event**: if another tab writes the same key, mirror the new
 *     value here (last-write-wins; the proposal scopes to single-document).
 *   - **retry()**: lets the UI re-attempt a write after a QuotaExceededError
 *     (e.g. the user freed space and clicked "Retry").
 *
 * SSR/hydration: returns `fallback` on first render to match the build-time
 * pre-render. After mount, restores from localStorage.
 */
export function useDraftStorage(fallback: string): UseDraftStorageReturn {
  const [value, setValueState] = useState<string>(fallback);
  const [status, setStatus] = useState<SaveStatus>('idle');

  // Refs hold the latest pending write so handlers (pagehide / unmount) can
  // flush synchronously without going through a render.
  const pendingValueRef = useRef<string>(fallback);
  const hasPendingWriteRef = useRef<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Load saved draft once after mount.
  useEffect(() => {
    const saved = readStorage();
    if (saved !== null) {
      setValueState(saved);
      pendingValueRef.current = saved;
      // Stay 'idle' on restore — the user hasn't typed yet this session.
    }
  }, []);

  // Synchronous flush — used by event handlers that may be the last chance
  // before the page unloads. Also doubles as the manual-save entry point
  // (Cmd/Ctrl+S) — if nothing is pending we still flip 'saving' → 'saved'
  // briefly so the user gets visible confirmation that their explicit
  // action was acknowledged.
  const flushPending = useCallback(() => {
    if (!hasPendingWriteRef.current) {
      // No pending write, but flip status to give explicit-save feedback.
      setStatus('saving');
      window.setTimeout(() => setStatus('saved'), 120);
      return;
    }
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const ok = writeStorage(pendingValueRef.current);
    hasPendingWriteRef.current = false;
    setStatus(ok ? 'saved' : 'error');
  }, []);

  // pagehide is the canonical "tab closing" signal in modern browsers.
  // beforeunload is the older fallback; both fire before storage flushes.
  useEffect(() => {
    const handler = () => flushPending();
    window.addEventListener('pagehide', handler);
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('pagehide', handler);
      window.removeEventListener('beforeunload', handler);
    };
  }, [flushPending]);

  // Multi-tab: pick up writes from other tabs (storage events don't fire in
  // the originating tab — only in peers).
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      if (e.newValue === null || e.newValue === pendingValueRef.current) return;
      // Cancel any pending local debounce — a peer tab just wrote a newer
      // value, and our pending write would clobber it with stale text.
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setValueState(e.newValue);
      pendingValueRef.current = e.newValue;
      hasPendingWriteRef.current = false;
      setStatus('saved');
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Flush + cleanup on unmount (also covers React StrictMode double-invoke
  // since flush is idempotent when nothing's pending).
  useEffect(() => {
    return () => {
      flushPending();
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [flushPending]);

  const setValue = useCallback((next: string) => {
    setValueState(next);
    pendingValueRef.current = next;
    hasPendingWriteRef.current = true;
    setStatus('saving');
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      const ok = writeStorage(next);
      hasPendingWriteRef.current = false;
      setStatus(ok ? 'saved' : 'error');
    }, DEBOUNCE_MS);
  }, []);

  const retry = useCallback(() => {
    setStatus('saving');
    const ok = writeStorage(pendingValueRef.current);
    hasPendingWriteRef.current = !ok;
    setStatus(ok ? 'saved' : 'error');
  }, []);

  return { value, setValue, status, retry, flush: flushPending };
}

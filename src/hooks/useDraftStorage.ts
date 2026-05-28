'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const STORAGE_KEY = 'rendermd:draft';
const DEBOUNCE_MS = 500;

interface UseDraftStorageReturn {
  value: string;
  setValue: (next: string) => void;
  status: SaveStatus;
}

/**
 * Persists the markdown draft to localStorage with a debounced write.
 *
 * SSR/hydration: returns `fallback` on first render to match the build-time
 * pre-render. After mount, restores from localStorage (one-frame flicker is
 * intentional — avoiding it requires inlining storage content into HTML).
 */
export function useDraftStorage(fallback: string): UseDraftStorageReturn {
  const [value, setValueState] = useState<string>(fallback);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timerRef = useRef<number | null>(null);

  // Load saved draft once after mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setValueState(saved);
        // Stay 'idle' on restore — the user hasn't typed yet this session.
      }
    } catch {
      // localStorage unavailable (privacy mode etc.); nothing to load.
    }
  }, []);

  // Cleanup pending timer on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const setValue = useCallback((next: string) => {
    setValueState(next);
    setStatus('saving');
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, next);
        setStatus('saved');
      } catch (err) {
        // Most commonly QuotaExceededError; could also be SecurityError.
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[rendermd] draft save failed:', err);
        }
        setStatus('error');
      }
    }, DEBOUNCE_MS);
  }, []);

  return { value, setValue, status };
}

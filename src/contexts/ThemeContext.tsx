'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'sepia' | 'hc';

export const THEMES: ReadonlyArray<{ id: Theme; label: string }> = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'sepia', label: 'Sepia' },
  { id: 'hc', label: 'High contrast' },
];

// NOTE: Keep THEME_STORAGE_KEY and the Theme literal union in sync with the
// inline init script in src/app/layout.tsx (it runs before React loads and
// cannot import this module).
export const THEME_STORAGE_KEY = 'rendermd:theme';
const DEFAULT_THEME: Theme = 'light';

export function isTheme(value: string | null | undefined): value is Theme {
  return value === 'light' || value === 'dark' || value === 'sepia' || value === 'hc';
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  const candidate = document.documentElement.dataset.theme;
  return isTheme(candidate) ? candidate : DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Lazy initializer reads the theme that the inline script in layout.tsx
  // already applied to <html> before React mounted. This prevents a
  // one-frame light → saved-theme flash in components that vary by theme
  // (CodeMirror in particular).
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Quota / privacy-mode failures: theme still applies in-session.
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be called inside <ThemeProvider>');
  }
  return ctx;
}

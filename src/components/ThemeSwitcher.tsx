'use client';

import { useId } from 'react';
import { Palette } from 'lucide-react';
import { isTheme, THEMES, useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeSwitcher.module.css';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const id = useId();

  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        <Palette size={14} strokeWidth={2} aria-hidden="true" />
        <span className={styles.labelText}>Theme</span>
      </label>
      <select
        id={id}
        className={styles.select}
        value={theme}
        onChange={(event) => {
          const next = event.target.value;
          if (isTheme(next)) setTheme(next);
        }}
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}

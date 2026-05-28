'use client';

import styles from './TabSwitcher.module.css';

export type Tab = 'edit' | 'preview';

interface TabSwitcherProps {
  active: Tab;
  onChange: (next: Tab) => void;
}

/**
 * Mobile-only toggle between editor and preview.
 *
 * Uses `aria-pressed` toggle-button semantics rather than the WAI-ARIA tablist
 * pattern — tablist requires roving tabIndex, arrow-key navigation, and
 * `role='tabpanel'` on the panels. A pair of toggle buttons is honest and
 * adequate here.
 */
export function TabSwitcher({ active, onChange }: TabSwitcherProps) {
  return (
    <nav className={styles.tabBar} aria-label="Editor view" data-print="hide">
      <button
        type="button"
        aria-pressed={active === 'edit'}
        className={`${styles.tab} ${active === 'edit' ? styles.active : ''}`}
        onClick={() => onChange('edit')}
      >
        Edit
      </button>
      <button
        type="button"
        aria-pressed={active === 'preview'}
        className={`${styles.tab} ${active === 'preview' ? styles.active : ''}`}
        onClick={() => onChange('preview')}
      >
        Preview
      </button>
    </nav>
  );
}

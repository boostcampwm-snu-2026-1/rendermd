'use client';

import styles from './TabSwitcher.module.css';

export type Tab = 'edit' | 'preview';

interface TabSwitcherProps {
  active: Tab;
  onChange: (next: Tab) => void;
}

export function TabSwitcher({ active, onChange }: TabSwitcherProps) {
  return (
    <div className={styles.tabBar} role="tablist" aria-label="Editor view" data-print="hide">
      <button
        type="button"
        role="tab"
        aria-selected={active === 'edit'}
        className={`${styles.tab} ${active === 'edit' ? styles.active : ''}`}
        onClick={() => onChange('edit')}
      >
        Edit
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={active === 'preview'}
        className={`${styles.tab} ${active === 'preview' ? styles.active : ''}`}
        onClick={() => onChange('preview')}
      >
        Preview
      </button>
    </div>
  );
}

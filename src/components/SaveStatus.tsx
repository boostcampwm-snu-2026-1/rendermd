'use client';

import type { SaveStatus as Status } from '@/hooks/useDraftStorage';
import styles from './SaveStatus.module.css';

const LABELS: Record<Status, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Save failed',
};

interface SaveStatusProps {
  status: Status;
}

export function SaveStatusIndicator({ status }: SaveStatusProps) {
  const text = LABELS[status];
  // Only terminal states are announced to screen readers — otherwise the
  // debounce cycle would chatter "Saving… Saved" on every keystroke.
  const announce = status === 'saved' || status === 'error';
  return (
    <span
      className={`${styles.indicator} ${styles[status]}`}
      aria-live={announce ? 'polite' : 'off'}
      aria-atomic="true"
    >
      {text}
    </span>
  );
}

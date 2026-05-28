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
  return (
    <span className={`${styles.indicator} ${styles[status]}`} aria-live="polite" aria-atomic="true">
      {text}
    </span>
  );
}

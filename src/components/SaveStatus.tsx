'use client';

import { AlertCircle, Check, Loader, RotateCcw } from 'lucide-react';
import type { SaveStatus as Status } from '@/hooks/useDraftStorage';
import styles from './SaveStatus.module.css';

const LABELS: Record<Status, string> = {
  idle: 'Draft',
  saving: 'Saving',
  saved: 'Saved',
  error: 'Save failed',
};

interface SaveStatusProps {
  status: Status;
  onRetry?: () => void;
}

function StatusIcon({ status }: { status: Status }) {
  if (status === 'saving') {
    return <Loader size={14} strokeWidth={2.25} className={styles.spin} aria-hidden="true" />;
  }
  if (status === 'saved') {
    return <Check size={14} strokeWidth={2.25} aria-hidden="true" />;
  }
  if (status === 'error') {
    return <AlertCircle size={14} strokeWidth={2.25} aria-hidden="true" />;
  }
  return <span className={styles.dotPlaceholder} aria-hidden="true" />;
}

export function SaveStatusIndicator({ status, onRetry }: SaveStatusProps) {
  const announce = status === 'saved' || status === 'error';
  return (
    <span
      className={`${styles.indicator} ${styles[status]}`}
      aria-live={announce ? 'polite' : 'off'}
      aria-atomic="true"
    >
      <StatusIcon status={status} />
      <span className={styles.text}>{LABELS[status]}</span>
      {status === 'error' && onRetry && (
        <button type="button" className={styles.retryBtn} onClick={onRetry} aria-label="Retry save">
          <RotateCcw size={12} strokeWidth={2.25} aria-hidden="true" />
          <span className={styles.retryText}>Retry</span>
        </button>
      )}
    </span>
  );
}

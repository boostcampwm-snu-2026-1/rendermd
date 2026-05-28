'use client';

import { useEffect, useRef, useState } from 'react';
import { FileDown } from 'lucide-react';
import { isIOSSafari } from '@/util/platform';
import styles from './ExportButton.module.css';

export function ExportButton() {
  const [showGuide, setShowGuide] = useState(false);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!showGuide) return;

    previousFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    continueButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGuide(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [showGuide]);

  const triggerPrint = () => {
    setShowGuide(false);
    // Defer to let the modal unmount before print steals the thread.
    setTimeout(() => window.print(), 0);
  };

  const handleClick = () => {
    if (isIOSSafari()) {
      setShowGuide(true);
    } else {
      window.print();
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick}
        aria-label="Export as PDF"
      >
        <FileDown size={16} strokeWidth={2} aria-hidden="true" />
        Export PDF
      </button>
      {showGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="print-guide-title"
          className={styles.backdrop}
          onClick={() => setShowGuide(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} data-print="hide">
            <h2 id="print-guide-title" className={styles.title}>
              Saving as PDF on iPhone / iPad
            </h2>
            <ol className={styles.steps}>
              <li>
                Tap <b>Continue</b> below to open the print preview.
              </li>
              <li>Spread two fingers (pinch out) on the preview to expand it.</li>
              <li>
                Tap the share icon, then <b>Save to Files</b>.
              </li>
            </ol>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => setShowGuide(false)}
              >
                Cancel
              </button>
              <button
                ref={continueButtonRef}
                type="button"
                className={styles.primary}
                onClick={triggerPrint}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

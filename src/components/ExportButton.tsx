'use client';

import { useState } from 'react';
import { isIOSSafari } from '@/util/platform';
import styles from './ExportButton.module.css';

export function ExportButton() {
  const [showGuide, setShowGuide] = useState(false);

  const triggerPrint = () => {
    setShowGuide(false);
    window.print();
  };

  const handleClick = () => {
    if (isIOSSafari()) {
      setShowGuide(true);
    } else {
      triggerPrint();
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
        <span aria-hidden="true">📄</span> Export PDF
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
              <button type="button" className={styles.primary} onClick={triggerPrint}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

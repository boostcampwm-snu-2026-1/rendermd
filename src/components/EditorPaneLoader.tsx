import styles from './EditorPane.module.css';

/**
 * Placeholder shown while the CodeMirror chunk loads. Matches the editor
 * frame so layout doesn't jump when the real editor mounts.
 */
export function EditorPaneLoader() {
  return (
    <div className={styles.wrapper} aria-busy="true" aria-live="polite">
      <div className={styles.loaderInner}>
        <span className={styles.loaderText}>Loading editor…</span>
      </div>
    </div>
  );
}

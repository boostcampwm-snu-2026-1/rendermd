import styles from './EditorPane.module.css';

/**
 * Placeholder shown while the CodeMirror chunk loads. Mirrors the editor
 * frame (including a gutter strip on the left) so content origin doesn't
 * shift horizontally when the real editor mounts.
 *
 * aria-busy / aria-live live on the parent <section> in page.tsx so the
 * announcement doesn't race with this node unmounting.
 */
export function EditorPaneLoader() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loaderInner}>
        <div className={styles.loaderGutter} aria-hidden="true" />
        <span className={styles.loaderText}>Editor</span>
      </div>
    </div>
  );
}

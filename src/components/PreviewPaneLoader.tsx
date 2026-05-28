import styles from './PreviewPane.module.css';

/**
 * Placeholder shown while the react-markdown + plugins chunk loads.
 * Quiet caption — the chunk lands fast enough that anything heavier
 * (skeleton, spinner) would over-promise.
 */
export function PreviewPaneLoader() {
  return (
    <article className={styles.article}>
      <p className={styles.loaderHint}>Rendering preview…</p>
    </article>
  );
}

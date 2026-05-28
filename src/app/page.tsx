'use client';

import { useState } from 'react';
import { EditorPane } from '@/components/EditorPane';
import styles from './page.module.css';

const DEFAULT_VALUE = `# Welcome to rendermd

Paste an LLM response on the left and watch it render on the right.

- **Bold** and *italic*
- Lists and \`inline code\`
- More features coming in the next PRs.
`;

export default function Home() {
  const [value, setValue] = useState(DEFAULT_VALUE);

  return (
    <main className={styles.layout}>
      <section className={styles.editor} aria-label="Markdown editor">
        <EditorPane value={value} onChange={setValue} />
      </section>
      <section className={styles.preview} aria-label="Preview">
        <pre className={styles.previewRaw}>{value}</pre>
      </section>
    </main>
  );
}

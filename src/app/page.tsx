'use client';

import { useState } from 'react';
import { EditorPane } from '@/components/EditorPane';
import styles from './page.module.css';

const DEFAULT_VALUE = `# Welcome to rendermd

Paste an LLM response below and watch it render on the right.

- **Bold** and *italic*
- Lists and \`inline code\`
- More features coming in the next PRs.
`;

export default function Home() {
  const [markdown, setMarkdown] = useState(DEFAULT_VALUE);

  return (
    <main className={styles.layout}>
      <section className={styles.editor}>
        <EditorPane value={markdown} onChange={setMarkdown} />
      </section>
      <section className={styles.preview}>
        <pre className={styles.previewRaw}>{markdown}</pre>
      </section>
    </main>
  );
}

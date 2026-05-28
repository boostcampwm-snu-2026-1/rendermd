'use client';

import { useState } from 'react';
import { EditorPane } from '@/components/EditorPane';
import { PreviewPane } from '@/components/PreviewPane';
import styles from './page.module.css';

const DEFAULT_VALUE = `# Welcome to rendermd

Paste an LLM response on the left and watch it render on the right.

## Features

- **Bold**, *italic*, and \`inline code\`
- Lists, tables, blockquotes
- GFM task lists:
  - [x] Done
  - [ ] Todo
- ~~Strikethrough~~ and other GFM
- Math via KaTeX: $E = mc^2$

\`\`\`ts
function greet(name: string) {
  return \`hello, \${name}\`;
}
\`\`\`

> More features coming in the next PRs (themes, autosave, PDF export).
`;

export default function Home() {
  const [value, setValue] = useState(DEFAULT_VALUE);

  return (
    <main className={styles.layout}>
      <section className={styles.editor} aria-label="Markdown editor">
        <EditorPane value={value} onChange={setValue} />
      </section>
      <section className={styles.preview} aria-label="Preview">
        <PreviewPane markdown={value} />
      </section>
    </main>
  );
}

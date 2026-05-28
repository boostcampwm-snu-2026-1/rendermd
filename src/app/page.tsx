'use client';

import { useState } from 'react';
import { EditorPane } from '@/components/EditorPane';
import { PreviewPane } from '@/components/PreviewPane';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useTheme } from '@/contexts/ThemeContext';
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

> More features coming in the next PRs (autosave, PDF export, mobile tabs).
`;

export default function Home() {
  const [value, setValue] = useState(DEFAULT_VALUE);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>rendermd</h1>
        <div className={styles.toolbar}>
          <ThemeSwitcher />
        </div>
      </header>
      <main className={styles.layout}>
        <section className={styles.editor} aria-label="Markdown editor">
          <EditorPane value={value} onChange={setValue} dark={isDark} />
        </section>
        <section className={styles.preview} aria-label="Preview">
          <PreviewPane markdown={value} />
        </section>
      </main>
    </div>
  );
}

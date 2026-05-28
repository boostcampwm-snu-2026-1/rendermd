'use client';

import { useState } from 'react';
import { EditorPane } from '@/components/EditorPane';
import { ExportButton } from '@/components/ExportButton';
import { PreviewPane } from '@/components/PreviewPane';
import { SaveStatusIndicator } from '@/components/SaveStatus';
import { TabSwitcher, type Tab } from '@/components/TabSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useTheme } from '@/contexts/ThemeContext';
import { useDraftStorage } from '@/hooks/useDraftStorage';
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

> Click **Export PDF** to print the preview. Your draft autosaves to this browser.
`;

export default function Home() {
  const { value, setValue, status } = useDraftStorage(DEFAULT_VALUE);
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('edit');
  const isDark = theme === 'dark';

  return (
    <div className={styles.app} data-app>
      <header className={styles.header} data-print="hide">
        <div className={styles.brand}>
          <h1 className={styles.wordmark}>rendermd</h1>
          <span className={styles.tagline}>markdown · preview · pdf</span>
        </div>
        <div className={styles.toolbar}>
          <SaveStatusIndicator status={status} />
          <ThemeSwitcher />
          <ExportButton />
        </div>
      </header>
      <TabSwitcher active={activeTab} onChange={setActiveTab} />
      <main className={styles.layout} data-app-main>
        <section
          className={styles.editor}
          aria-label="Markdown editor"
          data-print="hide"
          data-tab-active={activeTab === 'edit'}
        >
          <EditorPane value={value} onChange={setValue} dark={isDark} />
        </section>
        <section
          className={styles.preview}
          aria-label="Preview"
          data-print="target"
          data-tab-active={activeTab === 'preview'}
        >
          <PreviewPane markdown={value} />
        </section>
      </main>
    </div>
  );
}

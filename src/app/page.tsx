'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ExportButton } from '@/components/ExportButton';
import { EditorPaneLoader } from '@/components/EditorPaneLoader';
import { Logo } from '@/components/Logo';
import { PreviewPaneLoader } from '@/components/PreviewPaneLoader';
import { SaveStatusIndicator } from '@/components/SaveStatus';
import { TabSwitcher, type Tab } from '@/components/TabSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useTheme } from '@/contexts/ThemeContext';
import { useDraftStorage } from '@/hooks/useDraftStorage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import styles from './page.module.css';

// CodeMirror is ~200 kB; defer behind dynamic import.
const EditorPane = dynamic(() => import('@/components/EditorPane').then((m) => m.EditorPane), {
  ssr: false,
  loading: () => <EditorPaneLoader />,
});

// react-markdown + remark-gfm + remark-math + rehype-katex + rehype-highlight
// totals ~200 kB. Defer it too.
const PreviewPane = dynamic(() => import('@/components/PreviewPane').then((m) => m.PreviewPane), {
  ssr: false,
  loading: () => <PreviewPaneLoader />,
});

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
  const { value, setValue, status, retry, flush } = useDraftStorage(DEFAULT_VALUE);
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('edit');
  const isDark = theme === 'dark';

  useKeyboardShortcuts({ onSave: flush });

  return (
    <div className={styles.app} data-app>
      <header className={styles.header} data-print="hide">
        <div className={styles.brand}>
          <Logo size={22} className={styles.logo} title={null} />
          <h1 className={styles.wordmark}>rendermd</h1>
          <span className={styles.tagline}>markdown · preview · pdf</span>
        </div>
        <div className={styles.toolbar}>
          <SaveStatusIndicator status={status} onRetry={retry} />
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

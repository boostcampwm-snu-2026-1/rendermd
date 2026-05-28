'use client';

import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import styles from './EditorPane.module.css';

interface EditorPaneProps {
  value: string;
  onChange: (next: string) => void;
  dark?: boolean;
}

export function EditorPane({ value, onChange, dark = false }: EditorPaneProps) {
  return (
    <div className={styles.wrapper} aria-label="Markdown editor">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[markdown()]}
        theme={dark ? oneDark : 'light'}
        height="100%"
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          highlightSelectionMatches: false,
        }}
      />
    </div>
  );
}

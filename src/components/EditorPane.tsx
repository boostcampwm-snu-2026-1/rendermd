'use client';

import CodeMirror, { type Extension } from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import styles from './EditorPane.module.css';

const EXTENSIONS: Extension[] = [markdown()];

const BASIC_SETUP = {
  lineNumbers: true,
  foldGutter: true,
  highlightActiveLine: true,
  highlightSelectionMatches: false,
} as const;

interface EditorPaneProps {
  value: string;
  onChange: (next: string) => void;
  dark?: boolean;
}

export function EditorPane({ value, onChange, dark = false }: EditorPaneProps) {
  return (
    <div className={styles.wrapper}>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={EXTENSIONS}
        basicSetup={BASIC_SETUP}
        theme={dark ? oneDark : 'light'}
        height="100%"
      />
    </div>
  );
}

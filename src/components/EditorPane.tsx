'use client';

import CodeMirror, { type Extension } from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
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
}

export function EditorPane({ value, onChange }: EditorPaneProps) {
  return (
    <div className={styles.wrapper}>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={EXTENSIONS}
        basicSetup={BASIC_SETUP}
        height="100%"
      />
    </div>
  );
}

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { remarkPageBreak } from '@/lib/remark-page-break';
import styles from './PreviewPane.module.css';

const REMARK_PLUGINS = [remarkGfm, remarkMath, remarkPageBreak];
const REHYPE_PLUGINS = [rehypeKatex, rehypeHighlight];

interface PreviewPaneProps {
  markdown: string;
}

export function PreviewPane({ markdown }: PreviewPaneProps) {
  return (
    <article className={styles.article}>
      <ReactMarkdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
        {markdown}
      </ReactMarkdown>
    </article>
  );
}

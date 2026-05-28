import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { remarkPageBreak } from '@/lib/remark-page-break';

function render(md: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processor = (unified as any)()
    .use(remarkParse)
    .use(remarkPageBreak)
    .use(remarkRehype)
    .use(rehypeStringify);
  return String(processor.processSync(md));
}

describe('remark-page-break', () => {
  it('replaces the marker paragraph with a page-break div', () => {
    const html = render(`before\n\n<!-- page-break -->\n\nafter\n`);
    expect(html).toContain('<div class="rendermd-page-break" aria-hidden="true"></div>');
    expect(html).not.toContain('<p><!-- page-break --></p>');
  });

  it('accepts page-break without hyphen', () => {
    const html = render(`a\n\n<!--pagebreak-->\n\nb\n`);
    expect(html).toContain('rendermd-page-break');
  });

  it('accepts surrounding whitespace inside the comment', () => {
    const html = render(`a\n\n<!--   page-break   -->\n\nb\n`);
    expect(html).toContain('rendermd-page-break');
  });

  it('does not match the marker when embedded mid-paragraph', () => {
    const html = render(`paragraph with <!-- page-break --> inline.\n`);
    expect(html).not.toContain('rendermd-page-break');
  });

  it('leaves other content untouched', () => {
    const html = render(`# Title\n\nbody\n`);
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<p>body</p>');
    expect(html).not.toContain('rendermd-page-break');
  });
});

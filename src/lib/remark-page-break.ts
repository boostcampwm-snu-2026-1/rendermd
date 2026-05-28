import type { Plugin } from 'unified';
import type { Root, Html, ThematicBreak } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * Recognizes a manual page-break marker in markdown:
 *
 *     <!-- page-break -->
 *
 * on its own line. The marker is replaced with an empty
 * `<div class="rendermd-page-break">`. On screen the div is invisible
 * (zero height + aria-hidden); in print, the print stylesheet forces a
 * new page before it.
 *
 * Why an HTML-comment marker instead of a custom directive (`::pagebreak::`):
 *   - HTML comments render as nothing in tools that don't understand them
 *     (GitHub preview, plain renderers) — the source markdown stays
 *     portable.
 *   - No clash with existing GFM / extended-markdown syntax.
 *
 * Implementation notes:
 *   - remark parses `<!-- ... -->` as an mdast `html` node (not paragraph).
 *   - mdast-util-to-hast strips `html` nodes by default (security:
 *     raw-HTML is dangerous), so we can't just decorate the existing node.
 *     Instead, we replace it with a `thematicBreak` node and use
 *     `data.hName` to override the rendered element from `<hr>` to `<div>`.
 *     thematicBreak is the closest "page boundary" semantic mdast offers
 *     and converts cleanly to hast without enabling raw-HTML.
 */
const MARKER = /^\s*<!--\s*page-?break\s*-->\s*$/i;

export const remarkPageBreak: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'html', (node: Html, index, parent) => {
      if (parent == null || index == null) return;
      // Only block-level markers count — skip inline occurrences inside
      // a paragraph. Page-break makes no sense mid-sentence.
      if (parent.type !== 'root') return;
      if (!MARKER.test(node.value)) return;

      const replacement: ThematicBreak = {
        type: 'thematicBreak',
        data: {
          hName: 'div',
          hProperties: {
            className: ['rendermd-page-break'],
            'aria-hidden': 'true',
          },
        },
      };
      parent.children[index] = replacement;
    });
  };
};

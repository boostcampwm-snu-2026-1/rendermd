/**
 * Capture the OpenGraph image (1200×630) from the static HTML template.
 * Output: src/app/opengraph-image.png — Next 15 auto-emits the
 * appropriate <meta property="og:image"> tag.
 *
 * Apple Touch Icon (180×180) is generated from the same template at a
 * different crop / size.
 *
 * Usage:
 *   pnpm dlx tsx scripts/capture-og.ts
 */

import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const TEMPLATE = pathToFileURL(path.resolve('scripts/og-template.html')).href;
const OG_OUT = path.resolve('src/app/opengraph-image.png');
const APPLE_OUT = path.resolve('src/app/apple-icon.png');

async function main() {
  const browser = await chromium.launch();

  // OpenGraph: 1200×630, full template.
  {
    const ctx = await browser.newContext({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(TEMPLATE, { waitUntil: 'networkidle' });
    await page.screenshot({ path: OG_OUT, fullPage: false });
    console.log(`✓ ${path.relative(process.cwd(), OG_OUT)} (1200×630)`);
    await ctx.close();
  }

  // Apple Touch Icon: 180×180 square. Use the logo glyph alone (no
  // wordmark — illegible at 180px). Light-on-dark for OS tab and
  // homescreen consistency.
  {
    const ctx = await browser.newContext({
      viewport: { width: 180, height: 180 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.setContent(`<!doctype html><html><head><style>
      html, body { margin: 0; padding: 0; width: 180px; height: 180px;
        background: #111111; display: flex; align-items: center; justify-content: center; }
    </style></head><body>
      <svg width="118" height="118" viewBox="0 0 24 24" fill="none"
        stroke="#ededed" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2 L22 12 L12 22 L2 12 Z"/>
        <line x1="8" y1="11" x2="16" y2="11"/>
        <line x1="8" y1="15" x2="12" y2="15"/>
      </svg>
    </body></html>`);
    await page.screenshot({ path: APPLE_OUT, fullPage: false });
    console.log(`✓ ${path.relative(process.cwd(), APPLE_OUT)} (180×180)`);
    await ctx.close();
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

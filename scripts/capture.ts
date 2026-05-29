/**
 * Capture theme screenshots and a sample PDF export from the live site.
 * Output lands in docs/screenshots/.
 *
 * Usage:
 *   pnpm dlx tsx scripts/capture.ts                       # default: live URL
 *   SITE=http://localhost:3000 pnpm dlx tsx scripts/capture.ts
 */

import { chromium, type Browser, type Page } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SITE = process.env.SITE ?? 'https://boostcampwm-snu-2026-1.github.io/rendermd-hyuk/';
const OUT = path.resolve(process.cwd(), 'docs/screenshots');

const THEMES = ['light', 'dark', 'sepia', 'hc'] as const;
type Theme = (typeof THEMES)[number];

const DESKTOP = { width: 1440, height: 900 } as const;
const MOBILE = { width: 390, height: 844 } as const;

async function selectTheme(page: Page, theme: Theme) {
  // Use the actual dropdown so React state, data-theme attribute, and
  // localStorage all match. Bypasses any hydration race we might hit when
  // setting localStorage and reloading.
  await page.locator('select').selectOption(theme);
  // Give CodeMirror's theme + react-markdown re-render a frame.
  await page.waitForTimeout(400);
}

async function openPage(browser: Browser, viewport: { width: number; height: number }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(SITE, { waitUntil: 'networkidle' });
  await page.waitForSelector('.cm-editor', { timeout: 10_000 }).catch(() => {});
  // Lazy preview chunk has its own loading; wait until the seed content
  // renders so the screenshot shows real markdown, not the placeholder.
  await page
    .waitForSelector('h1:has-text("Welcome to rendermd")', { timeout: 10_000 })
    .catch(() => {});
  return { context, page };
}

async function captureScreen(
  browser: Browser,
  theme: Theme,
  viewport: { width: number; height: number },
  suffix: string,
) {
  const { context, page } = await openPage(browser, viewport);
  await selectTheme(page, theme);
  const file = path.join(OUT, `${theme}-${suffix}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`✓ ${path.relative(process.cwd(), file)}`);
  await context.close();
}

async function capturePdf(browser: Browser, theme: Theme) {
  const { context, page } = await openPage(browser, DESKTOP);
  await selectTheme(page, theme);
  await page.emulateMedia({ media: 'print' });
  const file = path.join(OUT, `pdf-${theme}.pdf`);
  await page.pdf({
    path: file,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
  });
  console.log(`✓ ${path.relative(process.cwd(), file)}`);
  await context.close();
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`Capturing from ${SITE} into ${path.relative(process.cwd(), OUT)}/`);

  const browser = await chromium.launch();

  for (const theme of THEMES) {
    await captureScreen(browser, theme, DESKTOP, 'desktop');
  }
  for (const theme of THEMES) {
    await captureScreen(browser, theme, MOBILE, 'mobile');
  }
  await capturePdf(browser, 'light');
  await capturePdf(browser, 'dark');

  await browser.close();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

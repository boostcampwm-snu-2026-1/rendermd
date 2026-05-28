/**
 * Build + assert First Load JS budget for the / route.
 * Used as a replacement for the plain `pnpm build` step in CI so a
 * bundle regression fails the PR instead of sneaking through silently.
 *
 * Usage:
 *   pnpm dlx tsx scripts/check-perf-budget.ts        # uses default budget
 *   PERF_BUDGET_KB=150 pnpm dlx tsx scripts/check-perf-budget.ts
 */

import { spawnSync } from 'node:child_process';

const BUDGET_KB = Number(process.env.PERF_BUDGET_KB ?? '130');

console.log(`Building with First Load JS budget: ${BUDGET_KB} kB on / route\n`);

const build = spawnSync('pnpm', ['build'], {
  encoding: 'utf8',
  stdio: ['inherit', 'pipe', 'inherit'],
});

if (build.status !== 0) {
  console.error('\n✗ Build failed');
  process.exit(build.status ?? 1);
}

const output = build.stdout ?? '';
process.stdout.write(output);

// Next.js build output rows for the home route look like:
//   ┌ ○ /                                    7.03 kB         109 kB
//
// columns: (prefix) ○ (path) (Size) (First Load JS).
// We pull the FINAL number on the / row.
const homeLine = output.split('\n').find((l) => /^[┌├└│]\s+[○●]\s+\/\s/.test(l));
if (!homeLine) {
  console.error('\n✗ Could not find / route in build output — has the table format changed?');
  process.exit(2);
}

// Match the LAST "<number> kB|MB|B" on the line — that's First Load JS.
const numbers = [...homeLine.matchAll(/(\d+(?:\.\d+)?)\s*(kB|MB|B)\b/g)];
if (numbers.length < 2) {
  console.error('\n✗ Could not parse First Load JS column from / row:', homeLine);
  process.exit(2);
}
const last = numbers[numbers.length - 1];
const [, sizeStr, unit] = last;
let kb = Number(sizeStr);
if (unit === 'MB') kb *= 1024;
if (unit === 'B') kb /= 1024;

console.log(`\n— Perf budget check —`);
console.log(`/ route First Load JS: ${kb.toFixed(2)} kB`);
console.log(`Budget:                ${BUDGET_KB.toFixed(2)} kB`);

if (kb > BUDGET_KB) {
  console.error(`\n✗ Exceeded budget by ${(kb - BUDGET_KB).toFixed(2)} kB.`);
  console.error('  Either: (a) justify the regression in the PR description and bump');
  console.error('  PERF_BUDGET_KB in .github/workflows/ci.yml, or (b) trim the bundle.');
  process.exit(1);
}

const margin = BUDGET_KB - kb;
console.log(`✓ Under budget (${margin.toFixed(2)} kB margin).`);

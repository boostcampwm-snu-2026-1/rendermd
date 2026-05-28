# Week 2 Retrospective — implementation phase

> Written at end of week 2. Draft authored by the primary AI agent based on observed events; personal-stance edits will follow.

## What I shipped this week

7 issues, 7 feature PRs, 7 dev→main promotions, all CI-green.

- **#1 project setup** — Next.js 15 App Router, static export with env-driven `basePath`, ESLint flat config, CI now runs lint+typecheck+build (PR #25)
- **#2 editor-pane** — CodeMirror 6 + `@uiw/react-codemirror`, lang-markdown, controlled value/onChange (PR #28)
- **#3 preview-pane** — react-markdown + remark-gfm + remark-math + rehype-katex + rehype-highlight, themed CSS Modules typography (PR #31)
- **#4 theme** — light/dark/sepia/HC, CSS variables, inline `<head>` script for no-FOUC, lazy-init React state to avoid first-frame editor flash (PR #34)
- **#5 draft-storage** — `useDraftStorage` hook with debounce + status indicator, QuotaExceeded handled (PR #37)
- **#6 print-pdf basic** — `window.print()` with `@media print` driven by `data-print` attrs, iOS Safari guide modal with Esc/focus restoration (PR #40)
- **#7 responsive** — mobile tab switcher with `aria-pressed` toggles, visibility-based hiding to keep CodeMirror geometry valid (PR #43)

Plus 5 follow-up issues filed (#26, #29, #32, #35, #38, #41) for things deliberately deferred from in-PR scope.

## What went well

- **Verifier + reviewer sub-agents caught real bugs that I'd otherwise have shipped.** Top blockers caught:
  - PR #31: `katex` pinned `^0.17` against `rehype-katex`'s peer `^0.16` — would have produced subtly wrong math rendering.
  - PR #34: ThemeProvider's `useState('light')` initial value caused a one-frame CodeMirror light→dark flash on dark-theme reload.
  - PR #40: iPad Safari (iPadOS-as-Mac UA) silently bypassed the iOS guide modal — exactly the audience the modal serves.
  - PR #43: fake `role="tablist"` (no `aria-controls` / `tabpanel` / roving tabIndex) — better dropped than half-implemented.
- **CSS variable extraction in #31** as a follow-up paid off in #34 — themes PR was almost entirely additive (new `themes.css`), zero churn on `PreviewPane.module.css`.
- **"Did not pick" sections** in #29, #32 (lazy-load, bundle reduction) — laid the groundwork for week 3 polish without scope-creeping each PR.

## Where I got stuck

- **rehype-highlight bundle reduction (#32).** The reviewer suggested `subset` / `languages` options, but both control runtime detection, not bundle imports. Real fix needs custom lowlight instance or shiki migration. Spent ~15 minutes investigating, filed a focused issue, moved on. Bundle stayed at ~382 kB / route.
- **`next lint` deprecation warning** showing on every CI run. Codemod migration tracked in #26 but not done yet — keeps appearing in logs as noise.
- **Hydration vs lazy-load vs FOUC** is a 3-way trade-off and I learned which to pick per case:
  - Theme: lazy useState init (no flash, accept hydration warning, suppressed)
  - Draft storage: useEffect load (accept brief flash, no hydration risk)
  - Choosing wrong direction for either would have been a real bug.

## Inefficient patterns in AI collaboration

- **Spawning verifier + reviewer per PR is steady but slow.** Each PR adds ~3–4 min of wall time. Across 7 issues this week, agent overhead was ~30 min. The findings justified it (4 real blockers), but for very small follow-up commits I should reuse the open PR rather than re-spawn.
- **I went down a rabbit hole on the rehype-highlight `subset` option** trying to make the reviewer's exact suggestion work before realizing it wouldn't and filing the issue properly. Should have read the package docs first.
- **Default seed markdown** changed in every issue (#3 added KaTeX, #5 mentioned autosave, #6 mentioned Export PDF, #7 mentioned tabs). Each was a one-line update but they accumulated as churn. Lesson: write the seed once at #3 with all "and X is coming later" copy, leave alone after.

## Approach changes for week 3

- **For follow-up commits on an open PR, skip the verifier agent.** Run only the reviewer (the user-flow doesn't change on a fix-commit). Saves ~80 sec/PR.
- **For the PDF advanced PR (#8), run a verifier with explicit print-preview steps** — that's the one PR where eye-on-paper matters and CI alone can't validate.
- **For the deploy PR (#9), the verifier visits the deployed URL** — different smoke test from local dev.
- **Pre-flight bundle measurement before each PR.** Print the `/` route First Load JS in the commit message so trends are visible.

## New patterns to keep

- **`data-*` attribute selectors** for cross-cutting CSS (print mode, mobile tab state). They survive CSS Module class hashing and stay readable in HTML.
- **Filing focused follow-up issues immediately** rather than fixing-as-I-go. Kept each PR's scope tight. 5 follow-ups filed this week, none of them surprises.
- **Lazy-init `useState` from DOM state set by inline scripts** (theme pattern). Clean, deterministic, no FOUC.
- **Sub-agents post directly to PR via `gh pr comment --body-file`** — the report is durable beside the diff, not buried in chat history. Worth keeping.

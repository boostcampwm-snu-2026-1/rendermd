# Week 3 Retrospective — polish + deploy

> Written at end of week 3. Draft authored by the primary AI agent based on observed events; personal-stance edits will follow.

## What I shipped this week

2 feature issues, 2 PRs, both green and on `main`. The live site is at <https://boostcampwm-snu-2026-1.github.io/rendermd-hyuk/>.

- **#8 print-pdf advanced** (PR #47) — print-color-adjust on html+body, orphans/widows, h\*+p break-before, pre wraps in print, box-decoration-break: clone on inline code, page-break-inside: avoid on katex-display, paper-friendly URL annotations via `a[href]::after` (carved out inside `<pre>`/`<code>`)
- **#9 deploy** (PR #50) — dropped `if: false` from `deploy.yml`, build sets `NEXT_PUBLIC_BASE_PATH=/rendermd-hyuk`, GH Pages source flipped to `workflow` via `gh api`, first real deploy lives at the URL above

Plus 2 more follow-up issues filed (#48 wide-math, #41 still open).

## What went well

- **The week-1 PDF tech decision held up.** `window.print()` + `@media print` CSS delivered everything: KaTeX math vector, hljs token colors, themed backgrounds, all in the PDF, all WYSIWYG. Zero pivots in week 3 — the architecture choice from the planning week paid off exactly as predicted.
- **Deploy was effectively zero-work.** GH Pages enable: one `gh api -X POST` call. deploy.yml: drop two `if: false` lines, add one env var. First deploy from merge to live: ~2 minutes. Asset paths resolved correctly on first try thanks to the env-driven `basePath` set up back in #1.
- **Reviewer caught the `a[href]::after` regression in code blocks** before it shipped. Tiny rule, big impact on real LLM outputs (which usually contain URL-bearing code samples).
- **`data-print` attribute selectors** for cross-cutting CSS continued to hold. Print stylesheet stayed in one file, no churn on the 6 component CSS modules.

## Where I got stuck

- **Wide-math display formulas** can still overflow the page edge in print. Tried `overflow: visible` thinking it would let the formula extend without clipping — reviewer caught that the comment didn't match behavior. Filed #48 for proper scale-to-fit. No good 1-line fix exists.
- **Verifier sub-agent has no real browser automation in this environment.** End-to-end PDF verification — opening Chrome on the deployed URL, hitting Cmd+P, eyeballing the output — still requires a human. Best the verifier can do is HTML/curl smoke checks. Acceptable for the static parts of the verification matrix, but means the user owns the final "does the PDF actually look right" check.
- **`next lint` is deprecated** in the toolchain and warns on every CI run (~50 runs this week). Migration tracked in #26 but not done; warning is noise but not a blocker. Should have addressed in week 2.

## Inefficient patterns in AI collaboration

- **I underestimated how often the reviewer agent's "use option X" suggestion would be technically wrong.** rehype-highlight `subset` in week 2 was one example; `overflow: visible` for katex this week was another. Going forward I should verify the suggestion in docs / source before implementing — saves a round of fix-and-amend.
- **Background bash polling cycles compound.** Each PR cycle has ~3 CI polls (feature CI, dev→main CI, deploy.yml for #9). With 9 issues × ~2-3 CI polls average, that's ~25 background commands this 3-week run. Each one's notification-driven so no human time, but each adds a turn. Future: combine into a single "wait + merge + verify" macro.

## Approach changes for the next project (if I were starting over)

- **Pick the lightest viable stack and ship faster.** rendermd's user-facing features are small (editor, preview, theme, save, PDF, mobile). The infra (pnpm, husky, commitlint, vitest, prettier, eslint, dependabot, PR/issue templates, CI/CD) was set up in week 1 — appropriate for learning, but for a personal project I'd start with just pnpm + prettier and add lint/commitlint only when I felt the absence.
- **Default to shipping verifier+reviewer reports as PR comments from day 1.** This was set up in week 2 first PR (#28) and has worked every PR since. Build it into the scaffold for the next project.
- **Lazy-load anything > 50 kB right away.** I let CodeMirror + react-markdown bundle to 380 kB and only filed lazy-load as a follow-up (#29). The right move was to lazy-load in the same PR. Once a bundle is committed, lazy-loading becomes its own PR with its own risk.
- **Don't compose the seed markdown across PRs.** It changed every issue and added churn — write it once with all "and later, X" copy.

## New patterns to keep

- **`gh api -X POST /repos/.../pages -F build_type=workflow`** for enabling Pages without the web UI. One command, no clicking.
- **dev → main as auto-promotion** with no human merge button on dev→main when CI is green and the deploy is gated. For a solo project the dev branch is a no-op; might collapse to feature→main next time.
- **Per-PR "did not pick" entry in commit messages.** When I deferred a follow-up I named the issue number explicitly — keeps the trail readable later.
- **Inline scripts in `<head>` + lazy `useState` init** for browser-state-dependent React state. Theme system pattern; reusable for any "settings-from-storage" feature.
- **WYSIWYG promise.** Saying "the screen IS the PDF" up front made every PDF decision easier — no debate about "should the PDF look different in dark mode" (no, by definition).

## What I'd tell next-week-me

Nothing — there is no next week for this project. But if there were:

- The 5 open follow-ups (#26, #29, #32, #38, #41, #48) are the natural next sprint. Lazy-load editor + bundle-shrink (#29, #32) is the single biggest user-visible win.
- Branch protection on `main` isn't set yet. If a collaborator joins, set it.

# Week 1 Retrospective — "What would I do differently?"

> Written at end of week 1. Draft authored by the primary AI agent based on observed events; personal-stance edits will follow.

## What I did this week

- **Planning** — wrote `docs/proposal.md` (service definition, tech stack, screen layout, CI/CD flow, weekly milestones) and `docs/workflow.md` (work-unit criteria, AI prompt patterns, multi-agent role separation, human checkpoints).
- **Decisions surfaced before code** — settled the two largest tech-stack tradeoffs:
  - PDF engine: `@react-pdf/renderer` vs `window.print()`. Picked `window.print()` after weighing iOS Safari UX loss against the cost of rasterizing KaTeX and remapping syntax-highlight tokens.
  - Editor: CodeMirror 6 over Monaco (bundle size) and over plain textarea (lack of markdown syntax highlighting).
- **Infrastructure** — pnpm + Husky (`pre-commit` lint-staged, `commit-msg` commitlint) + Vitest + Prettier + ESLint (deferred to week 2 setup) + GitHub Actions CI (format + test) + gated CD (`if: false` until Next.js lands).
- **OSS conventions** — LICENSE, CONTRIBUTING with Conventional Commits format, PR template (with verifier/reviewer report slots), Issue template (structured form), Dependabot (weekly npm + actions).
- **GitHub artifacts** — 9 task issues (#1–#9) covering all week-2 and week-3 work, with labels `task`, `week-2`, `week-3`. Wiki initialized at `Home.md` linking back to repo `docs/`.

## What went well

- **Pre-implementation tradeoff dialogue** — for PDF, dropping the original choice (`@react-pdf`) before any code was written saved an estimated 3–4 days of week-3 work on KaTeX-to-image and syntax-token remapping. Confirmed by listing the concrete failure modes (baseline alignment, retina blur) and finding the better path.
- **Explicit "did not pick" list** in the proposal — documenting rejected options (Monaco, Tailwind, npm/yarn, Jest) with reasons makes future revisits cheap. No more "why didn't we use X" cycles.
- **Multi-agent design done up front** — codifying verifier (end-user persona) and reviewer (senior FE) agent prompts in `docs/workflow.md` §3 before any PR. Means every PR going into week 2 already has its review machinery defined.

## Where I got stuck

- **GitHub Wiki bootstrap** — the wiki git repo doesn't exist until the user clicks "Create the first page" in the web UI once. Not bypassable via API or CLI. Cost: one manual step on the user's side, recovered by force-rebasing the placeholder commit.
- **CI first run failed** on `pnpm/action-setup@v4` — pnpm version was specified twice (action input `version: 9` + `packageManager: pnpm@9.12.0` in package.json). Fix: drop the action input; `packageManager` is the single source of truth. (#10 → fix in same PR's follow-up commit.)
- **README screenshots misalignment** — I initially built a 4×2 table of `![](docs/screenshots/*.png)` links. User clarified they wanted UI-flow demonstration per OSS convention, not pre-declared paths for verifier-agent output. Corrected via #21 (mermaid flow + ASCII layout sketches).

## Inefficient patterns in AI collaboration

- **Not surfacing constraints early enough.** First PDF discussion centered on quality differences between `@react-pdf` and `window.print()`. Should have led with the _iOS Safari_ mobile UX gap — that was the actual deciding constraint. Lesson: when comparing libraries, list the _worst-case-user-environment_ impacts first, then quality second.
- **Asked confirmation on actions the user had pre-authorized.** Took explicit "이제 자동으로 처리할 수 있지 않는지" before I committed-and-pushed without checking in. Lesson: when the user has set up a workflow (PR template, verifier slots, etc.), default to executing inside that workflow without re-asking permission for each step.
- **Confused two senses of "screenshots."** I built infrastructure for _per-PR verifier-attached_ screenshots (ephemeral, in PR comments) and conflated it with _README marketing screenshots_ (curated, durable). User clarified the README needs the latter. Lesson: any noun that has more than one referent in this project (screenshot, agent, theme) needs disambiguation in the doc before I implement.

## Approach changes for next week

- **Default to autonomous execution** for non-product decisions. Within an open PR cycle (branch → implement → CI → merge), don't pause to confirm; only escalate on UX/product calls ("should this be a button or a link?") or destructive/irreversible actions (main merge with deploy live, force-push, etc.).
- **For each PR, spawn both verifier and reviewer sub-agents before merging.** Even for small changes. Build the muscle memory now; in week 3 the verifier becomes critical (PDF output validation).
- **Verifier writes screenshots to `docs/screenshots/`** when output is worth keeping (a new theme, a new layout). Otherwise just attach to PR comment.
- **Pre-flight every library choice with a "worst-environment" test list** — before adopting any new dep, write down the 3 most adversarial environments (iOS Safari, slow 3G, 360px viewport, etc.) and check it against each.

## New patterns to keep

- **The "tradeoff brief" prompt pattern** — "Compare 2–3 options focused on tradeoffs. No code yet." This forced clean discussion of `window.print()` vs `@react-pdf` before any commitment. Adopting this as the default opener for any feature with more than one reasonable approach.
- **"Did not pick" sections** in design docs.
- **One feature per PR** with the verification checklist in the PR template — feels like overkill for solo work, but it converts each PR into a self-contained record. Already paid off when fixing the CI duplication: the fix-commit had its own scope, easy to revert if needed.
- **Wiki = thin pointer, repo = source of truth.** Wiki Home is just a landing page that links to `docs/`. No duplication, no sync burden.

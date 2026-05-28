# rendermd — Workflow Draft

## 1. How to break work into units

### Criteria

- **One PR = one vertical slice of a single feature** (UI + logic + styles together).
- **PR size: 50–200 LOC.** Reviewable. Easy to roll back.
- **One component = single responsibility.** Editor handles editing, preview handles preview, parent `page.tsx` orchestrates state.
- **One AI request ≈ one component or one hook.** Larger requests blow up consistency and verification cost.

### Expected work units

| Unit          | Output                                                         | Approx size              |
| ------------- | -------------------------------------------------------------- | ------------------------ |
| Project setup | Next.js + ESLint/Prettier integration + directory structure    | ~150 LOC (mostly config) |
| editor-pane   | CodeMirror editor + markdown mode + left layout                | ~150 LOC                 |
| preview-pane  | react-markdown + plugins (GFM/math/highlight) + right layout   | ~120 LOC                 |
| theme         | CSS variables + toggle UI + ThemeContext/Provider              | ~180 LOC                 |
| draft-storage | localStorage hook + debounced autosave + save status indicator | ~80 LOC                  |
| print-pdf     | `@media print` CSS + ExportButton + print guide modal          | ~150 LOC                 |
| responsive    | Mobile tab switch component + media queries                    | ~100 LOC                 |

### Anti-patterns to avoid

- ❌ One PR with multiple features (theme + localStorage + mobile together) — unreviewable.
- ❌ Stacking component stubs without integration or verification — blows up in the next PR.
- ❌ Separate "setup PR" and "feature PR" — unnecessary round trips.

---

## 2. Prompt patterns — primary coding agent

I work with one primary AI agent (Claude Code) for design and implementation. Three modes:

### A. Plan mode

**When:** Before starting a new feature, when there is more than one approach.
**Context to provide:** What I'm trying to do + constraints + usable/forbidden libraries + desired form of answer.
**Format:**

> "I want to do X. Constraints: A, B, C. Available: D. Off-limits: E. Compare 2–3 options focused on tradeoffs. No code yet."

**Example:**

> "Implementing theme toggle, CSS-variable-based. Constraint: static build, no SSR hydration flash. Restore last theme from localStorage. Compare 2–3 approaches."

### B. Code mode

**When:** After design is settled, when writing actual files.
**Context to provide:** Exact file paths + adjacent files (with snippets if needed) + props interface + behavior spec + styling approach.
**Format:**

> "Write: [path]. props: [A, B, C]. Behavior: [spec]. Parent usage: [snippet]. Styles: CSS Modules. Deps: only [list]."

**Example:**

> "Write `src/components/EditorPane.tsx`. props: `value: string`, `onChange: (next: string) => void`. CodeMirror 6 + lang-markdown. Dark theme → oneDark, light → default. Parent: `<EditorPane value={md} onChange={setMd} />`. CSS Modules. Debounce belongs to parent."

### C. Review mode

**When:** Right after the AI returns code, or before opening a PR.
**Context to provide:** Diff (or full file) + what I'm suspicious of + desired output format.
**Format:**

> "Diff below. I suspect X. Point out other risks I'm missing. Give me a verification checklist."

**Example:**

> "Diff below. I suspect missing useEffect cleanup — possible CodeMirror instance leak. Is `window` reference SSR-safe? Give me a verification checklist."

### Prompt anti-patterns

- ❌ "Make this nicer" — no criteria → AI makes arbitrary choices. Define "nice" together with the ask.
- ❌ "Just write everything" — verification unit too large → can't trust the output. Chunk to 50–200 LOC.
- ❌ Code snippets with no context — AI fills in assumptions. Wrong assumptions = wasted iteration.
- ❌ Paste back the result as-is — never assume one-shot code is correct. **Always** go through review mode.

### Self-check before sending a prompt

- [ ] Did I name the file(s) I want changed?
- [ ] Did I share adjacent files / types?
- [ ] Did I specify the constraints (libs, static build, mobile, etc.)?
- [ ] Did I declare which mode I want (Plan / Code / Review)?

---

## 3. Multi-agent role separation

Beyond the primary coding agent, I delegate independent checks to two specialized sub-agents per PR. They get only the diff (or the built site URL) — no context from my chats with the primary agent. **Independence is the point.**

### Agent A — End-user persona (verifier)

**Role:** A non-technical user trying to use rendermd for the first time. Has Chrome (browse, click, screenshot) and a shell (curl, lighthouse) available. **Does not read source code.**

**Job:**

- Launch the dev server or visit the deployed URL.
- Exercise core flows like a real user: paste markdown, switch theme, export PDF, resize to mobile.
- Report what's confusing, broken, or visually off.
- Capture screenshots and console errors.

**Prompt template:**

> You are a non-technical user. You don't know markdown syntax. You opened rendermd at `<URL>`. Paste this LLM response into the editor: `[...]`. Try to save it as a PDF on desktop Chrome and on iOS Safari (mobile DevTools). Report every moment you were confused or stuck. Do not read the code — only describe what you experienced. Output: friction points + screenshots + reproduction steps.

**Expected output:** A short list of friction points, screenshots, repro steps.

### Agent B — Senior FE reviewer

**Role:** A senior frontend engineer doing a critical code review. Reads the diff, knows React / TypeScript / Next.js deeply.

**Job:**

- Flag correctness bugs, perf issues, accessibility violations, type-safety gaps, hidden re-renders, hooks-rules violations, security risks (XSS via `dangerouslySetInnerHTML`, etc.), bundle bloat.
- Distinguish "must fix to merge" from "follow-up".
- Suggest minimal changes, not rewrites. No stylistic nits unless they affect correctness.

**Prompt template:**

> You are a senior frontend engineer. Review this PR diff against rendermd. Stack: Next.js (static export), TS, CodeMirror 6, react-markdown, CSS Modules, pnpm, Vitest. Focus: correctness, perf, a11y, types, anti-patterns. For each finding give: `file:line`, severity (block / nit / follow-up), why, suggested fix. No stylistic comments.

**Expected output:** Finding list keyed by severity, with `file:line` refs.

### My role — orchestrator and final judge

- Read both agents' reports.
- Reconcile conflicts (e.g., verifier says "PDF export button is hard to find" + reviewer says "the button code is fine" → the UX issue trumps the code issue).
- Decide scope: which findings block merge, which become follow-up issues.
- Approve and merge.

### Why two separate agents, not one

- **Independence:** an agent that has read the implementation cannot objectively act as a "first-time user".
- **Specialization:** the user-persona prompt and the reviewer prompt drive very different output styles. Mixing dilutes both.
- **Reproducibility:** same prompts on the next PR → consistent review quality.

---

## 4. Checkpoints I must verify myself

(Things no AI agent can fully verify on its own.)

### Code review level

- [ ] Are the types actually what I intended? (no `any` / overuse of `unknown`)
- [ ] Are the try-catch / defensive paths the AI added actually necessary, or just noise?
- [ ] Is each new dependency justified? (`pnpm ls` to confirm)
- [ ] Are component props minimal? Any unused ones?
- [ ] Did unrelated refactoring sneak in? (review the full diff — AI loves to "tidy up")
- [ ] Do comments explain _why_, not _what_? (delete the latter)

### Functional unit

- [ ] Does the feature actually work? (`pnpm dev` and try it)
- [ ] Edge cases:
  - Empty input
  - Very long input (1MB+)
  - Korean / emoji / special chars (`# 한글 🔥`)
  - Nested markdown (`> - **bold _italic_**`)
  - Markdown inside code fences (must NOT render)
- [ ] **Actually trigger print preview** (Cmd/Ctrl+P, not just DevTools) — this is the PDF core flow.
- [ ] Mobile viewport (DevTools 360px) doesn't break.
- [ ] localStorage quota exceeded (> 5MB) — `QuotaExceededError` handled.

### Deployment

- [ ] `pnpm build` finishes with no warnings.
- [ ] GitHub Pages `basePath: '/rendermd'` is set — assets resolve correctly.
- [ ] `out/` alone runs the site (no server dependency).
- [ ] PDF export works on the deployed URL, not just localhost.

### Workflow

- [ ] PR size within 50–200 LOC.
- [ ] Followed feature → dev → main.
- [ ] Commit message answers "why":
  - Bad: `fix typo`
  - Good: `fix(editor): crash on empty input — CodeMirror state init missing when value=""`
- [ ] Pushed only after Husky pre-commit and commit-msg passed.

---

## 5. Do not delegate to AI

- **Product decisions:** what to ship/cut, priority order.
- **UX judgment:** "is this a good experience for the user?" — AI can't know.
- **Final tradeoff selection:** AI proposes options; the human picks.
- **External system decisions:** domains, deployment URLs, secrets.
- **Merge timing:** AI says "done" → I still verify by hand before merging.

---

## 6. Retrospective lives in [retrospective.md](./retrospective.md).

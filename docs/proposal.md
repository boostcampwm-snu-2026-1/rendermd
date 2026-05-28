# rendermd — Project Proposal

## 1. Service definition

### One-liner

A static web tool that lets users preview LLM-generated markdown in real time and save it as a PDF.

### Problem statement

As more people use LLMs like ChatGPT and Claude, they often keep or share responses with the raw markdown markers (`**bold**`, `## headings`, `- lists`) still in the text. To a general reader, those markers are noise — and users who aren't comfortable with computers have a hard time finding a tool that converts those responses into a clean, human-readable form.

### Target users

- Users who aren't familiar with computers / markdown but want to capture, organize, or save LLM responses.
- Secondarily: general users who write notes in markdown and want a quick PDF export.

### Usage scenario

1. The user copies an LLM response.
2. They paste it into the left editor in rendermd.
3. The right side renders the formatted output live.
4. (Optional) Switch theme — the screen is exactly what the PDF will look like.
5. Click **Export PDF** → browser print dialog → save as PDF.

### Out of scope (explicit)

- Accounts / cloud sync (static site, localStorage only)
- Multi-document management (one document at a time)
- Collaboration (live sharing, comments, etc.)
- Non-markdown input (Word, Notion, HTML import)

---

## 2. Core features

| #   | Feature                                                       | Priority     |
| --- | ------------------------------------------------------------- | ------------ |
| 1   | Split view (mobile: tabs) editor + preview                    | Must         |
| 2   | Live markdown rendering (GFM + code blocks + math)            | Must         |
| 3   | Theme presets (light / dark / sepia / high-contrast)          | Must         |
| 4   | localStorage autosave                                         | Must         |
| 5   | `window.print()`-based PDF export                             | Must         |
| 6   | Print guide modal (especially for the 4-step iOS Safari flow) | Should       |
| 7   | Font size / line-height controls                              | Nice-to-have |

---

## 3. Tech stack

| Area               | Choice                                                                                | Reason                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Framework          | Next.js 15+ (App Router, `output: 'export'`)                                          | Static build → deployable to GitHub Pages. React ecosystem.                             |
| Language           | TypeScript                                                                            | Types act as a spec. With AI collaboration, the interface becomes the contract.         |
| Package manager    | **pnpm**                                                                              | Fast installs, content-addressable store saves disk, strict dependency resolution.      |
| Editor             | CodeMirror 6 + `@codemirror/lang-markdown`                                            | Lightweight (~100KB), markdown syntax highlighting, modular.                            |
| Markdown parser    | `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex` + `rehype-highlight` | Standard combo, works in static environments, rich plugin ecosystem.                    |
| PDF generation     | `window.print()` + `@media print` CSS                                                 | Zero deps, vector PDF, KaTeX / code colors come through natively, screen = PDF WYSIWYG. |
| Styling            | CSS Modules + CSS variables                                                           | Theme toggle = swap variables. Compatible with Next.js static builds.                   |
| Formatting         | Prettier                                                                              | Unified format. No bikeshedding.                                                        |
| Linting            | ESLint (Next.js defaults)                                                             | Standard rules + Next-specific rules.                                                   |
| Git hooks          | **Husky + lint-staged + commitlint**                                                  | Auto format/lint on commit + Conventional Commits enforced.                             |
| Testing            | **Vitest** + jsdom                                                                    | Fast test runner, native ESM, Vite ecosystem.                                           |
| CI                 | GitHub Actions (`ci.yml`)                                                             | install + format + test + (from week 2) lint + typecheck + build on every PR.           |
| CD                 | GitHub Actions (`deploy.yml`) → GitHub Pages                                          | Auto deploy on merge to main.                                                           |
| Dependency updates | Dependabot (weekly npm + actions)                                                     | Keeps deps fresh without manual chasing.                                                |

### What we deliberately did **not** pick

- **`@react-pdf/renderer`**: Hard to align with KaTeX / code highlighting, requires manual Korean font registration, breaks WYSIWYG. `window.print()` is sufficient and gives equal-or-better quality. iOS Safari users have a 4-step print flow, which we mitigate with a guide toast.
- **Monaco editor**: Bundle is MB-scale. Too heavy for a static deploy.
- **Tailwind**: Theme toggling via CSS variables makes Tailwind unnecessary.
- **npm / yarn**: pnpm wins on every axis at this scale.
- **Jest**: Vitest is faster, better Vite-native, and the testing-library APIs are identical.

---

## 4. Screen layout draft

### Desktop (≥ 768px)

```
┌─────────────────────────────────────────────────────────┐
│ rendermd                  [Theme ▾] [💾 Saved] [📄 PDF] │
├──────────────────────────┬──────────────────────────────┤
│                          │                              │
│   Markdown input          │   Live preview               │
│   (CodeMirror 6)         │   (react-markdown)           │
│                          │                              │
└──────────────────────────┴──────────────────────────────┘
```

### Mobile (< 768px)

```
┌─────────────────────────────┐
│ rendermd  [Theme] [📄 PDF]  │
├─────────────────────────────┤
│ [ Edit │ Preview ]          │
├─────────────────────────────┤
│                             │
│  Current tab content        │
│                             │
└─────────────────────────────┘
```

### Print / PDF output

```
┌─────────────────────────────┐
│                             │
│  (Rendered body only, in    │
│   the current theme.        │
│   Toolbars/editor hidden.)  │
│                             │
└─────────────────────────────┘
```

- `@media print` hides editor / toolbar / tab elements with `display: none`.
- `@page { margin: 20mm }` for consistent print margins.
- KaTeX math and code-block colors pass through as vectors.

---

## 5. Page structure

Single-page SPA (static export):

- `/` — editor + preview (all features)
- No other routes.

Folder layout (planned):

```
src/
├── app/
│   ├── layout.tsx        # global theme, fonts
│   ├── page.tsx          # main (editor + preview composition)
│   └── globals.css       # theme variables, print CSS
├── components/
│   ├── EditorPane.tsx
│   ├── PreviewPane.tsx
│   ├── ThemeSwitcher.tsx
│   ├── ExportButton.tsx
│   └── TabSwitcher.tsx    # mobile only
├── hooks/
│   ├── useDraftStorage.ts
│   └── useTheme.ts
└── styles/
    └── themes/           # light / dark / sepia / high-contrast
```

---

## 6. CI/CD flow

```
[push feature/x]
      │
      ▼
[PR → dev]   ── CI (ci.yml): install + format + test + (week 2+) lint + typecheck + build
      │
      ▼  (review OK)
   [dev]
      │
      ▼
[PR dev → main]   ── CI same
      │
      ▼  (merge)
   [main]   ── CD (deploy.yml): build → GitHub Pages deploy
```

- All PRs: CI must pass.
- No direct pushes to `main` (branch protection planned).
- `feature/*` branches are deleted after merge.
- Husky pre-commit runs lint-staged → Prettier on changed files.
- Husky commit-msg runs commitlint (Conventional Commits enforcement).

---

## 7. Weekly milestones

| Week            | Goal                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| **1 (current)** | Proposal + workflow draft + infra skeleton (pnpm, husky, commitlint, Vitest, CI/CD, issue templates)      |
| **2**           | Next.js setup + editor / preview / theme / localStorage / mobile tabs / basic PDF (text, headings, lists) |
| **3**           | Math + code-highlighting PDF polish, print-CSS refinement, GitHub Pages deploy, finishing touches         |

If math/code PDF work hits a wall in week 3, the core features already work from week 2 — schedule has a deliberate safety margin.

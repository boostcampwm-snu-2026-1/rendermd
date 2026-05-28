# Contributing

> This is a solo learning project (Boostcamp Web & Mobile SNU 2026). External contributions aren't expected, but this file documents how the repo works.

## Branches

- `main` — deployed. No direct pushes.
- `dev` — integration branch.
- `feature/*` — one feature per branch, PRs target `dev`.

## Commit messages

This repo follows [Conventional Commits](https://www.conventionalcommits.org/). The Husky `commit-msg` hook runs `commitlint` and rejects non-conforming messages.

### Format

```
<type>(<scope?>): <description>

[optional body]

[optional footer]
```

### Types

`feat` · `fix` · `chore` · `docs` · `refactor` · `test` · `style` · `ci` · `perf` · `build` · `revert`

### Scope examples

`editor` · `preview` · `theme` · `storage` · `print` · `responsive` · `deps` · `ci`

### Examples

- `feat(editor): add CodeMirror markdown highlighting`
- `fix(print): hide toolbar in @media print`
- `chore(deps): bump react-markdown to 9.1.0`
- `docs(workflow): add multi-agent role separation section`

### Body

Use the body to explain **why**, not what. Reference the issue or relevant context.

```
fix(editor): crash on empty input

CodeMirror state init missing when value === "".
Caught by verifier agent on iOS Safari mobile preview.
```

## Pull requests

- Aim for **50–200 LOC** per PR.
- **One feature per PR** — don't mix theme + storage + layout changes.
- Fill out the PR template (`.github/PULL_REQUEST_TEMPLATE.md`).
- Attach verifier-agent and reviewer-agent reports (see [docs/workflow.md](./docs/workflow.md) §3).

## AI workflow

[docs/workflow.md](./docs/workflow.md) is the source of truth for how I collaborate with AI agents: prompt patterns, verifier / reviewer sub-agents, human checkpoints, anti-patterns.

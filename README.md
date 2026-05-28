# rendermd

[![CI](https://github.com/boostcampwm-snu-2026-1/rendermd/actions/workflows/ci.yml/badge.svg)](https://github.com/boostcampwm-snu-2026-1/rendermd/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](./.nvmrc)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D9-orange)](./package.json)

A static web tool to preview LLM-generated markdown in real time and save it as a PDF.

> Boostcamp Web & Mobile SNU 2026 — solo project (3-week shared track)

## Development setup

- Node.js `>=20`
- pnpm `>=9`

```bash
pnpm install      # install deps and activate Husky hooks
pnpm dev          # dev server (available after Next.js setup in week 2)
pnpm build        # static build → out/ (week 2+)
pnpm format       # apply Prettier
pnpm format:check # check formatting (used by CI)
pnpm test         # run Vitest (watch mode)
pnpm test:run     # run Vitest once (used by CI)
```

## Tech stack

Next.js (static export) · TypeScript · CodeMirror 6 · react-markdown · KaTeX · CSS Modules · **pnpm** · **Husky** · **Vitest** · **commitlint** · GitHub Actions

Rationale: [docs/proposal.md](./docs/proposal.md)

## Documentation

- [Project proposal](./docs/proposal.md)
- [Workflow draft](./docs/workflow.md)
- [Week 1 retrospective](./docs/retrospective.md)
- [Contributing guide](./CONTRIBUTING.md)

## Screenshots

> Populated from week 2 onward by the verifier agent (see [workflow.md §3](./docs/workflow.md)) as features land on `main`. Gallery: [`docs/screenshots/`](./docs/screenshots/).

| Theme         | Desktop                                                | Mobile                                               |
| ------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| Light         | ![light-desktop](./docs/screenshots/light-desktop.png) | ![light-mobile](./docs/screenshots/light-mobile.png) |
| Dark          | ![dark-desktop](./docs/screenshots/dark-desktop.png)   | ![dark-mobile](./docs/screenshots/dark-mobile.png)   |
| Sepia         | ![sepia-desktop](./docs/screenshots/sepia-desktop.png) | ![sepia-mobile](./docs/screenshots/sepia-mobile.png) |
| High contrast | ![hc-desktop](./docs/screenshots/hc-desktop.png)       | ![hc-mobile](./docs/screenshots/hc-mobile.png)       |

PDF export examples land in [`docs/screenshots/pdf/`](./docs/screenshots/pdf/) (PNG previews + raw PDFs).

## Branch strategy

```
main         ← deployed (GitHub Pages auto-deploy)
 ↑
dev          ← integration
 ↑
feature/*    ← per-feature
```

- No direct pushes to `main`.
- `feature/*` PRs merge into `dev`.
- `dev` → `main` PRs trigger auto deploy.

## Commits

Follows [Conventional Commits](https://www.conventionalcommits.org/). The Husky `commit-msg` hook runs `commitlint` and rejects non-conforming messages.

Example: `feat(editor): add CodeMirror markdown highlighting`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full format.

## Author

- 최재혁 / jay20012024

## License

[MIT](./LICENSE)

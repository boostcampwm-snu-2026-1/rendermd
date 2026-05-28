# Screenshots

Canonical gallery for the README and the wiki.

## Lifecycle

- **Per-PR verifier reports** attach screenshots as PR comments. Those are ephemeral — they document the verification, not the product.
- **This directory** holds the curated gallery that lands on `main`. The verifier agent refreshes images here when features change.

## Naming convention

`{theme-or-feature}-{viewport}.{ext}`

Examples:

- `light-desktop.png`
- `dark-mobile.png`
- `hc-desktop.png` (high contrast)
- `pdf/light-print-preview.png`
- `pdf/dark-export.pdf`

## Viewports

- `desktop` — 1440×900
- `mobile` — 390×844 (iPhone 12-ish)

## Themes

- `light`
- `dark`
- `sepia`
- `hc` (high contrast)

## When to refresh

The verifier agent refreshes these when:

- A new theme is added
- The layout changes
- The print CSS changes (refresh PDF previews)

Stale images that no longer match the live app should be deleted in the same PR that changes the UI.

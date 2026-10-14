# Design — LabTAG Solutions

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
editorial

## Macrostructure family
- Marketing pages (home hub): Catalogue — responsive card grid of solution pages
- Content pages (solution detail): Long Document — memo-like prose with inline media splits
- App pages: n/a

## Theme
Custom OKLCH palette anchored on LabTAG brand teal.

- `--color-paper`   oklch(97.5% 0.008 175)
- `--color-paper-2` oklch(94.5% 0.012 175)
- `--color-ink`     oklch(28% 0.025 230)
- `--color-ink-2`   oklch(45% 0.02 220)
- `--color-rule`    oklch(28% 0.025 230 / 0.14)
- `--color-accent`  oklch(48% 0.09 180)
- `--color-accent-ink` oklch(98% 0.01 175)
- `--color-focus`   oklch(48% 0.12 180)

## Typography
- Display: Source Sans 3, weight 700, style normal
- Body: Source Sans 3, weight 400–600
- Mono: ui-monospace, SFMono-Regular, Menlo, monospace
- Display tracking: -0.03em
- Type scale anchor: `--text-display` = clamp(2.25rem, 5vw, 3.75rem)
- Note: single-family (Source Sans 3) is intentional — preferred brand voice for this viewer.

## Spacing
4-point named scale in `web/src/tokens.css`. Pages must use named tokens.

## Motion
- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
- Reveal pattern: none (pages are just there)
- Reduced-motion fallback: opacity-only, ≤ 150 ms (if any motion is added later)

## Microinteractions stance
- silent success
- hover: border/color shift only — no lift, no scale
- focus delay 0 ms; visible `:focus-visible` ring instantly

## CTA voice
- Primary CTA: framed accent panel (rounded border + teal fill) — “Need Expert Help?” style
- Secondary CTA: underline link in body measure

## Nav / Footer
- Nav: N9 edge-aligned minimal (wordmark left, quiet meta right)
- Footer: Ft2 inline single line (colophon)

## Per-page allowances
- Marketing (home): Catalogue rows with product thumbnails; no enrichment chrome
- Content (solutions): Long Document measure; content-split media allowed; no eyebrows; no card-in-card feature grids

## What pages MUST share
- LabTAG wordmark treatment
- Accent teal ≤ ~5% of viewport (rules, links, step numerals, focus)
- Source Sans 3 for display and body
- CTA voice (framed accent panel)
- Hairline rules as primary dividers

## What pages MAY differ on
- Home uses Catalogue row rhythm; solutions use Long Document prose rhythm
- Hero may be title+lede only or title+lede+inline figure when content supplies an image

## Exports
Canonical tokens live in `web/src/tokens.css`.

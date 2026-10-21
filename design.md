# Design — LabTAG Solutions

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
editorial

## Macrostructure family
- Marketing pages (home hub): standard page title, New articles list of combined editorial guides, Browse-all carousel of current catalog articles, temperature quick-picks, Archive index of original scrape pages, framed sample CTA
- Content pages (solution detail): Long Document — memo-like prose with inline media splits; hero includes Shop + Request free sample actions; current catalog URLs `/solutions/{slug}` (unique slugs); archived originals keep their historical `/solutions/{slug}` URLs
- App pages: n/a

## Sitemap
- Home `/`
- Current catalog `/solutions/{slug}` (24 unique slugs)
- Archive originals `/solutions/{slug}` (34 historical slugs)
- Breadcrumbs: Solutions / {Page title} for catalog; Archive / {Page title} for legacy pages

## Theme
LabTAG brand palette from `LabTAG-Colors.tokens.json` (Figma).

- `--color-paper`        `#F3F5F6` (ui-background-main)
- `--color-paper-2`      `#ECEFF1` (ui-background-dark)
- `--color-surface`      `#F9FAFB` (ui-background-light)
- `--color-ink`          `#251647` (text-primary-dark) — headings & titles
- `--color-ink-2`        `#5A527A` (text-primary-light) — body text
- `--color-rule`         `#D7D2E0` (ui-stroke-main)
- `--color-rule-strong`  `#C2BDCA` (ui-stroke-dark)
- `--color-accent`       `#FC7A22` (highlight-main)
- `--color-accent-deep`  `#C84612` (highlight-dark)
- `--color-accent-ink`   `#FFFFFF` (pure-white)
- `--color-focus`        `#20B4E2` (seconday-main)
- `--color-link`         `#1B79A7` (seconday-dark)

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
- hover: color/shadow shift — no lift, no scale
- focus delay 0 ms; visible `:focus-visible` ring instantly

## CTA voice
- Primary CTA: framed accent panel (rounded border + highlight orange fill) — “Need Expert Help?” style
- Secondary CTA: underline link in secondary cyan

## Nav / Footer
- Nav: N9 edge-aligned minimal (wordmark left, quiet meta right)
- Footer: Ft2 inline single line (colophon)

## Per-page allowances
- Marketing (home): standard title (no lander photography); light drop shadow under the hero; New articles list and Browse-all cards share surface + drop shadow (no strokes); temperature quick-picks; Archive index at end; framed sample CTA
- Content (solutions): Long Document measure; content-split media allowed; no eyebrows; hero Shop + free-sample buttons; no card-in-card feature grids
- Combined catalog articles: real breadcrumb title; consistent split (copy left, 4:3 figure right) from hero through body — no alternating sides, no full-bleed banners; shared hero drop shadow; hero prev/next cycles the New articles set; no By … jump menu, section hashes, or per-section Shop / Watch chrome; hero “Also in the archive” source links. Archive scrape pages keep the split hero, sticky jump menu, split-card shop/video actions, and a hero link to the current article.

## What pages MUST share
- LabTAG wordmark treatment
- Highlight orange ≤ ~5% of viewport (CTAs, step numerals); cyan for links/focus
- Source Sans 3 for display and body
- CTA voice (framed accent panel + primary/secondary button pair)
- Hairline rules as primary dividers
- External shop: `https://www.labtag.com/shop/` · samples: `https://www.labtag.com/contact-us/samples`

## What pages MAY differ on
- Home uses Split Studio industry rhythm; solutions use Long Document prose rhythm
- Hero may be title+lede only or title+lede+inline figure when content supplies an image
- Friendly lab-tech voice on marketing copy; combined catalog articles are rewritten editorial guides; archive pages keep source-faithful product prose

## Exports
Canonical tokens live in `web/src/tokens.css`.

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
- About `/about` (About Us — LabTAG company page)
- Why Choose LabTAG `/about/why-choose-labtag`
- Samples `/samples` (Request Free Sample — HubSpot form from LabTAG)
- Breadcrumbs: Solutions / {Page title} on every `/solutions/{slug}` page (catalog and historical originals)

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
- Primary CTA: compact accent band (copy left, button pair right, drop shadow) — “Need Expert Help?” style
- Secondary CTA: underline link in secondary cyan; sample/shop as the ghost button on accent bands

## Nav / Footer
- Nav: N9 edge-aligned minimal (wordmark left, About, Why Choose, and Request Free Sample right)
- Footer: none (this mockup has no site footer)

## Per-page allowances
- Marketing (home): standard title (no lander photography); light drop shadow under the hero; New articles as a 4-col bento of full-bleed photo tiles (cryogenic 2×2; type on a solid surface band); New articles and Browse-all cards share surface + drop shadow (no strokes); temperature quick-picks; Archive index at end; framed sample CTA
- About: cinematic editorial — oversized display title, full-width team plate with caption, numeral stats; offset manufacturer story; numbered vision/mission/team manifesto (no cards); ISO as oversized type; typographic Why Choose; dark ga-black chapter for the EY award overlay and world map + offices; framed CTA. About may use a larger display size than `--text-display`.
- Why Choose: elevated hero with sample/expert actions; 3-col reason cards (icon in a paper well, title, body, drop shadow, no strokes); ISO certs as a 2-col row; framed sample CTA
- Content (solutions): Long Document measure; content-split media allowed; no eyebrows; hero Shop + free-sample buttons; no card-in-card feature grids
- Combined catalog articles: real breadcrumb title; consistent split (copy left, 4:3 figure right) from hero through body — no alternating sides, no full-bleed banners; shared hero drop shadow; hero prev/next cycles the New articles set and repeats at the bottom of the page (cryogenic leads; cryo / deep-freeze / CryoSTUCK stay separate pages); no By … jump menu, section hashes, or per-section Watch chrome; catalog-split sections separated by space (no hairline dividers); construct lists as a 2-col spec list (ink label + muted detail, cyan chevron, shop on hover color, no discs, no cards, no divider strokes, no trailing Shop line); Cryogenic varies section layout (prose split, spec split, stacked figure with copy and specs side by side under the image, text band, typographic pull quote with a cyan mark and no hairline rules) without alternating sides; hero archive sources as untitled cyan text links with a trailing chevron, stacked one per line. Archive scrape pages keep the split hero, sticky jump menu, split-card shop/video actions, and a hero tag to the current article.

## What pages MUST share
- LabTAG wordmark treatment
- Highlight orange ≤ ~5% of viewport (CTAs, step numerals); cyan for links/focus
- Source Sans 3 for display and body
- CTA voice (framed accent panel + primary/secondary button pair)
- Hairline rules as primary dividers
- External shop: `https://www.labtag.com/shop/` · samples: in-app `/samples` (LabTAG HubSpot form; fallback `https://www.labtag.com/contact-us/samples`)

## What pages MAY differ on
- Home uses Split Studio industry rhythm; solutions use Long Document prose rhythm
- Hero may be title+lede only or title+lede+inline figure when content supplies an image
- Friendly lab-tech voice on marketing copy; combined catalog articles are rewritten editorial guides; archive pages keep source-faithful product prose

## Exports
Canonical tokens live in `web/src/tokens.css`.

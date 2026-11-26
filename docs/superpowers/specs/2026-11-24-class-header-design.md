# Class header — product sheet

## Intent

After Label Finder, the class page header confirms this is the right material, lets you read a bit, and request a sample or data sheet. Picking a size is the catalog’s job, not the hero’s.

## Goals

- Photo left; code, subtitle, lead, and the two CTAs stacked on the right.
- Specs as an unframed fact bar under that whole row: Brand, Temperature, Printing Method, then Resistances full width.
- Size filters (Shape, Features, Containers, Colors) stay framed cards at the top of the sizes catalog, not in the hero.

## Non-goals

Finder, size table, chip colors, sticky toolbar, copy, or deploy.

## Anti-goals

- Title beside the photo and the blurb in another column.
- Specs that look like the filter cards.
- Photo stretched down through the fact bar.
- Full-width CTAs.

## Approaches

- **A Product sheet** (picked): identity + story + CTAs, then a fact bar; filters with the table.
- B Compact identity: short header, one spec line, blurb dropped or later.
- C Catalog-first: hero is only name/story/sample; specs move into sizes.

A won because it still sells the class without mixing table filters into the product block.

## How

- `class-hero-identity`: gallery 15rem × 11.4rem, `align-items: start` (not stretch). Copy is title, lead, actions only.
- `class-hero-specs` is a sibling under identity, full content width, unframed `class-fact` grid (3 columns + `is-wide` resistances).
- `class-specs` stays the first child of `class-catalog`.

## Left to the builder

Narrow breakpoint stacking; photo stays 15×11.4 on desktop even if copy is shorter.

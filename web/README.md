# LabTAG Solutions Viewer

React web app that renders the Markdown solution pages with reusable content blocks.

## Run

```bash
cd web
npm install
npm run dev
```

## Blocks

Markdown is parsed into shared block types used across every solution page:

| Block | Use |
| --- | --- |
| `text` | Lead / body paragraphs |
| `section` | Headed content sections |
| `bulletList` | Unordered lists |
| `numberedSteps` | Numbered process steps |
| `featureGrid` | Short title + description tiles |
| `table` | SKU / comparison tables |
| `quote` | Pull quotes |
| `faq` | Accordion Q&A |
| `cta` | Closing call-to-action |

Current catalog files live in `../pages/*.md`. Archived originals live in `../pages/legacy/*.md` and keep their historical `/solutions/{slug}` URLs.

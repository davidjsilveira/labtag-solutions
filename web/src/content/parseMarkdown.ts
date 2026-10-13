import type { ContentBlock, SolutionPage } from './types'

const SOURCE_URL = /https:\/\/www\.labtag\.com\/solutions\/[a-z0-9-]+\/?/g
const STEP_LINE = /^\d+\.\s+\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/
const FEATURE_BULLET = /^-\s+\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/
const BOLD_LEAD = /^\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/
const IMAGE_LINE = /^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/

function imageVariant(alt: string, isHero = false): 'hero' | 'gallery' | 'logo' {
  if (isHero) return 'hero'
  if (/\blogo\b/i.test(alt)) return 'logo'
  return 'gallery'
}
const CTA_TITLES = /^(need expert|get in touch|make your project|experience the benefits|try the labels)/i

function cleanInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim()
}

function extractSources(markdown: string): string[] {
  const found = markdown.match(SOURCE_URL) ?? []
  return [...new Set(found)]
}

function stripFront(markdown: string): { title: string; body: string } {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  let i = 0
  let title = 'Untitled'

  while (i < lines.length && !lines[i].trim()) i += 1
  if (lines[i]?.startsWith('# ')) {
    title = lines[i].slice(2).trim()
    i += 1
  }

  while (i < lines.length && !lines[i].trim()) i += 1

  if (lines[i]?.startsWith('Source:') || lines[i]?.startsWith('Sources:')) {
    i += 1
    while (i < lines.length) {
      const line = lines[i].trim()
      if (!line || line.startsWith('- ') || line.startsWith('[')) {
        i += 1
        continue
      }
      break
    }
  }

  while (i < lines.length && !lines[i].trim()) i += 1
  return { title, body: lines.slice(i).join('\n').trim() }
}

function parseTable(lines: string[], start: number): { block: ContentBlock; next: number } | null {
  if (!lines[start]?.startsWith('|')) return null
  const rows: string[][] = []
  let i = start
  while (i < lines.length && lines[i].startsWith('|')) {
    const cells = lines[i]
      .split('|')
      .slice(1, -1)
      .map((c) => cleanInline(c.trim()))
    if (!cells.every((c) => /^:?-+:?$/.test(c))) {
      rows.push(cells)
    }
    i += 1
  }
  if (rows.length < 2) return null
  const [headers, ...body] = rows
  return {
    block: { type: 'table', headers, rows: body },
    next: i,
  }
}

function parseList(lines: string[], start: number): { items: string[]; next: number } | null {
  if (!lines[start]?.startsWith('- ')) return null
  const items: string[] = []
  let i = start
  while (i < lines.length && lines[i].startsWith('- ')) {
    items.push(cleanInline(lines[i].slice(2)))
    i += 1
  }
  return { items, next: i }
}

function parseNumberedSteps(
  lines: string[],
  start: number,
): {
  steps: { title: string; body: string; image?: { src: string; alt: string; fallbackSrc?: string } }[]
  next: number
} | null {
  if (!STEP_LINE.test(lines[start] ?? '')) return null
  const steps: {
    title: string
    body: string
    image?: { src: string; alt: string; fallbackSrc?: string }
  }[] = []
  let i = start
  while (i < lines.length) {
    const match = lines[i].match(STEP_LINE)
    if (!match) break
    const step: {
      title: string
      body: string
      image?: { src: string; alt: string; fallbackSrc?: string }
    } = { title: match[1].trim(), body: match[2].trim() }
    i += 1
    while (i < lines.length && !lines[i].trim()) i += 1
    const imageMatch = lines[i]?.match(IMAGE_LINE)
    if (imageMatch) {
      step.image = {
        alt: imageMatch[1] || '',
        src: imageMatch[2],
        fallbackSrc: imageMatch[3] || undefined,
      }
      i += 1
    }
    steps.push(step)
  }
  return steps.length ? { steps, next: i } : null
}

function isHeading(line: string): 2 | 3 | 0 {
  if (line.startsWith('### ')) return 3
  if (line.startsWith('## ')) return 2
  return 0
}

function collectParagraphs(lines: string[], start: number): { paragraphs: string[]; next: number } {
  const paragraphs: string[] = []
  let i = start
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i += 1
      continue
    }
    if (
      isHeading(line) ||
      line.startsWith('|') ||
      line.startsWith('- ') ||
      line.startsWith('> ') ||
      STEP_LINE.test(line)
    ) {
      break
    }
    paragraphs.push(cleanInline(line))
    i += 1
  }
  return { paragraphs, next: i }
}

function maybeFeatureGrid(
  title: string | undefined,
  items: { title: string; body: string }[],
): ContentBlock | null {
  if (items.length < 2) return null
  return { type: 'featureGrid', title, items }
}

function parseQuoteBlock(lines: string[], start: number): { block: ContentBlock; next: number } | null {
  if (!lines[start]?.startsWith('> ')) return null
  const quoteLines: string[] = []
  let i = start
  while (i < lines.length && (lines[i].startsWith('> ') || lines[i].trim() === '>')) {
    quoteLines.push(lines[i].replace(/^>\s?/, ''))
    i += 1
  }
  const joined = quoteLines.join(' ').trim()
  const attributionMatch = joined.match(/^"(.+?)"\s*(?:—|-)?\s*(.*)$/)
  if (attributionMatch) {
    return {
      block: {
        type: 'quote',
        text: attributionMatch[1].trim(),
        attribution: attributionMatch[2].trim() || undefined,
      },
      next: i,
    }
  }
  const text = quoteLines.filter((l) => l.trim() && !l.startsWith('Liesbet') && !l.startsWith('Global')).join(' ').replace(/^"|"$/g, '')
  let attribution: string | undefined
  if (lines[i]?.trim() && !isHeading(lines[i]) && !lines[i].startsWith('|') && !lines[i].startsWith('- ')) {
    // skip — attribution usually inside quote for our merged pages
  }
  return { block: { type: 'quote', text: cleanInline(text), attribution }, next: i }
}

function collapseFaq(blocks: ContentBlock[]): ContentBlock[] {
  const out: ContentBlock[] = []
  let i = 0
  while (i < blocks.length) {
    const block = blocks[i]
    const isFaqHeading =
      block.type === 'section' &&
      /frequently asked questions/i.test(block.title) &&
      block.paragraphs.length === 0

    if (!isFaqHeading) {
      out.push(block)
      i += 1
      continue
    }

    const items: { question: string; answer: string }[] = []
    let j = i + 1
    while (j < blocks.length) {
      const next = blocks[j]
      if (next.type === 'section' && next.title.endsWith('?') && next.paragraphs.length) {
        items.push({ question: next.title, answer: next.paragraphs.join(' ') })
        j += 1
        continue
      }
      break
    }
    if (items.length) {
      out.push({ type: 'faq', title: block.title, items })
      i = j
    } else {
      out.push(block)
      i += 1
    }
  }
  return out
}

function collapseFeatureRuns(blocks: ContentBlock[]): ContentBlock[] {
  const out: ContentBlock[] = []
  let i = 0
  while (i < blocks.length) {
    const block = blocks[i]
    if (block.type !== 'section' || block.paragraphs.length !== 1 || block.level !== 2) {
      out.push(block)
      i += 1
      continue
    }

    const items: { title: string; body: string }[] = [
      { title: block.title, body: block.paragraphs[0] },
    ]
    let j = i + 1
    while (j < blocks.length) {
      const next = blocks[j]
      if (
        next.type === 'section' &&
        next.level === 2 &&
        next.paragraphs.length === 1 &&
        next.title.split(/\s+/).length <= 4 &&
        next.paragraphs[0].length < 160
      ) {
        items.push({ title: next.title, body: next.paragraphs[0] })
        j += 1
        continue
      }
      break
    }

    if (items.length >= 3) {
      out.push({ type: 'featureGrid', items })
      i = j
    } else {
      out.push(block)
      i += 1
    }
  }
  return out
}

function promoteCta(blocks: ContentBlock[]): ContentBlock[] {
  const out: ContentBlock[] = []
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]
    if (block.type === 'section' && CTA_TITLES.test(block.title)) {
      const following = blocks[i + 1]
      const body = block.paragraphs.length
        ? block.paragraphs.join(' ')
        : following?.type === 'text'
          ? following.paragraphs.join(' ')
          : ''
      if (body) {
        out.push({ type: 'cta', title: block.title, body })
        if (!block.paragraphs.length && following?.type === 'text') {
          i += 1
        }
        continue
      }
    }
    out.push(block)
  }
  return out
}

export function parseMarkdown(slug: string, markdown: string): SolutionPage {
  const sources = extractSources(markdown)
  const { title, body } = stripFront(markdown)
  const lines = body.split('\n')
  const blocks: ContentBlock[] = []

  let i = 0
  let pendingTitle: string | undefined
  let pendingLevel: 2 | 3 | undefined
  let leadDone = false

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i += 1
      continue
    }

    const headingLevel = isHeading(line)
    if (headingLevel) {
      const titleText = line.replace(/^#{2,3}\s+/, '').trim()
      i += 1
      if (/^product images$/i.test(titleText)) {
        pendingTitle = undefined
        pendingLevel = undefined
        continue
      }

      // Emit heading now so following images appear under it in the viewer.
      blocks.push({
        type: 'section',
        title: titleText,
        level: headingLevel,
        paragraphs: [],
      })
      pendingTitle = undefined
      pendingLevel = undefined

      while (i < lines.length) {
        if (!lines[i].trim()) {
          i += 1
          continue
        }
        const img = lines[i].match(IMAGE_LINE)
        if (!img) break
        blocks.push({
          type: 'image',
          alt: img[1] || '',
          src: img[2],
          fallbackSrc: img[3] || undefined,
          variant: imageVariant(img[1] || ''),
        })
        i += 1
      }
      continue
    }

    const imageMatch = line.match(IMAGE_LINE)
    if (imageMatch) {
      const isHero = !leadDone && blocks.every((b) => b.type === 'image')
      blocks.push({
        type: 'image',
        alt: imageMatch[1] || '',
        src: imageMatch[2],
        fallbackSrc: imageMatch[3] || undefined,
        variant: imageVariant(imageMatch[1] || '', isHero),
      })
      i += 1
      continue
    }

    const quote = parseQuoteBlock(lines, i)
    if (quote) {
      blocks.push(quote.block)
      i = quote.next
      continue
    }

    const table = parseTable(lines, i)
    if (table) {
      if (table.block.type === 'table' && pendingTitle) {
        table.block.title = pendingTitle
        pendingTitle = undefined
        pendingLevel = undefined
      }
      blocks.push(table.block)
      i = table.next
      continue
    }

    const steps = parseNumberedSteps(lines, i)
    if (steps) {
      blocks.push({
        type: 'numberedSteps',
        title: pendingTitle,
        steps: steps.steps,
      })
      pendingTitle = undefined
      pendingLevel = undefined
      i = steps.next
      continue
    }

    if (lines[i].startsWith('- ')) {
      const featureItems: { title: string; body: string }[] = []
      let j = i
      while (j < lines.length) {
        const match = lines[j].match(FEATURE_BULLET)
        if (!match) break
        featureItems.push({ title: match[1].trim(), body: match[2].trim() })
        j += 1
      }
      if (featureItems.length >= 2) {
        const grid = maybeFeatureGrid(pendingTitle, featureItems)
        if (grid) blocks.push(grid)
        pendingTitle = undefined
        pendingLevel = undefined
        i = j
        continue
      }

      const list = parseList(lines, i)
      if (list) {
        blocks.push({ type: 'bulletList', title: pendingTitle, items: list.items })
        pendingTitle = undefined
        pendingLevel = undefined
        i = list.next
        continue
      }
    }

    const boldLead = lines[i].match(BOLD_LEAD)
    if (boldLead && !pendingTitle) {
      const items: { title: string; body: string }[] = [
        { title: boldLead[1].trim(), body: boldLead[2].trim() },
      ]
      let j = i + 1
      while (j < lines.length) {
        if (!lines[j].trim()) {
          j += 1
          continue
        }
        const next = lines[j].match(BOLD_LEAD)
        if (!next) break
        items.push({ title: next[1].trim(), body: next[2].trim() })
        j += 1
      }
      if (items.length >= 2) {
        blocks.push({ type: 'featureGrid', items })
        i = j
        continue
      }
    }

    const { paragraphs, next } = collectParagraphs(lines, i)
    if (!paragraphs.length) {
      i += 1
      continue
    }

    if (!leadDone && !pendingTitle) {
      blocks.push({ type: 'text', paragraphs })
      leadDone = true
      i = next
      continue
    }

    if (pendingTitle && pendingLevel) {
      blocks.push({
        type: 'section',
        title: pendingTitle,
        level: pendingLevel,
        paragraphs,
      })
      pendingTitle = undefined
      pendingLevel = undefined
    } else if (pendingTitle) {
      blocks.push({
        type: 'section',
        title: pendingTitle,
        level: 2,
        paragraphs,
      })
      pendingTitle = undefined
      pendingLevel = undefined
    } else {
      blocks.push({ type: 'text', paragraphs })
    }
    i = next
  }

  if (pendingTitle) {
    blocks.push({
      type: 'section',
      title: pendingTitle,
      level: pendingLevel ?? 2,
      paragraphs: [],
    })
  }

  const refined = promoteCta(collapseFeatureRuns(collapseFaq(blocks)))
  const contentBlocks = [...refined]

  let heroImage: SolutionPage['heroImage']
  const leadImage = contentBlocks[0]
  if (leadImage?.type === 'image') {
    contentBlocks.shift()
    heroImage = {
      src: leadImage.src,
      alt: leadImage.alt,
      fallbackSrc: leadImage.fallbackSrc,
    }
  }

  let description: string[] = []
  const leadText = contentBlocks[0]
  if (leadText?.type === 'text') {
    contentBlocks.shift()
    description = leadText.paragraphs
  }

  const sectionBlock = contentBlocks.find((b) => b.type === 'section' && b.paragraphs.length > 0)
  const excerpt =
    description[0] ??
    (sectionBlock?.type === 'section' ? sectionBlock.paragraphs[0] : undefined) ??
    ''

  return { slug, title, sources, excerpt, description, heroImage, blocks: contentBlocks }
}

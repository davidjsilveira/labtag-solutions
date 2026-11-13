import type { ReactNode } from 'react'
import { slugify } from '@/content/slugify'
import { resolveSplitCardActions } from '@/content/splitActions'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { RichText } from './RichText'

type Card = {
  section: SectionBlock
  image?: ImageBlock
}

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

function cardCopy(paragraphs: string[]) {
  const last = paragraphs[paragraphs.length - 1] ?? ''
  const link = last.match(LINK_ONLY)
  if (!link) return { body: paragraphs, label: undefined as string | undefined, href: undefined as string | undefined }
  return { body: paragraphs.slice(0, -1), label: link[1], href: link[2] }
}

function ChemicalCard({
  card,
  id,
  layout,
}: {
  card: Card
  id: string
  layout: 'gallery' | 'labels' | 'print' | 'copy'
}) {
  const parsed = cardCopy(card.section.paragraphs)
  const mapped = resolveSplitCardActions(slugify(card.section.title), 'chemical-container-labeling', card.section.title)
  const label = parsed.label ?? mapped.actionLabel
  const href = parsed.href ?? mapped.shopHref

  return (
    <article className={`chemical-card is-${layout}`} id={id}>
      {card.image ? (
        <img src={card.image.src} alt={card.image.alt || card.section.title} decoding="async" />
      ) : null}
      <div className="chemical-card-copy">
        <h3>{card.section.title}</h3>
        {parsed.body.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>
            <RichText text={paragraph} />
          </p>
        ))}
        {label && href ? (
          <a
            className={layout === 'copy' ? 'chemical-link' : 'btn btn-primary'}
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            {label}
          </a>
        ) : null}
      </div>
    </article>
  )
}

function knownImages(blocks: ContentBlock[]) {
  const images = new Map<string, ImageBlock>()
  for (let i = 0; i < blocks.length - 1; i += 1) {
    const block = blocks[i]
    const next = blocks[i + 1]
    if (block.type === 'section' && (block.level ?? 2) >= 3 && next.type === 'image') {
      images.set(block.title, next)
    }
  }
  return images
}

export function ChemicalLayout({ blocks }: { blocks: ContentBlock[] }) {
  const images = knownImages(blocks)
  const nodes: ReactNode[] = []
  const usedIds = new Set<string>()
  let i = 0

  const nextId = (title: string) => {
    const base = slugify(title)
    let id = base
    let n = 2
    while (usedIds.has(id)) {
      id = `${base}-${n}`
      n += 1
    }
    usedIds.add(id)
    return id
  }

  while (i < blocks.length) {
    const block = blocks[i]
    if (block.type !== 'section' || (block.level ?? 2) >= 3) {
      i += 1
      continue
    }

    const cards: Card[] = []
    let j = i + 1
    while (j < blocks.length) {
      const child = blocks[j]
      if (child.type !== 'section' || (child.level ?? 2) < 3) break
      let k = j + 1
      let image: ImageBlock | undefined
      if (blocks[k]?.type === 'image') {
        image = blocks[k] as ImageBlock
        k += 1
      }
      cards.push({ section: child, image })
      j = k
    }

    const printing = /printing method/i.test(block.title)
    const prepared = cards.map((card) =>
      card.image || !printing ? card : { ...card, image: images.get(card.section.title) },
    )

    const runs: Card[][] = []
    for (const card of prepared) {
      const kind = card.image ? 'media' : 'text'
      const last = runs[runs.length - 1]
      const lastKind = last?.[0]?.image ? 'media' : 'text'
      if (!last || lastKind !== kind) runs.push([card])
      else last.push(card)
    }

    nodes.push(
      <section key={`chemical-${i}`} className="chemical-group">
        <h2>{block.title}</h2>
        {runs.map((run, runIndex) => {
          const feature = printing && run.every((card) => card.image)
          const compact = run.every(
            (card) => card.image && card.section.paragraphs.join(' ').length < 140,
          )
          const layout = feature ? 'print' : compact ? 'gallery' : run[0]?.image ? 'labels' : 'copy'
          return (
            <div
              key={`${block.title}-${runIndex}`}
              className={
                feature
                  ? 'chemical-features'
                  : `chemical-grid${layout === 'copy' ? ' is-index' : ''}${run.length === 3 ? ' is-trio' : ''}${compact ? ' is-compact' : ''}`
              }
            >
              {run.map((card) => (
                <ChemicalCard
                  key={card.section.title + (card.image?.src ?? '')}
                  card={card}
                  id={nextId(card.section.title)}
                  layout={layout}
                />
              ))}
            </div>
          )
        })}
      </section>,
    )
    i = j
  }

  return <>{nodes}</>
}

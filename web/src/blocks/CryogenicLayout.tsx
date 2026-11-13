import type { ReactNode } from 'react'
import { slugify } from '@/content/slugify'
import { resolveSplitCardActions } from '@/content/splitActions'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { RichText } from './RichText'

type Card = {
  section: SectionBlock
  image?: ImageBlock
}

function CryoCard({ card, id }: { card: Card; id: string }) {
  const mapped = resolveSplitCardActions(slugify(card.section.title), 'cryogenic-labels', card.section.title)

  return (
    <article className="cryo-card" id={id}>
      {card.image ? <img src={card.image.src} alt={card.image.alt || card.section.title} decoding="async" /> : null}
      <div className="cryo-card-copy">
        <h3>{card.section.title}</h3>
        {card.section.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>
            <RichText text={paragraph} />
          </p>
        ))}
        {mapped.shopHref ? (
          <a className="btn btn-primary" href={mapped.shopHref} target="_blank" rel="noreferrer">
            {mapped.actionLabel ?? 'Shop Products'}
          </a>
        ) : null}
      </div>
    </article>
  )
}

export function CryogenicLayout({ blocks }: { blocks: ContentBlock[] }) {
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

    nodes.push(
      <section key={block.title} className="cryo-group">
        <h2>{block.title}</h2>
        <div className="cryo-grid">
          {cards.map((card) => (
            <CryoCard key={card.section.title} card={card} id={nextId(card.section.title)} />
          ))}
        </div>
      </section>,
    )
    i = j
  }

  return <div className="cryo-layout">{nodes}</div>
}

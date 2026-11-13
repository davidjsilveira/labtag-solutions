import type { ReactNode } from 'react'
import { slugify } from '@/content/slugify'
import { resolveSplitCardActions } from '@/content/splitActions'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { RichText } from './RichText'

type Card = {
  section: SectionBlock
  image?: ImageBlock
}

function section(block: ContentBlock | undefined): SectionBlock | null {
  return block?.type === 'section' ? block : null
}

export function DymoLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = section(blocks[i])
    if (!block || (block.level ?? 2) >= 3) {
      i += 1
      continue
    }

    const cards: Card[] = []
    let j = i + 1
    while (section(blocks[j]) && (section(blocks[j])?.level ?? 2) >= 3) {
      const child = blocks[j] as SectionBlock
      let image: ImageBlock | undefined
      let k = j + 1
      if (blocks[k]?.type === 'image') {
        image = blocks[k] as ImageBlock
        k += 1
      }
      cards.push({ section: child, image })
      j = k
    }

    nodes.push(
      <section key={block.title} className="deep-group">
        <h2>{block.title}</h2>
        <div className="deep-cards">
          {cards.map((card, index) => {
            const id = slugify(card.section.title)
            const mapped = resolveSplitCardActions(id, 'dymo-compatible-laboratory-labels', card.section.title)
            return (
              <article key={card.section.title} id={id} className={`deep-card${index % 2 === 1 ? ' is-flip' : ''}`}>
                {card.image ? (
                  <img src={card.image.src} alt={card.image.alt || card.section.title} decoding="async" />
                ) : null}
                <div className="deep-card-copy">
                  <h3>{card.section.title}</h3>
                  {card.section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>
                      <RichText text={paragraph} />
                    </p>
                  ))}
                  {mapped.shopHref ? (
                    <div className="deep-card-actions">
                      <a className="btn btn-primary" href={mapped.shopHref} target="_blank" rel="noreferrer">
                        {mapped.actionLabel ?? 'View Products'}
                      </a>
                    </div>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </section>,
    )
    i = j
  }

  return <div className="deep-layout">{nodes}</div>
}

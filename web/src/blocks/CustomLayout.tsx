import type { ReactNode } from 'react'
import { slugify } from '@/content/slugify'
import { resolveSplitCardActions } from '@/content/splitActions'
import type { ContentBlock, CtaBlock, ImageBlock, SectionBlock } from '@/content/types'
import { CtaBlockView } from './CtaBlock'
import { RichText } from './RichText'

type Card = {
  section: SectionBlock
  image: ImageBlock
}

export function CustomLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === 'section' && blocks[i + 1]?.type === 'image') {
      const cards: Card[] = []
      while (blocks[i]?.type === 'section' && blocks[i + 1]?.type === 'image') {
        cards.push({ section: blocks[i] as SectionBlock, image: blocks[i + 1] as ImageBlock })
        i += 2
      }
      nodes.push(
        <div key={`cards-${cards[0].section.title}`} className="custom-cards">
          {cards.map(({ section, image }) => {
            const id = slugify(section.title)
            const mapped = resolveSplitCardActions(id, 'custom-laboratory-labels', section.title)
            return (
              <article key={section.title} id={id} className="custom-card">
                <img src={image.src} alt={image.alt || section.title} decoding="async" />
                <div className="custom-card-copy">
                  <h3>{section.title}</h3>
                  {section.paragraphs.map((paragraph) => (
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
          })}
        </div>,
      )
      continue
    }

    // Skip the old format/material/resistance anchor rows (section + bullet list).
    if (block.type === 'section' && blocks[i + 1]?.type === 'bulletList') {
      while (blocks[i]?.type === 'section' && blocks[i + 1]?.type === 'bulletList') {
        i += 2
      }
      continue
    }

    if (block.type === 'cta') {
      nodes.push(<CtaBlockView key={block.title} block={block as CtaBlock} />)
      i += 1
      continue
    }

    i += 1
  }

  return <div className="custom-layout">{nodes}</div>
}

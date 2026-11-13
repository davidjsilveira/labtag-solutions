import type { ReactNode } from 'react'
import { slugify } from '@/content/slugify'
import { resolveSplitCardActions } from '@/content/splitActions'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { RichText } from './RichText'

type Card = {
  section: SectionBlock
  image?: ImageBlock
}

function asSection(block: ContentBlock | undefined): SectionBlock | null {
  return block?.type === 'section' ? block : null
}

export function GatorcutLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = asSection(blocks[i])
    if (!block) {
      i += 1
      continue
    }

    const images: ImageBlock[] = []
    let j = i + 1
    while (blocks[j]?.type === 'image') {
      images.push(blocks[j] as ImageBlock)
      j += 1
    }

    if (images.length) {
      const logo = images.find((image) => image.src.endsWith('.svg'))
      const steps = images.filter((image) => image !== logo)
      nodes.push(
        <section key={block.title} className="gator-how" id={slugify(block.title)}>
          <div className="gator-how-lead">
            {logo ? (
              <figure>
                <img src={logo.src} alt="" decoding="async" />
                <figcaption>Patented</figcaption>
              </figure>
            ) : null}
            <div>
              <h2>{block.title}</h2>
              {block.paragraphs
                .filter((paragraph) => paragraph !== 'Patented')
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>
                    <RichText text={paragraph} />
                  </p>
                ))}
            </div>
          </div>
          {steps.length ? (
            <div className="gator-steps">
              {steps.map((image) => (
                <img key={image.src} src={image.src} alt="" decoding="async" />
              ))}
            </div>
          ) : null}
        </section>,
      )
      i = j
      continue
    }

    if (/^shop our cryo markers$/i.test(block.title)) {
      const mapped = resolveSplitCardActions(slugify(block.title), 'gatorcut', block.title)
      nodes.push(
        <section key={block.title} className="block-cta">
          <div className="block-cta-copy">
            <h2>{block.title}</h2>
          </div>
          {mapped.shopHref ? (
            <div className="block-cta-actions">
              <a className="btn btn-on-accent" href={mapped.shopHref} target="_blank" rel="noreferrer">
                Shop Products
              </a>
            </div>
          ) : null}
        </section>,
      )
      i += 1
      continue
    }

    const cards: Card[] = []
    while (asSection(blocks[j]) && (asSection(blocks[j])?.level ?? 2) >= 3) {
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
      <section key={block.title} className="gator-group">
        <h2>{block.title}</h2>
        <div className="deep-cards">
          {cards.map((card, index) => {
            const id = slugify(card.section.title)
            const mapped = resolveSplitCardActions(id, 'gatorcut', card.section.title)
            return (
              <article key={card.section.title} id={id} className={`deep-card${index % 2 === 1 ? ' is-flip' : ''}`}>
                {card.image ? <img src={card.image.src} alt={card.image.alt || card.section.title} decoding="async" /> : null}
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
                        Shop Products
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

  return <div className="gator-layout">{nodes}</div>
}

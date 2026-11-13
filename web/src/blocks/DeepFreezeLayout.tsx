import type { ReactNode } from 'react'
import { YoutubeLink } from '@/components/YoutubeLink'
import { slugify } from '@/content/slugify'
import { resolveSplitCardActions } from '@/content/splitActions'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { RichText } from './RichText'
import { SampleBanner } from './SampleBanner'

type Card = {
  section: SectionBlock
  image?: ImageBlock
}

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

function section(block: ContentBlock | undefined): SectionBlock | null {
  return block?.type === 'section' ? block : null
}

function DeepCard({ card, flip }: { card: Card; flip?: boolean }) {
  const id = slugify(card.section.title)
  const mapped = resolveSplitCardActions(id, 'deep-freeze', card.section.title)
  const shape = card.section.paragraphs.length === 0

  if (shape && card.image) {
    return (
      <article className="deep-shape" id={id}>
        <img src={card.image.src} alt={card.image.alt || card.section.title} decoding="async" />
        {mapped.shopHref ? (
          <a className="btn btn-primary" href={mapped.shopHref} target="_blank" rel="noreferrer">
            {mapped.actionLabel ?? card.section.title}
          </a>
        ) : null}
      </article>
    )
  }

  return (
    <article className={`deep-card${flip ? ' is-flip' : ''}`} id={id}>
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
              {mapped.actionLabel ?? 'Shop Products'}
            </a>
            {mapped.videoHref ? (
              <YoutubeLink className="btn btn-secondary" href={mapped.videoHref}>
                {mapped.videoLabel ?? 'Watch Video'}
              </YoutubeLink>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export function DeepFreezeLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = section(blocks[i])
    if (!block) {
      i += 1
      continue
    }

    if (/^get in touch$/i.test(block.title)) {
      nodes.push(
        <SampleBanner
          key={block.title}
          title={block.title}
          body={block.paragraphs[0]}
          href="https://www.labtag.com/samples/"
          label="Order Free Samples"
        />,
      )
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

    if (!cards.length) {
      i += 1
      continue
    }

    const linksOnly = cards.every((card) => card.section.paragraphs.some((paragraph) => LINK_ONLY.test(paragraph.trim())))
    if (linksOnly) {
      nodes.push(
        <section key={block.title} className="deep-group">
          <h2>{block.title}</h2>
          <div className="deep-adhesive">
            {cards.map((card) => {
              const paragraph = card.section.paragraphs.find((item) => LINK_ONLY.test(item.trim())) ?? ''
              const match = paragraph.trim().match(LINK_ONLY)
              return (
                <a
                  key={card.section.title}
                  id={slugify(card.section.title)}
                  href={match?.[2]}
                  target="_blank"
                  rel="noreferrer"
                >
                  {match?.[1] ?? card.section.title}
                </a>
              )
            })}
          </div>
        </section>,
      )
      i = j
      continue
    }

    const shapes = cards.every((card) => card.section.paragraphs.length === 0 && card.image)
    nodes.push(
      <section key={block.title} className="deep-group">
        <h2>{block.title}</h2>
        <div className={shapes ? 'deep-shapes' : 'deep-cards'}>
          {cards.map((card, index) => (
            <DeepCard key={card.section.title} card={card} flip={!shapes && index % 2 === 1} />
          ))}
        </div>
      </section>,
    )
    i = j
  }

  return <div className="deep-layout">{nodes}</div>
}

import type { ReactNode } from 'react'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { ImageBlockView } from './ImageBlock'
import { RichText } from './RichText'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

const CARD_TITLES = new Set([
  'Printing Kits',
  'Printers',
  'Ribbons',
  'Scanners',
  'Software',
  'Accessories',
])

function asSection(block: ContentBlock | undefined): SectionBlock | null {
  return block?.type === 'section' ? block : null
}

function linkFrom(paragraphs: string[]) {
  const paragraph = paragraphs.find((item) => LINK_ONLY.test(item.trim()))
  const match = paragraph?.trim().match(LINK_ONLY)
  return match ? { label: match[1], href: match[2] } : null
}

function prose(paragraphs: string[]) {
  return paragraphs.filter((item) => !LINK_ONLY.test(item.trim()))
}

function takeImages(blocks: ContentBlock[], start: number) {
  const images: ImageBlock[] = []
  let i = start
  while (blocks[i]?.type === 'image') {
    images.push(blocks[i] as ImageBlock)
    i += 1
  }
  return { images, next: i }
}

function readSection(blocks: ContentBlock[], index: number) {
  const section = asSection(blocks[index])!
  const media = takeImages(blocks, index + 1)
  return { section, images: media.images, next: media.next }
}

function Photo({ image }: { image?: ImageBlock }) {
  if (!image) return null
  return <ImageBlockView src={image.src} alt="" fallbackSrc={image.fallbackSrc} />
}

export function LabelPrintingLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const section = asSection(blocks[i])
    if (!section) {
      i += 1
      continue
    }

    if (CARD_TITLES.has(section.title)) {
      const cards = []
      while (asSection(blocks[i]) && CARD_TITLES.has(asSection(blocks[i])!.title)) {
        const card = readSection(blocks, i)
        cards.push(card)
        i = card.next
      }
      nodes.push(
        <div key="print-cards" className="print-grid">
          {cards.map((card) => {
            const action = linkFrom(card.section.paragraphs)
            const inner = (
              <>
                <Photo image={card.images[0]} />
                <h2>{card.section.title}</h2>
                {prose(card.section.paragraphs).map((paragraph) => (
                  <p key={paragraph}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </>
            )
            return action ? (
              <a key={card.section.title} className="print-card" href={action.href} target="_blank" rel="noreferrer">
                {inner}
              </a>
            ) : (
              <article key={card.section.title} className="print-card">
                {inner}
              </article>
            )
          })}
        </div>,
      )
      continue
    }

    const item = readSection(blocks, i)
    const action = linkFrom(section.paragraphs)
    const guide = section.title === 'Label Printer Buying Guide'
    nodes.push(
      <section key={section.title} className={`print-row${guide ? ' is-guide' : ''}`}>
        <div className="print-copy">
          <h2>{section.title}</h2>
          {prose(section.paragraphs).map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
          {action ? (
            <a className="btn btn-primary" href={action.href} target="_blank" rel="noreferrer">
              {action.label}
            </a>
          ) : null}
        </div>
        <div className="print-media">
          <Photo image={item.images[0]} />
        </div>
      </section>,
    )
    i = item.next
  }

  return <div className="print-layout">{nodes}</div>
}

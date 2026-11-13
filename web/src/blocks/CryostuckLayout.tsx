import type { ReactNode } from 'react'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { ImageBlockView } from './ImageBlock'
import { RichText } from './RichText'
import { SampleBanner } from './SampleBanner'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

const CARD_TITLES = new Set([
  'Thermal-Transfer',
  'Laser',
  'Direct Thermal',
  'DYMO® LabelWriter™ 450-Series',
  'DYMO® LabelWriter™ 5-Series',
  'Wrap-Around',
  'Transparent',
  'Cover-Up',
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

export function CryostuckLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const section = asSection(blocks[i])
    if (!section) {
      i += 1
      continue
    }

    if (section.title === 'Categories') {
      nodes.push(
        <h2 key="categories" className="cryo-kicker">
          Categories
        </h2>,
      )
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
        <div key={`cryo-cards-${cards[0]?.section.title}`} className="cryo-grid">
          {cards.map((card) => {
            const action = linkFrom(card.section.paragraphs)
            const image = card.images[0]
            const inner = (
              <>
                {image ? (
                  <ImageBlockView src={image.src} alt="" fallbackSrc={image.fallbackSrc} />
                ) : null}
                <h3>{card.section.title}</h3>
              </>
            )
            return action ? (
              <a key={card.section.title} className="cryo-card" href={action.href} target="_blank" rel="noreferrer">
                {inner}
              </a>
            ) : (
              <article key={card.section.title} className="cryo-card">
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
    const sample = section.title.startsWith('Would You Like to Test')
    if (sample) {
      nodes.push(
        <SampleBanner
          key={section.title}
          title={section.title}
          href={action?.href ?? 'https://www.labtag.com/cryostuck-sample-kit/'}
          label={action?.label ?? 'Order Free Samples Now'}
        />,
      )
      i = item.next
      continue
    }

    nodes.push(
      <section key={section.title} className="cryo-copy">
        <h2>{section.title}</h2>
        {prose(section.paragraphs).map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>
            <RichText text={paragraph} />
          </p>
        ))}
      </section>,
    )
    i = item.next
  }

  return <div className="cryo-layout">{nodes}</div>
}

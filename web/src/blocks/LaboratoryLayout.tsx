import type { ReactNode } from 'react'
import type { ContentBlock, CtaBlock, ImageBlock, SectionBlock } from '@/content/types'
import { IsoBanner } from './IsoBanner'
import { ImageBlockView } from './ImageBlock'
import { SampleBanner } from './SampleBanner'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

const CATEGORIES = new Set([
  'Cryogenic Labels',
  'Xylene-Resistant Labels',
  'Autoclave Labels',
  'PCR Labels and Tags',
  'IVF Labels',
  'Deep-Freeze Labels',
  'COVID-19 Labels',
  'Clinical Trial Labels',
  'Cannabis Labels',
])

const PRODUCTS = new Set([
  'SnapPEEL™ Technology',
  'Cryo-LazrTAG™',
  'PikaTAG®',
  'PCR-TagTrax®',
  'RFID Cryo-WrapTAG™',
  'GatorCUT™ Technology',
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

function readCard(blocks: ContentBlock[], index: number) {
  const section = asSection(blocks[index])!
  const media = takeImages(blocks, index + 1)
  return { section, image: media.images[0], next: media.next }
}

function CardGrid({
  cards,
  className,
}: {
  cards: { section: SectionBlock; image?: ImageBlock }[]
  className: string
}) {
  return (
    <div className={className}>
      {cards.map((card) => {
        const action = linkFrom(card.section.paragraphs)
        const inner = (
          <>
            {card.image ? (
              <ImageBlockView src={card.image.src} alt="" fallbackSrc={card.image.fallbackSrc} />
            ) : null}
            <h3>{card.section.title}</h3>
          </>
        )
        return action ? (
          <a key={card.section.title} className="lab-card" href={action.href} target="_blank" rel="noreferrer">
            {inner}
          </a>
        ) : (
          <article key={card.section.title} className="lab-card">
            {inner}
          </article>
        )
      })}
    </div>
  )
}

export function LaboratoryLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let iso = false
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]
    if (block.type === 'cta' || (block.type === 'section' && block.title === 'Laboratory Labels')) {
      const cta = block.type === 'cta' ? (block as CtaBlock) : null
      const section = asSection(block)
      const action = cta?.actionHref
        ? { href: cta.actionHref, label: cta.actionLabel || 'Order Free Samples Now' }
        : linkFrom(section?.paragraphs ?? [])
      const body = cta?.body || prose(section?.paragraphs ?? []).join(' ')
      nodes.push(
        <SampleBanner
          key="samples"
          title="Laboratory Labels"
          body={body || undefined}
          href={action?.href ?? 'https://www.labtag.com/samples/'}
          label={action?.label ?? 'Order Free Samples Now'}
        />,
      )
      i += 1
      if (block.type === 'section') {
        i = takeImages(blocks, i).next
      }
      continue
    }

    const section = asSection(block)
    if (!section) {
      i += 1
      continue
    }

    if (section.title.startsWith('ISO ')) {
      iso = true
      i += 1
      i = takeImages(blocks, i).next
      continue
    }

    if (CATEGORIES.has(section.title)) {
      const cards = []
      while (asSection(blocks[i]) && CATEGORIES.has(asSection(blocks[i])!.title)) {
        const card = readCard(blocks, i)
        cards.push(card)
        i = card.next
      }
      nodes.push(<CardGrid key="categories" cards={cards} className="lab-categories" />)
      continue
    }

    if (section.title.startsWith('Print Solutions')) {
      const media = takeImages(blocks, i + 1)
      const action = linkFrom(section.paragraphs)
      nodes.push(
        <section key={section.title} className="lab-print">
          <div className="lab-print-media">
            {media.images[0] ? (
              <ImageBlockView src={media.images[0].src} alt="" fallbackSrc={media.images[0].fallbackSrc} />
            ) : null}
          </div>
          <div className="lab-print-copy">
            <h2>{section.title}</h2>
            {prose(section.paragraphs).map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
            {action ? (
              <a className="btn btn-primary" href={action.href} target="_blank" rel="noreferrer">
                {action.label}
              </a>
            ) : null}
          </div>
        </section>,
      )
      i = media.next
      continue
    }

    if (section.title.startsWith('Our Most Popular')) {
      nodes.push(
        <h2 key="popular" className="lab-kicker">
          {section.title}
        </h2>,
      )
      i += 1
      continue
    }

    if (PRODUCTS.has(section.title)) {
      const cards = []
      while (asSection(blocks[i]) && PRODUCTS.has(asSection(blocks[i])!.title)) {
        const card = readCard(blocks, i)
        cards.push(card)
        i = card.next
      }
      nodes.push(<CardGrid key="products" cards={cards} className="lab-products" />)
      continue
    }

    i += 1
  }

  if (iso) nodes.push(<IsoBanner key="iso" />)
  return <div className="lab-layout">{nodes}</div>
}

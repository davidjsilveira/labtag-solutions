import type { ReactNode } from 'react'
import { resolveImageSrc } from '@/content/resolveImage'
import type { BulletListBlock, ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { RichText } from './RichText'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/
const WARN = '/media/pcr-labels-and-tags/warning-duotone-1.svg'
const CHECK = '/media/pcr-labels-and-tags/check-bold-green.svg'

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

function takeSection(blocks: ContentBlock[], start: number) {
  const section = asSection(blocks[start])
  const images: ImageBlock[] = []
  let i = start + 1
  if (!section) return { section: null, images, items: null as string[] | null, next: start + 1 }
  while (blocks[i]?.type === 'image') {
    images.push(blocks[i] as ImageBlock)
    i += 1
  }
  const list = blocks[i]?.type === 'bulletList' ? (blocks[i] as BulletListBlock) : null
  if (list) i += 1
  return { section, images, items: list?.items ?? null, next: i }
}

function Photo({ image, alt }: { image: ImageBlock; alt?: string }) {
  const resolved = resolveImageSrc(image.src, image.fallbackSrc)
  return (
    <img
      src={resolved.primary}
      alt={alt || image.alt}
      onError={(event) => {
        if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
          event.currentTarget.src = resolved.fallback
        }
      }}
    />
  )
}

function CompareSection({
  challengeTitle,
  challengeBody,
  challengeItems,
  solutionTitle,
  solutionBody,
  solutionItems,
}: {
  challengeTitle: string
  challengeBody: string
  challengeItems: string[]
  solutionTitle: string
  solutionBody: string
  solutionItems: string[]
}) {
  const count = Math.max(challengeItems.length, solutionItems.length)
  return (
    <section className="pcr-compare" aria-label={`${challengeTitle} and ${solutionTitle}`}>
      <div className="pcr-compare-intro">
        <div>
          <h3>{challengeTitle}</h3>
          <p>{challengeBody}</p>
        </div>
        <div>
          <h3>{solutionTitle}</h3>
          <p>{solutionBody}</p>
        </div>
      </div>
      <ol className="pcr-pairs">
        {Array.from({ length: count }, (_, index) => {
          const problem = challengeItems[index]
          const answer = solutionItems[index]
          return (
            <li key={problem ?? answer ?? index}>
              <span className="pcr-pair-index">{String(index + 1).padStart(2, '0')}</span>
              <p className="pcr-pair-problem">
                <img src={WARN} alt="" />
                <span>{problem}</span>
              </p>
              <p className="pcr-pair-answer">
                <img src={CHECK} alt="" />
                <span>{answer}</span>
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function ProductRow({ section, image }: { section: SectionBlock; image?: ImageBlock }) {
  const action = linkFrom(section.paragraphs)
  const lines = prose(section.paragraphs)
  const subtitle = lines[0]
  const body = lines.slice(1)
  return (
    <article className="pcr-product">
      {image ? (
        <div className="pcr-product-media">
          <Photo image={image} alt={subtitle || section.title} />
        </div>
      ) : null}
      <div className="pcr-product-copy">
        <p className="pcr-kicker">{section.title}</p>
        {subtitle ? <h3>{subtitle}</h3> : null}
        {body.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>
            <RichText text={paragraph} />
          </p>
        ))}
        {action ? (
          <a className="btn btn-primary" href={action.href} target="_blank" rel="noreferrer">
            {action.label}
          </a>
        ) : null}
      </div>
    </article>
  )
}

function RelatedCard({ section, image }: { section: SectionBlock; image?: ImageBlock }) {
  const action = linkFrom(section.paragraphs)
  const lines = prose(section.paragraphs)
  const sku = lines.find((line) => line.startsWith('#'))
  const price = lines.find((line) => line.startsWith('$') || line.startsWith('Contact'))
  const badge = lines.find((line) => line !== sku && line !== price)
  const card = (
    <>
      {image ? <Photo image={image} alt={section.title} /> : null}
      <div className="pcr-related-copy">
        <p className="pcr-badge">{badge ?? '\u00a0'}</p>
        <p className="pcr-sku">{sku}</p>
        <h3>{section.title}</h3>
        <p className="pcr-price">{price}</p>
      </div>
    </>
  )
  if (!action) return <article className="pcr-related-card">{card}</article>
  return (
    <a className="pcr-related-card" href={action.href} target="_blank" rel="noreferrer">
      {card}
    </a>
  )
}

export function PcrLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const current = takeSection(blocks, i)
    if (!current.section) {
      i = current.next
      continue
    }
    const title = current.section.title

    if (title === 'The Challenge') {
      const next = takeSection(blocks, current.next)
      nodes.push(
        <CompareSection
          key={title}
          challengeTitle={title}
          challengeBody={prose(current.section.paragraphs).join(' ')}
          challengeItems={current.items ?? []}
          solutionTitle={next.section?.title ?? ''}
          solutionBody={next.section ? prose(next.section.paragraphs).join(' ') : ''}
          solutionItems={next.items ?? []}
        />,
      )
      i = next.section ? next.next : current.next
      continue
    }

    if (title.startsWith('Learn More about LabTAG PCR')) {
      nodes.push(
        <section key={title} className="pcr-flow">
          <div className="pcr-flow-copy">
            <h2>{title}</h2>
            {current.section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <div className="pcr-steps">
            {current.images.map((image, index) => (
              <figure key={image.src}>
                <Photo image={image} />
                <figcaption>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {image.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>,
      )
      i = current.next
      continue
    }

    if (title === 'Fast, Hassle-Free Identification of Tubes and Plates') {
      const action = linkFrom(current.section.paragraphs)
      const rows: ReactNode[] = []
      i = current.next
      while (i < blocks.length) {
        const row = takeSection(blocks, i)
        if (!row.section || linkFrom(row.section.paragraphs)?.label !== 'View Products') break
        rows.push(<ProductRow key={row.section.title} section={row.section} image={row.images[0]} />)
        i = row.next
      }
      nodes.push(
        <section key={title} className="pcr-catalog">
          <header className="pcr-offer">
            <h2>{title}</h2>
            {action ? (
              <a className="btn btn-primary" href={action.href} target="_blank" rel="noreferrer">
                {action.label}
              </a>
            ) : null}
          </header>
          <div className="pcr-products">{rows}</div>
        </section>,
      )
      continue
    }

    if (title === 'Related Products') {
      const cards: ReactNode[] = []
      let j = current.next
      while (j < blocks.length) {
        const card = takeSection(blocks, j)
        if (!card.section) {
          j = card.next
          continue
        }
        cards.push(<RelatedCard key={card.section.title} section={card.section} image={card.images[0]} />)
        j = card.next
      }
      nodes.push(
        <section key={title} className="pcr-related">
          <h2>{title}</h2>
          <div className="pcr-related-grid">{cards}</div>
        </section>,
      )
      i = blocks.length
      continue
    }

    if (linkFrom(current.section.paragraphs)?.label === 'View Products') {
      nodes.push(<ProductRow key={title} section={current.section} image={current.images[0]} />)
      i = current.next
      continue
    }

    i = current.next
  }

  return <div className="pcr-layout">{nodes}</div>
}

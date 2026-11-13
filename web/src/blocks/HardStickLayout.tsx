import type { ReactNode } from 'react'
import type { ContentBlock, CtaBlock, ImageBlock, SectionBlock } from '@/content/types'
import { ImageBlockView } from './ImageBlock'
import { RichText } from './RichText'
import { SampleBanner } from './SampleBanner'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

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

function Action({ href, label }: { href: string; label: string }) {
  return (
    <a className="btn btn-primary" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}

function Photo({ image }: { image?: ImageBlock }) {
  if (!image) return null
  return (
    <div className="stick-media">
      <ImageBlockView src={image.src} alt={image.alt} fallbackSrc={image.fallbackSrc} />
    </div>
  )
}

export function HardStickLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === 'cta' || (block.type === 'section' && block.title === 'Laboratory Labels')) {
      const cta = block.type === 'cta' ? (block as CtaBlock) : null
      const section = asSection(block)
      const media = takeImages(blocks, i + 1)
      const action = cta?.actionHref
        ? { label: cta.actionLabel || 'Order Free Samples Now', href: cta.actionHref }
        : linkFrom(section?.paragraphs ?? [])
      const question = cta?.body || prose(section?.paragraphs ?? []).join(' ')
      nodes.push(
        <SampleBanner
          key="samples"
          title="Laboratory Labels"
          body={question || undefined}
          href={action?.href ?? 'https://www.labtag.com/samples/'}
          label={action?.label ?? 'Order Free Samples Now'}
        />,
      )
      i = media.next
      continue
    }

    const section = asSection(block)
    if (!section) {
      i += 1
      continue
    }

    const media = takeImages(blocks, i + 1)
    const lines = prose(section.paragraphs)
    const kicker = lines[0] && !lines[0].startsWith('Temperature range') && lines[0].length < 40 ? lines[0] : undefined
    const body = kicker ? lines.slice(1) : lines
    const action = linkFrom(section.paragraphs)
    nodes.push(
      <section key={section.title} className="stick-row">
        <div className="stick-copy">
          {kicker ? <p className="stick-kicker">{kicker}</p> : null}
          <h2>{section.title}</h2>
          {body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className={paragraph.startsWith('Temperature range') ? 'stick-temp' : undefined}>
              <RichText text={paragraph} />
            </p>
          ))}
          {action ? <Action href={action.href} label={action.label} /> : null}
        </div>
        <Photo image={media.images[0]} />
      </section>,
    )
    i = media.next
  }

  return <div className="stick-layout">{nodes}</div>
}

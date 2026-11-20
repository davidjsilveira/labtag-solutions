import type { ReactNode } from 'react'
import type { ContentBlock, CtaBlock, ImageBlock, SectionBlock, VideoBlock } from '@/content/types'
import { ImageBlockView } from './ImageBlock'
import { RichText } from './RichText'
import { SampleBanner } from './SampleBanner'
import { VideoBlockView } from './VideoBlock'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

type MediaBlock = ImageBlock | VideoBlock

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

function takeMedia(blocks: ContentBlock[], start: number) {
  const media: MediaBlock[] = []
  let i = start
  while (blocks[i]?.type === 'image' || blocks[i]?.type === 'video') {
    media.push(blocks[i] as MediaBlock)
    i += 1
  }
  return { media, next: i }
}

function Action({ href, label }: { href: string; label: string }) {
  return (
    <a className="btn btn-primary" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}

function Photo({ media }: { media?: MediaBlock }) {
  if (!media) return null
  return (
    <div className="stick-media">
      {media.type === 'video' ? (
        <VideoBlockView src={media.src} alt={media.alt} fallbackSrc={media.fallbackSrc} />
      ) : (
        <ImageBlockView src={media.src} alt={media.alt} fallbackSrc={media.fallbackSrc} />
      )}
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
      const taken = takeMedia(blocks, i + 1)
      const action = cta?.actionHref
        ? { label: cta.actionLabel || 'Order Free Samples Now', href: cta.actionHref }
        : linkFrom(section?.paragraphs ?? [])
      const question = cta?.body || prose(section?.paragraphs ?? []).join(' ')
      nodes.push(
        <SampleBanner
          key="samples"
          title="Laboratory Labels"
          body={question || undefined}
          href={action?.href ?? '/samples'}
          label={action?.label ?? 'Order Free Samples Now'}
        />,
      )
      i = taken.next
      continue
    }

    const section = asSection(block)
    if (!section) {
      i += 1
      continue
    }

    const taken = takeMedia(blocks, i + 1)
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
        <Photo media={taken.media[0]} />
      </section>,
    )
    i = taken.next
  }

  return <div className="stick-layout">{nodes}</div>
}

import type { ReactNode } from 'react'
import { resolveImageSrc } from '@/content/resolveImage'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
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

function takeSection(blocks: ContentBlock[], start: number) {
  const section = asSection(blocks[start])
  const images: ImageBlock[] = []
  let i = start + 1
  if (!section) return { section: null, images, next: start + 1 }
  while (blocks[i]?.type === 'image') {
    images.push(blocks[i] as ImageBlock)
    i += 1
  }
  return { section, images, next: i }
}

function Icon({ image }: { image?: ImageBlock }) {
  if (!image) return null
  const resolved = resolveImageSrc(image.src, image.fallbackSrc)
  return (
    <img
      className="slide-icon"
      src={resolved.primary}
      alt=""
      onError={(event) => {
        if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
          event.currentTarget.src = resolved.fallback
        }
      }}
    />
  )
}

function Story({ section, image }: { section: SectionBlock; image?: ImageBlock }) {
  const Heading = section.level === 3 ? 'h3' : 'h2'
  return (
    <article className="slide-card">
      <Icon image={image} />
      <Heading>{section.title}</Heading>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>
          <RichText text={paragraph} />
        </p>
      ))}
    </article>
  )
}

function iconOf(images: ImageBlock[]) {
  return images.find((image) => /\.svg(?:$|\?)/i.test(image.src) || /\.svg(?:$|\?)/i.test(image.fallbackSrc ?? ''))
}

export function SlideOverLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const current = takeSection(blocks, i)
    if (!current.section) {
      i = current.next
      continue
    }

    const title = current.section.title

    if (title === 'The Challenge of Re-Labeling Slides') {
      const next = takeSection(blocks, current.next)
      nodes.push(
        <div key={title} className="slide-pair">
          <Story section={current.section} image={iconOf(current.images)} />
          {next.section ? <Story section={next.section} image={iconOf(next.images)} /> : null}
        </div>,
      )
      i = next.section ? next.next : current.next
      continue
    }

    if (title === 'Covering Up Existing Information') {
      const second = takeSection(blocks, current.next)
      const third = takeSection(blocks, second.next)
      const cards = [current, second, third].filter((item) => item.section)
      nodes.push(
        <div key={title} className="slide-cards">
          {cards.map((item) => (
            <Story key={item.section!.title} section={item.section!} image={iconOf(item.images)} />
          ))}
        </div>,
      )
      i = third.section ? third.next : second.section ? second.next : current.next
      continue
    }

    if (title === 'Histology Labels') {
      const action = linkFrom(current.section.paragraphs)
      nodes.push(
        <SampleBanner
          key={title}
          title={title}
          body={prose(current.section.paragraphs).join(' ')}
          href={action?.href ?? 'https://www.labtag.com/histology-sample-kit/'}
          label={action?.label ?? 'Order Free Samples Now'}
        />,
      )
      i = current.next
      continue
    }

    if (title === 'Applying Histo-PinTAG Labels') {
      nodes.push(
        <section key={title} className="slide-apply">
          <div className="slide-apply-copy">
            <h2>{title}</h2>
            {current.section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
          {current.images.length ? (
            <div className="slide-steps">
              {current.images.map((image) => {
                const resolved = resolveImageSrc(image.src, image.fallbackSrc)
                return (
                  <figure key={image.src}>
                    <img
                      src={resolved.primary}
                      alt={image.alt}
                      onError={(event) => {
                        if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
                          event.currentTarget.src = resolved.fallback
                        }
                      }}
                    />
                    {image.alt ? <figcaption>{image.alt}</figcaption> : null}
                  </figure>
                )
              })}
            </div>
          ) : null}
        </section>,
      )
      i = current.next
      continue
    }

    nodes.push(<Story key={title} section={current.section} image={iconOf(current.images)} />)
    i = current.next
  }

  return <div className="slide-layout">{nodes}</div>
}

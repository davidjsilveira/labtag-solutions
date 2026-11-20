import type { ReactNode } from 'react'
import { histologyHasProductSection } from '@/content/splitActions'
import { slugify } from '@/content/slugify'
import type { BulletListBlock, ContentBlock, CtaBlock, ImageBlock, SectionBlock, VideoBlock } from '@/content/types'
import { BulletListBlockView } from './BulletListBlock'
import { ContentSplitActions } from './ContentSplitActions'
import { CtaBlockView } from './CtaBlock'
import { ImageBlockView } from './ImageBlock'
import { ImageSlider } from './ImageSlider'
import { RichText } from './RichText'
import { SampleBanner } from './SampleBanner'
import { VideoBlockView } from './VideoBlock'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

type MediaBlock = ImageBlock | VideoBlock

function asSection(block: ContentBlock | undefined): SectionBlock | null {
  return block?.type === 'section' ? block : null
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

function takeMedia(blocks: ContentBlock[], start: number) {
  const media: MediaBlock[] = []
  let i = start
  while (blocks[i]?.type === 'image' || blocks[i]?.type === 'video') {
    media.push(blocks[i] as MediaBlock)
    i += 1
  }
  return { media, next: i }
}

function linkFrom(paragraphs: string[]) {
  const paragraph = paragraphs.find((item) => LINK_ONLY.test(item.trim()))
  const match = paragraph?.trim().match(LINK_ONLY)
  return match ? { label: match[1], href: match[2] } : null
}

function prose(paragraphs: string[]) {
  return paragraphs.filter((item) => !LINK_ONLY.test(item.trim()))
}

function copyClass(paragraph: string) {
  return /^\([^)]+\)$/.test(paragraph.trim()) ? 'histo-kicker' : 'histo-sub'
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="btn btn-primary" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}

function Media({ media }: { media: MediaBlock[] }) {
  if (!media.length) return null
  const video = media.find((item): item is VideoBlock => item.type === 'video')
  if (video && media.length === 1) {
    return (
      <div className="histo-media is-motion">
        <VideoBlockView src={video.src} alt={video.alt} fallbackSrc={video.fallbackSrc} />
      </div>
    )
  }
  const images = media.filter((item): item is ImageBlock => item.type === 'image')
  if (!images.length) return null
  return (
    <div className="histo-media">
      <ImageSlider images={images.map((image) => ({ ...image, alt: '' }))} />
    </div>
  )
}

export function HistologyLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === 'cta') {
      nodes.push(<CtaBlockView key={block.title + i} block={block as CtaBlock} />)
      i += 1
      continue
    }

    if (block.type === 'image' || block.type === 'video') {
      i += 1
      continue
    }

    const section = asSection(block)
    if (!section) {
      i += 1
      continue
    }

    if (section.title === 'Find Your Product') {
      const cards: { title: string; image?: ImageBlock }[] = []
      let j = i + 1
      while (asSection(blocks[j])?.level === 3) {
        const card = asSection(blocks[j])!
        const media = takeImages(blocks, j + 1)
        cards.push({ title: card.title, image: media.images[0] })
        j = media.next
      }
      nodes.push(
        <section key="find" className="histo-group">
          <h2>{section.title}</h2>
          <div className="histo-find">
            {cards.map((card) => (
              <article key={card.title} className="histo-find-card">
                {card.image ? (
                  <ImageBlockView src={card.image.src} alt="" fallbackSrc={card.image.fallbackSrc} />
                ) : null}
                <h3>{card.title}</h3>
              </article>
            ))}
          </div>
        </section>,
      )
      i = j
      continue
    }

    if (section.title === 'Microscope Slide Label Size Guide') {
      const guideMedia = takeImages(blocks, i + 1)
      const guideAction = linkFrom(section.paragraphs)
      nodes.push(
        <section key={section.title} className="guide-banner">
          {guideMedia.images[0] ? (
            <div className="guide-banner-media">
              <ImageBlockView
                src={guideMedia.images[0].src}
                alt=""
                fallbackSrc={guideMedia.images[0].fallbackSrc}
              />
            </div>
          ) : null}
          <div className="guide-banner-copy">
            <h2>{section.title}</h2>
            {guideAction ? <ActionLink href={guideAction.href} label={guideAction.label} /> : null}
          </div>
        </section>,
      )
      let next = guideMedia.next
      const sample = asSection(blocks[next])
      if (sample?.title === 'Try Before You Buy') {
        const sampleMedia = takeImages(blocks, next + 1)
        const sampleAction = linkFrom(sample.paragraphs)
        nodes.push(
          <SampleBanner
            key={sample.title}
            title={sample.title}
            href={sampleAction?.href ?? '/samples'}
            label={sampleAction?.label ?? 'Order Free Samples'}
          />,
        )
        next = sampleMedia.next
      }
      i = next
      continue
    }

    if (section.title.startsWith('Printers, Scanners')) {
      const tools: { section: SectionBlock; image?: ImageBlock }[] = []
      let j = i + 1
      while (asSection(blocks[j])?.level === 3) {
        const tool = asSection(blocks[j])!
        const media = takeImages(blocks, j + 1)
        let next = media.next
        let paragraphs = [...tool.paragraphs]
        const following = blocks[next]
        if (following?.type === 'text') {
          paragraphs = [...paragraphs, ...following.paragraphs]
          next += 1
        }
        tools.push({ section: { ...tool, paragraphs }, image: media.images[0] })
        j = next
      }
      nodes.push(
        <section key="printers" className="histo-group histo-tools-group">
          <h2>{section.title}</h2>
          {prose(section.paragraphs).map((paragraph) => (
            <p key={paragraph} className="histo-intro">
              <RichText text={paragraph} />
            </p>
          ))}
          <div className="histo-tool-stack">
            {tools.map((tool) => {
              const action = linkFrom(tool.section.paragraphs)
              const body = prose(tool.section.paragraphs)
              const id = slugify(tool.section.title)
              return (
                <article key={tool.section.title} id={id} className="histo-row histo-tool-row">
                  <div className="histo-media">
                    {tool.image ? (
                      <ImageBlockView src={tool.image.src} alt="" fallbackSrc={tool.image.fallbackSrc} />
                    ) : null}
                  </div>
                  <div className="histo-copy">
                    <h3>{tool.section.title}</h3>
                    {body.map((paragraph) => (
                      <p key={paragraph} className="histo-tool-body">
                        <RichText text={paragraph} />
                      </p>
                    ))}
                    {action ? <ActionLink href={action.href} label={action.label} /> : null}
                  </div>
                </article>
              )
            })}
          </div>
        </section>,
      )
      i = j
      continue
    }

    const taken = takeMedia(blocks, i + 1)
    const bullets = blocks[taken.next]?.type === 'bulletList' ? (blocks[taken.next] as BulletListBlock) : null
    const next = bullets ? taken.next + 1 : taken.next
    const anchor = slugify(section.title)
    const showActions = histologyHasProductSection(anchor)

    if (!taken.media.length && !showActions) {
      const body = prose(section.paragraphs).join(' ')
      const action = linkFrom(section.paragraphs)
      nodes.push(
        <SampleBanner
          key={section.title}
          id={anchor}
          title={section.title}
          body={body || undefined}
          href={action?.href ?? '/samples'}
          label={action?.label ?? 'Order Free Samples'}
        />,
      )
      i = next
      continue
    }

    nodes.push(
      <section key={section.title} className="histo-row" id={anchor}>
        <div className="histo-copy">
          <h2>{section.title}</h2>
          {prose(section.paragraphs).map((paragraph) => (
            <p key={paragraph} className={copyClass(paragraph)}>
              <RichText text={paragraph} />
            </p>
          ))}
          {bullets ? <BulletListBlockView block={bullets} variant="plain" /> : null}
          {showActions ? (
            <ContentSplitActions
              sectionSlug={anchor}
              sectionTitle={section.title}
              solutionSlug="histology-labels"
            />
          ) : null}
        </div>
        <Media media={taken.media} />
      </section>,
    )
    i = next
  }

  return <div className="histo-layout">{nodes}</div>
}

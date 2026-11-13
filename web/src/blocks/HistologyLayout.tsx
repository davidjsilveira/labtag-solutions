import type { ReactNode } from 'react'
import { histologyHasProductSection } from '@/content/splitActions'
import { slugify } from '@/content/slugify'
import type { BulletListBlock, ContentBlock, CtaBlock, ImageBlock, SectionBlock } from '@/content/types'
import { BulletListBlockView } from './BulletListBlock'
import { ContentSplitActions } from './ContentSplitActions'
import { CtaBlockView } from './CtaBlock'
import { ImageBlockView } from './ImageBlock'
import { ImageSlider } from './ImageSlider'
import { RichText } from './RichText'
import { SampleBanner } from './SampleBanner'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

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

function Media({ images }: { images: ImageBlock[] }) {
  if (!images.length) return null
  const gif = images.some((image) => /\.gif(?:$|\?)/i.test(image.src))
  return (
    <div className={`histo-media${gif ? ' is-gif' : ''}`}>
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

    if (block.type === 'image') {
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
        <article key={section.title} className="histo-offer">
          {guideMedia.images[0] ? (
            <ImageBlockView
              src={guideMedia.images[0].src}
              alt=""
              fallbackSrc={guideMedia.images[0].fallbackSrc}
            />
          ) : null}
          <div>
            <h2>{section.title}</h2>
            {guideAction ? <ActionLink href={guideAction.href} label={guideAction.label} /> : null}
          </div>
        </article>,
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
            href={sampleAction?.href ?? 'https://www.labtag.com/histology-sample-kit/'}
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
        tools.push({ section: tool, image: media.images[0] })
        j = media.next
      }
      nodes.push(
        <section key="printers" className="histo-group">
          <h2>{section.title}</h2>
          {prose(section.paragraphs).map((paragraph) => (
            <p key={paragraph} className="histo-intro">
              <RichText text={paragraph} />
            </p>
          ))}
          <div className="histo-tools">
            {tools.map((tool) => {
              const action = linkFrom(tool.section.paragraphs)
              const inner = (
                <>
                  {tool.image ? (
                    <ImageBlockView src={tool.image.src} alt="" fallbackSrc={tool.image.fallbackSrc} />
                  ) : null}
                  <h3>{tool.section.title}</h3>
                </>
              )
              return action ? (
                <a key={tool.section.title} className="histo-tool" href={action.href} target="_blank" rel="noreferrer">
                  {inner}
                </a>
              ) : (
                <article key={tool.section.title} className="histo-tool">
                  {inner}
                </article>
              )
            })}
          </div>
        </section>,
      )
      i = j
      continue
    }

    const media = takeImages(blocks, i + 1)
    const bullets = blocks[media.next]?.type === 'bulletList' ? (blocks[media.next] as BulletListBlock) : null
    const next = bullets ? media.next + 1 : media.next
    const anchor = slugify(section.title)
    const showActions = histologyHasProductSection(anchor)

    if (!media.images.length && !showActions) {
      nodes.push(
        <section key={section.title} className="histo-close">
          <h2>{section.title}</h2>
          {prose(section.paragraphs).map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </section>,
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
        <Media images={media.images} />
      </section>,
    )
    i = next
  }

  return <div className="histo-layout">{nodes}</div>
}

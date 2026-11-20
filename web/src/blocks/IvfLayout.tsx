import type { ReactNode } from 'react'
import type { BulletListBlock, ContentBlock, CtaBlock, ImageBlock, SectionBlock } from '@/content/types'
import { BulletListBlockView } from './BulletListBlock'
import { ImageBlockView } from './ImageBlock'
import { RichText } from './RichText'
import { SampleBanner } from './SampleBanner'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

const SECTION_ID: Record<string, string> = {
  'Cryogenic Labels for Vitrification Devices': 'cryo-labels',
  'Labeling of Tubes and Vials': 'tubes-vials',
  'Labeling IVF Culture Plates & Dishes': 'plates-dishes',
  'Labels for Cryo Canes, Metal Racks and Canisters': 'metal-container',
  'Patient Record and Datasheet Labels': 'patient-record',
  'Additional Solutions': 'printer-scanner',
  'Get Free Samples': 'contact-us',
}

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
  const bullets =
    blocks[media.next]?.type === 'bulletList' ? (blocks[media.next] as BulletListBlock) : null
  return {
    section,
    images: media.images,
    bullets,
    next: bullets ? media.next + 1 : media.next,
  }
}

function ShopLink({ href, label }: { href: string; label: string }) {
  const external = /^https?:/i.test(href)
  return (
    <a className="btn btn-primary" href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {label}
    </a>
  )
}

function Photo({ image }: { image?: ImageBlock }) {
  if (!image) return null
  return <ImageBlockView src={image.src} alt="" fallbackSrc={image.fallbackSrc} />
}

export function IvfLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]
    if (block.type === 'cta') {
      const cta = block as CtaBlock
      // Keep only the closing samples banner; skip mid-page "claim your FREE samples" CTAs.
      if (/^get free samples$/i.test(cta.title.trim())) {
        nodes.push(
          <SampleBanner
            key={cta.title + i}
            title={cta.title}
            body={cta.body}
            href={cta.actionHref || '/samples'}
            label={cta.actionLabel || 'Get Free Samples'}
          />,
        )
      }
      i += 1
      continue
    }

    const section = asSection(block)
    if (!section || section.level !== 2) {
      i += 1
      continue
    }

    const group = readSection(blocks, i)
    const id = SECTION_ID[section.title]

    // Drop the old in-page jump-card strip.
    if (section.title === 'Find Your Products') {
      let j = group.next
      while (asSection(blocks[j])?.level === 3) {
        j = readSection(blocks, j).next
      }
      i = j
      continue
    }

    if (section.title === 'Additional Solutions') {
      const tools = []
      let j = group.next
      while (asSection(blocks[j])?.level === 3) {
        const tool = readSection(blocks, j)
        tools.push(tool)
        j = tool.next
      }
      nodes.push(
        <section key={section.title} className="ivf-group ivf-tools-group" id={id}>
          <h2>{section.title}</h2>
          {prose(section.paragraphs).map((paragraph) => (
            <p key={paragraph} className="ivf-intro">
              <RichText text={paragraph} />
            </p>
          ))}
          <div className="ivf-tool-stack">
            {tools.map((tool) => {
              const action = linkFrom(tool.section.paragraphs)
              const body = prose(tool.section.paragraphs)
              return (
                <article key={tool.section.title} className="ivf-row ivf-tool-row">
                  <div className="ivf-media">
                    <Photo image={tool.images[0]} />
                  </div>
                  <div className="ivf-copy">
                    <h3>{tool.section.title}</h3>
                    {body.map((paragraph) => (
                      <p key={paragraph} className="ivf-tool-body">
                        <RichText text={paragraph} />
                      </p>
                    ))}
                    {action ? <ShopLink href={action.href} label={action.label} /> : null}
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

    if (section.title === 'Labeling of Tubes and Vials') {
      const cards = []
      let j = group.next
      while (asSection(blocks[j])?.level === 3) {
        const card = readSection(blocks, j)
        cards.push(card)
        j = card.next
      }
      nodes.push(
        <section key={section.title} className="ivf-group" id={id}>
          <h2>{section.title}</h2>
          {prose(section.paragraphs).map((paragraph) => (
            <p key={paragraph} className="ivf-intro">
              <RichText text={paragraph} />
            </p>
          ))}
          <div className="ivf-card-stack">
            {cards.map((card) => {
              const action = linkFrom(card.section.paragraphs)
              const body = prose(card.section.paragraphs)
              return (
                <article key={card.section.title} className="ivf-row ivf-card-row">
                  <div className="ivf-media">
                    <Photo image={card.images[0]} />
                  </div>
                  <div className="ivf-copy">
                    <h3>{card.section.title}</h3>
                    {body.map((paragraph) => (
                      <p key={paragraph} className="ivf-tool-body">
                        <RichText text={paragraph} />
                      </p>
                    ))}
                    {action ? <ShopLink href={action.href} label={action.label} /> : null}
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

    if (section.title.startsWith('Labeling IVF Culture Plates')) {
      const cards = []
      let j = group.next
      while (asSection(blocks[j])?.level === 3) {
        const card = readSection(blocks, j)
        cards.push(card)
        j = card.next
      }
      nodes.push(
        <section key={section.title} className="ivf-group" id={id}>
          <h2>{section.title}</h2>
          {prose(section.paragraphs).map((paragraph) => (
            <p key={paragraph} className="ivf-intro">
              <RichText text={paragraph} />
            </p>
          ))}
          <div className="ivf-pair">
            {cards.map((card) => {
              const action = linkFrom(card.section.paragraphs)
              const body = prose(card.section.paragraphs)
              return (
                <article key={card.section.title} className="ivf-row ivf-card-row">
                  <div className="ivf-media">
                    <Photo image={card.images[0]} />
                  </div>
                  <div className="ivf-copy">
                    <h3>{card.section.title}</h3>
                    {body.map((paragraph) => (
                      <p key={paragraph} className="ivf-tool-body">
                        <RichText text={paragraph} />
                      </p>
                    ))}
                    {card.bullets ? <BulletListBlockView block={card.bullets} variant="plain" /> : null}
                    {action ? <ShopLink href={action.href} label={action.label} /> : null}
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

    if (section.title === 'Get Free Samples') {
      nodes.push(
        <SampleBanner
          key={section.title}
          id={id}
          title={section.title}
          body={prose(section.paragraphs).join(' ')}
          href="/samples"
          label="Get Free Samples"
        />,
      )
      i = group.next
      continue
    }

    // Skip leftover mid-page sample prompts that were not parsed as CTAs.
    if (/free samples/i.test(section.title) && /get in touch/i.test(section.title)) {
      i = group.next
      continue
    }

    const action = linkFrom(section.paragraphs)
    nodes.push(
      <section key={section.title} className="ivf-row" id={id}>
        <div className="ivf-media">
          <Photo image={group.images[0]} />
        </div>
        <div className="ivf-copy">
          <h2>{section.title}</h2>
          {prose(section.paragraphs).map((paragraph) => (
            <p key={paragraph} className="ivf-tool-body">
              <RichText text={paragraph} />
            </p>
          ))}
          {group.bullets ? <BulletListBlockView block={group.bullets} variant="plain" /> : null}
          {action ? <ShopLink href={action.href} label={action.label} /> : null}
        </div>
      </section>,
    )
    i = group.next
  }

  return <div className="ivf-layout">{nodes}</div>
}

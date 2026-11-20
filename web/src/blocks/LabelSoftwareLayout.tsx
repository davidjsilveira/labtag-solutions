import type { ReactNode } from 'react'
import type { BulletListBlock, ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { ImageBlockView } from './ImageBlock'
import { RichText } from './RichText'
import { SampleBanner } from './SampleBanner'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

const SECTION_ID: Record<string, string> = {
  'Label Design Software': 'design',
  'Informatics Software': 'informatics',
  'Which software is right for you?': 'contact-us',
}

function asSection(block: ContentBlock | undefined): SectionBlock | null {
  return block?.type === 'section' ? block : null
}

function linkFrom(text: string) {
  const match = text.trim().match(LINK_ONLY)
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

export function LabelSoftwareLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const section = asSection(blocks[i])
    if (!section) {
      i += 1
      continue
    }

    const media = takeImages(blocks, i + 1)
    const bullets =
      blocks[media.next]?.type === 'bulletList' ? (blocks[media.next] as BulletListBlock) : null
    const next = bullets ? media.next + 1 : media.next
    const id = SECTION_ID[section.title]
    const action = section.paragraphs.map(linkFrom).find(Boolean)
    const body = prose(section.paragraphs)

    // Empty markdown stubs (e.g. "Comparing Products We Offer").
    if (!body.length && !media.images.length && !bullets && !action) {
      i = next
      continue
    }

    if (/which software is right for you/i.test(section.title)) {
      nodes.push(
        <SampleBanner
          key={section.title}
          id={id}
          title={section.title}
          body={body.join(' ')}
          href={action?.href || 'https://www.labtag.com/contact-us/'}
          label={action?.label || 'Get in Touch'}
        />,
      )
      i = next
      continue
    }

    if (section.title === 'Our Informatics Software Partners' && bullets) {
      const partners = bullets.items
        .map(linkFrom)
        .filter((item): item is { label: string; href: string } => Boolean(item))
      nodes.push(
        <section key={section.title} className="software-logos">
          <h2>{section.title}</h2>
          <div className="software-logo-grid">
            {media.images.map((image, index) => {
              const partner = partners[index]
              const photo = <ImageBlockView src={image.src} alt="" fallbackSrc={image.fallbackSrc} />
              return partner ? (
                <a key={partner.href} href={partner.href} target="_blank" rel="noreferrer" aria-label={partner.label}>
                  {photo}
                </a>
              ) : (
                <div key={image.src}>{photo}</div>
              )
            })}
          </div>
        </section>,
      )
      i = next
      continue
    }

    nodes.push(
      <section key={section.title} className="software-row" id={id}>
        <div className="software-media">
          <Photo image={media.images[0]} />
        </div>
        <div className="software-copy">
          {section.level === 2 ? <h2>{section.title}</h2> : <h3>{section.title}</h3>}
          {body.map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
          {action ? <ShopLink href={action.href} label={action.label} /> : null}
        </div>
      </section>,
    )
    i = next
  }

  return <div className="software-layout">{nodes}</div>
}

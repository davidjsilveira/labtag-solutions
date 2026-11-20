import type { ReactNode } from 'react'
import { CONTACT_PATH } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { ImageSlider } from './ImageSlider'
import { RichText } from './RichText'
import { SampleBanner } from './SampleBanner'

const BANNER_HREF =
  'https://www.labtag.com/shop/category/tapes/laboratory-tapes-with-gatorcut-technology/'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

/** In-page ids from the live article. */
const ANCHORS: Record<string, string> = {
  Cryogenic: 'cryogenic-tapes',
  'Permanent Cryogenic Tape': 'perm',
  'Cryo Tape For Metal Racks': 'metal',
  'Cryogenic Lamination Tape': 'lam',
  'Frozen Container Tape': 'frozen',
  'Tamper-Evident Cryo Tape': 'tamper',
  'Freezer Tapes': 'freezer-tapes',
  'Translucent Freezer Tape': 'transluscent',
  'Removable Freezer Tapes': 'removable',
  'Autoclave Tapes': 'autoclave-tapes',
  'Removable SteriTAPE™ (Patented)': 'SteriTAPE',
  'Printable Autoclave Tape': 'printable',
  'Sterilization Indicator Tape': 'sterilization',
  'General Purpose Lab Tapes': 'paper-tapes',
  'Color Lab Tapes': 'color',
  'Glow-In-The-Dark Tape': 'glow',
  'Ultra-Removable Tape': 'ultra',
  'Specialty Tapes and Dispensers': 'more',
  'UbiCling™ (Patent Pending)': 'UbiCling',
  'PluroTAPE™ (Patent Pending)': 'plurotape',
  'CryoHUG™ (Patented)': 'cryohug',
  'Tape Dispensers': 'dispenser',
  'Get in Touch': 'contact-us',
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

function TapeBanner({ image }: { image: ImageBlock }) {
  const resolved = resolveImageSrc(image.src, image.fallbackSrc)
  return (
    <a className="tape-banner" href={BANNER_HREF} target="_blank" rel="noreferrer">
      <img
        src={resolved.primary}
        alt=""
        onError={(event) => {
          if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
            event.currentTarget.src = resolved.fallback
          }
        }}
      />
    </a>
  )
}

function TapeGallery({ images }: { images: ImageBlock[] }) {
  return (
    <div className="tape-gallery">
      <ImageSlider images={images.map((image) => ({ ...image, alt: '' }))} controls="arrows" />
    </div>
  )
}

export function LabTapesLayout({ blocks }: { blocks: ContentBlock[] }) {
  const banner = blocks[0]?.type === 'image' ? (blocks[0] as ImageBlock) : null
  const nodes: ReactNode[] = []
  let i = banner ? 1 : 0

  while (i < blocks.length) {
    const section = asSection(blocks[i])
    if (!section) {
      i += 1
      continue
    }

    const images: ImageBlock[] = []
    let j = i + 1
    while (blocks[j]?.type === 'image') {
      images.push(blocks[j] as ImageBlock)
      j += 1
    }

    const action = linkFrom(section.paragraphs)
    const body = prose(section.paragraphs)
    const id = ANCHORS[section.title]
    const Heading = section.level === 3 ? 'h3' : 'h2'

    if (/^get in touch$/i.test(section.title)) {
      nodes.push(
        <SampleBanner
          key={section.title}
          id={id}
          title={section.title}
          body={body.join(' ') || undefined}
          href={action?.href || CONTACT_PATH}
          label={action?.label || 'Get in Touch'}
        />,
      )
    } else if (!body.length && !images.length) {
      nodes.push(
        <Heading key={section.title} id={id} className="tape-group">
          {section.title}
        </Heading>,
      )
    } else {
      nodes.push(
        <section key={section.title} id={id} className="tape-row">
          <div className="tape-copy">
            <h2>{section.title}</h2>
            {body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>
                <RichText text={paragraph} />
              </p>
            ))}
            {action ? (
              <a className="btn btn-primary" href={action.href} target="_blank" rel="noreferrer">
                {action.label}
              </a>
            ) : null}
          </div>
          {images.length ? <TapeGallery images={images} /> : null}
        </section>,
      )
    }

    i = j
  }

  return (
    <div className="tape-layout">
      {banner ? <TapeBanner image={banner} /> : null}
      {nodes}
    </div>
  )
}

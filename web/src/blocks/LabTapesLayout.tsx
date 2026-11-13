import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createHubSpotForm, loadHubSpotFormsScript } from '@/content/hubspotForm'
import { resolveImageSrc } from '@/content/resolveImage'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { RichText } from './RichText'

const BANNER_HREF =
  'https://www.labtag.com/shop/category/tapes/laboratory-tapes-with-gatorcut-technology/'

const FORM_TARGET = 'hs-form-lab-tapes'
const PORTAL_ID = '4079112'
const FORM_ID = '37b7606e-4f35-4ea3-a18d-4d450a5b7a34'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

/** In-page ids from the live article, including the nav targets. */
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

const NAV = [
  {
    title: 'Cryogenic Tapes',
    href: '#cryogenic-tapes',
    links: [
      ['Permanent Cryogenic Tape', '#perm'],
      ['Cryo Tape for Metal Racks', '#metal'],
      ['Cryogenic Laminate Tape', '#lam'],
      ['Frozen Container Tapes', '#frozen'],
      ['Tamper-Evident Cryo Tape', '#tamper'],
    ],
  },
  {
    title: 'Freezer Tapes',
    href: '#freezer-tapes',
    links: [
      ['Transluscent Freezer Tape', '#transluscent'],
      ['Removable Freezer Tape', '#removable'],
    ],
  },
  {
    title: 'Autoclave Tapes',
    href: '#autoclave-tapes',
    links: [
      ['Printable Autoclave Tape', '#printable'],
      ['Sterilization Indicator Tape', '#sterilization'],
      ['Removable SteriTAPE™', '#SteriTAPE'],
    ],
  },
  {
    title: 'General Purpose',
    href: '#paper-tapes',
    links: [
      ['Color Lab Tapes', '#color'],
      ['Glow-In-The-Dark Tape', '#glow'],
      ['Ultra Removable Tape', '#ultra'],
    ],
  },
  {
    title: 'Specialty Tapes',
    href: '#more',
    links: [
      ['PluroTAPE™ (Patent Pending)', '#plurotape'],
      ['CryoHUG™ (Patented)', '#cryohug'],
      ['Tape Dispensers', '#dispenser'],
      ['UbiCling™', '#UbiCling'],
    ],
  },
] as const

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

function TapeNav() {
  return (
    <nav className="tape-nav" aria-label="Lab tapes">
      {NAV.map((column) => (
        <div key={column.title}>
          <p className="tape-nav-title">
            <a href={column.href}>{column.title}</a>
          </p>
          <ul>
            {column.links.map(([label, href]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
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

function TapeGallery({ images, href, title }: { images: ImageBlock[]; href?: string; title: string }) {
  const [index, setIndex] = useState(0)
  const image = images[index] ?? images[0]
  const resolved = resolveImageSrc(image.src, image.fallbackSrc)
  const picture = (
    <img
      src={resolved.primary}
      alt={title}
      onError={(event) => {
        if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
          event.currentTarget.src = resolved.fallback
        }
      }}
    />
  )

  return (
    <div className="tape-gallery">
      {href ? (
        <a className="tape-shot" href={href} target="_blank" rel="noreferrer">
          {picture}
        </a>
      ) : (
        <div className="tape-shot">{picture}</div>
      )}
      {images.length > 1 ? (
        <div className="tape-thumbs">
          {images.map((item, thumbIndex) => {
            const thumb = resolveImageSrc(item.src, item.fallbackSrc)
            return (
              <button
                key={item.src}
                type="button"
                className={thumbIndex === index ? 'is-active' : undefined}
                aria-label={`Show photo ${thumbIndex + 1} of ${images.length}`}
                aria-current={thumbIndex === index ? 'true' : undefined}
                onClick={() => setIndex(thumbIndex)}
              >
                <img src={thumb.primary} alt="" />
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function TapeContact({ id, title, body }: { id?: string; title: string; body: string }) {
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    const target = `#${FORM_TARGET}`
    let cancelled = false

    loadHubSpotFormsScript()
      .then(() => {
        if (cancelled || !mounted.current || !window.hbspt?.forms?.create) return
        const node = document.querySelector(target)
        if (node) node.innerHTML = ''
        createHubSpotForm({ portalId: PORTAL_ID, formId: FORM_ID, target })
      })
      .catch(() => {
        /* The heading and sentence stay if the form script cannot load. */
      })

    return () => {
      cancelled = true
      mounted.current = false
    }
  }, [])

  return (
    <section className="tape-contact request-form-page" id={id}>
      <h2>{title}</h2>
      <p>{body}</p>
      <div id={FORM_TARGET} />
    </section>
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
      nodes.push(<TapeContact key={section.title} id={id} title={section.title} body={body.join(' ')} />)
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
          {images.length ? <TapeGallery images={images} href={action?.href} title={section.title} /> : null}
        </section>,
      )
    }

    i = j
  }

  return (
    <div className="tape-layout">
      <TapeNav />
      {banner ? <TapeBanner image={banner} /> : null}
      {nodes}
    </div>
  )
}

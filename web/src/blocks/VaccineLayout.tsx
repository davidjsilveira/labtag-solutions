import { Link } from 'react-router-dom'
import { CONTACT_PATH } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { RichText } from './RichText'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

/** Image destinations from the live page. The syringe photo and its button go to different shop URLs. */
const IMAGE_HREF: Record<string, string> = {
  'Refrigerated Vaccine Labels': 'https://www.labtag.com/shop/category/deep-freeze-labels/',
  'Frozen Vaccine Labels': 'https://www.labtag.com/shop/category/cryogenic-labels/',
  'Syringe Labels': 'https://www.labtag.com/shop/category/healthcare-labels/anesthesia-and-vaccine-labels/',
  'RFID Labels & Smart Labels': 'https://www.labtag.com/rfid-labels/',
  'Custom Labels & Clinical Trial Labels': 'https://www.labtag.com/clinical-trial-labels/',
}

function linkFrom(paragraphs: string[]) {
  const paragraph = paragraphs.find((item) => LINK_ONLY.test(item.trim()))
  const match = paragraph?.trim().match(LINK_ONLY)
  return match ? { label: match[1], href: match[2] } : null
}

function prose(paragraphs: string[]) {
  return paragraphs.filter((item) => !LINK_ONLY.test(item.trim()))
}

function Photo({ image, href }: { image?: ImageBlock; href?: string }) {
  if (!image) return null
  const resolved = resolveImageSrc(image.src, image.fallbackSrc)
  const img = (
    <img
      src={resolved.primary}
      alt=""
      onError={(event) => {
        if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
          event.currentTarget.src = resolved.fallback
        }
      }}
    />
  )
  if (!href) return img
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {img}
    </a>
  )
}

function ExpertHelp({ title, body }: { title: string; body: string }) {
  return (
    <section className="vaccine-help" id="contact-us">
      <div>
        <h2>{title}</h2>
        {body ? (
          <p>
            <RichText text={body} />
          </p>
        ) : null}
      </div>
      <Link className="btn btn-primary" to={`${CONTACT_PATH}#contact-request`}>
        Contact us
      </Link>
    </section>
  )
}

export function VaccineLayout({ blocks }: { blocks: ContentBlock[] }) {
  const rows: { section: SectionBlock; image?: ImageBlock }[] = []
  let help: { title: string; body: string } | null = null

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]
    if (
      (block.type === 'cta' || block.type === 'section') &&
      /need expert help/i.test(block.title)
    ) {
      const body = block.type === 'cta' ? block.body : prose(block.paragraphs).join(' ')
      help = { title: block.title, body }
      continue
    }
    if (block.type !== 'section') continue
    const image = blocks[i + 1]?.type === 'image' ? (blocks[i + 1] as ImageBlock) : undefined
    rows.push({ section: block, image })
  }

  return (
    <div className="vaccine">
      {rows.map(({ section, image }) => {
        const action = linkFrom(section.paragraphs)
        return (
          <section key={section.title} className="vaccine-row">
            <Photo image={image} href={IMAGE_HREF[section.title] ?? action?.href} />
            <div>
              <h2>{section.title}</h2>
              {prose(section.paragraphs).map((paragraph) => (
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
          </section>
        )
      })}
      {help ? <ExpertHelp title={help.title} body={help.body} /> : null}
    </div>
  )
}

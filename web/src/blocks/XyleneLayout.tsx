import { Link } from 'react-router-dom'
import { CONTACT_PATH } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { YoutubeLink, youtubeVideoId } from '@/components/YoutubeLink'
import { ImageSlider } from './ImageSlider'
import { RichText } from './RichText'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

function linkFromLine(line: string) {
  const match = line.trim().match(LINK_ONLY)
  return match ? { label: match[1], href: match[2] } : null
}

function linksOf(paragraphs: string[]) {
  return paragraphs.map(linkFromLine).filter((item): item is { label: string; href: string } => Boolean(item))
}

function prose(paragraphs: string[]) {
  return paragraphs.filter((item) => !LINK_ONLY.test(item.trim()) && item.trim() !== 'NEW!')
}

function isSvg(image: ImageBlock) {
  return /\.svg(?:$|\?)/i.test(image.src) || /\.svg(?:$|\?)/i.test(image.fallbackSrc ?? '')
}

function Photo({ image }: { image: ImageBlock }) {
  const resolved = resolveImageSrc(image.src, image.fallbackSrc)
  return (
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
}

function Action({ label, href }: { label: string; href: string }) {
  if (youtubeVideoId(href)) {
    return (
      <YoutubeLink className="btn btn-primary" href={href}>
        {label}
      </YoutubeLink>
    )
  }
  return (
    <a className="btn btn-primary" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}

function Actions({ paragraphs }: { paragraphs: string[] }) {
  const links = linksOf(paragraphs)
  if (!links.length) return null
  return (
    <div className="xylene-actions">
      {links.map((link) => (
        <Action key={link.href + link.label} href={link.href} label={link.label} />
      ))}
    </div>
  )
}

type Unit = { section: SectionBlock; images: ImageBlock[] }

function unitsFrom(blocks: ContentBlock[]) {
  const units: Unit[] = []
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]
    if (block.type !== 'section') continue
    const images: ImageBlock[] = []
    let next = i + 1
    while (blocks[next]?.type === 'image') {
      images.push(blocks[next] as ImageBlock)
      next += 1
    }
    units.push({ section: block, images })
  }
  return units
}

export function XyleneLayout({ blocks }: { blocks: ContentBlock[] }) {
  const units = unitsFrom(blocks)

  return (
    <div className="xylene">
      {units.map(({ section, images }) => {
        if (/chemical-resistant label guide/i.test(section.title)) {
          const action = linksOf(section.paragraphs)[0]
          return (
            <section key={section.title} className="xylene-guide">
              {images[0] ? <Photo image={images[0]} /> : null}
              <div>
                <h2>{section.title}</h2>
                {prose(section.paragraphs).map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>
                    <RichText text={paragraph} />
                  </p>
                ))}
                {action ? <Action href={action.href} label={action.label} /> : null}
              </div>
            </section>
          )
        }

        if (/xylistuck/i.test(section.title)) {
          const mark = images.find(isSvg)
          const photo = images.find((image) => !isSvg(image))
          return (
            <section key={section.title} className="xylene-xyli">
              <div>
                {section.paragraphs.some((item) => item.trim() === 'NEW!') ? <p className="xylene-new">NEW!</p> : null}
                <h2>{section.title}</h2>
                {prose(section.paragraphs).map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>
                    <RichText text={paragraph} />
                  </p>
                ))}
                <div className="xylene-xyli-meta">
                  {mark ? <Photo image={mark} /> : null}
                  <Actions paragraphs={section.paragraphs} />
                </div>
              </div>
              {photo ? <Photo image={photo} /> : null}
            </section>
          )
        }

        if (/^get in touch$/i.test(section.title)) {
          return (
            <section key={section.title} className="xylene-contact">
              <div>
                <h2>{section.title}</h2>
                {prose(section.paragraphs).map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
              <Link className="btn btn-primary" to={`${CONTACT_PATH}#contact-request`}>
                Contact us
              </Link>
            </section>
          )
        }

        if (/by adhesive/i.test(section.title)) {
          return (
            <section key={section.title} className="xylene-adhesive">
              <h2>{section.title}</h2>
              <div className="xylene-adhesive-links">
                {linksOf(section.paragraphs).map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </section>
          )
        }

        const copy = prose(section.paragraphs)
        const photos = images.filter((image) => !isSvg(image))
        if (!copy.length && !photos.length) {
          return (
            <h2 key={section.title} className="xylene-group">
              {section.title}
            </h2>
          )
        }

        return (
          <section key={section.title} className="xylene-row">
            {photos.length > 1 ? (
              <ImageSlider images={photos} className="xylene-slider" />
            ) : photos.length === 1 ? (
              <div className="xylene-photos is-single">
                <Photo image={photos[0]} />
              </div>
            ) : null}
            <div>
              <h2>{section.title}</h2>
              {copy.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>
                  <RichText text={paragraph} />
                </p>
              ))}
              <Actions paragraphs={section.paragraphs} />
            </div>
          </section>
        )
      })}
    </div>
  )
}

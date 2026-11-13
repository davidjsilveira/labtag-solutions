import { Link } from 'react-router-dom'
import { CONTACT_PATH } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { RichText } from './RichText'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

function linkFrom(paragraphs: string[]) {
  const paragraph = paragraphs.find((item) => LINK_ONLY.test(item.trim()))
  const match = paragraph?.trim().match(LINK_ONLY)
  return match ? { label: match[1], href: match[2] } : null
}

function prose(paragraphs: string[]) {
  return paragraphs.filter((item) => !LINK_ONLY.test(item.trim()))
}

function Photo({ image }: { image?: ImageBlock }) {
  if (!image) return null
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

function ShopLink({ href, label, button = false }: { href: string; label: string; button?: boolean }) {
  return (
    <a className={button ? 'btn btn-primary' : undefined} href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}

function Contact({ title, body }: { title: string; body: string }) {
  return (
    <section className="rfid-contact">
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

export function RfidLayout({ blocks }: { blocks: ContentBlock[] }) {
  const products: { section: SectionBlock; image?: ImageBlock }[] = []
  const benefits: SectionBlock[] = []
  let shopTitle = 'Shop Our RFID Products'
  let custom: SectionBlock | null = null
  const customImages: ImageBlock[] = []
  let industrial: SectionBlock | null = null
  let contact: { title: string; body: string } | null = null

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]
    if (block.type === 'cta' && /get in touch/i.test(block.title)) {
      contact = { title: block.title, body: block.body }
      continue
    }
    if (block.type !== 'section') continue
    if (block.level === 2 && /shop our rfid products/i.test(block.title)) {
      shopTitle = block.title
      continue
    }
    if (/get in touch/i.test(block.title)) {
      contact = { title: block.title, body: prose(block.paragraphs).join(' ') }
      continue
    }
    if (block.level === 3 && /shop our rfid products/i.test(sectionsBefore(blocks, i))) {
      const image = blocks[i + 1]?.type === 'image' ? (blocks[i + 1] as ImageBlock) : undefined
      products.push({ section: block, image })
      continue
    }
    if (block.level === 3 && /benefits of rfid/i.test(sectionsBefore(blocks, i))) {
      benefits.push(block)
      continue
    }
    if (/custom rfid identification/i.test(block.title)) {
      custom = block
      let next = i + 1
      while (blocks[next]?.type === 'image') {
        customImages.push(blocks[next] as ImageBlock)
        next += 1
      }
      continue
    }
    if (/industrial grade rfid/i.test(block.title)) {
      industrial = block
    }
  }

  const industrialLink = industrial ? linkFrom(industrial.paragraphs) : null

  return (
    <div className="rfid">
      {products.length ? (
        <section className="rfid-shop">
          <h2>{shopTitle}</h2>
          <div className="rfid-products">
            {products.map(({ section, image }) => {
              const action = linkFrom(section.paragraphs)
              return (
                <article key={section.title} className="rfid-product">
                  <Photo image={image} />
                  {action ? <ShopLink href={action.href} label={section.title} /> : <h3>{section.title}</h3>}
                </article>
              )
            })}
          </div>
        </section>
      ) : null}

      {benefits.length ? (
        <section className="rfid-benefits">
          <h2>Benefits of RFID Labels & RFID Tags</h2>
          <div className="rfid-benefit-grid">
            {benefits.map((section) => (
              <article key={section.title}>
                <h3>{section.title}</h3>
                {prose(section.paragraphs).map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {custom ? (
        <section className="rfid-custom">
          <h2>{custom.title}</h2>
          {prose(custom.paragraphs).map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>
              <RichText text={paragraph} />
            </p>
          ))}
          {customImages.length ? (
            <div className="rfid-custom-photos">
              {customImages.map((image) => (
                <Photo key={image.src} image={image} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {industrial ? (
        <section className="rfid-industrial">
          <h2>{industrial.title}</h2>
          {prose(industrial.paragraphs).map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>
              <RichText text={paragraph} />
            </p>
          ))}
          {industrialLink ? (
            <ShopLink href={industrialLink.href} label={industrialLink.label} button />
          ) : null}
        </section>
      ) : null}

      {contact ? <Contact title={contact.title} body={contact.body} /> : null}
    </div>
  )
}

function sectionsBefore(blocks: ContentBlock[], index: number) {
  for (let i = index - 1; i >= 0; i -= 1) {
    const block = blocks[i]
    if (block.type === 'section' && block.level === 2) return block.title
  }
  return ''
}

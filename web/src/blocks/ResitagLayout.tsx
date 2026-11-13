import type { ReactNode } from 'react'
import type { BulletListBlock, ContentBlock, CtaBlock, ImageBlock, SectionBlock } from '@/content/types'

const PRODUCT =
  'https://www.labtag.com/shop/product/chemical-resistant-labels-for-resin-embedding-1-x-0-25-xst-251-patent-pending/'
const CONTACT = 'https://www.labtag.com/contact-us/'

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

function Photo({ image }: { image?: ImageBlock }) {
  if (!image) return null
  return (
    <div className="resi-media">
      <img src={image.src} alt={image.alt} decoding="async" />
    </div>
  )
}

export function ResitagLayout({ blocks }: { blocks: ContentBlock[] }) {
  const story: SectionBlock[] = []
  let storyImage: ImageBlock | undefined
  let features: SectionBlock | undefined
  let featureBullets: string[] = []
  let featureImage: ImageBlock | undefined
  let closeTitle = 'Experience the benefits of ResiTAG®'
  let closeBody = ''

  let i = 0
  while (i < blocks.length) {
    const block = blocks[i]
    if (block.type === 'cta') {
      const cta = block as CtaBlock
      closeTitle = cta.title
      closeBody = cta.body ?? ''
      i += 1
      continue
    }
    const section = asSection(block)
    if (!section) {
      i += 1
      continue
    }
    if (section.title === 'Features') {
      features = section
      i += 1
      if (blocks[i]?.type === 'bulletList') {
        featureBullets = (blocks[i] as BulletListBlock).items
        i += 1
      }
      const media = takeImages(blocks, i)
      featureImage = media.images[0]
      i = media.next
      continue
    }
    if (/^experience the benefits/i.test(section.title)) {
      closeTitle = section.title
      closeBody = section.paragraphs.filter((paragraph) => !paragraph.startsWith('[')).join(' ')
      i += 1
      continue
    }
    const media = takeImages(blocks, i + 1)
    if (!storyImage && media.images[0]) storyImage = media.images[0]
    story.push(section)
    i = media.next
  }

  const nodes: ReactNode[] = []
  if (story.length) {
    nodes.push(
      <section key="story" className="resi-story">
        <Photo image={storyImage} />
        <div className="resi-copy">
          {story.map((section) => (
            <div key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </section>,
    )
  }

  if (features) {
    nodes.push(
      <section key="features" className="resi-features">
        <div className="resi-copy">
          <h2>{features.title}</h2>
          {featureBullets.length ? (
            <ul>
              {featureBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <Photo image={featureImage} />
      </section>,
    )
  }

  nodes.push(
    <section key="close" className="resi-close">
      <h2>{closeTitle}</h2>
      {closeBody ? <p>{closeBody}</p> : null}
      <div className="resi-actions">
        <a className="btn btn-primary" href={CONTACT} target="_blank" rel="noreferrer">
          Get in Touch
        </a>
        <a className="btn btn-secondary" href={PRODUCT} target="_blank" rel="noreferrer">
          View Product
        </a>
      </div>
    </section>,
  )

  return <div className="resi-layout">{nodes}</div>
}

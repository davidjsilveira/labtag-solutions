import type { ReactNode } from 'react'
import type {
  BulletListBlock,
  ContentBlock,
  ImageBlock,
  SectionBlock,
  TextBlock,
} from '@/content/types'
import { IsoBanner } from './IsoBanner'
import { RichText } from './RichText'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

function asSection(block: ContentBlock | undefined): SectionBlock | null {
  return block?.type === 'section' ? block : null
}

function asImage(block: ContentBlock | undefined): ImageBlock | null {
  return block?.type === 'image' ? block : null
}

function linkOnly(text: string | undefined) {
  const match = text?.match(LINK_ONLY)
  return match ? { label: match[1], href: match[2] } : null
}

function textBlock(block: ContentBlock | undefined): TextBlock | null {
  return block?.type === 'text' ? block : null
}

export function CovidLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const section = asSection(blocks[i])
    if (!section) {
      i += 1
      continue
    }

    if (section.title === 'Case Study' && asSection(blocks[i + 1])) {
      const story = blocks[i + 1] as SectionBlock
      const image = asImage(blocks[i + 2])
      const body = story.paragraphs.filter((paragraph) => !linkOnly(paragraph))
      const action = story.paragraphs.map(linkOnly).find(Boolean)
      nodes.push(
        <section key={story.title} className="covid-case" id="case-study">
          <p className="covid-kicker">Case Study</p>
          <div className="covid-case-grid">
            {image ? <img src={image.src} alt="" /> : null}
            <div>
              <h2>{story.title}</h2>
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
          </div>
        </section>,
      )
      i += image ? 3 : 2
      continue
    }

    if (/^rapid response/i.test(section.title)) {
      const image = asImage(blocks[i + 1])
      const more = textBlock(image ? blocks[i + 2] : blocks[i + 1])
      nodes.push(
        <section key={section.title} className="covid-rapid" id="rapid-response-testing">
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="covid-callout">
              <RichText text={paragraph} />
            </p>
          ))}
          <div className="covid-rapid-split">
            {image ? <img src={image.src} alt="" /> : null}
            {more
              ? more.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>
                    <RichText text={paragraph} />
                  </p>
                ))
              : null}
          </div>
        </section>,
      )
      i += 1 + (image ? 1 : 0) + (more ? 1 : 0)
      continue
    }

    const image = asImage(blocks[i + 1])
    const after = image ? i + 2 : i + 1
    const bullets = blocks[after]?.type === 'bulletList' ? (blocks[after] as BulletListBlock) : null
    const linkAt = bullets ? after + 1 : after
    const trailing = textBlock(blocks[linkAt])
    const action =
      trailing && trailing.paragraphs.length === 1 ? linkOnly(trailing.paragraphs[0]) : null

    if (image && bullets) {
      nodes.push(
        <article key={section.title} className="covid-feature" id={section.title.toLowerCase().replace(/\s+/g, '-')}>
          <img src={image.src} alt="" />
          <div>
            <h2>{section.title}</h2>
            <ul>
              {bullets.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {action ? (
              <a className="btn btn-primary" href={action.href} target="_blank" rel="noreferrer">
                {action.label}
              </a>
            ) : null}
          </div>
        </article>,
      )
      i = linkAt + (action ? 1 : 0)
      continue
    }

    if (section.paragraphs.length === 0 && asSection(blocks[i + 1]) && asImage(blocks[i + 2])) {
      const products: { title: string; href?: string; src: string }[] = []
      let j = i + 1
      while (asSection(blocks[j]) && asImage(blocks[j + 1])) {
        const card = blocks[j] as SectionBlock
        if (card.title === 'Case Study') break
        const photo = blocks[j + 1] as ImageBlock
        const linked = linkOnly(card.paragraphs[0])
        products.push({ title: card.title, href: linked?.href, src: photo.src })
        j += 2
      }
      if (products.length) {
        nodes.push(
          <section key={section.title} className="covid-catalog">
            <h2>{section.title}</h2>
            <div className={`covid-products${products.length > 4 ? ' is-five' : ''}`}>
              {products.map((product) => {
                const inner = (
                  <>
                    <img src={product.src} alt="" />
                    <span>{product.title}</span>
                  </>
                )
                return product.href ? (
                  <a key={product.title} href={product.href} target="_blank" rel="noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div key={product.title}>{inner}</div>
                )
              })}
            </div>
          </section>,
        )
        i = j
        continue
      }
    }

    if (/ISO 9001/i.test(section.title)) {
      const partner = asSection(blocks[after])
      nodes.push(<IsoBanner key="iso-banner" />)
      i = after + (partner ? 1 : 0)
      continue
    }

    i += 1
  }

  return <div className="covid-layout">{nodes}</div>
}

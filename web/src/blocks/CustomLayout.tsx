import type { ReactNode } from 'react'
import { slugify } from '@/content/slugify'
import type { BulletListBlock, ContentBlock, CtaBlock, ImageBlock, SectionBlock } from '@/content/types'
import { CtaBlockView } from './CtaBlock'
import { RichText } from './RichText'

type Card = {
  section: SectionBlock
  image: ImageBlock
}

export function CustomLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === 'section' && blocks[i + 1]?.type === 'image') {
      const cards: Card[] = []
      while (blocks[i]?.type === 'section' && blocks[i + 1]?.type === 'image') {
        cards.push({ section: blocks[i] as SectionBlock, image: blocks[i + 1] as ImageBlock })
        i += 2
      }
      nodes.push(
        <div key={`cards-${cards[0].section.title}`} className="custom-cards">
          {cards.map(({ section, image }) => (
            <article key={section.title} id={slugify(section.title)}>
              <img src={image.src} alt={image.alt || section.title} decoding="async" />
              <h3>{section.title}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </article>
          ))}
        </div>,
      )
      continue
    }

    if (block.type === 'section' && blocks[i + 1]?.type === 'bulletList') {
      const specs: { section: SectionBlock; items: string[] }[] = []
      while (blocks[i]?.type === 'section' && blocks[i + 1]?.type === 'bulletList') {
        specs.push({
          section: blocks[i] as SectionBlock,
          items: (blocks[i + 1] as BulletListBlock).items,
        })
        i += 2
      }
      nodes.push(
        <div key={`specs-${specs[0].section.title}`} className="clinical-specs">
          {specs.map(({ section, items }) => (
            <article key={section.title} id={slugify(section.title)}>
              <h2>{section.title}</h2>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>,
      )
      continue
    }

    if (block.type === 'cta') {
      nodes.push(<CtaBlockView key={block.title} block={block as CtaBlock} />)
      i += 1
      continue
    }

    i += 1
  }

  return <div className="custom-layout">{nodes}</div>
}

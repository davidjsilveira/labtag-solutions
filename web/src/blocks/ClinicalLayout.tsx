import type { ReactNode } from 'react'
import { slugify } from '@/content/slugify'
import type { BulletListBlock, ContentBlock, CtaBlock, ImageBlock, SectionBlock } from '@/content/types'
import { CtaBlockView } from './CtaBlock'
import { RichText } from './RichText'

function asSection(block: ContentBlock | undefined): SectionBlock | null {
  return block?.type === 'section' ? block : null
}

export function ClinicalLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (asSection(block)?.paragraphs.length === 1) {
      const run: SectionBlock[] = []
      while (asSection(blocks[i])?.paragraphs.length === 1) {
        run.push(blocks[i] as SectionBlock)
        i += 1
      }
      nodes.push(
        <div key={`capabilities-${run[0].title}`} className="clinical-capabilities">
          {run.map((section) => (
            <article key={section.title} id={slugify(section.title)}>
              <h2>{section.title}</h2>
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

    if (block.type === 'image') {
      const images: ImageBlock[] = []
      while (blocks[i]?.type === 'image') {
        images.push(blocks[i] as ImageBlock)
        i += 1
      }
      nodes.push(
        <div key={`photos-${images[0].src}`} className="clinical-photos">
          {images.map((image) => (
            <img key={image.src} src={image.src} alt={image.alt} decoding="async" />
          ))}
        </div>,
      )
      continue
    }

    const listed = asSection(block)
    if (listed && blocks[i + 1]?.type === 'bulletList') {
      const partner = /partner to/i.test(listed.title)
      if (partner) {
        const list = blocks[i + 1] as BulletListBlock
        const mid = Math.ceil(list.items.length / 2)
        nodes.push(
          <section key={listed.title} className="clinical-partner" id={slugify(listed.title)}>
            <h2>{listed.title}</h2>
            <div className="clinical-partner-cols">
              {[list.items.slice(0, mid), list.items.slice(mid)].map((column) => (
                <ul key={column[0]}>
                  {column.map((item) => (
                    <li key={item}>
                      <RichText text={item} />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </section>,
        )
        i += 2
        continue
      }

      const specs: { section: SectionBlock; items: string[] }[] = []
      while (asSection(blocks[i]) && blocks[i + 1]?.type === 'bulletList') {
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

    const essay = asSection(block)
    if (essay && essay.paragraphs.length >= 2) {
      const essays: SectionBlock[] = [essay]
      i += 1
      while (asSection(blocks[i]) && (asSection(blocks[i])?.paragraphs.length ?? 0) >= 2) {
        essays.push(blocks[i] as SectionBlock)
        i += 1
      }
      nodes.push(
        <div key={`essays-${essays[0].title}`} className="clinical-essays">
          {essays.map((section) => (
            <article key={section.title} id={slugify(section.title)}>
              <h2>{section.title}</h2>
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

    if (block.type === 'cta') {
      nodes.push(<CtaBlockView key={block.title} block={block as CtaBlock} />)
      i += 1
      continue
    }

    i += 1
  }

  return <div className="clinical-layout">{nodes}</div>
}

import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { ImageBlockView } from './ImageBlock'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

function linkHref(paragraphs: string[]) {
  const paragraph = paragraphs.find((item) => LINK_ONLY.test(item.trim()))
  return paragraph?.trim().match(LINK_ONLY)?.[2]
}

export function IndustrialLayout({ blocks }: { blocks: ContentBlock[] }) {
  const cards: { title: string; href?: string; image?: ImageBlock }[] = []

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]
    if (block.type !== 'section') continue
    const section = block as SectionBlock
    const images: ImageBlock[] = []
    let j = i + 1
    while (blocks[j]?.type === 'image') {
      images.push(blocks[j] as ImageBlock)
      j += 1
    }
    cards.push({
      title: section.title,
      href: linkHref(section.paragraphs),
      image: images[0],
    })
  }

  return (
    <div className="industri-grid">
      {cards.map((card) => {
        const inner = (
          <>
            {card.image ? (
              <ImageBlockView src={card.image.src} alt="" fallbackSrc={card.image.fallbackSrc} />
            ) : null}
            <h2>{card.title}</h2>
          </>
        )
        return card.href ? (
          <a key={card.title} className="industri-card" href={card.href} target="_blank" rel="noreferrer">
            {inner}
          </a>
        ) : (
          <article key={card.title} className="industri-card">
            {inner}
          </article>
        )
      })}
    </div>
  )
}

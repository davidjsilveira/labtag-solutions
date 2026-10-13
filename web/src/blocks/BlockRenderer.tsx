import type { ReactNode } from 'react'
import type { ContentBlock } from '@/content/types'
import { BulletListBlockView } from './BulletListBlock'
import { CtaBlockView } from './CtaBlock'
import { FaqBlockView } from './FaqBlock'
import { FeatureGridBlockView } from './FeatureGridBlock'
import { ImageBlockView } from './ImageBlock'
import { NumberedStepsBlockView } from './NumberedStepsBlock'
import { QuoteBlockView } from './QuoteBlock'
import { SectionBlockView } from './SectionBlock'
import { TableBlockView } from './TableBlock'
import { TextBlockView } from './TextBlock'

type Props = {
  blocks: ContentBlock[]
}

function renderBlock(block: ContentBlock, index: number) {
  const key = `${block.type}-${index}`
  switch (block.type) {
    case 'image':
      return (
        <ImageBlockView
          key={key}
          src={block.src}
          alt={block.alt}
          fallbackSrc={block.fallbackSrc}
          variant={block.variant}
        />
      )
    case 'text':
      return <TextBlockView key={key} block={block} />
    case 'section':
      return <SectionBlockView key={key} block={block} />
    case 'bulletList':
      return <BulletListBlockView key={key} block={block} />
    case 'numberedSteps':
      return <NumberedStepsBlockView key={key} block={block} />
    case 'featureGrid':
      return <FeatureGridBlockView key={key} block={block} />
    case 'table':
      return <TableBlockView key={key} block={block} />
    case 'quote':
      return <QuoteBlockView key={key} block={block} />
    case 'faq':
      return <FaqBlockView key={key} block={block} />
    case 'cta':
      return <CtaBlockView key={key} block={block} />
    default:
      return null
  }
}

export function BlockRenderer({ blocks }: Props) {
  const nodes: ReactNode[] = []
  let i = 0
  while (i < blocks.length) {
    const block = blocks[i]
    if (block.type === 'image' && block.variant === 'gallery') {
      const gallery: ReactNode[] = []
      while (i < blocks.length) {
        const next = blocks[i]
        if (next.type !== 'image' || next.variant !== 'gallery') break
        gallery.push(renderBlock(next, i))
        i += 1
      }
      nodes.push(
        <div key={`gallery-${i}`} className="image-gallery">
          {gallery}
        </div>,
      )
      continue
    }
    nodes.push(renderBlock(block, i))
    i += 1
  }

  return <div className="block-stack">{nodes}</div>
}

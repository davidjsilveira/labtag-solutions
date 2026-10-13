import type { ReactNode } from 'react'
import type { ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { BulletListBlockView } from './BulletListBlock'
import { CtaBlockView } from './CtaBlock'
import { FaqBlockView } from './FaqBlock'
import { FeatureGridBlockView } from './FeatureGridBlock'
import { ImageBlockView } from './ImageBlock'
import { ImageSlider } from './ImageSlider'
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

function takeImages(blocks: ContentBlock[], start: number): { images: ImageBlock[]; next: number } {
  const images: ImageBlock[] = []
  let i = start
  while (i < blocks.length && blocks[i].type === 'image') {
    images.push(blocks[i] as ImageBlock)
    i += 1
  }
  return { images, next: i }
}

export function BlockRenderer({ blocks }: Props) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === 'section') {
      const { images, next: afterImages } = takeImages(blocks, i + 1)
      if (images.length) {
        let next = afterImages
        let paragraphs = [...block.paragraphs]
        let bullets: ContentBlock | undefined

        const following = blocks[next]
        if (following?.type === 'text') {
          paragraphs = [...paragraphs, ...following.paragraphs]
          next += 1
        }
        if (blocks[next]?.type === 'bulletList') {
          bullets = blocks[next]
          next += 1
        }

        const section: SectionBlock = {
          ...block,
          paragraphs,
        }

        const allLogos = images.every((image) => image.variant === 'logo')
        if (allLogos) {
          nodes.push(
            <div key={`logo-section-${i}`} className="logo-section">
              <SectionBlockView block={section} />
              {bullets?.type === 'bulletList' ? (
                <BulletListBlockView block={bullets} variant="plain" />
              ) : null}
              <ImageSlider images={images} />
            </div>,
          )
          i = next
          continue
        }

        nodes.push(
          <div key={`split-${i}`} className="content-split">
            <div className="content-split-copy">
              <SectionBlockView block={section} />
              {bullets?.type === 'bulletList' ? (
                <BulletListBlockView block={bullets} variant="plain" />
              ) : null}
            </div>
            <ImageSlider images={images} className="content-split-media" />
          </div>,
        )
        i = next
        continue
      }
    }

    if (block.type === 'image' && block.variant === 'gallery') {
      const { images, next } = takeImages(blocks, i)
      nodes.push(<ImageSlider key={`gallery-${i}`} images={images} className="image-gallery" />)
      i = next
      continue
    }

    nodes.push(renderBlock(block, i))
    i += 1
  }

  return <div className="block-stack">{nodes}</div>
}

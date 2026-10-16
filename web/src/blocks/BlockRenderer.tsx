import type { ReactNode } from 'react'
import { slugify } from '@/content/slugify'
import type {
  ContentBlock,
  FeatureGridBlock,
  ImageBlock,
  SectionBlock,
  VideoBlock,
} from '@/content/types'
import { BulletListBlockView } from './BulletListBlock'
import { ContentSplitActions } from './ContentSplitActions'
import { CtaBlockView } from './CtaBlock'
import { FaqBlockView } from './FaqBlock'
import { FeatureGridBlockView } from './FeatureGridBlock'
import { ImageBlockView } from './ImageBlock'
import { ImageSlider } from './ImageSlider'
import { NumberedStepsBlockView } from './NumberedStepsBlock'
import { QuoteBlockView } from './QuoteBlock'
import { SectionBlockView } from './SectionBlock'
import { SolutionQuickMenu } from './SolutionQuickMenu'
import { TableBlockView } from './TableBlock'
import { TextBlockView } from './TextBlock'
import { VideoBlockView } from './VideoBlock'

type Props = {
  blocks: ContentBlock[]
  /** Current solution page slug — used for shop/video destinations on split cards. */
  solutionSlug?: string
  /** Solution page title — shown on the right of the sticky jump menu. */
  solutionTitle?: string
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
    case 'video':
      return (
        <VideoBlockView key={key} src={block.src} alt={block.alt} fallbackSrc={block.fallbackSrc} />
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

function absorbFollowingCopy(
  blocks: ContentBlock[],
  start: number,
  section: SectionBlock,
): { section: SectionBlock; bullets?: ContentBlock; next: number } {
  let next = start
  let paragraphs = [...section.paragraphs]
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

  return {
    section: { ...section, paragraphs },
    bullets,
    next,
  }
}

function flushSplitGrid(nodes: ReactNode[], splits: ReactNode[], key: string) {
  if (!splits.length) return
  if (splits.length === 1) {
    nodes.push(splits[0])
    return
  }
  nodes.push(
    <div key={key} className="content-split-grid">
      {splits}
    </div>,
  )
}

/** Guide “By …” TOC rows that sit under the hero as a quick menu. */
function isGuideFeatureGrid(block: ContentBlock): block is FeatureGridBlock {
  return block.type === 'featureGrid' && Boolean(block.title && /^by\s+/i.test(block.title))
}

export function BlockRenderer({ blocks, solutionSlug, solutionTitle }: Props) {
  const nodes: ReactNode[] = []
  const pendingSplits: ReactNode[] = []
  let splitRunKey = 'split-grid-0'
  let i = 0

  const pushNonSplit = (node: ReactNode) => {
    flushSplitGrid(nodes, pendingSplits.splice(0, pendingSplits.length), splitRunKey)
    nodes.push(node)
  }

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === 'section') {
      const sectionAnchor = slugify(block.title)
      const following = blocks[i + 1]
      if (following?.type === 'video') {
        const video = following as VideoBlock
        const absorbed = absorbFollowingCopy(blocks, i + 2, block)
        if (!pendingSplits.length) splitRunKey = `split-grid-${i}`
        pendingSplits.push(
          <div key={`video-split-${i}`} id={sectionAnchor} className="content-split">
            <div className="content-split-copy">
              <SectionBlockView block={absorbed.section} withAnchor={false} />
              {absorbed.bullets?.type === 'bulletList' ? (
                <BulletListBlockView block={absorbed.bullets} variant="plain" />
              ) : null}
              <ContentSplitActions
                sectionSlug={sectionAnchor}
                sectionTitle={block.title}
                solutionSlug={solutionSlug}
              />
            </div>
            <VideoBlockView
              src={video.src}
              alt={video.alt}
              fallbackSrc={video.fallbackSrc}
              className="content-split-media"
            />
          </div>,
        )
        i = absorbed.next
        continue
      }

      const { images, next: afterImages } = takeImages(blocks, i + 1)
      if (images.length) {
        const absorbed = absorbFollowingCopy(blocks, afterImages, block)
        const allLogos = images.every((image) => image.variant === 'logo')
        if (allLogos) {
          pushNonSplit(
            <div key={`logo-section-${i}`} id={sectionAnchor} className="logo-section">
              <SectionBlockView block={absorbed.section} withAnchor={false} />
              {absorbed.bullets?.type === 'bulletList' ? (
                <BulletListBlockView block={absorbed.bullets} variant="plain" />
              ) : null}
              <ImageSlider images={images} />
            </div>,
          )
          i = absorbed.next
          continue
        }

        if (!pendingSplits.length) splitRunKey = `split-grid-${i}`
        pendingSplits.push(
          <div key={`split-${i}`} id={sectionAnchor} className="content-split">
            <div className="content-split-copy">
              <SectionBlockView block={absorbed.section} withAnchor={false} />
              {absorbed.bullets?.type === 'bulletList' ? (
                <BulletListBlockView block={absorbed.bullets} variant="plain" />
              ) : null}
              <ContentSplitActions
                sectionSlug={sectionAnchor}
                sectionTitle={block.title}
                solutionSlug={solutionSlug}
              />
            </div>
            <ImageSlider images={images} className="content-split-media" />
          </div>,
        )
        i = absorbed.next
        continue
      }

      // Title-only heading with following copy (no media): keep them in one unit
      // so block-stack gap does not sit between the heading and its intro.
      const absorbed = absorbFollowingCopy(blocks, i + 1, block)
      if (absorbed.next > i + 1) {
        pushNonSplit(
          <div key={`section-copy-${i}`} id={sectionAnchor} className="block section-unit">
            <SectionBlockView block={absorbed.section} withAnchor={false} />
            {absorbed.bullets?.type === 'bulletList' ? (
              <BulletListBlockView block={absorbed.bullets} variant="plain" />
            ) : null}
          </div>,
        )
        i = absorbed.next
        continue
      }
    }

    if (block.type === 'image' && block.variant === 'gallery') {
      const { images, next } = takeImages(blocks, i)
      pushNonSplit(<ImageSlider key={`gallery-${i}`} images={images} className="image-gallery" />)
      i = next
      continue
    }

    if (isGuideFeatureGrid(block)) {
      const jumpNodes: ReactNode[] = []
      const start = i
      while (i < blocks.length && isGuideFeatureGrid(blocks[i])) {
        jumpNodes.push(renderBlock(blocks[i], i))
        i += 1
      }
      pushNonSplit(
        <SolutionQuickMenu key={`quick-menu-${start}`} title={solutionTitle}>
          {jumpNodes}
        </SolutionQuickMenu>,
      )
      continue
    }

    pushNonSplit(renderBlock(block, i))
    i += 1
  }

  flushSplitGrid(nodes, pendingSplits, splitRunKey)

  return <div className="block-stack">{nodes}</div>
}

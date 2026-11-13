import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  autoclaveHasProductSection,
  biobankHasProductSection,
  biobankResourceAction,
  biobankTileHref,
  cannabisHasProductSection,
  chemicalHasProductSection,
  histologyHasProductSection,
} from '@/content/splitActions'
import { slugify } from '@/content/slugify'
import type {
  ContentBlock,
  CtaBlock,
  FeatureGridBlock,
  ImageBlock,
  SectionBlock,
  VideoBlock,
} from '@/content/types'
import { BulletListBlockView } from './BulletListBlock'
import { AutomatedLayout } from './AutomatedLayout'
import { ChemicalLayout } from './ChemicalLayout'
import { ClinicalLayout } from './ClinicalLayout'
import { CovidLayout } from './CovidLayout'
import { CryogenicLayout } from './CryogenicLayout'
import { CryostuckLayout } from './CryostuckLayout'
import { ResitagLayout } from './ResitagLayout'
import { CustomLayout } from './CustomLayout'
import { DeepFreezeLayout } from './DeepFreezeLayout'
import { DymoLayout } from './DymoLayout'
import { GatorcutLayout } from './GatorcutLayout'
import { HardStickLayout } from './HardStickLayout'
import { HistologyLayout } from './HistologyLayout'
import { IndustrialLayout } from './IndustrialLayout'
import { IvfLayout } from './IvfLayout'
import { LabelPrintingLayout } from './LabelPrintingLayout'
import { LabelSoftwareLayout } from './LabelSoftwareLayout'
import { LaboratoryLayout } from './LaboratoryLayout'
import { LabTapesLayout } from './LabTapesLayout'
import { PcrLayout } from './PcrLayout'
import { PreLabeledLayout } from './PreLabeledLayout'
import { RfidLayout } from './RfidLayout'
import { VaccineLayout } from './VaccineLayout'
import { XyleneLayout } from './XyleneLayout'
import { SlideOverLayout } from './SlideOverLayout'
import { SnappeelLayout } from './SnappeelLayout'
import { AutoclaveCaseStudy, AutoclaveContact, AutoclaveGuide } from './AutoclaveSections'
import { ContentSplitActions } from './ContentSplitActions'
import { CtaBlockView } from './CtaBlock'
import { FaqBlockView } from './FaqBlock'
import { FeatureGridBlockView } from './FeatureGridBlock'
import { ImageBlockView } from './ImageBlock'
import { IsoBanner } from './IsoBanner'
import { SampleBanner } from './SampleBanner'
import { ImageSlider } from './ImageSlider'
import { NumberedStepsBlockView } from './NumberedStepsBlock'
import { QuoteBlockView } from './QuoteBlock'
import { SectionBlockView } from './SectionBlock'
import { TableBlockView } from './TableBlock'
import { TextBlockView } from './TextBlock'
import { VideoBlockView } from './VideoBlock'

type Props = {
  blocks: ContentBlock[]
  /** Current solution page slug — used for shop/video destinations on split cards. */
  solutionSlug?: string
  variant?: 'catalog' | 'archive'
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

type CatalogLayout = 'spec' | 'prose' | 'stack' | 'band'

function catalogLayoutFor(
  absorbed: { section: SectionBlock; bullets?: ContentBlock },
  hasMedia: boolean,
): CatalogLayout {
  const hasBullets = absorbed.bullets?.type === 'bulletList'
  if (!hasMedia) return hasBullets ? 'band' : 'prose'
  if (!hasBullets) return 'prose'
  if (absorbed.section.paragraphs.length >= 2) return 'stack'
  return 'spec'
}

function catalogSection(
  key: string,
  absorbed: {
    section: SectionBlock
    bullets?: ContentBlock
  },
  media: ReactNode | null,
  layout: CatalogLayout,
) {
  const className =
    layout === 'band'
      ? 'catalog-band'
      : layout === 'spec'
        ? 'catalog-split'
        : `catalog-split is-${layout}`

  return (
    <section key={key} className={className}>
      <div className="block catalog-split-copy">
        <div className="catalog-split-prose">
          <h2>{absorbed.section.title}</h2>
          {absorbed.section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        {absorbed.bullets?.type === 'bulletList' ? (
          <BulletListBlockView block={absorbed.bullets} variant="plain" />
        ) : null}
      </div>
      {media}
    </section>
  )
}

function AnimalSample({ cta }: { cta: CtaBlock }) {
  return (
    <SampleBanner
      title={cta.title}
      body={cta.body}
      href={cta.actionHref?.trim() || '/samples'}
      label={cta.actionLabel?.trim() || 'Order Free Samples Now'}
    />
  )
}

export function BlockRenderer({ blocks, solutionSlug, variant }: Props) {
  const catalog = variant === 'catalog'
  if (solutionSlug === 'automated-labels' && !catalog) {
    return (
      <div className="block-stack">
        <AutomatedLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'chemical-container-labeling' && !catalog) {
    return (
      <div className="block-stack">
        <ChemicalLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'clinical-trial-labels' && !catalog) {
    return (
      <div className="block-stack">
        <ClinicalLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'covid-19-laboratory-labels' && !catalog) {
    return (
      <div className="block-stack">
        <CovidLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'histology-labels' && !catalog) {
    return (
      <div className="block-stack">
        <HistologyLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'labels-for-hard-to-stick-surfaces' && !catalog) {
    return (
      <div className="block-stack">
        <HardStickLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'industrial-labels' && !catalog) {
    return (
      <div className="block-stack">
        <IndustrialLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'ivf-labeling-solutions' && !catalog) {
    return (
      <div className="block-stack">
        <IvfLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'label-printing-solutions' && !catalog) {
    return (
      <div className="block-stack">
        <LabelPrintingLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'label-software' && !catalog) {
    return (
      <div className="block-stack">
        <LabelSoftwareLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'laboratory-labels' && !catalog) {
    return (
      <div className="block-stack">
        <LaboratoryLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'lab-tapes' && !catalog) {
    return (
      <div className="block-stack">
        <LabTapesLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'pcr-labels-and-tags' && !catalog) {
    return (
      <div className="block-stack">
        <PcrLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'pre-labeled-labware' && !catalog) {
    return (
      <div className="block-stack">
        <PreLabeledLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'rfid-labels-tags' && !catalog) {
    return (
      <div className="block-stack">
        <RfidLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'vaccine-labels' && !catalog) {
    return (
      <div className="block-stack">
        <VaccineLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'xylene-chemical-resistant-labels' && !catalog) {
    return (
      <div className="block-stack">
        <XyleneLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'microscope-slide-over-labeling' && !catalog) {
    return (
      <div className="block-stack">
        <SlideOverLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'snappeel-2' && !catalog) {
    return (
      <div className="block-stack">
        <SnappeelLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'gatorcut' && !catalog) {
    return (
      <div className="block-stack">
        <GatorcutLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'dymo-compatible-laboratory-labels' && !catalog) {
    return (
      <div className="block-stack">
        <DymoLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'deep-freeze' && !catalog) {
    return (
      <div className="block-stack">
        <DeepFreezeLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'custom-laboratory-labels' && !catalog) {
    return (
      <div className="block-stack">
        <CustomLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'cryogenic-labels' && !catalog) {
    return (
      <div className="block-stack">
        <CryogenicLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'cryostuck' && !catalog) {
    return (
      <div className="block-stack">
        <CryostuckLayout blocks={blocks} />
      </div>
    )
  }
  if (solutionSlug === 'resitag-2' && !catalog) {
    return (
      <div className="block-stack">
        <ResitagLayout blocks={blocks} />
      </div>
    )
  }
  const varyCatalog = catalog && solutionSlug === 'cryogenic'
  const showSplitActions = !catalog
  const nodes: ReactNode[] = []
  const pendingSplits: ReactNode[] = []
  let splitRunKey = 'split-grid-0'
  let animalRow = 0
  let cannabisRow = 0
  let i = 0

  const pushNonSplit = (node: ReactNode) => {
    flushSplitGrid(nodes, pendingSplits.splice(0, pendingSplits.length), splitRunKey)
    nodes.push(node)
  }

  while (i < blocks.length) {
    const block = blocks[i]

    if (catalog && isGuideFeatureGrid(block)) {
      i += 1
      while (i < blocks.length && isGuideFeatureGrid(blocks[i])) i += 1
      continue
    }

    if (block.type === 'section') {
      if (solutionSlug === 'biobanking-labels' && slugify(block.title) === 'try-before-you-buy') {
        const { next: afterImages } = takeImages(blocks, i + 1)
        const action = biobankResourceAction('try-before-you-buy')
        pushNonSplit(
          <SampleBanner
            key={`biobank-sample-${i}`}
            title={block.title}
            href={action?.href ?? 'https://www.labtag.com/cryogenic-sample-kit'}
            label={action?.label ?? 'Order Free Samples'}
          />,
        )
        i = afterImages
        continue
      }

      if (solutionSlug === 'biobanking-labels' && slugify(block.title) === 'view-all-cryogenic-labels') {
        pushNonSplit(
          <p key={`biobank-all-${i}`} className="biobank-more">
            <Link className="btn btn-primary" to="/solutions/cryogenic-labels">
              View All Cryogenic Labels
            </Link>
          </p>,
        )
        i += 1
        continue
      }

      if (solutionSlug === 'autoclave-labels' && /^get in touch$/i.test(block.title)) {
        pushNonSplit(
          <AutoclaveContact key={`autoclave-contact-${i}`} body={block.paragraphs[0] ?? ''} />,
        )
        i += 1
        continue
      }
      const sectionAnchor = catalog ? undefined : slugify(block.title)
      const following = blocks[i + 1]
      if (following?.type === 'video') {
        const video = following as VideoBlock
        const absorbed = absorbFollowingCopy(blocks, i + 2, block)
        if (catalog) {
          const layout = varyCatalog ? catalogLayoutFor(absorbed, true) : 'spec'
          pushNonSplit(
            catalogSection(
              `catalog-video-${i}`,
              absorbed,
              <VideoBlockView
                src={video.src}
                alt={video.alt}
                fallbackSrc={video.fallbackSrc}
                className="catalog-figure"
              />,
              layout,
            ),
          )
          i = absorbed.next
          continue
        }
        if (!pendingSplits.length) splitRunKey = `split-grid-${i}`
        pendingSplits.push(
          <div key={`video-split-${i}`} id={sectionAnchor} className="content-split">
            <div className="content-split-copy">
              <SectionBlockView block={absorbed.section} withAnchor={false} />
              {absorbed.bullets?.type === 'bulletList' ? (
                <BulletListBlockView block={absorbed.bullets} variant="plain" />
              ) : null}
              {showSplitActions && sectionAnchor ? (
                <ContentSplitActions
                  sectionSlug={sectionAnchor}
                  sectionTitle={block.title}
                  solutionSlug={solutionSlug}
                />
              ) : null}
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
      const separateGallery = solutionSlug === 'clinical-trial-labels' && images.length > 1
      if (images.length && !separateGallery) {
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

        if (catalog) {
          const layout = varyCatalog ? catalogLayoutFor(absorbed, true) : 'spec'
          pushNonSplit(
            catalogSection(
              `catalog-section-${i}`,
              absorbed,
              <ImageSlider images={images} className="catalog-figure" />,
              layout,
            ),
          )
          i = absorbed.next
          continue
        }

        if (solutionSlug === 'animal-healthcare') {
          const flip = animalRow % 2 === 1
          animalRow += 1
          pushNonSplit(
            <section
              key={`animal-row-${i}`}
              id={sectionAnchor}
              className={`animal-row${flip ? ' is-flip' : ''}`}
            >
              <div className="animal-row-media">
                <ImageSlider images={images} />
              </div>
              <div className="animal-row-copy">
                <SectionBlockView block={absorbed.section} withAnchor={false} />
                {absorbed.bullets?.type === 'bulletList' ? (
                  <BulletListBlockView block={absorbed.bullets} variant="plain" />
                ) : null}
                {sectionAnchor ? (
                  <ContentSplitActions
                    sectionSlug={sectionAnchor}
                    sectionTitle={block.title}
                    solutionSlug={solutionSlug}
                  />
                ) : null}
              </div>
            </section>,
          )
          i = absorbed.next
          continue
        }

        if (solutionSlug === 'autoclave-labels' && sectionAnchor === 'autoclave-resistant-label-guide') {
          pushNonSplit(
            <AutoclaveGuide key={`autoclave-guide-${i}`} section={absorbed.section} images={images} />,
          )
          i = absorbed.next
          continue
        }

        if (solutionSlug === 'autoclave-labels' && /printparts/i.test(block.title)) {
          pushNonSplit(
            <AutoclaveCaseStudy key={`autoclave-case-${i}`} section={absorbed.section} images={images} />,
          )
          i = absorbed.next
          continue
        }

        const showActions =
          showSplitActions &&
          Boolean(sectionAnchor) &&
          solutionSlug !== 'automated-labels' &&
          (solutionSlug !== 'autoclave-labels' ||
            autoclaveHasProductSection(sectionAnchor ?? '')) &&
          (solutionSlug !== 'biobanking-labels' ||
            biobankHasProductSection(sectionAnchor ?? '')) &&
          (solutionSlug !== 'cannabis-labels' ||
            cannabisHasProductSection(sectionAnchor ?? '')) &&
          (solutionSlug !== 'chemical-container-labeling' ||
            chemicalHasProductSection(sectionAnchor ?? '')) &&
          solutionSlug !== 'covid-19-laboratory-labels' &&
          solutionSlug !== 'custom-laboratory-labels' &&
          (solutionSlug !== 'histology-labels' ||
            histologyHasProductSection(sectionAnchor ?? ''))
        const biobankResource =
          solutionSlug === 'biobanking-labels' && sectionAnchor
            ? biobankResourceAction(sectionAnchor)
            : undefined
        const biobankTile =
          solutionSlug === 'biobanking-labels' && sectionAnchor
            ? biobankTileHref(sectionAnchor)
            : undefined
        const media = <ImageSlider images={images} className="content-split-media" />
        const mediaFirst =
          solutionSlug === 'cannabis-labels' &&
          absorbed.bullets?.type === 'bulletList' &&
          cannabisRow++ % 2 === 0
        const split = (
          <div
            key={`split-${i}`}
            id={sectionAnchor}
            className={`content-split${mediaFirst ? ' is-media-first' : ''}`}
          >
            <div className="content-split-copy">
              <SectionBlockView block={absorbed.section} withAnchor={false} />
              {absorbed.bullets?.type === 'bulletList' ? (
                <BulletListBlockView block={absorbed.bullets} variant="plain" />
              ) : null}
              {showActions && sectionAnchor ? (
                <ContentSplitActions
                  sectionSlug={sectionAnchor}
                  sectionTitle={block.title}
                  solutionSlug={solutionSlug}
                />
              ) : null}
              {biobankResource ? (
                <div className="content-split-actions">
                  <a
                    className="btn btn-primary"
                    href={biobankResource.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {biobankResource.label}
                  </a>
                </div>
              ) : null}
            </div>
            {biobankTile ? (
              <Link className="biobank-tile-link" to={biobankTile}>
                {media}
              </Link>
            ) : (
              media
            )}
          </div>
        )
        const cannabisBulletRow =
          solutionSlug === 'cannabis-labels' && absorbed.bullets?.type === 'bulletList'
        if (
          solutionSlug === 'autoclave-labels' ||
          solutionSlug === 'automated-labels' ||
          cannabisBulletRow
        ) {
          pushNonSplit(split)
        } else {
          if (!pendingSplits.length) splitRunKey = `split-grid-${i}`
          pendingSplits.push(split)
        }
        i = absorbed.next
        continue
      }

      // Title-only heading with following copy (no media): keep them in one unit
      // so block-stack gap does not sit between the heading and its body.
      const absorbed = absorbFollowingCopy(blocks, i + 1, block)
      if (absorbed.next > i + 1) {
        if (catalog) {
          const layout = varyCatalog ? catalogLayoutFor(absorbed, false) : 'band'
          pushNonSplit(catalogSection(`catalog-copy-${i}`, absorbed, null, layout))
          i = absorbed.next
          continue
        }
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

      // Group headings (##): empty, or a short lead followed by ### product rows.
      if (catalog) {
        const childSection = following?.type === 'section' ? (following as SectionBlock) : null
        const isGroupHeading = (block.level ?? 2) < 3
        const leadsIntoProducts = Boolean(
          isGroupHeading && childSection && (childSection.level ?? 2) >= 3,
        )
        if (isGroupHeading && (block.paragraphs.length === 0 || leadsIntoProducts)) {
          pushNonSplit(
            <header key={`catalog-heading-${i}`} className="catalog-heading">
              <h2>{block.title}</h2>
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="catalog-heading-lead">
                  {paragraph}
                </p>
              ))}
            </header>,
          )
          i += 1
          continue
        }

        // Standalone copy section with no media (e.g. accessories blurb).
        pushNonSplit(
          catalogSection(
            `catalog-copy-solo-${i}`,
            { section: block },
            null,
            'band',
          ),
        )
        i += 1
        continue
      }
    }

    if (block.type === 'image') {
      const next = blocks[i + 1]
      const after = blocks[i + 2]
      if (solutionSlug === 'animal-healthcare' && next?.type === 'cta') {
        pushNonSplit(<AnimalSample key={`animal-sample-${i}`} cta={next} />)
        i += 2
        continue
      }
      if (next?.type === 'section' && after?.type === 'section' && /^iso\b/i.test(next.title)) {
        pushNonSplit(<IsoBanner key={`iso-banner-${i}`} />)
        i += 3
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
      while (i < blocks.length && isGuideFeatureGrid(blocks[i])) i += 1
      continue
    }

    pushNonSplit(renderBlock(block, i))
    i += 1
  }

  flushSplitGrid(nodes, pendingSplits, splitRunKey)

  return <div className="block-stack">{nodes}</div>
}

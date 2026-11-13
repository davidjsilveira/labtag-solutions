import type { ReactNode } from 'react'
import type { ContentBlock, CtaBlock, ImageBlock, SectionBlock, VideoBlock } from '@/content/types'
import { CtaBlockView } from './CtaBlock'
import { ImageBlockView } from './ImageBlock'
import { RichText } from './RichText'
import { VideoBlockView } from './VideoBlock'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

function asSection(block: ContentBlock | undefined): SectionBlock | null {
  return block?.type === 'section' ? block : null
}

function asImage(block: ContentBlock | undefined): ImageBlock | null {
  return block?.type === 'image' ? block : null
}

function asVideo(block: ContentBlock | undefined): VideoBlock | null {
  return block?.type === 'video' ? block : null
}

function StepCard({ section, image }: { section: SectionBlock; image: ImageBlock }) {
  const match = section.title.match(/^(\d+)\.\s+(.+)$/)
  return (
    <article className="snap-step">
      <ImageBlockView src={image.src} alt="" fallbackSrc={image.fallbackSrc} />
      <h3>
        {match ? <span className="snap-step-num">{match[1]}</span> : null}
        <span>{match ? match[2] : section.title}</span>
      </h3>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph}>
          <RichText text={paragraph} />
        </p>
      ))}
    </article>
  )
}

function shopLink(section: SectionBlock | null) {
  const paragraph = section?.paragraphs.find((item) => LINK_ONLY.test(item.trim()))
  const match = paragraph?.trim().match(LINK_ONLY)
  return match ? { label: match[1], href: match[2] } : null
}

function BenefitIcon({ title }: { title: string }) {
  const name = title.toLowerCase()
  if (name === 'precision') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      </svg>
    )
  }
  if (name === 'efficiency') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M12 7.25V12l3.25 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (name === 'visibility') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M2.5 12S6.2 6.75 12 6.75 21.5 12 21.5 12 17.8 17.25 12 17.25 2.5 12 2.5 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    )
  }
  return null
}

export function SnappeelLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]
    if (block.type === 'cta') {
      nodes.push(<CtaBlockView key={block.title} block={block as CtaBlock} />)
      i += 1
      continue
    }

    const section = asSection(block)
    if (!section) {
      i += 1
      continue
    }

    if (section.title === 'The Technology') {
      const what = asSection(blocks[i + 1])
      const video = asVideo(blocks[i + 2]) ?? asVideo(blocks[i + 1])
      let p = i + 1
      if (what) p += 1
      if (video) p += 1
      const process = asSection(blocks[p])
      const withProcess = process?.title === 'The Process'
      const lead = withProcess ? asSection(blocks[p + 1]) : null
      const steps: { section: SectionBlock; image: ImageBlock }[] = []
      let j = withProcess ? p + 2 : p
      if (withProcess) {
        while (asSection(blocks[j]) && asImage(blocks[j + 1])) {
          steps.push({ section: asSection(blocks[j])!, image: asImage(blocks[j + 1])! })
          j += 2
        }
      }
      nodes.push(
        <section key="technology" className="snap-story">
          <div className="snap-story-lead">
            <div className="snap-copy">
              <p className="snap-kicker">{section.title}</p>
              {what ? <h2>{what.title}</h2> : null}
              {what?.paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
            {video ? (
              <div className="snap-tech-media">
                <VideoBlockView src={video.src} alt="" fallbackSrc={video.fallbackSrc} />
              </div>
            ) : null}
          </div>
          {withProcess ? (
            <div className="snap-head">
              <p className="snap-kicker">{process.title}</p>
              {lead ? <h2>{lead.title}</h2> : null}
              {lead?.paragraphs.map((paragraph) => (
                <p key={paragraph} className="snap-intro">
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
          ) : null}
          {steps.length ? (
            <div className="snap-steps">
              {steps.map((step) => (
                <StepCard key={step.section.title} section={step.section} image={step.image} />
              ))}
            </div>
          ) : null}
        </section>,
      )
      i = j
      continue
    }

    if (section.title === 'The Process') {
      const lead = asSection(blocks[i + 1])
      const steps: { section: SectionBlock; image: ImageBlock }[] = []
      let j = i + 2
      while (asSection(blocks[j]) && asImage(blocks[j + 1])) {
        steps.push({ section: asSection(blocks[j])!, image: asImage(blocks[j + 1])! })
        j += 2
      }
      nodes.push(
        <section key="process" className="snap-band snap-process">
          <div className="snap-head">
            <p className="snap-kicker">{section.title}</p>
            {lead ? <h2>{lead.title}</h2> : null}
            {lead?.paragraphs.map((paragraph) => (
              <p key={paragraph} className="snap-intro">
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
          <div className="snap-steps">
            {steps.map((step) => (
              <StepCard key={step.section.title} section={step.section} image={step.image} />
            ))}
          </div>
        </section>,
      )
      i = j
      continue
    }

    if (section.title === 'The Benefits') {
      const lead = asSection(blocks[i + 1])
      const cards: SectionBlock[] = []
      let j = i + 2
      while (asSection(blocks[j])?.level === 3) {
        cards.push(asSection(blocks[j])!)
        j += 1
      }
      nodes.push(
        <section key="benefits" className="snap-band">
          <div className="snap-head">
            <p className="snap-kicker">{section.title}</p>
            {lead ? <h2>{lead.title}</h2> : null}
          </div>
          <div className="snap-benefits">
            {cards.map((card) => (
              <article key={card.title} className="snap-benefit">
                <div className="snap-benefit-title">
                  <BenefitIcon title={card.title} />
                  <h3>{card.title}</h3>
                </div>
                {card.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>,
      )
      i = j
      continue
    }

    if (section.title === 'The Products') {
      const lead = asSection(blocks[i + 1])
      const materials: SectionBlock[] = []
      let j = i + 2
      while (asSection(blocks[j])) {
        materials.push(asSection(blocks[j])!)
        j += 1
      }
      const shop = shopLink(section)
      nodes.push(
        <section key="products" className="snap-band">
          <div className="snap-products-head">
            <div className="snap-head">
              <p className="snap-kicker">{section.title}</p>
              {lead ? <h2>{lead.title}</h2> : null}
            </div>
            {shop ? (
              <a className="btn btn-primary" href={shop.href} target="_blank" rel="noreferrer">
                {shop.label}
              </a>
            ) : null}
          </div>
          <div className="snap-materials">
            {materials.map((material) => (
              <article key={material.title} className="snap-material">
                <h3>{material.title}</h3>
                {material.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>,
      )
      i = j
      continue
    }

    i += 1
  }

  return <div className="snap-layout">{nodes}</div>
}

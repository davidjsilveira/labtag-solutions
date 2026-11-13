import { resolveImageSrc } from '@/content/resolveImage'
import type {
  BulletListBlock,
  ContentBlock,
  ImageBlock,
  QuoteBlock,
  SectionBlock,
  TextBlock,
} from '@/content/types'
import { RichText } from './RichText'

const LINK_ONLY = /^\[([^\]]+)\]\(([^)]+)\)$/

function findImage(images: ImageBlock[], needle: string) {
  return images.find(
    (image) => image.src.includes(needle) || (image.fallbackSrc ?? '').includes(needle),
  )
}

function sectionNamed(sections: SectionBlock[], pattern: RegExp) {
  return sections.find((section) => pattern.test(section.title))
}

function linkFrom(paragraphs: string[]) {
  const paragraph = paragraphs.find((item) => LINK_ONLY.test(item.trim()))
  const match = paragraph?.trim().match(LINK_ONLY)
  return match ? { label: match[1], href: match[2] } : null
}

function prose(paragraphs: string[]) {
  return paragraphs.filter((item) => item.trim() !== 'OR' && !LINK_ONLY.test(item.trim()))
}

function Photo({
  image,
  className,
  alt = '',
}: {
  image?: ImageBlock
  className?: string
  alt?: string
}) {
  if (!image) return null
  const resolved = resolveImageSrc(image.src, image.fallbackSrc)
  return (
    <img
      className={className}
      src={resolved.primary}
      alt={alt}
      onError={(event) => {
        if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
          event.currentTarget.src = resolved.fallback
        }
      }}
    />
  )
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M4.2 10.4 8 14.2 15.8 5.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PathCard({ section, image }: { section?: SectionBlock; image?: ImageBlock }) {
  if (!section) return null
  return (
    <article className="prelab-path">
      <Photo image={image} />
      <h3>{section.title}</h3>
      {prose(section.paragraphs).map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>
          <RichText text={paragraph} />
        </p>
      ))}
    </article>
  )
}

export function PreLabeledLayout({ blocks }: { blocks: ContentBlock[] }) {
  const images = blocks.filter((block): block is ImageBlock => block.type === 'image')
  const sections = blocks.filter((block): block is SectionBlock => block.type === 'section')
  const quote = blocks.find((block): block is QuoteBlock => block.type === 'quote')
  const study = blocks.find((block): block is TextBlock => block.type === 'text')
  const bullets = blocks.find((block): block is BulletListBlock => block.type === 'bulletList')
  const personalized = sectionNamed(sections, /personalized to your exact needs/i)
  const hands = sectionNamed(sections, /hands-off and stress-free/i)
  const designed = sectionNamed(sections, /designed to simplify/i)
  const send = sectionNamed(sections, /send us your labware/i)
  const procure = sectionNamed(sections, /procure the labware/i)
  const schedule = sectionNamed(sections, /schedule a meeting/i)
  const consult = schedule ? linkFrom(schedule.paragraphs) : null
  const banner = findImage(images, 'PCRJTT')
  const bannerSrc = banner ? resolveImageSrc(banner.src, banner.fallbackSrc).primary : undefined

  return (
    <div className="prelab">
      {quote ? (
        <section className="prelab-quote">
          <Photo image={findImage(images, 'Stars')} className="prelab-stars" />
          <blockquote>
            <p>"{quote.text}"</p>
          </blockquote>
          <div className="prelab-quote-meta">
            {quote.attribution ? <p className="prelab-quote-by">{quote.attribution}</p> : null}
            <Photo image={findImage(images, 'Harvard')} className="prelab-harvard" alt="Harvard Medical School" />
          </div>
          {study ? (
            <div className="prelab-quote-note">
              {study.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="prelab-needs">
        <Photo image={findImage(images, 'Kitting-Service-1')} className="prelab-needs-photo" />
        <div className="prelab-needs-copy">
          {personalized ? <h2>{personalized.title}</h2> : null}
          {bullets ? (
            <ul>
              {bullets.items.map((item) => (
                <li key={item}>
                  <span className="prelab-check">
                    <Check />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="prelab-paths">
        <div className="prelab-paths-intro">
          {hands ? <h2>{hands.title}</h2> : null}
          {designed ? <h3 className="prelab-lede">{designed.title}</h3> : null}
        </div>
        <div className="prelab-choice">
          <PathCard section={send} image={findImage(images, 'Shipping-Truck')} />
          <p className="prelab-or">OR</p>
          <PathCard section={procure} image={findImage(images, 'Shipping-Box')} />
        </div>
      </section>

      {schedule ? (
        <section
          className="prelab-banner"
          style={
            bannerSrc
              ? {
                  backgroundImage: `linear-gradient(90deg, #2b1854 0%, color-mix(in srgb, #351f65 88%, transparent) 34%, color-mix(in srgb, #351f65 42%, transparent) 62%, color-mix(in srgb, #351f65 8%, transparent) 100%), url("${bannerSrc}")`,
                }
              : undefined
          }
        >
          <h2>{schedule.title}</h2>
          {consult ? (
            <a className="btn btn-primary" href={consult.href} target="_blank" rel="noreferrer">
              {consult.label}
            </a>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}

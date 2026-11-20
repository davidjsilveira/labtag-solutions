import type { ImageBlock, SectionBlock } from '@/content/types'
import { ImageSlider } from './ImageSlider'
import { SampleBanner } from './SampleBanner'

const LINK = /\[([^\]]+)\]\(([^)]+)\)/

export function paragraphLink(paragraphs: string[]): { label: string; href: string } | undefined {
  for (const paragraph of paragraphs) {
    const match = paragraph.match(LINK)
    if (match) return { label: match[1], href: match[2].trim() }
  }
  return undefined
}

export function proseParagraphs(paragraphs: string[]): string[] {
  return paragraphs.filter((paragraph) => !LINK.test(paragraph))
}

export function AutoclaveGuide({
  section,
  images,
}: {
  section: SectionBlock
  images: ImageBlock[]
}) {
  const action = paragraphLink(section.paragraphs)
  return (
    <section className="guide-banner" id="autoclave-resistant-label-guide">
      <div className="guide-banner-media">
        <ImageSlider images={images} />
      </div>
      <div className="guide-banner-copy">
        <h2>{section.title}</h2>
        {proseParagraphs(section.paragraphs).map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        {action ? (
          <a className="btn btn-primary" href={action.href} target="_blank" rel="noreferrer">
            {action.label}
          </a>
        ) : null}
      </div>
    </section>
  )
}

export function AutoclaveContact({ body }: { body: string }) {
  return (
    <SampleBanner
      id="get-in-touch"
      title="Get in Touch"
      body={body}
      href="/samples"
      label="Order Free Samples"
    />
  )
}

export function AutoclaveCaseStudy({
  section,
  images,
}: {
  section: SectionBlock
  images: ImageBlock[]
}) {
  const action = paragraphLink(section.paragraphs)
  return (
    <section className="autoclave-case" id="case-study">
      <div className="autoclave-case-media">
        <ImageSlider images={images} />
      </div>
      <div className="autoclave-case-copy">
        <p className="autoclave-case-kicker">Case Study</p>
        <h2>{section.title}</h2>
        {proseParagraphs(section.paragraphs).map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        {action ? (
          <a className="btn btn-primary" href={action.href} target="_blank" rel="noreferrer">
            {action.label}
          </a>
        ) : null}
      </div>
    </section>
  )
}

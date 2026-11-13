import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motionIndex, usePageMotion } from '@/hooks/usePageMotion'
import { SolutionCarousel } from '@/components/SolutionCarousel'
import { TemperatureSlider } from '@/components/TemperatureSlider'
import { pagesForBrowseAll } from '@/content/categories'
import { CONTACT_PATH, LABTAG_SHOP_URL, SAMPLE_PATH } from '@/content/labtagLinks'
import { getPage } from '@/content/loadPages'
import { previewImage } from '@/content/previewImage'
import { resolveImageSrc } from '@/content/resolveImage'
import type { SolutionPage } from '@/content/types'

const FEATURED_BENTO = [
  { slug: 'cryogenic-labels', layout: 'feature' },
  { slug: 'clinical-trial-labels', layout: 'caption' },
  { slug: 'histology-labels', layout: 'caption' },
  { slug: 'lab-tapes', layout: 'caption' },
  { slug: 'dymo-compatible-laboratory-labels', layout: 'caption' },
  { slug: 'label-printing-solutions', layout: 'caption' },
  { slug: 'automated-labels', layout: 'caption' },
] as const

function FeaturedCard({
  page,
  layout,
  priority,
}: {
  page: SolutionPage
  layout: (typeof FEATURED_BENTO)[number]['layout']
  priority?: boolean
}) {
  const image = previewImage(page)
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null
  const showExcerpt = layout === 'feature' || layout === 'caption'

  return (
    <Link to={`/solutions/${page.slug}`} className="lander-new-link motion-sheen-wrap">
      {resolved ? (
        <img
          className="lander-new-media"
          src={resolved.primary}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={(event) => {
            if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
              event.currentTarget.src = resolved.fallback
            }
          }}
        />
      ) : (
        <span className="lander-new-media lander-new-media-empty" aria-hidden="true" />
      )}
      <span className="lander-new-copy">
        <strong>{page.title}</strong>
        {showExcerpt && page.excerpt ? <span>{page.excerpt}</span> : null}
      </span>
    </Link>
  )
}

export function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const articles = pagesForBrowseAll()
  usePageMotion(rootRef)

  return (
    <div className="home lander" ref={rootRef}>
      <header className="page-hero" data-motion-hero>
        <div className="page-hero-copy">
          <h1 data-motion="hero" style={motionIndex(0)}>
            Labels & Identification Solutions
          </h1>
          <div className="page-hero-description" data-motion="hero" style={motionIndex(1)}>
            <p>
              Identify, track, and store every sample with labels built for the temperatures,
              chemicals, and workflows your research demands.
            </p>
          </div>
          <div className="page-hero-actions" data-motion="hero" style={motionIndex(2)}>
            <Link className="btn btn-primary" to={CONTACT_PATH}>
              Chat with an expert
            </Link>
            <Link className="btn btn-secondary" to={SAMPLE_PATH}>
              Get Free Samples
            </Link>
          </div>
        </div>
      </header>

      <section
        className="lander-index lander-new"
        aria-label="Featured solutions"
        id="new-articles"
        data-motion-section
      >
        <ul className="lander-new-list">
          {FEATURED_BENTO.map((item, index) => {
            const page = getPage(item.slug)
            if (!page) return null
            return (
              <li key={page.slug} className={`is-${item.layout}`} style={motionIndex(index)}>
                <FeaturedCard page={page} layout={item.layout} priority={index < 3} />
              </li>
            )
          })}
        </ul>
      </section>

      <section className="lander-all" aria-label="Featured solutions">
        <SolutionCarousel heading="Featured solutions" />
      </section>

      <section className="lander-index" aria-labelledby="all-articles-heading" id="all-articles">
        <header className="lander-index-head">
          <h2 id="all-articles-heading">All articles</h2>
          <p className="lander-section-lede">Every solution guide, in one list.</p>
        </header>
        <ul className="lander-index-list">
          {articles.map((page) => (
            <li key={page.slug}>
              <Link to={`/solutions/${page.slug}`}>{page.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="lander-temps" aria-label="Pick by storage temperature">
        <h2>Not sure where to start? Pick a temperature.</h2>
        <p className="lander-section-lede">
          Drag to your storage temperature — we will point you at the matching guide.
        </p>
        <TemperatureSlider />
      </section>

      <aside className="lander-cta block-cta">
        <div className="block-cta-copy">
          <h2>Test a label in your own freezer first</h2>
          <p>
            Request free samples for your application, or jump into the shop when you already know
            the class you need. Shipping is free to contiguous US, Canada, and the EU (business
            addresses).
          </p>
        </div>
        <div className="block-cta-actions">
          <Link className="btn btn-on-accent" to={SAMPLE_PATH}>
            Request a free sample
          </Link>
          <a className="btn btn-on-accent-ghost" href={LABTAG_SHOP_URL} target="_blank" rel="noreferrer">
            Go to the shop
          </a>
        </div>
      </aside>
    </div>
  )
}

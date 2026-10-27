import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motionIndex, usePageMotion } from '@/hooks/usePageMotion'
import { SolutionCarousel } from '@/components/SolutionCarousel'
import { TemperatureSlider } from '@/components/TemperatureSlider'
import { pagesForArchive, pagesForCombinedCatalog } from '@/content/categories'
import { CONTACT_PATH, LABTAG_SHOP_URL, SAMPLE_PATH } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import type { SolutionPage } from '@/content/types'

function NewArticleLink({ page }: { page: SolutionPage }) {
  const image = page.heroImage
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null

  return (
    <Link to={`/solutions/${page.slug}`} className="lander-new-link motion-sheen-wrap">
      {resolved ? (
        <img
          className="lander-new-media"
          src={resolved.primary}
          alt=""
          loading="lazy"
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
        {page.excerpt ? <span>{page.excerpt}</span> : null}
      </span>
    </Link>
  )
}

export function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const archive = pagesForArchive()
  const newArticles = pagesForCombinedCatalog()
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
        aria-label="New articles"
        id="new-articles"
        data-motion-section
      >
        <ul className="lander-new-list">
          {newArticles.map((page, index) => (
            <li
              key={page.slug}
              className={index === 0 ? 'is-featured' : index >= 5 ? 'is-wide' : 'is-tile'}
              style={motionIndex(index)}
            >
              <NewArticleLink page={page} />
            </li>
          ))}
        </ul>
      </section>

      <section className="lander-all" aria-label="All solution pages">
        <SolutionCarousel heading="Browse all solutions" />
      </section>

      <section className="lander-temps" aria-label="Pick by storage temperature">
        <h2>Not sure where to start? Pick a temperature.</h2>
        <p className="lander-section-lede">
          Drag to your storage temperature — we will point you at the matching guide.
        </p>
        <TemperatureSlider />
      </section>

      <section className="lander-index" aria-labelledby="lander-archive-heading" id="archive">
        <header className="lander-index-head">
          <h2 id="lander-archive-heading">Archive</h2>
          <p className="lander-section-lede">
            Original LabTAG solution pages, kept at their historical URLs.
          </p>
        </header>
        <ul className="lander-index-list">
          {archive.map((page) => (
            <li key={page.slug}>
              <Link to={`/solutions/${page.slug}`}>{page.title}</Link>
            </li>
          ))}
        </ul>
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

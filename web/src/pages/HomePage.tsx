import { Link } from 'react-router-dom'
import { SolutionCarousel } from '@/components/SolutionCarousel'
import { TemperatureSlider } from '@/components/TemperatureSlider'
import { pagesForArchive, pagesForCombinedCatalog } from '@/content/categories'
import { LABTAG_CONTACT_URL, LABTAG_SAMPLE_URL, LABTAG_SHOP_URL } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import type { SolutionPage } from '@/content/types'

function NewArticleLink({ page }: { page: SolutionPage }) {
  const image = page.heroImage
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null

  return (
    <Link to={`/solutions/${page.slug}`} className="lander-new-link">
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
  const archive = pagesForArchive()
  const newArticles = pagesForCombinedCatalog()

  return (
    <div className="home lander">
      <header className="page-hero">
        <div className="page-hero-copy">
          <h1>Labels & Identification Solutions</h1>
          <div className="page-hero-description">
            <p>
              Identify, track, and store every sample with labels built for the temperatures,
              chemicals, and workflows your research demands.
            </p>
          </div>
          <div className="page-hero-actions">
            <a className="btn btn-primary" href={LABTAG_CONTACT_URL} target="_blank" rel="noreferrer">
              Chat with an expert
            </a>
            <a className="btn btn-secondary" href={LABTAG_SAMPLE_URL} target="_blank" rel="noreferrer">
              Get Free Samples
            </a>
          </div>
        </div>
      </header>

      <section className="lander-index lander-new" aria-label="New articles" id="new-articles">
        <ul className="lander-new-list">
          {newArticles.map((page) => (
            <li key={page.slug}>
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
        <h2>Test a label in your own freezer first</h2>
        <p>
          Request free label samples for your application, or jump into the shop when you already
          know the class you need. Shipping samples is free to contiguous US, Canada, and the EU
          (business addresses).
        </p>
        <div className="lander-hero-actions">
          <a className="btn btn-on-accent" href={LABTAG_SAMPLE_URL} target="_blank" rel="noreferrer">
            Request a free sample
          </a>
          <a className="btn btn-on-accent-ghost" href={LABTAG_SHOP_URL} target="_blank" rel="noreferrer">
            Go to the shop
          </a>
        </div>
      </aside>
    </div>
  )
}

import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motionIndex, usePageMotion } from '@/hooks/usePageMotion'
import { SolutionCard } from '@/components/SolutionCard'
import { pagesForBrowseAll } from '@/content/categories'
import { CONTACT_PATH, LABTAG_SHOP_URL, SAMPLE_PATH } from '@/content/labtagLinks'

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

      <section className="solution-grid-section" aria-label="All solutions">
        <ul className="solution-grid">
          {articles.map((page) => (
            <li key={page.slug}>
              <SolutionCard page={page} />
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

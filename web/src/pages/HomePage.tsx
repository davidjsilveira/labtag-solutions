import { Link } from 'react-router-dom'
import { solutionPages } from '@/content/loadPages'
import { resolveImageSrc } from '@/content/resolveImage'

export function HomePage() {
  return (
    <div className="home">
      <section className="home-hero">
        <p className="brand">LabTAG</p>
        <h1>Solutions</h1>
        <p className="lede">
          Browse {solutionPages.length} labeling solution pages rendered from shared content
          blocks.
        </p>
      </section>

      <section className="solution-index" aria-label="Solution pages">
        {solutionPages.map((page) => {
          const image = page.heroImage
            ? resolveImageSrc(page.heroImage.src, page.heroImage.fallbackSrc)
            : null

          return (
            <Link key={page.slug} to={`/solutions/${page.slug}`} className="solution-card">
              {image ? (
                <div className="solution-card-media">
                  <img
                    src={image.primary}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      if (image.fallback && event.currentTarget.src !== image.fallback) {
                        event.currentTarget.src = image.fallback
                      }
                    }}
                  />
                </div>
              ) : null}
              <div className="solution-card-body">
                <h2>{page.title}</h2>
                <p>{page.excerpt || 'Open solution page'}</p>
              </div>
            </Link>
          )
        })}
      </section>
    </div>
  )
}

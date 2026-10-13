import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/blocks/BlockRenderer'
import { PageHero } from '@/blocks/PageHero'
import { getPage, solutionPages } from '@/content/loadPages'

export function SolutionPage() {
  const { slug = '' } = useParams()
  const page = getPage(slug)

  if (!page) {
    return (
      <div className="missing">
        <h1>Page not found</h1>
        <p>No solution matches “{slug}”.</p>
        <Link to="/">Back to all solutions</Link>
      </div>
    )
  }

  const index = solutionPages.findIndex((item) => item.slug === page.slug)
  const prev = solutionPages[index - 1]
  const next = solutionPages[index + 1]

  return (
    <article className="solution-page">
      <p className="crumb">
        <Link to="/">Solutions</Link>
        <span aria-hidden="true"> / </span>
        <span>{page.title}</span>
      </p>

      <PageHero title={page.title} sources={page.sources} />
      <BlockRenderer blocks={page.blocks} />

      <nav className="pager" aria-label="Adjacent solutions">
        {prev ? (
          <Link to={`/solutions/${prev.slug}`} className="pager-link prev">
            <span>Previous</span>
            <strong>{prev.title}</strong>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/solutions/${next.slug}`} className="pager-link next">
            <span>Next</span>
            <strong>{next.title}</strong>
          </Link>
        ) : null}
      </nav>
    </article>
  )
}

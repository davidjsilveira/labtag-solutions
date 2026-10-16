import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/blocks/BlockRenderer'
import { PageHero } from '@/blocks/PageHero'
import { pagesForBrowseAll } from '@/content/categories'
import { getPage } from '@/content/loadPages'
import { useAnchorHighlight } from '@/hooks/useAnchorHighlight'

export function SolutionPage() {
  const { slug = '' } = useParams()
  const page = getPage(slug)
  useAnchorHighlight(page?.slug ?? slug)

  if (!page) {
    return (
      <div className="missing">
        <h1>Page not found</h1>
        <p>No solution matches “{slug}”.</p>
        <Link to="/">Back to all solutions</Link>
      </div>
    )
  }

  const siblings = pagesForBrowseAll()
  const index = siblings.findIndex((item) => item.slug === page.slug)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]

  return (
    <article className="solution-page">
      <PageHero
        key={page.slug}
        title={page.title}
        description={page.description}
        image={page.heroImage}
        solutionSlug={page.slug}
        crumb={
          <p className="crumb">
            <Link to="/">Solutions</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">. . .</span>
          </p>
        }
      />
      <BlockRenderer
        blocks={page.blocks}
        solutionSlug={page.slug}
        solutionTitle={page.title}
      />

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

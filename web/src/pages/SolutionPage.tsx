import { Link, Navigate, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/blocks/BlockRenderer'
import { PageHero } from '@/blocks/PageHero'
import {
  getCategory,
  getCategoryForSlug,
  pagesInCategory,
} from '@/content/categories'
import { getPage } from '@/content/loadPages'

export function SolutionPage() {
  const { categoryId = '', slug = '' } = useParams()
  const page = getPage(slug)
  const category = getCategory(categoryId)
  const expected = getCategoryForSlug(slug)

  if (!page) {
    return (
      <div className="missing">
        <h1>Page not found</h1>
        <p>No solution matches “{slug}”.</p>
        <Link to="/">Back to all solutions</Link>
      </div>
    )
  }

  if (!category || !expected || expected.id !== category.id) {
    const fallback = expected ?? getCategoryForSlug(page.slug)
    if (fallback) {
      return <Navigate to={`/solutions/${fallback.id}/${page.slug}`} replace />
    }
    return <Navigate to="/" replace />
  }

  const siblings = pagesInCategory(category.id)
  const index = siblings.findIndex((item) => item.slug === page.slug)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]

  return (
    <article className="solution-page">
      <p className="crumb">
        <Link to="/">Solutions</Link>
        <span aria-hidden="true"> / </span>
        <Link to={`/solutions/${category.id}`}>{category.label}</Link>
        <span aria-hidden="true"> / </span>
        <span>{page.title}</span>
      </p>

      <PageHero
        key={page.slug}
        title={page.title}
        description={page.description}
        image={page.heroImage}
        sources={page.sources}
      />
      <BlockRenderer blocks={page.blocks} />

      <nav className="pager" aria-label="Adjacent solutions">
        {prev ? (
          <Link to={`/solutions/${category.id}/${prev.slug}`} className="pager-link prev">
            <span>Previous</span>
            <strong>{prev.title}</strong>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/solutions/${category.id}/${next.slug}`} className="pager-link next">
            <span>Next</span>
            <strong>{next.title}</strong>
          </Link>
        ) : null}
      </nav>
    </article>
  )
}

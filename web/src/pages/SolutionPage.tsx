import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/blocks/BlockRenderer'
import { PageHero } from '@/blocks/PageHero'
import { pagesForArchive, pagesForBrowseAll } from '@/content/categories'
import { archiveSlugsForCatalog, isCombinedCatalogSlug } from '@/content/legacyMap'
import { getPage } from '@/content/loadPages'
import { useAnchorHighlight } from '@/hooks/useAnchorHighlight'

export function SolutionPage() {
  const { slug = '' } = useParams()
  const page = getPage(slug)
  const combined = Boolean(page && !page.legacy && isCombinedCatalogSlug(page.slug))
  useAnchorHighlight(combined ? '' : (page?.slug ?? slug))

  if (!page) {
    return (
      <div className="missing">
        <h1>Page not found</h1>
        <p>No solution matches “{slug}”.</p>
        <Link to="/">Back to all solutions</Link>
      </div>
    )
  }

  const replacement = page.replacedBy ? getPage(page.replacedBy) : undefined
  const archiveSources = combined
    ? archiveSlugsForCatalog(page.slug)
        .map((archiveSlug) => getPage(archiveSlug))
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
    : []
  const siblings = page.legacy ? pagesForArchive() : pagesForBrowseAll()
  const index = siblings.findIndex((item) => item.slug === page.slug)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]
  const crumbHome = page.legacy ? (
    <Link to="/#archive">Archive</Link>
  ) : (
    <Link to="/">Solutions</Link>
  )

  return (
    <article className={`solution-page${page.legacy ? ' is-archive' : ''}${combined ? ' is-catalog' : ''}`}>
      <PageHero
        key={page.slug}
        title={page.title}
        description={page.description}
        image={page.heroImage}
        solutionSlug={page.slug}
        layout="split"
        crumb={
          <p className="crumb">
            {crumbHome}
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{combined ? page.title : '. . .'}</span>
          </p>
        }
        related={
          replacement ? (
            <p className="hero-related">
              This guide is archived. See the current article:{' '}
              <Link to={`/solutions/${replacement.slug}`}>{replacement.title}</Link>
            </p>
          ) : archiveSources.length ? (
            <nav className="hero-related" aria-labelledby="hero-related-heading">
              <p id="hero-related-heading" className="hero-related-label">
                Also in the archive
              </p>
              <ul className="source-list">
                {archiveSources.map((source) => (
                  <li key={source.slug}>
                    <Link to={`/solutions/${source.slug}`}>{source.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null
        }
      />
      <BlockRenderer
        blocks={page.blocks}
        solutionSlug={page.slug}
        solutionTitle={page.title}
        variant={page.legacy ? 'archive' : combined ? 'catalog' : undefined}
      />

      <nav className="pager" aria-label={page.legacy ? 'Adjacent archived solutions' : 'Adjacent solutions'}>
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

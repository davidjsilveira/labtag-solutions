import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/blocks/BlockRenderer'
import { PageHero } from '@/blocks/PageHero'
import {
  isNewArticleSlug,
  pagesForArchive,
  pagesForBrowseAll,
  pagesForCombinedCatalog,
} from '@/content/categories'
import { archiveSlugsForCatalog } from '@/content/legacyMap'
import { getPage } from '@/content/loadPages'
import type { SolutionPage as SolutionPageData } from '@/content/types'
import { useAnchorHighlight } from '@/hooks/useAnchorHighlight'

function CycleChevron({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={dir === 'prev' ? 'M15 5 8 12l7 7' : 'm9 5 7 7-7 7'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function wrapNeighbor(pages: SolutionPageData[], index: number, step: number) {
  return pages[(index + step + pages.length) % pages.length]
}

export function SolutionPage() {
  const { slug = '' } = useParams()
  const page = getPage(slug)
  const combined = Boolean(page && !page.legacy && isNewArticleSlug(page.slug))
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
  const newArticles = combined ? pagesForCombinedCatalog() : []
  const siblings = page.legacy
    ? pagesForArchive()
    : combined
      ? newArticles
      : pagesForBrowseAll()
  const index = siblings.findIndex((item) => item.slug === page.slug)
  const cycle = combined && index >= 0 && siblings.length > 1
  const prev = cycle ? wrapNeighbor(siblings, index, -1) : siblings[index - 1]
  const next = cycle ? wrapNeighbor(siblings, index, 1) : siblings[index + 1]
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
        cycle={
          cycle && prev && next ? (
            <nav className="catalog-cycle" aria-label="New articles">
              <Link to={`/solutions/${prev.slug}`} className="catalog-cycle-item prev" rel="prev">
                <span className="catalog-cycle-icon">
                  <CycleChevron dir="prev" />
                </span>
                <span className="catalog-cycle-copy">
                  <span className="catalog-cycle-label">Previous</span>
                  <strong>{prev.title}</strong>
                </span>
              </Link>
              <Link to={`/solutions/${next.slug}`} className="catalog-cycle-item next" rel="next">
                <span className="catalog-cycle-copy">
                  <span className="catalog-cycle-label">Next</span>
                  <strong>{next.title}</strong>
                </span>
                <span className="catalog-cycle-icon">
                  <CycleChevron dir="next" />
                </span>
              </Link>
            </nav>
          ) : null
        }
        related={
          replacement ? (
            <p className="hero-related hero-related-note">
              This guide is archived. See the current article:{' '}
              <Link to={`/solutions/${replacement.slug}`} className="source-tag">
                {replacement.title}
              </Link>
            </p>
          ) : archiveSources.length ? (
            <nav className="hero-related" aria-label="Archive">
              <ul className="source-list">
                {archiveSources.map((source) => (
                  <li key={source.slug}>
                    <Link to={`/solutions/${source.slug}`} className="source-tag">
                      {source.title}
                    </Link>
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

      {combined ? null : (
        <nav
          className="pager"
          aria-label={page.legacy ? 'Adjacent archived solutions' : 'Adjacent solutions'}
        >
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
      )}

    </article>
  )
}

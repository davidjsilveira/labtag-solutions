import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { solutionPages } from '@/content/loadPages'

export function HomePage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return solutionPages
    return solutionPages.filter(
      (page) =>
        page.title.toLowerCase().includes(needle) ||
        page.excerpt.toLowerCase().includes(needle) ||
        page.slug.includes(needle),
    )
  }, [query])

  return (
    <div className="home">
      <section className="home-hero">
        <p className="brand">LabTAG</p>
        <h1>Solutions</h1>
        <p className="lede">
          Browse {solutionPages.length} labeling solution pages rendered from shared content
          blocks.
        </p>
        <label className="search">
          <span className="sr-only">Search solutions</span>
          <input
            type="search"
            placeholder="Search solutions…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </section>

      <section className="solution-index" aria-label="Solution pages">
        {filtered.map((page) => (
          <Link key={page.slug} to={`/solutions/${page.slug}`} className="solution-card">
            <h2>{page.title}</h2>
            <p>{page.excerpt || 'Open solution page'}</p>
            <span className="card-meta">
              {page.blocks.length} blocks
              {page.sources.length > 1 ? ` · ${page.sources.length} sources` : ''}
            </span>
          </Link>
        ))}
        {!filtered.length ? <p className="empty">No solutions match that search.</p> : null}
      </section>
    </div>
  )
}

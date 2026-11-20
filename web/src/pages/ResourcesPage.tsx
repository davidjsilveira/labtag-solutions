import { useMemo, useState } from 'react'
import {
  CASE_STUDY_ITEMS,
  LITERATURE_FILTERS,
  LITERATURE_ITEMS,
  LITERATURE_LANGUAGES,
  LITERATURE_TYPE_LABEL,
  type LiteratureFilter,
  type LiteratureLanguage,
} from '@/content/literature'

type LanguageFilter = LiteratureLanguage | 'all'

function actionLabel(href: string) {
  if (/\.pdf($|\?)/i.test(href)) return 'Download PDF'
  return 'Open guide'
}

export function ResourcesPage() {
  const [language, setLanguage] = useState<LanguageFilter>('all')
  const [filter, setFilter] = useState<LiteratureFilter>('literature')

  const byLanguage = useMemo(() => {
    if (language === 'all') return LITERATURE_ITEMS
    return LITERATURE_ITEMS.filter((item) => item.language === language)
  }, [language])

  const files = useMemo(() => {
    if (filter === 'literature') return byLanguage
    return byLanguage.filter((item) => item.type === filter)
  }, [byLanguage, filter])

  return (
    <article className="resources-page">
      <header className="resources-hero">
        <p className="resources-kicker">Resources</p>
        <h1>Literature</h1>
        <p>
          Catalogs, flyers, guides, and whitepapers for LabTAG labeling products — filter by type
          or browse everything below.
        </p>
      </header>

      <div className="resources-toolbar">
        <div className="resources-language" role="group" aria-label="Language">
          <span className="resources-language-label" id="resources-language-label">
            Language
          </span>
          <div
            className="resources-language-options"
            role="radiogroup"
            aria-labelledby="resources-language-label"
          >
            {LITERATURE_LANGUAGES.map((item) => {
              const active = language === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={active ? 'is-active' : undefined}
                  onClick={() => setLanguage(item.id)}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="resources-filters" role="tablist" aria-label="Literature type">
          {LITERATURE_FILTERS.map((item) => {
            const active = filter === item.id
            const count =
              item.id === 'literature'
                ? byLanguage.length
                : byLanguage.filter((entry) => entry.type === item.id).length
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={active ? 'is-active' : undefined}
                onClick={() => setFilter(item.id)}
              >
                <span>{item.label}</span>
                <span className="resources-filter-count">{count}</span>
              </button>
            )
          })}
        </div>
        <p className="resources-count" aria-live="polite">
          Showing {files.length} {files.length === 1 ? 'file' : 'files'}
        </p>
      </div>

      {files.length === 0 ? (
        <p className="resources-empty">No files match this language and type.</p>
      ) : (
        <ul className="resources-grid">
          {files.map((item) => (
            <li key={item.id}>
              <a
                className="resources-card"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="resources-card-media">
                  <img src={item.image} alt="" width={320} height={400} loading="lazy" />
                </span>
                <span className="resources-card-copy">
                  <span className="resources-card-type">{LITERATURE_TYPE_LABEL[item.type]}</span>
                  <span className="resources-card-title">{item.title}</span>
                  <span className="resources-card-action">{actionLabel(item.href)}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <section className="resources-cases" aria-labelledby="resources-cases-heading">
        <header className="resources-cases-head">
          <h2 id="resources-cases-heading">Case Studies</h2>
          <p>
            See how research labs, hospitals, and biobanks use LabTAG to eliminate mislabeling and
            reclaim time at the bench.
          </p>
        </header>

        <ul className="resources-cases-grid">
          {CASE_STUDY_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                className="resources-case-card"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="resources-case-logo">
                  <img src={item.image} alt="" width={160} height={80} loading="lazy" />
                </span>
                <span className="resources-case-copy">
                  <span className="resources-case-category">{item.category}</span>
                  <span className="resources-case-title">{item.title}</span>
                  <span className="resources-case-tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </span>
                  <span className="resources-case-action">Read the story</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}

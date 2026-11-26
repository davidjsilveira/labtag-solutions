import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
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

function typeFromQuery(raw: string | null): LiteratureFilter {
  if (
    raw === 'guides' ||
    raw === 'whitepapers' ||
    raw === 'catalogs-flyers' ||
    raw === 'case-studies'
  ) {
    return raw
  }
  return 'all'
}

function languageFromQuery(raw: string | null): LanguageFilter {
  if (raw === 'en' || raw === 'fr' || raw === 'de' || raw === 'es') return raw
  return 'all'
}

export function ResourcesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const search = new URLSearchParams(location.search)
  const type = typeFromQuery(search.get('type'))
  const language = languageFromQuery(search.get('lang'))

  const setFilter = (nextType = type, nextLang = language) => {
    const next = new URLSearchParams(location.search)
    if (nextType === 'all') next.delete('type')
    else next.set('type', nextType)
    if (nextLang === 'all') next.delete('lang')
    else next.set('lang', nextLang)
    const query = next.toString()
    navigate({ pathname: location.pathname, search: query ? `?${query}` : '' }, { replace: true })
  }

  const byLanguage = useMemo(() => {
    if (language === 'all') return LITERATURE_ITEMS
    return LITERATURE_ITEMS.filter((item) => item.language === language)
  }, [language])

  const files = useMemo(() => {
    if (type === 'all') return byLanguage
    return byLanguage.filter((item) => item.type === type)
  }, [byLanguage, type])

  return (
    <article className="resources-page">
      <header className="resources-hero">
        <h1>Literature</h1>
        <p>
          Case studies, catalogs, flyers, guides, and whitepapers for LabTAG labeling products.
        </p>
      </header>

      <div className="resources-toolbar">
        <div className="resources-toolbar-row" role="toolbar" aria-label="Literature filters">
          <label className="resources-lang">
            <span>Language</span>
            <select
              className={language !== 'all' ? 'is-active' : undefined}
              value={language}
              onChange={(event) => setFilter(type, event.target.value as LanguageFilter)}
            >
              {LITERATURE_LANGUAGES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <div className="resources-chip-group" role="group" aria-label="Type">
            {LITERATURE_FILTERS.map((item) => {
              const active = type === item.id
              const count =
                item.id === 'all'
                  ? byLanguage.length
                  : byLanguage.filter((entry) => entry.type === item.id).length
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`finder-chip${active ? ' is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => setFilter(item.id, language)}
                >
                  <span>{item.label}</span>
                  <span className="finder-chip-count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
        <p className="resources-count" aria-live="polite">
          Showing {files.length} {files.length === 1 ? 'file' : 'files'}
        </p>
      </div>

      {files.length === 0 ? (
        <p className="resources-empty">
          No literature was found for this combination. Try a different language or type.
        </p>
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
    </article>
  )
}

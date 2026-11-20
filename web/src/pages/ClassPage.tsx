import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CaretDown, DownloadSimple } from '@phosphor-icons/react'
import {
  CONTAINER_LABELS,
  findLabelClass,
  formatTemp,
  tempTagClass,
  type LabelClass,
} from '@/content/labelFinder'
import { FINDER_PATH, SAMPLE_PATH, finderFilterPath, labtagClassUrl } from '@/content/labtagLinks'
import { COLOR_SWATCH, JTTA_DESCRIPTION, JTTA_SKUS, JTTA_SUMMARY, type ClassSku } from '@/content/classMocks'

const CLASS_IMAGE = '/media/label-finder/class-placeholder.webp'
const PAGE_SIZES = [25, 50, 100] as const
const WIDTH_SORTS = ['Width: Small to Large', 'Width: Large to Small'] as const
const NOT_SPECIFIED = 'Not specified'

type WidthSort = (typeof WIDTH_SORTS)[number]
type ClassFilterKey = 'container' | 'shape' | 'dimensions' | 'feature' | 'color'

const CLASS_FILTERS: { key: ClassFilterKey; label: string }[] = [
  { key: 'container', label: 'Container' },
  { key: 'shape', label: 'Shape' },
  { key: 'dimensions', label: 'Dimensions' },
  { key: 'feature', label: 'Feature' },
  { key: 'color', label: 'Color' },
]

function FiltersIcon() {
  return (
    <svg className="finder-chip-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.5 4.25h11M4.25 8h7.5M6 11.75h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="5.25" cy="4.25" r="1.35" fill="currentColor" />
      <circle cx="10.5" cy="8" r="1.35" fill="currentColor" />
      <circle cx="8.25" cy="11.75" r="1.35" fill="currentColor" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg className="finder-chip-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M5 2.75v10.5M5 2.75 3.25 4.75M5 2.75 6.75 4.75M11 13.25V2.75M11 13.25 9.25 11.25M11 13.25 12.75 11.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg className="finder-chip-chevron" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.25 6 7.75 9.5 4.25" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="finder-search-icon" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="m10.2 10.2 3.05 3.05" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ClassChipFilter({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({})

  const placePanel = () => {
    const button = buttonRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const panelWidth = Math.min(18.5 * 16, window.innerWidth - 24)
    const left = Math.min(Math.max(12, rect.left), window.innerWidth - panelWidth - 12)
    setPanelStyle({
      position: 'fixed',
      top: rect.bottom + 4,
      left,
      width: panelWidth,
      zIndex: 80,
    })
  }

  useLayoutEffect(() => {
    if (open) placePanel()
  }, [open, value])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', placePanel)
    window.addEventListener('scroll', placePanel, true)
    return () => {
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', placePanel)
      window.removeEventListener('scroll', placePanel, true)
    }
  }, [open])

  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])
  }

  return (
    <div className={`finder-menu-filter${open || value.length ? ' is-active' : ''}`} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`finder-chip finder-chip-action${value.length ? ' is-active' : ''}${open ? ' is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{label}</span>
        {value.length ? <span className="finder-chip-count">{value.length}</span> : null}
        <ChevronIcon />
      </button>
      {open ? (
        <div className="finder-menu-panel" style={panelStyle} role="listbox" aria-label={label} aria-multiselectable="true">
          <ul className="finder-menu-list">
            {options.length ? (
              options.map((option) => {
                const checked = value.includes(option)
                return (
                  <li key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={checked}
                      className={`finder-menu-option${checked ? ' is-selected' : ''}`}
                      onClick={() => toggle(option)}
                    >
                      <span className={`finder-menu-check${checked ? ' is-checked' : ''}`} aria-hidden="true">
                        {checked ? (
                          <svg viewBox="0 0 12 12">
                            <path
                              d="M2.5 6.2 4.8 8.5 9.5 3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : null}
                      </span>
                      <span className="finder-menu-option-label">{option}</span>
                    </button>
                  </li>
                )
              })
            ) : (
              <li className="finder-menu-empty">No options</li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

function formatsOf(row: LabelClass) {
  return row.formats
    .split(/[·,|/]/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function classBlurb(row: LabelClass) {
  const containers = row.containers.map((kind) => CONTAINER_LABELS[kind])
  const range =
    row.tempMin == null && row.tempMax == null
      ? null
      : `${formatTemp(row.tempMin)} to ${formatTemp(row.tempMax)}`
  const surface = containers.length ? containers.join(', ') : 'laboratory containers'
  const printer = row.printers.length ? row.printers.join(', ') : 'the listed print methods'
  return `${row.name} ${row.productType.toLowerCase()}s for ${surface}.${range ? ` Rated ${range}.` : ''} Print with ${printer}.`
}

function classDetail(row: LabelClass) {
  const parts = [classBlurb(row)]
  if (row.resistances.length) parts.push(`Resistances: ${row.resistances.join(', ')}.`)
  if (row.features.length) parts.push(`Features: ${row.features.join(', ')}.`)
  if (row.tempApp != null) parts.push(`Minimum application temperature ${formatTemp(row.tempApp)}.`)
  return parts.join(' ')
}

export function ClassPage() {
  const { code = '' } = useParams()
  const row = findLabelClass(decodeURIComponent(code))
  if (!row) return <Navigate to={FINDER_PATH} replace />
  return <ClassArticle row={row} />
}

function ClassArticle({ row }: { row: LabelClass }) {
  const catalogSkus = row.code === 'JTTA' ? JTTA_SKUS : null
  const formats = formatsOf(row)
  const fallbackContainers = row.containers.length ? row.containers.map((kind) => CONTAINER_LABELS[kind]) : [NOT_SPECIFIED]
  const fallbackFeatures = row.features.length ? row.features : [NOT_SPECIFIED]
  const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b))
  const options: Record<ClassFilterKey, string[]> = catalogSkus
    ? {
        container: unique(catalogSkus.map((item) => item.container)),
        shape: unique(catalogSkus.map((item) => item.shape)),
        dimensions: unique(catalogSkus.map((item) => item.dimensions)),
        feature: unique(catalogSkus.map((item) => item.feature)),
        color: unique(catalogSkus.flatMap((item) => item.colors)),
      }
    : {
        container: fallbackContainers,
        shape: [row.productType],
        dimensions: formats,
        feature: fallbackFeatures,
        color: [NOT_SPECIFIED],
      }
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [widthSort, setWidthSort] = useState<WidthSort>('Width: Small to Large')
  const [filters, setFilters] = useState<Record<ClassFilterKey, string[]>>({
    container: [],
    shape: [],
    dimensions: [],
    feature: [],
    color: [],
  })
  const [allOpen, setAllOpen] = useState(false)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number] | 'all'>(25)
  const [page, setPage] = useState(1)
  const catalog = labtagClassUrl(row.code)
  const activeCount = Object.values(filters).reduce((sum, values) => sum + values.length, 0) + (query.trim() ? 1 : 0)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = (selected: string[], values: string[]) =>
      !selected.length || selected.some((item) => values.includes(item))
    const source: ClassSku[] = catalogSkus ?? formats.map((format) => ({
      model: row.code,
      dimensions: format,
      width: null,
      shape: row.productType,
      container: fallbackContainers[0] ?? NOT_SPECIFIED,
      feature: fallbackFeatures[0] ?? NOT_SPECIFIED,
      colors: [],
      price: 'See catalog',
    }))
    return source
      .map((item) => ({ ...item, id: item.model, headline: row.headline }))
      .filter((item) => matches(filters.dimensions, [item.dimensions]))
      .filter((item) => matches(filters.container, [item.container]))
      .filter((item) => matches(filters.shape, [item.shape]))
      .filter((item) => matches(filters.feature, [item.feature]))
      .filter((item) => matches(filters.color, item.colors.length ? item.colors : [NOT_SPECIFIED]))
      .filter((item) => !q || `${item.model} ${item.dimensions} ${item.shape} ${item.container} ${item.feature}`.toLowerCase().includes(q))
      .sort((a, b) => {
        const aw = a.width ?? Number.POSITIVE_INFINITY
        const bw = b.width ?? Number.POSITIVE_INFINITY
        return widthSort === 'Width: Small to Large' ? aw - bw : bw - aw
      })
  }, [catalogSkus, fallbackContainers, fallbackFeatures, filters, formats, query, row.code, row.headline, row.productType, widthSort])

  const pageCount = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visible = pageSize === 'all' ? rows : rows.slice((safePage - 1) * pageSize, safePage * pageSize)
  const summary = row.code === 'JTTA' ? JTTA_SUMMARY : classBlurb(row)
  const detail = row.code === 'JTTA' ? JTTA_DESCRIPTION : classDetail(row)
  const featureLabels = row.features.length
    ? row.features
    : catalogSkus
      ? [...new Set(catalogSkus.map((item) => item.feature))]
      : []

  return (
    <article className="class-page">
      <section className="class-hero">
        <div className="class-hero-identity">
          <figure className="class-gallery">
            <img src={CLASS_IMAGE} alt="" width={640} height={420} />
          </figure>
          <div className="class-hero-copy">
            <h1>{row.code}</h1>
            <p className="class-subtitle">{row.headline}</p>
            <div className="class-hero-actions">
              <Link className="class-action is-primary" to={SAMPLE_PATH}>
                Request Free Sample
              </Link>
              <a className="class-action" href={catalog} target="_blank" rel="noreferrer">
                <DownloadSimple aria-hidden="true" />
                Download Data Sheet
              </a>
            </div>
          </div>
          <p className="class-lead">
            {expanded ? detail : summary}
            {detail !== summary ? (
              <button type="button" className="class-read-more" onClick={() => setExpanded((open) => !open)}>
                {expanded ? 'Show less' : 'Read more'}
                <CaretDown aria-hidden="true" />
              </button>
            ) : null}
          </p>
        </div>
        <div className="class-specs">
          <section className="class-spec">
            <h2>Brand</h2>
            <p>
              <Link className="finder-meta-chip is-feature" to={finderFilterPath('brands', row.brand)}>
                {row.brand}
              </Link>
            </p>
          </section>
          <section className="class-spec">
            <h2>Temperature</h2>
            <p className="class-spec-range">
              {row.tempMin == null && row.tempMax == null ? (
                'Not specified'
              ) : (
                <>
                  {formatTemp(row.tempMin)} to {formatTemp(row.tempMax)}
                </>
              )}
            </p>
            {row.tempTags.length ? (
              <ul className="finder-meta-chips class-spec-chips">
                {row.tempTags.map((tag) => (
                  <li key={tag}>
                    <Link className={`finder-meta-chip is-resistance ${tempTagClass(tag)}`} to={finderFilterPath('temp', tag)}>
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="finder-empty">—</span>
            )}
          </section>
          <section className="class-spec">
            <h2>Features</h2>
            {featureLabels.length ? (
              <ul className="finder-meta-chips class-spec-chips">
                {featureLabels.map((item) => (
                  <li key={item}>
                    <Link className="finder-meta-chip is-feature" to={finderFilterPath('feature', item)}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="finder-empty">—</span>
            )}
          </section>
          <section className="class-spec">
            <h2>Containers</h2>
            {row.containers.length ? (
              <ul className="finder-meta-chips class-spec-chips">
                {row.containers.map((kind) => (
                  <li key={kind}>
                    <Link className="finder-meta-chip is-container" to={finderFilterPath('containers', CONTAINER_LABELS[kind])}>
                      {CONTAINER_LABELS[kind]}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="finder-empty">—</span>
            )}
          </section>
          <section className="class-spec">
            <h2>Printing Method</h2>
            {row.printers.length ? (
              <ul className="finder-meta-chips class-spec-chips">
                {row.printers.map((method) => (
                  <li key={method}>
                    <Link className="finder-meta-chip is-print" to={finderFilterPath('printingMethods', method)}>
                      {method}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="finder-empty">—</span>
            )}
          </section>
        </div>
      </section>

      <section className="class-catalog finder-toolbar" aria-label={`${row.code} sizes`}>
        <div className="finder-toolbar-row">
          <button
            type="button"
            className={`finder-chip finder-chip-action${allOpen || activeCount ? ' is-active' : ''}${allOpen ? ' is-open' : ''}`}
            aria-expanded={allOpen}
            onClick={() => setAllOpen(true)}
          >
            <FiltersIcon />
            <span>All Filters</span>
            {activeCount ? <span className="finder-chip-count">{activeCount}</span> : null}
          </button>

          <label className="finder-chip finder-chip-select">
            <SortIcon />
            <span className="sr-only">Sort by width</span>
            <select
              value={widthSort}
              onChange={(event) => {
                setWidthSort(event.target.value as WidthSort)
                setPage(1)
              }}
            >
              {WIDTH_SORTS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronIcon />
          </label>

          <div className="finder-toolbar-chips">
            {CLASS_FILTERS.map((filter) => (
              <ClassChipFilter
                key={filter.key}
                label={filter.label}
                options={options[filter.key]}
                value={filters[filter.key]}
                onChange={(next) => {
                  setFilters((current) => ({ ...current, [filter.key]: next }))
                  setPage(1)
                }}
              />
            ))}
          </div>

          <label className="finder-search">
            <span className="sr-only">Search sizes</span>
            <SearchIcon />
            <input
              type="search"
              placeholder='Search by SKU, dimensions (e.g. 1.5", 38mm)...'
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
            />
          </label>
        </div>

        {allOpen ? (
          <div className="finder-drawer-root">
            <button type="button" className="finder-drawer-backdrop" aria-label="Close all filters" onClick={() => setAllOpen(false)} />
            <aside className="finder-drawer" aria-label="All Filters">
              <header className="finder-drawer-head">
                <h2>All Filters</h2>
                <button type="button" className="finder-drawer-close" onClick={() => setAllOpen(false)}>
                  Close
                </button>
              </header>
              <div className="finder-drawer-body">
                {CLASS_FILTERS.map((filter) => (
                  <section key={filter.key} className="finder-drawer-section is-open">
                    <h3 className="class-drawer-label">{filter.label}</h3>
                    <ul className="finder-drawer-options">
                      {options[filter.key].map((option) => {
                        const checked = filters[filter.key].includes(option)
                        return (
                          <li key={option}>
                            <button
                              type="button"
                              className={`finder-drawer-option${checked ? ' is-selected' : ''}`}
                              onClick={() => {
                                setFilters((current) => ({
                                  ...current,
                                  [filter.key]: checked
                                    ? current[filter.key].filter((item) => item !== option)
                                    : [...current[filter.key], option],
                                }))
                                setPage(1)
                              }}
                            >
                              <span className={`finder-menu-check${checked ? ' is-checked' : ''}`} aria-hidden="true" />
                              <span className="finder-drawer-option-label">{option}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                ))}
              </div>
              <footer className="finder-drawer-foot">
                <button
                  type="button"
                  className="finder-drawer-clear"
                  onClick={() =>
                    setFilters({ container: [], shape: [], dimensions: [], feature: [], color: [] })
                  }
                  disabled={!activeCount}
                >
                  Clear All
                </button>
                <button type="button" className="finder-drawer-apply" onClick={() => setAllOpen(false)}>
                  View {rows.length} results
                </button>
              </footer>
            </aside>
          </div>
        ) : null}

        <div className="class-count-row">
          <p>
            <strong>{rows.length}</strong> {rows.length === 1 ? 'result' : 'results'}
          </p>
          <p className="class-count-note">
            {catalogSkus ? 'Sample sizes for this class. Prices are mock values.' : 'SKU prices and dimensions open in the LabTAG catalog.'}
          </p>
          <label className="class-page-size">
            Per page
            <select
              value={String(pageSize)}
              onChange={(event) => {
                const next = event.target.value
                setPageSize(next === 'all' ? 'all' : (Number(next) as (typeof PAGE_SIZES)[number]))
                setPage(1)
              }}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
              <option value="all">All</option>
            </select>
          </label>
        </div>

        <div className="class-table-wrap">
          <table className="class-table">
            <thead>
              <tr>
                <th>Shape</th>
                <th>Product model</th>
                <th>Dimensions</th>
                <th>Available colors</th>
                <th>Price per label</th>
                <th className="class-go" aria-label="View product" />
              </tr>
            </thead>
            <tbody>
              {visible.length ? (
                visible.map((item) => (
                  <tr className="class-row" key={item.id}>
                    <td>
                      <span className={`class-shape is-${item.shape.toLowerCase().includes('circle') && !item.shape.includes('+') ? 'circle' : 'rect'}`} aria-hidden="true" />
                    </td>
                    <td>
                      <a className="class-model" href={catalog} target="_blank" rel="noreferrer">
                        {item.model}
                      </a>
                    </td>
                    <td>
                      {item.dimensions}
                      <span className="class-model-note">{item.shape}</span>
                    </td>
                    <td>
                      {item.colors.length ? (
                        <span className="class-colors" aria-label={item.colors.join(', ')}>
                          {item.colors.slice(0, 6).map((color) => (
                            <span key={color} className="class-swatch" style={{ background: COLOR_SWATCH[color] ?? '#d7d3de' }} title={color} />
                          ))}
                          <span className="class-color-count">({item.colors.length})</span>
                        </span>
                      ) : (
                        <span className="class-muted">—</span>
                      )}
                    </td>
                    <td>{item.price}</td>
                    <td className="class-go">
                      <a className="class-go-link" href={catalog} target="_blank" rel="noreferrer" aria-label={`View ${item.model}`}>
                        <svg className="finder-go-icon" viewBox="0 0 20 20" aria-hidden="true">
                          <path
                            d="M7.25 4.5 12.75 10l-5.5 5.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="class-none">
                    No formats match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 ? (
          <nav className="class-pager" aria-label="Formats pages">
            <button type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
              Previous
            </button>
            <span>
              Page {safePage} of {pageCount}
            </span>
            <button type="button" disabled={safePage === pageCount} onClick={() => setPage(safePage + 1)}>
              Next
            </button>
          </nav>
        ) : null}
      </section>
    </article>
  )
}

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CaretDown, DownloadSimple } from '@phosphor-icons/react'
import {
  CONTAINER_LABELS,
  findLabelClass,
  formatTemp,
  resistanceClass,
  resistanceLabel,
  type LabelClass,
} from '@/content/labelFinder'
import { FINDER_PATH, SAMPLE_PATH, finderFilterPath, labtagClassUrl } from '@/content/labtagLinks'
import { FilterChip, ColumnSortIcon } from '@/pages/LabelFinderPage'
import { COLOR_SWATCH, JTTA_DESCRIPTION, JTTA_SKUS, JTTA_SUMMARY, type ClassSku } from '@/content/classMocks'

const CLASS_IMAGE = '/media/label-finder/class-placeholder.webp'
const PAGE_SIZES = [25, 50, 100] as const
const NOT_SPECIFIED = 'Not specified'

type ClassSortKey = 'model' | 'width' | 'length' | 'diameter' | 'colors' | 'price'
type ClassSort = { key: ClassSortKey; dir: 'asc' | 'desc' }

/** Missing measurements/prices sort last in both directions. */
function sortValue(
  item: { model: string; width: number | null; dims: { l: string | null; d: string | null }; colors: string[]; price: string },
  key: ClassSortKey,
): number | string {
  switch (key) {
    case 'model':
      return item.model
    case 'width':
      return item.width ?? Number.POSITIVE_INFINITY
    case 'length':
      return item.dims.l ? parseFloat(item.dims.l) : Number.POSITIVE_INFINITY
    case 'diameter':
      return item.dims.d ? parseFloat(item.dims.d) : Number.POSITIVE_INFINITY
    case 'colors':
      return item.colors.length
    case 'price': {
      const amount = parseFloat(item.price.replace(/[^0-9.]/g, ''))
      return Number.isNaN(amount) ? Number.POSITIVE_INFINITY : amount
    }
  }
}

function ClassSortHeader({ label, sortKey, sort, onSort, className }: { label: string; sortKey: ClassSortKey; sort: ClassSort; onSort: (key: ClassSortKey) => void; className?: string }) {
  const active = sort.key === sortKey
  return (
    <th scope="col" className={className} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className={`class-th-sort${active ? ' is-active' : ''}`} onClick={() => onSort(sortKey)}>
        <span>{label}</span>
        <ColumnSortIcon direction={active ? sort.dir : null} />
      </button>
    </th>
  )
}
type ClassFilterKey = 'container' | 'shape' | 'width' | 'length' | 'diameter' | 'feature' | 'color'

const CLASS_FILTERS: { key: ClassFilterKey; label: string }[] = [
  { key: 'container', label: 'Container' },
  { key: 'shape', label: 'Shape' },
  { key: 'width', label: 'Width' },
  { key: 'length', label: 'Length' },
  { key: 'diameter', label: 'Diameter' },
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
  filterKey,
  options,
  value,
  onChange,
}: {
  label: string
  filterKey: ClassFilterKey
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
          <ul className={`finder-menu-list${filterKey === 'color' ? ' is-color-grid' : ''}`}>
            {options.length ? (
              options.map((option) => {
                const checked = value.includes(option)
                return (
                  <li key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={checked}
                      className={`finder-menu-option${filterKey === 'color' ? ' is-color' : ''}${checked ? ' is-selected' : ''}`}
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
                      {filterKey === 'color' && COLOR_SWATCH[option] ? (
                        <span className="class-menu-swatch" style={{ background: COLOR_SWATCH[option] }} aria-hidden="true" />
                      ) : null}
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

/** Dimensions strings can carry a trailing shape word ("0.25\" Circle"); size and shape render in separate columns. */
function sizeOf(dimensions: string) {
  const size = dimensions.replace(/(?:\s*(?:Circle|Rectangle|Square|Oval))+\s*$/i, '').trim()
  return size || dimensions
}

/** Split a size into width/length/diameter; circles are specified by diameter. Non-measurements (N/A, Roll) return nulls. */
function dimsOf(size: string) {
  const rect = size.match(/^([\d.]+)" x ([\d.]+)"(?: \+ ([\d.]+)")?$/)
  if (rect) return { w: `${rect[1]}"`, l: `${rect[2]}"`, d: rect[3] ? `${rect[3]}"` : null }
  const circle = size.match(/^([\d.]+)"$/)
  if (circle) return { w: null, l: null, d: `${circle[1]}"` }
  return { w: null, l: null, d: null }
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
        width: unique(catalogSkus.flatMap((item) => dimsOf(sizeOf(item.dimensions)).w ?? [])),
        length: unique(catalogSkus.flatMap((item) => dimsOf(sizeOf(item.dimensions)).l ?? [])),
        diameter: unique(catalogSkus.flatMap((item) => dimsOf(sizeOf(item.dimensions)).d ?? [])),
        feature: unique(catalogSkus.map((item) => item.feature)),
        color: unique(catalogSkus.flatMap((item) => item.colors)),
      }
    : {
        container: fallbackContainers,
        shape: [row.productType],
        width: [],
        length: [],
        diameter: [],
        feature: fallbackFeatures,
        color: [NOT_SPECIFIED],
      }
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<ClassSort>({ key: 'width', dir: 'asc' })
  const toggleSort = (key: ClassSortKey) => {
    setSort((current) => ({ key, dir: current.key === key && current.dir === 'asc' ? 'desc' : 'asc' }))
    setPage(1)
  }
  const [filters, setFilters] = useState<Record<ClassFilterKey, string[]>>({
    container: [],
    shape: [],
    width: [],
    length: [],
    diameter: [],
    feature: [],
    color: [],
  })
  const [allOpen, setAllOpen] = useState(false)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number] | 'all'>(25)
  const [page, setPage] = useState(1)
  const catalog = labtagClassUrl(row.code)
  const activeCount = Object.values(filters).reduce((sum, values) => sum + values.length, 0) + (query.trim() ? 1 : 0)
  const toggleFilter = (key: ClassFilterKey, option: string) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(option) ? current[key].filter((item) => item !== option) : [...current[key], option],
    }))
    setPage(1)
  }
  // Single-value rows: values within a filter are OR, filters combine with AND.
  const appliedChips = CLASS_FILTERS.flatMap(({ key }) =>
    filters[key].map((value) => ({ id: `${key}:${value}`, label: value, filterKey: key, remove: () => toggleFilter(key, value) })),
  )
  const clearAll = () => {
    setFilters({ container: [], shape: [], width: [], length: [], diameter: [], feature: [], color: [] })
    setQuery('')
    setPage(1)
  }

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
      .map((item) => {
        const size = sizeOf(item.dimensions)
        return { ...item, id: item.model, headline: row.headline, size, dims: dimsOf(size) }
      })
      .filter((item) => matches(filters.width, item.dims.w ? [item.dims.w] : []))
      .filter((item) => matches(filters.length, item.dims.l ? [item.dims.l] : []))
      .filter((item) => matches(filters.diameter, item.dims.d ? [item.dims.d] : []))
      .filter((item) => matches(filters.container, [item.container]))
      .filter((item) => matches(filters.shape, [item.shape]))
      .filter((item) => matches(filters.feature, [item.feature]))
      .filter((item) => matches(filters.color, item.colors.length ? item.colors : [NOT_SPECIFIED]))
      .filter((item) => !q || `${item.model} ${item.dimensions} ${item.shape} ${item.container} ${item.feature}`.toLowerCase().includes(q))
      .sort((a, b) => {
        const av = sortValue(a, sort.key)
        const bv = sortValue(b, sort.key)
        if (typeof av === 'string' || typeof bv === 'string') {
          const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
          return sort.dir === 'asc' ? cmp : -cmp
        }
        const aMissing = av === Number.POSITIVE_INFINITY
        const bMissing = bv === Number.POSITIVE_INFINITY
        if (aMissing || bMissing) return aMissing === bMissing ? 0 : aMissing ? 1 : -1
        return sort.dir === 'asc' ? av - bv : bv - av
      })
  }, [catalogSkus, fallbackContainers, fallbackFeatures, filters, formats, query, row.code, row.headline, row.productType, sort])

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
  const heroColors = catalogSkus ? unique(catalogSkus.flatMap((item) => item.colors)) : []

  return (
    <article className="class-page">
      <section className="class-hero">
        <div className="class-hero-identity">
          <div className="class-hero-left">
            <figure className="class-gallery">
              <img src={CLASS_IMAGE} alt="" width={640} height={420} />
            </figure>
            <div className="class-hero-title">
              <h1>{row.code}</h1>
              <p className="class-subtitle">{row.headline}</p>
            </div>
          </div>
          <div className="class-hero-copy">
            <p className="class-lead">
              {expanded ? detail : summary}
              {detail !== summary ? (
                <button type="button" className="class-read-more" onClick={() => setExpanded((open) => !open)}>
                  {expanded ? 'Show less' : 'Read more'}
                  <CaretDown aria-hidden="true" />
                </button>
              ) : null}
            </p>
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
          </section>
          <section className="class-spec">
            <h2>Resistances</h2>
            {row.resistances.length ? (
              <ul className="finder-meta-chips class-spec-chips">
                {row.resistances.map((item) => (
                  <li key={item}>
                    <Link className={`finder-meta-chip is-resistance ${resistanceClass(item)}`} to={finderFilterPath('resistances', item)}>
                      {resistanceLabel(item)}
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
            <h2>Colors</h2>
            {heroColors.length ? (
              <ul className="finder-meta-chips class-spec-chips class-hero-colors">
                {heroColors.map((color) => (
                  <li key={color} className="class-swatch-wrap" data-color={color}>
                    <button
                      type="button"
                      className={`class-swatch${filters.color.includes(color) ? ' is-active' : ''}`}
                      style={{ background: COLOR_SWATCH[color] ?? '#d7d3de' }}
                      aria-label={color}
                      aria-pressed={filters.color.includes(color)}
                      onClick={() => toggleFilter('color', color)}
                    />
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

      <section className="class-catalog" aria-label={`${row.code} sizes`}>
        <div className="class-catalog finder-toolbar">
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

          <div className="finder-toolbar-chips">
            {CLASS_FILTERS.map((filter) => (
              <ClassChipFilter
                key={filter.key}
                label={filter.label}
                filterKey={filter.key}
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
                              className={`finder-drawer-option${filter.key === 'color' ? ' is-color' : ''}${checked ? ' is-selected' : ''}`}
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
                              {filter.key === 'color' && COLOR_SWATCH[option] ? (
                                <span className="class-menu-swatch" style={{ background: COLOR_SWATCH[option] }} aria-hidden="true" />
                              ) : null}
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
                    setFilters({ container: [], shape: [], width: [], length: [], diameter: [], feature: [], color: [] })
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
          {appliedChips.length ? (
            <ul className="finder-applied">
              {appliedChips.map((chip, index) => {
                const previous = appliedChips[index - 1]
                const join = !previous ? null : previous.filterKey === chip.filterKey ? 'or' : 'and'
                return (
                  <li key={chip.id} className="finder-applied-item">
                    {join ? <span className="finder-applied-join">{join}</span> : null}
                    <button type="button" className="finder-applied-chip" onClick={chip.remove}>
                      <span>{chip.label}</span>
                      <span className="finder-applied-x" aria-hidden="true">
                        ×
                      </span>
                      <span className="sr-only">{`Remove ${chip.label}`}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
          {activeCount ? (
            <button type="button" className="finder-clear-all" onClick={clearAll}>
              Clear all
            </button>
          ) : null}
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
                <ClassSortHeader label="Product model" sortKey="model" sort={sort} onSort={toggleSort} />
                <th>Shape</th>
                <ClassSortHeader label="Width" sortKey="width" sort={sort} onSort={toggleSort} />
                <ClassSortHeader label="Length" sortKey="length" sort={sort} onSort={toggleSort} />
                <ClassSortHeader label="Diameter" sortKey="diameter" sort={sort} onSort={toggleSort} />
                <th>Container</th>
                <th>Feature</th>
                <ClassSortHeader label="Available colors" sortKey="colors" sort={sort} onSort={toggleSort} />
                <ClassSortHeader label="Price per label" sortKey="price" sort={sort} onSort={toggleSort} className="class-price" />
                <th className="class-go" aria-label="View product" />
              </tr>
            </thead>
            <tbody>
              {visible.length ? (
                visible.map((item) => {
                  const { w, l, d } = item.dims
                  const [priceAmount, priceUnit] = item.price.split('/')
                  return (
                  <tr className="class-row" key={item.id}>
                    <td>
                      <span className="class-model-cell">
                        <span className="finder-thumb" aria-hidden="true">
                          <img src={CLASS_IMAGE} alt="" width={72} height={54} loading="lazy" />
                        </span>
                        <a className="class-model" href={catalog} target="_blank" rel="noreferrer">
                          {item.model}
                        </a>
                      </span>
                    </td>
                    <td>
                      <span className="class-shape-cell">
                        <span className={`class-shape is-${item.shape.toLowerCase().includes('circle') && !item.shape.includes('+') ? 'circle' : 'rect'}`} aria-hidden="true" />
                        <ul className="finder-meta-chips">
                          <FilterChip label={item.shape} active={filters.shape.includes(item.shape)} onToggle={() => toggleFilter('shape', item.shape)} />
                        </ul>
                      </span>
                    </td>
                    <td>
                      {w ? (
                        <ul className="finder-meta-chips">
                          <FilterChip label={w} active={filters.width.includes(w)} onToggle={() => toggleFilter('width', w)} />
                        </ul>
                      ) : (
                        <span className="class-muted">—</span>
                      )}
                    </td>
                    <td>
                      {l ? (
                        <ul className="finder-meta-chips">
                          <FilterChip label={l} active={filters.length.includes(l)} onToggle={() => toggleFilter('length', l)} />
                        </ul>
                      ) : (
                        <span className="class-muted">—</span>
                      )}
                    </td>
                    <td>
                      {d ? (
                        <ul className="finder-meta-chips">
                          <FilterChip label={d} active={filters.diameter.includes(d)} onToggle={() => toggleFilter('diameter', d)} />
                        </ul>
                      ) : (
                        <span className="class-muted">—</span>
                      )}
                    </td>
                    <td>
                      <ul className="finder-meta-chips">
                        <FilterChip
                          label={item.container}
                          className="is-container"
                          active={filters.container.includes(item.container)}
                          onToggle={() => toggleFilter('container', item.container)}
                        />
                      </ul>
                    </td>
                    <td>
                      <ul className="finder-meta-chips">
                        <FilterChip
                          label={item.feature}
                          className="is-feature"
                          active={filters.feature.includes(item.feature)}
                          onToggle={() => toggleFilter('feature', item.feature)}
                        />
                      </ul>
                    </td>
                    <td>
                      {item.colors.length ? (
                        <span className="class-colors">
                          {item.colors.slice(0, 6).map((color) => (
                            <span key={color} className="class-swatch-wrap" data-color={color}>
                              <button
                                type="button"
                                className={`class-swatch${filters.color.includes(color) ? ' is-active' : ''}`}
                                style={{ background: COLOR_SWATCH[color] ?? '#d7d3de' }}
                                aria-label={color}
                                aria-pressed={filters.color.includes(color)}
                                onClick={() => toggleFilter('color', color)}
                              />
                            </span>
                          ))}
                          {item.colors.length > 6 ? <span className="class-color-count">+{item.colors.length - 6}</span> : null}
                        </span>
                      ) : (
                        <span className="class-muted">—</span>
                      )}
                    </td>
                    <td className="class-price">
                      {priceUnit ? (
                        <>
                          <span className="class-price-amount">{priceAmount}</span>
                          <span className="class-price-unit">/{priceUnit}</span>
                        </>
                      ) : (
                        <span className="class-muted">{priceAmount}</span>
                      )}
                    </td>
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
                  )
                })
              ) : (
                <tr>
                  <td colSpan={10} className="class-none">
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

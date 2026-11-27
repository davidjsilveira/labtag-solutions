import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useStuckBar } from '@/useStuckBar'
import { CaretLeft, CaretRight, DownloadSimple, List, SquaresFour } from '@phosphor-icons/react'
import {
  CONTAINER_LABELS,
  findLabelClass,
  formatTemp,
  resistanceLabel,
  type LabelClass,
} from '@/content/labelFinder'
import { FINDER_PATH, SAMPLE_PATH, labtagClassUrl, productPath } from '@/content/labtagLinks'
import { ColumnSortIcon } from '@/pages/LabelFinderPage'
import { COLOR_SWATCH, JTTA_DESCRIPTION, JTTA_SHAPES, JTTA_SKUS, rollPriceFromUnit, type ClassSku } from '@/content/classMocks'
import { SHOP_CARD_IMAGES } from '@/content/shopCardImages'
import { dimMatches, dimsOf, sizeFieldLabel, sizeFieldsForShapes, sizeOf, type SizeField } from '@/content/classDims'

const CLASS_IMAGE = '/media/label-finder/class-placeholder.webp'
/** shortcut: shared class photos until per-class gallery assets exist */
const CLASS_GALLERY = [
  CLASS_IMAGE,
  '/media/cryogenic-labels/Cryogenic-Labels-5.jpg',
  '/media/cryogenic-labels/Automation-Labels-Vials.png',
]
const NOT_SPECIFIED = 'Not specified'

type ClassSortKey = 'model' | 'width' | 'length' | 'diameter' | 'colors' | 'price' | 'priceRoll'
type ClassSort = { key: ClassSortKey; dir: 'asc' | 'desc' }

/** Missing measurements/prices sort last in both directions. */
function sortValue(
  item: { model: string; width: number | null; dims: { l: string | null; d: string | null }; colors: string[]; price: string; priceRoll: string },
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
    case 'price':
    case 'priceRoll': {
      const amount = parseFloat((key === 'price' ? item.price : item.priceRoll).replace(/[^0-9.]/g, ''))
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

function ClassSkuCard({
  item,
  title,
  to,
  href,
  unmatched,
}: {
  item: ClassSku
  title: string
  to?: string
  href?: string
  unmatched?: boolean
}) {
  const size = sizeOf(item.dimensions)
  const extra = item.colors.length > 6 ? item.colors.length - 6 : 0
  const pack = item.price.includes('/set') ? item.price : rollPriceFromUnit(item.price)
  const [amount, unit] = pack.split('/')
  const className = `shop-card${unmatched ? ' is-unmatched' : ''}`
  const body = (
    <>
      <figure className="shop-card-media">
        <img src={item.image ?? CLASS_IMAGE} alt="" />
        {item.badges?.length ? (
          <ul className="shop-card-badges">
            {item.badges.map((badge) => (
              <li key={badge}>{badge}</li>
            ))}
          </ul>
        ) : null}
      </figure>
      <p className="shop-card-sku">#{item.model}</p>
      <h2>{title}</h2>
      <p className="shop-card-meta">
        {size !== 'N/A' ? size : item.dimensions} · {item.shape}
      </p>
      <ul className="shop-card-colors">
        {item.colors.length ? (
          <>
            {item.colors.slice(0, 6).map((color) => (
              <li key={color} data-tooltip={color} style={{ background: COLOR_SWATCH[color] ?? '#fff' }} />
            ))}
            {extra ? <span>+{extra}</span> : null}
          </>
        ) : (
          <li className="is-empty" />
        )}
      </ul>
      <p className="shop-card-price">
        <strong>
          {amount}
          {unit ? <em>/{unit}</em> : null}
        </strong>
        <span>{item.price}</span>
      </p>
    </>
  )
  if (to) {
    return (
      <Link className={className} to={to}>
        {body}
      </Link>
    )
  }
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {body}
    </a>
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
    const panelWidth = Math.min((filterKey === 'color' ? 34 : 18.5) * 16, window.innerWidth - 24)
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
    <div className={`finder-menu-filter${open || value.length ? ' is-active' : ''}`} ref={rootRef} data-finder-chip={filterKey}>
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

function ClassSizeFilter({
  shapes,
  values,
  onChange,
}: {
  shapes: string[]
  values: Record<SizeField, string[]>
  onChange: (key: SizeField, raw: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({})
  const fields = sizeFieldsForShapes(shapes)
  const active = fields.reduce((sum, key) => sum + (values[key][0] ? 1 : 0), 0)

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
  }, [open, values, shapes])

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

  return (
    <div className={`finder-menu-filter${open || active ? ' is-active' : ''}`} ref={rootRef} data-finder-chip="size">
      <button
        ref={buttonRef}
        type="button"
        className={`finder-chip finder-chip-action${active ? ' is-active' : ''}${open ? ' is-open' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>Dimensions</span>
        {active ? <span className="finder-chip-count">{active}</span> : null}
        <ChevronIcon />
      </button>
      {open ? (
        <div className="finder-menu-panel class-size-panel" style={panelStyle}>
          <div className="class-size-fields">
            {fields.map((key) => (
              <label key={key} className="class-size-field">
                <span>{sizeFieldLabel(key, shapes)}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder='e.g. 0.5"'
                  value={values[key][0] ?? ''}
                  onChange={(event) => onChange(key, event.target.value)}
                />
              </label>
            ))}
          </div>
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
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const catalogSkus = row.code === 'JTTA' ? JTTA_SKUS : null
  const isRollClass = /roll/i.test(row.formats)
  const isSheetClass = /sheet/i.test(row.formats)
  const formats = formatsOf(row)
  const fallbackContainers = row.containers.length ? row.containers.map((kind) => CONTAINER_LABELS[kind]) : [NOT_SPECIFIED]
  const fallbackFeatures = row.features.length ? row.features : [NOT_SPECIFIED]
  const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b))
  const classContainers = fallbackContainers.filter((item) => item !== NOT_SPECIFIED)
  const classFeature = row.features[0] ?? (catalogSkus ? unique(catalogSkus.map((item) => item.feature))[0] : null)
  const options: Record<ClassFilterKey, string[]> = catalogSkus
    ? {
        container: unique(catalogSkus.map((item) => item.container)),
        shape: [...JTTA_SHAPES],
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
  const [slide, setSlide] = useState(0)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'table' | 'grid'>('table')
  const [sort, setSort] = useState<ClassSort>({ key: 'width', dir: 'asc' })
  const toggleSort = (key: ClassSortKey) => {
    setSort((current) => ({ key, dir: current.key === key && current.dir === 'asc' ? 'desc' : 'asc' }))
  }
  const [filters, setFilters] = useState<Record<ClassFilterKey, string[]>>(() => {
    // Selections carried over from the label finder; keep only values this class offers.
    const carried = (param: string, valid: string[]) => searchParams.getAll(param).filter((value) => valid.includes(value))
    return {
      container: carried('containers', options.container),
      shape: [],
      width: [],
      length: [],
      diameter: [],
      feature: carried('feature', options.feature),
      color: [],
    }
  })
  const [allOpen, setAllOpen] = useState(false)
  const [overflowKeys, setOverflowKeys] = useState<Set<string>>(() => new Set())
  const toolbarRowRef = useRef<HTMLDivElement>(null)
  const [toolbarRef, toolbarStuck] = useStuckBar<HTMLDivElement>()
  const chipsHostRef = useRef<HTMLDivElement>(null)
  const [drawerSection, setDrawerSection] = useState<ClassFilterKey | 'size' | null>('container')
  const catalog = labtagClassUrl(row.code)
  const activeCount = Object.values(filters).reduce((sum, values) => sum + values.length, 0) + (query.trim() ? 1 : 0)
  const toggleFilter = (key: ClassFilterKey, option: string) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(option) ? current[key].filter((item) => item !== option) : [...current[key], option],
    }))
  }
  // Single-value rows: values within a filter are OR, filters combine with AND.
  const appliedChips = [
    ...CLASS_FILTERS.flatMap(({ key }) =>
      filters[key].map((value) => ({ id: `${key}:${value}`, label: value, filterKey: key, remove: () => toggleFilter(key, value) })),
    ),
    ...(['width', 'length', 'diameter'] as const).flatMap((key) =>
      filters[key].map((value) => ({ id: `${key}:${value}`, label: value, filterKey: key, remove: () => toggleFilter(key, value) })),
    ),
  ]
  const clearAll = () => {
    setFilters({ container: [], shape: [], width: [], length: [], diameter: [], feature: [], color: [] })
    setQuery('')
  }

  useLayoutEffect(() => {
    const recomputeOverflow = () => {
      const row = toolbarRowRef.current
      const host = chipsHostRef.current
      if (!row || !host) return
      const items = Array.from(host.querySelectorAll<HTMLElement>('[data-finder-chip]'))
      if (!items.length) return
      items.forEach((el) => {
        el.hidden = false
        el.classList.remove('is-collapsed')
      })
      void host.offsetWidth
      const styles = getComputedStyle(host)
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
      let available = host.clientWidth
      if (available <= 0) {
        const search = row.querySelector<HTMLElement>('.finder-search')
        const pinned = Array.from(row.children).filter((child) => child !== host && child !== search)
        const pinnedWidth = pinned.reduce((sum, child) => sum + (child as HTMLElement).getBoundingClientRect().width, 0)
        const searchWidth = search?.getBoundingClientRect().width ?? 0
        const rowGap = Number.parseFloat(getComputedStyle(row).columnGap || getComputedStyle(row).gap || '0') || 0
        const gaps = rowGap * Math.max(0, pinned.length + (search ? 1 : 0))
        available = Math.max(0, row.clientWidth - pinnedWidth - searchWidth - gaps)
      }
      let used = 0
      let fitting = true
      const next = new Set<string>()
      for (const el of items) {
        const key = el.dataset.finderChip ?? ''
        const width = el.getBoundingClientRect().width
        const nextUsed = used === 0 ? width : used + gap + width
        if (fitting && nextUsed <= available + 0.5) used = nextUsed
        else {
          fitting = false
          next.add(key)
        }
      }
      items.forEach((el) => {
        const collapsed = next.has(el.dataset.finderChip ?? '')
        el.hidden = collapsed
        el.classList.toggle('is-collapsed', collapsed)
      })
      setOverflowKeys((prev) => {
        if (prev.size === next.size && [...next].every((key) => prev.has(key))) return prev
        return next
      })
    }
    recomputeOverflow()
    const row = toolbarRowRef.current
    const host = chipsHostRef.current
    if (!row || !host) return
    const observer = new ResizeObserver(recomputeOverflow)
    observer.observe(row)
    observer.observe(host)
    window.addEventListener('resize', recomputeOverflow)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', recomputeOverflow)
    }
  }, [])

  const { rows, unmatched } = useMemo(() => {
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
    const sorted = source
      .map((item, index) => {
        const size = sizeOf(item.dimensions)
        return {
          ...item,
          id: item.model,
          headline: row.headline,
          size,
          dims: dimsOf(size),
          unmatched: false,
          priceRoll: rollPriceFromUnit(item.price),
          image: item.image ?? SHOP_CARD_IMAGES[index % SHOP_CARD_IMAGES.length] ?? CLASS_IMAGE,
        }
      })
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
    // Non-matching items stay visible, sorted underneath the matches.
    const isMatch = (item: (typeof sorted)[number]) =>
      matches(filters.container, [item.container]) &&
      dimMatches(filters.width, item.dims.w) &&
      dimMatches(filters.length, item.dims.l) &&
      dimMatches(filters.diameter, item.dims.d) &&
      matches(filters.shape, [item.shape]) &&
      matches(filters.feature, [item.feature]) &&
      matches(filters.color, item.colors.length ? item.colors : [NOT_SPECIFIED]) &&
      (!q || `${item.model} ${item.dimensions} ${item.shape} ${item.container} ${item.feature}`.toLowerCase().includes(q))
    return {
      rows: sorted.filter(isMatch),
      unmatched: sorted.filter((item) => !isMatch(item)).map((item) => ({ ...item, unmatched: true })),
    }
  }, [catalogSkus, fallbackContainers, fallbackFeatures, filters, formats, query, row.code, row.headline, row.productType, sort])

  const combined = [...rows, ...unmatched]
  const visible = combined
  const detail = row.code === 'JTTA' ? JTTA_DESCRIPTION : classDetail(row)

  return (
    <article className="class-page">
      <section className="class-hero catalog-masthead">
        <div className="class-hero-identity">
          <figure className="class-gallery">
            <img src={CLASS_GALLERY[slide]} alt="" width={960} height={640} />
            <button
              type="button"
              className="class-gallery-nav is-prev"
              aria-label="Previous image"
              onClick={() => setSlide((value) => (value + CLASS_GALLERY.length - 1) % CLASS_GALLERY.length)}
            >
              <CaretLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="class-gallery-nav is-next"
              aria-label="Next image"
              onClick={() => setSlide((value) => (value + 1) % CLASS_GALLERY.length)}
            >
              <CaretRight aria-hidden="true" />
            </button>
            <ol className="class-gallery-dots">
              {CLASS_GALLERY.map((_, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className={index === slide ? 'is-active' : undefined}
                    aria-label={`Show image ${index + 1}`}
                    aria-current={index === slide ? 'true' : undefined}
                    onClick={() => setSlide(index)}
                  />
                </li>
              ))}
            </ol>
          </figure>
          <div className="class-hero-copy">
            <div className="class-hero-title">
              <h1>{row.code}</h1>
              <p className="class-subtitle">{row.headline}</p>
            </div>
            <p className="class-lead">{detail}</p>
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
            <div className="class-hero-specs">
              <section className="class-fact">
                <h2>Brand</h2>
                <p className="class-spec-range">{row.brand}</p>
              </section>
              <section className="class-fact">
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
              <section className="class-fact">
                <h2>Resistances</h2>
                {row.resistances.length ? (
                  <p className="class-spec-range">{row.resistances.map(resistanceLabel).join(', ')}</p>
                ) : (
                  <span className="finder-empty">—</span>
                )}
              </section>
              <section className="class-fact">
                <h2>Printing Method</h2>
                {row.printers.length ? (
                  <p className="class-spec-range">{row.printers.join(', ')}</p>
                ) : (
                  <span className="finder-empty">—</span>
                )}
              </section>
              <section className="class-fact">
                <h2>Containers</h2>
                {classContainers.length ? (
                  <p className="class-spec-range">{classContainers.join(', ')}</p>
                ) : (
                  <span className="finder-empty">—</span>
                )}
              </section>
              <section className="class-fact">
                <h2>Feature</h2>
                {classFeature ? (
                  <p className="class-spec-range">{classFeature}</p>
                ) : (
                  <span className="finder-empty">—</span>
                )}
              </section>
            </div>
        </div>
      </section>

      <section className="class-catalog" aria-label={`${row.code} sizes`}>
        <div ref={toolbarRef} className={`class-catalog finder-toolbar${toolbarStuck ? ' is-stuck' : ''}`}>
        <div className="finder-toolbar-row" ref={toolbarRowRef}>
          <button
            type="button"
            className={`finder-chip finder-chip-action${allOpen || activeCount || overflowKeys.size ? ' is-active' : ''}${allOpen ? ' is-open' : ''}`}
            aria-expanded={allOpen}
            onClick={() => setAllOpen(true)}
          >
            <FiltersIcon />
            <span>All Filters</span>
            {activeCount ? <span className="finder-chip-count">{activeCount}</span> : null}
          </button>

          <div className="finder-toolbar-chips" ref={chipsHostRef}>
            {CLASS_FILTERS.map((filter) => (
              <ClassChipFilter
                key={filter.key}
                label={filter.label}
                filterKey={filter.key}
                options={options[filter.key]}
                value={filters[filter.key]}
                onChange={(next) => {
                  setFilters((current) => {
                    const updated = { ...current, [filter.key]: next }
                    if (filter.key === 'shape') {
                      const keep = new Set(sizeFieldsForShapes(next))
                      for (const key of ['width', 'length', 'diameter'] as const) {
                        if (!keep.has(key)) updated[key] = []
                      }
                    }
                    return updated
                  })
                  
                }}
              />
            ))}
            <ClassSizeFilter
              shapes={filters.shape}
              values={{ width: filters.width, length: filters.length, diameter: filters.diameter }}
              onChange={(key, raw) => {
                setFilters((current) => ({ ...current, [key]: raw.trim() ? [raw] : [] }))
                
              }}
            />
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
                {CLASS_FILTERS.map((filter) => {
                  const expanded = drawerSection === filter.key
                  const selectedCount = filters[filter.key].length
                  return (
                  <section key={filter.key} className={`finder-drawer-section${expanded ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="finder-drawer-section-trigger"
                      aria-expanded={expanded}
                      onClick={() => setDrawerSection((current) => (current === filter.key ? null : filter.key))}
                    >
                      <span>
                        {filter.label}
                        {selectedCount ? <em>{selectedCount}</em> : null}
                      </span>
                      <ChevronIcon />
                    </button>
                    {expanded ? (
                    <ul className="finder-drawer-options">
                      {options[filter.key].map((option) => {
                        const checked = filters[filter.key].includes(option)
                        return (
                          <li key={option}>
                            <button
                              type="button"
                              className={`finder-drawer-option${filter.key === 'color' ? ' is-color' : ''}${checked ? ' is-selected' : ''}`}
                              onClick={() => {
                                setFilters((current) => {
                                  const nextValues = checked
                                    ? current[filter.key].filter((item) => item !== option)
                                    : [...current[filter.key], option]
                                  const updated = { ...current, [filter.key]: nextValues }
                                  if (filter.key === 'shape') {
                                    const keep = new Set(sizeFieldsForShapes(nextValues))
                                    for (const key of ['width', 'length', 'diameter'] as const) {
                                      if (!keep.has(key)) updated[key] = []
                                    }
                                  }
                                  return updated
                                })
                                
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
                    ) : null}
                  </section>
                  )
                })}
                <section className={`finder-drawer-section${drawerSection === 'size' ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="finder-drawer-section-trigger"
                    aria-expanded={drawerSection === 'size'}
                    onClick={() => setDrawerSection((current) => (current === 'size' ? null : 'size'))}
                  >
                    <span>
                      Dimensions
                      {filters.width.length + filters.length.length + filters.diameter.length ? (
                        <em>{filters.width.length + filters.length.length + filters.diameter.length}</em>
                      ) : null}
                    </span>
                    <ChevronIcon />
                  </button>
                  {drawerSection === 'size' ? (
                    <div className="class-size-fields">
                      {sizeFieldsForShapes(filters.shape).map((key) => (
                        <label key={key} className="class-size-field">
                          <span>{sizeFieldLabel(key, filters.shape)}</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder='e.g. 0.5"'
                            value={filters[key][0] ?? ''}
                            onChange={(event) => {
                              const raw = event.target.value
                              setFilters((current) => ({ ...current, [key]: raw.trim() ? [raw] : [] }))
                              
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  ) : null}
                </section>
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
          <div className="class-view-toggle" role="group" aria-label="View">
            <button type="button" className={view === 'table' ? 'is-active' : undefined} aria-pressed={view === 'table'} onClick={() => setView('table')}>
              <List weight="bold" aria-hidden="true" />
              <span className="sr-only">Table</span>
            </button>
            <button type="button" className={view === 'grid' ? 'is-active' : undefined} aria-pressed={view === 'grid'} onClick={() => setView('grid')}>
              <SquaresFour weight="bold" aria-hidden="true" />
              <span className="sr-only">Grid</span>
            </button>
          </div>
        </div>

        {visible.length ? (
          <>
            <div className={`shop-grid class-sku-grid${view === 'table' ? ' is-desktop-hidden' : ''}`}>
              {visible.map((item) => (
                <ClassSkuCard
                  key={item.id}
                  item={item}
                  title={row.headline}
                  to={catalogSkus ? productPath(row.code, item.model) : undefined}
                  href={catalogSkus ? undefined : catalog}
                  unmatched={item.unmatched}
                />
              ))}
            </div>
            <div className={`class-table-wrap${view === 'grid' ? ' is-hidden' : ''}`}>
          <table className="class-table">
            <thead>
              <tr>
                <ClassSortHeader label="Product model" sortKey="model" sort={sort} onSort={toggleSort} />
                <ClassSortHeader label="Dimensions" sortKey="width" sort={sort} onSort={toggleSort} />
                {isRollClass ? <th>Labels across</th> : null}
                {isSheetClass ? (
                  <>
                    <th>Rows</th>
                    <th>Columns</th>
                  </>
                ) : null}
                <ClassSortHeader label="Available colors" sortKey="colors" sort={sort} onSort={toggleSort} />
                <ClassSortHeader label="Price" sortKey="price" sort={sort} onSort={toggleSort} className="class-price" />
                <th className="class-go" aria-label="View product" />
              </tr>
            </thead>
            <tbody>
              {visible.length ? (
                visible.map((item, index) => {
                  const [priceAmount, priceUnit] = item.price.split('/')
                  const [rollAmount, rollUnit] = item.priceRoll.split('/')
                  const showDivider = item.unmatched && (index === 0 || !visible[index - 1].unmatched)
                  return (
                  <Fragment key={item.id}>
                  {showDivider ? (
                    <tr className="class-unmatched-divider">
                      <td colSpan={5 + (isRollClass ? 1 : 0) + (isSheetClass ? 2 : 0)}>Not matching your filters</td>
                    </tr>
                  ) : null}
                  <tr
                    className={`class-row${item.unmatched ? ' is-unmatched' : ''}`}
                    onClick={() => {
                      if (catalogSkus) navigate(productPath(row.code, item.model))
                      else window.open(catalog, '_blank', 'noopener,noreferrer')
                    }}
                  >
                    <td className="class-sku">
                      <span className="class-model-cell">
                        <span className="finder-thumb" aria-hidden="true">
                          <img src={item.image ?? CLASS_IMAGE} alt="" width={72} height={72} loading="lazy" />
                        </span>
                        {catalogSkus ? (
                          <Link className="class-model" to={productPath(row.code, item.model)}>
                            {item.model}
                          </Link>
                        ) : (
                          <a className="class-model" href={catalog} target="_blank" rel="noreferrer">
                            {item.model}
                          </a>
                        )}
                      </span>
                    </td>
                    <td className="class-dims">
                      <span className="class-dims-stack">
                        {item.size && item.size !== 'N/A' ? item.size : <span className="class-muted">—</span>}
                        <button
                          type="button"
                          className={`class-dims-shape${filters.shape.includes(item.shape) ? ' is-active' : ''}`}
                          aria-pressed={filters.shape.includes(item.shape)}
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleFilter('shape', item.shape)
                          }}
                        >
                          {item.shape}
                        </button>
                      </span>
                    </td>
                    {isRollClass ? (
                      <td className="class-across">
                        {item.labelsAcross != null ? item.labelsAcross : <span className="class-muted">—</span>}
                      </td>
                    ) : null}
                    {isSheetClass ? (
                      <>
                        <td className="class-sheet-rows">
                          <span className="finder-stack-label">Rows</span>
                          {item.sheetRows != null ? item.sheetRows : <span className="class-muted">—</span>}
                        </td>
                        <td className="class-sheet-cols">
                          <span className="finder-stack-label">Columns</span>
                          {item.sheetCols != null ? item.sheetCols : <span className="class-muted">—</span>}
                        </td>
                      </>
                    ) : null}
                    <td className="class-colors-cell">
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
                                onClick={(event) => {
                                  event.stopPropagation()
                                  toggleFilter('color', color)
                                }}
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
                        <span>
                          <span className="class-price-amount">{priceAmount}</span>
                          <span className="class-price-unit">/{priceUnit}</span>
                        </span>
                      ) : (
                        <span className="class-muted">{priceAmount}</span>
                      )}
                      {rollUnit ? (
                        <span>
                          <span className="class-price-amount">{rollAmount}</span>
                          <span className="class-price-unit">/{rollUnit}</span>
                        </span>
                      ) : (
                        <span className="class-muted">{rollAmount}</span>
                      )}
                    </td>
                    <td className="class-go">
                      {catalogSkus ? (
                        <Link className="class-go-link" to={productPath(row.code, item.model)} aria-label={`View ${item.model}`}>
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
                        </Link>
                      ) : (
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
                      )}
                    </td>
                  </tr>
                  </Fragment>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="class-none">
                    No formats match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
          </>
        ) : (
          <p className="class-none">No formats match this filter.</p>
        )}
      </section>
    </article>
  )
}

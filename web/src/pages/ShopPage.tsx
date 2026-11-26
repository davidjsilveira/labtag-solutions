import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CaretLeft, CaretRight, MagnifyingGlass } from '@phosphor-icons/react'
import { SHOP_PATH, productPath } from '@/content/labtagLinks'
import { MdPager } from '@/components/MdPager'
import { COLOR_SWATCH, SHOP_MOCK_SKUS, rollPriceFromUnit, type ClassSku } from '@/content/classMocks'
import { dimMatches, dimsOf, sizeFieldLabel, sizeFieldsForShapes, sizeOf, type SizeField } from '@/content/classDims'
import { SHOP_DEPARTMENTS, SHOP_HOME, childrenOf, findShopCategory, isLabelListing, parentOf } from '@/content/shopCatalog'
import { findLabelClass, resistanceLabel } from '@/content/labelFinder'

const CLASS_IMAGE = '/media/label-finder/class-placeholder.webp'
const CLASS_ROW = findLabelClass('JTTA')

type ShopFilters = {
  shape: string[]
  width: string[]
  length: string[]
  diameter: string[]
  resistance: string[]
  printer: string[]
  feature: string[]
  color: string[]
  brand: string[]
  klass: string[]
}

const BLANK_FILTERS: ShopFilters = {
  shape: [],
  width: [],
  length: [],
  diameter: [],
  resistance: [],
  printer: [],
  feature: [],
  color: [],
  brand: [],
  klass: [],
}

const SHOP_FILTERS: { key: 'shape' | 'resistance' | 'printer' | 'feature' | 'color' | 'brand' | 'klass'; label: string }[] = [
  { key: 'shape', label: 'Shape' },
  { key: 'resistance', label: 'Resistance' },
  { key: 'printer', label: 'Printing Method' },
  { key: 'feature', label: 'Feature' },
  { key: 'color', label: 'Color' },
  { key: 'brand', label: 'Brand' },
  { key: 'klass', label: 'Class' },
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

const SHOP_LOGIC: Record<
  'shape' | 'resistance' | 'printer' | 'feature' | 'color' | 'brand' | 'klass' | 'size',
  { mode: 'and' | 'or'; note: string }
> = {
  shape: { mode: 'or', note: 'The product must match at least one of the specified shapes' },
  resistance: { mode: 'and', note: 'The product must resist to all selected resistances' },
  printer: { mode: 'or', note: 'The product must match at least one of the specified printing methods' },
  feature: { mode: 'and', note: 'The product must have all specified features' },
  color: { mode: 'or', note: 'The product must match at least one of the specified colors' },
  brand: { mode: 'or', note: 'The product must match at least one of the specified brands' },
  klass: { mode: 'or', note: 'The product must match at least one of the specified classes' },
  size: { mode: 'and', note: 'The product must match all specified dimensions' },
}

function FilterLogic({ mode, detail }: { mode: 'and' | 'or'; detail: string }) {
  return (
    <p className="finder-logic-note">
      <span className={`finder-logic is-${mode}`} title={detail}>
        {mode === 'and' ? 'Match all' : 'Match or'}
      </span>
      <span>{detail}</span>
    </p>
  )
}

type SortKey = 'popularity' | 'price-asc' | 'price-desc' | 'name'

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function matches(list: string[], value: string) {
  return !list.length || list.includes(value)
}

function ShopMenu({
  label,
  options,
  value,
  open,
  swatch,
  logicKey,
  collapsed,
  onOpen,
  onToggle,
}: {
  label: string
  options: string[]
  value: string[]
  open: boolean
  swatch?: boolean
  logicKey: keyof typeof SHOP_LOGIC
  collapsed?: boolean
  onOpen: () => void
  onToggle: (option: string) => void
}) {
  if (!options.length) return null
  const logic = SHOP_LOGIC[logicKey]
  return (
    <div
      className={`finder-menu-filter${open || value.length ? ' is-active' : ''}${collapsed ? ' is-collapsed' : ''}`}
      data-finder-chip={logicKey}
      hidden={collapsed}
    >
      <button
        type="button"
        className={`finder-chip finder-chip-action${value.length ? ' is-active' : ''}${open ? ' is-open' : ''}`}
        aria-expanded={open}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={onOpen}
      >
        <span>{label}</span>
        {value.length ? <span className="finder-chip-count">{value.length}</span> : null}
        <ChevronIcon />
      </button>
      {open ? (
        <div className="finder-menu-panel">
          <FilterLogic mode={logic.mode} detail={logic.note} />
          <ul className={`finder-menu-list${swatch ? ' is-color-grid' : ''}`}>
            {options.map((option) => {
              const checked = value.includes(option)
              return (
                <li key={option}>
                  <button
                    type="button"
                    className={`finder-menu-option${swatch ? ' is-color' : ''}${checked ? ' is-selected' : ''}`}
                    onClick={() => onToggle(option)}
                  >
                    <span className={`finder-menu-check${checked ? ' is-checked' : ''}`} aria-hidden="true" />
                    {swatch ? <span className="class-menu-swatch" style={{ background: COLOR_SWATCH[option] ?? '#d7d3de' }} aria-hidden="true" /> : null}
                    <span>{option}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

function ShopSizeMenu({
  shapes,
  values,
  open,
  collapsed,
  onOpen,
  onChange,
}: {
  shapes: string[]
  values: Record<SizeField, string[]>
  open: boolean
  collapsed?: boolean
  onOpen: () => void
  onChange: (key: SizeField, raw: string) => void
}) {
  const fields = sizeFieldsForShapes(shapes)
  const active = fields.reduce((sum, key) => sum + (values[key][0] ? 1 : 0), 0)
  return (
    <div
      className={`finder-menu-filter${open || active ? ' is-active' : ''}${collapsed ? ' is-collapsed' : ''}`}
      data-finder-chip="size"
      hidden={collapsed}
    >
      <button
        type="button"
        className={`finder-chip finder-chip-action${active ? ' is-active' : ''}${open ? ' is-open' : ''}`}
        aria-expanded={open}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={onOpen}
      >
        <span>Dimensions</span>
        {active ? <span className="finder-chip-count">{active}</span> : null}
        <ChevronIcon />
      </button>
      {open ? (
        <div className="finder-menu-panel">
          <FilterLogic mode={SHOP_LOGIC.size.mode} detail={SHOP_LOGIC.size.note} />
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

function ShopCard({ item, listing }: { item: ClassSku; listing: string }) {
  const size = sizeOf(item.dimensions)
  const extra = item.colors.length > 6 ? item.colors.length - 6 : 0
  const pack = item.price.includes('/set') ? item.price : rollPriceFromUnit(item.price)
  const [amount, unit] = pack.split('/')
  return (
    <Link className="shop-card" to={productPath(listing, item.model)}>
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
      <h2>{CLASS_ROW?.headline ?? 'Cryogenic Barcode Labels'}</h2>
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
    </Link>
  )
}

export function ShopPage() {
  const { category = '', model = '' } = useParams()
  const nested = childrenOf(category).some((item) => item.slug === model)
  const slug = nested ? model : category
  const page = findShopCategory(slug)
  const cat = page ?? SHOP_HOME
  const parent = parentOf(slug)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<ShopFilters>(BLANK_FILTERS)
  const [sort, setSort] = useState<SortKey>('popularity')
  const [menu, setMenu] = useState('')
  const [allOpen, setAllOpen] = useState(false)
  const [overflowKeys, setOverflowKeys] = useState<Set<string>>(() => new Set())
  const toolbarRowRef = useRef<HTMLDivElement>(null)
  const chipsHostRef = useRef<HTMLDivElement>(null)
  const [drawerSection, setDrawerSection] = useState<'shape' | 'resistance' | 'printer' | 'feature' | 'color' | 'brand' | 'klass' | 'size' | null>('shape')
  const [slide, setSlide] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const listPage = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const pageSize = [10, 25, 30, 50, 100].includes(Number(searchParams.get('limit')))
    ? Number(searchParams.get('limit'))
    : 30
  const setPager = (page: number, size = pageSize) => {
    const next = new URLSearchParams(location.search)
    if (page <= 1) next.delete('page')
    else next.set('page', String(page))
    if (size === 30) next.delete('limit')
    else next.set('limit', String(size))
    const search = next.toString()
    navigate({ pathname: location.pathname, search: search ? `?${search}` : '' })
  }
  const options = useMemo(
    () => ({
      shape: [...new Set(SHOP_MOCK_SKUS.map((item) => item.shape))],
      resistance: (CLASS_ROW?.resistances ?? []).map(resistanceLabel),
      printer: CLASS_ROW?.printers ?? [],
      feature: [...new Set(SHOP_MOCK_SKUS.map((item) => item.feature))],
      color: [...new Set(SHOP_MOCK_SKUS.flatMap((item) => item.colors))],
      brand: CLASS_ROW ? [CLASS_ROW.brand] : [],
      klass: CLASS_ROW ? [CLASS_ROW.code] : [],
    }),
    [],
  )
  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    const resistanceKeys = CLASS_ROW?.resistances ?? []
    const next = SHOP_MOCK_SKUS.filter((item) => {
      if (!matches(filters.shape, item.shape)) return false
      const dims = dimsOf(sizeOf(item.dimensions))
      if (!dimMatches(filters.width, dims.w)) return false
      if (!dimMatches(filters.length, dims.l)) return false
      if (!dimMatches(filters.diameter, dims.d)) return false
      if (filters.feature.length && !filters.feature.every((value) => value === item.feature)) return false
      if (filters.color.length && !filters.color.some((color) => item.colors.includes(color))) return false
      if (CLASS_ROW && !matches(filters.brand, CLASS_ROW.brand)) return false
      if (CLASS_ROW && !matches(filters.klass, CLASS_ROW.code)) return false
      if (filters.printer.length && CLASS_ROW && !filters.printer.some((name) => CLASS_ROW.printers.includes(name))) {
        return false
      }
      if (filters.resistance.length && CLASS_ROW) {
        const picked = filters.resistance
          .map((label) => resistanceKeys.find((key) => resistanceLabel(key) === label))
          .filter(Boolean)
        if (!picked.every((key) => CLASS_ROW.resistances.includes(key as string))) return false
      }
      if (!q) return true
      return `${item.model} ${item.shape} ${item.dimensions} ${item.feature} ${CLASS_ROW?.headline ?? ''}`
        .toLowerCase()
        .includes(q)
    })
    const sorted = [...next]
    if (sort === 'name') sorted.sort((a, b) => a.model.localeCompare(b.model, undefined, { numeric: true }))
    if (sort === 'price-asc' || sort === 'price-desc') {
      const dir = sort === 'price-asc' ? 1 : -1
      sorted.sort((a, b) => {
        const av = parseFloat(a.price.replace(/[^0-9.]/g, ''))
        const bv = parseFloat(b.price.replace(/[^0-9.]/g, ''))
        return (av - bv) * dir
      })
    }
    return sorted
  }, [query, filters, sort])
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(listPage, pageCount)
  const visibleItems = items.slice((safePage - 1) * pageSize, safePage * pageSize)
  const rangeStart = items.length ? (safePage - 1) * pageSize + 1 : 0
  const rangeEnd = Math.min(safePage * pageSize, items.length)
  const filterSig = `${slug}|${query}|${sort}|${JSON.stringify(filters)}`
  const skipPageReset = useRef(true)
  useEffect(() => {
    if (skipPageReset.current) {
      skipPageReset.current = false
      return
    }
    const next = new URLSearchParams(location.search)
    if (!next.has('page')) return
    next.delete('page')
    const search = next.toString()
    navigate({ pathname: location.pathname, search: search ? `?${search}` : '' }, { replace: true })
  }, [filterSig])
  const slides = useMemo(() => {
    const extras = childrenOf(slug).map((item) => item.image)
    const lead = cat.image.endsWith('.svg') ? [] : [cat.image]
    return [...lead, ...extras.filter((src) => src !== cat.image && !src.endsWith('.svg'))].slice(0, 3)
  }, [cat.image, slug])
  const toggle = (key: keyof ShopFilters, value: string) => {
    setFilters((current) => {
      if (key !== 'shape') return { ...current, [key]: toggleValue(current[key], value) }
      const shape = toggleValue(current.shape, value)
      const keep = new Set(sizeFieldsForShapes(shape))
      return {
        ...current,
        shape,
        width: keep.has('width') ? current.width : [],
        length: keep.has('length') ? current.length : [],
        diameter: keep.has('diameter') ? current.diameter : [],
      }
    })
  }
  const setSize = (key: SizeField, raw: string) => {
    setFilters((current) => ({ ...current, [key]: raw.trim() ? [raw] : [] }))
  }
  const openMenu = (id: string) => setMenu((current) => (current === id ? '' : id))
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
      const gap = Number.parseFloat(getComputedStyle(host).columnGap || getComputedStyle(host).gap || '0') || 0
      let available = host.clientWidth
      if (available <= 0) {
        const search = row.querySelector<HTMLElement>('.finder-search')
        const pinned = Array.from(row.children).filter((child) => child !== host && child !== search)
        const pinnedWidth = pinned.reduce((sum, child) => sum + (child as HTMLElement).getBoundingClientRect().width, 0)
        const searchWidth = search?.getBoundingClientRect().width ?? 0
        const rowGap = Number.parseFloat(getComputedStyle(row).columnGap || getComputedStyle(row).gap || '0') || 0
        available = Math.max(0, row.clientWidth - pinnedWidth - searchWidth - rowGap * Math.max(0, pinned.length + (search ? 1 : 0)))
      }
      let used = 0
      let fitting = true
      const next = new Set<string>()
      for (const el of items) {
        const width = el.getBoundingClientRect().width
        const nextUsed = used === 0 ? width : used + gap + width
        if (fitting && nextUsed <= available - 4) used = nextUsed
        else {
          fitting = false
          next.add(el.dataset.finderChip ?? '')
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
  }, [options, filters])
  useEffect(() => {
    if (!menu) return
    const onPointerDown = (event: MouseEvent) => {
      const node = event.target
      if (!(node instanceof Element)) return
      const host = node.closest('.finder-menu-filter')
      if (!host) {
        setMenu('')
        return
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu('')
    }
    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menu])
  const navCats = childrenOf(slug)
  const familyTrack = useRef<HTMLDivElement>(null)
  const [familyOverflow, setFamilyOverflow] = useState(false)
  const [familyShift, setFamilyShift] = useState(0)
  const [familyMax, setFamilyMax] = useState(0)
  useLayoutEffect(() => {
    const view = familyTrack.current
    const list = view?.querySelector('ul')
    if (!view || !list) return
    const measure = () => {
      const extra = Math.max(0, list.scrollWidth - view.clientWidth)
      setFamilyMax(extra)
      setFamilyOverflow(extra > 2)
      setFamilyShift((s) => Math.min(s, extra))
    }
    setFamilyShift(0)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(view)
    observer.observe(list)
    return () => observer.disconnect()
  }, [slug])
  const scrollFamilies = (dir: number) => {
    const card = familyTrack.current?.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + 16 : 216
    setFamilyShift((s) => Math.max(0, Math.min(familyMax, s + dir * step)))
  }
  const appliedChips = [
    ...SHOP_FILTERS.flatMap(({ key }) =>
      filters[key].map((value) => ({
        id: `${key}:${value}`,
        label: value,
        filterKey: key,
        remove: () => toggle(key, value),
      })),
    ),
    ...(['width', 'length', 'diameter'] as const).flatMap((key) =>
      filters[key].map((value) => ({
        id: `${key}:${value}`,
        label: `${sizeFieldLabel(key, filters.shape)} ${value}`,
        filterKey: key,
        remove: () => setSize(key, ''),
      })),
    ),
    ...(query.trim()
      ? [
          {
            id: `query:${query.trim()}`,
            label: query.trim(),
            filterKey: 'query',
            remove: () => setQuery(''),
          },
        ]
      : []),
  ]
  const clearAll = () => {
    setFilters(BLANK_FILTERS)
    setQuery('')
  }
  const activeCount = appliedChips.length

  if (!category) {
    return (
      <article className="shop-page shop-index">
        <div className="catalog-masthead">
          <section className="class-hero">
            <div className="class-hero-identity is-copy-only">
              <div className="class-hero-copy">
                <div className="class-hero-title">
                  <h1>{SHOP_HOME.title}</h1>
                </div>
                <p className="class-lead">{SHOP_HOME.blurb}</p>
              </div>
            </div>
          </section>
        </div>
        <ul className="shop-departments">
          {SHOP_DEPARTMENTS.map((dept) => (
            <li key={dept.slug}>
              <Link className="shop-department" to={`${SHOP_PATH}/${dept.slug}`}>
                <span className="shop-department-media">
                  <img src={dept.image} alt="" width={480} height={300} />
                </span>
                <b>{dept.title}</b>
                <p>{dept.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </article>
    )
  }

  if (!nested && parent) return <Navigate to={`${SHOP_PATH}/${parent}/${slug}`} replace />
  if (slug && !page) return <Navigate to={SHOP_PATH} replace />

  return (
    <article className="shop-page">
      <div className="catalog-masthead">
      <section className="class-hero">
        <div className={`class-hero-identity${slug === 'labels' ? ' is-copy-only' : ''}`}>
        {slug === 'labels' ? null : (
        <figure className="class-gallery">
          <img src={slides[slide] ?? cat.image} alt="" width={960} height={640} />
          {slides.length > 1 ? (
            <>
              <button
                type="button"
                className="class-gallery-nav is-prev"
                aria-label="Previous image"
                onClick={() => setSlide((value) => (value + slides.length - 1) % slides.length)}
              >
                <CaretLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                className="class-gallery-nav is-next"
                aria-label="Next image"
                onClick={() => setSlide((value) => (value + 1) % slides.length)}
              >
                <CaretRight aria-hidden="true" />
              </button>
              <ol className="class-gallery-dots">
                {slides.map((_, index) => (
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
            </>
          ) : null}
        </figure>
        )}
          <div className="class-hero-copy">
            <div className="class-hero-title">
              <h1>{cat.title}</h1>
            </div>
            <p className="class-lead">{cat.blurb}</p>
          </div>
        </div>
      </section>

      {navCats.length ? (
      <div className={`shop-family-carousel${familyShift <= 0 ? ' is-start' : ''}${familyShift >= familyMax - 1 ? ' is-end' : ''}`}>
        {familyOverflow && familyShift > 0 ? (
          <button type="button" className="shop-family-arrow is-prev" aria-label="Previous categories" onClick={() => scrollFamilies(-1)}>
            <CaretLeft weight="bold" aria-hidden="true" />
          </button>
        ) : null}
        <div className="shop-family-viewport" ref={familyTrack}>
        <ul className="shop-families" style={{ transform: `translateX(-${familyShift}px)` }}>
          {navCats.map((family) => (
            <li key={family.slug}>
              <Link
                className={`shop-family${cat.slug === family.slug ? ' is-current' : ''}`}
                to={slug === 'labels' ? `${SHOP_PATH}/${family.slug}` : `${SHOP_PATH}/${slug}/${family.slug}`}
              >
                <img src={family.image} alt="" width={320} height={200} />
                <span>
                  <b>{family.title}</b>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        </div>
        {familyOverflow && familyShift < familyMax - 1 ? (
          <button type="button" className="shop-family-arrow is-next" aria-label="Next categories" onClick={() => scrollFamilies(1)}>
            <CaretRight weight="bold" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      ) : null}
      </div>

      {isLabelListing(slug) ? (
      <>
      <div className="class-catalog finder-toolbar">
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
        <div className={`finder-menu-filter${menu === 'sort' ? ' is-active' : ''}`}>
          <button
            type="button"
            className={`finder-chip finder-chip-action${menu === 'sort' ? ' is-open' : ''}`}
            aria-expanded={menu === 'sort'}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={() => openMenu('sort')}
          >
            <span>{sort === 'popularity' ? 'Popularity' : sort === 'name' ? 'Name' : sort === 'price-asc' ? 'Price: low to high' : 'Price: high to low'}</span>
            <ChevronIcon />
          </button>
          {menu === 'sort' ? (
            <div className="finder-menu-panel">
              <ul className="finder-menu-list">
                {(
                  [
                    ['popularity', 'Popularity'],
                    ['name', 'Name'],
                    ['price-asc', 'Price: low to high'],
                    ['price-desc', 'Price: high to low'],
                  ] as const
                ).map(([key, label]) => (
                  <li key={key}>
                    <button
                      type="button"
                      className={`finder-menu-option${sort === key ? ' is-selected' : ''}`}
                      onClick={() => {
                        setSort(key)
                        setMenu('')
                      }}
                    >
                      <span className={`finder-menu-check${sort === key ? ' is-checked' : ''}`} aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="finder-toolbar-chips" ref={chipsHostRef}>
        <ShopMenu label="Shape" logicKey="shape" options={options.shape} value={filters.shape} open={menu === 'shape'} collapsed={overflowKeys.has('shape')} onOpen={() => openMenu('shape')} onToggle={(value) => toggle('shape', value)} />
        <ShopSizeMenu
          shapes={filters.shape}
          values={{ width: filters.width, length: filters.length, diameter: filters.diameter }}
          open={menu === 'size'}
          collapsed={overflowKeys.has('size')}
          onOpen={() => openMenu('size')}
          onChange={setSize}
        />
        <ShopMenu label="Resistance" logicKey="resistance" options={options.resistance} value={filters.resistance} open={menu === 'resistance'} collapsed={overflowKeys.has('resistance')} onOpen={() => openMenu('resistance')} onToggle={(value) => toggle('resistance', value)} />
        <ShopMenu label="Printing Method" logicKey="printer" options={options.printer} value={filters.printer} open={menu === 'printer'} collapsed={overflowKeys.has('printer')} onOpen={() => openMenu('printer')} onToggle={(value) => toggle('printer', value)} />
        <ShopMenu label="Feature" logicKey="feature" options={options.feature} value={filters.feature} open={menu === 'feature'} collapsed={overflowKeys.has('feature')} onOpen={() => openMenu('feature')} onToggle={(value) => toggle('feature', value)} />
        <ShopMenu label="Color" logicKey="color" options={options.color} value={filters.color} open={menu === 'color'} swatch collapsed={overflowKeys.has('color')} onOpen={() => openMenu('color')} onToggle={(value) => toggle('color', value)} />
        <ShopMenu label="Brand" logicKey="brand" options={options.brand} value={filters.brand} open={menu === 'brand'} collapsed={overflowKeys.has('brand')} onOpen={() => openMenu('brand')} onToggle={(value) => toggle('brand', value)} />
        <ShopMenu label="Class" logicKey="klass" options={options.klass} value={filters.klass} open={menu === 'klass'} collapsed={overflowKeys.has('klass')} onOpen={() => openMenu('klass')} onToggle={(value) => toggle('klass', value)} />
        </div>
        <label className="finder-search">
          <span className="sr-only">Search</span>
          <MagnifyingGlass className="finder-search-icon" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, SKU, or printing method"
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
              <section className={`finder-drawer-section${drawerSection === 'size' ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="finder-drawer-section-trigger"
                  aria-expanded={drawerSection === 'size'}
                  onClick={() => setDrawerSection((current) => (current === 'size' ? null : 'size'))}
                >
                  <span>
                    Dimensions
                    {(filters.width[0] ? 1 : 0) + (filters.length[0] ? 1 : 0) + (filters.diameter[0] ? 1 : 0) ? (
                      <em>{(filters.width[0] ? 1 : 0) + (filters.length[0] ? 1 : 0) + (filters.diameter[0] ? 1 : 0)}</em>
                    ) : null}
                  </span>
                  <ChevronIcon />
                </button>
                {drawerSection === 'size' ? (
                  <>
                    <FilterLogic mode={SHOP_LOGIC.size.mode} detail={SHOP_LOGIC.size.note} />
                    <div className="class-size-fields">
                    {sizeFieldsForShapes(filters.shape).map((key) => (
                      <label key={key} className="class-size-field">
                        <span>{sizeFieldLabel(key, filters.shape)}</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder='e.g. 0.5"'
                          value={filters[key][0] ?? ''}
                          onChange={(event) => setSize(key, event.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                  </>
                ) : null}
              </section>
              {SHOP_FILTERS.map((filter) => {
                const expandedSection = drawerSection === filter.key
                const selectedCount = filters[filter.key].length
                return (
                  <section key={filter.key} className={`finder-drawer-section${expandedSection ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="finder-drawer-section-trigger"
                      aria-expanded={expandedSection}
                      onClick={() => setDrawerSection((current) => (current === filter.key ? null : filter.key))}
                    >
                      <span>
                        {filter.label}
                        {selectedCount ? <em>{selectedCount}</em> : null}
                      </span>
                      <ChevronIcon />
                    </button>
                    {expandedSection ? (
                      <>
                        <FilterLogic mode={SHOP_LOGIC[filter.key].mode} detail={SHOP_LOGIC[filter.key].note} />
                        <ul className="finder-drawer-options">
                        {options[filter.key].map((option) => {
                          const checked = filters[filter.key].includes(option)
                          return (
                            <li key={option}>
                              <button
                                type="button"
                                className={`finder-drawer-option${filter.key === 'color' ? ' is-color' : ''}${checked ? ' is-selected' : ''}`}
                                onClick={() => toggle(filter.key, option)}
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
                      </>
                    ) : null}
                  </section>
                )
              })}
            </div>
            <footer className="finder-drawer-foot">
              <button
                type="button"
                className="finder-drawer-clear"
                onClick={clearAll}
                disabled={!activeCount}
              >
                Clear All
              </button>
              <button type="button" className="finder-drawer-apply" onClick={() => setAllOpen(false)}>
                View {items.length} results
              </button>
            </footer>
          </aside>
        </div>
      ) : null}

      <div className="finder-count-row">
        <p className="shop-count">
          Showing {rangeStart}–{rangeEnd} of {items.length} results
        </p>
        {appliedChips.length ? (
          <ul className="finder-applied">
            {appliedChips.map((chip, index) => {
              const previous = appliedChips[index - 1]
              const join = !previous
                ? null
                : previous.filterKey === chip.filterKey &&
                    chip.filterKey in SHOP_LOGIC &&
                    SHOP_LOGIC[chip.filterKey as keyof typeof SHOP_LOGIC].mode === 'or'
                  ? 'or'
                  : 'and'
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
      </div>

      <div className="shop-grid">
        {visibleItems.map((item) => (
          <ShopCard key={item.model} item={item} listing={slug} />
        ))}
      </div>
      <MdPager page={safePage} pageSize={pageSize} total={items.length} onPage={(page) => setPager(page)} onPageSize={(size) => setPager(1, size)} />
      </>
      ) : null}
    </article>
  )
}

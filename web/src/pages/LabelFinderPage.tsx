import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { classPath } from '@/content/labtagLinks'
import {
  CONTAINER_BLURBS,
  CONTAINER_KINDS,
  CONTAINER_LABELS,
  EMPTY_TEMP_RANGE,
  FINDER_FILTER_LABELS,
  FINDER_FILTER_ORDER,
  FINDER_FILTERS,
  FINDER_SORT_OPTIONS,
  FINDER_TABLE_COLUMNS,
  LABEL_CLASSES,
  TEMP_TAG_RANGE,
  columnSortFromToolbar,
  defaultColumnSortDirection,
  classSizeCount,
  formatTemp,
  isTempRangeEmpty,
  matchesTempRangeFilter,
  sortLabelClasses,
  sortLabelClassesByColumn,
  tempBarStyle,
  tempRangeActiveCount,
  resistanceClass,
  resistanceLabel,
  toolbarSortFromColumn,
  type FinderColumnSort,
  type FinderColumnSortKey,
  type FinderFilterKey,
  type FinderSort,
  type FinderTableColumn,
  type LabelClass,
  type TempRangeFilter,
  type TempTag,
} from '@/content/labelFinder'

type Filters = Partial<Record<Exclude<FinderFilterKey, 'temperatures'>, string[]>>

const FILTER_PARAM_KEYS = [
  'containers',
  'resistances',
  'feature',
  'printingMethods',
  'brands',
  'classes',
  'productType',
] as const

function stateFromFinderParams(params: URLSearchParams) {
  const filters: Filters = {}
  for (const key of FILTER_PARAM_KEYS) {
    const value = params.get(key)
    if (value) filters[key] = [value]
  }
  const tempRange = { ...EMPTY_TEMP_RANGE }
  const temp = params.get('temp')
  if (temp && temp in TEMP_TAG_RANGE) {
    const patch = TEMP_TAG_RANGE[temp as TempTag]
    if (patch.min) tempRange.min = patch.min
    if (patch.max) tempRange.max = patch.max
  }
  return { filters, tempRange }
}

function hasTempResistances(row: LabelClass) {
  // Temporary: hide classes with no temp range until that data is filled in.
  return row.tempMin != null && row.tempMax != null
}

const FILTER_LOGIC: Record<FinderFilterKey, { mode: 'and' | 'or'; note: string }> = {
  containers: {
    mode: 'and',
    note: 'The material must be applicable on all selected containers',
  },
  resistances: {
    mode: 'and',
    note: 'The material must resist to all selected resistances',
  },
  temperatures: {
    mode: 'and',
    note: 'The material must resist to all specified temperatures',
  },
  feature: {
    mode: 'and',
    note: 'The material must have all specified features',
  },
  printingMethods: {
    mode: 'or',
    note: 'The material must match at least one of the specified printing methods',
  },
  brands: {
    mode: 'or',
    note: 'The material must match at least one of the specified brands',
  },
  classes: {
    mode: 'or',
    note: 'The material must match at least one of the specified classes',
  },
  productType: {
    mode: 'or',
    note: 'The material must match at least one of the specified product types',
  },
}

function filterLogic(key: FinderFilterKey): 'and' | 'or' {
  return FILTER_LOGIC[key].mode
}

function filterLogicNote(key: FinderFilterKey) {
  return FILTER_LOGIC[key].note
}

function FilterLogic({ mode, detail }: { mode: 'and' | 'or'; detail: string }) {
  const label = mode === 'and' ? 'Match all' : 'Match or'
  return (
    <span className={`finder-logic is-${mode}`} title={detail}>
      {label}
    </span>
  )
}

function rowMatches(row: LabelClass, filters: Filters, query: string, tempRange: TempRangeFilter = EMPTY_TEMP_RANGE) {
  if (!hasTempResistances(row)) return false
  if (!matchesTempRangeFilter(row, tempRange)) return false

  const q = query.trim().toLowerCase()
  if (q) {
    const hay = `${row.code} ${row.name} ${row.headline} ${row.brand}`.toLowerCase()
    if (!hay.includes(q)) return false
  }

  for (const [key, values] of Object.entries(filters) as [keyof Filters, string[]][]) {
    if (!values?.length) continue
    if (key === 'containers' && !values.every((value) => row.containers.some((c) => CONTAINER_LABELS[c] === value))) return false
    if (key === 'resistances' && !values.every((value) => row.resistances.includes(value))) return false
    if (key === 'feature' && !values.every((value) => row.features.includes(value))) return false
    if (key === 'printingMethods' && !values.some((value) => row.printers.includes(value))) return false
    if (key === 'brands' && !values.includes(row.brand)) return false
    if (key === 'classes' && !values.includes(row.code)) return false
    if (key === 'productType' && !values.includes(row.productType)) return false
  }
  return true
}

function filterOptionCount(key: Exclude<FinderFilterKey, 'temperatures'>, option: string) {
  return LABEL_CLASSES.filter((row) => rowMatches(row, { [key]: [option] }, '')).length
}

function TempRangeFields({
  value,
  onChange,
  idPrefix = 'finder-temp',
}: {
  value: TempRangeFilter
  onChange: (next: TempRangeFilter) => void
  idPrefix?: string
}) {
  const fields: { key: keyof TempRangeFilter; label: string }[] = [
    { key: 'min', label: 'Min' },
    { key: 'max', label: 'Max' },
    { key: 'application', label: 'Application' },
  ]

  return (
    <div className="finder-temp-range">
      {fields.map(({ key, label }) => (
        <label key={key} className="finder-temp-range-field" htmlFor={`${idPrefix}-${key}`}>
          <span>{label}</span>
          <span className="finder-temp-range-input">
            <input
              id={`${idPrefix}-${key}`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              placeholder=""
              value={value[key]}
              onChange={(event) => {
                const nextValue = event.target.value.replace(/[^\d.+-]/g, '')
                onChange({
                  ...value,
                  [key]: nextValue,
                })
              }}
            />
            <em aria-hidden="true">°C</em>
          </span>
        </label>
      ))}
    </div>
  )
}

function useClickMenu(setOpen: Dispatch<SetStateAction<boolean>>) {
  const focusSearchRef = useRef(false)

  return {
    focusSearchRef,
    toggleByClick: () => {
      focusSearchRef.current = true
      setOpen((current) => !current)
    },
  }
}

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

function SearchIcon() {
  return (
    <svg className="finder-search-icon" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="m10.2 10.2 3.05 3.05" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4.2 4.2 11.8 11.8M11.8 4.2 4.2 11.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.25 8a4.75 4.75 0 1 0 1.2-3.15M3.25 3.4v2.9h2.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function setsEqual(a: Set<string>, b: Set<string>) {
  if (a.size !== b.size) return false
  for (const value of a) if (!b.has(value)) return false
  return true
}

function ChevronIcon() {
  return (
    <svg className="finder-chip-chevron" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M2.5 4.25 6 7.75l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ColumnSortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  const pointingDown = direction === 'desc'
  return (
    <svg className="finder-th-sort-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={pointingDown ? 'M7 10l5 5 5-5' : 'M7 14l5-5 5 5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={direction ? 1 : 0.45}
      />
    </svg>
  )
}

function FilterChip({
  label,
  active,
  className,
  onToggle,
}: {
  label: string
  active: boolean
  className?: string
  onToggle: () => void
}) {
  return (
    <li>
      <button
        type="button"
        className={`finder-meta-chip is-filter${active ? ' is-active' : ''}${className ? ` ${className}` : ''}`}
        aria-pressed={active}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onToggle()
        }}
      >
        {label}
      </button>
    </li>
  )
}

function FinderTableHeader({
  column,
  active,
  onSort,
}: {
  column: FinderTableColumn
  active: FinderColumnSort | null
  onSort: (key: FinderColumnSortKey) => void
}) {
  if (!column.sortKey) {
    return (
      <th scope="col" className={column.className}>
        <span className={`finder-th-button is-static${column.align === 'right' ? ' is-end' : ''}`}>
          <span>{column.label}</span>
        </span>
      </th>
    )
  }

  const isActive = active?.key === column.sortKey
  const direction = isActive ? active.direction : null
  const ariaSort = direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'

  return (
    <th
      scope="col"
      className={`finder-th-sortable ${column.className}`}
      aria-sort={ariaSort}
    >
      <button
        type="button"
        className={`finder-th-button${isActive ? ' is-active' : ''}${column.align === 'right' ? ' is-end' : ''}`}
        onClick={() => onSort(column.sortKey!)}
      >
        <span className={column.srOnly ? 'sr-only' : undefined}>{column.label}</span>
        <ColumnSortIcon direction={direction} />
      </button>
    </th>
  )
}

function RowChevronIcon() {
  return (
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
  )
}

const CLASS_PLACEHOLDER = '/media/label-finder/class-placeholder.webp'

function ContainersFilter({
  value,
  onChange,
  collapsed = false,
}: {
  value: string[]
  onChange: (next: string[]) => void
  collapsed?: boolean
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({})
  const clickMenu = useClickMenu(setOpen)

  const containerOptions = useMemo(
    () => CONTAINER_KINDS.filter((kind) => FINDER_FILTERS.containers.includes(CONTAINER_LABELS[kind])),
    [],
  )

  const counts = useMemo(
    () =>
      Object.fromEntries(
        containerOptions.map((kind) => [
          CONTAINER_LABELS[kind],
          filterOptionCount('containers', CONTAINER_LABELS[kind]),
        ]),
      ) as Record<string, number>,
    [containerOptions],
  )

  const visibleOptions = useMemo(
    () =>
      [...containerOptions].sort(
        (a, b) =>
          (counts[CONTAINER_LABELS[b]] ?? 0) - (counts[CONTAINER_LABELS[a]] ?? 0) ||
          CONTAINER_LABELS[a].localeCompare(CONTAINER_LABELS[b]),
      ),
    [containerOptions, counts],
  )

  const placePanel = () => {
    const button = buttonRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const panelWidth = Math.min(46 * 16, window.innerWidth - 24)
    const estimatedHeight = Math.min(window.innerHeight * 0.72, 34 * 16)
    const spaceBelow = window.innerHeight - rect.bottom - 12
    const spaceAbove = rect.top - 12
    const openUp = spaceBelow < estimatedHeight && spaceAbove > spaceBelow
    const left = Math.min(Math.max(12, rect.left), window.innerWidth - panelWidth - 12)
    setPanelStyle({
      position: 'fixed',
      top: openUp ? undefined : rect.bottom + 6,
      bottom: openUp ? window.innerHeight - rect.top + 6 : undefined,
      left,
      width: panelWidth,
      maxHeight: Math.min(estimatedHeight, openUp ? spaceAbove : spaceBelow),
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
    const onReposition = () => placePanel()
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  const toggle = (label: string) => {
    onChange(value.includes(label) ? value.filter((item) => item !== label) : [...value, label])
  }

  useEffect(() => {
    if (collapsed) setOpen(false)
  }, [collapsed])

  return (
    <div
      className={`finder-containers-menu${open || value.length ? ' is-active' : ''}${collapsed ? ' is-collapsed' : ''}`}
      ref={rootRef}
      data-finder-chip="containers"
      hidden={collapsed}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`finder-chip finder-chip-action${value.length ? ' is-active' : ''}${open ? ' is-open' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        tabIndex={collapsed ? -1 : 0}
        onClick={clickMenu.toggleByClick}
      >
        <span>Containers</span>
        {value.length ? <span className="finder-chip-count">{value.length}</span> : null}
        <ChevronIcon />
      </button>

      {open && !collapsed ? (
        <div className="finder-containers-panel" style={panelStyle} role="dialog" aria-label="Compatible containers">
          <div className="finder-containers-panel-top">
            <div className="finder-containers-panel-head">
              <div className="finder-containers-panel-copy">
                <strong>Compatible containers</strong>
                <p>Pick the vessels or surfaces these labels need to stick to.</p>
                <p className="finder-logic-note">
                  <FilterLogic mode="and" detail={filterLogicNote('containers')} />
                  <span>{filterLogicNote('containers')}</span>
                </p>
              </div>
              {value.length ? (
                <button type="button" className="finder-containers-clear" onClick={() => onChange([])}>
                  Clear ({value.length})
                </button>
              ) : null}
            </div>
          </div>
          <div className="finder-containers-panel-body">
            <ul className="finder-containers-options">
              {visibleOptions.map((kind) => {
                const label = CONTAINER_LABELS[kind]
                const checked = value.includes(label)
                const count = counts[label] ?? 0
                return (
                  <li key={kind}>
                    <label
                      className={`finder-containers-option${checked ? ' is-selected' : ''}${count === 0 ? ' is-empty' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(label)}
                      />
                      <span className="finder-containers-option-copy">
                        <span className="finder-containers-option-label">{label}</span>
                        <span className="finder-containers-option-blurb">{CONTAINER_BLURBS[kind]}</span>
                      </span>
                      <span className="finder-containers-option-count">{count}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function TemperaturesFilter({
  value,
  onChange,
  collapsed = false,
}: {
  value: TempRangeFilter
  onChange: (next: TempRangeFilter) => void
  collapsed?: boolean
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({})
  const clickMenu = useClickMenu(setOpen)
  const activeFields = tempRangeActiveCount(value)

  const placePanel = () => {
    const button = buttonRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const panelWidth = Math.min(22 * 16, window.innerWidth - 24)
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
  }, [open, activeFields])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onReposition = () => placePanel()

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  useEffect(() => {
    if (collapsed) setOpen(false)
  }, [collapsed])

  return (
    <div
      className={`finder-temp-menu${open || activeFields ? ' is-active' : ''}${collapsed ? ' is-collapsed' : ''}`}
      ref={rootRef}
      data-finder-chip="temperatures"
      hidden={collapsed}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`finder-chip finder-chip-action${activeFields ? ' is-active' : ''}${open ? ' is-open' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        tabIndex={collapsed ? -1 : 0}
        onClick={clickMenu.toggleByClick}
      >
        <span>Temperatures</span>
        {activeFields ? <span className="finder-chip-count">{activeFields}</span> : null}
        <ChevronIcon />
      </button>

      {open && !collapsed ? (
        <div className="finder-temp-panel" style={panelStyle} role="dialog" aria-label="Temperatures">
          <p className="finder-logic-note">
            <FilterLogic mode="and" detail={filterLogicNote('temperatures')} />
            <span>{filterLogicNote('temperatures')}</span>
          </p>
          <TempRangeFields value={value} onChange={onChange} idPrefix="finder-toolbar-temp" />
        </div>
      ) : null}
    </div>
  )
}

function SelectionMark({ checked, radio = false }: { checked: boolean; radio?: boolean }) {
  return (
    <span className={`finder-menu-check${radio ? ' is-radio' : ''}${checked ? ' is-checked' : ''}`} aria-hidden="true">
      {checked && !radio ? (
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
  )
}

function MenuFilter({
  filterKey,
  label,
  options,
  value,
  onChange,
  collapsed = false,
  searchable = true,
}: {
  filterKey: Exclude<FinderFilterKey, 'temperatures'>
  label: string
  options: readonly string[]
  value: string[]
  onChange: (next: string[]) => void
  collapsed?: boolean
  searchable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [filterQuery, setFilterQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({})
  const clickMenu = useClickMenu(setOpen)

  const counts = useMemo(
    () => Object.fromEntries(options.map((option) => [option, filterOptionCount(filterKey, option)])),
    [filterKey, options],
  )

  const filteredOptions = useMemo(() => {
    const q = filterQuery.trim().toLowerCase()
    if (!q) return options
    return options.filter((option) => option.toLowerCase().includes(q))
  }, [filterQuery, options])

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
    if (searchable && clickMenu.focusSearchRef.current) searchRef.current?.focus()

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onReposition = () => placePanel()

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) setFilterQuery('')
  }, [open])

  const choose = (option: string) => {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])
  }

  useEffect(() => {
    if (collapsed) setOpen(false)
  }, [collapsed])

  return (
    <div
      className={`finder-menu-filter${open || value.length ? ' is-active' : ''}${collapsed ? ' is-collapsed' : ''}`}
      ref={rootRef}
      data-finder-chip={filterKey}
      hidden={collapsed}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`finder-chip finder-chip-action${value.length ? ' is-active' : ''}${open ? ' is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={collapsed ? -1 : 0}
        onClick={clickMenu.toggleByClick}
      >
        <span>{label}</span>
        {value.length ? <span className="finder-chip-count">{value.length}</span> : null}
        <ChevronIcon />
      </button>

      {open && !collapsed ? (
        <div
          className="finder-menu-panel"
          style={panelStyle}
          role="listbox"
          aria-label={label}
          aria-multiselectable
        >
          {searchable ? (
            <>
              <label className="finder-menu-search">
                <span className="sr-only">Filter {label}</span>
                <SearchIcon />
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Filter..."
                  value={filterQuery}
                  onChange={(event) => setFilterQuery(event.target.value)}
                />
              </label>
              <div className="finder-menu-divider" aria-hidden="true" />
            </>
          ) : null}
          <p className="finder-logic-note">
            <FilterLogic mode={filterLogic(filterKey)} detail={filterLogicNote(filterKey)} />
            <span>{filterLogicNote(filterKey)}</span>
          </p>
          <ul className="finder-menu-list">
            {filteredOptions.map((option) => {
              const checked = value.includes(option)
              return (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={checked}
                    className={`finder-menu-option${checked ? ' is-selected' : ''}`}
                    onClick={() => choose(option)}
                  >
                    <SelectionMark checked={checked} />
                    <span className="finder-menu-option-label">{option}</span>
                    <span className="finder-menu-option-count">{counts[option] ?? 0}</span>
                  </button>
                </li>
              )
            })}
            {!filteredOptions.length ? (
              <li className="finder-menu-empty">No matches</li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export function LabelFinderPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const finderQuery = searchParams.toString()
  const [filters, setFilters] = useState<Filters>(() => stateFromFinderParams(searchParams).filters)
  const [tempRange, setTempRange] = useState<TempRangeFilter>(() => stateFromFinderParams(searchParams).tempRange)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<FinderSort>('Best Match')
  const [columnSort, setColumnSort] = useState<FinderColumnSort | null>(null)
  const [allOpen, setAllOpen] = useState(false)
  const [drawerSection, setDrawerSection] = useState<FinderFilterKey | null>('containers')
  const [overflowKeys, setOverflowKeys] = useState<Set<FinderFilterKey>>(() => new Set())
  const toolbarRowRef = useRef<HTMLDivElement>(null)
  const chipsHostRef = useRef<HTMLDivElement>(null)
  const sortSelectRef = useRef<HTMLSelectElement>(null)
  const sortMirrorRef = useRef<HTMLSpanElement>(null)

  const activeColumnSort = columnSort ?? columnSortFromToolbar(sort)

  useLayoutEffect(() => {
    const select = sortSelectRef.current
    const mirror = sortMirrorRef.current
    if (!select || !mirror) return
    select.style.width = `${Math.ceil(mirror.getBoundingClientRect().width) + 2}px`
  }, [sort])

  useLayoutEffect(() => {
    const row = toolbarRowRef.current
    const toolbar = row?.closest('.finder-toolbar')
    if (!(toolbar instanceof HTMLElement)) return
    const publish = () => {
      const height = Math.round(toolbar.getBoundingClientRect().height)
      if (height > 0) document.documentElement.style.setProperty('--finder-toolbar-h', `${height}px`)
    }
    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(toolbar)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const next = stateFromFinderParams(new URLSearchParams(finderQuery))
    setFilters(next.filters)
    setTempRange(next.tempRange)
  }, [finderQuery])

  const rows = useMemo(() => {
    const matched = LABEL_CLASSES.filter((row) => rowMatches(row, filters, query, tempRange))
    if (columnSort) return sortLabelClassesByColumn(matched, columnSort)
    return sortLabelClasses(matched, sort)
  }, [filters, query, sort, columnSort, tempRange])

  const handleToolbarSort = (next: FinderSort) => {
    setSort(next)
    setColumnSort(null)
  }

  const handleColumnSort = (key: FinderColumnSortKey) => {
    setColumnSort((prev) => {
      const current = prev ?? columnSortFromToolbar(sort)
      const next: FinderColumnSort =
        current?.key === key
          ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
          : { key, direction: defaultColumnSortDirection(key) }
      const toolbar = toolbarSortFromColumn(next)
      setSort(toolbar ?? 'Best Match')
      return next
    })
  }

  const appliedChips = useMemo(() => {
    const chips: { id: string; label: string; filterKey: FinderFilterKey | null; remove: () => void }[] = []
    for (const key of FINDER_FILTER_ORDER) {
      if (key === 'temperatures') continue
      for (const value of filters[key] ?? []) {
        chips.push({
          id: `${key}:${value}`,
          label: value,
          filterKey: key,
          remove: () => toggleFilterValue(key, value),
        })
      }
    }
    const tagFor = (field: 'min' | 'max', value: string) =>
      (Object.entries(TEMP_TAG_RANGE) as [TempTag, { min?: string; max?: string }][]).find(
        ([, patch]) => patch[field] === value,
      )?.[0]
    if (tempRange.min) {
      const tag = tagFor('min', tempRange.min)
      chips.push({
        id: `temp-min:${tempRange.min}`,
        label: tag ?? `${tempRange.min}°C`,
        filterKey: 'temperatures',
        remove: () => setTempRange((prev) => ({ ...prev, min: '' })),
      })
    }
    if (tempRange.max) {
      const tag = tagFor('max', tempRange.max)
      chips.push({
        id: `temp-max:${tempRange.max}`,
        label: tag ?? `${tempRange.max}°C`,
        filterKey: 'temperatures',
        remove: () => setTempRange((prev) => ({ ...prev, max: '' })),
      })
    }
    if (tempRange.application) {
      chips.push({
        id: `temp-app:${tempRange.application}`,
        label: `${tempRange.application}°C`,
        filterKey: 'temperatures',
        remove: () => setTempRange((prev) => ({ ...prev, application: '' })),
      })
    }
    const q = query.trim()
    if (q) {
      chips.push({
        id: `query:${q}`,
        label: q,
        filterKey: null,
        remove: () => setQuery(''),
      })
    }
    return chips
  }, [filters, query, tempRange])

  const activeCount = appliedChips.length

  const setFilter = (key: Exclude<FinderFilterKey, 'temperatures'>, value: string[]) => {
    setFilters((prev) => {
      const copy = { ...prev }
      if (!value.length) delete copy[key]
      else copy[key] = value
      return copy
    })
  }

  const toggleFilterValue = (key: Exclude<FinderFilterKey, 'temperatures'>, value: string) => {
    const current = filters[key] ?? []
    setFilter(
      key,
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

  const isFilterActive = (key: Exclude<FinderFilterKey, 'temperatures'>, value: string) =>
    (filters[key] ?? []).includes(value)

  const clearFilters = () => {
    setFilters({})
    setTempRange(EMPTY_TEMP_RANGE)
    setQuery('')
    setSort('Best Match')
    setColumnSort(null)
  }

  const recomputeOverflow = () => {
    const row = toolbarRowRef.current
    const host = chipsHostRef.current
    if (!row || !host) return
    const items = Array.from(host.querySelectorAll<HTMLElement>('[data-finder-chip]'))
    if (!items.length) return

    // Measure natural chip widths without letting overflow:hidden clip them.
    items.forEach((el) => {
      el.hidden = false
      el.classList.remove('is-collapsed')
      el.style.display = ''
    })
    void host.offsetWidth

    const styles = getComputedStyle(host)
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
    // Prefer the flex-allocated host width; fall back to row minus pinned controls.
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
    const next = new Set<FinderFilterKey>()

    for (const el of items) {
      const key = el.dataset.finderChip as FinderFilterKey
      const width = el.getBoundingClientRect().width
      const nextUsed = used === 0 ? width : used + gap + width
      if (fitting && nextUsed <= available + 0.5) {
        used = nextUsed
      } else {
        fitting = false
        next.add(key)
      }
    }

    items.forEach((el) => {
      const key = el.dataset.finderChip as FinderFilterKey
      const collapsed = next.has(key)
      el.hidden = collapsed
      el.classList.toggle('is-collapsed', collapsed)
      el.style.display = ''
    })

    setOverflowKeys((prev) => (setsEqual(prev, next) ? prev : next))
  }

  useLayoutEffect(() => {
    recomputeOverflow()
    const row = toolbarRowRef.current
    const host = chipsHostRef.current
    if (!row || !host) return

    const observer = new ResizeObserver(() => recomputeOverflow())
    observer.observe(row)
    observer.observe(host)
    window.addEventListener('resize', recomputeOverflow)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', recomputeOverflow)
    }
  }, [filters, sort, query])

  useEffect(() => {
    if (!allOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAllOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
    }
  }, [allOpen])

  const toggleDrawerOption = (key: Exclude<FinderFilterKey, 'temperatures'>, option: string) => {
    const current = filters[key] ?? []
    setFilter(key, current.includes(option) ? current.filter((item) => item !== option) : [...current, option])
  }

  return (
    <article className="finder-page">
      <header className="finder-head">
        <h1>Label Finder</h1>
        <p className="finder-lead">Find the right material class (label, tag, or tape)</p>
        <p>
          Compare material classes side by side, narrow them down with filters, then pick the size that
          fits your application.
        </p>
      </header>

      <section className="finder-toolbar" aria-label="Filter label classes">
        <div className="finder-toolbar-row" ref={toolbarRowRef}>
          <button
            type="button"
            className={`finder-chip finder-chip-action${allOpen || activeCount || overflowKeys.size ? ' is-active' : ''}${allOpen ? ' is-open' : ''}`}
            aria-expanded={allOpen}
            aria-controls="finder-all-filters"
            onClick={() => setAllOpen(true)}
          >
            <FiltersIcon />
            <span>All Filters</span>
            {activeCount ? <span className="finder-chip-count">{activeCount}</span> : null}
          </button>

          <label className="finder-chip finder-chip-select">
            <SortIcon />
            <span className="sr-only">Sort</span>
            <span ref={sortMirrorRef} className="finder-chip-select-mirror" aria-hidden="true">
              {sort}
            </span>
            <select
              ref={sortSelectRef}
              value={sort}
              onChange={(event) => handleToolbarSort(event.target.value as FinderSort)}
            >
              {FINDER_SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronIcon />
          </label>

          <div className="finder-toolbar-chips" ref={chipsHostRef}>
            {FINDER_FILTER_ORDER.map((key) => {
              if (key === 'containers') {
                return (
                  <ContainersFilter
                    key={key}
                    value={filters.containers ?? []}
                    onChange={(next) => setFilter('containers', next)}
                    collapsed={overflowKeys.has('containers')}
                  />
                )
              }
              if (key === 'temperatures') {
                return (
                  <TemperaturesFilter
                    key={key}
                    value={tempRange}
                    onChange={setTempRange}
                    collapsed={overflowKeys.has('temperatures')}
                  />
                )
              }
              return (
                <MenuFilter
                  key={key}
                  filterKey={key}
                  label={FINDER_FILTER_LABELS[key]}
                  options={FINDER_FILTERS[key]}
                  value={filters[key] ?? []}
                  onChange={(next) => setFilter(key, next)}
                  collapsed={overflowKeys.has(key)}
                />
              )
            })}
          </div>

          <label className="finder-search">
            <span className="sr-only">Quick search</span>
            <SearchIcon />
            <input
              type="search"
              placeholder="Quick search (class, brand, name)..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
      </section>

      {allOpen ? (
        <div className="finder-drawer-root">
          <button
            type="button"
            className="finder-drawer-backdrop"
            aria-label="Close all filters"
            onClick={() => setAllOpen(false)}
          />
          <aside id="finder-all-filters" className="finder-drawer" aria-label="All Filters">
            <header className="finder-drawer-head">
              <h2>All Filters</h2>
              <button type="button" className="finder-drawer-close" onClick={() => setAllOpen(false)}>
                <CloseIcon />
                <span className="sr-only">Close</span>
              </button>
            </header>

            <div className="finder-drawer-body">
              {FINDER_FILTER_ORDER.map((key) => {
                const selectedCount =
                  key === 'temperatures' ? tempRangeActiveCount(tempRange) : (filters[key]?.length ?? 0)
                const expanded = drawerSection === key
                return (
                  <section key={key} className={`finder-drawer-section${expanded ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="finder-drawer-section-trigger"
                      aria-expanded={expanded}
                      onClick={() => setDrawerSection((current) => (current === key ? null : key))}
                    >
                      <span>
                        {FINDER_FILTER_LABELS[key]}
                        {selectedCount ? <em>{selectedCount}</em> : null}
                      </span>
                      <ChevronIcon />
                    </button>
                    {expanded ? (
                      <>
                        {filterLogic(key) ? (
                          <p className="finder-logic-note">
                            <FilterLogic mode={filterLogic(key)} detail={filterLogicNote(key)} />
                            <span>{filterLogicNote(key)}</span>
                          </p>
                        ) : null}
                        {key === 'temperatures' ? (
                        <div className="finder-drawer-temp">
                          <TempRangeFields
                            value={tempRange}
                            onChange={setTempRange}
                            idPrefix="finder-drawer-temp"
                          />
                          {!isTempRangeEmpty(tempRange) ? (
                            <button
                              type="button"
                              className="finder-drawer-temp-clear"
                              onClick={() => setTempRange(EMPTY_TEMP_RANGE)}
                            >
                              Clear temperatures
                            </button>
                          ) : null}
                        </div>
                      ) : (
                        <ul className="finder-drawer-options">
                          {FINDER_FILTERS[key].map((option) => {
                            const checked = (filters[key] ?? []).includes(option)
                            return (
                              <li key={option}>
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked={checked}
                                  className={`finder-drawer-option${checked ? ' is-selected' : ''}`}
                                  onClick={() => toggleDrawerOption(key, option)}
                                >
                                  <SelectionMark checked={checked} />
                                  <span className="finder-drawer-option-label">{option}</span>
                                  <span className="finder-drawer-option-count">{filterOptionCount(key, option)}</span>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                        )}
                      </>
                    ) : null}
                  </section>
                )
              })}
            </div>

            <footer className="finder-drawer-foot">
              <button type="button" className="finder-drawer-clear" onClick={clearFilters} disabled={!activeCount}>
                <ClearIcon />
                <span>Clear All</span>
              </button>
              <button type="button" className="finder-drawer-apply" onClick={() => setAllOpen(false)}>
                View {rows.length.toLocaleString('en-US')} results
              </button>
            </footer>
          </aside>
        </div>
      ) : null}

      <div className="finder-count-row">
        <p className="finder-count" aria-live="polite">
          {rows.length.toLocaleString('en-US')} {rows.length === 1 ? 'result' : 'results'}
        </p>
        {appliedChips.length ? (
          <ul className="finder-applied">
            {appliedChips.map((chip, index) => {
              const previous = appliedChips[index - 1]
              const sameGroup = chip.filterKey != null && previous?.filterKey === chip.filterKey
              const join = !previous
                ? null
                : sameGroup && chip.filterKey && filterLogic(chip.filterKey) === 'or'
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
          <button type="button" className="finder-clear-all" onClick={clearFilters}>
            Clear all
          </button>
        ) : null}
      </div>

      {rows.length === 0 && activeCount ? (
        <div className="finder-no-results" role="status">
          <FiltersIcon />
          <h2>No materials and classes match your criteria</h2>
          <p>Try a different combination or clear your filters to explore all options.</p>
          <button type="button" className="finder-empty-clear" onClick={clearFilters}>
            <ClearIcon />
            Clear Filters
          </button>
        </div>
      ) : (
      <div className="finder-table-wrap">
        <table className="finder-table">
          <thead>
            <tr>
              {FINDER_TABLE_COLUMNS.map((column) => (
                <FinderTableHeader
                  key={column.id}
                  column={column}
                  active={activeColumnSort}
                  onSort={handleColumnSort}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const bar = tempBarStyle(row.tempMin, row.tempMax)
              return (
                <tr
                  key={row.id}
                  className="finder-row"
                  onClick={(event) => {
                    const target = event.target as HTMLElement
                    if (target.closest('a, button')) return
                    navigate(classPath(row.code))
                  }}
                >
                  <td className="finder-class">
                    <Link className="finder-class-link" to={classPath(row.code)}>
                      <span className="finder-thumb" aria-hidden="true">
                        <img src={CLASS_PLACEHOLDER} alt="" width={72} height={54} loading="lazy" />
                      </span>
                      <span className="finder-class-copy">
                        <strong className="finder-code">{row.code}</strong>
                        <span className="finder-title">{row.headline}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="finder-temp">
                    <span className="finder-temp-label">
                      {row.tempMin == null && row.tempMax == null ? (
                        <span className="finder-empty">—</span>
                      ) : (
                        <>
                          <strong>{formatTemp(row.tempMin)}</strong> to <strong>{formatTemp(row.tempMax)}</strong>
                        </>
                      )}
                    </span>
                    {row.tempMin != null && row.tempMax != null ? (
                      <span className="finder-temp-scale">
                        <span className="finder-temp-track" aria-hidden="true">
                          <span className="finder-temp-fill" style={bar} />
                        </span>
                        {row.tempApp != null ? (
                          <span className="finder-temp-app">
                            Min. Application Temp {formatTemp(row.tempApp)}
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                  </td>
                  <td className="finder-temp-tags">
                    <span className="finder-stack-label">Resistances</span>
                    {row.resistances.length ? (
                      <ul className="finder-meta-chips">
                        {row.resistances.map((item) => (
                          <FilterChip
                            key={item}
                            label={resistanceLabel(item)}
                            className={`is-resistance ${resistanceClass(item)}`}
                            active={isFilterActive('resistances', item)}
                            onToggle={() => toggleFilterValue('resistances', item)}
                          />
                        ))}
                      </ul>
                    ) : (
                      <span className="finder-empty">—</span>
                    )}
                  </td>
                  <td className="finder-features">
                    <span className="finder-stack-label">Features</span>
                    {row.features.length ? (
                      <ul className="finder-meta-chips">
                        {row.features.map((item) => (
                          <FilterChip
                            key={item}
                            label={item}
                            className="is-feature"
                            active={isFilterActive('feature', item)}
                            onToggle={() => toggleFilterValue('feature', item)}
                          />
                        ))}
                      </ul>
                    ) : (
                      <span className="finder-empty">—</span>
                    )}
                  </td>
                  <td className="finder-containers">
                    <span className="finder-stack-label">Containers</span>
                    {row.containers.length ? (
                      <ul className="finder-meta-chips">
                        {row.containers.map((kind) => {
                          const label = CONTAINER_LABELS[kind]
                          return (
                            <FilterChip
                              key={kind}
                              label={label}
                              className="is-container"
                              active={isFilterActive('containers', label)}
                              onToggle={() => toggleFilterValue('containers', label)}
                            />
                          )
                        })}
                      </ul>
                    ) : (
                      <span className="finder-empty">—</span>
                    )}
                  </td>
                  <td className="finder-print">
                    <span className="finder-stack-label">Printing Method</span>
                    {row.printers.length ? (
                      <ul className="finder-meta-chips">
                        {row.printers.map((method) => (
                          <FilterChip
                            key={method}
                            label={method}
                            className="is-print"
                            active={isFilterActive('printingMethods', method)}
                            onToggle={() => toggleFilterValue('printingMethods', method)}
                          />
                        ))}
                      </ul>
                    ) : (
                      <span className="finder-empty">—</span>
                    )}
                  </td>
                  <td className="finder-sizes">
                    <Link
                      className="finder-go"
                      to={classPath(row.code)}
                      aria-label={`View ${classSizeCount(row)} sizes for ${row.code}`}
                    >
                      <span className="finder-go-label">
                        View <span className="finder-go-count">{classSizeCount(row)}</span> Sizes
                      </span>
                      <RowChevronIcon />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      )}
    </article>
  )
}

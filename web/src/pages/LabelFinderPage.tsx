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
import { Link } from 'react-router-dom'
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
  formatSizeCount,
  formatTemp,
  isTempRangeEmpty,
  matchesTempRangeFilter,
  sortLabelClasses,
  sortLabelClassesByColumn,
  tempBarStyle,
  tempRangeActiveCount,
  tempTagClass,
  toolbarSortFromColumn,
  type ContainerKind,
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

function hasTempResistances(row: LabelClass) {
  // Temporary: hide classes with no temp range until that data is filled in.
  return row.tempMin != null && row.tempMax != null
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
    if (key === 'containers' && !row.containers.some((c) => values.includes(CONTAINER_LABELS[c]))) return false
    if (key === 'resistances' && !values.some((value) => row.resistances.includes(value))) return false
    if (key === 'feature' && !values.some((value) => row.features.includes(value))) return false
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
  return (
    <svg className="finder-th-sort-icon" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M3.25 4.6 6 2.2l2.75 2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={direction === 'asc' ? 1 : 0.35}
      />
      <path
        d="M3.25 7.4 6 9.8l2.75-2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={direction === 'desc' ? 1 : 0.35}
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
        <span className={column.srOnly ? 'sr-only' : undefined}>{column.label}</span>
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

function ContainerIcon({ kind, className }: { kind: ContainerKind; className?: string }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true as const,
  }
  const stroke = {
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (kind) {
    case 'cryo-boxes':
      return (
        <svg {...common}>
          <path d="M4.5 8.2 12 4.5l7.5 3.7v8.6L12 20.5 4.5 16.8V8.2Z" {...stroke} />
          <path d="M4.5 8.2 12 12l7.5-3.8M12 12v8.5" {...stroke} />
          <path d="M12 9.4v5.2M9.8 10.7 12 12.2l2.2-1.5M9.8 13.7 12 12.2l2.2 1.5" {...stroke} />
        </svg>
      )
    case 'storage-boxes':
      return (
        <svg {...common}>
          <path d="M5 9.2h14v9.3H5V9.2Z" {...stroke} />
          <path d="M5 9.2 12 5.4 19 9.2" {...stroke} />
          <path d="M9.2 13.2h5.6M9.2 16h5.6" {...stroke} />
        </svg>
      )
    case 'ivf-cryostraws':
      return (
        <svg {...common}>
          <path d="M8.2 3.5v14.2a1.8 1.8 0 0 0 3.6 0V3.5" {...stroke} />
          <path d="M14.8 3.5v14.2a1.8 1.8 0 0 0 3.6 0V3.5" {...stroke} />
          <path d="M8.2 7.2h3.6M14.8 7.2h3.6M8.2 11h3.6M14.8 11h3.6" {...stroke} />
          <path d="M7.2 3.5h5.6M13.8 3.5h5.6" {...stroke} />
        </svg>
      )
    case 'metal-racks':
      return (
        <svg {...common}>
          <path d="M5 4.5v15M19 4.5v15" {...stroke} />
          <path d="M5 7.2h14M5 11h14M5 14.8h14M5 18.5h14" {...stroke} />
          <circle cx="8.5" cy="7.2" r="1.15" fill="currentColor" />
          <circle cx="12" cy="11" r="1.15" fill="currentColor" />
          <circle cx="15.5" cy="14.8" r="1.15" fill="currentColor" />
          <circle cx="8.5" cy="18.5" r="1.15" fill="currentColor" />
        </svg>
      )
    case 'blood-bags':
      return (
        <svg {...common}>
          <path
            d="M9.2 3.4h5.6v2.1l1.7 1.4v10.2a2 2 0 0 1-2 2H9.5a2 2 0 0 1-2-2V6.9l1.7-1.4V3.4Z"
            {...stroke}
          />
          <path d="M10.1 3.4V2.4h3.8v1" {...stroke} />
          <path
            d="M12 9.1c-1.5 0-2.2 1.1-2.2 2.2S12 16.2 12 16.2s2.2-3.2 2.2-4.9S13.5 9.1 12 9.1Z"
            {...stroke}
          />
        </svg>
      )
    case 'syringes':
      return (
        <svg {...common}>
          <path d="M13.2 3.6 20 10.4" {...stroke} />
          <path d="M15.2 4.4l4 4" {...stroke} />
          <path d="M12.1 5.4 5.4 12.1l2.4 2.4 6.7-6.7" {...stroke} />
          <path d="M4.2 14.3 2.6 20.2l5.9-1.6" {...stroke} />
          <path d="M7.2 11.4l3.2 3.2M9.2 9.4l3.2 3.2" {...stroke} />
        </svg>
      )
    case 'plates':
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="14" rx="2" {...stroke} />
          <circle cx="7.5" cy="9.2" r="1.2" {...stroke} />
          <circle cx="12" cy="9.2" r="1.2" {...stroke} />
          <circle cx="16.5" cy="9.2" r="1.2" {...stroke} />
          <circle cx="7.5" cy="14.5" r="1.2" {...stroke} />
          <circle cx="12" cy="14.5" r="1.2" {...stroke} />
          <circle cx="16.5" cy="14.5" r="1.2" {...stroke} />
        </svg>
      )
    case 'sterilization-material':
      return (
        <svg {...common}>
          <path d="M6.2 7.2h11.6v10.6H6.2V7.2Z" {...stroke} />
          <path d="M8.2 7.2V5.4h7.6v1.8" {...stroke} />
          <path d="M9.2 11.2h5.6M9.2 14.2h5.6" {...stroke} />
          <path d="M12 3.5v1.4M9.6 4.2l.7 1.1M14.4 4.2l-.7 1.1" {...stroke} />
        </svg>
      )
    case 'tubes-vials':
      return (
        <svg {...common}>
          <path d="M8.4 5.2h7.2v12.2a1.8 1.8 0 0 1-1.8 1.8H10.2a1.8 1.8 0 0 1-1.8-1.8V5.2Z" {...stroke} />
          <path d="M10.2 5.2V3.6h3.6v1.6M8.4 9.2h7.2M10.1 12.8h3.8" {...stroke} />
        </svg>
      )
    case 'microscope-slides':
      return (
        <svg {...common}>
          <rect x="3.8" y="6.2" width="16.4" height="11.2" rx="1.2" {...stroke} />
          <circle cx="10.2" cy="11.8" r="2.6" {...stroke} />
          <path d="M14.4 9.2h3.4M14.4 11.8h3.4M14.4 14.4h2.4" {...stroke} />
        </svg>
      )
    case 'formalin-containers':
      return (
        <svg {...common}>
          <path
            d="M8.2 4.2h7.6v2.2l1.8 1.6v9.4a2.1 2.1 0 0 1-2.1 2.1H8.5a2.1 2.1 0 0 1-2.1-2.1V8l1.8-1.6V4.2Z"
            {...stroke}
          />
          <path d="M8.2 4.2V3h7.6v1.2M8.3 13.4h7.4" {...stroke} />
          <path d="M10.2 10.4c.7.9 1.5 1.4 2.8 1.4s2.1-.5 2.8-1.4" {...stroke} />
        </svg>
      )
    case 'resin-capsules':
      return (
        <svg {...common}>
          <path d="M8.2 6.2a3.8 3.8 0 0 1 7.6 0v11.2a3.8 3.8 0 0 1-7.6 0V6.2Z" {...stroke} />
          <path d="M8.2 11.8h7.6" {...stroke} />
          <path d="M9.8 7.6h4.4" {...stroke} />
        </svg>
      )
    case 'paraffin-wax':
      return (
        <svg {...common}>
          <path d="M5.2 16.8 7.1 6.4h9.8l1.9 10.4H5.2Z" {...stroke} />
          <path d="M7.8 10.4h8.4M6.9 13.6h10.2" {...stroke} />
          <path d="M9.4 6.4c.8-1.4 1.8-2.2 2.6-2.2s1.8.8 2.6 2.2" {...stroke} />
        </svg>
      )
    case 'wax-blocks':
      return (
        <svg {...common}>
          <path d="M5.2 8.4h13.6v9.2H5.2V8.4Z" {...stroke} />
          <path d="M5.2 8.4 12 4.8l6.8 3.6" {...stroke} />
          <path d="M8.4 12.2h7.2M8.4 15.2h7.2" {...stroke} />
        </svg>
      )
    case 'pcr-containers':
      return (
        <svg {...common}>
          <path d="M4.2 6.4h15.6v2.4l-1.2 9.4H5.4L4.2 8.8V6.4Z" {...stroke} />
          <path d="M7 10.4v5.6M12 10.4v5.6M17 10.4v5.6M6.2 7.8h11.6" {...stroke} />
        </svg>
      )
    case 'frozen-vials-surfaces':
      return (
        <svg {...common}>
          <path d="M8.6 5h6.8v12.4a1.7 1.7 0 0 1-1.7 1.7h-3.4A1.7 1.7 0 0 1 8.6 17.4V5Z" {...stroke} />
          <path d="M10.4 5V3.5h3.2V5" {...stroke} />
          <path d="M12 8.2v6.2M9.9 9.6 12 11l2.1-1.4M9.9 12.4 12 11l2.1 1.4" {...stroke} />
          <path d="M5.4 9.2 6.8 10.4M5.4 14.2 6.8 13M18.6 9.2 17.2 10.4M18.6 14.2 17.2 13" {...stroke} />
        </svg>
      )
    case 'microcentrifuge-tubes':
      return (
        <svg {...common}>
          <path
            d="M9.1 3.6h5.8l1.4 3.2v9.4a2.2 2.2 0 0 1-2.2 2.2h-4.2a2.2 2.2 0 0 1-2.2-2.2V6.8l1.4-3.2Z"
            {...stroke}
          />
          <path d="M7.8 6.8h8.4M10.2 11h3.6M10.8 14.2h2.4" {...stroke} />
        </svg>
      )
    case 'volumetric-labware':
      return (
        <svg {...common}>
          <path d="M9 3.6h6v3.2L18.4 19H5.6L9 6.8V3.6Z" {...stroke} />
          <path d="M8 10.4h8M7.2 13.4h9.6M6.5 16.4h11" {...stroke} />
        </svg>
      )
  }
}

function ContainersFilter({
  value,
  onChange,
  matchedCount,
  collapsed = false,
}: {
  value: string[]
  onChange: (next: string[]) => void
  matchedCount: number
  collapsed?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [filterQuery, setFilterQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({})
  const clickMenu = useClickMenu(setOpen)

  const containerOptions = useMemo(
    () =>
      CONTAINER_KINDS.filter((kind) => FINDER_FILTERS.containers.includes(CONTAINER_LABELS[kind])),
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

  const sortByPopularity = (kinds: ContainerKind[]) =>
    [...kinds].sort(
      (a, b) =>
        (counts[CONTAINER_LABELS[b]] ?? 0) - (counts[CONTAINER_LABELS[a]] ?? 0) ||
        CONTAINER_LABELS[a].localeCompare(CONTAINER_LABELS[b]),
    )

  const matchesQuery = (kind: ContainerKind, q: string) => {
    if (!q) return true
    return (
      CONTAINER_LABELS[kind].toLowerCase().includes(q) ||
      CONTAINER_BLURBS[kind].toLowerCase().includes(q)
    )
  }

  const visibleOptions = useMemo(() => {
    const q = filterQuery.trim().toLowerCase()
    return sortByPopularity(containerOptions.filter((kind) => matchesQuery(kind, q)))
  }, [containerOptions, filterQuery, counts])

  const placePanel = () => {
    const button = buttonRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const panelWidth = Math.min(48 * 16, window.innerWidth - 24)
    const estimatedHeight = Math.min(window.innerHeight * 0.72, 36 * 16)
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

  useEffect(() => {
    if (!open) return
    placePanel()
    if (clickMenu.focusSearchRef.current) searchRef.current?.focus()

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

  const toggle = (label: string) => {
    onChange(value.includes(label) ? value.filter((item) => item !== label) : [...value, label])
  }

  useEffect(() => {
    if (collapsed) setOpen(false)
  }, [collapsed])

  const renderOption = (kind: ContainerKind) => {
    const label = CONTAINER_LABELS[kind]
    const checked = value.includes(label)
    const count = counts[label] ?? 0
    return (
      <li key={kind}>
        <button
          type="button"
          role="option"
          aria-selected={checked}
          className={`finder-containers-option${checked ? ' is-selected' : ''}${count === 0 ? ' is-empty' : ''}`}
          onClick={() => toggle(label)}
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
          <span className="finder-containers-option-icon" aria-hidden="true">
            <ContainerIcon kind={kind} />
          </span>
          <span className="finder-containers-option-copy">
            <span className="finder-containers-option-label">{label}</span>
            <span className="finder-containers-option-blurb">{CONTAINER_BLURBS[kind]}</span>
          </span>
          <span className="finder-containers-option-count">{count}</span>
        </button>
      </li>
    )
  }

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
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={collapsed ? -1 : 0}
        onClick={clickMenu.toggleByClick}
      >
        <span>Containers</span>
        {value.length ? <span className="finder-chip-count">{value.length}</span> : null}
        <ChevronIcon />
      </button>

      {open && !collapsed ? (
        <div
          className="finder-containers-panel"
          style={panelStyle}
          role="listbox"
          aria-label="Compatible containers"
          aria-multiselectable="true"
        >
          <div className="finder-containers-panel-top">
            <div className="finder-containers-panel-head">
              <div className="finder-containers-panel-copy">
                <strong>Compatible containers</strong>
                <p>Pick the vessels or surfaces these labels need to stick to.</p>
              </div>
              {value.length ? (
                <button type="button" className="finder-containers-clear" onClick={() => onChange([])}>
                  Clear ({value.length})
                </button>
              ) : null}
            </div>

            <label className="finder-menu-search finder-containers-search">
              <span className="sr-only">Filter containers</span>
              <SearchIcon />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search containers..."
                value={filterQuery}
                onChange={(event) => setFilterQuery(event.target.value)}
              />
            </label>
          </div>

          <div className="finder-containers-panel-body">
            {visibleOptions.length ? (
              <ul className="finder-containers-options">{visibleOptions.map(renderOption)}</ul>
            ) : (
              <p className="finder-menu-empty">No matching containers</p>
            )}
          </div>

          <div className="finder-containers-panel-foot">
            <span className="finder-containers-foot-meta">
              {matchedCount.toLocaleString('en-US')}{' '}
              {matchedCount === 1 ? 'class matches' : 'classes match'}
            </span>
            <button type="button" className="finder-containers-done" onClick={() => setOpen(false)}>
              Done
            </button>
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

  useEffect(() => {
    if (!open) return
    placePanel()

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
          <TempRangeFields value={value} onChange={onChange} idPrefix="finder-toolbar-temp" />
        </div>
      ) : null}
    </div>
  )
}

function MenuFilter({
  filterKey,
  label,
  options,
  value,
  onChange,
  collapsed = false,
}: {
  filterKey: Exclude<FinderFilterKey, 'temperatures'>
  label: string
  options: readonly string[]
  value: string[]
  onChange: (next: string[]) => void
  collapsed?: boolean
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

  useEffect(() => {
    if (!open) return
    placePanel()
    if (clickMenu.focusSearchRef.current) searchRef.current?.focus()

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

  const toggle = (option: string) => {
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
        <div className="finder-menu-panel" style={panelStyle} role="listbox" aria-label={label} aria-multiselectable="true">
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
                    <span className="finder-menu-option-count">{counts[option] ?? 0}</span>
                  </button>
                </li>
              )
            })}
            {!filteredOptions.length ? <li className="finder-menu-empty">No matches</li> : null}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export function LabelFinderPage() {
  const [filters, setFilters] = useState<Filters>({})
  const [tempRange, setTempRange] = useState<TempRangeFilter>(EMPTY_TEMP_RANGE)
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

  const activeCount =
    Object.values(filters).reduce((sum, values) => sum + (values?.length ?? 0), 0) +
    tempRangeActiveCount(tempRange) +
    (query.trim() ? 1 : 0)

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

  const isTempTagActive = (tag: TempTag) => {
    const patch = TEMP_TAG_RANGE[tag]
    if (patch.min != null) return tempRange.min === patch.min
    if (patch.max != null) return tempRange.max === patch.max
    return false
  }

  const toggleTempTag = (tag: TempTag) => {
    const patch = TEMP_TAG_RANGE[tag]
    setTempRange((prev) => {
      const next = { ...prev }
      if (patch.min != null) next.min = prev.min === patch.min ? '' : patch.min
      if (patch.max != null) next.max = prev.max === patch.max ? '' : patch.max
      return next
    })
  }

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
    const row = toolbarRowRef.current
    const host = chipsHostRef.current
    if (!row || !host) return

    const frame = window.requestAnimationFrame(() => recomputeOverflow())
    const observer = new ResizeObserver(() => recomputeOverflow())
    observer.observe(row)
    observer.observe(host)
    window.addEventListener('resize', recomputeOverflow)
    return () => {
      window.cancelAnimationFrame(frame)
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
    setFilter(
      key,
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    )
  }

  return (
    <article className="finder-page">
      <header className="finder-head">
        <h1>Browse Laboratory Labels &amp; Materials</h1>
        <p>
          Explore our complete catalog of GA International material classes grouped by class code
          (e.g. JTTA, XAL), brand, and technical grade.
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
                    matchedCount={rows.length}
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
                      key === 'temperatures' ? (
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
                                  className={`finder-drawer-option${checked ? ' is-selected' : ''}`}
                                  onClick={() => toggleDrawerOption(key, option)}
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
                                  <span className="finder-drawer-option-label">{option}</span>
                                  <span className="finder-drawer-option-count">
                                    {filterOptionCount(key, option)}
                                  </span>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      )
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
          {rows.length} {rows.length === 1 ? 'class' : 'classes'}
          {activeCount ? ' match' : ''}
        </p>
        {activeCount ? (
          <button type="button" className="finder-clear-all" onClick={clearFilters}>
            Clear all filters
          </button>
        ) : null}
      </div>

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
                <tr key={row.id} className="finder-row">
                  <td className="finder-class">
                    <Link className="finder-class-link" to={row.href}>
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
                      <span className="finder-temp-track" aria-hidden="true">
                        <span className="finder-temp-fill" style={bar} />
                      </span>
                    ) : null}
                    {row.tempTags.length ? (
                      <ul className="finder-meta-chips">
                        {row.tempTags.map((tag: TempTag) => (
                          <FilterChip
                            key={tag}
                            label={tag}
                            className={`is-resistance ${tempTagClass(tag)}`}
                            active={isTempTagActive(tag)}
                            onToggle={() => toggleTempTag(tag)}
                          />
                        ))}
                      </ul>
                    ) : null}
                  </td>
                  <td className="finder-features">
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
                      to={row.href}
                      aria-label={`View ${formatSizeCount(row.formats)} sizes for ${row.code}`}
                    >
                      <span className="finder-go-label">
                        View <span className="finder-go-count">{formatSizeCount(row.formats)}</span> Sizes
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
    </article>
  )
}

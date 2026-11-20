import { JTTA_SKUS } from '@/content/classMocks'

export type ContainerKind =
  | 'cryo-boxes'
  | 'storage-boxes'
  | 'ivf-cryostraws'
  | 'metal-racks'
  | 'blood-bags'
  | 'syringes'
  | 'plates'
  | 'sterilization-material'
  | 'tubes-vials'
  | 'microscope-slides'
  | 'formalin-containers'
  | 'resin-capsules'
  | 'paraffin-wax'
  | 'wax-blocks'
  | 'pcr-containers'
  | 'frozen-vials-surfaces'
  | 'microcentrifuge-tubes'
  | 'volumetric-labware'

export type TempTag = 'Cryo' | 'Deep-Freeze' | 'Heat' | 'Autoclave'

/**
 * Temperature range filter drafts (raw input strings).
 * Parsed at match-time so partial values like "-" stay typeable.
 */
export type TempRangeFilter = {
  min: string
  max: string
  application: string
}

export const EMPTY_TEMP_RANGE: TempRangeFilter = {
  min: '',
  max: '',
  application: '',
}

/** Map table temp chips onto Min/Max range fields. */
export const TEMP_TAG_RANGE: Record<TempTag, Partial<Pick<TempRangeFilter, 'min' | 'max'>>> = {
  Cryo: { min: '-196' },
  'Deep-Freeze': { min: '-80' },
  Heat: { max: '150' },
  Autoclave: { max: '121' },
}

export type LabelClass = {
  id: string
  /** Class code shown as the row title (e.g. JTTA). */
  code: string
  name: string
  /** Class title shown in the Title column. */
  headline: string
  productType: 'Label' | 'Tag' | 'Tape'
  tempMin: number | null
  tempMax: number | null
  /** Minimum application temperature from the class export (°C). */
  tempApp: number | null
  tempTags: TempTag[]
  /** Full resistance labels from the class export (for filtering). */
  resistances: string[]
  /** Empty array renders as an em dash in the Features column. */
  features: string[]
  containers: ContainerKind[]
  printers: string[]
  /** Format packaging label (e.g. Roll, Sheet · Pack). */
  formats: string
  brand: string
  href: string
}

/** Count of available size/format options from the formats label. */
export function formatSizeCount(formats: string) {
  return formats
    .split(/[·,|/]/)
    .map((part) => part.trim())
    .filter(Boolean).length
}

/** Catalog size count when we have real SKUs; otherwise the formats label. */
export function classSizeCount(row: Pick<LabelClass, 'code' | 'formats'>) {
  if (row.code === 'JTTA') return JTTA_SKUS.length
  return formatSizeCount(row.formats)
}

/** Display order matches the LabTAG container taxonomy. */
export const CONTAINER_KINDS: ContainerKind[] = [
  'cryo-boxes',
  'storage-boxes',
  'ivf-cryostraws',
  'metal-racks',
  'blood-bags',
  'syringes',
  'plates',
  'sterilization-material',
  'tubes-vials',
  'microscope-slides',
  'formalin-containers',
  'resin-capsules',
  'paraffin-wax',
  'wax-blocks',
  'pcr-containers',
  'frozen-vials-surfaces',
  'microcentrifuge-tubes',
  'volumetric-labware',
]

export const CONTAINER_LABELS: Record<ContainerKind, string> = {
  'cryo-boxes': 'Cryo Boxes',
  'storage-boxes': 'Storage Boxes',
  'ivf-cryostraws': 'IVF Cryostraws',
  'metal-racks': 'Metal Racks',
  'blood-bags': 'Blood Bags',
  syringes: 'Syringes',
  plates: 'Plates',
  'sterilization-material': 'Sterilization Material',
  'tubes-vials': 'Tubes & Vials',
  'microscope-slides': 'Microscope Slides',
  'formalin-containers': 'Specimen Fixation Formalin Containers',
  'resin-capsules': 'Resin Capsules',
  'paraffin-wax': 'Paraffin Wax',
  'wax-blocks': 'Wax Blocks',
  'pcr-containers': 'PCR Containers',
  'frozen-vials-surfaces': 'Frozen Vials/Surfaces',
  'microcentrifuge-tubes': 'Microcentrifuge Tubes',
  'volumetric-labware': 'Volumetric Labware',
}

export const CONTAINER_BLURBS: Record<ContainerKind, string> = {
  'cryo-boxes': 'Cardboard or polycarbonate boxes for LN₂ and −80°C racks',
  'storage-boxes': 'General freezer and fridge storage boxes',
  'ivf-cryostraws': 'Narrow straws used in IVF cryopreservation',
  'metal-racks': 'Aluminum or stainless freezer racks and cane holders',
  'blood-bags': 'Blood and plasma bag surfaces',
  syringes: 'Plastic and glass syringes, barrels, and plungers',
  plates: 'Microplates, dishes, and multiwell labware',
  'sterilization-material': 'Wraps, trays, and instruments for autoclave cycles',
  'tubes-vials': 'Cryovials, centrifuge tubes, and general vials',
  'microscope-slides': 'Glass slides for histology and cytology',
  'formalin-containers': 'Specimen jars and formalin fixation containers',
  'resin-capsules': 'Embedding capsules for electron microscopy',
  'paraffin-wax': 'Paraffin embedding media and molds',
  'wax-blocks': 'Paraffin tissue blocks and cassettes',
  'pcr-containers': 'PCR tubes, strips, and plates',
  'frozen-vials-surfaces': 'Already-frozen vials and cold surfaces',
  'microcentrifuge-tubes': '0.5–2 mL conical microtubes',
  'volumetric-labware': 'Beakers, cylinders, flasks, and bottles',
}

export { LABEL_CLASSES } from './labelFinderClasses'

import { LABEL_CLASSES } from './labelFinderClasses'

const usedContainerKinds = CONTAINER_KINDS.filter((kind) =>
  LABEL_CLASSES.some((row) => row.containers.includes(kind)),
)

export const FINDER_FILTERS = {
  containers: usedContainerKinds.map((kind) => CONTAINER_LABELS[kind]),
  resistances: [...new Set(LABEL_CLASSES.flatMap((c) => c.resistances))].sort((a, b) =>
    a.localeCompare(b),
  ),
  temperatures: [] as string[],
  feature: [...new Set(LABEL_CLASSES.flatMap((c) => c.features))].sort((a, b) => a.localeCompare(b)),
  printingMethods: [...new Set(LABEL_CLASSES.flatMap((c) => c.printers))].sort((a, b) =>
    a.localeCompare(b),
  ),
  brands: [...new Set(LABEL_CLASSES.map((c) => c.brand))].sort((a, b) => a.localeCompare(b)),
  classes: [...new Set(LABEL_CLASSES.map((c) => c.code))].sort((a, b) => a.localeCompare(b)),
  productType: [...new Set(LABEL_CLASSES.map((c) => c.productType))].sort((a, b) =>
    a.localeCompare(b),
  ),
} as const

export type FinderFilterKey = keyof typeof FINDER_FILTERS

export const FINDER_FILTER_ORDER: FinderFilterKey[] = [
  'containers',
  'resistances',
  'temperatures',
  'feature',
  'printingMethods',
  'brands',
  'classes',
  'productType',
]

export const FINDER_FILTER_LABELS: Record<FinderFilterKey, string> = {
  containers: 'Containers',
  resistances: 'Resistances',
  temperatures: 'Temperatures',
  feature: 'Feature',
  printingMethods: 'Printing Methods',
  brands: 'Brands',
  classes: 'Classes',
  productType: 'Product type',
}

export const FINDER_SORT_OPTIONS = [
  'Best Match',
  'Name A–Z',
  'Name Z–A',
  'Coldest first',
  'Hottest first',
  'Most compatible',
  'Least compatible',
] as const

export type FinderSort = (typeof FINDER_SORT_OPTIONS)[number]

const TEMP_SCALE_MIN = -196
const TEMP_SCALE_MAX = 150
const TEMP_SPAN = TEMP_SCALE_MAX - TEMP_SCALE_MIN

export function tempBarStyle(min: number | null, max: number | null) {
  if (min == null || max == null) {
    return { left: '0%', width: '0%', opacity: 0.35 }
  }
  const left = ((min - TEMP_SCALE_MIN) / TEMP_SPAN) * 100
  const width = ((max - min) / TEMP_SPAN) * 100
  return {
    left: `${Math.max(0, Math.min(100, left))}%`,
    width: `${Math.max(0, Math.min(100 - Math.max(0, left), width))}%`,
  }
}

export function findLabelClass(code: string) {
  const key = code.trim().toLowerCase()
  return LABEL_CLASSES.find((row) => row.code.toLowerCase() === key || row.id === key)
}

export function formatTemp(celsius: number | null) {
  if (celsius == null) return '—'
  const sign = celsius > 0 ? '+' : ''
  return `${sign}${celsius}°C`
}

export function parseTempInput(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const normalized = trimmed.replace(/°C/gi, '').replace(/,/g, '').trim()
  if (!normalized || normalized === '+' || normalized === '-' || normalized === '.' || normalized === '-.') {
    return null
  }
  const num = Number(normalized)
  return Number.isFinite(num) ? num : null
}

export function tempRangeActiveCount(range: TempRangeFilter) {
  return (
    (parseTempInput(range.min) != null ? 1 : 0) +
    (parseTempInput(range.max) != null ? 1 : 0) +
    (parseTempInput(range.application) != null ? 1 : 0)
  )
}

export function isTempRangeEmpty(range: TempRangeFilter) {
  return tempRangeActiveCount(range) === 0
}

/**
 * Label service range [tempMin, tempMax] must cover the requested window.
 * Application: label must be applicable at that surface temperature.
 */
export function matchesTempRangeFilter(row: LabelClass, range: TempRangeFilter) {
  const min = parseTempInput(range.min)
  const max = parseTempInput(range.max)
  const application = parseTempInput(range.application)

  if (min != null || max != null) {
    if (row.tempMin == null || row.tempMax == null) return false
    const lo = row.tempMin
    const hi = row.tempMax
    // Each requested bound must fall inside the label's rated range.
    if (min != null && (min < lo || min > hi)) return false
    if (max != null && (max < lo || max > hi)) return false
    // Invalid user window.
    if (min != null && max != null && min > max) return false
  }

  if (application != null) {
    if (row.tempApp == null || row.tempApp > application) return false
  }
  return true
}

export const FINDER_COLUMN_SORT_KEYS = [
  'code',
  'title',
  'temperature',
  'tempTags',
  'features',
  'containers',
  'print',
  'sizes',
] as const

export type FinderColumnSortKey = (typeof FINDER_COLUMN_SORT_KEYS)[number]

export type FinderColumnSort = {
  key: FinderColumnSortKey
  direction: 'asc' | 'desc'
}

export type FinderTableColumn = {
  id: string
  label: string
  className: string
  sortKey?: FinderColumnSortKey
  align?: 'left' | 'right'
  /** Hide the label visually while keeping it available to assistive tech. */
  srOnly?: boolean
}

/** Single source of truth for finder table headers and column classes. */
export const FINDER_TABLE_COLUMNS: FinderTableColumn[] = [
  { id: 'class', label: 'Class', className: 'finder-class', sortKey: 'code' },
  {
    id: 'temperature',
    label: 'Temp Range',
    className: 'finder-temp',
  },
  {
    id: 'resistances',
    label: 'Resistances',
    className: 'finder-temp-tags',
  },
  { id: 'features', label: 'Features', className: 'finder-features' },
  {
    id: 'containers',
    label: 'Containers',
    className: 'finder-containers',
  },
  { id: 'print', label: 'Printing Method', className: 'finder-print' },
  {
    id: 'sizes',
    label: 'Sizes',
    className: 'finder-sizes',
    sortKey: 'sizes',
    align: 'right',
  },
]

function compareText(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true })
}

function joinList(values: string[]) {
  return values.join(', ')
}

export function sortLabelClassesByColumn(rows: LabelClass[], sort: FinderColumnSort) {
  const next = [...rows]
  const dir = sort.direction === 'asc' ? 1 : -1
  const minOr = (value: number | null, fallback: number) => (value == null ? fallback : value)
  const maxOr = (value: number | null, fallback: number) => (value == null ? fallback : value)

  next.sort((a, b) => {
    let result = 0
    switch (sort.key) {
      case 'code':
        result = compareText(a.code, b.code)
        break
      case 'title':
        result = compareText(a.headline, b.headline) || compareText(a.code, b.code)
        break
      case 'temperature':
        result =
          minOr(a.tempMin, Number.POSITIVE_INFINITY) - minOr(b.tempMin, Number.POSITIVE_INFINITY) ||
          maxOr(a.tempMax, Number.POSITIVE_INFINITY) - maxOr(b.tempMax, Number.POSITIVE_INFINITY)
        break
      case 'tempTags':
        result = compareText(joinList(a.resistances), joinList(b.resistances)) || compareText(a.code, b.code)
        break
      case 'features':
        result = compareText(joinList(a.features), joinList(b.features)) || compareText(a.code, b.code)
        break
      case 'containers':
        result =
          a.containers.length - b.containers.length ||
          compareText(
            joinList(a.containers.map((kind) => CONTAINER_LABELS[kind])),
            joinList(b.containers.map((kind) => CONTAINER_LABELS[kind])),
          ) ||
          compareText(a.code, b.code)
        break
      case 'print':
        result = compareText(joinList(a.printers), joinList(b.printers)) || compareText(a.code, b.code)
        break
      case 'sizes':
        result =
          classSizeCount(a) - classSizeCount(b) ||
          compareText(a.formats, b.formats) ||
          compareText(a.code, b.code)
        break
      default:
        result = 0
    }
    return result * dir
  })

  return next
}

function pinClass(rows: LabelClass[], code: string) {
  const index = rows.findIndex((row) => row.code === code)
  if (index <= 0) return rows
  const next = rows.slice()
  const [row] = next.splice(index, 1)
  next.unshift(row)
  return next
}

export function sortLabelClasses(rows: LabelClass[], sort: FinderSort) {
  switch (sort) {
    case 'Best Match':
      // Default catalog view leads with the class that has a full size table.
      return pinClass(sortLabelClassesByColumn(rows, { key: 'sizes', direction: 'desc' }), 'JTTA')
    case 'Name A–Z':
      return sortLabelClassesByColumn(rows, { key: 'code', direction: 'asc' })
    case 'Name Z–A':
      return sortLabelClassesByColumn(rows, { key: 'code', direction: 'desc' })
    case 'Coldest first':
      return sortLabelClassesByColumn(rows, { key: 'temperature', direction: 'asc' })
    case 'Hottest first':
      return sortLabelClassesByColumn(rows, { key: 'temperature', direction: 'desc' })
    case 'Most compatible':
      return sortLabelClassesByColumn(rows, { key: 'containers', direction: 'desc' })
    case 'Least compatible':
      return sortLabelClassesByColumn(rows, { key: 'containers', direction: 'asc' })
    default:
      return [...rows]
  }
}

export function columnSortFromToolbar(sort: FinderSort): FinderColumnSort | null {
  switch (sort) {
    case 'Best Match':
      return { key: 'sizes', direction: 'desc' }
    case 'Name A–Z':
      return { key: 'code', direction: 'asc' }
    case 'Name Z–A':
      return { key: 'code', direction: 'desc' }
    case 'Coldest first':
      return { key: 'temperature', direction: 'asc' }
    case 'Hottest first':
      return { key: 'temperature', direction: 'desc' }
    case 'Most compatible':
      return { key: 'containers', direction: 'desc' }
    case 'Least compatible':
      return { key: 'containers', direction: 'asc' }
    default:
      return null
  }
}

export function toolbarSortFromColumn(sort: FinderColumnSort): FinderSort | null {
  if (sort.key === 'code') return sort.direction === 'asc' ? 'Name A–Z' : 'Name Z–A'
  if (sort.key === 'temperature') return sort.direction === 'asc' ? 'Coldest first' : 'Hottest first'
  if (sort.key === 'containers') return sort.direction === 'desc' ? 'Most compatible' : 'Least compatible'
  if (sort.key === 'sizes') return sort.direction === 'desc' ? 'Best Match' : null
  return null
}

/** First click on these columns prefers the more useful direction. */
export function defaultColumnSortDirection(key: FinderColumnSortKey): 'asc' | 'desc' {
  if (key === 'containers' || key === 'sizes') return 'desc'
  if (key === 'temperature') return 'asc'
  return 'asc'
}

export function tempTagClass(tag: TempTag) {
  switch (tag) {
    case 'Cryo':
      return 'is-cryo'
    case 'Deep-Freeze':
      return 'is-deep-freeze'
    case 'Heat':
      return 'is-heat'
    case 'Autoclave':
      return 'is-autoclave'
  }
}

/** Short chip label for a resistance filter value. */
export function resistanceLabel(value: string) {
  if (value.startsWith('Cryogenic')) return 'Cryo'
  if (value.startsWith('Deep-Freeze')) return 'Deep-Freeze'
  if (value.startsWith('Heat')) return 'Heat'
  if (value.startsWith('Autoclave')) return 'Autoclave'
  return value
}

/** Color class for each resistance category in the filter list. */
export function resistanceClass(value: string) {
  if (value.startsWith('Cryogenic')) return 'is-cryo'
  if (value.startsWith('Deep-Freeze')) return 'is-deep-freeze'
  if (value.startsWith('Heat')) return 'is-heat'
  if (value.startsWith('Autoclave')) return 'is-autoclave'
  if (value === 'Alcohol Wiping') return 'is-alcohol-wipe'
  if (value === 'Alcohol Immersion') return 'is-alcohol-immersion'
  if (value === 'Xylene & Chemicals') return 'is-xylene'
  if (value === 'Acid & Base') return 'is-acid'
  if (value === 'Gamma Irradiation') return 'is-gamma'
  if (value === 'Histology Stains') return 'is-histo'
  if (value === 'Oil') return 'is-oil'
  if (value === 'Abrasion/Scratching') return 'is-abrasion'
  return 'is-feature'
}

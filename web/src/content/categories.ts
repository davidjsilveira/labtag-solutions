import { isCombinedCatalogSlug } from '@/content/legacyMap'
import { legacyPages, solutionPages } from '@/content/loadPages'
import type { SolutionPage } from '@/content/types'

export type BrowseFilterId =
  | 'all'
  | 'cryogenic'
  | 'deep-freeze'
  | 'biobanking'
  | 'vaccines'
  | 'clinical'
  | 'pcr'
  | 'histology'
  | 'autoclave'
  | 'constructs'
  | 'tracking'
  | 'printers'
  | 'automation'
  | 'custom'
  | 'industries'

export type BrowseFilter = {
  id: BrowseFilterId
  label: string
  /** When omitted, the filter shows every page (All). Pages may appear in multiple themes. */
  slugs?: string[]
}

/** Thematic chips for the home “Browse all” carousel — not URL categories. */
export const browseFilters: BrowseFilter[] = [
  { id: 'all', label: 'All' },
  {
    id: 'cryogenic',
    label: 'Cryogenic',
    slugs: ['cryogenic', 'cryostuck-labels', 'biobanking', 'ivf', 'clinical-trials'],
  },
  {
    id: 'deep-freeze',
    label: 'Deep-freeze',
    slugs: ['deep-freeze-labels', 'vaccines', 'cryogenic', 'cryostuck-labels'],
  },
  {
    id: 'biobanking',
    label: 'Biobanking',
    slugs: ['biobanking', 'ivf', 'clinical-trials', 'cryogenic', 'rfid'],
  },
  {
    id: 'vaccines',
    label: 'Vaccines',
    slugs: ['vaccines', 'clinical-trials', 'deep-freeze-labels'],
  },
  {
    id: 'clinical',
    label: 'Clinical',
    slugs: ['clinical-trials', 'histology', 'vaccines'],
  },
  {
    id: 'pcr',
    label: 'PCR',
    slugs: ['pcr', 'laboratory', 'cryogenic'],
  },
  {
    id: 'histology',
    label: 'Histology',
    slugs: ['histology', 'resin-labels'],
  },
  {
    id: 'autoclave',
    label: 'Autoclave',
    slugs: ['autoclave', 'laboratory', 'industrial'],
  },
  {
    id: 'constructs',
    label: 'Specialty',
    slugs: [
      'snappeel',
      'resin-labels',
      'laboratory-tapes',
      'cryostuck-labels',
      'hard-to-stick',
      'dymo-labels',
    ],
  },
  {
    id: 'tracking',
    label: 'RFID',
    slugs: ['rfid', 'biobanking', 'clinical-trials'],
  },
  {
    id: 'printers',
    label: 'Printers',
    slugs: ['label-printing', 'dymo-labels'],
  },
  {
    id: 'automation',
    label: 'Automation',
    slugs: ['automated-labware', 'label-printing'],
  },
  {
    id: 'custom',
    label: 'Custom',
    slugs: ['custom-labels', 'clinical-trials', 'automated-labware', 'label-printing'],
  },
  {
    id: 'industries',
    label: 'Industries',
    slugs: ['animal-health', 'industrial', 'chemical-containers', 'cannabis', 'laboratory'],
  },
]

export function pagesForBrowseFilter(filterId: BrowseFilterId): SolutionPage[] {
  if (filterId === 'all') return pagesForBrowseAll()

  const filter = browseFilters.find((item) => item.id === filterId)
  if (!filter?.slugs) return pagesForBrowseAll()

  // Keep each theme’s slug list order so the primary solution sits leftmost.
  const bySlug = new Map(solutionPages.map((page) => [page.slug, page]))
  return filter.slugs
    .map((slug) => bySlug.get(slug))
    .filter((page): page is SolutionPage => Boolean(page))
}

/**
 * Catalog order: cryogenic / cold-storage first, niche industries last.
 * Any slug missing here is appended alphabetically.
 */
const BROWSE_ALL_ORDER: string[] = [
  'cryogenic',
  'deep-freeze-labels',
  'cryostuck-labels',
  'biobanking',
  'ivf',
  'laboratory-tapes',
  'hard-to-stick',
  'laboratory',
  'pcr',
  'vaccines',
  'clinical-trials',
  'autoclave',
  'histology',
  'snappeel',
  'resin-labels',
  'rfid',
  'dymo-labels',
  'label-printing',
  'automated-labware',
  'custom-labels',
  'animal-health',
  'industrial',
  'chemical-containers',
  'cannabis',
]

const ARCHIVE_ORDER: string[] = [
  'cryogenic-labels',
  'deep-freeze',
  'cryostuck',
  'biobanking-labels',
  'ivf-labeling-solutions',
  'cryogenic-clinical-requisition-forms',
  'lab-tapes',
  'labels-for-hard-to-stick-surfaces',
  'laboratory-labels',
  'pcr-labels-and-tags',
  'vaccine-labels',
  'clinical-trial-labels',
  'covid-19-laboratory-labels',
  'autoclave-labels',
  'histology-labels',
  'xylene-chemical-resistant-labels',
  'microscope-slide-over-labeling',
  'snappeel-labels',
  'resitag',
  'rfid-labels-tags',
  'dymo-compatible-laboratory-labels',
  'gatorcut',
  'label-printing-solutions',
  'dymo-labelwriter-550',
  'ga-international-cody-3-printer',
  'label-software',
  'automated-labels',
  'pre-labeled-labware',
  'custom-laboratory-labels',
  'clinical-data-printing',
  'animal-healthcare',
  'industrial-labels',
  'chemical-container-labeling',
  'cannabis-labels',
]

function orderPages(pages: SolutionPage[], order: string[]): SolutionPage[] {
  const bySlug = new Map(pages.map((page) => [page.slug, page]))
  const ordered: SolutionPage[] = []
  const seen = new Set<string>()

  for (const slug of order) {
    const page = bySlug.get(slug)
    if (!page) continue
    ordered.push(page)
    seen.add(slug)
  }

  const leftovers = pages
    .filter((page) => !seen.has(page.slug))
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
  ordered.push(...leftovers)

  return ordered
}

/** Ordered pages for carousel, footer Solutions, and catalog pager. */
export function pagesForBrowseAll(): SolutionPage[] {
  return orderPages(solutionPages, BROWSE_ALL_ORDER)
}

/** Combined catalog articles — unique guides that fold more than one archive page. */
const NEW_ARTICLES_ORDER: string[] = [
  'clinical-trials',
  'histology',
  'laboratory-tapes',
  'dymo-labels',
  'label-printing',
  'automated-labware',
]

export function pagesForCombinedCatalog(): SolutionPage[] {
  return orderPages(solutionPages, NEW_ARTICLES_ORDER).filter((page) =>
    isCombinedCatalogSlug(page.slug),
  )
}

/** Ordered original scrape pages for the homepage Archive section and archive pager. */
export function pagesForArchive(): SolutionPage[] {
  return orderPages(legacyPages, ARCHIVE_ORDER)
}

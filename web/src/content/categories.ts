import { solutionPages } from '@/content/loadPages'
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
    slugs: [
      'cryogenic-labels',
      'cryostuck',
      'biobanking-labels',
      'ivf-labeling-solutions',
      'cryogenic-clinical-requisition-forms',
    ],
  },
  {
    id: 'deep-freeze',
    label: 'Deep-freeze',
    slugs: ['deep-freeze', 'vaccine-labels', 'cryogenic-labels', 'cryostuck'],
  },
  {
    id: 'biobanking',
    label: 'Biobanking',
    slugs: [
      'biobanking-labels',
      'ivf-labeling-solutions',
      'clinical-trial-labels',
      'cryogenic-labels',
      'rfid-labels-tags',
    ],
  },
  {
    id: 'vaccines',
    label: 'Vaccines',
    slugs: ['vaccine-labels', 'clinical-trial-labels', 'deep-freeze'],
  },
  {
    id: 'clinical',
    label: 'Clinical',
    slugs: [
      'clinical-trial-labels',
      'covid-19-laboratory-labels',
      'cryogenic-clinical-requisition-forms',
      'histology-labels',
      'vaccine-labels',
    ],
  },
  {
    id: 'pcr',
    label: 'PCR',
    slugs: ['pcr-labels-and-tags', 'laboratory-labels', 'cryogenic-labels'],
  },
  {
    id: 'histology',
    label: 'Histology',
    slugs: [
      'histology-labels',
      'xylene-chemical-resistant-labels',
      'microscope-slide-over-labeling',
      'resitag-2',
    ],
  },
  {
    id: 'autoclave',
    label: 'Autoclave',
    slugs: ['autoclave-labels', 'laboratory-labels', 'industrial-labels'],
  },
  {
    id: 'constructs',
    label: 'Specialty',
    slugs: [
      'gatorcut',
      'snappeel-2',
      'resitag-2',
      'lab-tapes',
      'cryostuck',
      'labels-for-hard-to-stick-surfaces',
      'dymo-compatible-laboratory-labels',
      'xylene-chemical-resistant-labels',
      'microscope-slide-over-labeling',
    ],
  },
  {
    id: 'tracking',
    label: 'RFID',
    slugs: ['rfid-labels-tags', 'biobanking-labels', 'clinical-trial-labels'],
  },
  {
    id: 'printers',
    label: 'Printers',
    slugs: [
      'label-printing-solutions',
      'label-software',
      'dymo-compatible-laboratory-labels',
    ],
  },
  {
    id: 'automation',
    label: 'Automation',
    slugs: ['automated-labels', 'pre-labeled-labware', 'label-printing-solutions'],
  },
  {
    id: 'custom',
    label: 'Custom',
    slugs: [
      'custom-laboratory-labels',
      'clinical-trial-labels',
      'pre-labeled-labware',
      'label-printing-solutions',
    ],
  },
  {
    id: 'industries',
    label: 'Industries',
    slugs: [
      'animal-healthcare',
      'industrial-labels',
      'chemical-container-labeling',
      'cannabis-labels',
      'laboratory-labels',
    ],
  },
]

export function pagesForBrowseFilter(filterId: BrowseFilterId): SolutionPage[] {
  if (filterId === 'all') return pagesForBrowseAll()

  const filter = browseFilters.find((item) => item.id === filterId)
  if (!filter?.slugs) return pagesForBrowseAll()

  const bySlug = new Map(solutionPages.map((page) => [page.slug, page]))
  return filter.slugs
    .map((slug) => bySlug.get(slug))
    .filter((page): page is SolutionPage => Boolean(page))
}

/** Live index order. Any slug missing here is appended alphabetically. */
const BROWSE_ALL_ORDER: string[] = [
  'animal-healthcare',
  'autoclave-labels',
  'automated-labels',
  'biobanking-labels',
  'cannabis-labels',
  'chemical-container-labeling',
  'clinical-trial-labels',
  'covid-19-laboratory-labels',
  'cryogenic-clinical-requisition-forms',
  'cryogenic-labels',
  'custom-laboratory-labels',
  'deep-freeze',
  'dymo-compatible-laboratory-labels',
  'gatorcut',
  'histology-labels',
  'industrial-labels',
  'ivf-labeling-solutions',
  'label-printing-solutions',
  'label-software',
  'cryostuck',
  'labels-for-hard-to-stick-surfaces',
  'resitag-2',
  'laboratory-labels',
  'lab-tapes',
  'microscope-slide-over-labeling',
  'pcr-labels-and-tags',
  'pre-labeled-labware',
  'rfid-labels-tags',
  'snappeel-2',
  'vaccine-labels',
  'xylene-chemical-resistant-labels',
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

/** Ordered pages for the homepage featured slider. */
const FEATURED_ORDER: string[] = [
  'cryogenic-labels',
  'deep-freeze',
  'cryostuck',
  'clinical-trial-labels',
  'histology-labels',
  'lab-tapes',
  'dymo-compatible-laboratory-labels',
  'label-printing-solutions',
  'automated-labels',
  'biobanking-labels',
  'pcr-labels-and-tags',
  'vaccine-labels',
]

export function pagesForFeatured(): SolutionPage[] {
  return orderPages(solutionPages, FEATURED_ORDER).filter((page) =>
    FEATURED_ORDER.includes(page.slug),
  )
}

/** Ordered pages for carousel, footer Solutions, and catalog pager. */
export function pagesForBrowseAll(): SolutionPage[] {
  return orderPages(solutionPages, BROWSE_ALL_ORDER)
}

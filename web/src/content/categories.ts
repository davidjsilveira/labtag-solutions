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
    label: 'Biobanking & IVF',
    slugs: [
      'biobanking-labels',
      'ivf-labeling-solutions',
      'cryogenic-clinical-requisition-forms',
      'cryogenic-labels',
      'rfid-labels-tags',
    ],
  },
  {
    id: 'vaccines',
    label: 'Vaccines & COVID',
    slugs: ['vaccine-labels', 'covid-19-laboratory-labels', 'deep-freeze'],
  },
  {
    id: 'clinical',
    label: 'Clinical trials',
    slugs: [
      'clinical-trial-labels',
      'clinical-data-printing',
      'cryogenic-clinical-requisition-forms',
      'covid-19-laboratory-labels',
    ],
  },
  {
    id: 'pcr',
    label: 'PCR & molecular',
    slugs: ['pcr-labels-and-tags', 'laboratory-labels', 'cryogenic-labels'],
  },
  {
    id: 'histology',
    label: 'Histology',
    slugs: [
      'histology-labels',
      'xylene-chemical-resistant-labels',
      'microscope-slide-over-labeling',
      'resitag',
    ],
  },
  {
    id: 'autoclave',
    label: 'Autoclave & heat',
    slugs: ['autoclave-labels', 'laboratory-labels', 'industrial-labels'],
  },
  {
    id: 'constructs',
    label: 'Specialty constructs',
    slugs: [
      'snappeel-labels',
      'resitag',
      'gatorcut',
      'cryostuck',
      'labels-for-hard-to-stick-surfaces',
      'lab-tapes',
      'dymo-compatible-laboratory-labels',
    ],
  },
  {
    id: 'tracking',
    label: 'RFID & tracking',
    slugs: ['rfid-labels-tags', 'biobanking-labels', 'clinical-trial-labels'],
  },
  {
    id: 'printers',
    label: 'Printers',
    slugs: [
      'label-printing-solutions',
      'dymo-labelwriter-550',
      'ga-international-cody-3-printer',
      'dymo-compatible-laboratory-labels',
    ],
  },
  {
    id: 'automation',
    label: 'Software & automation',
    slugs: [
      'label-software',
      'automated-labels',
      'pre-labeled-labware',
      'label-printing-solutions',
    ],
  },
  {
    id: 'custom',
    label: 'Custom & printing',
    slugs: [
      'custom-laboratory-labels',
      'clinical-data-printing',
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

  const ordered = pagesForBrowseAll()
  const wanted = new Set(filter.slugs)
  return ordered.filter((page) => wanted.has(page.slug))
}

/**
 * Browse / sitemap order: cryogenic / cold-storage first, niche industries last.
 * Any slug missing here is appended alphabetically.
 */
const BROWSE_ALL_ORDER: string[] = [
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
  // Niche / specialty industries last
  'animal-healthcare',
  'industrial-labels',
  'chemical-container-labeling',
  'cannabis-labels',
]

/** Ordered pages for carousel, lander index, footer, and pager. */
export function pagesForBrowseAll(): SolutionPage[] {
  const bySlug = new Map(solutionPages.map((page) => [page.slug, page]))
  const ordered: SolutionPage[] = []
  const seen = new Set<string>()

  for (const slug of BROWSE_ALL_ORDER) {
    const page = bySlug.get(slug)
    if (!page) continue
    ordered.push(page)
    seen.add(slug)
  }

  const leftovers = solutionPages
    .filter((page) => !seen.has(page.slug))
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
  ordered.push(...leftovers)

  return ordered
}

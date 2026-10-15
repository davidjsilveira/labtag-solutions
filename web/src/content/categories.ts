import { getPage, solutionPages } from '@/content/loadPages'
import type { SolutionPage } from '@/content/types'

export type SolutionCategoryId = 'use-cases' | 'features' | 'services'

export type SolutionCategory = {
  id: SolutionCategoryId
  label: string
  singular: string
  description: string
  slugs: string[]
}

/** Information architecture for the solutions sitemap. */
export const solutionCategories: SolutionCategory[] = [
  {
    id: 'use-cases',
    label: 'Use cases',
    singular: 'Use case',
    description:
      'Industry and workflow guides — cryogenic storage, biobanking, IVF, PCR, trials, and more.',
    slugs: [
      'cryogenic-labels',
      'deep-freeze',
      'biobanking-labels',
      'ivf-labeling-solutions',
      'cryogenic-clinical-requisition-forms',
      'laboratory-labels',
      'pcr-labels-and-tags',
      'vaccine-labels',
      'clinical-trial-labels',
      'covid-19-laboratory-labels',
      'autoclave-labels',
      'histology-labels',
      'animal-healthcare',
      'industrial-labels',
      'chemical-container-labeling',
      'cannabis-labels',
    ],
  },
  {
    id: 'features',
    label: 'Features',
    singular: 'Feature',
    description:
      'Specialty constructs and capabilities — CryoSTUCK®, SnapPEEL™, RFID, tapes, and hard-to-stick surfaces.',
    slugs: [
      'cryostuck',
      'lab-tapes',
      'labels-for-hard-to-stick-surfaces',
      'snappeel-labels',
      'xylene-chemical-resistant-labels',
      'microscope-slide-over-labeling',
      'resitag',
      'rfid-labels-tags',
      'dymo-compatible-laboratory-labels',
      'gatorcut',
    ],
  },
  {
    id: 'services',
    label: 'Services',
    singular: 'Service',
    description:
      'Printing systems, software, automation, custom constructs, and pre-labeled labware.',
    slugs: [
      'label-printing-solutions',
      'dymo-labelwriter-550',
      'ga-international-cody-3-printer',
      'label-software',
      'automated-labels',
      'pre-labeled-labware',
      'custom-laboratory-labels',
      'clinical-data-printing',
    ],
  },
]

/**
 * Home “Browse all” order: cryogenic / cold-storage first, niche industries last.
 * Any slug missing here is appended (alphabetically) before the niche tail.
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

/** Ordered pages for the home browse-all carousel. */
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

const categoryBySlug = new Map<string, SolutionCategoryId>()
for (const category of solutionCategories) {
  for (const slug of category.slugs) {
    categoryBySlug.set(slug, category.id)
  }
}

export function getCategory(id: string): SolutionCategory | undefined {
  return solutionCategories.find((category) => category.id === id)
}

export function getCategoryIdForSlug(slug: string): SolutionCategoryId | undefined {
  return categoryBySlug.get(slug)
}

export function getCategoryForSlug(slug: string): SolutionCategory | undefined {
  const id = getCategoryIdForSlug(slug)
  return id ? getCategory(id) : undefined
}

export function pagesInCategory(id: SolutionCategoryId): SolutionPage[] {
  const category = getCategory(id)
  if (!category) return []
  return category.slugs
    .map((slug) => getPage(slug))
    .filter((page): page is SolutionPage => Boolean(page))
}

/** Ensures every loaded solution page is assigned exactly once. */
export function uncategorizedSlugs(): string[] {
  return solutionPages.map((page) => page.slug).filter((slug) => !categoryBySlug.has(slug))
}

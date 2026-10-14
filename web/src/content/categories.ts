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
      'animal-healthcare',
      'autoclave-labels',
      'biobanking-labels',
      'cannabis-labels',
      'chemical-container-labeling',
      'clinical-trial-labels',
      'covid-19-laboratory-labels',
      'cryogenic-clinical-requisition-forms',
      'cryogenic-labels',
      'deep-freeze',
      'histology-labels',
      'industrial-labels',
      'ivf-labeling-solutions',
      'laboratory-labels',
      'pcr-labels-and-tags',
      'vaccine-labels',
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
      'dymo-compatible-laboratory-labels',
      'gatorcut',
      'lab-tapes',
      'labels-for-hard-to-stick-surfaces',
      'microscope-slide-over-labeling',
      'resitag',
      'rfid-labels-tags',
      'snappeel-labels',
      'xylene-chemical-resistant-labels',
    ],
  },
  {
    id: 'services',
    label: 'Services',
    singular: 'Service',
    description:
      'Printing systems, software, automation, custom constructs, and pre-labeled labware.',
    slugs: [
      'automated-labels',
      'clinical-data-printing',
      'custom-laboratory-labels',
      'dymo-labelwriter-550',
      'ga-international-cody-3-printer',
      'label-printing-solutions',
      'label-software',
      'pre-labeled-labware',
    ],
  },
]

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

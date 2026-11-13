/**
 * Solution articles that exist on https://www.labtag.com/solutions/.
 * Order matches the live index (title alphabetical).
 * `resitag` is published at `resitag-2`, the live URL.
 */
export const LIVE_SOLUTION_SLUGS = [
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
] as const

/** Markdown filename (without .md) when it differs from the public slug. */
export const LIVE_FILE_SLUG: Record<string, string> = {
  'resitag-2': 'resitag',
}

/**
 * Former catalog and archive URLs that should open the matching live article.
 * Older SnapPEEL URLs open the live SnapPEEL article.
 */
export const SOLUTION_SLUG_REDIRECTS: Record<string, string> = {
  'animal-health': 'animal-healthcare',
  autoclave: 'autoclave-labels',
  'automated-labware': 'pre-labeled-labware',
  biobanking: 'biobanking-labels',
  cannabis: 'cannabis-labels',
  'chemical-containers': 'chemical-container-labeling',
  'clinical-trials': 'clinical-trial-labels',
  'clinical-data-printing': 'clinical-trial-labels',
  cryogenic: 'cryogenic-labels',
  'cryostuck-labels': 'cryostuck',
  'custom-labels': 'custom-laboratory-labels',
  'deep-freeze-labels': 'deep-freeze',
  'dymo-labels': 'dymo-compatible-laboratory-labels',
  'dymo-labelwriter-550': 'dymo-compatible-laboratory-labels',
  'hard-to-stick': 'labels-for-hard-to-stick-surfaces',
  histology: 'histology-labels',
  industrial: 'industrial-labels',
  ivf: 'ivf-labeling-solutions',
  'label-printing': 'label-printing-solutions',
  'ga-international-cody-3-printer': 'label-printing-solutions',
  laboratory: 'laboratory-labels',
  'laboratory-tapes': 'lab-tapes',
  pcr: 'pcr-labels-and-tags',
  'pcr-labels': 'pcr-labels-and-tags',
  'resin-labels': 'resitag-2',
  resitag: 'resitag-2',
  rfid: 'rfid-labels-tags',
  vaccines: 'vaccine-labels',
  snappeel: 'snappeel-2',
  'snappeel-labels': 'snappeel-2',
}

const LIVE = new Set<string>(LIVE_SOLUTION_SLUGS)

export function canonicalSolutionPath(slug: string): string | undefined {
  if (LIVE.has(slug)) return `/solutions/${slug}`
  const target = SOLUTION_SLUG_REDIRECTS[slug]
  if (!target) return undefined
  if (target.startsWith('/')) return target
  return `/solutions/${target}`
}

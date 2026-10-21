/** Legacy `/solutions/{slug}` → current catalog slug. Every archive page maps to one new article. */
export const LEGACY_REPLACED_BY: Record<string, string> = {
  'clinical-trial-labels': 'clinical-trials',
  'clinical-data-printing': 'clinical-trials',
  'covid-19-laboratory-labels': 'clinical-trials',
  'cryogenic-clinical-requisition-forms': 'clinical-trials',
  'histology-labels': 'histology',
  'xylene-chemical-resistant-labels': 'histology',
  'microscope-slide-over-labeling': 'histology',
  'dymo-compatible-laboratory-labels': 'dymo-labels',
  'dymo-labelwriter-550': 'dymo-labels',
  'lab-tapes': 'laboratory-tapes',
  gatorcut: 'laboratory-tapes',
  'label-printing-solutions': 'label-printing',
  'ga-international-cody-3-printer': 'label-printing',
  'label-software': 'label-printing',
  'automated-labels': 'automated-labware',
  'pre-labeled-labware': 'automated-labware',
  'cryogenic-labels': 'cryogenic',
  'deep-freeze': 'deep-freeze-labels',
  cryostuck: 'cryostuck-labels',
  'biobanking-labels': 'biobanking',
  'ivf-labeling-solutions': 'ivf',
  'vaccine-labels': 'vaccines',
  'pcr-labels-and-tags': 'pcr',
  'autoclave-labels': 'autoclave',
  'laboratory-labels': 'laboratory',
  'snappeel-labels': 'snappeel',
  resitag: 'resin-labels',
  'rfid-labels-tags': 'rfid',
  'labels-for-hard-to-stick-surfaces': 'hard-to-stick',
  'custom-laboratory-labels': 'custom-labels',
  'animal-healthcare': 'animal-health',
  'industrial-labels': 'industrial',
  'chemical-container-labeling': 'chemical-containers',
  'cannabis-labels': 'cannabis',
}

/** Archive slugs folded into a catalog article. */
export function archiveSlugsForCatalog(catalogSlug: string): string[] {
  return Object.entries(LEGACY_REPLACED_BY)
    .filter(([, next]) => next === catalogSlug)
    .map(([legacy]) => legacy)
}

/** Combined catalog articles replace more than one archive page. */
export function isCombinedCatalogSlug(slug: string): boolean {
  return archiveSlugsForCatalog(slug).length > 1
}

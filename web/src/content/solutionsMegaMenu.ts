import { CONTACT_PATH, SAMPLE_PATH, SOLUTIONS_PATH } from '@/content/labtagLinks'
import { solutionPages } from '@/content/loadPages'
import { previewImage } from '@/content/previewImage'
import type { HeroImage } from '@/content/types'

export type SolutionsMegaLink = {
  label: string
  href: string
}

export type SolutionsMegaSection = {
  heading: string
  featured: SolutionsMegaLink & {
    image?: HeroImage
  }
  links: SolutionsMegaLink[]
}

/** Short mega labels for live solution articles, keyed by slug. */
const SOLUTIONS_MEGA_LABELS: Record<string, string> = {
  'animal-healthcare': 'Animal healthcare',
  'autoclave-labels': 'Autoclave',
  'automated-labels': 'Tube labelers',
  'biobanking-labels': 'Biobanking',
  'cannabis-labels': 'Cannabis',
  'chemical-container-labeling': 'Chemical containers',
  'clinical-trial-labels': 'Clinical trials',
  'covid-19-laboratory-labels': 'COVID-19',
  'cryogenic-clinical-requisition-forms': 'Requisition forms',
  'cryogenic-labels': 'Cryogenic',
  cryostuck: 'Frozen vials',
  'custom-laboratory-labels': 'Custom labels',
  'deep-freeze': 'Deep-freeze',
  'dymo-compatible-laboratory-labels': 'DYMO',
  gatorcut: 'GatorCUT',
  'snappeel-2': 'SnapPEEL',
  'labels-for-hard-to-stick-surfaces': 'Hard to stick',
  'histology-labels': 'Histology',
  'industrial-labels': 'Industrial',
  'ivf-labeling-solutions': 'IVF',
  'label-printing-solutions': 'Label printing',
  'label-software': 'Label software',
  'laboratory-labels': 'Laboratory',
  'lab-tapes': 'Lab tapes',
  'microscope-slide-over-labeling': 'Slide over-labeling',
  'pcr-labels-and-tags': 'PCR',
  'pre-labeled-labware': 'Pre-labeled labware',
  'resitag-2': 'Resin embedding',
  'rfid-labels-tags': 'RFID',
  'vaccine-labels': 'Vaccines',
  'xylene-chemical-resistant-labels': 'Xylene resistant',
}

/** Sectioned mega layout: featured article image + related live articles. */
const SOLUTIONS_MEGA_SECTION_DEFS = [
  {
    heading: 'By product',
    featuredSlug: 'cryogenic-labels',
    slugs: [
      'cryogenic-labels',
      'deep-freeze',
      'cryostuck',
      'laboratory-labels',
      'pcr-labels-and-tags',
      'autoclave-labels',
      'vaccine-labels',
      'custom-laboratory-labels',
    ],
  },
  {
    heading: 'By feature',
    featuredSlug: 'gatorcut',
    slugs: [
      'gatorcut',
      'snappeel-2',
      'rfid-labels-tags',
      'labels-for-hard-to-stick-surfaces',
      'lab-tapes',
      'resitag-2',
      'dymo-compatible-laboratory-labels',
      'xylene-chemical-resistant-labels',
      'microscope-slide-over-labeling',
    ],
  },
  {
    heading: 'Print and apply',
    featuredSlug: 'label-printing-solutions',
    slugs: [
      'label-printing-solutions',
      'label-software',
      'dymo-compatible-laboratory-labels',
      'automated-labels',
      'pre-labeled-labware',
    ],
  },
  {
    heading: 'Applications',
    featuredSlug: 'biobanking-labels',
    slugs: [
      'biobanking-labels',
      'ivf-labeling-solutions',
      'clinical-trial-labels',
      'covid-19-laboratory-labels',
      'cryogenic-clinical-requisition-forms',
      'histology-labels',
      'animal-healthcare',
      'industrial-labels',
      'chemical-container-labeling',
      'cannabis-labels',
    ],
  },
] as const

export const SOLUTIONS_MEGA_VIEW_ALL = {
  label: 'Browse all solutions',
  href: SOLUTIONS_PATH,
} as const

const pagesBySlug = new Map(solutionPages.map((page) => [page.slug, page]))

function linkForSlug(slug: string): SolutionsMegaLink | null {
  const page = pagesBySlug.get(slug)
  if (!page) return null
  return {
    label: SOLUTIONS_MEGA_LABELS[slug] ?? page.title,
    href: `/solutions/${page.slug}`,
  }
}

export const SOLUTIONS_MEGA_SECTIONS: SolutionsMegaSection[] = SOLUTIONS_MEGA_SECTION_DEFS.flatMap(
  (section) => {
    const featuredPage = pagesBySlug.get(section.featuredSlug)
    const featured = linkForSlug(section.featuredSlug)
    if (!featured || !featuredPage) return []

    const links = section.slugs
      .map((slug) => linkForSlug(slug))
      .filter((link): link is SolutionsMegaLink => Boolean(link))

    return [
      {
        heading: section.heading,
        featured: {
          ...featured,
          image: previewImage(featuredPage),
        },
        links,
      },
    ]
  },
)

/** Flat list kept for any callers that still need every mega destination. */
export const SOLUTIONS_MEGA_LINKS: SolutionsMegaLink[] = (() => {
  const seen = new Set<string>()
  const links: SolutionsMegaLink[] = []
  for (const section of SOLUTIONS_MEGA_SECTIONS) {
    for (const link of section.links) {
      if (seen.has(link.href)) continue
      seen.add(link.href)
      links.push(link)
    }
  }
  for (const page of solutionPages) {
    const href = `/solutions/${page.slug}`
    if (seen.has(href)) continue
    seen.add(href)
    links.push({
      label: SOLUTIONS_MEGA_LABELS[page.slug] ?? page.title,
      href,
    })
  }
  return links
})()

export const SOLUTIONS_MEGA_FOOTER: SolutionsMegaLink[] = [
  { label: 'Free samples', href: SAMPLE_PATH },
  { label: 'Chat with an expert', href: CONTACT_PATH },
]

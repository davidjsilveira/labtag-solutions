import {
  CONTACT_PATH,
  CUSTOM_LABELS_PATH,
  LABTAG_FINDER_URL,
  SAMPLE_PATH,
  SOLUTIONS_PATH,
  TAGI_PATH,
} from '@/content/labtagLinks'

export type SolutionsMegaLink = {
  label: string
  href: string
}

export type SolutionsMegaColumn = {
  heading: string
  links: SolutionsMegaLink[]
}

export type SolutionsMegaCategory = {
  id: 'labels' | 'print' | 'applications'
  label: string
  href: string
  columns: SolutionsMegaColumn[]
  image: string
  imageAlt: string
}

export const SOLUTIONS_MEGA_FOOTER = [
  { label: 'Browse all solutions', href: SOLUTIONS_PATH, icon: 'grid' as const },
  { label: 'Find a label', href: LABTAG_FINDER_URL, icon: 'finder' as const },
  { label: 'Ask Tagi', href: TAGI_PATH, icon: 'sparkle' as const },
  { label: 'Request a sample', href: SAMPLE_PATH, icon: 'sample' as const },
] as const

export const SOLUTIONS_MEGA_PROMO = {
  kicker: 'Application-first labeling',
  title: 'Match the label to your workflow, surface, and temperature.',
  cta: 'Browse solutions',
  href: SOLUTIONS_PATH,
} as const

export const SOLUTIONS_MEGA_CATEGORIES: SolutionsMegaCategory[] = [
  {
    id: 'labels',
    label: 'Label solutions',
    href: SOLUTIONS_PATH,
    image: '/media/nav/labels.webp',
    imageAlt: 'Gloved hands applying a Laser CryoSTUCK label to a frozen vial',
    columns: [
      {
        heading: 'By product',
        links: [
          { label: 'Cryogenic', href: '/solutions/cryogenic' },
          { label: 'Deep freeze', href: '/solutions/deep-freeze-labels' },
          { label: 'CryoSTUCK', href: '/solutions/cryostuck-labels' },
          { label: 'Laboratory', href: '/solutions/laboratory' },
          { label: 'PCR', href: '/solutions/pcr' },
          { label: 'Autoclave', href: '/solutions/autoclave' },
          { label: 'Vaccines', href: '/solutions/vaccines' },
          { label: 'Custom', href: '/solutions/custom-labels' },
        ],
      },
      {
        heading: 'By feature',
        links: [
          { label: 'SnapPEEL', href: '/solutions/snappeel' },
          { label: 'RFID', href: '/solutions/rfid' },
          { label: 'Hard to stick', href: '/solutions/hard-to-stick' },
          { label: 'Lab tapes', href: '/solutions/laboratory-tapes' },
          { label: 'ResiTAG', href: '/solutions/resin-labels' },
          { label: 'DYMO', href: '/solutions/dymo-labels' },
        ],
      },
      {
        heading: 'By surface',
        links: [
          { label: 'Frozen vials', href: '/solutions/cryostuck-labels' },
          { label: 'Tubes and vials', href: '/solutions/cryogenic' },
          { label: 'PCR tubes', href: '/solutions/pcr' },
          { label: 'Slides and blocks', href: '/solutions/histology' },
          { label: 'Resin embedding', href: '/solutions/resin-labels' },
          { label: 'Chemical containers', href: '/solutions/chemical-containers' },
        ],
      },
    ],
  },
  {
    id: 'print',
    label: 'Print and apply',
    href: '/solutions/label-printing',
    image: '/media/nav/print-scan.webp',
    imageAlt: 'Lab workstation with a thermal label printer, scanner, and label design on screen',
    columns: [
      {
        heading: 'Printers',
        links: [
          { label: 'Label printing', href: '/solutions/label-printing' },
          { label: 'DYMO labels', href: '/solutions/dymo-labels' },
        ],
      },
      {
        heading: 'Automation',
        links: [
          { label: 'Pre labeled labware', href: '/solutions/automated-labware' },
          { label: 'Label software', href: '/solutions/label-software' },
        ],
      },
      {
        heading: 'Services',
        links: [
          { label: 'Custom labels', href: CUSTOM_LABELS_PATH },
          { label: 'Free samples', href: SAMPLE_PATH },
          { label: 'Chat with an expert', href: CONTACT_PATH },
        ],
      },
    ],
  },
  {
    id: 'applications',
    label: 'Applications',
    href: '/solutions/biobanking',
    image: '/media/clinical-trial-labels/Clinical-Trial-Labels-Labtag-Use6.jpg',
    imageAlt: 'Labeled clinical trial vials and sample tubes on a laboratory bench',
    columns: [
      {
        heading: 'Clinical and research',
        links: [
          { label: 'Biobanking', href: '/solutions/biobanking' },
          { label: 'IVF', href: '/solutions/ivf' },
          { label: 'Clinical trials', href: '/solutions/clinical-trials' },
          { label: 'Histology', href: '/solutions/histology' },
          { label: 'PCR', href: '/solutions/pcr' },
          { label: 'Vaccines', href: '/solutions/vaccines' },
        ],
      },
      {
        heading: 'Industries',
        links: [
          { label: 'Animal healthcare', href: '/solutions/animal-health' },
          { label: 'Industrial', href: '/solutions/industrial' },
          { label: 'Cannabis', href: '/solutions/cannabis' },
          { label: 'Laboratory', href: '/solutions/laboratory' },
        ],
      },
    ],
  },
]

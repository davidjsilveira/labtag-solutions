import {
  CONTACT_PATH,
  CUSTOM_LABELS_PATH,
  SAMPLE_PATH,
  SOLUTIONS_PATH,
} from '@/content/labtagLinks'

export type SolutionsMegaLink = {
  label: string
  href: string
}

export type SolutionsMegaColumn = {
  heading: string
  links: SolutionsMegaLink[]
}

export const SOLUTIONS_MEGA_VIEW_ALL = {
  label: 'Browse all solutions',
  href: SOLUTIONS_PATH,
} as const

export const SOLUTIONS_MEGA_COLUMNS: SolutionsMegaColumn[] = [
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
    heading: 'Print and apply',
    links: [
      { label: 'Label printing', href: '/solutions/label-printing' },
      { label: 'DYMO labels', href: '/solutions/dymo-labels' },
      { label: 'Pre labeled labware', href: '/solutions/automated-labware' },
      { label: 'Label software', href: '/solutions/label-software' },
    ],
  },
  {
    heading: 'Applications',
    links: [
      { label: 'Biobanking', href: '/solutions/biobanking' },
      { label: 'IVF', href: '/solutions/ivf' },
      { label: 'Clinical trials', href: '/solutions/clinical-trials' },
      { label: 'Histology', href: '/solutions/histology' },
      { label: 'Animal healthcare', href: '/solutions/animal-health' },
      { label: 'Industrial', href: '/solutions/industrial' },
      { label: 'Cannabis', href: '/solutions/cannabis' },
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
]

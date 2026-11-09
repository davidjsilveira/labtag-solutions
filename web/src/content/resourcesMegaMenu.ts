import {
  CONTACT_PATH,
  HELP_PATH,
  LABTAG_BLOG_URL,
  LABTAG_CRYO_VIDEOS_URL,
  LABTAG_FAQ_URL,
  LABTAG_FINDER_URL,
  LABTAG_PROMOS_URL,
  LABTAG_RESOURCES_URL,
  LABTAG_TEMPLATES_HUB_URL,
  LABTAG_TEMPLATES_URL,
  LABTAG_VIDEOS_URL,
  SAMPLE_PATH,
  TAGI_PATH,
} from '@/content/labtagLinks'

export type ResourcesMegaLink = {
  label: string
  href: string
}

export type ResourcesMegaColumn = {
  heading: string
  links: ResourcesMegaLink[]
}

export type ResourcesMegaCategory = {
  id: 'support' | 'tools' | 'learn'
  label: string
  href: string
  columns: ResourcesMegaColumn[]
  image: string
  imageAlt: string
}

export const RESOURCES_MEGA_FOOTER = [
  { label: 'Browse all resources', href: LABTAG_RESOURCES_URL, icon: 'grid' as const },
  { label: 'Find a label', href: LABTAG_FINDER_URL, icon: 'finder' as const },
  { label: 'Browse templates', href: LABTAG_TEMPLATES_HUB_URL, icon: 'template' as const },
  { label: 'Ask Tagi', href: TAGI_PATH, icon: 'sparkle' as const },
] as const

export const RESOURCES_MEGA_PROMO = {
  kicker: 'Label knowledge',
  title: 'Find guides, templates, and answers for your labeling workflow.',
  cta: 'Browse resources',
  href: LABTAG_RESOURCES_URL,
} as const

export const RESOURCES_MEGA_CATEGORIES: ResourcesMegaCategory[] = [
  {
    id: 'support',
    label: 'Support',
    href: HELP_PATH,
    image: '/media/nav/labels.webp',
    imageAlt: 'Gloved hands applying a Laser CryoSTUCK label to a frozen vial',
    columns: [
      {
        heading: 'Get answers',
        links: [
          { label: 'Help', href: HELP_PATH },
          { label: 'Ask Tagi', href: TAGI_PATH },
          { label: 'FAQ', href: LABTAG_FAQ_URL },
        ],
      },
      {
        heading: 'Reach us',
        links: [
          { label: 'Contact us', href: CONTACT_PATH },
          { label: 'Request a sample', href: SAMPLE_PATH },
        ],
      },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    href: LABTAG_FINDER_URL,
    image: '/media/nav/print-scan.webp',
    imageAlt: 'Lab workstation with a thermal label printer, scanner, and label design on screen',
    columns: [
      {
        heading: 'Find and design',
        links: [
          { label: 'Label Finder', href: LABTAG_FINDER_URL },
          { label: 'Templates hub', href: LABTAG_TEMPLATES_HUB_URL },
          { label: 'Label templates', href: LABTAG_TEMPLATES_URL },
        ],
      },
      {
        heading: 'Watch',
        links: [
          { label: 'Videos', href: LABTAG_VIDEOS_URL },
          { label: 'Cryogenic videos', href: LABTAG_CRYO_VIDEOS_URL },
        ],
      },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    href: LABTAG_BLOG_URL,
    image: '/media/nav/accessories.webp',
    imageAlt: 'Gloved hands using a label applicator to place color dots on tube caps',
    columns: [
      {
        heading: 'Read',
        links: [
          { label: 'Blog', href: LABTAG_BLOG_URL },
          { label: 'FAQ', href: LABTAG_FAQ_URL },
          { label: 'Help center', href: HELP_PATH },
        ],
      },
      {
        heading: 'Browse',
        links: [
          { label: 'All resources', href: LABTAG_RESOURCES_URL },
          { label: 'Promotions', href: LABTAG_PROMOS_URL },
        ],
      },
    ],
  },
]

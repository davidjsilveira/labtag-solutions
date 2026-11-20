import {
  CONTACT_PATH,
  HELP_PATH,
  LABTAG_BLOG_URL,
  LABTAG_CRYO_VIDEOS_URL,
  LABTAG_FAQ_URL,
  FINDER_PATH,
  LABTAG_ORDERS_URL,
  LABTAG_PROMOS_URL,
  RESOURCES_PATH,
  TEMPLATES_PATH,
  LABTAG_VIDEOS_URL,
  SAMPLE_PATH,
  TAGI_PATH,
} from '@/content/labtagLinks'
import { TEMPLATE_A48 } from '@/content/templateA48'

export type ResourcesMegaLink = {
  label: string
  href: string
  note?: string
}

export type ResourcesMegaImage = {
  src: string
  alt: string
  fallbackSrc?: string
  fit?: 'cover' | 'contain'
}

export type ResourcesMegaSpotlight = ResourcesMegaLink & {
  eyebrow: string
  description: string
  cta: string
  image: ResourcesMegaImage
}

export type ResourcesMegaRailCard = ResourcesMegaLink & {
  description: string
  image: ResourcesMegaImage
}

export type ResourcesMegaColumn = {
  heading: string
  links: ResourcesMegaLink[]
}

export const RESOURCES_MEGA_VIEW_ALL = {
  label: 'Browse all resources',
  href: RESOURCES_PATH,
} as const

/** Wide featured panel — the label finder. */
export const RESOURCES_MEGA_SPOTLIGHT: ResourcesMegaSpotlight = {
  eyebrow: 'Start here',
  label: 'Label Finder',
  description:
    'Find the right material class, compare them side by side, and pick the size that fits.',
  cta: 'Open the finder',
  href: FINDER_PATH,
  image: {
    src: '/media/nav/labels.webp',
    alt: 'Laboratory labels arranged for comparison',
    fit: 'cover',
  },
}

/** The chatbot, second only to the finder. */
export const RESOURCES_MEGA_TAGI: ResourcesMegaRailCard = {
  label: 'Ask Tagi',
  description: 'Ask about a container, temperature, or printer and get a class recommendation.',
  href: TAGI_PATH,
  image: {
    src: '/media/nav/print-scan.webp',
    alt: 'Label printer and scanner on a lab workstation',
  },
}

/** One templates entry. Categories stay on the templates page. */
export const RESOURCES_MEGA_TEMPLATES_CARD: ResourcesMegaSpotlight = {
  eyebrow: 'Files',
  label: 'Label templates',
  description: 'A4 sheets, standard rolls, and DYMO files in one library.',
  cta: 'Browse templates',
  href: TEMPLATES_PATH,
  image: {
    src: TEMPLATE_A48.image.primary,
    alt: TEMPLATE_A48.image.alt,
    fallbackSrc: TEMPLATE_A48.image.fallback,
    fit: 'contain',
  },
}

/** Text-only directories under the feature row. */
export const RESOURCES_MEGA_COLUMNS: ResourcesMegaColumn[] = [
  {
    heading: 'Tools',
    links: [
      {
        label: 'Request a sample',
        href: SAMPLE_PATH,
        note: 'Try LabTAG labels in your workflow.',
      },
      {
        label: 'My orders',
        href: LABTAG_ORDERS_URL,
        note: 'Track a shipment or reorder.',
      },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help', href: HELP_PATH, note: 'Printing, compatibility, and orders.' },
      { label: 'FAQ', href: LABTAG_FAQ_URL, note: 'Answers from the knowledge base.' },
      { label: 'Contact us', href: CONTACT_PATH, note: 'Talk with a labeling specialist.' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Videos', href: LABTAG_VIDEOS_URL, note: 'Setup and application.' },
      {
        label: 'Cryogenic videos',
        href: LABTAG_CRYO_VIDEOS_URL,
        note: 'Liquid nitrogen and freezer labels.',
      },
    ],
  },
  {
    heading: 'Reading',
    links: [
      {
        label: 'Literature',
        href: RESOURCES_PATH,
        note: 'Catalogs, guides, and whitepapers.',
      },
      { label: 'Blog', href: LABTAG_BLOG_URL, note: 'Notes on lab labeling.' },
      { label: 'Promotions', href: LABTAG_PROMOS_URL, note: 'Current offers.' },
    ],
  },
]

export const RESOURCES_MEGA_FOOTER: ResourcesMegaLink[] = [
  { label: 'Chat with an expert', href: CONTACT_PATH },
]

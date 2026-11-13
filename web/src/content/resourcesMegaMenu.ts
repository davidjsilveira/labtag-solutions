import {
  CONTACT_PATH,
  HELP_PATH,
  LABTAG_BLOG_URL,
  LABTAG_CRYO_VIDEOS_URL,
  LABTAG_FAQ_URL,
  LABTAG_FINDER_URL,
  LABTAG_ORDERS_URL,
  LABTAG_PROMOS_URL,
  LABTAG_RESOURCES_URL,
  TEMPLATES_PATH,
  LABTAG_VIDEOS_URL,
  SAMPLE_PATH,
  TAGI_PATH,
} from '@/content/labtagLinks'
import { TEMPLATE_A48, TEMPLATE_A48_PATH } from '@/content/templateA48'
import { TEMPLATE_DY4084, TEMPLATE_DY4084_PATH } from '@/content/templateDy4084'
import { TEMPLATE_SR28, TEMPLATE_SR28_PATH } from '@/content/templateSr28'

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
  href: LABTAG_RESOURCES_URL,
} as const

/** Wide featured panel — the local template library. */
export const RESOURCES_MEGA_SPOTLIGHT: ResourcesMegaSpotlight = {
  eyebrow: 'Templates',
  label: 'Label templates',
  description:
    'A4 sheets to download, standard rolls to request, and a DYMO zip for Connect and Label Software.',
  cta: 'Browse templates',
  href: TEMPLATES_PATH,
  image: {
    src: TEMPLATE_A48.image.primary,
    alt: TEMPLATE_A48.image.alt,
    fallbackSrc: TEMPLATE_A48.image.fallback,
    fit: 'contain',
  },
}

export type ResourcesMegaTemplate = {
  id: string
  label: string
  detail: string
  href: string
  image: ResourcesMegaImage
}

/** Direct file shortcuts under the library card. */
export const RESOURCES_MEGA_TEMPLATES: ResourcesMegaTemplate[] = [
  {
    id: TEMPLATE_A48.id,
    label: 'A4 sheet',
    detail: 'Download',
    href: TEMPLATE_A48_PATH,
    image: {
      src: TEMPLATE_A48.image.primary,
      alt: TEMPLATE_A48.image.alt,
      fallbackSrc: TEMPLATE_A48.image.fallback,
      fit: 'contain',
    },
  },
  {
    id: TEMPLATE_SR28.id,
    label: 'Standard roll',
    detail: 'Request file',
    href: TEMPLATE_SR28_PATH,
    image: {
      src: TEMPLATE_SR28.image.primary,
      alt: TEMPLATE_SR28.image.alt,
      fallbackSrc: TEMPLATE_SR28.image.fallback,
      fit: 'contain',
    },
  },
  {
    id: TEMPLATE_DY4084.id,
    label: 'DYMO',
    detail: 'Download ZIP',
    href: TEMPLATE_DY4084_PATH,
    image: {
      src: TEMPLATE_DY4084.image.primary,
      alt: TEMPLATE_DY4084.image.alt,
      fallbackSrc: TEMPLATE_DY4084.image.fallback,
      fit: 'contain',
    },
  },
]
export const RESOURCES_MEGA_RAIL: ResourcesMegaRailCard[] = [
  {
    label: 'Ask Tagi',
    description: 'Get labeling guidance in chat.',
    href: TAGI_PATH,
    image: {
      src: '/media/nav/print-scan.webp',
      alt: 'Label printer and scanner on a lab workstation',
    },
  },
  {
    label: 'Request a sample',
    description: 'Try LabTAG labels in your workflow.',
    href: SAMPLE_PATH,
    image: {
      src: '/media/samples/Sample-Kit4.png',
      alt: 'LabTAG sample kit for laboratory labels',
    },
  },
]

/** Text-only directories under the feature row. */
export const RESOURCES_MEGA_COLUMNS: ResourcesMegaColumn[] = [
  {
    heading: 'Tools',
    links: [
      {
        label: 'Label Finder',
        href: LABTAG_FINDER_URL,
        note: 'Match a stock to the container and printer.',
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
      { label: 'Blog', href: LABTAG_BLOG_URL, note: 'Notes on lab labeling.' },
      { label: 'Promotions', href: LABTAG_PROMOS_URL, note: 'Current offers.' },
    ],
  },
]

export const RESOURCES_MEGA_FOOTER: ResourcesMegaLink[] = [
  { label: 'Chat with an expert', href: CONTACT_PATH },
]

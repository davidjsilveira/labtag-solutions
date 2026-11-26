import {
  CONTACT_PATH,
  FINDER_PATH,
  HELP_PATH,
  LABTAG_BLOG_URL,
  LABTAG_FAQ_URL,
  LABTAG_VIDEOS_URL,
  RESOURCES_PATH,
  TAGI_PATH,
  TEMPLATES_PATH,
} from '@/content/labtagLinks'

export type ResourcesMegaLink = {
  label: string
  href: string
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
}

export const RESOURCES_MEGA_VIEW_ALL = {
  label: 'Browse all resources',
  href: RESOURCES_PATH,
} as const

export const RESOURCES_MEGA_SPOTLIGHT: ResourcesMegaSpotlight = {
  eyebrow: 'Start here',
  label: 'Label Finder',
  description: 'Find the right material class, compare them side by side, and pick the size that fits.',
  cta: 'Open the finder',
  href: FINDER_PATH,
  image: {
    src: '/media/laboratory-labels/JTTA-103-Use-vials.png',
    alt: 'Labeled cryogenic vials compared side by side',
    fallbackSrc: 'https://cdn.labtag.com/wp-content/uploads/JTTA-103-Use-vials-3-1.jpg',
    fit: 'cover',
  },
}

export const RESOURCES_MEGA_TAGI: ResourcesMegaRailCard = {
  label: 'Ask Tagi',
  description: 'Ask about a container, temperature, or printer and get a class recommendation.',
  href: TAGI_PATH,
}

export const RESOURCES_MEGA_TOOLS: ResourcesMegaLink[] = [
  { label: 'Label Templates', href: TEMPLATES_PATH },
  { label: 'Guides', href: `${RESOURCES_PATH}?type=guides` },
  { label: 'Brands & Classes', href: FINDER_PATH },
]

export const RESOURCES_MEGA_LINKS: ResourcesMegaLink[] = [
  { label: 'Case Studies', href: `${RESOURCES_PATH}?type=case-studies` },
  { label: 'Catalogs & Flyers', href: `${RESOURCES_PATH}?type=catalogs-flyers` },
  { label: 'Videos', href: LABTAG_VIDEOS_URL },
  { label: 'Trade Shows', href: 'https://www.labtag.com/trade-shows/' },
  { label: 'FAQ & Support', href: HELP_PATH },
  { label: 'Whitepapers', href: `${RESOURCES_PATH}?type=whitepapers` },
  { label: 'Blog', href: LABTAG_BLOG_URL },
]

export const RESOURCES_MEGA_FOOTER: ResourcesMegaLink[] = [
  { label: 'Chat with an expert', href: CONTACT_PATH },
  { label: 'FAQ', href: LABTAG_FAQ_URL },
]

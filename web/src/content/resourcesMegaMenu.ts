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
import { TEMPLATE_SR1_PATH } from '@/content/templateSr1'

export type ResourcesMegaLink = {
  label: string
  href: string
}

export type ResourcesMegaColumn = {
  heading: string
  links: ResourcesMegaLink[]
}

export const RESOURCES_MEGA_VIEW_ALL = {
  label: 'Browse all resources',
  href: LABTAG_RESOURCES_URL,
} as const

export const RESOURCES_MEGA_COLUMNS: ResourcesMegaColumn[] = [
  {
    heading: 'Tools',
    links: [
      { label: 'Label Finder', href: LABTAG_FINDER_URL },
      { label: 'Templates', href: LABTAG_TEMPLATES_HUB_URL },
      { label: 'SR-1 template', href: TEMPLATE_SR1_PATH },
      { label: 'Label templates', href: LABTAG_TEMPLATES_URL },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help', href: HELP_PATH },
      { label: 'Ask Tagi', href: TAGI_PATH },
      { label: 'FAQ', href: LABTAG_FAQ_URL },
      { label: 'Contact us', href: CONTACT_PATH },
      { label: 'Request a sample', href: SAMPLE_PATH },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Blog', href: LABTAG_BLOG_URL },
      { label: 'Videos', href: LABTAG_VIDEOS_URL },
      { label: 'Cryogenic videos', href: LABTAG_CRYO_VIDEOS_URL },
      { label: 'All resources', href: LABTAG_RESOURCES_URL },
      { label: 'Promotions', href: LABTAG_PROMOS_URL },
    ],
  },
]

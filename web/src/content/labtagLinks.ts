/** Canonical LabTAG shop and sample destinations. */
export const LABTAG_SHOP_URL = 'https://www.labtag.com/shop/'
export const LABTAG_LABELS_URL = 'https://www.labtag.com/shop/category/labels/'
export const LABTAG_TAPES_URL = 'https://www.labtag.com/shop/category/tapes/'
export const LABTAG_TAGS_URL = 'https://www.labtag.com/shop/category/tags/'
export const LABTAG_PRINT_URL = 'https://www.labtag.com/shop/category/print-solutions/'
export const LABTAG_ACCESSORIES_URL = 'https://www.labtag.com/shop/category/accessories/'
export const LABTAG_ACCOUNT_URL = 'https://www.labtag.com/my-account/'
export const LABTAG_SIGN_IN_URL = LABTAG_ACCOUNT_URL
export const LABTAG_CREATE_ACCOUNT_URL = 'https://www.labtag.com/my-account/?action=register'
export const LABTAG_ORDERS_URL = 'https://www.labtag.com/my-account/orders/'
export const LABTAG_CART_URL = 'https://www.labtag.com/cart/'
export const LABTAG_SAMPLE_URL = 'https://www.labtag.com/contact-us/samples'
export const SAMPLE_PATH = '/samples'

/** True for in-app `/samples` or LabTAG sample / sample-kit destinations. */
export function isSampleHref(href: string): boolean {
  const value = href.trim().toLowerCase()
  if (!value) return false
  if (
    value === SAMPLE_PATH ||
    value.startsWith(`${SAMPLE_PATH}?`) ||
    value.startsWith(`${SAMPLE_PATH}/`)
  ) {
    return true
  }
  if (!value.includes('sample')) return false
  return (
    value.includes('labtag.com') &&
    (value.includes('sample-kit') ||
      value.includes('/samples') ||
      value.includes('contact-us/samples'))
  )
}

/** Always send sample CTAs to the in-app sample form. */
export function toInternalSampleHref(href?: string | null): string {
  if (!href?.trim()) return SAMPLE_PATH
  return isSampleHref(href) ? SAMPLE_PATH : href.trim()
}
export const QUOTE_PATH = '/quote'
export const LABTAG_ABOUT_URL = 'https://www.labtag.com/about-labtag'
export const SOLUTIONS_PATH = '/'
export const ABOUT_PATH = '/about'
export const WHY_CHOOSE_PATH = '/about/why-choose-labtag'
export const CUSTOM_LABELS_PATH = '/custom-labels'
export const RESELLER_PATH = '/become-a-reseller'
export const CONTACT_PATH = '/contact-us'
export const HELP_PATH = '/help'
export const TAGI_PATH = '/tagi'
export const RESOURCES_PATH = '/resources'
export const LABTAG_CONTACT_URL = 'https://www.labtag.com/contact-us/'
export const LABTAG_QUOTE_URL = 'https://www.labtag.com/contact-us/quote/'
export const LABTAG_RESELLER_URL = 'https://www.labtag.com/contact-us/become-a-reseller/'
export const LABTAG_RESOURCES_URL = 'https://www.labtag.com/resources/'
export const LABTAG_LITERATURE_URL = 'https://www.labtag.com/resources/catalogs/'
export const LABTAG_CASE_STUDIES_URL = 'https://www.labtag.com/case-studies/'
export const LABTAG_FINDER_URL = 'https://www.labtag.com/resources/label-finder/'
export const FINDER_PATH = '/label-finder'
export const CLASS_PATH = '/classes'

export function classPath(code: string) {
  return `${CLASS_PATH}/${encodeURIComponent(code.trim().toLowerCase())}`
}

/** Label finder with one filter already selected. `temp` is a temperature chip (Cryo, Heat). */
export function finderFilterPath(key: string, value: string) {
  const params = new URLSearchParams()
  params.set(key, value)
  return `${FINDER_PATH}?${params.toString()}`
}

export function labtagClassUrl(code: string) {
  return `https://www.labtag.com/label_class/${encodeURIComponent(code.trim().toLowerCase())}/`
}
export const LABTAG_VIDEOS_URL = 'https://www.labtag.com/resources/videos/'
export const LABTAG_TEMPLATES_URL = 'https://www.labtag.com/resources/label-templates/'
export const LABTAG_TEMPLATES_HUB_URL = 'https://www.labtag.com/resources/templates/'
export const TEMPLATES_PATH = '/templates'
export const LABTAG_PROMOS_URL = 'https://www.labtag.com/promotions/'
export const LABTAG_EN_URL = 'https://www.labtag.com/'
export const LABTAG_FR_URL = 'https://www.labtag.com/fr/'
export const LABTAG_FAQ_URL = 'https://www.labtag.com/resources/faq/'
export const LABTAG_BLOG_URL = 'https://www.labtag.com/blog/'
export const LABTAG_GA_URL = 'https://www.ga-international.com/'
export const LABTAG_PRIVACY_URL = 'https://www.labtag.com/privacy-policy/'
export const LABTAG_TERMS_URL = 'https://www.labtag.com/terms-of-use/'
export const LABTAG_TERMS_SALE_URL = 'https://www.labtag.com/terms-and-conditions-of-sale/'
export const LABTAG_COOKIE_URL = 'https://www.labtag.com/cookie-policy/'
export const LABTAG_FACEBOOK_URL = 'https://www.facebook.com/LabTAG.by.GA'
export const LABTAG_X_URL = 'https://x.com/LabTAG_Labels'
export const LABTAG_YOUTUBE_URL = 'https://www.youtube.com/c/LabTAG'
export const LABTAG_LINKEDIN_URL = 'https://www.linkedin.com/company/ga-international/'
export const LABTAG_CRYO_SHOP_URL =
  'https://www.labtag.com/shop/category/labels/cryogenic-labels/'
export const LABTAG_CRYO_VIDEOS_URL =
  'https://www.labtag.com/resources/videos/cryogenic-labels/'

/** In-app request form routes (HubSpot embeds). */
export const REQUEST_FORM_PATHS = {
  'cryogenic-clinical-requisition-forms': {
    path: '/request/cryogenic-clinical-requisition-forms',
    primaryLabel: 'Request custom forms',
  },
  'clinical-trial-labels': {
    path: '/request/clinical-trial-labels',
    primaryLabel: 'Request clinical trial labels',
  },
  'clinical-trials': {
    path: '/request/clinical-trial-labels',
    primaryLabel: 'Request clinical trial labels',
  },
  'custom-labels': {
    path: CUSTOM_LABELS_PATH,
    primaryLabel: 'Request custom labels',
  },
  'custom-laboratory-labels': {
    path: CUSTOM_LABELS_PATH,
    primaryLabel: 'Request custom labels',
  },
} as const

export type RequestFormSolutionSlug = keyof typeof REQUEST_FORM_PATHS

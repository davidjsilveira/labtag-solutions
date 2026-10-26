/** Canonical LabTAG shop and sample destinations. */
export const LABTAG_SHOP_URL = 'https://www.labtag.com/shop/'
export const LABTAG_SAMPLE_URL = 'https://www.labtag.com/contact-us/samples'
export const SAMPLE_PATH = '/samples'
export const SAMPLE_VERTICAL_PATH = '/samples/vertical'
export const LABTAG_ABOUT_URL = 'https://www.labtag.com/about-labtag'
export const ABOUT_PATH = '/about'
export const WHY_CHOOSE_PATH = '/about/why-choose-labtag'
export const LABTAG_CONTACT_URL = 'https://www.labtag.com/contact-us/'
export const LABTAG_QUOTE_URL = 'https://www.labtag.com/contact-us/quote/'
export const LABTAG_VIDEOS_URL = 'https://www.labtag.com/resources/videos/'
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
} as const

export type RequestFormSolutionSlug = keyof typeof REQUEST_FORM_PATHS

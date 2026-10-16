import {
  LABTAG_CRYO_SHOP_URL,
  LABTAG_CRYO_VIDEOS_URL,
  LABTAG_SAMPLE_URL,
  LABTAG_SHOP_URL,
  LABTAG_VIDEOS_URL,
} from '@/content/labtagLinks'

const VIDEOS = LABTAG_VIDEOS_URL.replace(/\/$/, '')
const SHOP = LABTAG_SHOP_URL.replace(/\/$/, '')

/** Section slug → LabTAG videos “Label Container” filter. */
const VIDEO_CONTAINER_BY_SECTION: Record<string, string> = {
  'tubes-vials-and-boxes': 'tubes-vials',
  'tubes-and-vials': 'tubes-vials',
  microplates: 'microplates',
  pcr: 'pcr',
  'pcr-tubes': 'pcr',
  'pcr-strips': 'pcr',
  'identi-pcr': 'pcr',
  platetag: 'microplates',
  'metal-racks-and-canes': 'metal-rack',
  'cryo-straws': 'straw',
  'cryo-strawtag': 'straw',
  straws: 'straw',
  nitrotag: 'tubes-vials',
  metalitag: 'metal-rack',
  pintag: 'tubes-vials',
  boxes: 'boxes',
  'microscope-slides': 'microscope-slides',
  'blood-bags': 'blood-bag',
  'blood-bag': 'blood-bag',
  syringes: 'syringe',
  glassware: 'glassware',
}

/** Section slug → LabTAG videos “Printing Method” filter. */
const VIDEO_PRINT_BY_SECTION: Record<string, string> = {
  'thermal-transfer': 'thermal-transfer',
  'direct-thermal': 'direct-thermal',
  'direct-thermal-cryostuck': 'direct-thermal',
  'cryo-lazrtag': 'laser',
  laser: 'laser',
  inkjet: 'inkjet',
  'dymo-450': 'dymo',
  'dymo-labelwriter-450-series': 'dymo',
  'dymo-550-cryostuck': 'dymo',
  'dymo-labelwriter-550-series': 'dymo',
  'dymo-compatible': 'dymo',
  dymo: 'dymo',
  writable: 'writable',
}

/** Section slug → LabTAG videos “Label Feature” filter. */
const VIDEO_FEATURE_BY_SECTION: Record<string, string> = {
  'frozen-surface-cryostuck': 'frozen-containers',
  'frozen-surfaces': 'frozen-containers',
  cryostuck: 'frozen-containers',
  'clear-over-label': 'transparent',
  blackout: 'blackout',
  'tamper-evident': 'tamper-proof',
  snappeel: 'self-laminating',
  'wrap-around': 'wrap-around',
  transparent: 'transparent',
  rfid: 'rfid',
  'rfid-solutions': 'rfid',
  'cryo-c-kurtag': 'tamper-proof',
  gatorcut: 'gatorcut',
}

/**
 * Section slug → short shop CTA label + search query.
 * Label appears as “Shop {label}”.
 */
const SHOP_BY_SECTION: Record<string, { label: string; query: string }> = {
  'tubes-vials-and-boxes': { label: 'Tubes & Vials', query: 'cryogenic tubes vials' },
  'tubes-and-vials': { label: 'Tubes & Vials', query: 'cryogenic tubes vials' },
  microplates: { label: 'Microplates', query: 'cryogenic microplates' },
  pcr: { label: 'PCR', query: 'cryogenic PCR' },
  'pcr-tubes': { label: 'PCR Tubes', query: 'PCR tube labels' },
  'pcr-strips': { label: 'PCR Strips', query: 'PCR strip labels' },
  'identi-pcr': { label: 'IDenti-PCR', query: 'IDenti-PCR' },
  platetag: { label: 'PlateTAG', query: 'PlateTAG PCR' },
  'pcr-tagtrax': { label: 'PCR-TagTrax', query: 'PCR-TagTrax' },
  applicators: { label: 'Applicators', query: 'PCR label applicator' },
  'metal-racks-and-canes': { label: 'Metal Racks', query: 'cryogenic metal racks' },
  'cryo-straws': { label: 'Cryo Straws', query: 'cryo straw labels' },
  straws: { label: 'Cryo Straws', query: 'cryo straw labels' },
  'thermal-transfer': { label: 'Thermal-Transfer', query: 'thermal transfer cryogenic' },
  'direct-thermal': { label: 'Direct Thermal', query: 'direct thermal cryogenic' },
  laser: { label: 'Laser', query: 'laser cryogenic labels' },
  inkjet: { label: 'Inkjet', query: 'inkjet cryogenic' },
  'dymo-450': { label: 'DYMO 450', query: 'DYMO 450 cryogenic' },
  'dymo-labelwriter-450-series': { label: 'DYMO 450', query: 'DYMO 450 cryogenic' },
  'dymo-550-cryostuck': { label: 'DYMO 550', query: 'DYMO 550 CryoSTUCK' },
  'dymo-labelwriter-550-series': { label: 'DYMO 550', query: 'DYMO 550 CryoSTUCK' },
  'dymo-compatible': { label: 'DYMO', query: 'DYMO deep freeze labels' },
  writable: { label: 'Writable', query: 'writable cryogenic dots' },
  automation: { label: 'Automation', query: 'automation cryogenic labels' },
  'blood-bag': { label: 'Blood Bag', query: 'blood bag labels' },
  'blood-bags': { label: 'Blood Bag', query: 'blood bag labels' },
  rectangles: { label: 'Rectangles', query: 'deep freeze rectangle labels' },
  circles: { label: 'Circles', query: 'deep freeze circle labels' },
  'rectangles-circles': { label: 'Rectangles + Circles', query: 'deep freeze labels' },
  'frozen-surface-cryostuck': { label: 'CryoSTUCK', query: 'CryoSTUCK' },
  'frozen-surfaces': { label: 'CryoSTUCK', query: 'CryoSTUCK frozen' },
  cryostuck: { label: 'CryoSTUCK', query: 'CryoSTUCK' },
  'clear-over-label': { label: 'Clear CryoSTUCK', query: 'clear CryoSTUCK' },
  tapes: { label: 'CryoSTUCK Tapes', query: 'CryoSTUCK tape' },
  affixing: { label: 'CryoSTUCK', query: 'CryoSTUCK' },
  dymo: { label: 'DYMO CryoSTUCK', query: 'DYMO CryoSTUCK' },
  nitrotag: { label: 'NitroTAG', query: 'NitroTAG' },
  'cryo-lazrtag': { label: 'Cryo-LazrTAG', query: 'Cryo-LazrTAG' },
  'direct-thermal-cryostuck': { label: 'DT CryoSTUCK', query: 'direct thermal CryoSTUCK' },
  'cryo-strawtag': { label: 'Cryo-StrawTAG', query: 'Cryo-StrawTAG' },
  metalitag: { label: 'MetaliTAG', query: 'MetaliTAG' },
  pintag: { label: 'PinTAG', query: 'PinTAG' },
  'cryo-c-kurtag': { label: 'Cryo C-kurTAG', query: 'Cryo C-kurTAG' },
  'cryogenic-specialty-tapes': { label: 'Cryo Tapes', query: 'cryogenic tape' },
  'rfid-solutions': { label: 'RFID', query: 'RFID cryogenic' },
  'printing-solutions': { label: 'Printing', query: 'label printer laboratory' },
  'lims-integration': { label: 'LIMS Labels', query: 'LIMS laboratory labels' },
  blackout: { label: 'Blackout', query: 'blackout cryogenic' },
  'tamper-evident': { label: 'Tamper-Evident', query: 'tamper evident cryogenic' },
  snappeel: { label: 'SnapPEEL', query: 'SnapPEEL cryogenic' },
  piggyback: { label: 'Piggyback', query: 'piggyback cryogenic' },
  'wrap-around': { label: 'Wrap-Around', query: 'wrap-around cryogenic' },
  transparent: { label: 'Transparent', query: 'transparent cryogenic' },
  simpeel: { label: 'SimPEEL', query: 'SimPEEL cryogenic' },
  rfid: { label: 'RFID', query: 'RFID cryogenic' },
  permanent: { label: 'Permanent', query: 'permanent cryogenic labels' },
  removable: { label: 'Removable', query: 'removable cryogenic labels' },
}

const CRYO_SOLUTION_SLUGS = new Set([
  'cryogenic-labels',
  'cryostuck',
  'deep-freeze',
  'biobanking-labels',
  'ivf-labeling-solutions',
  'cryogenic-clinical-requisition-forms',
  'vaccine-labels',
])

export type SplitCardActions = {
  shopHref: string
  shopLabel: string
  sampleHref: string
  videoHref: string
}

function videoContainerUrl(container: string): string {
  return `${VIDEOS}/?_sft_video_container=${container}`
}

function videoPrintUrl(method: string): string {
  return `${VIDEOS}/?_sft_printing_method=${method}`
}

function videoFeatureUrl(feature: string): string {
  return `${VIDEOS}/?_sft_label_feature=${feature}`
}

function shopSearchUrl(query: string): string {
  return `${SHOP}/?s=${encodeURIComponent(query)}&post_type=product`
}

function titleToShopLabel(title?: string): string {
  if (!title) return 'labels'
  return title
    .replace(/®|™/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^DYMO®?\s*LabelWriter™?\s*/i, 'DYMO ')
    .replace(/\s*Series$/i, '')
    .replace(/\s*\/\s*/g, ' / ')
    .trim()
}

function resolveVideoHref(sectionSlug: string, cryo: boolean): string {
  const container = VIDEO_CONTAINER_BY_SECTION[sectionSlug]
  if (container) return videoContainerUrl(container)

  const print = VIDEO_PRINT_BY_SECTION[sectionSlug]
  if (print) return videoPrintUrl(print)

  const feature = VIDEO_FEATURE_BY_SECTION[sectionSlug]
  if (feature) return videoFeatureUrl(feature)

  return cryo ? LABTAG_CRYO_VIDEOS_URL : LABTAG_VIDEOS_URL
}

export function resolveVideosHref(solutionSlug?: string): string {
  return solutionSlug && CRYO_SOLUTION_SLUGS.has(solutionSlug)
    ? LABTAG_CRYO_VIDEOS_URL
    : LABTAG_VIDEOS_URL
}

export function resolveSolutionShopHref(solutionSlug?: string): string {
  return solutionSlug && CRYO_SOLUTION_SLUGS.has(solutionSlug)
    ? LABTAG_CRYO_SHOP_URL
    : LABTAG_SHOP_URL
}

export function resolveSplitCardActions(
  sectionSlug: string,
  solutionSlug?: string,
  sectionTitle?: string,
): SplitCardActions {
  const cryo = Boolean(solutionSlug && CRYO_SOLUTION_SLUGS.has(solutionSlug))
  const mapped = SHOP_BY_SECTION[sectionSlug]
  const shopLabel = mapped?.label ?? titleToShopLabel(sectionTitle)
  const shopHref = mapped
    ? shopSearchUrl(mapped.query)
    : cryo
      ? LABTAG_CRYO_SHOP_URL
      : shopSearchUrl(shopLabel)

  return {
    shopHref,
    shopLabel,
    sampleHref: LABTAG_SAMPLE_URL,
    videoHref: resolveVideoHref(sectionSlug, cryo),
  }
}

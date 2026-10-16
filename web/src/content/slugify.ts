/** Normalize titles for comparison (strip marks, punctuation). */
export function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[®™©]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

/** URL fragment for a section heading. */
export function slugify(value: string): string {
  return normalizeTitle(value).replace(/\s+/g, '-')
}

const EXPLICIT_ANCHOR = /\{#([a-z0-9-]+)\}/i

export type AnchorSection = {
  title: string
  level?: 2 | 3
}

/** Pull an author-specified `{#slug}` from title or body, if present. */
export function extractExplicitAnchor(...parts: Array<string | undefined>): string | undefined {
  for (const part of parts) {
    const match = part?.match(EXPLICIT_ANCHOR)
    if (match) return `#${match[1].toLowerCase()}`
  }
  return undefined
}

/** Strip `{#slug}` markers from display text. */
export function stripExplicitAnchor(value: string): string {
  return value.replace(EXPLICIT_ANCHOR, '').replace(/\s{2,}/g, ' ').trim()
}

/** Normalized guide-item title → preferred article section titles (first match on page wins). */
const ITEM_TO_SECTION: Record<string, string[]> = {
  growing: ['growing', 'plant identification labels for growers'],
  packaging: ['packaging', 'packaging labels for brands distributors and retailers'],
  testing: ['testing', 'tube vial and dish labels for testing labs'],
  'user friendly': ['user friendly', 'speed and ease of use'],
  speed: ['speed', 'speed and ease of use'],
  durability: ['durability', 'durability and quality'],
  quality: ['quality', 'durability and quality'],
  design: ['design', 'design and branding'],
  'full color graphics': ['full color graphics', 'custom constructs and printing'],
  'clinical trials': ['clinical trials', 'clinical trial labeling'],
  'custom constructs': ['custom constructs'],
  'custom printing': ['custom printing'],
  'in house manufacturing': ['in house manufacturing'],
  'scientific expertise': ['scientific expertise'],
  'global delivery': ['global delivery'],
  'cold storage': ['cold storage', 'deep freeze and cryogenic labels'],
  'cryogenic storage': ['cryogenic storage', 'labels for cryogenic storage', 'cryogenic durability'],
  'chemical resistant': ['chemical resistant', 'chemical resistant labels'],
  'autoclave resistant': ['autoclave resistant', 'autoclave resistant labels'],
  medication: ['medication', 'medication labels'],
  'cage and chart': ['cage and chart', 'animal cage and chart labels'],
  'print and scan': ['print and scan', 'printers scanners and software', 'print and scan kits'],
  'diagnostic kits': ['diagnostic kits'],
  'sample processing': ['sample processing'],
  'clear over label': ['clear cryostuck for laminating'],
  'cover up blackout': ['blackout cryostuck'],
  'self laminating': ['self laminating', 'histolam'],
  'steel and chemicals': ['steel manufacturing labels'],
  'electrical and building materials': ['electrical labels'],
  'patient records': ['patient record labels', 'datasheet and patient record labels'],
  'thermal transfer': ['thermal transfer', 'print insert bake track', 'ivf printing solutions'],
  'color coding': ['color coding', 'tube and cap dots', 'ivf printing solutions'],
  'plates and dishes': ['side labels for culture plates'],
  'xylene and chemical': ['xylene resistant labels'],
  'blackout removable': ['blackout removable', 'covering up existing information'],
  'histo pintag': ['histo pintag'],
  'clear laminating': ['clear laminating', 'laminating existing labels'],
  'pcr tubes': ['pcr tubes', 'tube and cap dots'],
  'pcr strips': ['pcr strips', 'pcr tag'],
  'ultra low cryogenic': ['ultra low vaccine labels', 'frozen vaccine labels'],
  refrigerated: ['refrigerated vaccine labels'],
  frozen: ['frozen vaccine labels', 'cryostuck tape'],
  'syringe flags': ['syringe labels'],
  'rfid and smart labels': ['rfid labels and smart labels'],
  'custom and clinical': ['custom labels and clinical trial labels'],
  cryogenic: ['cryogenic', 'permanent cryogenic tape', 'nitrotag'],
  pcr: ['pcr', 'pcr labels and tags'],
  ivf: ['ivf', 'ivf labels'],
  'kits and storage': ['kits and storage', 'covid 19 labels'],
  cannabis: ['cannabis', 'cannabis labels'],
  'deep freeze': ['deep freeze', 'deep freeze labels'],
  'print solutions': ['print solutions', 'print solutions for laboratory labels'],
  'snappeel technology': ['snappeel technology', 'what is snappeel'],
  'gatorcut technology': ['gatorcut technology'],
  'freezertape tg': ['freezertape tg'],
  'freezertape tdf': ['freezertape tdf'],
  frozenstuck: ['frozenstuck'],
  nitrotape: ['nitrotape'],
  'cryostuck tfng': ['cryostuck tfng'],
  'cryostuck txs': ['cryostuck txs'],
  'cryostuck txc': ['cryostuck txc'],
  'clear ubicling': ['clear ubicling'],
  steritape: ['steritape', 'removable steritape'],
  freezer: ['freezertape tdf', 'freezertape tg', 'translutape', 'removable freezer tape'],
  autoclave: ['steritape', 'autoclave', 'removable steritape', 'printable autoclave tape'],
  'static cling': ['ubicling', 'clear ubicling'],
  'general and specialty': ['ubicling', 'color lab tape'],
  'automation ready': ['pintag'],
  'rfid and lims': ['rfid solutions'],
  'laser printable': ['cryo lazrtag'],
  'tamper evident': ['cryo c kurtag'],
  'frozen surfaces': ['frozen surfaces'],
  'cryo tubes and vials': ['nitrotag'],
  'ivf straws': ['cryo strawtag'],
  'metal racks and canes': ['metalitag'],
  '2d storage tubes': ['pintag'],
  'straws and vitrification devices': ['cryo strawtag'],
  'microscope slides': ['microscope slides', 'xylene resistant slide labels'],
  'paraffin wax blocks': ['paraffin wax blocks', 'parafitag'],
  'glass bottles and labware': ['glass bottles and labware', 'bottles'],
  'tubes vials and boxes': ['tubes vials and boxes', 'tube vials and boxes'],
  'acid and base resistant': ['acid and base resistant'],
  'dymo compatible': ['dymo compatible', 'dymo'],
  'drums and ibc totes': ['drums and ibc totes'],
  'bottles and secondary containers': ['bottles and secondary containers'],
  'reagent vials and tubes': ['reagent vials and tubes'],
  'direct thermal': ['direct thermal'],
  'ghs container labels': ['ghs container labels'],
  'hmis warning labels': ['hmis warning labels'],
  'nfpa warning labels': ['nfpa warning labels'],
  'calibration and maintenance': [
    'calibration and maintenance',
    'calibration and maintenance labels',
  ],
  'cryostuck labels': ['cryostuck labels', 'dymo branded cryostuck labels'],
  'labelwriter 550 printer': ['labelwriter 550 printer', 'dymo labelwriter 550 printer'],
  'connect software': ['connect software', 'dymo connect software'],
  '2 x 1': ['2 x 1'],
  '2 x 0 25': ['2 x 0 25'],
  '1 x 1': ['1 x 1'],
  '1 x 0 5': ['1 x 0 5'],
  'slide storage boxes': ['slide storage boxes', 'freezer grade storage labels'],
  'metal detectable blocks': ['metal detectable blocks', 'parafigard', 'metal detectable'],
  'metal detectable': ['metal detectable blocks', 'parafigard'],
  're identification': ['re identification', 'histo pintag'],
  blackout: ['blackout', 'covering up existing information'],
  'serialization and database': ['serialization and database', 'serialization barcodes and rfid'],
  'rfid technology': ['rfid technology', 'serialization barcodes and rfid'],
  histology: ['histology', 'xylene and chemical resistant rfid labels', 'xylene resistant labels'],
  'cryogenic rfid vial labels': ['cryogenic rfid vial labels'],
  'autoclave resistant rfid labels': ['autoclave resistant rfid labels'],
  'deep freeze rfid microplate labels': ['deep freeze rfid microplate labels'],
  'xylene and chemical resistant labels': [
    'xylene and chemical resistant labels',
    'xylene and chemical resistant rfid labels',
  ],
  'rfid tags': ['rfid tags'],
  'rfid printers': ['rfid printers'],
  'rfid readers': ['rfid readers'],
  'wide scanning radius': ['wide scanning radius'],
  'printed and encoded': ['printed and encoded'],
  'flexible inlays': ['flexible inlays'],
  applications: ['applications'],
  'custom rfid': ['custom rfid', 'custom rfid identification solutions'],
  'industrial rfid': ['industrial rfid', 'industrial grade rfid solutions'],
  'deep freeze and transparent': ['transparent deep freeze', 'transparent deep freeze labels'],
  'cryogenic frozen surfaces': ['cryostuck labels', 'cryostuck labels lwcs class'],
  'frozen vials': ['frozen vials', 'cryogenic labels for frozen vials'],
  'simpeel frozen surfaces': [
    'simpeel frozen surfaces',
    'cryogenic labels for frozen surfaces with simpeel technology',
  ],
  'simpeel cryogenic': [
    'simpeel cryogenic',
    'cryogenic labels with simpeel technology',
  ],
  'transparent deep freeze': ['transparent deep freeze', 'transparent deep freeze labels'],
  'heat resistant': ['heat resistant', 'heat resistant labels'],
  'water dissolvable': ['water dissolvable', 'water dissolvable paper labels'],
  'general use': ['general use', 'general use labels'],
  '5 series 550 550 turbo 5xl': ['cryostuck labels', 'cryostuck labels lwcs class'],
  'we procure': ['we procure', 'or let us procure the labware'],
  'send your labware': ['send your labware', 'send us your labware'],
  'print and scan kits': ['print and scan kits', 'ivf printing solutions'],
  'thermal transfer printable': [
    'thermal transfer printable',
    'xylene resistant slide labels',
  ],
  precision: ['precision', 'what is snappeel'],
  efficiency: ['efficiency', 'what is snappeel'],
  visibility: ['visibility', 'what is snappeel'],
  'barcode ready': ['barcode ready', 'pcr tag'],
  'hand writable': ['hand writable', 'tube and cap dots'],
  removable: ['removable', 'platetag'],
  permanent: ['permanent'],
  'cryogenic adhesive': ['cryogenic adhesive'],
  fjt: ['fjt', 'what is snappeel'],
  jtta: ['jtta', 'what is snappeel'],
  dtu: ['dtu', 'what is snappeel'],
  lcs: ['lcs', 'what is snappeel'],
  'chemical resistance': ['chemical resistance', 'clear legible sample ids'],
  'heat resistance': ['heat resistance', 'clear legible sample ids'],
  'printable ids': ['printable ids', 'clear legible sample ids'],
  'capsule and mold fit': ['capsule and mold fit', 'print insert bake track'],
  'custom barcodes and text': ['custom barcodes and text'],
  'graphics and logos': ['graphics and logos'],
  'precise application': ['precise application'],
  'barcode grading': ['barcode grading'],
  'material range': ['material range'],
  'print modes': ['print modes'],
  resolution: ['resolution'],
  'media width': ['media width'],
  connectivity: ['connectivity'],
  overview: ['overview'],
  'what s in the box': ['what s in the box'],
  'tech specs': ['tech specs', 'technical specifications'],
  downloads: ['downloads'],
  materials: ['materials', 'material selection'],
  resistance: ['resistance'],
  datagard: ['datagard'],
  'die cut': ['die cut', 'die cut laboratory labels'],
  'variable data printing': ['variable data printing'],
  formats: ['formats', 'label formats'],
  printing: ['printing', 'printing method'],
  surfaces: ['surfaces', 'application surface'],
  'data formats': ['data formats', 'data format'],
  sterilization: ['sterilization', 'xylene resistant labels'],
  customization: ['laser printable forms and labels'],
  tapes: ['affixing labels'],
  nfc: ['nfc', 'cryogenic rfid vial labels'],
  hf: ['hf', 'cryogenic rfid vial labels'],
  uhf: ['uhf', 'cryogenic rfid vial labels'],
  printers: ['cryogenic labels'],
  'ribbons and supplies': ['cryogenic labels'],
  software: ['software', 'design software', 'cryogenic labels'],
  'design software': ['design software', 'label design software'],
  'informatics software': ['informatics software'],
  'software partners': ['software partners', 'our software partners'],
  '4 series 450 450 turbo 4xl': ['frozen vials', 'general use', 'general use labels'],
}

function asSections(
  sectionTitles: Array<string | AnchorSection>,
): AnchorSection[] {
  return sectionTitles.map((entry) =>
    typeof entry === 'string' ? { title: entry } : entry,
  )
}

function preferArticleOrder(a: AnchorSection, b: AnchorSection): number {
  const levelA = a.level ?? 3
  const levelB = b.level ?? 3
  if (levelA !== levelB) return levelA === 3 ? -1 : 1
  return 0
}

/**
 * Find the best matching section title for a guide item.
 * Order: explicit `{#slug}` → exact title → careful token match →
 * containment → earliest/longest section title mentioned in title+body.
 */
export function resolveSectionAnchor(
  itemTitle: string,
  sectionTitles: Array<string | AnchorSection>,
  itemBody?: string,
): string | undefined {
  const sections = asSections(sectionTitles)
  if (!sections.length) return undefined

  const explicit = extractExplicitAnchor(itemTitle, itemBody)
  if (explicit) {
    const want = explicit.slice(1)
    const bySlug = sections.find((section) => slugify(section.title) === want)
    return bySlug ? `#${slugify(bySlug.title)}` : explicit
  }

  const needle = normalizeTitle(stripExplicitAnchor(itemTitle))
  if (!needle) return undefined

  const ranked = [...sections].sort(preferArticleOrder)

  const aliasCandidates = ITEM_TO_SECTION[needle] ?? []
  for (const aliased of aliasCandidates) {
    const aliasTokens = aliased.split(' ').filter(Boolean)
    const aliasHit =
      ranked.find((section) => normalizeTitle(section.title) === aliased) ??
      ranked.find((section) => slugify(section.title) === aliased.replace(/\s+/g, '-')) ??
      ranked.find((section) => {
        const hay = normalizeTitle(section.title)
        return aliasTokens.length > 0 && aliasTokens.every((token) => hay.includes(token))
      })
    if (aliasHit) return `#${slugify(aliasHit.title)}`
  }

  const exact = ranked.find((section) => normalizeTitle(section.title) === needle)
  if (exact) return `#${slugify(exact.title)}`

  const tokens = needle.split(' ').filter((token) => token.length >= 2)
  const tokenMatch = ranked.find((section) => {
    const hay = normalizeTitle(section.title)
    if (!(tokens.length > 0 && tokens.every((token) => hay.includes(token)))) return false
    // Avoid "Cryogenic" → "Cryogenic Specialty Tapes"
    if (tokens.length === 1 && needle.length < hay.length * 0.6) return false
    return true
  })
  if (tokenMatch) return `#${slugify(tokenMatch.title)}`

  const contains = ranked.find((section) => normalizeTitle(section.title).includes(needle))
  if (contains && needle.length >= normalizeTitle(contains.title).length * 0.5) {
    return `#${slugify(contains.title)}`
  }

  const reverseContains = ranked.find((section) => {
    const n = normalizeTitle(section.title)
    return n.length >= 4 && needle.includes(n)
  })
  if (reverseContains) return `#${slugify(reverseContains.title)}`

  // Product names in the blurb — prefer the earliest mention, then longer titles.
  const hay = normalizeTitle(
    `${stripExplicitAnchor(itemTitle)} ${stripExplicitAnchor(itemBody ?? '')}`,
  )
  let best: { title: string; index: number; len: number; level: number } | undefined
  for (const section of ranked) {
    const n = normalizeTitle(section.title)
    if (n.length < 4) continue
    const index = hay.indexOf(n)
    if (index === -1) continue
    const level = section.level ?? 3
    if (
      !best ||
      index < best.index ||
      (index === best.index && (n.length > best.len || (n.length === best.len && level < best.level)))
    ) {
      best = { title: section.title, index, len: n.length, level }
    }
  }
  if (best) return `#${slugify(best.title)}`

  // Shared distinctive tokens when uniquely decisive (RFID → RFID Solutions)
  const itemTokens = new Set(tokens.filter((t) => t.length >= 3))
  const scored = ranked
    .map((section) => {
      const sectionTokens = normalizeTitle(section.title)
        .split(' ')
        .filter((t) => t.length >= 3)
      const score = sectionTokens.filter((t) => itemTokens.has(t)).length
      return { section, score, sectionTokenCount: sectionTokens.length }
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      const levelA = a.section.level ?? 3
      const levelB = b.section.level ?? 3
      if (levelA !== levelB) return levelA === 3 ? -1 : 1
      return a.sectionTokenCount - b.sectionTokenCount
    })

  if (scored.length === 1) return `#${slugify(scored[0].section.title)}`
  if (
    scored.length > 1 &&
    scored[0].score > scored[1].score &&
    scored[0].score >= 1
  ) {
    return `#${slugify(scored[0].section.title)}`
  }

  return undefined
}

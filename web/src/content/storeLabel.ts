const SHOP = 'https://www.labtag.com/shop'

export type StoreLabel = {
  title: string
  href: string
  name?: string
  detail?: string
  image?: string
}

function product(slug: string) {
  return `${SHOP}/product/${slug}/`
}

function category(...parts: string[]) {
  return `${SHOP}/category/${parts.join('/')}/`
}

const CRYO_ROLL = 'Cryogenic thermal-transfer labels for frozen vials and tubes'

function preview(
  code: string,
  slug: string,
  detail: string,
  image: string,
  name = CRYO_ROLL,
): StoreLabel {
  return { title: code, href: product(slug), name, detail, image }
}

/** Live shop products for the codes Tagi recommends. Legacy L2FS numbers map to the current L2FX label. */
const PRODUCTS: Record<string, StoreLabel> = {
  'L2FX-401': preview(
    'L2FX-401',
    'cryostuck-cryogenic-thermal-transfer-labels-for-frozen-vials-tubes-1-75-x-0-5-l2fx-401',
    '1.75 in × 0.5 in',
    'https://cdn.labtag.com/wp-content/uploads/L2FX-401C1-1WH-1.jpg',
  ),
  'L2FX-406': preview(
    'L2FX-406',
    'cryostuck-cryogenic-thermal-transfer-labels-for-frozen-vials-tubes-1-x-0-75-l2fx-406not',
    '1 in × 0.75 in',
    'https://cdn.labtag.com/wp-content/uploads/L2FX-406NOTC1-1WH-1.jpg',
  ),
  'L2FX-308': preview(
    'L2FX-308',
    'cryostuck-cryogenic-thermal-transfer-labels-for-frozen-vials-tubes-1-34-x-1-1-38-wrap-l2fx-308not',
    '1.34 in × 1 in, plus 1.38 in wrap',
    'https://cdn.labtag.com/wp-content/uploads/L2FX-308NOTC1-1WH.jpg',
  ),
  'L2FX-312': preview(
    'L2FX-312',
    'cryostuck-cryogenic-thermal-transfer-labels-for-frozen-vials-tubes-1-x-0-625-1-375-wrap-l2fx-312not',
    '1 in × 0.625 in, plus 1.375 in wrap',
    'https://cdn.labtag.com/wp-content/uploads/L2FX-312NOTC1-1WH.jpg',
  ),
  'L2FX-345': preview(
    'L2FX-345',
    'cryostuck-cryogenic-thermal-transfer-labels-for-frozen-vials-tubes-1-25-x-0-75-0-5-wrap-l2fx-345not',
    '1.25 in × 0.75 in, plus 0.5 in wrap',
    'https://cdn.labtag.com/wp-content/uploads/L2FX-345NOTC1-1WH.jpg',
  ),
  'AHA-268': preview(
    'AHA-268',
    'clear-cryogenic-labels-for-frozen-vials-1-75-x-0-75-aha-268',
    '1.75 in × 0.75 in',
    'https://cdn.labtag.com/wp-content/uploads/AHA-268NOTC1-2.png',
  ),
  'AHA-224': preview(
    'AHA-224',
    'clear-cryogenic-labels-for-frozen-vials-1-75-x-1-aha-224',
    '1.75 in × 1 in',
    'https://cdn.labtag.com/wp-content/uploads/AHA-224NOTC1-2-illu.jpg',
  ),
  'TRCL-23': preview(
    'TRCL-23',
    'clear-cryo-laser-labels-1-28-x-0-5-trcl-23',
    '1.28 in × 0.5 in',
    'https://cdn.labtag.com/wp-content/uploads/TRCL-23-illu.png',
    'Transparent removable cryo laser labels',
  ),
}

const ALIAS: Record<string, string> = {
  'L2FS-1': 'L2FX-401',
  'L2FS-6': 'L2FX-406',
  'L2FS-308': 'L2FX-308',
  'L2FS-312': 'L2FX-312',
  'L2FS-345': 'L2FX-345',
}

const CODE = /\b((?:L2FX|L2FS|AHA|TRCL)-\d+)\b/gi

const CONTAINERS: { ask: RegExp; bullet: RegExp }[] = [
  { ask: /matrix|biotube/i, bullet: /matrix|biotube/i },
  { ask: /15\s*ml/i, bullet: /15 ml/i },
  { ask: /50\s*ml/i, bullet: /50 ml/i },
  { ask: /1\.5\s*ml/i, bullet: /1\.5 ml/i },
  { ask: /5(?:\.0)?\s*ml/i, bullet: /5(?:\.0)? ml/i },
  { ask: /2(?:\.0)?\s*ml/i, bullet: /2(?:\.0)? ml/i },
  { ask: /1(?:\.0)?\s*ml/i, bullet: /1(?:\.0)? ml/i },
]

export function storeProduct(code: string): StoreLabel | undefined {
  const key = code.toUpperCase()
  return PRODUCTS[ALIAS[key] ?? key]
}

export function storeCodes(text: string): string[] {
  return [...text.matchAll(CODE)].map((match) => match[1].toUpperCase())
}

function label(title: string, href: string): StoreLabel {
  return { title, href }
}

function family(question: string): StoreLabel | undefined {
  const q = question.toLowerCase()
  const cryo = /cryo|liquid nitrogen|−196|-196|\bln2\b/.test(q)
  const frozen = /cryostuck|frozen surface|sticks to frozen|frozen vial/.test(q)
  const dymo = /\bdymo\b/.test(q)

  if (dymo && frozen) {
    return label(
      'DYMO CryoSTUCK labels',
      category('labels', 'cryogenic-labels', 'dymo-compatible-labels-for-frozen-surfaces'),
    )
  }
  if (dymo && cryo) {
    return label(
      'DYMO cryogenic labels',
      category('labels', 'cryogenic-labels', 'dymo-compatible-cryogenic-labels'),
    )
  }
  if (/labelwriter\s*550|dymo\s*550/.test(q)) {
    return label('DYMO 550 labels', category('labels', 'labels-for-dymo-labelwriter-550'))
  }
  if (/labelwriter\s*450|dymo\s*450/.test(q)) {
    return label('DYMO 450 labels', category('labels', 'dymo-labelwriter-450-compatible-labels'))
  }
  if (dymo && /label/.test(q)) {
    return label('DYMO labels', category('labels', 'dymo-labelwriter-450-compatible-labels'))
  }
  if (frozen) {
    return label(
      'CryoSTUCK labels',
      category('labels', 'cryogenic-labels', 'cryogenic-thermal-transfer-labels-for-frozen-surfaces'),
    )
  }
  if (/autoclave/.test(q)) return label('Autoclave labels', category('labels', 'autoclave-resistant-labels'))
  if (/xylene|chemical[- ]resistant|resitag/.test(q)) {
    return label('Chemical-resistant labels', category('labels', 'chemical-resistant-labels'))
  }
  if (/microscope slide|histolog/.test(q)) {
    return label('Microscope slide labels', category('labels', 'microscope-slide-labels'))
  }
  if (/heat[- ]resistant/.test(q)) return label('Heat-resistant labels', category('labels', 'heat-resistant-labels'))
  if (/\brfid\b/.test(q)) return label('RFID labels', category('labels', 'rfid-labels'))
  if (/snappeel/.test(q)) return label('SnapPEEL labels', category('labels', 'snappeel-labels'))
  if (/pcr/.test(q) && cryo) {
    return label('Cryogenic PCR labels', category('labels', 'cryogenic-labels', 'cryogenic-labels-for-pcr-tubes'))
  }
  if (/pcr/.test(q) && /label|tube/.test(q)) return label('PCR labels', category('labels', 'labels-for-pcr'))
  if (/deep[- ]?freeze|−80|-80/.test(q)) return label('Deep-freeze labels', category('labels', 'deep-freeze-labels'))
  if (cryo) return label('Cryogenic labels', category('labels', 'cryogenic-labels'))
  if (/\btapes?\b/.test(q)) return label('Lab tapes', category('tapes'))
  return undefined
}

function productFromContainer(question: string, answer: string): StoreLabel | undefined {
  const rule = CONTAINERS.find((item) => item.ask.test(question))
  if (!rule) return undefined
  const bullet = answer.split('\n').find((line) => rule.bullet.test(line))
  if (!bullet) return undefined
  const matches = storeCodes(bullet)
    .map((code) => storeProduct(code))
    .filter((item): item is StoreLabel => Boolean(item))
  return matches.length === 1 ? matches[0] : undefined
}

export function asksForContainer(question: string) {
  return CONTAINERS.some((item) => item.ask.test(question))
}

function matchingBullet(question: string, answer: string) {
  const rule = CONTAINERS.find((item) => item.ask.test(question))
  if (!rule) return undefined
  return answer.split('\n').find((line) => line.startsWith('• ') && rule.bullet.test(line))
}

function listNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]} or ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, or ${names[names.length - 1]}`
}

/** A short recommendation when the question names a tube size we can match. */
export function directFitAnswer(question: string, answer: string) {
  const bullet = matchingBullet(question, answer)
  if (!bullet) return undefined
  const products = storeCodes(bullet)
    .map((code) => storeProduct(code))
    .filter((item): item is StoreLabel => Boolean(item))
  if (products.length === 0) return undefined
  const [, rest = ''] = bullet.replace(/^•\s*/, '').split(':')
  const size = rest
    .replace(/\b(?:L2FX|L2FS|AHA|TRCL)-\d+\b/gi, '')
    .replace(/\bor\b/gi, '')
    .replace(/[,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const container = bullet.replace(/^•\s*/, '').split(':')[0].trim()
  const fit = size ? ` (${size})` : ''
  return `Use ${listNames(products.map((item) => item.title))} for ${container}${fit}. Leave at least 0.25 in of overlap, and do not let the printable area overlap itself.`
}

/** Keep the tube size the person asked about when an answer lists several. */
export function focusContainer(answer: string, question: string) {
  const rule = CONTAINERS.find((item) => item.ask.test(question))
  if (!rule) return answer
  return answer
    .split(/\n\n+/)
    .map((part) => {
      const lines = part.split('\n')
      const bullets = lines.filter((line) => line.startsWith('• '))
      if (bullets.length < 2) return part
      const kept = bullets.filter((line) => rule.bullet.test(line))
      if (kept.length === 0) return part
      return [...lines.filter((line) => !line.startsWith('• ')), ...kept].join('\n')
    })
    .join('\n\n')
}

/** The store page for a product question: one label when the fit is known, otherwise the matching category. */
export function findStoreLabel(question: string, answer = ''): StoreLabel | undefined {
  const asked = storeCodes(question)
    .map((code) => storeProduct(code))
    .filter((item): item is StoreLabel => Boolean(item))
  if (asked.length === 1) return asked[0]
  return productFromContainer(question, answer) ?? family(question)
}

/** Product cards for labels named in the answer. Category links stay as text. */
export function recommendedProducts(answer: string, store?: StoreLabel): StoreLabel[] {
  const named = storeCodes(withoutShopLine(answer))
    .map((code) => storeProduct(code))
    .filter((item): item is StoreLabel => Boolean(item?.image))
  const unique = [...new Map(named.map((item) => [item.href, item])).values()]
  if (unique.length > 0) return unique
  return store?.image ? [store] : []
}

export function shopLine(store: StoreLabel) {
  return `Shop ${store.title}: ${store.href}`
}

export function withoutShopLine(answer: string) {
  return answer
    .split(/\n\n+/)
    .filter((part) => !/^Shop [^:]+: https:\/\/www\.labtag\.com\/\S+$/.test(part.trim()))
    .join('\n\n')
}

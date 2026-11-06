const SHOP = 'https://www.labtag.com/shop'

export type StoreLabel = {
  title: string
  href: string
}

function product(slug: string) {
  return `${SHOP}/product/${slug}/`
}

function category(...parts: string[]) {
  return `${SHOP}/category/${parts.join('/')}/`
}

/** Live shop products for the codes Tagi recommends. Legacy L2FS numbers map to the current L2FX label. */
const PRODUCTS: Record<string, StoreLabel> = {
  'L2FX-401': {
    title: 'L2FX-401',
    href: product('cryostuck-cryogenic-thermal-transfer-labels-for-frozen-vials-tubes-1-75-x-0-5-l2fx-401'),
  },
  'L2FX-406': {
    title: 'L2FX-406',
    href: product('cryostuck-cryogenic-thermal-transfer-labels-for-frozen-vials-tubes-1-x-0-75-l2fx-406not'),
  },
  'L2FX-308': {
    title: 'L2FX-308',
    href: product('cryostuck-cryogenic-thermal-transfer-labels-for-frozen-vials-tubes-1-34-x-1-1-38-wrap-l2fx-308not'),
  },
  'L2FX-312': {
    title: 'L2FX-312',
    href: product('cryostuck-cryogenic-thermal-transfer-labels-for-frozen-vials-tubes-1-x-0-625-1-375-wrap-l2fx-312not'),
  },
  'L2FX-345': {
    title: 'L2FX-345',
    href: product('cryostuck-cryogenic-thermal-transfer-labels-for-frozen-vials-tubes-1-25-x-0-75-0-5-wrap-l2fx-345not'),
  },
  'AHA-268': {
    title: 'AHA-268',
    href: product('clear-cryogenic-labels-for-frozen-vials-1-75-x-0-75-aha-268'),
  },
  'AHA-224': {
    title: 'AHA-224',
    href: product('clear-cryogenic-labels-for-frozen-vials-1-75-x-1-aha-224'),
  },
  'TRCL-23': {
    title: 'TRCL-23',
    href: product('clear-cryo-laser-labels-1-28-x-0-5-trcl-23'),
  },
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

export function shopLine(store: StoreLabel) {
  return `Shop ${store.title}: ${store.href}`
}

export function withoutShopLine(answer: string) {
  return answer
    .split(/\n\n+/)
    .filter((part) => !/^Shop [^:]+: https:\/\/www\.labtag\.com\/\S+$/.test(part.trim()))
    .join('\n\n')
}

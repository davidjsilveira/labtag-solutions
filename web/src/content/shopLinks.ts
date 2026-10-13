/** Match LabTAG product class codes: FJT, JTTA, LWCS-Class, LCS (including frozen vials) */
const PRODUCT_CLASS = /^([A-Z]{2,}[A-Z0-9-]*)(?:-Class)?(?:\s*\([^)]*\))?$/i
const MARKDOWN_LINK = /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/i

export type BulletShopItem = {
  label: string
  href?: string
}

export function extractProductClass(text: string): string | undefined {
  const match = text.trim().match(PRODUCT_CLASS)
  return match?.[1]?.toUpperCase()
}

export function shopUrlForClass(code: string): string {
  return `https://www.labtag.com/label_class/${code.toLowerCase()}/`
}

export function shopSearchUrl(query: string): string {
  return `https://www.labtag.com/?s=${encodeURIComponent(query)}`
}

export function resolveBulletItem(raw: string): BulletShopItem {
  const trimmed = raw.trim()
  const linked = trimmed.match(MARKDOWN_LINK)
  if (linked) {
    return { label: linked[1].trim(), href: linked[2] }
  }

  const code = extractProductClass(trimmed)
  if (code) {
    return { label: trimmed, href: shopUrlForClass(code) }
  }

  // Short chip-style items → LabTAG site search (shop-relevant browse)
  if (trimmed.length <= 42 && !/[.!?]/.test(trimmed)) {
    return { label: trimmed, href: shopSearchUrl(trimmed) }
  }

  return { label: trimmed }
}
